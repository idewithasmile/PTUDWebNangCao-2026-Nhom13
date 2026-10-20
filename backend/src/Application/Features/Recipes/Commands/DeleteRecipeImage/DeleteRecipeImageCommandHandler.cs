using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;

public class DeleteRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IFileStorageService fileStorageService)
    : IRequestHandler<DeleteRecipeImageCommand, Unit>
{
    public async Task<Unit> Handle(DeleteRecipeImageCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorizeWithImages(
            recipeRepository, currentUser, request.RecipeId, cancellationToken);

        var targetImage = recipe.Images.FirstOrDefault(img => img.Id == request.ImageId)
            ?? throw new NotFoundException("IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId}");

        var originalUrl = targetImage.OriginalUrl;
        var mediumUrl = targetImage.MediumUrl;
        var thumbnailUrl = targetImage.ThumbnailUrl;

        recipe.RemoveImage(request.ImageId);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Xóa các tệp nhị phân trên MinIO (FR-FILE-002: Idempotent)
        await fileStorageService.DeleteAsync(originalUrl, cancellationToken);
        if (!string.IsNullOrWhiteSpace(mediumUrl))
        {
            await fileStorageService.DeleteAsync(mediumUrl, cancellationToken);
        }
        if (!string.IsNullOrWhiteSpace(thumbnailUrl))
        {
            await fileStorageService.DeleteAsync(thumbnailUrl, cancellationToken);
        }

        return Unit.Value;
    }
}
