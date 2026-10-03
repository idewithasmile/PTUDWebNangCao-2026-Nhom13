using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace CulinaryBlog.Application.Features.Auth.Commands.Logout;

// FR-AUTH-005: POST /api/v1/auth/logout — Require Auth. Thu hồi refresh (RevokedAt=UtcNow),
// idempotent (token không thấy vẫn thành công → 204).
public sealed record LogoutCommand(string UserId, string? RefreshToken = null) : IRequest;

public sealed class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    public LogoutCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public sealed class LogoutCommandHandler(
    IJwtService jwt,
    IRefreshTokenStore store) : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) return;

        var stored = await store.FindByHashAsync(jwt.HashToken(request.RefreshToken), ct);
        if (stored is null || stored.RevokedAt is not null) return; // idempotent

        stored.RevokedAt = DateTime.UtcNow;
        await store.UpdateAsync(stored, ct);
    }
}
