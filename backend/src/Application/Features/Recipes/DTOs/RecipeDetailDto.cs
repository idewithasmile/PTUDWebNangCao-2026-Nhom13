using CulinaryBlog.Domain.Enums;

namespace CulinaryBlog.Application.Features.Recipes.DTOs;

public record RecipeDetailDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string Instructions,
    int PrepTimeMinutes,
    int CookTimeMinutes,
    int Servings,
    RecipeDifficulty Difficulty,
    RecipeStatus Status,
    Guid CategoryId,
    string CategoryName,
    string AuthorId,
    string AuthorName, // Sẽ lấy từ Author.DisplayName (tuân thủ SPEC.md displayName)
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? PublishedAt,
    RecipeNutritionDto Nutrition,
    List<RecipeStepDto> Steps,
    List<RecipeIngredientDto> Ingredients,
    List<RecipeImageDto> Images
);

public record RecipeNutritionDto(
    decimal? Calories,
    decimal? Protein,
    decimal? Carbohydrates,
    decimal? Fat
);

public record RecipeStepDto(
    Guid Id,
    int StepNumber,
    string Title,
    string Description,
    int? TimerMinutes,
    string? ImageUrl
);

public record RecipeIngredientDto(
    Guid Id,
    string Name,
    decimal? Quantity,
    string? Unit,
    string? Notes,
    int OrderIndex
);

public record RecipeImageDto(
    Guid Id,
    string OriginalUrl,
    string? MediumUrl,
    string? ThumbnailUrl,
    string? AltText,
    bool IsPrimary,
    int OrderIndex
);
