using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;

/// <summary>
/// FR-RCP-010 Xử lý xóa một bước chế biến khỏi công thức.
/// Logic: Kiểm tra quyền tác giả/Admin -> Kiểm tra bước có tồn tại trong công thức không -> Gọi recipe.RemoveStep (tự động đánh lại số thứ tự StepNumber) -> Lưu DB -> Xóa Cache Redis -> Trả về 204 No Content.
/// </summary>
public class DeleteRecipeStepCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeStepCommand>
{
    public async Task Handle(DeleteRecipeStepCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm công thức trong CSDL và Eager Loading danh sách Steps để xử lý đánh lại số thứ tự
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Steps)
            .Where(r => !r.IsDeleted) // Chỉ lấy công thức chưa bị xóa mềm
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        // 2. Kiểm tra xác thực người dùng: phải đăng nhập mới được xóa bước
        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        // 3. Phân quyền tài nguyên: Chỉ chính tác giả hoặc Admin mới có quyền xóa bước
        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa bước của công thức người khác.");

        // 4. Kiểm tra xem bước cần xóa có thực sự thuộc về công thức này hay không (tránh xóa nhầm bước của công thức khác)
        _ = recipe.Steps.FirstOrDefault(s => s.Id == request.StepId)
            ?? throw new NotFoundException("RECIPE_STEP_NOT_FOUND", $"Không tìm thấy bước với Id {request.StepId} trong công thức này.");

        // 5. Ủy quyền cho Domain Method recipe.RemoveStep():
        // Phương thức này xóa phần tử khỏi _steps và tự động chạy vòng lặp đánh lại StepNumber = 1, 2, 3... liên tục cho các bước còn lại
        recipe.RemoveStep(request.StepId);

        // 6. Lưu các thay đổi xuống CSDL PostgreSQL qua Unit of Work
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Xóa cache Redis của công thức này để trang chi tiết cập nhật ngay (Cache Invalidation)
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
