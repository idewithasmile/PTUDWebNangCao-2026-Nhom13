using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;

namespace CulinaryBlog.Application.Features.Recipes.DTOs;

public record RecipeDto(
    Guid Id,
    string Title,
    string Slug,
    RecipeStatus Status,
    string AuthorId,
    Guid CategoryId,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
