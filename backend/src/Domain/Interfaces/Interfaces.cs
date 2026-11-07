global using CulinaryBlog.Domain.Common.Interfaces;
global using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Domain.Interfaces;

public interface ICurrentUser
{
    string? UserId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
}

public interface ICacheable
{
    string CacheKey { get; }
    TimeSpan? Expiration { get; }
}

public interface ICacheInvalidator
{
    IReadOnlyList<string> CacheKeysToInvalidate { get; }
}

public interface IJwtService
{
    string GenerateAccessToken(Entities.ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
    string HashToken(string rawToken);
}
