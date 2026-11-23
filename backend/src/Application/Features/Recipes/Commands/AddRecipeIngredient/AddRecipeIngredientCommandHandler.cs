using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeIngredient;

/// <summary>
/// FR-RCP-009 Xử lý thêm nguyên liệu mới vào công thức nấu ăn.
/// Logic: Xác thực tài khoản -> Kiểm tra quyền tác giả/Admin -> Gọi Domain Method recipe.AddIngredient -> Lưu DB -> Xóa Cache Redis -> Trả về DTO (201 Created).
/// </summary>
public class AddRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<AddRecipeIngredientCommand, RecipeIngredientDto>
{
    public async Task<RecipeIngredientDto> Handle(AddRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL kèm danh sách Ingredients hiện tại (Eager Loading với Include)
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: phải đăng nhập mới được thêm nguyên liệu
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả của công thức hoặc Quản trị viên (Admin) mới có quyền thêm
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền thêm nguyên liệu vào công thức của người khác.");

        // 4. Gọi Domain Method của thực thể Recipe để thêm nguyên liệu vào danh sách con đóng gói _ingredients
        var ingredient = recipe.AddIngredient(
            request.Name,
            request.Quantity,
            request.Unit,
            request.Notes);

        // 5. Nếu client chỉ định rõ thứ tự sắp xếp SortOrder thì cập nhật ghi đè thứ tự mặc định
        if (request.SortOrder.HasValue)
        {
            ingredient.Update(request.Name, request.Quantity, request.Unit, request.Notes, request.SortOrder.Value);
        }

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để trang chi tiết cập nhật dữ liệu mới nhất (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 8. Chuyển đổi Entity RecipeIngredient sang DTO và trả về kết quả
        return new RecipeIngredientDto(
            ingredient.Id,
            ingredient.Name,
            ingredient.Quantity,
            ingredient.Unit,
            ingredient.Notes,
            ingredient.OrderIndex);
    }
}
