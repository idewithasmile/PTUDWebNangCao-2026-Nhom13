namespace CulinaryBlog.Application.Features.Newsletter.DTOs;

public sealed record NewsletterSubscribeResultDto(
    Guid Id,
    string Email,
    string? CustomerName,
    string? FavoriteCategorySlug,
    string Source,
    bool IsActive,
    bool IsResubscribed,
    DateTime SubscribedAt,
    string Message);

public sealed record NewsletterSubscriberDto(
    Guid Id,
    string Email,
    string? CustomerName,
    string? FavoriteCategorySlug,
    string Source,
    bool IsActive,
    DateTime SubscribedAt,
    DateTime? UnsubscribedAt);

public sealed record NewsletterSubscribersListDto(
    IReadOnlyList<NewsletterSubscriberDto> Items,
    int TotalCount,
    int ActiveCount,
    int UnsubscribedCount,
    int Page,
    int PageSize);
