using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.Commands.ToggleRecipeBookmark;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class ToggleRecipeBookmarkCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<IRecipeBookmarkRepository> _mockBookmarkRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly ToggleRecipeBookmarkCommandHandler _handler;

    public ToggleRecipeBookmarkCommandHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockBookmarkRepo = new Mock<IRecipeBookmarkRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();

        _handler = new ToggleRecipeBookmarkCommandHandler(
            _mockRecipeRepo.Object,
            _mockBookmarkRepo.Object,
            _mockUnitOfWork.Object,
            _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_WhenNotAuthenticated_ThrowsUnauthorizedException()
    {
        _mockCurrentUser.Setup(u => u.UserId).Returns((string)null);

        var command = new ToggleRecipeBookmarkCommand(Guid.NewGuid(), string.Empty);
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<UnauthorizedException>();
    }

    [Fact]
    public async Task Handle_RecipeNotFound_ThrowsEntityNotFoundException()
    {
        var userId = "user123";
        var recipeId = Guid.NewGuid();
        _mockCurrentUser.Setup(u => u.UserId).Returns(userId);
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Recipe)null);

        var command = new ToggleRecipeBookmarkCommand(recipeId, userId);
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<EntityNotFoundException>();
    }

    [Fact]
    public async Task Handle_WhenNotBookmarkedYet_AddsBookmarkAndIncrementsCount()
    {
        var userId = "user123";
        var recipeId = Guid.NewGuid();
        var recipe = Recipe.Create("Món ngon", "mon-ngon", "Mô tả", "Hướng dẫn", 10, 20, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author1");

        _mockCurrentUser.Setup(u => u.UserId).Returns(userId);
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockBookmarkRepo.Setup(b => b.GetByUserAndRecipeAsync(userId, recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((RecipeBookmark)null);

        var command = new ToggleRecipeBookmarkCommand(recipeId, userId);
        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsBookmarked.Should().BeTrue();
        result.BookmarkCount.Should().Be(1);
        recipe.BookmarkCount.Should().Be(1);
        _mockBookmarkRepo.Verify(b => b.AddAsync(It.IsAny<RecipeBookmark>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenAlreadyBookmarked_RemovesBookmarkAndDecrementsCount()
    {
        var userId = "user123";
        var recipeId = Guid.NewGuid();
        var recipe = Recipe.Create("Món ngon", "mon-ngon", "Mô tả", "Hướng dẫn", 10, 20, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author1");
        recipe.AdjustBookmarkCount(1); // Giả lập đang có 1 bookmark

        var existingBookmark = RecipeBookmark.Create(userId, recipeId);

        _mockCurrentUser.Setup(u => u.UserId).Returns(userId);
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockBookmarkRepo.Setup(b => b.GetByUserAndRecipeAsync(userId, recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingBookmark);

        var command = new ToggleRecipeBookmarkCommand(recipeId, userId);
        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsBookmarked.Should().BeFalse();
        result.BookmarkCount.Should().Be(0);
        recipe.BookmarkCount.Should().Be(0);
        _mockBookmarkRepo.Verify(b => b.Delete(existingBookmark), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
