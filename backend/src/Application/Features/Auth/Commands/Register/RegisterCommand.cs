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

namespace CulinaryBlog.Application.Features.Auth.Commands.Register;

// FR-AUTH-001: POST /api/v1/auth/register
// Body SRS: { email, password, userName, displayName } (displayName chuẩn hóa từ fullName — SPEC Mâu thuẫn 5).
public sealed record RegisterCommand(
    string Email,
    string Password,
    string UserName,
    string DisplayName,
    string? CreatedByIp = null) : IRequest<AuthResultDto>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().PasswordComplexity();
        RuleFor(x => x.UserName)
            .NotEmpty().MinimumLength(3).MaximumLength(256)
            .Matches("^[a-zA-Z0-9_.-]+$")
            .WithMessage("UserName must not contain special characters (only letters, digits, '_', '.', '-').");
        RuleFor(x => x.DisplayName).NotEmpty().Length(2, 100);
    }
}

public sealed class RegisterCommandHandler(
    UserManager<ApplicationUser> users,
    RoleManager<IdentityRole> roles,
    IJwtService jwt,
    IRefreshTokenStore refreshTokens,
    IWelcomeEmailDispatcher welcomeEmail,
    ILogger<RegisterCommandHandler> logger) : IRequestHandler<RegisterCommand, AuthResultDto>
{
    public const string DefaultRole = "Author";

    public async Task<AuthResultDto> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim();
        var userName = request.UserName.Trim();

        if (await users.FindByEmailAsync(email) is not null)
            throw new AppEx.ConflictException(AuthErrors.EmailExists, "Email is already registered.");

        if (await users.FindByNameAsync(userName) is not null)
            throw new AppEx.ConflictException(AuthErrors.UsernameExists, "UserName is already taken.");

        var user = new ApplicationUser
        {
            UserName = userName,
            Email = email,
            DisplayName = request.DisplayName.Trim(),
            IsActive = true,
            LockoutEnabled = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await users.CreateAsync(user, request.Password);
        if (!created.Succeeded)
            throw new AppEx.ValidationException(ToErrors(created));

        if (!await roles.RoleExistsAsync(DefaultRole))
            await roles.CreateAsync(new IdentityRole(DefaultRole));
        await users.AddToRoleAsync(user, DefaultRole);

        var userRoles = await users.GetRolesAsync(user);
        var accessToken = jwt.GenerateAccessToken(user, userRoles);

        var rawRefresh = jwt.GenerateRefreshToken();
        await refreshTokens.AddAsync(new RefreshTokenEntity
        {
            UserId = user.Id,
            TokenHash = jwt.HashToken(rawRefresh),
            ExpiresAt = DateTime.UtcNow.AddDays(7), // CONS-004
            CreatedByIp = request.CreatedByIp
        }, ct);

        // FR-JOB-001: best-effort, không fail đăng ký khi job lỗi.
        try { await welcomeEmail.DispatchAsync(user.Email!, user.DisplayName, ct); }
        catch (Exception ex) { logger.LogWarning(ex, "WelcomeEmail dispatch failed for {Email}", email); }

        return new AuthResultDto(accessToken, rawRefresh,
            DateTime.UtcNow.AddDays(7), AuthMapping.ToProfileDto(user, userRoles));
    }

    private static IDictionary<string, string[]> ToErrors(IdentityResult result) =>
        result.Errors
            .GroupBy(e => e.Code, e => e.Description)
            .ToDictionary(g => g.Key, g => g.ToArray());
}
