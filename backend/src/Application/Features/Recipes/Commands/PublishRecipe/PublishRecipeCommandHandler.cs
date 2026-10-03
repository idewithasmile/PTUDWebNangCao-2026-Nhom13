using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe;

public class PublishRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<PublishRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(PublishRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);
        
        recipe.Publish();
        
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        return new RecipeDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Status,
            recipe.AuthorId,
            recipe.CategoryId,
            recipe.CreatedAt,
            recipe.UpdatedAt);
    }
}
