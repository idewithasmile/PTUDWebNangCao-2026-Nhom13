using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UnpublishRecipe;

/// <summary>
/// HANDLER XỬ LÝ HỦY XUẤT BẢN / RÚT BÀI VỀ BẢN NHÁP (FR-RCP-005):
/// Trọng tâm:
/// 1. Resource-based Authorization: Kiểm tra quyền sở hữu (Chỉ tác giả hoặc Admin mới được rút bài).
/// 2. Chuyển trạng thái bài viết từ Published lùi về Draft (ẩn khỏi trang chủ để tác giả chỉnh sửa).
/// 3. Lưu xuống PostgreSQL và trả về RecipeDto.
/// </summary>
public class UnpublishRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<UnpublishRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(UnpublishRecipeCommand request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Tìm bài viết và kiểm tra quyền sở hữu (Nếu không phải tác giả/Admin -> ném lỗi 403)
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);
        
        // BƯỚC 2: Gọi hàm nghiệp vụ Domain để đổi trạng thái sang Draft (Status = RecipeStatus.Draft)
        recipe.Unpublish();
        
        // BƯỚC 3: Lưu trạng thái mới xuống PostgreSQL
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        // BƯỚC 4: Trả về DTO cập nhật cho Client
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
