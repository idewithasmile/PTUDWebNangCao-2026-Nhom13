using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;

/// <summary>FR-RCP-010 Xóa bước (kèm renumber) → 204 No Content.</summary>
public class DeleteRecipeStepCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeStepCommand>
{
    public async Task Handle(DeleteRecipeStepCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Steps)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa bước của công thức người khác.");

        _ = recipe.Steps.FirstOrDefault(s => s.Id == request.StepId)
            ?? throw new NotFoundException("RECIPE_STEP_NOT_FOUND", $"Không tìm thấy bước với Id {request.StepId} trong công thức này.");

        recipe.RemoveStep(request.StepId);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
