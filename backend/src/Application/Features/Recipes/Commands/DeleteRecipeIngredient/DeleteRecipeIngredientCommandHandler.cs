using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;

/// <summary>FR-RCP-009 Xóa nguyên liệu → 204 No Content.</summary>
public class DeleteRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeIngredientCommand>
{
    public async Task Handle(DeleteRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa nguyên liệu của công thức người khác.");

        _ = recipe.Ingredients.FirstOrDefault(i => i.Id == request.IngredientId)
            ?? throw new NotFoundException("RECIPE_INGREDIENT_NOT_FOUND", $"Không tìm thấy nguyên liệu với Id {request.IngredientId} trong công thức này.");

        recipe.RemoveIngredient(request.IngredientId);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
