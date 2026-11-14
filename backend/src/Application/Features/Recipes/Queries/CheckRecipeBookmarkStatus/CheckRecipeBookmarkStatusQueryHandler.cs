using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.CheckRecipeBookmarkStatus;

public class CheckRecipeBookmarkStatusQueryHandler(
    IRecipeBookmarkRepository bookmarkRepository,
    ICurrentUser currentUser)
    : IRequestHandler<CheckRecipeBookmarkStatusQuery, bool>
{
    public async Task<bool> Handle(CheckRecipeBookmarkStatusQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        if (string.IsNullOrWhiteSpace(userId))
        {
            return false;
        }

        var bookmark = await bookmarkRepository.GetByUserAndRecipeAsync(userId, request.RecipeId, cancellationToken);
        return bookmark != null;
    }
}
