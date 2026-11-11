using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SyncLocalBookmarks;

public record SyncLocalBookmarksResponse(int SyncedCount, int TotalBookmarked);

public record SyncLocalBookmarksCommand(List<Guid> RecipeIds) : IRequest<SyncLocalBookmarksResponse>;
