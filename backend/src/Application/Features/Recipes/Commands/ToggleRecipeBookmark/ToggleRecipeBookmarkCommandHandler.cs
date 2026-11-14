using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ToggleRecipeBookmark;

public class ToggleRecipeBookmarkCommandHandler(
    IRecipeRepository recipeRepository,
    IRecipeBookmarkRepository bookmarkRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<ToggleRecipeBookmarkCommand, ToggleBookmarkResponse>
{
    public async Task<ToggleBookmarkResponse> Handle(ToggleRecipeBookmarkCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId ?? request.UserId;
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedException("AUTH_REQUIRED", "Bạn cần đăng nhập để lưu công thức này.");
        }

        var recipe = await recipeRepository.GetByIdAsync(request.RecipeId, cancellationToken);
        if (recipe == null)
        {
            throw new EntityNotFoundException("RECIPE_NOT_FOUND", "Không tìm thấy công thức yêu cầu.");
        }

        var existingBookmark = await bookmarkRepository.GetByUserAndRecipeAsync(userId, request.RecipeId, cancellationToken);

        bool isBookmarked;
        if (existingBookmark != null)
        {
            bookmarkRepository.Delete(existingBookmark);
            recipe.AdjustBookmarkCount(-1);
            isBookmarked = false;
        }
        else
        {
            var newBookmark = RecipeBookmark.Create(userId, request.RecipeId);
            await bookmarkRepository.AddAsync(newBookmark, cancellationToken);
            recipe.AdjustBookmarkCount(1);
            isBookmarked = true;
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new ToggleBookmarkResponse(isBookmarked, recipe.BookmarkCount);
    }
}
