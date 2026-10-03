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
