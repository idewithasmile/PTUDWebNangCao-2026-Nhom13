using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe;

/// <summary>
/// FR-RCP-005 Xử lý xuất bản công thức nấu ăn sang trạng thái công khai (Published).
/// Logic: Xác thực & phân quyền tác giả/Admin -> Gọi Domain Method recipe.Publish() (kiểm tra điều kiện bắt buộc phải có >= 1 bước) -> Lưu DB -> Trả về RecipeDto.
/// </summary>
public class PublishRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<PublishRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(PublishRecipeCommand request, CancellationToken cancellationToken)
    {
        // 1. Dùng Helper kiểm tra người dùng đã đăng nhập và là chính tác giả của bài viết (hoặc Admin)
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);
        
        // 2. Gọi Domain Method recipe.Publish():
        // Kiểm tra nghiệp vụ Domain: Bài viết bắt buộc phải có ít nhất 1 bước chế biến (_steps.Count > 0) mới được xuất bản.
        // Chuyển Status = RecipeStatus.Published và gán PublishedAt = DateTime.UtcNow
        recipe.Publish();
        
        // 3. Lưu trạng thái xuất bản xuống CSDL PostgreSQL
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        // 4. Chuyển đổi sang RecipeDto và trả về kết quả cho Client
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
