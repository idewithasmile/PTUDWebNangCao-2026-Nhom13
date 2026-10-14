using CulinaryBlog.Application.Features.Recipes.Services;
using CulinaryBlog.Domain.Interfaces;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Thân Hangfire job xóa file ảnh (FR-JOB bất đồng bộ, FR-FILE-002).
/// Tách class riêng để Hangfire serialize expression ổn định (theo pattern AuthWelcomeEmailJob).
/// FR-FILE-002 idempotent: object không tồn tại trên MinIO cũng không throw.
/// </summary>
public sealed class RecipeImageDeleteJob(
    IFileStorageService storage,
    ILogger<RecipeImageDeleteJob> logger)
{
    public async Task DeleteAsync(string fileUrl)
    {
        try
        {
            await storage.DeleteAsync(fileUrl);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Xóa file MinIO thất bại cho {FileUrl} (Hangfire sẽ retry)", fileUrl);
            throw;
        }
    }
}

/// <summary>
/// Enqueue job xóa file ảnh qua Hangfire, best-effort (không làm fail command khi queue lỗi).
/// </summary>
public sealed class RecipeImageCleanupService(
    IBackgroundJobClient jobs,
    ILogger<RecipeImageCleanupService> logger) : IRecipeImageCleanupService
{
    public Task EnqueueDeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<RecipeImageDeleteJob>(j => j.DeleteAsync(fileUrl));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Hangfire enqueue xóa ảnh thất bại cho {FileUrl}", fileUrl);
        }

        return Task.CompletedTask;
    }
}
