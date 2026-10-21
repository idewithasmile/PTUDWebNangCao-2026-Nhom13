using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;

/// <summary>
/// FR-RCP-008 Upload: Owner (hoặc Admin) upload ảnh lên MinIO path
/// recipes/{recipeId}/{uuid}.{ext}. Ảnh đầu tiên tự IsPrimary=true
/// (logic nằm trong Recipe.AddImage — Core Domain).
/// Kích hoạt FR-JOB-002: Image Resize & Thumbnail Generation Job qua IBackgroundJobService.
/// </summary>
public class UploadRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IFileStorageService fileStorage,
    ICacheService cacheService,
    IBackgroundJobService? jobService = null)
    : IRequestHandler<UploadRecipeImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(UploadRecipeImageCommand request, CancellationToken cancellationToken)
    {
        // Load kèm Images: GetByIdAsync (BaseRepository) KHÔNG Include navigation
        // nên phải query qua GetQueryable + Include (pattern đã có using EFCore
        // trong UpdateRecipeCommandHandler). Kèm filter soft-delete.
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // Resource-Based Authorization: Owner hoặc Admin (SRS §2.3).
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền thêm ảnh vào công thức của người khác.");

        var ext = Path.GetExtension(request.FileName).ToLowerInvariant();
        var objectName = $"recipes/{request.RecipeId}/{Guid.NewGuid()}{ext}";

        string publicUrl;
        try
        {
            using var stream = new MemoryStream(request.Content, writable: false);
            publicUrl = await fileStorage.UploadAsync(stream, objectName, request.ContentType, folder: null, cancellationToken);
        }
        catch (ArgumentException ex) when (ex.Message.Contains("5MB") || ex.Message.Contains("Magic Bytes") || ex.Message.Contains("Định dạng"))
        {
            // Map lỗi validation file từ Infrastructure → 400 RFC 7807 (CONS-005).
            throw new Common.Exceptions.ValidationException(
                new Dictionary<string, string[]> { { "file", [ex.Message] } });
        }
        catch (Exception ex) when (IsStorageUnavailable(ex))
        {
            // FR-RCP-008.A4: MinIO không khả dụng → 503.
            throw new AppException("FILE_STORAGE_UNAVAILABLE", "Dịch vụ lưu trữ ảnh tạm thời không khả dụng. Vui lòng thử lại sau.", 503);
        }

        var image = recipe.AddImage(publicUrl, altText: request.AltText?.Trim());

        await unitOfWork.SaveChangesAsync(cancellationToken);

        // FR-JOB-002: Enqueue Image Resize & Thumbnail Generation Job (Fire-and-forget)
        try
        {
            jobService?.Enqueue<IRecipeImageResizeJob>(j => j.ExecuteAsync(recipe.Id, image.Id, publicUrl, CancellationToken.None));
        }
        catch
        {
            // Best-effort: không làm gãy flow upload ảnh gốc nếu Hangfire tạm thời lỗi
        }

        // Evict key chi tiết theo yêu cầu: ["recipes", $"recipe:{slug}"].
        // "recipes" đã evict qua CacheInvalidationBehavior; ở đây evict key slug.
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        return new RecipeImageDto(
            image.Id,
            image.OriginalUrl,
            image.MediumUrl,
            image.ThumbnailUrl,
            image.AltText,
            image.IsPrimary,
            image.OrderIndex);
    }

    private static bool IsStorageUnavailable(Exception ex)
    {
        var name = ex.GetType().Name;
        return name.Contains("Connection", StringComparison.OrdinalIgnoreCase)
            || name.Contains("Minio", StringComparison.OrdinalIgnoreCase)
            || name.Contains("HttpRequest", StringComparison.OrdinalIgnoreCase)
            || name.Contains("Socket", StringComparison.OrdinalIgnoreCase)
            || name.Contains("Timeout", StringComparison.OrdinalIgnoreCase);
    }
}
