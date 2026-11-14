using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Domain.Interfaces;

public interface IRecipeRepository : IRepository<Recipe>
{
    Task<Recipe?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default);
    Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<bool> IsSlugUniqueAsync(string slug, CancellationToken ct = default);
    Task<string> GenerateUniqueSlugAsync(string baseSlug, CancellationToken ct = default);
    IQueryable<Recipe> GetQueryable();
}
