using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;

/// <summary>
/// FR-RCP-010 (Cập nhật bước): PUT /api/v1/recipes/{id}/steps/{stepId} → 200 OK + DTO.
/// Giữ nguyên StepNumber hiện tại (chỉ renumber khi DELETE).
/// </summary>
public record UpdateRecipeStepCommand(
    Guid RecipeId,
    Guid StepId,
    string Description,
    string? Title = null,
    int? TimerMinutes = null,
    string? ImageUrl = null) : IRequest<RecipeStepDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
