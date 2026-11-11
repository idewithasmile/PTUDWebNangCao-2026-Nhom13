using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Domain.Interfaces;

public interface IRecipeBookmarkRepository : IRepository<RecipeBookmark>
{
    Task<RecipeBookmark?> GetByUserAndRecipeAsync(string userId, Guid recipeId, CancellationToken ct = default);
    IQueryable<RecipeBookmark> GetQueryable();
}
