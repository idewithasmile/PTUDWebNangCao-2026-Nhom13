using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Domain.Common.Interfaces;

/// <summary>
/// Hợp đồng Repository chuyên biệt cho phân hệ Danh mục (FR-CAT).
/// Kế thừa từ IRepository<Category> và bổ sung các nghiệp vụ truy vấn đặc thù.
/// </summary>
public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<bool> HasActiveRecipesAsync(Guid categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<Category>> GetAllWithCountAsync(CancellationToken ct = default);

    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken ct = default);
    Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken ct = default);
    Task<IReadOnlyList<(Category Category, int RecipeCount)>> GetAllWithRecipeCountAsync(CancellationToken ct = default);
    Task<(Category? Category, IReadOnlyList<Recipe> Recipes, int TotalCount)> GetBySlugWithRecipesAsync(string slug, int page, int pageSize, CancellationToken ct = default);
    Task<int> GetActiveRecipeCountAsync(Guid categoryId, CancellationToken ct = default);
}
