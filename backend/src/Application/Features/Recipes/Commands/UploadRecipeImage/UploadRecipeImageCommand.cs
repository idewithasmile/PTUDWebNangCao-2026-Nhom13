using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;

/// <summary>
/// FR-RCP-008 (Upload) + FR-FILE-001: upload ảnh minh họa cho recipe.
/// Endpoint nhận IFormFile, convert sang byte[] rồi dispatch command này
/// (Application layer không được reference IFormFile/Http).
/// </summary>
public record UploadRecipeImageCommand(
    Guid RecipeId,
    byte[] Content,
    string FileName,
    string ContentType,
    string? AltText = null) : IRequest<RecipeImageDto>, ICacheInvalidator
{
    // Tag tổng "recipes" evict qua CacheInvalidationBehavior (Redis).
    // Key chi tiết $"recipe:{slug}" do handler tự evict qua ICacheService
    // vì slug chỉ biết được sau khi load recipe từ DB.
    public IReadOnlyList<string> CacheKeysToInvalidate => ["recipes"];
}
