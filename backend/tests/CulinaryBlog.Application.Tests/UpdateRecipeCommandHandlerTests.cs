using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipe;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class UpdateRecipeCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly UpdateRecipeCommandHandler _handler;

    public UpdateRecipeCommandHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();

        _mockUnitOfWork.Setup(u => u.Recipes).Returns(_mockRecipeRepo.Object);

        _handler = new UpdateRecipeCommandHandler(_mockUnitOfWork.Object, _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_RecipeNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var command = new UpdateRecipeCommand(Guid.NewGuid(), "Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 10m, 10m, 10m, 10m, "dGVzdA==");
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Recipe)null);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_NotAuthor_ThrowsForbiddenException()
    {
        // Arrange
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new UpdateRecipeCommand(recipe.Id, "Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 10m, 10m, 10m, 10m, "dGVzdA==");
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-2"); // Different author

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Handle_SlugExists_ThrowsConflictException()
    {
        // Arrange
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new UpdateRecipeCommand(recipe.Id, "New Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 10m, 10m, 10m, 10m, "dGVzdA==");
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");
        _mockRecipeRepo.Setup(r => r.IsSlugUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false); // Slug is taken by someone else

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>().WithMessage("*đã tồn tại*");
    }

    [Fact]
    public async Task Handle_ConcurrencyConflict_ThrowsConflictException()
    {
        // Arrange
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new UpdateRecipeCommand(recipe.Id, "Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 10m, 10m, 10m, 10m, "dGVzdA==");
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");
        
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DbUpdateConcurrencyException());

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>().WithMessage("*Dữ liệu đã bị thay đổi*");
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsDto()
    {
        // Arrange
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new UpdateRecipeCommand(recipe.Id, "New Title", "Desc", "Instructions", 10, 10, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), 10m, 10m, 10m, 10m, "dGVzdA==");
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");
        _mockRecipeRepo.Setup(r => r.IsSlugUniqueAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("New Title");
        result.Slug.Should().Be("new-title");
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockRecipeRepo.Verify(r => r.SetOriginalRowVersion(recipe, It.IsAny<byte[]>()), Times.Once);
    }
}
