using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Services;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;

/// <summary>
/// FR-RCP-008 Xử lý xóa hình ảnh khỏi công thức nấu ăn (DELETE /api/v1/recipes/{id}/images/{imageId} -> 204 No Content).
/// Logic: Xác thực -> Kiểm tra quyền tác giả/Admin -> Lấy danh sách URL ảnh (gốc, medium, thumbnail) -> Xóa entity trong DB -> Đẩy việc xóa file trên MinIO vào hàng đợi Background Job -> Xóa Cache Redis.
/// </summary>
public class DeleteRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IRecipeImageCleanupService cleanupService,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeImageCommand>
{
    public async Task Handle(DeleteRecipeImageCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Images
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: Phải đăng nhập mới được xóa ảnh
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả hoặc Admin mới có quyền xóa ảnh
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa ảnh của công thức người khác.");

        // 4. Kiểm tra ảnh cần xóa có tồn tại trong danh sách ảnh của công thức không
        var image = recipe.Images.FirstOrDefault(i => i.Id == request.ImageId)
            ?? throw new NotFoundException("RECIPE_IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId} trong công thức này.");

        // 5. Thu thập danh sách các URL file vật lý cần xóa trên MinIO (gồm ảnh gốc, ảnh cỡ vừa medium và thumbnail)
        var urlsToDelete = new[] { image.OriginalUrl, image.MediumUrl, image.ThumbnailUrl }
            .Where(u => !string.IsNullOrWhiteSpace(u))
            .Select(u => u!.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();

        // 6. Gọi Domain Method recipe.RemoveImage(): Xóa ảnh khỏi Entity (tự động chuyển quyền IsPrimary cho ảnh kế nếu ảnh bị xóa là ảnh chính)
        recipe.RemoveImage(request.ImageId);

        // 7. Lưu thay đổi trạng thái entity xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 8. Đẩy các URL file vật lý vào hàng đợi dọn dẹp file ngầm (Background Job Cleanup trên MinIO)
        // Kỹ thuật này giúp API phản hồi tức thì (204) cho người dùng mà không bị nghẽn bởi thao tác mạng xóa file MinIO
        foreach (var url in urlsToDelete)
        {
            await cleanupService.EnqueueDeleteAsync(url, cancellationToken);
        }

        // 9. Xóa cache Redis của công thức này để trang chi tiết cập nhật ngay (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
