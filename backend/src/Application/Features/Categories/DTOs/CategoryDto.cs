namespace CulinaryBlog.Application.Features.Categories.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    int OrderIndex,
    int RecipeCount)
{
    public byte[]? RowVersion { get; init; }
}
