using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

public class RecipeBookmarkRepository(CulinaryBlogDbContext dbContext) 
    : BaseRepository<RecipeBookmark>(dbContext), IRecipeBookmarkRepository
{
    public Task<RecipeBookmark?> GetByUserAndRecipeAsync(string userId, Guid recipeId, CancellationToken ct = default)
    {
        return Context.RecipeBookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.RecipeId == recipeId && !b.IsDeleted, ct);
    }

    public IQueryable<RecipeBookmark> GetQueryable()
    {
        return Context.RecipeBookmarks.AsQueryable();
    }
}
