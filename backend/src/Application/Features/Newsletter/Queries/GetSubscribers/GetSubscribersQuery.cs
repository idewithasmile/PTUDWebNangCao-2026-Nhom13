using CulinaryBlog.Application.Features.Newsletter.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Newsletter.Queries.GetSubscribers;

public sealed record GetSubscribersQuery(
    string? SearchTerm = null,
    bool? IsActive = null,
    int Page = 1,
    int PageSize = 15) : IRequest<NewsletterSubscribersListDto>;

public sealed class GetSubscribersQueryHandler(
    INewsletterSubscriberRepository subscriberRepository)
    : IRequestHandler<GetSubscribersQuery, NewsletterSubscribersListDto>
{
    public async Task<NewsletterSubscribersListDto> Handle(GetSubscribersQuery request, CancellationToken ct)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var (items, totalCount, activeCount, unsubscribedCount) = await subscriberRepository.GetPagedAsync(
            request.SearchTerm,
            request.IsActive,
            page,
            pageSize,
            ct);

        var dtos = items.Select(s => new NewsletterSubscriberDto(
            s.Id,
            s.Email,
            s.CustomerName,
            s.FavoriteCategorySlug,
            s.Source,
            s.IsActive,
            s.SubscribedAt,
            s.UnsubscribedAt)).ToList();

        return new NewsletterSubscribersListDto(
            dtos,
            totalCount,
            activeCount,
            unsubscribedCount,
            page,
            pageSize);
    }
}
