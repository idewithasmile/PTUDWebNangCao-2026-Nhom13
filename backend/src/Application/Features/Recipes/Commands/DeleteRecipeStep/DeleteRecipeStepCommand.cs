using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;

/// <summary>
/// FR-RCP-010 (Xóa bước): DELETE /api/v1/recipes/{id}/steps/{stepId} → 204 No Content.
/// Recipe.RemoveStep tự renumber các bước còn lại liên tục (1, 2, 3...).
/// </summary>
public record DeleteRecipeStepCommand(Guid RecipeId, Guid StepId) : IRequest, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
