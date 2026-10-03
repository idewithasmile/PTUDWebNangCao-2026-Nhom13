using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Dtos;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using AppEx = CulinaryBlog.Application.Common.Exceptions;
using RefreshTokenEntity = CulinaryBlog.Domain.Entities.RefreshToken;

namespace CulinaryBlog.Application.Features.Auth.Commands.GoogleLogin;

// FR-AUTH-003: POST /api/v1/auth/google — Body { idToken }.
// User mới → tạo role "Author" (displayName/avatarUrl từ Google). Email đã có → login.
public sealed record GoogleLoginCommand(string IdToken, string? CreatedByIp = null)
    : IRequest<AuthResultDto>;

public sealed class GoogleLoginCommandValidator : AbstractValidator<GoogleLoginCommand>
{
    public GoogleLoginCommandValidator()
    {
        RuleFor(x => x.IdToken).NotEmpty();
    }
}

public sealed class GoogleLoginCommandHandler(
    UserManager<ApplicationUser> users,
    RoleManager<IdentityRole> roles,
    IJwtService jwt,
    IRefreshTokenStore refreshTokens,
    IGoogleTokenValidator google,
    IWelcomeEmailDispatcher welcomeEmail,
    ILogger<GoogleLoginCommandHandler> logger) : IRequestHandler<GoogleLoginCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(GoogleLoginCommand request, CancellationToken ct)
    {
        var info = await google.ValidateAsync(request.IdToken, ct);
        if (info is null || string.IsNullOrWhiteSpace(info.Email))
            throw new AppEx.AppException(
                AuthErrors.GoogleTokenInvalid, "Google token is invalid or expired.", 400);

        var user = await users.FindByEmailAsync(info.Email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                UserName = await DeriveUniqueUserNameAsync(info.Email),
                Email = info.Email,
                EmailConfirmed = true,
                DisplayName = string.IsNullOrWhiteSpace(info.DisplayName)
                    ? info.Email.Split('@')[0] : info.DisplayName.Trim(),
                AvatarUrl = info.AvatarUrl,
                IsActive = true,
                LockoutEnabled = true,
                CreatedAt = DateTime.UtcNow
            };

            var created = await users.CreateAsync(user);
            if (!created.Succeeded)
                throw new AppEx.ValidationException(
                    created.Errors.GroupBy(e => e.Code, e => e.Description)
                        .ToDictionary(g => g.Key, g => g.ToArray()));

            if (!await roles.RoleExistsAsync(Register.RegisterCommandHandler.DefaultRole))
                await roles.CreateAsync(new IdentityRole(Register.RegisterCommandHandler.DefaultRole));
            await users.AddToRoleAsync(user, Register.RegisterCommandHandler.DefaultRole);

            try { await welcomeEmail.DispatchAsync(user.Email!, user.DisplayName, ct); }
            catch (Exception ex) { logger.LogWarning(ex, "WelcomeEmail dispatch failed for {Email}", user.Email); }
        }
        else
        {
            // Email đã có (link login provider): áp dụng cùng guard như login thường.
            if (!user.IsActive)
                throw new AppEx.AppException(
                    AuthErrors.AccountDisabled, "Account has been disabled.", 403);
            if (user.LockoutEnd is not null && user.LockoutEnd > DateTimeOffset.UtcNow)
                throw new AppEx.AppException(
                    AuthErrors.AccountLocked, "Account is temporarily locked.", 423);
            if (string.IsNullOrWhiteSpace(user.AvatarUrl) && !string.IsNullOrWhiteSpace(info.AvatarUrl))
            {
                user.AvatarUrl = info.AvatarUrl;
                await users.UpdateAsync(user);
            }
        }

        var userRoles = await users.GetRolesAsync(user);
        var accessToken = jwt.GenerateAccessToken(user, userRoles);

        var rawRefresh = jwt.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddDays(7);
        await refreshTokens.AddAsync(new RefreshTokenEntity
        {
            UserId = user.Id,
            TokenHash = jwt.HashToken(rawRefresh),
            ExpiresAt = expiresAt,
            CreatedByIp = request.CreatedByIp
        }, ct);

        return new AuthResultDto(accessToken, rawRefresh, expiresAt,
            AuthMapping.ToProfileDto(user, userRoles));
    }

    private async Task<string> DeriveUniqueUserNameAsync(string email)
    {
        var baseName = new string(email.Split('@')[0]
            .Select(c => char.IsLetterOrDigit(c) ? c : '_').ToArray());
        if (baseName.Length < 3) baseName += "_user";

        var candidate = baseName;
        var suffix = 0;
        while (await users.FindByNameAsync(candidate) is not null)
            candidate = $"{baseName}_{++suffix}";

        return candidate;
    }
}
