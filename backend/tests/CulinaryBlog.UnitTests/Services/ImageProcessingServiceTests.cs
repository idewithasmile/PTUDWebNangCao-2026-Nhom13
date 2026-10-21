using CulinaryBlog.Infrastructure.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace CulinaryBlog.UnitTests.Services;

public class ImageProcessingServiceTests
{
    private readonly ImageProcessingService _service = new(NullLogger<ImageProcessingService>.Instance);

    private static byte[] GenerateTestImageBytes(int width, int height)
    {
        using var image = new Image<Rgba32>(width, height);
        using var ms = new MemoryStream();
        image.SaveAsJpeg(ms);
        return ms.ToArray();
    }

    [Fact]
    public async Task CreateThumbnailAsync_Given1000x1000Image_ProducesExactly300x300Thumbnail()
    {
        // Arrange
        var rawBytes = GenerateTestImageBytes(1000, 1000);
        using var stream = new MemoryStream(rawBytes);

        // Act
        var result = await _service.CreateThumbnailAsync(stream, 300, 300);

        // Assert
        result.Should().NotBeNull();
        result.Width.Should().Be(300);
        result.Height.Should().Be(300);
        result.ContentType.Should().Be("image/jpeg");
        result.Data.Should().NotBeEmpty();

        // Verify loaded output image dimensions
        using var outputImage = Image.Load(result.Data);
        outputImage.Width.Should().Be(300);
        outputImage.Height.Should().Be(300);
    }

    [Fact]
    public async Task CreateThumbnailAsync_GivenNonSquareImage_CropsToExact300x300()
    {
        // Arrange (1200x800)
        var rawBytes = GenerateTestImageBytes(1200, 800);
        using var stream = new MemoryStream(rawBytes);

        // Act
        var result = await _service.CreateThumbnailAsync(stream, 300, 300);

        // Assert
        result.Width.Should().Be(300);
        result.Height.Should().Be(300);
        using var outputImage = Image.Load(result.Data);
        outputImage.Width.Should().Be(300);
        outputImage.Height.Should().Be(300);
    }

    [Fact]
    public async Task CreateMediumAsync_Given1000x1000Image_FitsWithin800x600PreservingAspectRatio()
    {
        // Arrange (1000x1000 square -> fits into 800x600 as 600x600)
        var rawBytes = GenerateTestImageBytes(1000, 1000);
        using var stream = new MemoryStream(rawBytes);

        // Act
        var result = await _service.CreateMediumAsync(stream, 800, 600);

        // Assert
        result.Should().NotBeNull();
        result.Width.Should().Be(600);
        result.Height.Should().Be(600);
        result.ContentType.Should().Be("image/jpeg");
        result.Data.Should().NotBeEmpty();

        using var outputImage = Image.Load(result.Data);
        outputImage.Width.Should().Be(600);
        outputImage.Height.Should().Be(600);
    }

    [Fact]
    public async Task CreateMediumAsync_Given1600x900LandscapeImage_FitsWithin800x600()
    {
        // Arrange (1600x900 16:9 -> scales to 800x450)
        var rawBytes = GenerateTestImageBytes(1600, 900);
        using var stream = new MemoryStream(rawBytes);

        // Act
        var result = await _service.CreateMediumAsync(stream, 800, 600);

        // Assert
        result.Width.Should().Be(800);
        result.Height.Should().Be(450);
        using var outputImage = Image.Load(result.Data);
        outputImage.Width.Should().Be(800);
        outputImage.Height.Should().Be(450);
    }
}
