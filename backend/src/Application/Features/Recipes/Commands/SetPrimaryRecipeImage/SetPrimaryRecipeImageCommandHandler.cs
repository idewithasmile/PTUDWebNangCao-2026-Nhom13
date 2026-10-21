using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryRecipeImage;

public class SetPrimaryRecipeImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<SetPrimaryRecipeImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(SetPrimaryRecipeImageCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorizeWithImages(
            recipeRepository, currentUser, request.RecipeId, cancellationToken);

        var targetImage = recipe.Images.FirstOrDefault(img => img.Id == request.ImageId)
            ?? throw new NotFoundException("IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId}");

        recipe.SetPrimaryImage(request.ImageId);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new RecipeImageDto(
            targetImage.Id,
            targetImage.OriginalUrl,
            targetImage.MediumUrl,
            targetImage.ThumbnailUrl,
            targetImage.AltText,
            targetImage.IsPrimary,
            targetImage.OrderIndex);
    }
}
