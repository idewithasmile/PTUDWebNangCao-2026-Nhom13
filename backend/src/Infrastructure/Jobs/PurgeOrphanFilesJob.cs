using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// Hangfire Recurring Job quét và dọn dẹp các tệp tin mồ côi (Orphan Files) trên MinIO S3 bucket.
/// Đối chiếu danh sách tệp trên bucket với các URL trong bảng RecipeImages, Categories, Users.
/// Các tệp không có trong CSDL và có thời gian sửa đổi (LastModified) quá 24 giờ sẽ được xóa an toàn (Idempotent).
/// </summary>
public class PurgeOrphanFilesJob : IPurgeOrphanFilesJob
{
    private readonly CulinaryBlogDbContext _dbContext;
    private readonly IFileStorageService _fileStorage;
    private readonly ILogger<PurgeOrphanFilesJob> _logger;

    public PurgeOrphanFilesJob(
        CulinaryBlogDbContext dbContext,
        IFileStorageService fileStorage,
        ILogger<PurgeOrphanFilesJob> logger)
    {
        _dbContext = dbContext;
        _fileStorage = fileStorage;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Bắt đầu thực thi PurgeOrphanFilesJob: Quét và dọn dẹp file mồ côi trên MinIO S3.");

        try
        {
            // 1. Thu thập toàn bộ URL ảnh đang lưu trữ trong cơ sở dữ liệu
            var recipeOriginalUrls = await _dbContext.RecipeImages
                .Select(i => i.OriginalUrl)
                .Where(u => !string.IsNullOrEmpty(u))
                .ToListAsync(ct);

            var recipeMediumUrls = await _dbContext.RecipeImages
                .Select(i => i.MediumUrl)
                .Where(u => !string.IsNullOrEmpty(u))
                .ToListAsync(ct);

            var recipeThumbUrls = await _dbContext.RecipeImages
                .Select(i => i.ThumbnailUrl)
                .Where(u => !string.IsNullOrEmpty(u))
                .ToListAsync(ct);

            var categoryImageUrls = await _dbContext.Categories
                .Select(c => c.ImageUrl)
                .Where(u => !string.IsNullOrEmpty(u))
                .ToListAsync(ct);

            var userAvatarUrls = await _dbContext.Users
                .Select(u => u.AvatarUrl)
                .Where(u => !string.IsNullOrEmpty(u))
                .ToListAsync(ct);

            var activeKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var url in recipeOriginalUrls
                         .Concat(recipeMediumUrls!)
                         .Concat(recipeThumbUrls!)
                         .Concat(categoryImageUrls!)
                         .Concat(userAvatarUrls!))
            {
                if (string.IsNullOrWhiteSpace(url)) continue;
                var key = ExtractKey(url);
                if (!string.IsNullOrWhiteSpace(key))
                {
                    activeKeys.Add(key);
                }
            }

            _logger.LogInformation("Tổng số tệp ảnh đang được liên kết trong CSDL: {Count}", activeKeys.Count);

            // 2. Quét toàn bộ object key trên MinIO bucket
            var allMinioFiles = await _fileStorage.ListAllFilesAsync(folder: null, ct);
            _logger.LogInformation("Tổng số object tìm thấy trên MinIO: {Count}", allMinioFiles.Count);

            var thresholdTime = DateTimeOffset.UtcNow.AddHours(-24);
            int purgedCount = 0;

            // 3. Lọc và xóa các file mồ côi có LastModified > 24 giờ
            foreach (var fileKey in allMinioFiles)
            {
                var normalizedKey = ExtractKey(fileKey);
                if (string.IsNullOrWhiteSpace(normalizedKey)) continue;

                if (!activeKeys.Contains(normalizedKey))
                {
                    var lastModified = await _fileStorage.GetLastModifiedAsync(fileKey, ct);
                    if (lastModified == null || lastModified <= thresholdTime)
                    {
                        _logger.LogInformation("Phát hiện tệp mồ côi: {Key} (LastModified: {LastModified}). Tiến hành xóa...", fileKey, lastModified);
                        await _fileStorage.DeleteAsync(fileKey, ct);
                        purgedCount++;
                    }
                }
            }

            _logger.LogInformation("Hoàn tất PurgeOrphanFilesJob: Đã dọn dẹp thành công {PurgedCount} tệp tin mồ côi.", purgedCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình thực thi PurgeOrphanFilesJob: {Message}", ex.Message);
            throw;
        }
    }

    private static string ExtractKey(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return string.Empty;

        var trimmed = fileUrl.Trim();
        if (Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            trimmed = uri.AbsolutePath;
        }

        trimmed = trimmed.Replace('\\', '/').TrimStart('/');

        const string bucketPrefix = "culinary-blog/";
        if (trimmed.StartsWith(bucketPrefix, StringComparison.OrdinalIgnoreCase))
        {
            trimmed = trimmed[bucketPrefix.Length..];
        }

        return trimmed.TrimStart('/');
    }
}
