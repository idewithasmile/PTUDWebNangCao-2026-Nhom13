using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Newsletter.Commands.SubscribeNewsletter;
using CulinaryBlog.Application.Features.Newsletter.DTOs;
using CulinaryBlog.Application.Features.Recipes.Commands.SendRecipeToEmail;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using MockQueryable.Moq;
using Moq;

namespace CulinaryBlog.Application.Tests.Recipes;

public class SendRecipeToEmailCommandHandlerTests
{
    [Fact]
    public void Validator_InvalidServingsAndEmail_ShouldFail()
    {
        var validator = new SendRecipeToEmailCommandValidator();
        var result = validator.Validate(new SendRecipeToEmailCommand(Guid.NewGuid(), "invalid-email", Servings: 101));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(SendRecipeToEmailCommand.Email));
        result.Errors.Should().Contain(e => e.PropertyName == nameof(SendRecipeToEmailCommand.Servings));
    }

    [Fact]
    public async Task Handle_DraftRecipeForAnonymousUser_ThrowsForbiddenException()
    {
        var draftRecipe = Recipe.Create(
            "Phở Bò Bí Truyền",
            "pho-bo-bi-truyen",
            "Mô tả ngắn",
            "Hướng dẫn",
            10,
            20,
            4,
            RecipeDifficulty.Medium,
            Guid.NewGuid(),
            "author-1");

        var recipes = new List<Recipe> { draftRecipe }.AsQueryable();

        var recipeRepo = new Mock<IRecipeRepository>();
        recipeRepo.Setup(r => r.GetQueryable()).Returns(recipes.BuildMock());

        var currentUser = new Mock<ICurrentUser>();
        currentUser.Setup(u => u.IsAuthenticated).Returns(false);

        var handler = new SendRecipeToEmailCommandHandler(
            recipeRepo.Object,
            currentUser.Object,
            Mock.Of<IRecipeEmailDispatcher>(),
            Mock.Of<ISender>(),
            NullLogger<SendRecipeToEmailCommandHandler>.Instance);

        var act = async () => await handler.Handle(
            new SendRecipeToEmailCommand(draftRecipe.Id, "guest@example.com", 4, false),
            CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Handle_PublishedRecipeWithSubscribe_DispatchesEmailAndSubscribesNewsletter()
    {
        var pubRecipe = Recipe.Create(
            "Bún Chả Hà Nội",
            "bun-cha-ha-noi",
            "Mô tả bún chả",
            "Nướng thịt trên than hoa",
            15,
            20,
            2,
            RecipeDifficulty.Easy,
            Guid.NewGuid(),
            "author-1");
        pubRecipe.AddStep("Bước 1", "Ướp thịt");
        pubRecipe.Publish();

        var recipes = new List<Recipe> { pubRecipe }.AsQueryable();

        var recipeRepo = new Mock<IRecipeRepository>();
        recipeRepo.Setup(r => r.GetQueryable()).Returns(recipes.BuildMock());

        var currentUser = new Mock<ICurrentUser>();
        currentUser.Setup(u => u.IsAuthenticated).Returns(false);

        var dispatcher = new Mock<IRecipeEmailDispatcher>();
        var sender = new Mock<ISender>();
        sender.Setup(s => s.Send(It.IsAny<SubscribeNewsletterCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new NewsletterSubscribeResultDto(
                Guid.NewGuid(),
                "reader@example.com",
                null,
                null,
                "RecipeDetail",
                true,
                false,
                DateTime.UtcNow,
                "OK"));

        var handler = new SendRecipeToEmailCommandHandler(
            recipeRepo.Object,
            currentUser.Object,
            dispatcher.Object,
            sender.Object,
            NullLogger<SendRecipeToEmailCommandHandler>.Instance);

        var response = await handler.Handle(
            new SendRecipeToEmailCommand(pubRecipe.Id, "  reader@example.com ", Servings: 6, SubscribeNewsletter: true),
            CancellationToken.None);

        response.Success.Should().BeTrue();
        response.Email.Should().Be("reader@example.com");
        response.Servings.Should().Be(6);

        dispatcher.Verify(
            d => d.DispatchRecipeAsync("reader@example.com", pubRecipe.Id, 6, It.IsAny<CancellationToken>()),
            Times.Once);
        sender.Verify(
            s => s.Send(
                It.Is<SubscribeNewsletterCommand>(c =>
                    c.Email == "reader@example.com" &&
                    c.Source == "RecipeDetail"),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
