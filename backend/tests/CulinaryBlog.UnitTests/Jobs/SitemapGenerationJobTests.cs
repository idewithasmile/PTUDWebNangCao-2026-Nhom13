using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Jobs;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace CulinaryBlog.UnitTests.Jobs;

public class SitemapGenerationJobTests
{
    private readonly Mock<ISitemapService> _mockSitemapService = new();
    private readonly Mock<IFileStorageService> _mockFileStorage = new();
    private readonly Mock<ILogger<SitemapGenerationJob>> _mockLogger = new();
    private readonly IConfiguration _config;
    private readonly SitemapGenerationJob _job;

    public SitemapGenerationJobTests()
    {
        _config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["App:BaseUrl"] = "https://culinaryblog.com"
        }).Build();

        _job = new SitemapGenerationJob(
            _mockSitemapService.Object,
            _mockFileStorage.Object,
            _config,
            _mockLogger.Object,
            httpClientFactory: null);
    }

    [Fact]
    public async Task ExecuteAsync_GeneratesXml_SavesToWwwroot_AndLogsUrlCount()
    {
        // Arrange
        var sampleXml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url><loc>https://culinaryblog.com/</loc></url>
          <url><loc>https://culinaryblog.com/recipes</loc></url>
          <url><loc>https://culinaryblog.com/recipes/pho-bo</loc></url>
        </urlset>
        """;

        _mockSitemapService
            .Setup(s => s.GenerateSitemapXmlAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(sampleXml);

        // Act
        await _job.ExecuteAsync(CancellationToken.None);

        // Assert
        _mockSitemapService.Verify(s => s.GenerateSitemapXmlAsync(It.IsAny<CancellationToken>()), Times.Once);

        // Verify file written to wwwroot
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "sitemap.xml");
        File.Exists(filePath).Should().BeTrue();
        var writtenContent = await File.ReadAllTextAsync(filePath);
        writtenContent.Should().Be(sampleXml);

        // Verify log containing 3 URLs
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("3 URLs")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenExceptionOccurs_LogsErrorAndRethrows()
    {
        // Arrange
        _mockSitemapService
            .Setup(s => s.GenerateSitemapXmlAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("DB connection error"));

        // Act
        var act = async () => await _job.ExecuteAsync(CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>();

        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("FR-JOB-003")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
