using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetMyBookmarks;

public class GetMyBookmarksQueryHandler(
    IRecipeBookmarkRepository bookmarkRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetMyBookmarksQuery, PagedResult<RecipeSummaryDto>>
{
    public async Task<PagedResult<RecipeSummaryDto>> Handle(GetMyBookmarksQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUser.UserId;
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedException("AUTH_REQUIRED", "Bạn cần đăng nhập để xem danh sách món ăn đã lưu.");
        }

        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : (request.PageSize > 50 ? 50 : request.PageSize);

        var query = bookmarkRepository.GetQueryable()
            .Include(b => b.Recipe)
                .ThenInclude(r => r!.Category)
            .Include(b => b.Recipe)
                .ThenInclude(r => r!.Author)
            .Include(b => b.Recipe)
                .ThenInclude(r => r!.Images)
            .Where(b => b.UserId == userId && !b.IsDeleted && b.Recipe != null && !b.Recipe.IsDeleted && b.Recipe.Status == RecipeStatus.Published);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.Trim().ToLower();
            query = query.Where(b => b.Recipe!.Title.ToLower().Contains(searchLower) || b.Recipe.Description.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim();
            query = query.Where(b => b.Recipe!.Category != null && (b.Recipe.Category.Slug == category || b.Recipe.Category.Name == category));
        }

        query = request.SortBy switch
        {
            "views_desc" => query.OrderByDescending(b => b.Recipe!.ViewCount).ThenByDescending(b => b.CreatedAt),
            "views_asc" => query.OrderBy(b => b.Recipe!.ViewCount).ThenByDescending(b => b.CreatedAt),
            "time_asc" => query.OrderBy(b => b.Recipe!.PrepTimeMinutes + b.Recipe!.CookTimeMinutes).ThenByDescending(b => b.CreatedAt),
            "time_desc" => query.OrderByDescending(b => b.Recipe!.PrepTimeMinutes + b.Recipe!.CookTimeMinutes).ThenByDescending(b => b.CreatedAt),
            "title_asc" => query.OrderBy(b => b.Recipe!.Title).ThenByDescending(b => b.CreatedAt),
            "title_desc" => query.OrderByDescending(b => b.Recipe!.Title).ThenByDescending(b => b.CreatedAt),
            _ => query.OrderByDescending(b => b.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new RecipeSummaryDto(
                b.Recipe!.Id,
                b.Recipe.Title,
                b.Recipe.Slug,
                b.Recipe.Description,
                b.Recipe.PrepTimeMinutes + b.Recipe.CookTimeMinutes,
                b.Recipe.Servings,
                b.Recipe.Difficulty,
                b.Recipe.Status,
                b.Recipe.Category != null ? b.Recipe.Category.Name : string.Empty,
                b.Recipe.AuthorId,
                b.Recipe.Author != null ? b.Recipe.Author.DisplayName : "Unknown Author",
                b.Recipe.CreatedAt,
                b.Recipe.Images.FirstOrDefault(i => i.IsPrimary) != null
                    ? b.Recipe.Images.FirstOrDefault(i => i.IsPrimary)!.ThumbnailUrl ?? b.Recipe.Images.FirstOrDefault(i => i.IsPrimary)!.OriginalUrl
                    : null,
                b.Recipe.ViewCount,
                b.Recipe.BookmarkCount
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);
    }
}
