using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ToggleRecipeBookmark;

public record ToggleBookmarkResponse(bool IsBookmarked, int BookmarkCount);

public record ToggleRecipeBookmarkCommand(Guid RecipeId, string UserId) : IRequest<ToggleBookmarkResponse>;
