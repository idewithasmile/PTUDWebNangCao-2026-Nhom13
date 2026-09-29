using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

public record CreateRecipeCommand(
    string Title,
    string Description,
    string Instructions,
    int PrepTimeMinutes,
    int CookTimeMinutes,
    int Servings,
    RecipeDifficulty Difficulty,
    Guid CategoryId,
    decimal Calories,
    decimal Protein,
    decimal Carbs,
    decimal Fat) : IRequest<RecipeDto>;
