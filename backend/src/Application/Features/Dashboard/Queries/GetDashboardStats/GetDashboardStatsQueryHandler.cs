using CulinaryBlog.Application.Features.Dashboard.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Dashboard.Queries.GetDashboardStats;

public class GetDashboardStatsQueryHandler(
    IRecipeRepository recipeRepository,
    ICategoryRepository categoryRepository,
    ICurrentUser currentUser,
    UserManager<ApplicationUser> userManager)
    : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken ct)
    {
        var isSystemScope = currentUser.IsAdmin && request.OnlyMine != true;
        var userId = currentUser.UserId;

        var recipesQuery = recipeRepository.GetQueryable().AsNoTracking();

        if (!isSystemScope)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return new DashboardStatsDto(0, 0, 0, 0, null, [], [], false);
            }
            recipesQuery = recipesQuery.Where(r => r.AuthorId == userId);
        }

        var total = await recipesQuery.CountAsync(ct);
        var published = await recipesQuery.CountAsync(r => r.Status == RecipeStatus.Published, ct);
        var draft = await recipesQuery.CountAsync(r => r.Status == RecipeStatus.Draft, ct);
        var archived = await recipesQuery.CountAsync(r => r.Status == RecipeStatus.Archived, ct);

        int? totalAuthors = null;
        if (isSystemScope)
        {
            var authors = await userManager.GetUsersInRoleAsync("Author");
            totalAuthors = authors.Count;
        }

        // Phân bố danh mục
        var categoryDist = new List<CategoryDistributionDto>();
        if (isSystemScope)
        {
            var categoriesWithCount = await categoryRepository.GetAllWithRecipeCountAsync(ct);
            var sumCount = categoriesWithCount.Sum(c => c.RecipeCount);
            categoryDist = categoriesWithCount
                .OrderByDescending(c => c.RecipeCount)
                .Select(c => new CategoryDistributionDto(
                    c.Category.Id,
                    c.Category.Name,
                    c.RecipeCount,
                    sumCount > 0 ? Math.Round((double)c.RecipeCount / sumCount * 100, 1) : 0
                ))
                .ToList();
        }
        else
        {
            var userCatCounts = await recipesQuery
                .Include(r => r.Category)
                .Where(r => r.Category != null)
                .GroupBy(r => new { r.CategoryId, r.Category!.Name })
                .Select(g => new { g.Key.CategoryId, g.Key.Name, Count = g.Count() })
                .ToListAsync(ct);

            var sumCount = userCatCounts.Sum(c => c.Count);
            categoryDist = userCatCounts
                .OrderByDescending(c => c.Count)
                .Select(c => new CategoryDistributionDto(
                    c.CategoryId,
                    c.Name,
                    c.Count,
                    sumCount > 0 ? Math.Round((double)c.Count / sumCount * 100, 1) : 0
                ))
                .ToList();
        }

        // 7 ngày gần đây
        var now = DateTime.UtcNow.Date;
        var sevenDaysAgo = now.AddDays(-6);
        var recentRecipes = await recipesQuery
            .Where(r => r.CreatedAt >= sevenDaysAgo)
            .Select(r => r.CreatedAt)
            .ToListAsync(ct);

        var activity7Days = new List<DailyActivityDto>();
        for (int i = 6; i >= 0; i--)
        {
            var date = now.AddDays(-i);
            var dateStr = date.ToString("dd/MM");
            var count = recentRecipes.Count(d => d.Date == date);
            activity7Days.Add(new DailyActivityDto(dateStr, count));
        }

        return new DashboardStatsDto(
            total,
            published,
            draft,
            archived,
            totalAuthors,
            categoryDist,
            activity7Days,
            isSystemScope
        );
    }
}
