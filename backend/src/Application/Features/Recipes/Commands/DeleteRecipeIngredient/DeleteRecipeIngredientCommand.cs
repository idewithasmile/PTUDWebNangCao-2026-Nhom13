using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;

/// <summary>
/// FR-RCP-009 (Xóa nguyên liệu): DELETE /api/v1/recipes/{id}/ingredients/{ingId} → 204 No Content.
/// </summary>
public record DeleteRecipeIngredientCommand(Guid RecipeId, Guid IngredientId) : IRequest, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
