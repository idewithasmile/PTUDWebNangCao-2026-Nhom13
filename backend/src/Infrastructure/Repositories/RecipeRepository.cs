using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

public class RecipeRepository(CulinaryBlogDbContext dbContext) : BaseRepository<Recipe>(dbContext), IRecipeRepository
{
    public override Task<Recipe?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Steps)
            .Include(r => r.Images)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);
    }

    public Task<Recipe?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Images)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);
    }

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

    public async Task<string> GenerateUniqueSlugAsync(string baseSlug, CancellationToken ct = default)
    {
        var cleanedBaseSlug = string.IsNullOrWhiteSpace(baseSlug) ? "cong-thuc" : baseSlug.Trim().ToLowerInvariant();

        var isUnique = await IsSlugUniqueAsync(cleanedBaseSlug, ct);
        if (isUnique)
        {
            return cleanedBaseSlug;
        }

        var prefix = cleanedBaseSlug + "-";
        var existingSlugs = await Context.Recipes
            .AsNoTracking()
            .Where(r => r.Slug == cleanedBaseSlug || r.Slug.StartsWith(prefix))
            .Select(r => r.Slug)
            .ToListAsync(ct);

        var slugSet = new HashSet<string>(existingSlugs, StringComparer.OrdinalIgnoreCase);
        if (!slugSet.Contains(cleanedBaseSlug))
        {
            return cleanedBaseSlug;
        }

        int counter = 2;
        while (slugSet.Contains($"{cleanedBaseSlug}-{counter}"))
        {
            counter++;
        }

        return $"{cleanedBaseSlug}-{counter}";
    }

    public IQueryable<Recipe> GetQueryable()
    {
        return Context.Recipes.AsQueryable();
    }
}
