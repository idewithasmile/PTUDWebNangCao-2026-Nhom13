using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe;

public class ArchiveRecipeCommandHandler(
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<ArchiveRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(ArchiveRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            unitOfWork, currentUser, request.Id, cancellationToken);
        
        recipe.Archive();
        
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
