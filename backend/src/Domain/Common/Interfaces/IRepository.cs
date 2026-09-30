using System.Linq.Expressions;
using CulinaryBlog.Domain.Common;

namespace CulinaryBlog.Domain.Common.Interfaces;

/// <summary>
/// Hợp đồng Repository tổng quát cho các thực thể kế thừa BaseEntity.
/// Định nghĩa các phương thức thao tác CRUD cơ bản và Soft Delete.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Delete(T entity);
    void SoftDelete(T entity);
}
