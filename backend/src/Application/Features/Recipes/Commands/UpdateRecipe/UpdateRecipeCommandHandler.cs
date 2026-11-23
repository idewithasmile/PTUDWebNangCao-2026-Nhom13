using CulinaryBlog.Application.Common.Exceptions;

using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Helpers;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipe;

/// <summary>
/// HANDLER XỬ LÝ CHỈNH SỬA CÔNG THỨC (FR-RCP-004):
/// Trọng tâm kỹ thuật quan trọng nhất:
/// 1. Resource-based Authorization: Kiểm tra quyền sở hữu (Chỉ Tác giả tạo bài hoặc Admin mới được sửa).
/// 2. Unique Slug Validation: Kiểm tra nếu đổi tiêu đề thì slug mới có bị trùng với bài khác không.
/// 3. Optimistic Concurrency Control (OCC): Dùng trường RowVersion để phát hiện xung đột ghi đè đồng thời.
/// </summary>
public class UpdateRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<UpdateRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(UpdateRecipeCommand request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Tìm công thức trong CSDL theo Id, nếu không thấy -> ném lỗi 404 NotFound
        var recipe = await recipeRepository.GetByIdAsync(request.Id, cancellationToken);
        if (recipe == null)
        {
            throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.Id}");
        }

        // BƯỚC 2: PHÂN QUYỀN TÀI NGUYÊN (Resource-based Authorization)
        // Nếu người gọi KHÔNG PHẢI Admin VÀ UserId KHÔNG KHỚP với AuthorId của bài viết -> Cấm sửa (403 Forbidden)
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
        {
            throw new ForbiddenException("FORBIDDEN", "Bạn không có quyền chỉnh sửa công thức này.");
        }

        // BƯỚC 3: Xử lý Slug nếu tác giả có thay đổi Tiêu đề bài viết
        var slug = SlugHelper.Generate(request.Title);
        if (recipe.Slug != slug)
        {
            // Kiểm tra xem slug mới đã bị bài viết nào khác chiếm dụng hay chưa
            var isUnique = await recipeRepository.IsSlugUniqueAsync(slug, cancellationToken);
            if (!isUnique)
            {
                throw new ConflictException("RECIPE_CONFLICT", $"Slug '{slug}' đã tồn tại.");
            }
        }

        // BƯỚC 4: Cập nhật thông tin dinh dưỡng mới
        var nutrition = new CulinaryBlog.Domain.ValueObjects.RecipeNutrition(
            request.Calories, request.Protein, request.Carbs, request.Fat);

        // BƯỚC 5: Gọi hàm nghiệp vụ của tầng Domain để cập nhật dữ liệu cốt lõi
        recipe.Update(
            request.Title,
            slug,
            request.Description,
            request.Instructions,
            request.PrepTimeMinutes,
            request.CookTimeMinutes,
            request.Servings,
            request.Difficulty,
            request.CategoryId);

        recipe.SetNutrition(nutrition);

        if (!string.IsNullOrWhiteSpace(request.PrimaryImageUrl))
        {
            recipe.SetPrimaryImageUrl(request.PrimaryImageUrl);
        }

        // BƯỚC 6: XỬ LÝ CONCURRENCY CHECK (CHỐNG GHI ĐÈ ĐỒNG THỜI)
        // Giải mã chuỗi RowVersionBase64 mà Client gửi lên (con dấu phiên bản lúc Client mở trang web ra)
        byte[] rowVersion;
        try
        {
            rowVersion = !string.IsNullOrEmpty(request.RowVersionBase64)
                ? Convert.FromBase64String(request.RowVersionBase64)
                : (recipe.RowVersion ?? new byte[8]);
        }
        catch (FormatException)
        {
            throw new CulinaryBlog.Application.Common.Exceptions.ValidationException(
                new Dictionary<string, string[]> { { "RowVersionBase64", ["RowVersion không hợp lệ."] } });
        }

        // Báo cho EF Core biết phiên bản gốc của Client để đem xuống đối chiếu với CSDL
        recipeRepository.SetOriginalRowVersion(recipe, rowVersion);

        // BƯỚC 7: Thực thi lưu xuống CSDL với cơ chế bắt lỗi xung đột
        try
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            // Nếu RowVersion dưới CSDL đã bị ai đó sửa trước rồi -> Ném lỗi 409 Conflict báo người dùng tải lại trang
            throw new ConflictException("CONCURRENCY_CONFLICT", "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang.");
        }

        // BƯỚC 8: Trả về DTO cập nhật thành công
        return new RecipeDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Status,
            recipe.AuthorId,
            recipe.CategoryId,
            recipe.CreatedAt,
            recipe.UpdatedAt);
    }
}
