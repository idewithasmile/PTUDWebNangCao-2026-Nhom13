using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipe;

/// <summary>
/// HANDLER XỬ LÝ XÓA CÔNG THỨC (FR-RCP-007):
/// Trọng tâm:
/// 1. Resource-based Authorization: Kiểm tra quyền (Chỉ tác giả sở hữu hoặc Admin mới được xóa).
/// 2. Áp dụng XÓA MỀM (SOFT DELETE): Chỉ đánh dấu IsDeleted = true, tuyệt đối không xóa cứng khỏi Database
///    nhằm bảo tồn lịch sử dữ liệu và chống lỗi ràng buộc khóa ngoại (Foreign Key).
/// </summary>
public class DeleteRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<DeleteRecipeCommand, Unit>
{
    public async Task<Unit> Handle(DeleteRecipeCommand request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Tìm bài viết và kiểm tra quyền sở hữu (Nếu không phải tác giả/Admin -> ném 403 Forbidden)
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);

        // BƯỚC 2: Thực hiện Xóa mềm (Gán IsDeleted = true và UpdatedAt = UtcNow)
        recipeRepository.SoftDelete(recipe);
        
        // BƯỚC 3: Lưu thay đổi trạng thái xóa mềm xuống PostgreSQL
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        // BƯỚC 4: Trả về Unit.Value (tương đương kiểu void trong MediatR - HTTP 204 No Content)
        return Unit.Value;
    }
}
