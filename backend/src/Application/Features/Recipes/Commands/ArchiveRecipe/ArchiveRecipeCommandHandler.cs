using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe;

/// <summary>
/// HANDLER XỬ LÝ LƯU TRỮ CÔNG THỨC (FR-RCP-006):
/// Trọng tâm:
/// 1. Resource-based Authorization: Kiểm tra quyền sở hữu (Chỉ tác giả hoặc Admin mới được lưu trữ).
/// 2. Chuyển trạng thái bài viết sang Archived (Status = RecipeStatus.Archived) để ẩn khỏi trang chủ nhưng bảo tồn dữ liệu.
/// 3. Lưu xuống PostgreSQL và trả về RecipeDto.
/// </summary>
public class ArchiveRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<ArchiveRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(ArchiveRecipeCommand request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Tìm bài viết và kiểm tra quyền sở hữu (Nếu không phải tác giả/Admin -> ném lỗi 403)
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);
        
        // BƯỚC 2: Gọi hàm nghiệp vụ Domain để đổi trạng thái sang Archived
        recipe.Archive();
        
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
