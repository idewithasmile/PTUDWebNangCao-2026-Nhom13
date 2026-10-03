using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipe;

public class DeleteRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<DeleteRecipeCommand, Unit>
{
    public async Task<Unit> Handle(DeleteRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = await RecipeAuthorizationHelper.LoadAndAuthorize(
            recipeRepository, currentUser, request.Id, cancellationToken);

        // Soft delete (IsDeleted = true)
        recipeRepository.SoftDelete(recipe);
        
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}
