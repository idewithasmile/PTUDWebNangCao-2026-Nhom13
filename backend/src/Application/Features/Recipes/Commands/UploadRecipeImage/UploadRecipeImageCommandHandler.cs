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
/// Kiểm tra hạn mức lưu trữ (MaxImagesPerRecipe và Storage Quota) trước khi tải lên.
/// </summary>
public class UploadRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IFileStorageService fileStorage,
    ICacheService cacheService,
    IBackgroundJobService? jobService = null,
    IStorageQuotaService? storageQuotaService = null)
    : IRequestHandler<UploadRecipeImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(UploadRecipeImageCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Images hiện tại để kiểm tra số lượng và ảnh chính
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực (Authentication): Người dùng phải đăng nhập trước
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên (Resource-Based Authorization): Chỉ tác giả hoặc Admin mới có quyền tải ảnh lên
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền thêm ảnh vào công thức của người khác.");

        // 4. Kiểm tra giới hạn số lượng ảnh cho mỗi công thức (tối đa 10 ảnh theo quy định SRS)
        if (recipe.Images.Count >= 10)
        {
            throw new AppException("RECIPE_IMAGE_LIMIT_REACHED", "Công thức đã đạt giới hạn tối đa 10 hình ảnh.", 400);
        }

        // 5. Kiểm tra dung lượng lưu trữ (Storage Quota) của tác giả (nếu dịch vụ quota được kích hoạt)
        if (storageQuotaService != null)
        {
            await storageQuotaService.EnsureRecipeImageLimitNotExceededAsync(request.RecipeId, cancellationToken);
            if (!string.IsNullOrEmpty(currentUser.UserId))
            {
                await storageQuotaService.EnsureUserStorageQuotaNotExceededAsync(currentUser.UserId, request.Content.Length, cancellationToken);
            }
        }

        // 6. Chuẩn bị định dạng tên file lưu trữ trên MinIO Object Storage: "recipes/{recipeId}/{uuid}.ext"
        var ext = Path.GetExtension(request.FileName).ToLowerInvariant();
        var objectName = $"recipes/{request.RecipeId}/{Guid.NewGuid()}{ext}";

        // 7. Thực hiện tải luồng byte ảnh lên MinIO Object Storage
        string publicUrl;
        try
        {
            using var stream = new MemoryStream(request.Content, writable: false);
            publicUrl = await fileStorage.UploadAsync(stream, objectName, request.ContentType, folder: null, cancellationToken);
        }
        catch (ArgumentException ex) when (ex.Message.Contains("5MB") || ex.Message.Contains("Magic Bytes") || ex.Message.Contains("Định dạng"))
        {
            // Bắt lỗi kiểm tra file (dung lượng quá 5MB hoặc file giả mạo đuôi ảnh sai Magic Bytes) -> trả về HTTP 400
            throw new Common.Exceptions.ValidationException(
                new Dictionary<string, string[]> { { "file", [ex.Message] } });
        }
        catch (Exception ex) when (IsStorageUnavailable(ex))
        {
            // Trường hợp máy chủ MinIO mất kết nối hoặc bị sập -> trả về HTTP 503 Service Unavailable
            throw new AppException("FILE_STORAGE_UNAVAILABLE", "Dịch vụ lưu trữ ảnh tạm thời không khả dụng. Vui lòng thử lại sau.", 503);
        }

        // 8. Thêm ảnh vào thực thể Recipe thông qua phương thức Domain:
        // Lưu ý: Logic tự động đặt IsPrimary = true cho tấm ảnh đầu tiên được xử lý bên trong Recipe.AddImage
        var image = recipe.AddImage(publicUrl, altText: request.AltText?.Trim());

        // 9. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 10. Đẩy tác vụ xử lý ảnh thu nhỏ (Thumbnail generation) vào hàng đợi Background Job (Hangfire/Channel)
        try
        {
            jobService?.Enqueue<IRecipeImageResizeJob>(j => j.ExecuteAsync(recipe.Id, image.Id, publicUrl, CancellationToken.None));
        }
        catch
        {
            // Best-effort: Nếu dịch vụ background job gặp sự cố thì không làm gián đoạn luồng tải ảnh của người dùng
        }

        // 11. Xóa cache Redis của công thức này để hiển thị ảnh mới ngay lập tức (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 12. Trả về thông tin DTO của hình ảnh vừa tải lên (HTTP 201 Created)
        return new RecipeImageDto(
            image.Id,
            image.OriginalUrl,
            image.MediumUrl,
            image.ThumbnailUrl,
            image.AltText,
            image.IsPrimary,
            image.OrderIndex);
    }

    /// <summary>
    /// Kiểm tra xem ngoại lệ có phải do sự cố kết nối tới máy chủ lưu trữ MinIO/S3 hay không.
    /// </summary>
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
