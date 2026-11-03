namespace CulinaryBlog.Application.Common.Interfaces;

public interface IStorageQuotaService
{
    Task EnsureRecipeImageLimitNotExceededAsync(Guid recipeId, CancellationToken ct = default);
    Task EnsureUserStorageQuotaNotExceededAsync(string userId, long incomingSizeBytes, CancellationToken ct = default);
}
