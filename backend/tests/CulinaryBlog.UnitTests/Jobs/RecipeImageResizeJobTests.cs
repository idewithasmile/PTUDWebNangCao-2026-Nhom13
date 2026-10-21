using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Jobs;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CulinaryBlog.UnitTests.Jobs;

public class RecipeImageResizeJobTests
{
    private readonly Mock<IFileStorageService> _mockFileStorage = new();
    private readonly Mock<IImageProcessingService> _mockImageProcessing = new();
    private readonly Mock<IRecipeRepository> _mockRecipeRepository = new();
    private readonly Mock<IUnitOfWork> _mockUnitOfWork = new();
    private readonly Mock<ICacheService> _mockCacheService = new();
    private readonly Mock<ILogger<RecipeImageResizeJob>> _mockLogger = new();
    private readonly RecipeImageResizeJob _job;

    public RecipeImageResizeJobTests()
    {
        _job = new RecipeImageResizeJob(
            _mockFileStorage.Object,
            _mockImageProcessing.Object,
            _mockRecipeRepository.Object,
            _mockUnitOfWork.Object,
            _mockCacheService.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ValidImage_ProcessesThumbAndMedium_UpdatesEntityAndSaves()
    {
        // Arrange
        var recipeId = Guid.NewGuid();
        var authorId = Guid.NewGuid().ToString();
        var categoryId = Guid.NewGuid();
        var originalUrl = $"/culinary-blog/recipes/{recipeId}/original.jpg";

        var recipe = Recipe.Create(
            "Phở Bò Gia Truyền",
            "pho-bo-gia-truyen",
            "Món phở bò thơm ngon đậm đà",
            "Hướng dẫn nấu",
            30,
            120,
            4,
            RecipeDifficulty.Medium,
            categoryId,
            authorId);

        var image = recipe.AddImage(originalUrl, altText: "Bát phở bò");
        var imageId = image.Id;

        _mockRecipeRepository
            .Setup(r => r.GetByIdWithImagesAsync(recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);

        var fakeStream = new MemoryStream([0xFF, 0xD8, 0xFF, 0xE0, 0, 0, 0, 0]);
        _mockFileStorage
            .Setup(s => s.GetStreamAsync(originalUrl, It.IsAny<CancellationToken>()))
            .ReturnsAsync(fakeStream);

        var fakeThumbBytes = new byte[] { 1, 2, 3 };
        var fakeMediumBytes = new byte[] { 4, 5, 6 };

        _mockImageProcessing
            .Setup(p => p.CreateThumbnailAsync(It.IsAny<Stream>(), 300, 300, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(fakeThumbBytes, "image/jpeg", 300, 300));

        _mockImageProcessing
            .Setup(p => p.CreateMediumAsync(It.IsAny<Stream>(), 800, 600, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(fakeMediumBytes, "image/jpeg", 800, 600));

        string capturedThumbKey = string.Empty;
        string capturedMediumKey = string.Empty;

        _mockFileStorage
            .Setup(s => s.UploadAsync(
                It.IsAny<Stream>(),
                It.Is<string>(k => k.Contains("-thumb")),
                "image/jpeg",
                null,
                It.IsAny<CancellationToken>()))
            .Callback<Stream, string, string, string?, CancellationToken>((_, k, _, _, _) => capturedThumbKey = k)
            .ReturnsAsync((Stream _, string k, string _, string? _, CancellationToken _) => $"/culinary-blog/{k}");

        _mockFileStorage
            .Setup(s => s.UploadAsync(
                It.IsAny<Stream>(),
                It.Is<string>(k => k.Contains("-medium")),
                "image/jpeg",
                null,
                It.IsAny<CancellationToken>()))
            .Callback<Stream, string, string, string?, CancellationToken>((_, k, _, _, _) => capturedMediumKey = k)
            .ReturnsAsync((Stream _, string k, string _, string? _, CancellationToken _) => $"/culinary-blog/{k}");

        // Act
        await _job.ExecuteAsync(recipeId, imageId, originalUrl, CancellationToken.None);

        // Assert
        capturedThumbKey.Should().StartWith($"recipes/{recipeId}/");
        capturedThumbKey.Should().EndWith("-thumb.jpg");

        capturedMediumKey.Should().StartWith($"recipes/{recipeId}/");
        capturedMediumKey.Should().EndWith("-medium.jpg");

        image.ThumbnailUrl.Should().Be($"/culinary-blog/{capturedThumbKey}");
        image.MediumUrl.Should().Be($"/culinary-blog/{capturedMediumKey}");

        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockCacheService.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_StorageError_LogsErrorAndRethrowsForHangfireRetry()
    {
        // Arrange
        var recipeId = Guid.NewGuid();
        var imageId = Guid.NewGuid();
        var originalUrl = $"/culinary-blog/recipes/{recipeId}/original.jpg";

        _mockFileStorage
            .Setup(s => s.GetStreamAsync(originalUrl, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new HttpRequestException("MinIO storage unavailable"));

        // Act
        var act = async () => await _job.ExecuteAsync(recipeId, imageId, originalUrl, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<HttpRequestException>();

        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("FR-JOB-002")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
