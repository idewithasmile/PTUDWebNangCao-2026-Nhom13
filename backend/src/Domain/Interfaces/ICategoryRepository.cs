using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken ct = default);
    Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken ct = default);
    Task<IReadOnlyList<(Category Category, int RecipeCount)>> GetAllWithRecipeCountAsync(CancellationToken ct = default);
    Task<(Category? Category, IReadOnlyList<Recipe> Recipes, int TotalCount)> GetBySlugWithRecipesAsync(string slug, int page, int pageSize, CancellationToken ct = default);
    Task<int> GetActiveRecipeCountAsync(Guid categoryId, CancellationToken ct = default);
    Task<Category> AddAsync(Category category, CancellationToken ct = default);
    void Update(Category category);
    void SoftDelete(Category category);
}
