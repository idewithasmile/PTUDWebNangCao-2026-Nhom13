using CulinaryBlog.Application.Features.Recipes.Queries.GetRecipes;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MockQueryable.Moq;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class GetRecipesQueryHandlerTests
{
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly GetRecipesQueryHandler _handler;

    public GetRecipesQueryHandlerTests()
    {
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();
        _handler = new GetRecipesQueryHandler(_mockRecipeRepo.Object, _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_Guest_OnlySeesPublishedRecipes()
    {
        // Arrange
        var draftRecipe = Recipe.Create("Draft", "draft", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var pubRecipe = Recipe.Create("Pub", "pub", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        pubRecipe.AddStep("Step 1", "Desc");
        pubRecipe.Publish();

        var recipes = new List<Recipe> { draftRecipe, pubRecipe }.AsQueryable();
        var mockDbSet = recipes.BuildMock();

        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(mockDbSet);
        _mockCurrentUser.Setup(c => c.UserId).Returns((string)null); // Guest

        var query = new GetRecipesQuery();

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.TotalCount.Should().Be(1);
        result.Items.Should().ContainSingle(r => r.Slug == "pub");
    }

    [Fact]
    public async Task Handle_Author_SeesOwnDraftsAndAllPublished()
    {
        // Arrange
        var myDraft = Recipe.Create("My Draft", "my-draft", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var otherDraft = Recipe.Create("Other Draft", "other-draft", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-2", null);
        var otherPub = Recipe.Create("Other Pub", "other-pub", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-2", null);
        otherPub.AddStep("Step 1", "Desc");
        otherPub.Publish();

        var recipes = new List<Recipe> { myDraft, otherDraft, otherPub }.AsQueryable();
        var mockDbSet = recipes.BuildMock();

        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(mockDbSet);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");

        var query = new GetRecipesQuery();

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.TotalCount.Should().Be(2); // myDraft + otherPub
        result.Items.Should().Contain(r => r.Slug == "my-draft");
        result.Items.Should().Contain(r => r.Slug == "other-pub");
    }

    [Fact]
    public async Task Handle_WithSearchTerm_FiltersCorrectly()
    {
        // Arrange
        var r1 = Recipe.Create("Chicken Soup", "slug1", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "a-1", null);
        var r2 = Recipe.Create("Beef Stew", "slug2", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "a-1", null);
        r1.AddStep("s", "s"); r1.Publish();
        r2.AddStep("s", "s"); r2.Publish();

        var recipes = new List<Recipe> { r1, r2 }.AsQueryable();
        var mockDbSet = recipes.BuildMock();

        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(mockDbSet);
        _mockCurrentUser.Setup(c => c.UserId).Returns((string)null);

        var query = new GetRecipesQuery(SearchTerm: "chicken");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.TotalCount.Should().Be(1);
        result.Items.First().Title.Should().Be("Chicken Soup");
    }

    [Fact]
    public async Task Handle_Pagination_WorksCorrectly()
    {
        // Arrange
        var recipes = new List<Recipe>();
        for (int i = 1; i <= 15; i++)
        {
            var r = Recipe.Create($"Recipe {i}", $"slug-{i}", "desc", "inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "a", null);
            r.AddStep("s", "s"); r.Publish();
            recipes.Add(r);
        }

        var mockDbSet = recipes.AsQueryable().BuildMock();
        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(mockDbSet);
        _mockCurrentUser.Setup(c => c.UserId).Returns((string)null);

        var query = new GetRecipesQuery(Page: 2, PageSize: 10, SortBy: "oldest");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.TotalCount.Should().Be(15);
        result.Page.Should().Be(2);
        result.TotalPages.Should().Be(2);
        result.Items.Should().HaveCount(5); // 15 - 10 = 5 items on page 2
    }
}
