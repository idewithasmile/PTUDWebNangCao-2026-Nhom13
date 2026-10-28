using CulinaryBlog.Application.Features.Dashboard.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Dashboard.Queries.GetRecentFiles;

public class GetRecentFilesQueryHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetRecentFilesQuery, List<RecentFileDto>>
{
    public async Task<List<RecentFileDto>> Handle(GetRecentFilesQuery request, CancellationToken ct)
    {
        var recipesQuery = recipeRepository.GetQueryable().AsNoTracking();

        if (!currentUser.IsAdmin)
        {
            var userId = currentUser.UserId ?? string.Empty;
            recipesQuery = recipesQuery.Where(r => r.AuthorId == userId);
        }

        var recentItems = await recipesQuery
            .SelectMany(r => r.Images.Select(img => new
            {
                img.Id,
                img.OriginalUrl,
                img.ThumbnailUrl,
                img.IsPrimary,
                img.CreatedAt,
                RecipeId = r.Id,
                RecipeTitle = r.Title
            }))
            .OrderByDescending(x => x.CreatedAt)
            .Take(request.Limit)
            .ToListAsync(ct);

        return recentItems.Select(x =>
        {
            var fileName = !string.IsNullOrEmpty(x.OriginalUrl)
                ? System.IO.Path.GetFileName(x.OriginalUrl)
                : "image.jpg";

            return new RecentFileDto(
                x.Id,
                fileName,
                x.OriginalUrl,
                x.ThumbnailUrl,
                x.IsPrimary,
                x.CreatedAt,
                x.RecipeId,
                x.RecipeTitle
            );
        }).ToList();
    }
}
