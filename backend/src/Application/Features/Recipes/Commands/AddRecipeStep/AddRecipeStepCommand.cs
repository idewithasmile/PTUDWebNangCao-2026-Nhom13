using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeStep;

/// <summary>
/// FR-RCP-010 (Thêm bước): POST /api/v1/recipes/{id}/steps → 201 Created + DTO.
/// StepNumber tự động = Max + 1 (bắt đầu từ 1) trong Recipe.AddStep.
/// TimerMinutes tương ứng DurationMinutes trong SRS.
/// </summary>
public record AddRecipeStepCommand(
    Guid RecipeId,
    string Description,
    string? Title = null,
    int? TimerMinutes = null,
    string? ImageUrl = null) : IRequest<RecipeStepDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
