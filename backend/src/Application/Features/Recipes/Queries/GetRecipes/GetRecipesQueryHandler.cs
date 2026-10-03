using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetRecipes;

public class GetRecipesQueryHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetRecipesQuery, PagedResult<RecipeSummaryDto>>
{
    public async Task<PagedResult<RecipeSummaryDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        var queryable = recipeRepository.GetQueryable()
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Include(r => r.Images)
            .AsNoTracking();

        // 1. Authorization Filter
        var userId = currentUser.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            // Guest chỉ thấy bài Published
            queryable = queryable.Where(r => r.Status == RecipeStatus.Published);
        }
        else
        {
            // Author thấy bài Published của mọi người VÀ mọi bài của chính mình (Draft, Archived)
            // TODO: Nâng cấp check Admin role nếu cần (vd: currentUser.Roles.Contains("Admin") -> cho qua hết)
            queryable = queryable.Where(r => r.Status == RecipeStatus.Published || r.AuthorId == userId);
        }

        // 2. Filters
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            queryable = queryable.Where(r => r.Title.ToLower().Contains(search) || r.Description.ToLower().Contains(search));
        }

        if (request.CategoryId.HasValue)
        {
            queryable = queryable.Where(r => r.CategoryId == request.CategoryId.Value);
        }

        if (request.Difficulty.HasValue)
        {
            queryable = queryable.Where(r => r.Difficulty == request.Difficulty.Value);
        }

        if (request.MaxTotalTimeMinutes.HasValue)
        {
            queryable = queryable.Where(r => (r.PrepTimeMinutes + r.CookTimeMinutes) <= request.MaxTotalTimeMinutes.Value);
        }

        // 3. Sorting
        queryable = request.SortBy?.ToLower() switch
        {
            "oldest" => queryable.OrderBy(r => r.CreatedAt),
            "time_asc" => queryable.OrderBy(r => r.PrepTimeMinutes + r.CookTimeMinutes),
            "time_desc" => queryable.OrderByDescending(r => r.PrepTimeMinutes + r.CookTimeMinutes),
            _ => queryable.OrderByDescending(r => r.CreatedAt) // Mặc định newest
        };

        // 4. Pagination
        var totalCount = await queryable.CountAsync(cancellationToken);

        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : request.PageSize;

        var items = await queryable
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RecipeSummaryDto(
                r.Id,
                r.Title,
                r.Slug,
                r.Description,
                r.PrepTimeMinutes + r.CookTimeMinutes,
                r.Servings,
                r.Difficulty,
                r.Status,
                r.Category != null ? r.Category.Name : string.Empty,
                r.AuthorId,
                r.Author != null ? r.Author.DisplayName : "Unknown Author",
                r.CreatedAt,
                r.Images.FirstOrDefault(i => i.IsPrimary) != null 
                    ? r.Images.FirstOrDefault(i => i.IsPrimary)!.ThumbnailUrl ?? r.Images.FirstOrDefault(i => i.IsPrimary)!.OriginalUrl 
                    : null
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);
    }
}
