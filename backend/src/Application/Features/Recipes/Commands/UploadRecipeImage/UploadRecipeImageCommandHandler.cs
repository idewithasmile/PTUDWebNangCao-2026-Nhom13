using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;

public class UploadRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    IFileStorageService fileStorageService)
    : IRequestHandler<UploadRecipeImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(UploadRecipeImageCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorizeWithImages(
            recipeRepository, currentUser, request.RecipeId, cancellationToken);

        var originalUrl = await fileStorageService.UploadAsync(
            request.FileStream,
            request.FileName,
            request.ContentType,
            $"recipes/{recipe.Id}",
            cancellationToken);

        var image = recipe.AddImage(originalUrl, altText: request.AltText);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new RecipeImageDto(
            image.Id,
            image.OriginalUrl,
            image.MediumUrl,
            image.ThumbnailUrl,
            image.AltText,
            image.IsPrimary,
            image.OrderIndex);
    }
}
