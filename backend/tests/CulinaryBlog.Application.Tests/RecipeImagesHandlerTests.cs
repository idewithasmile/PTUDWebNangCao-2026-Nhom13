using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;
using CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;
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

/// <summary>
/// FR-RCP-008: test handler thật với entity Recipe thật (AddImage/SetPrimaryImage/
/// RemoveImage chạy logic domain thật). Chỉ mock biên Infrastructure
/// (IFileStorageService, IRecipeImageCleanupService, ICacheService, repo, uow).
/// </summary>
public class RecipeImagesHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork = new();
    private readonly Mock<IRecipeRepository> _mockRecipeRepo = new();
    private readonly Mock<ICurrentUser> _mockCurrentUser = new();
    private readonly Mock<ICacheService> _mockCache = new();
    private readonly Mock<IFileStorageService> _mockStorage = new();
    private readonly Mock<IRecipeImageCleanupService> _mockCleanup = new();

    private static Recipe NewRecipe(string authorId = "author-1")
        => Recipe.Create("Pho Bo Ha Noi", "pho-bo-ha-noi", "Mo ta", "Huong dan",
            10, 20, 2, RecipeDifficulty.Easy, Guid.NewGuid(), authorId, null);

    private void SetupQueryable(Recipe? recipe)
    {
        var list = recipe is null ? new List<Recipe>() : new List<Recipe> { recipe };
        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(list.AsQueryable().BuildMock());
    }

    private void SetupOwner(string authorId = "author-1")
    {
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns(authorId);
    }

    // ---- Upload ----

    [Fact]
    public async Task Upload_FirstImage_BecomesPrimary()
    {
        var recipe = NewRecipe();
        SetupQueryable(recipe);
        SetupOwner();
        _mockStorage.Setup(s => s.UploadAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("/culinary-blog/recipes/x/img1.jpg");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockStorage.Object, _mockCache.Object);
        var result = await handler.Handle(
            new UploadRecipeImageCommand(recipe.Id, [0xFF, 0xD8, 0xFF], "anh.jpg", "image/jpeg", "Phở bò"), CancellationToken.None);

        result.IsPrimary.Should().BeTrue();
        result.OriginalUrl.Should().Be("/culinary-blog/recipes/x/img1.jpg");
        recipe.Images.Should().ContainSingle();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockCache.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Upload_SecondImage_IsNotPrimary_FirstStaysPrimary()
    {
        var recipe = NewRecipe();
        recipe.AddImage("https://cdn/img1.jpg");
        SetupQueryable(recipe);
        SetupOwner();
        _mockStorage.Setup(s => s.UploadAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("https://cdn/img2.jpg");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockStorage.Object, _mockCache.Object);
        var result = await handler.Handle(
            new UploadRecipeImageCommand(recipe.Id, [0x89, 0x50, 0x4E, 0x47], "anh2.png", "image/png"), CancellationToken.None);

        result.IsPrimary.Should().BeFalse();
        recipe.Images.Should().HaveCount(2);
        recipe.Images.Single(i => i.OriginalUrl == "https://cdn/img1.jpg").IsPrimary.Should().BeTrue();
    }

    [Fact]
    public async Task Upload_RecipeNotFound_ThrowsNotFound()
    {
        SetupQueryable(null);
        SetupOwner();

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockStorage.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new UploadRecipeImageCommand(Guid.NewGuid(), [0x01], "a.jpg", "image/jpeg"), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_NOT_FOUND");
    }

    [Fact]
    public async Task Upload_NotOwner_ThrowsForbidden()
    {
        var recipe = NewRecipe("author-1");
        SetupQueryable(recipe);
        SetupOwner("author-2");

        var handler = new UploadRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockStorage.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new UploadRecipeImageCommand(recipe.Id, [0x01], "a.jpg", "image/jpeg"), CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>();
    }

    // ---- SetPrimary ----

    [Fact]
    public async Task SetPrimary_SwitchesPrimaryFlag()
    {
        var recipe = NewRecipe();
        var img1 = recipe.AddImage("https://cdn/img1.jpg");
        var img2 = recipe.AddImage("https://cdn/img2.jpg");
        img1.IsPrimary.Should().BeTrue();
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new SetPrimaryImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(new SetPrimaryImageCommand(recipe.Id, img2.Id), CancellationToken.None);

        result.Id.Should().Be(img2.Id);
        result.IsPrimary.Should().BeTrue();
        img1.IsPrimary.Should().BeFalse();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SetPrimary_ImageNotInRecipe_ThrowsNotFound()
    {
        var recipe = NewRecipe();
        recipe.AddImage("https://cdn/img1.jpg");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new SetPrimaryImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new SetPrimaryImageCommand(recipe.Id, Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_IMAGE_NOT_FOUND");
    }

    // ---- Delete ----

    [Fact]
    public async Task Delete_PrimaryImage_RemovesEntity_PromotesNext_EnqueuesCleanup()
    {
        var recipe = NewRecipe();
        var img1 = recipe.AddImage("https://cdn/img1.jpg");
        recipe.AddImage("https://cdn/img2.jpg");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new DeleteRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockCleanup.Object, _mockCache.Object);
        await handler.Handle(new DeleteRecipeImageCommand(recipe.Id, img1.Id), CancellationToken.None);

        recipe.Images.Should().ContainSingle();
        recipe.Images.First().IsPrimary.Should().BeTrue();
        recipe.Images.First().OriginalUrl.Should().Be("https://cdn/img2.jpg");
        _mockCleanup.Verify(c => c.EnqueueDeleteAsync("https://cdn/img1.jpg", It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockCache.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_ImageNotInRecipe_ThrowsNotFound_AndNoCleanupEnqueued()
    {
        var recipe = NewRecipe();
        recipe.AddImage("https://cdn/img1.jpg");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new DeleteRecipeImageCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object,
            _mockCleanup.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new DeleteRecipeImageCommand(recipe.Id, Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_IMAGE_NOT_FOUND");
        _mockCleanup.Verify(c => c.EnqueueDeleteAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
