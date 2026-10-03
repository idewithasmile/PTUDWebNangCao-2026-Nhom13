using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Dtos;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using AppEx = CulinaryBlog.Application.Common.Exceptions;
using RefreshTokenEntity = CulinaryBlog.Domain.Entities.RefreshToken;

namespace CulinaryBlog.Application.Features.Auth.Commands.Login;

// FR-AUTH-002: POST /api/v1/auth/login — Body { email, password }.
// Sai 5 lần → lockout 15 phút (HTTP 423). Tài khoản bị ban → 403 AUTH_ACCOUNT_DISABLED.
public sealed record LoginCommand(string Email, string Password, string? CreatedByIp = null)
    : IRequest<AuthResultDto>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty();
    }
}

public sealed class LoginCommandHandler(
    UserManager<ApplicationUser> users,
    IJwtService jwt,
    IRefreshTokenStore refreshTokens) : IRequestHandler<LoginCommand, AuthResultDto>
{
    public const int MaxFailedAttempts = 5;
    public static readonly TimeSpan LockoutSpan = TimeSpan.FromMinutes(15);

    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await users.FindByEmailAsync(request.Email.Trim());
        if (user is null)
            throw new AppEx.AppException(
                AuthErrors.InvalidCredentials, "Invalid email or password.", 401);

        if (!user.IsActive)
            throw new AppEx.AppException(
                AuthErrors.AccountDisabled, "Account has been disabled.", 403);

        if (user.LockoutEnd is not null && user.LockoutEnd > DateTimeOffset.UtcNow)
            throw new AppEx.AppException(
                AuthErrors.AccountLocked, "Account is temporarily locked due to too many failed login attempts.", 423);

        if (!await users.CheckPasswordAsync(user, request.Password))
        {
            user.AccessFailedCount++;
            if (user.AccessFailedCount >= MaxFailedAttempts)
            {
                user.LockoutEnd = DateTimeOffset.UtcNow.Add(LockoutSpan);
                await users.UpdateAsync(user);
                throw new AppEx.AppException(
                    AuthErrors.AccountLocked, "Account is temporarily locked due to too many failed login attempts.", 423);
            }

            await users.UpdateAsync(user);
            throw new AppEx.AppException(
                AuthErrors.InvalidCredentials, "Invalid email or password.", 401);
        }

        // Đăng nhập thành công: reset failed count + lockout.
        if (user.AccessFailedCount != 0 || user.LockoutEnd is not null)
        {
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            await users.UpdateAsync(user);
        }

        var userRoles = await users.GetRolesAsync(user);
        var accessToken = jwt.GenerateAccessToken(user, userRoles);

        var rawRefresh = jwt.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddDays(7); // CONS-004
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
}
