using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;

/// <summary>
/// FR-RCP-009 Xử lý cập nhật thông tin một nguyên liệu (PUT /api/v1/recipes/{id}/ingredients/{ingredientId} -> 200 OK + DTO).
/// Logic: Xác thực người dùng -> Phân quyền tác giả/Admin -> Kiểm tra nguyên liệu thuộc công thức -> Cập nhật nguyên liệu qua Domain Method ingredient.Update -> Lưu DB -> Xóa Cache Redis -> Trả về DTO.
/// </summary>
public class UpdateRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<UpdateRecipeIngredientCommand, RecipeIngredientDto>
{
    public async Task<RecipeIngredientDto> Handle(UpdateRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Ingredients
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: Phải đăng nhập mới được sửa nguyên liệu
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả hoặc Admin mới có quyền sửa nguyên liệu
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa nguyên liệu của công thức người khác.");

        // 4. Kiểm tra nguyên liệu cần sửa có tồn tại trong danh sách nguyên liệu của công thức không
        var ingredient = recipe.Ingredients.FirstOrDefault(i => i.Id == request.IngredientId)
            ?? throw new NotFoundException("RECIPE_INGREDIENT_NOT_FOUND", $"Không tìm thấy nguyên liệu với Id {request.IngredientId} trong công thức này.");

        // 5. Gọi Domain Method ingredient.Update() để cập nhật tên, số lượng, đơn vị, ghi chú và thứ tự
        ingredient.Update(
            request.Name,
            request.Quantity,
            request.Unit,
            request.Notes,
            request.SortOrder ?? ingredient.OrderIndex);

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để trang chi tiết hiển thị dữ liệu mới (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 8. Chuyển đổi Entity sang RecipeIngredientDto và trả về kết quả
        return new RecipeIngredientDto(
            ingredient.Id,
            ingredient.Name,
            ingredient.Quantity,
            ingredient.Unit,
            ingredient.Notes,
            ingredient.OrderIndex);
    }
}
