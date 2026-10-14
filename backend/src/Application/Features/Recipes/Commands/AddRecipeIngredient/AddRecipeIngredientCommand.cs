using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeIngredient;

/// <summary>
/// FR-RCP-009 (Thêm nguyên liệu): POST /api/v1/recipes/{id}/ingredients → 201 Created.
/// OrderIndex tự tăng (Max + 1) trong Recipe.AddIngredient; SortOrder (nếu gửi)
/// dùng để ghi đè thứ tự hiển thị mong muốn.
/// </summary>
public record AddRecipeIngredientCommand(
    Guid RecipeId,
    string Name,
    decimal? Quantity,
    string? Unit,
    string? Notes = null,
    int? SortOrder = null) : IRequest<RecipeIngredientDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
