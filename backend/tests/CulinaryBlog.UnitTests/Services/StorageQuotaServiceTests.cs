using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace CulinaryBlog.UnitTests.Services;

public class StorageQuotaServiceTests
{
    private readonly Mock<ILogger<StorageQuotaService>> _mockLogger = new();

    private CulinaryBlogDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new CulinaryBlogDbContext(options);
    }

    [Fact]
    public async Task EnsureRecipeImageLimitNotExceededAsync_WhenCountLessThanMax_DoesNotThrow()
    {
        // Arrange
        using var dbContext = CreateDbContext();
        var recipeId = Guid.NewGuid();

        for (int i = 0; i < 5; i++)
        {
            dbContext.RecipeImages.Add(RecipeImage.Create(recipeId, $"/url{i}.jpg"));
        }
        await dbContext.SaveChangesAsync();

        var options = Options.Create(new StorageQuotaOptions { MaxImagesPerRecipe = 10 });
        var service = new StorageQuotaService(dbContext, options, _mockLogger.Object);

        // Act & Assert
        var act = async () => await service.EnsureRecipeImageLimitNotExceededAsync(recipeId);
        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task EnsureRecipeImageLimitNotExceededAsync_WhenCountReachesMax_ThrowsAppException()
    {
        // Arrange
        using var dbContext = CreateDbContext();
        var recipeId = Guid.NewGuid();

        for (int i = 0; i < 10; i++)
        {
            dbContext.RecipeImages.Add(RecipeImage.Create(recipeId, $"/url{i}.jpg"));
        }
        await dbContext.SaveChangesAsync();

        var options = Options.Create(new StorageQuotaOptions { MaxImagesPerRecipe = 10 });
        var service = new StorageQuotaService(dbContext, options, _mockLogger.Object);

        // Act & Assert
        var act = async () => await service.EnsureRecipeImageLimitNotExceededAsync(recipeId);
        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.StatusCode.Should().Be(400);
        ex.Which.ErrorCode.Should().Be("RECIPE_IMAGE_LIMIT_REACHED");
    }

    [Fact]
    public async Task EnsureUserStorageQuotaNotExceededAsync_WhenStorageExceeded_ThrowsAppException()
    {
        // Arrange
        using var dbContext = CreateDbContext();
        var userId = Guid.NewGuid().ToString();

        var recipe = Recipe.Create(
            "Test Recipe",
            "test-recipe",
            "Description",
            "Instructions",
            10,
            20,
            2,
            CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy,
            Guid.NewGuid(),
            userId);

        dbContext.Recipes.Add(recipe);
        await dbContext.SaveChangesAsync();

        // Add 14 images * 3.5MB = 49MB (close to 50MB)
        for (int i = 0; i < 14; i++)
        {
            dbContext.RecipeImages.Add(RecipeImage.Create(recipe.Id, $"/url{i}.jpg"));
        }
        await dbContext.SaveChangesAsync();

        var options = Options.Create(new StorageQuotaOptions { MaxTotalStorageMbPerUser = 50 });
        var service = new StorageQuotaService(dbContext, options, _mockLogger.Object);

        // Uploading 3MB more will exceed 50MB
        long incomingSize = 3 * 1024 * 1024;

        // Act & Assert
        var act = async () => await service.EnsureUserStorageQuotaNotExceededAsync(userId, incomingSize);
        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.StatusCode.Should().Be(400);
        ex.Which.ErrorCode.Should().Be("STORAGE_QUOTA_EXCEEDED");
    }
}
