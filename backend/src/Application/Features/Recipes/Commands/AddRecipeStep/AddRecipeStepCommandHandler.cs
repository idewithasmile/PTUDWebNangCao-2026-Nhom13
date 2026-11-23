using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeStep;

/// <summary>
/// FR-RCP-010 Xử lý thêm bước chế biến mới vào công thức.
/// Logic: Kiểm tra quyền tác giả/Admin -> Gọi Domain Method recipe.AddStep (tự tăng StepNumber) -> Lưu DB -> Xóa Cache Redis -> Trả về DTO (201 Created).
/// </summary>
public class AddRecipeStepCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<AddRecipeStepCommand, RecipeStepDto>
{
    public async Task<RecipeStepDto> Handle(AddRecipeStepCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL kèm danh sách Steps hiện tại để tính số thứ tự bước tiếp theo (Eager Loading với Include)
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Steps)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: phải đăng nhập mới được thêm bước
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên (Resource-based Authorization): Chỉ chính tác giả hoặc Admin mới có quyền thêm bước
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền thêm bước vào công thức của người khác.");

        // 4. Ủy quyền nghiệp vụ cho Domain Entity (DDD Method):
        // recipe.AddStep() sẽ tự động tính StepNumber = steps.Count + 1 và thêm vào danh sách đóng gói _steps
        var step = recipe.AddStep(
            request.Title ?? string.Empty,
            request.Description,
            request.TimerMinutes,
            request.ImageUrl);

        // 5. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Xóa cache Redis của công thức này để người đọc thấy ngay bước mới vừa thêm (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 7. Chuyển đổi Entity RecipeStep sang RecipeStepDto và trả về kết quả
        return new RecipeStepDto(
            step.Id,
            step.StepNumber,
            step.Title,
            step.Description,
            step.TimerMinutes,
            step.ImageUrl);
    }
}
