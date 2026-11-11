using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SyncLocalBookmarks;

public class SyncLocalBookmarksCommandHandler(
    IRecipeBookmarkRepository bookmarkRepository,
    IRecipeRepository recipeRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<SyncLocalBookmarksCommand, SyncLocalBookmarksResponse>
{
    public async Task<SyncLocalBookmarksResponse> Handle(SyncLocalBookmarksCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedException("AUTH_REQUIRED", "Bạn cần đăng nhập để đồng bộ danh sách món đã lưu.");
        }

        if (request.RecipeIds == null || request.RecipeIds.Count == 0)
        {
            var total = await bookmarkRepository.GetQueryable().CountAsync(b => b.UserId == userId && !b.IsDeleted, cancellationToken);
            return new SyncLocalBookmarksResponse(0, total);
        }

        var existingIds = await bookmarkRepository.GetQueryable()
            .Where(b => b.UserId == userId && !b.IsDeleted)
            .Select(b => b.RecipeId)
            .ToListAsync(cancellationToken);

        var toAddIds = request.RecipeIds.Distinct().Except(existingIds).ToList();
        int synced = 0;

        foreach (var recipeId in toAddIds)
        {
            var recipe = await recipeRepository.GetByIdAsync(recipeId, cancellationToken);
            if (recipe != null && !recipe.IsDeleted && recipe.Status == Domain.Enums.RecipeStatus.Published)
            {
                var bookmark = RecipeBookmark.Create(userId, recipeId);
                await bookmarkRepository.AddAsync(bookmark, cancellationToken);
                recipe.AdjustBookmarkCount(1);
                synced++;
            }
        }

        if (synced > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        var newTotal = await bookmarkRepository.GetQueryable().CountAsync(b => b.UserId == userId && !b.IsDeleted, cancellationToken);
        return new SyncLocalBookmarksResponse(synced, newTotal);
    }
}
