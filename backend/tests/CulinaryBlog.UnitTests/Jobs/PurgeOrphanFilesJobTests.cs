using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Jobs;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace CulinaryBlog.UnitTests.Jobs;

public class PurgeOrphanFilesJobTests
{
    private readonly Mock<IFileStorageService> _mockFileStorage = new();
    private readonly Mock<ILogger<PurgeOrphanFilesJob>> _mockLogger = new();

    private CulinaryBlogDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new CulinaryBlogDbContext(options);
    }

    [Fact]
    public async Task ExecuteAsync_DeletesOrphanFilesOlderThan24Hours()
    {
        // Arrange
        using var dbContext = CreateDbContext();

        var recipe = Recipe.Create(
            "Món Ăn Test",
            "mon-an-test",
            "Mô tả món ăn",
            "Hướng dẫn nấu",
            15,
            30,
            2,
            CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy,
            Guid.NewGuid(),
            Guid.NewGuid().ToString());

        dbContext.Recipes.Add(recipe);
        await dbContext.SaveChangesAsync();

        var activeImage = RecipeImage.Create(recipe.Id, "/culinary-blog/recipes/test/active-image.jpg");
        dbContext.RecipeImages.Add(activeImage);
        await dbContext.SaveChangesAsync();

        var allMinioFiles = new List<string>
        {
            "recipes/test/active-image.jpg",
            "recipes/orphan/old-orphan-image.jpg",
            "recipes/orphan/recent-orphan-image.jpg"
        };

        _mockFileStorage.Setup(s => s.ListAllFilesAsync(null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(allMinioFiles);

        // Old orphan file was modified 2 days ago (> 24 hours)
        _mockFileStorage.Setup(s => s.GetLastModifiedAsync("recipes/orphan/old-orphan-image.jpg", It.IsAny<CancellationToken>()))
            .ReturnsAsync(DateTimeOffset.UtcNow.AddDays(-2));

        // Recent orphan file was modified 2 hours ago (< 24 hours, should NOT be deleted)
        _mockFileStorage.Setup(s => s.GetLastModifiedAsync("recipes/orphan/recent-orphan-image.jpg", It.IsAny<CancellationToken>()))
            .ReturnsAsync(DateTimeOffset.UtcNow.AddHours(-2));

        var job = new PurgeOrphanFilesJob(dbContext, _mockFileStorage.Object, _mockLogger.Object);

        // Act
        await job.ExecuteAsync(CancellationToken.None);

        // Assert
        // Active image should NOT be deleted
        _mockFileStorage.Verify(s => s.DeleteAsync("recipes/test/active-image.jpg", It.IsAny<CancellationToken>()), Times.Never);

        // Recent orphan (< 24h) should NOT be deleted
        _mockFileStorage.Verify(s => s.DeleteAsync("recipes/orphan/recent-orphan-image.jpg", It.IsAny<CancellationToken>()), Times.Never);

        // Old orphan (> 24h) MUST be deleted
        _mockFileStorage.Verify(s => s.DeleteAsync("recipes/orphan/old-orphan-image.jpg", It.IsAny<CancellationToken>()), Times.Once);
    }
}
