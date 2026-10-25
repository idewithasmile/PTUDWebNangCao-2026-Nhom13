namespace CulinaryBlog.Application.Features.Dashboard.DTOs;

public record RecentFileDto(
    Guid Id,
    string FileName,
    string OriginalUrl,
    string? ThumbnailUrl,
    bool IsPrimary,
    DateTime CreatedAt,
    Guid RecipeId,
    string RecipeTitle
);
