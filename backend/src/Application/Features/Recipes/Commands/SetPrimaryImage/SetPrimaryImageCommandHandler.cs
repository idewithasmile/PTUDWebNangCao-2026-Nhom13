using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;

/// <summary>
/// FR-RCP-008 Set Primary: Owner upload ảnh lên làm ảnh chính.
/// PATCH /api/v1/recipes/{id}/images/{imageId}/primary → 200 OK.
/// </summary>
public class SetPrimaryImageCommandHandler(
    IRecipeRepository recipeRepository,
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser,
    ICacheService cacheService)
    : IRequestHandler<SetPrimaryImageCommand, RecipeImageDto>
{
    public async Task<RecipeImageDto> Handle(SetPrimaryImageCommand request, CancellationToken cancellationToken)
    {
        var recipe = await recipeRepository.GetQueryable()
            .Include(r => r.Images)
            .Where(r => !r.IsDeleted)
            .FirstOrDefaultAsync(r => r.Id == request.RecipeId, cancellationToken)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.RecipeId}.");

        if (!currentUser.IsAuthenticated || string.IsNullOrEmpty(currentUser.UserId))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");

        if (!string.Equals(recipe.AuthorId, currentUser.UserId, StringComparison.Ordinal))
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn không có quyền sửa ảnh của công thức người khác.");

        var image = recipe.Images.FirstOrDefault(i => i.Id == request.ImageId)
            ?? throw new NotFoundException("RECIPE_IMAGE_NOT_FOUND", $"Không tìm thấy ảnh với Id {request.ImageId} trong công thức này.");

        recipe.SetPrimaryImage(request.ImageId);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await cacheService.RemoveAsync($"recipe:{recipe.Slug}", cancellationToken);

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
