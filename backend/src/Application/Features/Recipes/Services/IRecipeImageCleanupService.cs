namespace CulinaryBlog.Application.Features.Recipes.Services;

/// <summary>
/// Trừu tượng hóa Hangfire cho FR-RCP-008 Delete (FR-FILE-002):
/// enqueue job bất đồng bộ xóa file trên MinIO sau khi entity đã xóa khỏi DB.
/// Interface đặt ở Application để Handler không phụ thuộc Hangfire/MinIO (CONS-001).
/// Implement ở Infrastructure/Services, best-effort (không làm fail command khi queue lỗi).
/// </summary>
public interface IRecipeImageCleanupService
{
    Task EnqueueDeleteAsync(string fileUrl, CancellationToken ct = default);
}
