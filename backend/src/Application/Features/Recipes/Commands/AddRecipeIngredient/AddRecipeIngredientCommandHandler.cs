using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeIngredient;

/// <summary>FR-RCP-009 Thêm nguyên liệu → 201 Created + DTO.</summary>
public class AddRecipeIngredientCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<AddRecipeIngredientCommand, RecipeIngredientDto>
{
    public async Task<RecipeIngredientDto> Handle(AddRecipeIngredientCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Ingredients)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền thêm nguyên liệu vào công thức của người khác.");

        var ingredient = recipe.AddIngredient(
            request.Name,
            request.Quantity,
            request.Unit,
            request.Notes);

        // SortOrder (nếu client gửi) ghi đè thứ tự tự tăng của domain.
        if (request.SortOrder.HasValue)
        {
            ingredient.Update(request.Name, request.Quantity, request.Unit, request.Notes, request.SortOrder.Value);
        }

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
