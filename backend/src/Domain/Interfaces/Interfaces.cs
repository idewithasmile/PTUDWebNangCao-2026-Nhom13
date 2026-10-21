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

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default);
    Task DeleteAsync(string fileUrl, CancellationToken ct = default);
    Task<Stream> GetStreamAsync(string fileUrl, CancellationToken ct = default);
}
