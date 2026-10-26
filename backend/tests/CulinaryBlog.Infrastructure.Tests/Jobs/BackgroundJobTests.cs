using System.Text;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CulinaryBlog.Infrastructure.Tests.Jobs;

public class BackgroundJobTests
{
    [Fact]
    public async Task WelcomeEmailJob_ExecuteAsync_ShouldCallEmailService_WhenSuccessful()
    {
        // Arrange
        var mockEmail = new Mock<IEmailService>();
        var mockLogger = new Mock<ILogger<WelcomeEmailJob>>();

        var job = new WelcomeEmailJob(mockEmail.Object, mockLogger.Object);

        // Act
        await job.ExecuteAsync("user@example.com", "Chef John", CancellationToken.None);

        // Assert
        mockEmail.Verify(e => e.SendWelcomeEmailAsync("user@example.com", "Chef John", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task WelcomeEmailJob_ExecuteAsync_ShouldRethrow_WhenEmailServiceFails()
    {
        // Arrange
        var mockEmail = new Mock<IEmailService>();
        mockEmail.Setup(e => e.SendWelcomeEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("SMTP server connection failed"));

        var mockLogger = new Mock<ILogger<WelcomeEmailJob>>();
        var job = new WelcomeEmailJob(mockEmail.Object, mockLogger.Object);

        // Act & Assert
        var act = async () => await job.ExecuteAsync("fail@example.com", "Failed User", CancellationToken.None);
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("SMTP server connection failed");
    }

    [Fact]
    public async Task RecipeImageResizeJob_ExecuteAsync_ShouldProcessThumbAndMedium_WhenImageExists()
    {
        // Arrange
        var recipeId = Guid.NewGuid();
        var imageId = Guid.NewGuid();
        const string originalUrl = "http://localhost:9000/culinary-blog/recipes/original.jpg";

        var mockStorage = new Mock<IFileStorageService>();
        var originalBytes = Encoding.UTF8.GetBytes("fake-image-bytes");
        mockStorage.Setup(s => s.GetStreamAsync(originalUrl, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new MemoryStream(originalBytes));
        mockStorage.Setup(s => s.UploadAsync(It.IsAny<Stream>(), It.Is<string>(k => k.Contains("-thumb")), It.IsAny<string>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync("http://localhost:9000/culinary-blog/recipes/thumb.jpg");
        mockStorage.Setup(s => s.UploadAsync(It.IsAny<Stream>(), It.Is<string>(k => k.Contains("-medium")), It.IsAny<string>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync("http://localhost:9000/culinary-blog/recipes/medium.jpg");

        var mockImageProcessing = new Mock<IImageProcessingService>();
        mockImageProcessing.Setup(p => p.CreateThumbnailAsync(It.IsAny<Stream>(), 300, 300, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(Encoding.UTF8.GetBytes("thumb-bytes"), "image/jpeg", 300, 300));
        mockImageProcessing.Setup(p => p.CreateMediumAsync(It.IsAny<Stream>(), 800, 600, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(Encoding.UTF8.GetBytes("medium-bytes"), "image/jpeg", 800, 600));

        var recipe = Recipe.Create("Bò kho", "bo-kho", "Món bò kho thơm lừng", "Hướng dẫn", 15, 60, 4, RecipeDifficulty.Medium, Guid.NewGuid(), "author-1");
        var image = recipe.AddImage(originalUrl);
        // Force Id to match imageId
        typeof(BaseEntity).GetProperty("Id")!.SetValue(image, imageId);

        var mockRepo = new Mock<IRecipeRepository>();
        mockRepo.Setup(r => r.GetByIdWithImagesAsync(recipeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(recipe);

        var mockUnitOfWork = new Mock<IUnitOfWork>();
        mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var mockCache = new Mock<ICacheService>();
        var mockLogger = new Mock<ILogger<RecipeImageResizeJob>>();

        var job = new RecipeImageResizeJob(
            mockStorage.Object,
            mockImageProcessing.Object,
            mockRepo.Object,
            mockUnitOfWork.Object,
            mockCache.Object,
            mockLogger.Object);

        // Act
        await job.ExecuteAsync(recipeId, imageId, originalUrl, CancellationToken.None);

        // Assert
        image.ThumbnailUrl.Should().Be("http://localhost:9000/culinary-blog/recipes/thumb.jpg");
        image.MediumUrl.Should().Be("http://localhost:9000/culinary-blog/recipes/medium.jpg");
        mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        mockCache.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RecipeImageResizeJob_ExecuteAsync_ShouldSkip_WhenRecipeNotFound()
    {
        // Arrange
        var mockStorage = new Mock<IFileStorageService>();
        mockStorage.Setup(s => s.GetStreamAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new MemoryStream(Encoding.UTF8.GetBytes("bytes")));

        var mockImageProcessing = new Mock<IImageProcessingService>();
        mockImageProcessing.Setup(p => p.CreateThumbnailAsync(It.IsAny<Stream>(), 300, 300, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(Encoding.UTF8.GetBytes("thumb"), "image/jpeg", 300, 300));
        mockImageProcessing.Setup(p => p.CreateMediumAsync(It.IsAny<Stream>(), 800, 600, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ImageResizeResult(Encoding.UTF8.GetBytes("medium"), "image/jpeg", 800, 600));

        var mockRepo = new Mock<IRecipeRepository>();
        mockRepo.Setup(r => r.GetByIdWithImagesAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Recipe?)null);

        var mockUnitOfWork = new Mock<IUnitOfWork>();
        var mockCache = new Mock<ICacheService>();
        var mockLogger = new Mock<ILogger<RecipeImageResizeJob>>();

        var job = new RecipeImageResizeJob(
            mockStorage.Object,
            mockImageProcessing.Object,
            mockRepo.Object,
            mockUnitOfWork.Object,
            mockCache.Object,
            mockLogger.Object);

        // Act
        await job.ExecuteAsync(Guid.NewGuid(), Guid.NewGuid(), "http://any.jpg", CancellationToken.None);

        // Assert
        mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task SitemapService_GenerateSitemapXmlAsync_ShouldIncludeStaticPagesAndPublishedContent()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(databaseName: $"Sitemap_Test_{Guid.NewGuid()}")
            .Options;

        using var dbContext = new CulinaryBlogDbContext(options);

        var category = new Category
        {
            Name = "Món tráng miệng",
            Slug = "mon-trang-mieng",
            IsDeleted = false,
            RowVersion = new byte[8]
        };
        dbContext.Categories.Add(category);

        var recipe = Recipe.Create("Chè sen", "che-sen", "Món chè sen", "Nấu sen", 10, 30, 2, RecipeDifficulty.Easy, category.Id, "author-1");
        recipe.AddStep("Nấu chè", "Ninh sen mềm", 20);
        recipe.Publish(); // Status = Published
        dbContext.Recipes.Add(recipe);

        var draftRecipe = Recipe.Create("Bản nháp", "ban-nhap", "Chưa xong", "Nấu", 5, 5, 1, RecipeDifficulty.Easy, category.Id, "author-1");
        dbContext.Recipes.Add(draftRecipe); // Status = Draft

        await dbContext.SaveChangesAsync();

        var inMemoryConfig = new Dictionary<string, string?>
        {
            ["App:BaseUrl"] = "https://culinaryblog.vn"
        };
        var config = new ConfigurationBuilder().AddInMemoryCollection(inMemoryConfig).Build();
        var mockLogger = new Mock<ILogger<SitemapService>>();

        var sitemapService = new SitemapService(dbContext, config, mockLogger.Object);

        // Act
        var xml = await sitemapService.GenerateSitemapXmlAsync(CancellationToken.None);

        // Assert
        xml.Should().NotBeNullOrWhiteSpace();
        xml.Should().Contain("<?xml version=\"1.0\" encoding=\"utf-8\"");
        xml.Should().Contain("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        xml.Should().Contain("<loc>https://culinaryblog.vn/</loc>");
        xml.Should().Contain("<loc>https://culinaryblog.vn/recipes</loc>");
        xml.Should().Contain("<loc>https://culinaryblog.vn/categories</loc>");
        xml.Should().Contain("<loc>https://culinaryblog.vn/categories/mon-trang-mieng</loc>");
        xml.Should().Contain("<loc>https://culinaryblog.vn/recipes/che-sen</loc>");
        // Draft recipe should not be in sitemap
        xml.Should().NotContain("https://culinaryblog.vn/recipes/ban-nhap");
    }
}
