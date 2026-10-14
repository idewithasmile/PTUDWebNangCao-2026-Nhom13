using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;

/// <summary>FR-RCP-010 Cập nhật bước → 200 OK + DTO.</summary>
public class UpdateRecipeStepCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<UpdateRecipeStepCommand, RecipeStepDto>
{
    public async Task<RecipeStepDto> Handle(UpdateRecipeStepCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Steps)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa bước của công thức người khác.");

        var step = recipe.Steps.FirstOrDefault(s => s.Id == request.StepId)
            ?? throw new NotFoundException("RECIPE_STEP_NOT_FOUND", $"Không tìm thấy bước với Id {request.StepId} trong công thức này.");

        step.Update(
            step.StepNumber,
            request.Title ?? step.Title,
            request.Description,
            request.TimerMinutes,
            request.ImageUrl);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        return new RecipeStepDto(
            step.Id,
            step.StepNumber,
            step.Title,
            step.Description,
            step.TimerMinutes,
            step.ImageUrl);
    }
}
