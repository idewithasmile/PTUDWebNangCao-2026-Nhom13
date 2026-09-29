using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.Queries.GetRecipeBySlug;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class GetRecipeBySlugQueryHandlerTests
{
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly GetRecipeBySlugQueryHandler _handler;

    public GetRecipeBySlugQueryHandlerTests()
    {
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();
        _handler = new GetRecipeBySlugQueryHandler(_mockRecipeRepo.Object, _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_RecipeNotFound_ThrowsNotFoundException()
    {
        // Arrange
        _mockRecipeRepo.Setup(r => r.GetBySlugAsync("not-found", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Recipe)null);

        var query = new GetRecipeBySlugQuery("not-found");

        // Act
        var act = async () => await _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_RecipeIsDraftAndUserIsNotAuthor_ThrowsForbiddenException()
    {
        // Arrange
        var recipe = Recipe.Create("Draft Recipe", "draft", "desc", "inst", 10, 10, 2, Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        // Default status is Draft
        
        _mockRecipeRepo.Setup(r => r.GetBySlugAsync("draft", It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-2");

        var query = new GetRecipeBySlugQuery("draft");

        // Act
        var act = async () => await _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Handle_RecipeIsDraftAndUserIsAuthor_ReturnsDto()
    {
        // Arrange
        var recipe = Recipe.Create("Draft Recipe", "draft", "desc", "inst", 10, 10, 2, Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        
        _mockRecipeRepo.Setup(r => r.GetBySlugAsync("draft", It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");

        var query = new GetRecipeBySlugQuery("draft");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Draft Recipe");
    }

    [Fact]
    public async Task Handle_RecipeIsPublished_ReturnsDtoForAnyUser()
    {
        // Arrange
        var recipe = Recipe.Create("Pub Recipe", "pub", "desc", "inst", 10, 10, 2, Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        recipe.AddStep("Step 1", "Desc");
        recipe.Publish(); // Needs at least 1 step to publish
        
        _mockRecipeRepo.Setup(r => r.GetBySlugAsync("pub", It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("some-other-user"); // Can be anonymous or another user

        var query = new GetRecipeBySlugQuery("pub");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Pub Recipe");
        result.Steps.Should().HaveCount(1);
    }
}
