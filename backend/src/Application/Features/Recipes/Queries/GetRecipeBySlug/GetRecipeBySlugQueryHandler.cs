using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetRecipeBySlug;

public class GetRecipeBySlugQueryHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetRecipeBySlugQuery, RecipeDetailDto>
{
    public async Task<RecipeDetailDto> Handle(GetRecipeBySlugQuery request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetBySlugAsync(request.Slug, cancellationToken);
        if (recipe == null)
        {
            throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Slug '{request.Slug}'.");
        }

        // Authorization Check
        if (recipe.Status != RecipeStatus.Published)
        {
            var userId = currentUser.UserId;
            // TODO: Mở rộng kiểm tra Role Admin nếu cần (vd: currentUser.IsAdmin)
            if (string.IsNullOrEmpty(userId) || recipe.AuthorId != userId)
            {
                throw new ForbiddenException("FORBIDDEN", "Bạn không có quyền xem công thức này.");
            }
        }

        return new RecipeDetailDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Description,
            recipe.Instructions,
            recipe.PrepTimeMinutes,
            recipe.CookTimeMinutes,
            recipe.Servings,
            recipe.Difficulty,
            recipe.Status,
            recipe.CategoryId,
            recipe.Category?.Name ?? string.Empty,
            recipe.AuthorId,
            recipe.Author?.DisplayName ?? "Unknown Author",
            recipe.CreatedAt,
            recipe.UpdatedAt,
            recipe.PublishedAt,
            new RecipeNutritionDto(
                recipe.Nutrition.Calories,
                recipe.Nutrition.Protein,
                recipe.Nutrition.Carbohydrates,
                recipe.Nutrition.Fat
            ),
            recipe.Steps.Select(s => new RecipeStepDto(s.Id, s.StepNumber, s.Title, s.Description, s.TimerMinutes, s.ImageUrl)).ToList(),
            recipe.Ingredients.Select(i => new RecipeIngredientDto(i.Id, i.Name, i.Quantity, i.Unit, i.Notes, i.OrderIndex)).ToList(),
            recipe.Images.Select(i => new RecipeImageDto(i.Id, i.OriginalUrl, i.MediumUrl, i.ThumbnailUrl, i.AltText, i.IsPrimary, i.OrderIndex)).ToList()
        );
    }
}
