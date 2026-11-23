using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;

/// <summary>
/// FR-RCP-008 Xử lý đặt một hình ảnh làm ảnh đại diện chính (Primary Image) cho công thức (PATCH /api/v1/recipes/{id}/images/{imageId}/primary -> 200 OK).
/// Logic: Xác thực người dùng -> Kiểm tra quyền tác giả/Admin -> Gọi recipe.SetPrimaryImage -> Lưu DB -> Xóa Cache Redis -> Trả về RecipeImageDto (với IsPrimary = true).
/// </summary>
public class SetPrimaryImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<SetPrimaryImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(SetPrimaryImageCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Images để cập nhật lại cờ IsPrimary của toàn bộ ảnh
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: Phải đăng nhập mới được thực hiện
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả hoặc Admin mới có quyền đổi ảnh chính
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa ảnh của công thức người khác.");

        // 4. Kiểm tra ảnh chỉ định có tồn tại trong danh sách ảnh của công thức không
        var image = recipe.Images.FirstOrDefault(i => i.Id == request.ImageId)
            ?? throw new NotFoundException("RECIPE_IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId} trong công thức này.");

        // 5. Gọi Domain Method recipe.SetPrimaryImage(): Đặt IsPrimary = true cho ảnh này và gán IsPrimary = false cho tất cả ảnh còn lại
        recipe.SetPrimaryImage(request.ImageId);

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để trang chi tiết và danh sách hiển thị ảnh bìa mới (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 8. Chuyển đổi Entity sang RecipeImageDto và trả về kết quả
        return new RecipeImageDto(
            image.Id,
            image.OriginalUrl,
            image.MediumUrl,
            image.ThumbnailUrl,
            image.AltText,
            image.IsPrimary,
            image.OrderIndex);
    }
}
