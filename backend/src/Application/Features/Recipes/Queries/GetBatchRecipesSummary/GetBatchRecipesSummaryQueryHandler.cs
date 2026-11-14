using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetBatchRecipesSummary;

public class GetBatchRecipesSummaryQueryHandler(IRecipeRepository recipeRepository)
    : IRequestHandler<GetBatchRecipesSummaryQuery, List<RecipeSummaryDto>>
{
    public async Task<List<RecipeSummaryDto>> Handle(GetBatchRecipesSummaryQuery request, CancellationToken cancellationToken)
    {
        if (request.RecipeIds == null || request.RecipeIds.Count == 0)
        {
            return [];
        }

        var distinctIds = request.RecipeIds.Distinct().Take(100).ToList();

        var query = recipeRepository.GetQueryable()
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Include(r => r.Images)
            .Where(r => distinctIds.Contains(r.Id) && !r.IsDeleted && r.Status == RecipeStatus.Published);

        var items = await query
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
                    : null,
                r.ViewCount,
                r.BookmarkCount
            ))
            .ToListAsync(cancellationToken);

        return items;
    }
}
