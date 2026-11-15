using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public class NewsletterWelcomeEmailJob(
    IEmailService emailService,
    IRecipeRepository recipeRepository,
    ICategoryRepository categoryRepository,
    IAppUrlService appUrlService,
    ILogger<NewsletterWelcomeEmailJob> logger) : INewsletterWelcomeEmailJob
{
    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 300, 1800 }, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(
        string email,
        string? customerName,
        string? favoriteCategorySlug,
        string unsubscribeToken,
        CancellationToken ct = default)
    {
        logger.LogInformation("FR-NWL: Bắt đầu gửi email chào mừng bản tin tới {Email}", email);

        string? categoryName = null;
        if (!string.IsNullOrWhiteSpace(favoriteCategorySlug))
        {
            var cat = await categoryRepository.GetBySlugAsync(favoriteCategorySlug, ct);
            categoryName = cat?.Name ?? favoriteCategorySlug;
        }

        var query = recipeRepository.GetQueryable()
            .AsNoTracking()
            .Include(r => r.Category)
            .Where(r => !r.IsDeleted && r.Status == RecipeStatus.Published);

        var featured = new List<NewsletterFeaturedRecipeEmailItem>();

        if (!string.IsNullOrWhiteSpace(favoriteCategorySlug))
        {
            var matched = await query
                .Where(r => r.Category != null && r.Category.Slug == favoriteCategorySlug)
                .OrderByDescending(r => r.BookmarkCount)
                .ThenByDescending(r => r.PublishedAt)
                .Take(3)
                .Select(r => new NewsletterFeaturedRecipeEmailItem(
                    r.Title,
                    r.Slug,
                    r.Category != null ? r.Category.Name : "Ẩm thực",
                    r.PrepTimeMinutes + r.CookTimeMinutes))
                .ToListAsync(ct);

            featured.AddRange(matched);
        }

        if (featured.Count < 3)
        {
            var existingSlugs = featured.Select(x => x.Slug).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var fallback = await query
                .Where(r => !existingSlugs.Contains(r.Slug))
                .OrderByDescending(r => r.BookmarkCount)
                .ThenByDescending(r => r.ViewCount)
                .Take(3 - featured.Count)
                .Select(r => new NewsletterFeaturedRecipeEmailItem(
                    r.Title,
                    r.Slug,
                    r.Category != null ? r.Category.Name : "Ẩm thực",
                    r.PrepTimeMinutes + r.CookTimeMinutes))
                .ToListAsync(ct);

            featured.AddRange(fallback);
        }

        var baseUrl = appUrlService.GetFrontendBaseUrl().TrimEnd('/');
        var unsubscribeUrl = $"{baseUrl}/newsletter/unsubscribe?token={Uri.EscapeDataString(unsubscribeToken)}";

        await emailService.SendNewsletterWelcomeEmailAsync(
            email,
            customerName,
            categoryName,
            featured,
            unsubscribeUrl,
            ct);
    }
}
