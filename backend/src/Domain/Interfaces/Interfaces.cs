using System.Linq.Expressions;
using CulinaryBlog.Domain.Common;

namespace CulinaryBlog.Domain.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void SoftDelete(T entity); // Thay thế hoàn toàn Hard Delete theo SPEC.md
}

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface ICurrentUser
{
    string? UserId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
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
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default);
    Task DeleteAsync(string fileUrl, CancellationToken ct = default);
}
