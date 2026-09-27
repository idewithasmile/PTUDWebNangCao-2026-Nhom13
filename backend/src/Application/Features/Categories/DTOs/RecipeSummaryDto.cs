using CulinaryBlog.Domain.Enums;

namespace CulinaryBlog.Application.Features.Categories.DTOs;

public record RecipeSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    int PrepTime,
    int CookTime,
    int Servings,
    RecipeDifficulty Difficulty,
    string? ThumbnailUrl,
    string? AuthorName,
    DateTime? PublishedAt);
