using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;

/// <summary>FR-RCP-009 Cập nhật nguyên liệu → 200 OK + DTO.</summary>
public class UpdateRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<UpdateRecipeIngredientCommand, RecipeIngredientDto>
{
    public async Task<RecipeIngredientDto> Handle(UpdateRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa nguyên liệu của công thức người khác.");

        var ingredient = recipe.Ingredients.FirstOrDefault(i => i.Id == request.IngredientId)
            ?? throw new NotFoundException("RECIPE_INGREDIENT_NOT_FOUND", $"Không tìm thấy nguyên liệu với Id {request.IngredientId} trong công thức này.");

        ingredient.Update(
            request.Name,
            request.Quantity,
            request.Unit,
            request.Notes,
            request.SortOrder ?? ingredient.OrderIndex);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

        return new RecipeIngredientDto(
            ingredient.Id,
            ingredient.Name,
            ingredient.Quantity,
            ingredient.Unit,
            ingredient.Notes,
            ingredient.OrderIndex);
    }
}
