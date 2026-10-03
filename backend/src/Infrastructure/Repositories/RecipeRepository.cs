using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

public class RecipeRepository(CulinaryBlogDbContext dbContext) : BaseRepository<Recipe>(dbContext), IRecipeRepository
{
    public Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Steps)
            .Include(r => r.Ingredients)
            .Include(r => r.Images)
            .Include(r => r.Category)
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.Slug == slug, ct);
    }

    public Task<bool> IsSlugUniqueAsync(string slug, CancellationToken ct = default)
    {
        return Context.Recipes
            .AllAsync(r => r.Slug != slug, ct);
    }

    public IQueryable<Recipe> GetQueryable()
    {
        return Context.Recipes.AsQueryable();
    }
}
