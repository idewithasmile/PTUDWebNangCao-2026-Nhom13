using System.Text;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Newsletter.Commands.DeleteSubscriber;
using CulinaryBlog.Application.Features.Newsletter.Commands.SubscribeNewsletter;
using CulinaryBlog.Application.Features.Newsletter.Commands.UnsubscribeNewsletter;
using CulinaryBlog.Application.Features.Newsletter.Queries.ExportSubscribers;
using CulinaryBlog.Application.Features.Newsletter.Queries.GetSubscribers;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace CulinaryBlog.Application.Tests.Newsletter;

public class NewsletterHandlersTests
{
    [Fact]
    public async Task SubscribeNewsletter_NewEmail_CreatesSubscriberAndDispatchesWelcome()
    {
        var repo = new Mock<INewsletterSubscriberRepository>();
        var uow = new Mock<IUnitOfWork>();
        var dispatcher = new Mock<INewsletterEmailDispatcher>();

        repo.Setup(r => r.GetByEmailIgnoreFiltersAsync("LAN@EXAMPLE.COM", It.IsAny<CancellationToken>()))
            .ReturnsAsync((NewsletterSubscriber?)null);

        var handler = new SubscribeNewsletterCommandHandler(
            repo.Object,
            uow.Object,
            dispatcher.Object,
            NullLogger<SubscribeNewsletterCommandHandler>.Instance);

        var result = await handler.Handle(
            new SubscribeNewsletterCommand("  lan@example.com  ", "Lan Anh", "mon-chinh", "HomeBanner"),
            CancellationToken.None);

        result.Email.Should().Be("lan@example.com");
        result.IsActive.Should().BeTrue();
        result.IsResubscribed.Should().BeFalse();
        repo.Verify(r => r.AddAsync(It.Is<NewsletterSubscriber>(s =>
            s.Email == "lan@example.com" &&
            s.NormalizedEmail == "LAN@EXAMPLE.COM" &&
            s.CustomerName == "Lan Anh" &&
            s.FavoriteCategorySlug == "mon-chinh" &&
            s.Source == "HomeBanner"), It.IsAny<CancellationToken>()), Times.Once);
        uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        dispatcher.Verify(d => d.DispatchWelcomeAsync(
            "lan@example.com",
            "Lan Anh",
            "mon-chinh",
            It.IsAny<string>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SubscribeNewsletter_InactiveSubscriber_ResubscribesAndRotatesToken()
    {
        var existing = NewsletterSubscriber.Create("nam@example.com", "Nam", "trang-mieng", "Footer", "old-token");
        existing.Unsubscribe();

        var repo = new Mock<INewsletterSubscriberRepository>();
        var uow = new Mock<IUnitOfWork>();
        var dispatcher = new Mock<INewsletterEmailDispatcher>();

        repo.Setup(r => r.GetByEmailIgnoreFiltersAsync("NAM@EXAMPLE.COM", It.IsAny<CancellationToken>()))
            .ReturnsAsync(existing);

        var handler = new SubscribeNewsletterCommandHandler(
            repo.Object,
            uow.Object,
            dispatcher.Object,
            NullLogger<SubscribeNewsletterCommandHandler>.Instance);

        var result = await handler.Handle(
            new SubscribeNewsletterCommand("nam@example.com", "Hoài Nam", "do-uong", "RecipeDetail"),
            CancellationToken.None);

        result.IsActive.Should().BeTrue();
        result.IsResubscribed.Should().BeTrue();
        existing.UnsubscribeToken.Should().NotBe("old-token");
        existing.Source.Should().Be("RecipeDetail");
        uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        dispatcher.Verify(d => d.DispatchWelcomeAsync(
            "nam@example.com",
            "Hoài Nam",
            "do-uong",
            existing.UnsubscribeToken,
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UnsubscribeNewsletter_ValidToken_MarksInactive()
    {
        var subscriber = NewsletterSubscriber.Create("sub@example.com", "Sub", null, "Footer", "tok-123");
        var repo = new Mock<INewsletterSubscriberRepository>();
        var uow = new Mock<IUnitOfWork>();

        repo.Setup(r => r.GetByUnsubscribeTokenAsync("tok-123", It.IsAny<CancellationToken>()))
            .ReturnsAsync(subscriber);

        var handler = new UnsubscribeNewsletterCommandHandler(repo.Object, uow.Object);
        await handler.Handle(new UnsubscribeNewsletterCommand("tok-123"), CancellationToken.None);

        subscriber.IsActive.Should().BeFalse();
        subscriber.UnsubscribedAt.Should().NotBeNull();
        uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UnsubscribeNewsletter_UnknownToken_ThrowsNotFoundException()
    {
        var repo = new Mock<INewsletterSubscriberRepository>();
        var uow = new Mock<IUnitOfWork>();
        repo.Setup(r => r.GetByUnsubscribeTokenAsync("bad-tok", It.IsAny<CancellationToken>()))
            .ReturnsAsync((NewsletterSubscriber?)null);

        var handler = new UnsubscribeNewsletterCommandHandler(repo.Object, uow.Object);
        var act = async () => await handler.Handle(new UnsubscribeNewsletterCommand("bad-tok"), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeleteSubscriber_ExistingId_SoftDeletesSubscriber()
    {
        var subscriber = NewsletterSubscriber.Create("del@example.com", null, null, "Footer", "tok-del");
        var repo = new Mock<INewsletterSubscriberRepository>();
        var uow = new Mock<IUnitOfWork>();
        repo.Setup(r => r.GetByIdAsync(subscriber.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(subscriber);

        var handler = new DeleteSubscriberCommandHandler(repo.Object, uow.Object);
        await handler.Handle(new DeleteSubscriberCommand(subscriber.Id), CancellationToken.None);

        subscriber.IsDeleted.Should().BeTrue();
        uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetSubscribers_ClampsPaginationAndMapsSummaryCounts()
    {
        var subscriber = NewsletterSubscriber.Create("list@example.com", "Minh", "khaivi", "HomeBanner", "tok");
        var repo = new Mock<INewsletterSubscriberRepository>();
        repo.Setup(r => r.GetPagedAsync("list", true, 1, 100, It.IsAny<CancellationToken>()))
            .ReturnsAsync(([subscriber], 1, 1, 0));

        var handler = new GetSubscribersQueryHandler(repo.Object);
        var result = await handler.Handle(new GetSubscribersQuery("list", true, Page: 0, PageSize: 500), CancellationToken.None);

        result.Page.Should().Be(1);
        result.PageSize.Should().Be(100);
        result.TotalCount.Should().Be(1);
        result.ActiveCount.Should().Be(1);
        result.Items.Should().ContainSingle(i => i.Email == "list@example.com");
    }

    [Fact]
    public async Task ExportSubscribers_ReturnsUtf8BomCsvWithEscapedValues()
    {
        var subscriber = NewsletterSubscriber.Create("csv@example.com", "Nguyễn, An", "mon-nuong", "HomeBanner", "tok");
        var repo = new Mock<INewsletterSubscriberRepository>();
        repo.Setup(r => r.GetAllAsync(null, It.IsAny<CancellationToken>()))
            .ReturnsAsync([subscriber]);

        var handler = new ExportSubscribersQueryHandler(repo.Object);
        var bytes = await handler.Handle(new ExportSubscribersQuery(), CancellationToken.None);

        var preamble = Encoding.UTF8.GetPreamble();
        bytes.Take(preamble.Length).Should().Equal(preamble);
        var csvText = Encoding.UTF8.GetString(bytes, preamble.Length, bytes.Length - preamble.Length);
        csvText.Should().Contain("Id,Email,CustomerName,FavoriteCategorySlug,Source,IsActive,SubscribedAt,UnsubscribedAt");
        csvText.Should().Contain("\"Nguyễn, An\"");
    }
}
