using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>Persist RefreshToken qua EF Core (parameterized LINQ — CONS-006, không raw SQL).</summary>
public sealed class AuthRefreshTokenStore(CulinaryBlogDbContext db) : IRefreshTokenStore
{
    public Task<RefreshToken?> FindByHashAsync(string tokenHash, CancellationToken ct = default) =>
        db.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, ct);

    public async Task AddAsync(RefreshToken token, CancellationToken ct = default)
    {
        await db.RefreshTokens.AddAsync(token, ct);
        await db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(RefreshToken token, CancellationToken ct = default)
    {
        db.RefreshTokens.Update(token);
        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<RefreshToken>> ListActiveByUserAsync(string userId, CancellationToken ct = default) =>
        await db.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null && rt.ExpiresAt > DateTime.UtcNow)
            .ToListAsync(ct);

    public async Task RevokeAllActiveByUserAsync(string userId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var active = await db.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null && rt.ExpiresAt > now)
            .ToListAsync(ct);
        foreach (var rt in active) rt.RevokedAt = now;
        if (active.Count > 0) await db.SaveChangesAsync(ct);
    }
}
