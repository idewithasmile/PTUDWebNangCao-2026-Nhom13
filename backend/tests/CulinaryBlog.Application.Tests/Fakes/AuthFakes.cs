using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace CulinaryBlog.Application.Tests.Fakes;

// In-memory IUserStore để test handler mà không cần DB (FR-AUTH unit tests).
public sealed class FakeUserStore : IUserStore<ApplicationUser>,
    IUserEmailStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>, IUserRoleStore<ApplicationUser>
{
    public readonly Dictionary<string, ApplicationUser> ById = new();
    public readonly Dictionary<string, List<string>> RolesByUserId = new();

    public Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(user.Id)) user.Id = Guid.NewGuid().ToString();
        ById[user.Id] = user;
        RolesByUserId.TryAdd(user.Id, new List<string>());
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken ct = default)
    {
        ById[user.Id] = user;
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken ct = default)
    {
        ById.Remove(user.Id);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<ApplicationUser?> FindByIdAsync(string userId, CancellationToken ct = default)
    {
        ById.TryGetValue(userId, out var u);
        return Task.FromResult(u);
    }

    public Task<ApplicationUser?> FindByNameAsync(string normalizedUserName, CancellationToken ct = default) =>
        Task.FromResult(ById.Values.FirstOrDefault(u => u.NormalizedUserName == normalizedUserName));

    public Task<ApplicationUser?> FindByEmailAsync(string normalizedEmail, CancellationToken ct = default) =>
        Task.FromResult(ById.Values.FirstOrDefault(u => u.NormalizedEmail == normalizedEmail));

    public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.Id);
    public Task<string?> GetUserNameAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.UserName);
    public Task SetUserNameAsync(ApplicationUser user, string? name, CancellationToken ct = default) { user.UserName = name; return Task.CompletedTask; }
    public Task<string?> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.NormalizedUserName);
    public Task SetNormalizedUserNameAsync(ApplicationUser user, string? name, CancellationToken ct = default) { user.NormalizedUserName = name; return Task.CompletedTask; }
    public Task<string?> GetEmailAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.Email);
    public Task SetEmailAsync(ApplicationUser user, string? email, CancellationToken ct = default) { user.Email = email; return Task.CompletedTask; }
    public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.EmailConfirmed);
    public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken ct = default) { user.EmailConfirmed = confirmed; return Task.CompletedTask; }
    public Task<string?> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.NormalizedEmail);
    public Task SetNormalizedEmailAsync(ApplicationUser user, string? email, CancellationToken ct = default) { user.NormalizedEmail = email; return Task.CompletedTask; }
    public Task<string?> GetPasswordHashAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.PasswordHash);
    public Task SetPasswordHashAsync(ApplicationUser user, string? hash, CancellationToken ct = default) { user.PasswordHash = hash; return Task.CompletedTask; }
    public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken ct = default) => Task.FromResult(user.PasswordHash is not null);

    public Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken ct = default)
    {
        var list = RolesByUserId.GetValueOrDefault(user.Id) ?? (RolesByUserId[user.Id] = new List<string>());
        if (!list.Contains(roleName, StringComparer.OrdinalIgnoreCase)) list.Add(roleName);
        return Task.CompletedTask;
    }

    public Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken ct = default)
    {
        if (RolesByUserId.TryGetValue(user.Id, out var list))
            list.RemoveAll(r => string.Equals(r, roleName, StringComparison.OrdinalIgnoreCase));
        return Task.CompletedTask;
    }

    public Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken ct = default) =>
        Task.FromResult<IList<string>>(RolesByUserId.GetValueOrDefault(user.Id)?.ToList() ?? new List<string>());

    public Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken ct = default) =>
        Task.FromResult(RolesByUserId.GetValueOrDefault(user.Id)?.Contains(roleName, StringComparer.OrdinalIgnoreCase) ?? false);

    public Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken ct = default) =>
        Task.FromResult<IList<ApplicationUser>>(ById.Values
            .Where(u => RolesByUserId.GetValueOrDefault(u.Id)?.Contains(roleName, StringComparer.OrdinalIgnoreCase) ?? false)
            .ToList());

    public void Dispose() { }
}

public sealed class FakeRoleStore : IRoleStore<IdentityRole>
{
    public readonly Dictionary<string, IdentityRole> ById = new();

    public Task<IdentityResult> CreateAsync(IdentityRole role, CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(role.Id)) role.Id = Guid.NewGuid().ToString();
        ById[role.Id] = role;
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> UpdateAsync(IdentityRole role, CancellationToken ct = default)
    {
        ById[role.Id] = role;
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> DeleteAsync(IdentityRole role, CancellationToken ct = default)
    {
        ById.Remove(role.Id);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityRole?> FindByIdAsync(string roleId, CancellationToken ct = default)
    {
        ById.TryGetValue(roleId, out var r);
        return Task.FromResult(r);
    }

    public Task<IdentityRole?> FindByNameAsync(string normalizedRoleName, CancellationToken ct = default) =>
        Task.FromResult(ById.Values.FirstOrDefault(r => r.NormalizedName == normalizedRoleName));

    public Task<string> GetRoleIdAsync(IdentityRole role, CancellationToken ct = default) => Task.FromResult(role.Id);
    public Task<string?> GetRoleNameAsync(IdentityRole role, CancellationToken ct = default) => Task.FromResult(role.Name);
    public Task SetRoleNameAsync(IdentityRole role, string? name, CancellationToken ct = default) { role.Name = name; return Task.CompletedTask; }
    public Task<string?> GetNormalizedRoleNameAsync(IdentityRole role, CancellationToken ct = default) => Task.FromResult(role.NormalizedName);
    public Task SetNormalizedRoleNameAsync(IdentityRole role, string? name, CancellationToken ct = default) { role.NormalizedName = name; return Task.CompletedTask; }
    public void Dispose() { }
}

public sealed class FakeJwtService : IJwtService
{
    public string GenerateAccessToken(ApplicationUser user, IList<string> roles) => $"access-{user.Id}";
    public string GenerateRefreshToken() => $"raw-{Guid.NewGuid():N}";
    public string HashToken(string rawToken) => "HASH:" + rawToken;
}

public sealed class FakeRefreshTokenStore : IRefreshTokenStore
{
    public readonly Dictionary<string, RefreshToken> ByHash = new();

    public Task<RefreshToken?> FindByHashAsync(string tokenHash, CancellationToken ct = default)
    {
        ByHash.TryGetValue(tokenHash, out var t);
        return Task.FromResult(t);
    }

    public Task AddAsync(RefreshToken token, CancellationToken ct = default)
    {
        ByHash[token.TokenHash] = token;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(RefreshToken token, CancellationToken ct = default)
    {
        ByHash[token.TokenHash] = token;
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<RefreshToken>> ListActiveByUserAsync(string userId, CancellationToken ct = default) =>
        Task.FromResult<IReadOnlyList<RefreshToken>>(ByHash.Values
            .Where(t => t.UserId == userId && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow).ToList());

    public Task RevokeAllActiveByUserAsync(string userId, CancellationToken ct = default)
    {
        foreach (var t in ByHash.Values.Where(t => t.UserId == userId && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow))
            t.RevokedAt = DateTime.UtcNow;
        return Task.CompletedTask;
    }
}

public sealed class FakeGoogleValidator(GoogleUserInfo? result) : IGoogleTokenValidator
{
    public Task<GoogleUserInfo?> ValidateAsync(string idToken, CancellationToken ct = default) =>
        Task.FromResult(result);
}

public sealed class FakeWelcomeEmailDispatcher : IWelcomeEmailDispatcher
{
    public readonly List<(string Email, string DisplayName)> Sent = new();
    public Task DispatchAsync(string email, string displayName, CancellationToken ct = default)
    {
        Sent.Add((email, displayName));
        return Task.CompletedTask;
    }
}

public static class IdentityTestFactory
{
    public static (UserManager<ApplicationUser> Users, FakeUserStore Store) CreateUserManager()
    {
        var store = new FakeUserStore();
        var services = new ServiceCollection().AddLogging().BuildServiceProvider();
        var users = new UserManager<ApplicationUser>(
            store,
            Options.Create(new IdentityOptions()),
            new PasswordHasher<ApplicationUser>(),
            [], // user validators: bỏ qua để isolate logic handler
            [], // password validators: rule đã cover bởi FluentValidation
            new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            services,
            services.GetRequiredService<ILogger<UserManager<ApplicationUser>>>());
        return (users, store);
    }

    public static (RoleManager<IdentityRole> Roles, FakeRoleStore Store) CreateRoleManager()
    {
        var store = new FakeRoleStore();
        var services = new ServiceCollection().AddLogging().BuildServiceProvider();
        var roles = new RoleManager<IdentityRole>(
            store, [], new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            services.GetRequiredService<ILogger<RoleManager<IdentityRole>>>());
        return (roles, store);
    }

    public static ILogger<T> CreateNullLogger<T>() =>
        Microsoft.Extensions.Logging.Abstractions.NullLogger<T>.Instance;
}
