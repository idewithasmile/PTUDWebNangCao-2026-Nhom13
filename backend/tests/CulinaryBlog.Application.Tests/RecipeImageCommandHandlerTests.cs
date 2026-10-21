using System.Text;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;
using CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryRecipeImage;
using CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;
using CulinaryBlog.Application.Features.Recipes.Services;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MockQueryable.Moq;
using Moq;

namespace CulinaryBlog.Application.Tests;

public class RecipeImageCommandHandlerTests
{
    private readonly Mock<IRecipeRepository> _mockRecipeRepo;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<ICurrentUser> _mockCurrentUser;
    private readonly Mock<IFileStorageService> _mockFileStorage;
    private readonly Mock<IRecipeImageCleanupService> _mockCleanup;
    private readonly Mock<ICacheService> _mockCache;

    public RecipeImageCommandHandlerTests()
    {
        _mockRecipeRepo = new Mock<IRecipeRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockCurrentUser = new Mock<ICurrentUser>();
        _mockFileStorage = new Mock<IFileStorageService>();
        _mockCleanup = new Mock<IRecipeImageCleanupService>();
        _mockCache = new Mock<ICacheService>();
    }

    private void SetupQueryable(Recipe? recipe)
    {
        var list = recipe is null ? new List<Recipe>() : new List<Recipe> { recipe };
        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(list.AsQueryable().BuildMock());
    }

    [Fact]
    public async Task Upload_RecipeNotFound_ThrowsNotFoundException()
    {
        var recipeId = Guid.NewGuid();
        SetupQueryable(null);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("owner-id");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockFileStorage.Object, _mockCache.Object);

        var command = new UploadRecipeImageCommand(
            recipeId, Encoding.UTF8.GetBytes("fake content"), "test.jpg", "image/jpeg", "Alt");

        var act = async () => await handler.Handle(command, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Upload_NotOwnerAndNotAdmin_ThrowsForbiddenException()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "owner-id", null);
        SetupQueryable(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("different-user");
        _mockCurrentUser.Setup(c => c.IsAdmin).Returns(false);

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockFileStorage.Object, _mockCache.Object);

        var command = new UploadRecipeImageCommand(
            recipe.Id, Encoding.UTF8.GetBytes("fake content"), "test.jpg", "image/jpeg", "Alt");

        var act = async () => await handler.Handle(command, CancellationToken.None);
        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Upload_ValidFile_ReturnsDtoAndSetsPrimaryIfFirst()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "owner-id", null);
        SetupQueryable(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("owner-id");

        _mockFileStorage.Setup(f => f.UploadAsync(
                It.IsAny<Stream>(), It.IsAny<string>(), "image/jpeg", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync("/culinary-blog/recipes/123/test.jpg");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockFileStorage.Object, _mockCache.Object);

        var command = new UploadRecipeImageCommand(
            recipe.Id, Encoding.UTF8.GetBytes("fake content"), "test.jpg", "image/jpeg", "My Alt");

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.OriginalUrl.Should().Be("/culinary-blog/recipes/123/test.jpg");
        result.AltText.Should().Be("My Alt");
        result.IsPrimary.Should().BeTrue(); // First image is automatically primary
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Upload_AdminUser_SucceedsEvenIfNotAuthor()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "owner-id", null);
        SetupQueryable(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("admin-id");
        _mockCurrentUser.Setup(c => c.IsAdmin).Returns(true);

        _mockFileStorage.Setup(f => f.UploadAsync(
                It.IsAny<Stream>(), It.IsAny<string>(), "image/jpeg", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync("/culinary-blog/recipes/123/test.jpg");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockFileStorage.Object, _mockCache.Object);

        var command = new UploadRecipeImageCommand(
            recipe.Id, Encoding.UTF8.GetBytes("fake content"), "test.jpg", "image/jpeg", "Admin Upload");

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.OriginalUrl.Should().Be("/culinary-blog/recipes/123/test.jpg");
    }

    [Fact]
    public async Task SetPrimary_ValidImage_UpdatesPrimaryStatus()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "owner-id", null);
        var img1 = recipe.AddImage("/url1.jpg");
        var img2 = recipe.AddImage("/url2.jpg");

        _mockRecipeRepo.Setup(r => r.GetByIdWithImagesAsync(recipe.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("owner-id");

        var handler = new SetPrimaryRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object);

        var result = await handler.Handle(new SetPrimaryRecipeImageCommand(recipe.Id, img2.Id), CancellationToken.None);

        result.Id.Should().Be(img2.Id);
        result.IsPrimary.Should().BeTrue();
        img1.IsPrimary.Should().BeFalse();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_ValidImage_RemovesAndDeletesFromStorage()
    {
        var recipe = Recipe.Create("Title", "title", "Desc", "Inst", 10, 10, 2, RecipeDifficulty.Easy, Guid.NewGuid(), "owner-id", null);
        var img = recipe.AddImage("/url1.jpg");

        SetupQueryable(recipe);
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns("owner-id");

        var handler = new DeleteRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockCleanup.Object, _mockCache.Object);

        await handler.Handle(new DeleteRecipeImageCommand(recipe.Id, img.Id), CancellationToken.None);

        recipe.Images.Should().BeEmpty();
        _mockCleanup.Verify(f => f.EnqueueDeleteAsync("/url1.jpg", It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
