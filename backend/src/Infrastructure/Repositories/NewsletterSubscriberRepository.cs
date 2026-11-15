using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

public class NewsletterSubscriberRepository(CulinaryBlogDbContext dbContext) : INewsletterSubscriberRepository
{
    public Task<NewsletterSubscriber?> GetByEmailAsync(string normalizedEmail, CancellationToken ct = default) =>
        dbContext.NewsletterSubscribers
            .FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail, ct);

    public Task<NewsletterSubscriber?> GetByEmailIgnoreFiltersAsync(string normalizedEmail, CancellationToken ct = default) =>
        dbContext.NewsletterSubscribers
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail, ct);

    public Task<NewsletterSubscriber?> GetByUnsubscribeTokenAsync(string token, CancellationToken ct = default) =>
        dbContext.NewsletterSubscribers
            .FirstOrDefaultAsync(x => x.UnsubscribeToken == token, ct);

    public Task<NewsletterSubscriber?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        dbContext.NewsletterSubscribers
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task AddAsync(NewsletterSubscriber subscriber, CancellationToken ct = default) =>
        await dbContext.NewsletterSubscribers.AddAsync(subscriber, ct);

    public async Task<(IReadOnlyList<NewsletterSubscriber> Items, int TotalCount, int ActiveCount, int UnsubscribedCount)> GetPagedAsync(
        string? searchTerm,
        bool? isActive,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var baseQuery = dbContext.NewsletterSubscribers.AsNoTracking();

        var activeCount = await baseQuery.CountAsync(x => x.IsActive, ct);
        var unsubscribedCount = await baseQuery.CountAsync(x => !x.IsActive, ct);

        var filtered = baseQuery;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLowerInvariant();
            filtered = filtered.Where(x =>
                x.Email.ToLower().Contains(term) ||
                (x.CustomerName != null && x.CustomerName.ToLower().Contains(term)) ||
                (x.FavoriteCategorySlug != null && x.FavoriteCategorySlug.ToLower().Contains(term)));
        }

        if (isActive.HasValue)
        {
            filtered = filtered.Where(x => x.IsActive == isActive.Value);
        }

        var totalCount = await filtered.CountAsync(ct);
        var items = await filtered
            .OrderByDescending(x => x.SubscribedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount, activeCount, unsubscribedCount);
    }

    public async Task<IReadOnlyList<NewsletterSubscriber>> GetAllAsync(bool? isActive, CancellationToken ct = default)
    {
        var query = dbContext.NewsletterSubscribers.AsNoTracking();
        if (isActive.HasValue)
        {
            query = query.Where(x => x.IsActive == isActive.Value);
        }

        return await query
            .OrderByDescending(x => x.SubscribedAt)
            .ToListAsync(ct);
    }
}
