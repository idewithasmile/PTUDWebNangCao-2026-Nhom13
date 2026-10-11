namespace CulinaryBlog.Application.Features.Recipes.DTOs;

public record CreateRecipeStepDto(
    string? Title,
    string Description,
    int? TimerMinutes = null,
    string? ImageUrl = null
);

public record CreateRecipeIngredientDto(
    string Name,
    decimal? Quantity = null,
    string? Unit = null,
    string? Notes = null
);
