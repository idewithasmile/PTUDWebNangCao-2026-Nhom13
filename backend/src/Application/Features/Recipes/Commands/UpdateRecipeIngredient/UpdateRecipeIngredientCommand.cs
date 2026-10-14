using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;

/// <summary>
/// FR-RCP-009 (Cập nhật nguyên liệu): PUT /api/v1/recipes/{id}/ingredients/{ingId} → 200 OK + DTO.
/// </summary>
public record UpdateRecipeIngredientCommand(
    Guid RecipeId,
    Guid IngredientId,
    string Name,
    decimal? Quantity,
    string? Unit,
    string? Notes = null,
    int? SortOrder = null) : IRequest<RecipeIngredientDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
