using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;

namespace CulinaryBlog.Infrastructure.Repositories;

public class UnitOfWork(CulinaryBlogDbContext dbContext, IRecipeRepository recipes) : IUnitOfWork
{
    public IRecipeRepository Recipes { get; } = recipes;

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return dbContext.SaveChangesAsync(ct);
    }
}
