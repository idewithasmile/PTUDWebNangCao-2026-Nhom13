using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;

/// <summary>
/// FR-RCP-008 (Delete): xóa entity ảnh khỏi DB + enqueue Hangfire job
/// xóa file trên MinIO bất đồng bộ (FR-FILE-002). Nếu ảnh bị xóa là primary
/// và còn ảnh khác, domain tự promote ảnh còn lại (Recipe.RemoveImage).
/// </summary>
public record DeleteRecipeImageCommand(Guid RecipeId, Guid ImageId) : IRequest, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
