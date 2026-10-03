using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

/// <summary>
/// Hiện thực ICategoryRepository kế thừa BaseRepository và triển khai các nghiệp vụ LINQ chuyên sâu.
/// </summary>
public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    private readonly CulinaryBlogDbContext _dbContext;

    public CategoryRepository(CulinaryBlogDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return await _dbContext.Categories
            .FirstOrDefaultAsync(c => c.Slug == slug && !c.IsDeleted, ct);
    }

    public async Task<bool> HasActiveRecipesAsync(Guid categoryId, CancellationToken ct = default)
    {
        return await _dbContext.Recipes
            .AnyAsync(r => r.CategoryId == categoryId && !r.IsDeleted, ct);
    }

    public async Task<IReadOnlyList<Category>> GetAllWithCountAsync(CancellationToken ct = default)
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .Include(c => c.Recipes.Where(r => !r.IsDeleted && r.Status == RecipeStatus.Published))
            .OrderBy(c => c.OrderIndex)
            .ThenBy(c => c.Name)
            .ToListAsync(ct);
    }

    public async Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLower();
        return await _dbContext.Categories
            .AnyAsync(c => !c.IsDeleted &&
                           (!excludeId.HasValue || c.Id != excludeId.Value) &&
                           c.Name.ToLower() == normalized, ct);
    }

    public async Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken ct = default)
    {
        var normalized = slug.Trim().ToLower();
        return await _dbContext.Categories
            .AnyAsync(c => (!excludeId.HasValue || c.Id != excludeId.Value) &&
                           c.Slug.ToLower() == normalized, ct);
    }

    public async Task<IReadOnlyList<(Category Category, int RecipeCount)>> GetAllWithRecipeCountAsync(CancellationToken ct = default)
    {
        var query = await _dbContext.Categories
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.OrderIndex)
            .ThenBy(c => c.Name)
            .Select(c => new
            {
                Category = c,
                RecipeCount = c.Recipes.Count(r => !r.IsDeleted && r.Status == RecipeStatus.Published)
            })
            .ToListAsync(ct);

        return query.Select(x => (x.Category, x.RecipeCount)).ToList();
    }

    public async Task<(Category? Category, IReadOnlyList<Recipe> Recipes, int TotalCount)> GetBySlugWithRecipesAsync(
        string slug, int page, int pageSize, CancellationToken ct = default)
    {
        var category = await _dbContext.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug && !c.IsDeleted, ct);

        if (category is null)
        {
            return (null, [], 0);
        }

        var recipesQuery = _dbContext.Recipes
            .AsNoTracking()
            .Include(r => r.Author)
            .Include(r => r.Images)
            .Where(r => r.CategoryId == category.Id && !r.IsDeleted && r.Status == RecipeStatus.Published);

        var totalCount = await recipesQuery.CountAsync(ct);

        var recipes = await recipesQuery
            .OrderByDescending(r => r.PublishedAt ?? r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (category, recipes, totalCount);
    }

    public async Task<int> GetActiveRecipeCountAsync(Guid categoryId, CancellationToken ct = default)
    {
        return await _dbContext.Recipes
            .CountAsync(r => r.CategoryId == categoryId && !r.IsDeleted, ct);
    }
}
