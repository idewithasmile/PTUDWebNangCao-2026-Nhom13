using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Services;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;

/// <summary>
/// FR-RCP-008 Delete: DELETE /api/v1/recipes/{id}/images/{imageId} → 204 No Content.
/// </summary>
public class DeleteRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IRecipeImageCleanupService cleanupService,
    ICacheService cacheService)
    : IRequestHandler<DeleteRecipeImageCommand>
{
    public async Task Handle(DeleteRecipeImageCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!currentUser.IsAdmin && !string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền xóa ảnh của công thức người khác.");

        var image = recipe.Images.FirstOrDefault(i => i.Id == request.ImageId)
            ?? throw new NotFoundException("RECIPE_IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId} trong công thức này.");

        // Thu thập URL trước khi xóa entity (gồm biến thể medium/thumbnail nếu khác URL gốc).
        var urlsToDelete = new[] { image.OriginalUrl, image.MediumUrl, image.ThumbnailUrl }
            .Where(u => !string.IsNullOrWhiteSpace(u))
            .Select(u => u!.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();

        recipe.RemoveImage(request.ImageId);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Fire-and-forget: xóa file trên MinIO bất đồng bộ (FR-FILE-002).
        foreach (var url in urlsToDelete)
        {
            await cleanupService.EnqueueDeleteAsync(url, cancellationToken);
        }

        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);
    }
}
