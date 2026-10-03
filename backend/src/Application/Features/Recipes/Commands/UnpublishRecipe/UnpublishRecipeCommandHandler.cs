using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UnpublishRecipe;

public class UnpublishRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<UnpublishRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(UnpublishRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);
        
        recipe.Unpublish();
        
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
