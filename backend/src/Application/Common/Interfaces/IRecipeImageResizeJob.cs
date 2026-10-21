namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// FR-JOB-002: Job resize ảnh sang Thumbnail (300x300) và Medium (800x600).
/// </summary>
public interface IRecipeImageResizeJob
{
    Task ExecuteAsync(Guid recipeId, Guid imageId, string originalUrl, CancellationToken ct = default);
}
