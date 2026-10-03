using System.Linq.Expressions;
using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

/// <summary>
/// Lớp cơ sở trừu tượng cho Repository, áp dụng filter !IsDeleted mặc định.
/// </summary>
public class BaseRepository<T>(CulinaryBlogDbContext dbContext) : IRepository<T> where T : BaseEntity
{
    protected readonly CulinaryBlogDbContext Context = dbContext;
    protected readonly DbSet<T> DbSet = dbContext.Set<T>();

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await DbSet.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted, ct);

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default) =>
        await DbSet.Where(e => !e.IsDeleted).ToListAsync(ct);

    public virtual async Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default) =>
        await GetAllAsync(ct);

    public virtual async Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await DbSet.Where(e => !e.IsDeleted).Where(predicate).ToListAsync(ct);

    public virtual async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await DbSet.AddAsync(entity, ct);
        return entity;
    }

    public virtual void Update(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        DbSet.Update(entity);
    }

    public virtual void Delete(T entity)
    {
        SoftDelete(entity);
    }

    public virtual void SoftDelete(T entity)
    {
        entity.SoftDelete();
        DbSet.Update(entity);
    }

    public virtual void SetOriginalRowVersion(T entity, byte[] rowVersion)
    {
        Context.Entry(entity).Property(e => e.RowVersion).OriginalValue = rowVersion;
    }
}
