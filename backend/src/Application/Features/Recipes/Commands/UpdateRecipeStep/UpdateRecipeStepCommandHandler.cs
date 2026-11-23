using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;

/// <summary>
/// FR-RCP-010 Xử lý cập nhật thông tin một bước chế biến (PUT /api/v1/recipes/{id}/steps/{stepId} -> 200 OK + DTO).
/// Logic: Xác thực -> Kiểm tra quyền tác giả/Admin -> Kiểm tra bước thuộc công thức -> Cập nhật thông tin bước qua Domain Method step.Update -> Lưu DB -> Xóa Cache Redis -> Trả về DTO.
/// </summary>
public class UpdateRecipeStepCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<UpdateRecipeStepCommand, RecipeStepDto>
{
    public async Task<RecipeStepDto> Handle(UpdateRecipeStepCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Steps
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Steps)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: Phải đăng nhập mới được sửa bước
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ tác giả hoặc Admin mới có quyền sửa bước
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa bước của công thức người khác.");

        // 4. Kiểm tra bước cần sửa có tồn tại trong danh sách bước của công thức không
        var step = recipe.Steps.FirstOrDefault(s => s.Id == request.StepId)
            ?? throw new NotFoundException("RECIPE_STEP_NOT_FOUND", $"Không tìm thấy bước với Id {request.StepId} trong công thức này.");

        // 5. Gọi Domain Method step.Update() để cập nhật tiêu đề, mô tả, thời gian và ảnh minh họa cho bước
        step.Update(
            step.StepNumber,
            request.Title ?? step.Title,
            request.Description,
            request.TimerMinutes,
            request.ImageUrl);

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để người đọc thấy ngay nội dung mới sửa (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        // 8. Chuyển đổi Entity sang RecipeStepDto và trả về kết quả
        return new RecipeStepDto(
            step.Id,
            step.StepNumber,
            step.Title,
            step.Description,
            step.TimerMinutes,
            step.ImageUrl);
    }
}
