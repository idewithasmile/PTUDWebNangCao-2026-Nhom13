using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Infrastructure.Data;

namespace CulinaryBlog.Infrastructure.Repositories;

/// <summary>
/// Hiện thực Unit of Work bọc lấy tiến trình lưu thay đổi của CulinaryBlogDbContext.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly CulinaryBlogDbContext _dbContext;

    public UnitOfWork(CulinaryBlogDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return await _dbContext.SaveChangesAsync(ct);
    }
}
