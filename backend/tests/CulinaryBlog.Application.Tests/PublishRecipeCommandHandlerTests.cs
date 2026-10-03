using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class PublishRecipeCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly PublishRecipeCommandHandler _handler;

    public PublishRecipeCommandHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockCurrentUser = new Mock<ICurrentUser>();

        _handler = new PublishRecipeCommandHandler(_mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object);
    }

    [Fact]
    public async Task Handle_RecipeNotFound_ThrowsNotFoundException()
    {
        var command = new PublishRecipeCommand(Guid.NewGuid());
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Recipe)null);

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_NotAuthenticated_ThrowsForbiddenException()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new PublishRecipeCommand(recipe.Id);
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(false);

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>().WithMessage("*đăng nhập*");
    }

    [Fact]
    public async Task Handle_NotAuthor_ThrowsForbiddenException()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new PublishRecipeCommand(recipe.Id);
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-2");

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>().WithMessage("*không có quyền*");
    }

    [Fact]
    public async Task Handle_NoSteps_ThrowsDomainException()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        var command = new PublishRecipeCommand(recipe.Id);
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");
        
        // Recipe.Create does not add steps by default, so recipe.Steps.Count is 0.

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<DomainException>(); // "Không thể xuất bản công thức chưa có bước thực hiện."
    }

    [Fact]
    public async Task Handle_ValidCommand_PublishesRecipe()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "author-1", null);
        recipe.AddStep("1", "Step 1"); // Add a step so it can be published
        var command = new PublishRecipeCommand(recipe.Id);
        
        _mockRecipeRepo.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("author-1");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Status.Should().Be(RecipeStatus.Published);
        recipe.Status.Should().Be(RecipeStatus.Published);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
