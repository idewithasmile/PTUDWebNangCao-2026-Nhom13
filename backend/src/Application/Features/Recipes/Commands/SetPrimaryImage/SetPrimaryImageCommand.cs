using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;

/// <summary>
/// FR-RCP-008 (Set Primary): đặt một ảnh làm ảnh chính của recipe,
/// các ảnh còn lại tự chuyển IsPrimary = false (logic trong Recipe.SetPrimaryImage).
/// </summary>
public record SetPrimaryImageCommand(Guid RecipeId, Guid ImageId) : IRequest<RecipeImageDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
