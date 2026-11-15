using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Domain.Interfaces;

/// <summary>
/// Repository quản lý danh sách email khách hàng đăng ký nhận bản tin ẩm thực.
/// </summary>
public interface INewsletterSubscriberRepository
{
    Task<NewsletterSubscriber?> GetByEmailAsync(string normalizedEmail, CancellationToken ct = default);
    Task<NewsletterSubscriber?> GetByEmailIgnoreFiltersAsync(string normalizedEmail, CancellationToken ct = default);
    Task<NewsletterSubscriber?> GetByUnsubscribeTokenAsync(string token, CancellationToken ct = default);
    Task<NewsletterSubscriber?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(NewsletterSubscriber subscriber, CancellationToken ct = default);
    Task<(IReadOnlyList<NewsletterSubscriber> Items, int TotalCount, int ActiveCount, int UnsubscribedCount)> GetPagedAsync(
        string? searchTerm,
        bool? isActive,
        int page,
        int pageSize,
        CancellationToken ct = default);
    Task<IReadOnlyList<NewsletterSubscriber>> GetAllAsync(bool? isActive, CancellationToken ct = default);
}
