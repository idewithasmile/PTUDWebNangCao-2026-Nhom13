using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace CulinaryBlog.Application.Tests.Features.Recipes.Commands;

public class CreateRecipeCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly CreateRecipeCommandHandler _handler;

    public CreateRecipeCommandHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();

        _handler = new CreateRecipeCommandHandler(_mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_NotAuthenticated_ThrowsForbiddenException()
    {
        // Arrange
        _mockCurrentUser.Setup(c => c.UserId).Returns((string)null);
        var command = new CreateRecipeCommand("Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 100m, 10m, 10m, 10m);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Handle_SlugExists_ThrowsConflictException()
    {
        // Arrange
        _mockCurrentUser.Setup(c => c.UserId).Returns("user-id");
        _mockRecipeRepo.Setup(r => r.IsSlugUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        var command = new CreateRecipeCommand("Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 100m, 10m, 10m, 10m);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>();
    }

    [Fact]
    public async Task Handle_ValidCommand_CreatesRecipeAndReturnsDto()
    {
        // Arrange
        _mockCurrentUser.Setup(c => c.UserId).Returns("user-id");
        _mockRecipeRepo.Setup(r => r.IsSlugUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        var command = new CreateRecipeCommand("My Recipe", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 100m, 10m, 10m, 10m);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("My Recipe");
        result.Slug.Should().Be("my-recipe");
        _mockRecipeRepo.Verify(r => r.AddAsync(It.IsAny<Recipe>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
