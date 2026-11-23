using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;

/// <summary>
/// FR-RCP-009 Xử lý xóa một nguyên liệu khỏi công thức.
/// Logic: Xác thực người dùng -> Kiểm tra quyền tác giả/Admin -> Kiểm tra nguyên liệu có thuộc công thức không -> Gọi recipe.RemoveIngredient -> Lưu DB -> Xóa Cache Redis -> Trả về 204 No Content.
/// </summary>
public class DeleteRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeIngredientCommand>
{
    public async Task Handle(DeleteRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Ingredients
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: Phải đăng nhập mới được thực hiện
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả hoặc Admin mới có quyền xóa nguyên liệu
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa nguyên liệu của công thức người khác.");

        // 4. Kiểm tra nguyên liệu cần xóa có tồn tại trong công thức này không
        _ = recipe.Ingredients.FirstOrDefault(i => i.Id == request.IngredientId)
            ?? throw new NotFoundException("RECIPE_INGREDIENT_NOT_FOUND", $"Không tìm thấy nguyên liệu với Id {request.IngredientId} trong công thức này.");

        // 5. Gọi Domain Method recipe.RemoveIngredient() để xóa nguyên liệu khỏi danh sách đóng gói _ingredients
        recipe.RemoveIngredient(request.IngredientId);

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để cập nhật trang chi tiết (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
