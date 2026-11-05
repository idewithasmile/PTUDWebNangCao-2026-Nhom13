using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CulinaryBlog.Infrastructure.Services;

public class StorageQuotaService : IStorageQuotaService
{
    private readonly CulinaryBlogDbContext _dbContext;
    private readonly IOptions<StorageQuotaOptions> _options;
    private readonly ILogger<StorageQuotaService> _logger;

    public StorageQuotaService(
        CulinaryBlogDbContext dbContext,
        IOptions<StorageQuotaOptions> options,
        ILogger<StorageQuotaService> logger)
    {
        _dbContext = dbContext;
        _options = options;
        _logger = logger;
    }

    public async Task EnsureRecipeImageLimitNotExceededAsync(Guid recipeId, CancellationToken ct = default)
    {
        var maxImages = _options.Value.MaxImagesPerRecipe;
        var currentCount = await _dbContext.RecipeImages
            .CountAsync(i => i.RecipeId == recipeId, ct);

        if (currentCount >= maxImages)
        {
            _logger.LogWarning("Công thức {RecipeId} đã có {CurrentCount} ảnh, vượt quá giới hạn {MaxImages}.",
                recipeId, currentCount, maxImages);
            throw new AppException("RECIPE_IMAGE_LIMIT_REACHED",
                $"Công thức đã đạt giới hạn tối đa {maxImages} hình ảnh.", 400);
        }
    }

    public async Task EnsureUserStorageQuotaNotExceededAsync(string userId, long incomingSizeBytes, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) return;

        var maxStorageMb = _options.Value.MaxTotalStorageMbPerUser;
        var maxAllowedBytes = (long)maxStorageMb * 1024 * 1024;

        // Tính số lượng ảnh do user này sở hữu từ các Recipe và Avatar
        var userRecipeIds = await _dbContext.Recipes
            .Where(r => r.AuthorId == userId && !r.IsDeleted)
            .Select(r => r.Id)
            .ToListAsync(ct);

        var recipeImagesCount = await _dbContext.RecipeImages
            .CountAsync(i => userRecipeIds.Contains(i.RecipeId), ct);

        var hasAvatar = await _dbContext.Users
            .AnyAsync(u => u.Id == userId && !string.IsNullOrEmpty(u.AvatarUrl), ct);

        var totalFiles = recipeImagesCount + (hasAvatar ? 1 : 0);

        // Quy ước dự toán trung bình 3.5 MB cho mỗi tệp tin ảnh kèm các phiên bản Thumbnail/Medium
        var estimatedUsedBytes = (long)(totalFiles * 3.5 * 1024 * 1024);
        var projectedTotalBytes = estimatedUsedBytes + incomingSizeBytes;

        if (projectedTotalBytes > maxAllowedBytes)
        {
            _logger.LogWarning("Người dùng {UserId} vượt hạn mức lưu trữ: Đã dùng ~{UsedMb:F1}MB, thêm {IncomingMb:F1}MB vượt quá quota {MaxMb}MB.",
                userId, (double)estimatedUsedBytes / (1024 * 1024), (double)incomingSizeBytes / (1024 * 1024), maxStorageMb);

            throw new AppException("STORAGE_QUOTA_EXCEEDED",
                $"Dung lượng lưu trữ của người dùng đã vượt quá giới hạn {maxStorageMb} MB.", 400);
        }
    }
}
