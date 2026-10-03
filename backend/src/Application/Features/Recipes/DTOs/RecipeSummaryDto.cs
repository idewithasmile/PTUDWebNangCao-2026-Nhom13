using CulinaryBlog.Domain.Enums;

namespace CulinaryBlog.Application.Features.Recipes.DTOs;

public record RecipeSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    int TotalTimeMinutes, // PrepTime + CookTime
    int Servings,
    RecipeDifficulty Difficulty,
    RecipeStatus Status,
    string CategoryName,
    string AuthorId,
    string AuthorName,
    DateTime CreatedAt,
    string? ThumbnailUrl // Bổ sung ảnh thumbnail đại diện
);
