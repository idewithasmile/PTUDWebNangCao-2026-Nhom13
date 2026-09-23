using System.Linq.Expressions;
using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

public class BaseRepository<T>(CulinaryBlogDbContext dbContext) : IRepository<T> where T : BaseEntity
{
    protected readonly CulinaryBlogDbContext Context = dbContext;
    protected readonly DbSet<T> DbSet = dbContext.Set<T>();

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await DbSet.FirstOrDefaultAsync(e => e.Id == id, ct);

    public virtual async Task<IReadOnlyList<T>> ListAllAsync(CancellationToken ct = default) =>
        await DbSet.ToListAsync(ct);

    public virtual async Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await DbSet.Where(predicate).ToListAsync(ct);

    public virtual async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await DbSet.AddAsync(entity, ct);
        return entity;
    }

    public virtual void Update(T entity) => DbSet.Update(entity);

    public virtual void SoftDelete(T entity)
    {
        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        DbSet.Update(entity);
    }
}
