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

namespace CulinaryBlog.Application.Features.Auth.Commands.RefreshToken;

// FR-AUTH-004: POST /api/v1/auth/refresh — refresh token đọc từ HttpOnly Cookie (endpoint trích).
// Token Rotation: revoke cũ, cấp cặp mới. Reuse token đã revoke → revoke cả token family (401 REVOKED).
public sealed record RefreshTokenCommand(string RefreshToken, string? CreatedByIp = null)
    : IRequest<AuthResultDto>;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}

public sealed class RefreshTokenCommandHandler(
    UserManager<ApplicationUser> users,
    IJwtService jwt,
    IRefreshTokenStore store) : IRequestHandler<RefreshTokenCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var hash = jwt.HashToken(request.RefreshToken);
        var stored = await store.FindByHashAsync(hash, ct);

        if (stored is null || stored.ExpiresAt <= DateTime.UtcNow)
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenExpired, "Refresh token is expired or does not exist.", 401);

        if (stored.RevokedAt is not null)
        {
            // Reuse Detection: token đã rotate mà bị dùng lại → thu hồi cả family.
            await store.RevokeAllActiveByUserAsync(stored.UserId, ct);
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenRevoked, "Refresh token has been revoked.", 401);
        }

        var user = await users.FindByIdAsync(stored.UserId);
        if (user is null)
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenExpired, "Refresh token is expired or does not exist.", 401);
        if (!user.IsActive)
            throw new AppEx.AppException(
                AuthErrors.AccountDisabled, "Account has been disabled.", 403);

        // Rotation
        var rawNew = jwt.GenerateRefreshToken();
        var newHash = jwt.HashToken(rawNew);
        stored.RevokedAt = DateTime.UtcNow;
        stored.ReplacedByTokenHash = newHash;
        await store.UpdateAsync(stored, ct);

        var expiresAt = DateTime.UtcNow.AddDays(7);
        await store.AddAsync(new RefreshTokenEntity
        {
            UserId = user.Id,
            TokenHash = newHash,
            ExpiresAt = expiresAt,
            CreatedByIp = request.CreatedByIp
        }, ct);

        var userRoles = await users.GetRolesAsync(user);
        var accessToken = jwt.GenerateAccessToken(user, userRoles);

        return new AuthResultDto(accessToken, rawNew, expiresAt,
            AuthMapping.ToProfileDto(user, userRoles));
    }
}
