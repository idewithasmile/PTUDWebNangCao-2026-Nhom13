using System.Security.Cryptography;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Newsletter.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Features.Newsletter.Commands.SubscribeNewsletter;

public sealed record SubscribeNewsletterCommand(
    string Email,
    string? CustomerName = null,
    string? FavoriteCategorySlug = null,
    string? Source = "HomeBanner") : IRequest<NewsletterSubscribeResultDto>;

public sealed class SubscribeNewsletterCommandValidator : AbstractValidator<SubscribeNewsletterCommand>
{
    public SubscribeNewsletterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MaximumLength(256);

        RuleFor(x => x.CustomerName)
            .MaximumLength(100).WithMessage("Tên khách hàng tối đa 100 ký tự.")
            .When(x => !string.IsNullOrWhiteSpace(x.CustomerName));

        RuleFor(x => x.FavoriteCategorySlug)
            .MaximumLength(120)
            .When(x => !string.IsNullOrWhiteSpace(x.FavoriteCategorySlug));

        RuleFor(x => x.Source)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.Source));
    }
}

public sealed class SubscribeNewsletterCommandHandler(
    INewsletterSubscriberRepository subscriberRepository,
    IUnitOfWork unitOfWork,
    INewsletterEmailDispatcher emailDispatcher,
    ILogger<SubscribeNewsletterCommandHandler> logger)
    : IRequestHandler<SubscribeNewsletterCommand, NewsletterSubscribeResultDto>
{
    public async Task<NewsletterSubscribeResultDto> Handle(
        SubscribeNewsletterCommand request,
        CancellationToken ct)
    {
        var email = request.Email.Trim();
        var normalizedEmail = email.ToUpperInvariant();
        var existing = await subscriberRepository.GetByEmailIgnoreFiltersAsync(normalizedEmail, ct);

        if (existing is not null)
        {
            var wasInactiveOrDeleted = !existing.IsActive || existing.IsDeleted;
            if (wasInactiveOrDeleted)
            {
                var newToken = GenerateUnsubscribeToken();
                existing.Resubscribe(request.CustomerName, request.FavoriteCategorySlug, request.Source, newToken);
                await unitOfWork.SaveChangesAsync(ct);

                await DispatchWelcomeBestEffortAsync(existing, ct);

                return new NewsletterSubscribeResultDto(
                    existing.Id,
                    existing.Email,
                    existing.CustomerName,
                    existing.FavoriteCategorySlug,
                    existing.Source,
                    existing.IsActive,
                    IsResubscribed: true,
                    existing.SubscribedAt,
                    "Chào mừng bạn quay trở lại! Bạn đã đăng ký nhận bản tin ẩm thực thành công.");
            }

            existing.UpdatePreferences(request.CustomerName, request.FavoriteCategorySlug);
            await unitOfWork.SaveChangesAsync(ct);

            return new NewsletterSubscribeResultDto(
                existing.Id,
                existing.Email,
                existing.CustomerName,
                existing.FavoriteCategorySlug,
                existing.Source,
                existing.IsActive,
                IsResubscribed: false,
                existing.SubscribedAt,
                "Email này đã đăng ký nhận bản tin. Chúng tôi đã cập nhật sở thích ẩm thực của bạn!");
        }

        var token = GenerateUnsubscribeToken();
        var subscriber = NewsletterSubscriber.Create(
            email,
            request.CustomerName,
            request.FavoriteCategorySlug,
            request.Source,
            token);

        await subscriberRepository.AddAsync(subscriber, ct);
        await unitOfWork.SaveChangesAsync(ct);

        await DispatchWelcomeBestEffortAsync(subscriber, ct);

        return new NewsletterSubscribeResultDto(
            subscriber.Id,
            subscriber.Email,
            subscriber.CustomerName,
            subscriber.FavoriteCategorySlug,
            subscriber.Source,
            subscriber.IsActive,
            IsResubscribed: false,
            subscriber.SubscribedAt,
            "Đăng ký nhận bản tin ẩm thực thành công! Hãy kiểm tra hộp thư của bạn nhé.");
    }

    private async Task DispatchWelcomeBestEffortAsync(NewsletterSubscriber subscriber, CancellationToken ct)
    {
        try
        {
            await emailDispatcher.DispatchWelcomeAsync(
                subscriber.Email,
                subscriber.CustomerName,
                subscriber.FavoriteCategorySlug,
                subscriber.UnsubscribeToken,
                ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Không thể enqueue email chào mừng bản tin cho {Email}", subscriber.Email);
        }
    }

    private static string GenerateUnsubscribeToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(24);
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
