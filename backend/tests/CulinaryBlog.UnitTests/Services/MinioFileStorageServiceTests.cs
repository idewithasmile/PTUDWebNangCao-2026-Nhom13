using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Infrastructure.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Moq;

namespace CulinaryBlog.UnitTests.Services;

public class MinioFileStorageServiceTests
{
    private readonly Mock<IMinioClient> _mockMinioClient;
    private readonly IConfiguration _config;
    private readonly MinioFileStorageService _service;

    public MinioFileStorageServiceTests()
    {
        _mockMinioClient = new Mock<IMinioClient>();
        var inMemorySettings = new Dictionary<string, string>
        {
            { "MinIO:BucketName", "culinary-blog" },
            { "MinIO:Endpoint", "localhost:9000" },
            { "MinIO:UseSSL", "false" }
        };
        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        _mockMinioClient.Setup(m => m.BucketExistsAsync(It.IsAny<BucketExistsArgs>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _service = new MinioFileStorageService(_mockMinioClient.Object, _config);
    }

    [Fact]
    public async Task UploadAsync_EmptyStream_ThrowsAppException_FILE_EMPTY()
    {
        using var stream = new MemoryStream();
        var act = async () => await _service.UploadAsync(stream, "test.jpg", "image/jpeg");

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be("FILE_EMPTY");
        ex.Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_SizeExceeds5MB_ThrowsAppException_FILE_SIZE_EXCEEDED()
    {
        // 5MB + 1 byte
        var largeStream = new Mock<Stream>();
        largeStream.Setup(s => s.Length).Returns(5 * 1024 * 1024 + 1);

        var act = async () => await _service.UploadAsync(largeStream.Object, "large.jpg", "image/jpeg");

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be("FILE_SIZE_EXCEEDED");
        ex.Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_InvalidMimeType_ThrowsAppException_FILE_MIME_INVALID()
    {
        var bytes = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B };
        using var stream = new MemoryStream(bytes);

        var act = async () => await _service.UploadAsync(stream, "script.sh", "application/x-sh");

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be("FILE_MIME_INVALID");
        ex.Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_CorruptedMagicBytesForJpeg_ThrowsAppException_FILE_MIME_INVALID()
    {
        // Text bytes disguised as jpeg
        var fakeBytes = System.Text.Encoding.UTF8.GetBytes("<html><body>Malicious script</body></html>");
        using var stream = new MemoryStream(fakeBytes);

        var act = async () => await _service.UploadAsync(stream, "fake.jpg", "image/jpeg");

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be("FILE_MIME_INVALID");
        ex.Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_ValidJpeg_SucceedsAndReturnsPath()
    {
        var jpegBytes = new byte[32];
        jpegBytes[0] = 0xFF;
        jpegBytes[1] = 0xD8;
        jpegBytes[2] = 0xFF;
        using var stream = new MemoryStream(jpegBytes);

        var result = await _service.UploadAsync(stream, "photo.jpg", "image/jpeg", "recipes/rec-1");

        result.Should().StartWith("/culinary-blog/recipes/rec-1/");
        result.Should().EndWith(".jpg");
        _mockMinioClient.Verify(m => m.PutObjectAsync(It.IsAny<PutObjectArgs>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UploadAsync_ValidPng_SucceedsAndReturnsPath()
    {
        var pngBytes = new byte[32];
        pngBytes[0] = 0x89;
        pngBytes[1] = 0x50; // P
        pngBytes[2] = 0x4E; // N
        pngBytes[3] = 0x47; // G
        using var stream = new MemoryStream(pngBytes);

        var result = await _service.UploadAsync(stream, "diagram.png", "image/png");

        result.Should().StartWith("/culinary-blog/uploads/");
        result.Should().EndWith(".png");
        _mockMinioClient.Verify(m => m.PutObjectAsync(It.IsAny<PutObjectArgs>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UploadAsync_ValidWebP_SucceedsAndReturnsPath()
    {
        var webpBytes = new byte[32];
        // RIFF
        webpBytes[0] = 0x52; webpBytes[1] = 0x49; webpBytes[2] = 0x46; webpBytes[3] = 0x46;
        // WEBP at offset 8
        webpBytes[8] = 0x57; webpBytes[9] = 0x45; webpBytes[10] = 0x42; webpBytes[11] = 0x50;
        using var stream = new MemoryStream(webpBytes);

        var result = await _service.UploadAsync(stream, "image.webp", "image/webp");

        result.Should().StartWith("/culinary-blog/uploads/");
        result.Should().EndWith(".webp");
        _mockMinioClient.Verify(m => m.PutObjectAsync(It.IsAny<PutObjectArgs>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UploadAsync_ValidAvif_SucceedsAndReturnsPath()
    {
        var avifBytes = new byte[32];
        // ftyp at offset 4
        avifBytes[4] = 0x66; avifBytes[5] = 0x74; avifBytes[6] = 0x79; avifBytes[7] = 0x70;
        using var stream = new MemoryStream(avifBytes);

        var result = await _service.UploadAsync(stream, "image.avif", "image/avif");

        result.Should().StartWith("/culinary-blog/uploads/");
        result.Should().EndWith(".avif");
        _mockMinioClient.Verify(m => m.PutObjectAsync(It.IsAny<PutObjectArgs>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_CallsRemoveObjectAsync()
    {
        var fileUrl = "/culinary-blog/recipes/123/img.jpg";

        await _service.DeleteAsync(fileUrl);

        _mockMinioClient.Verify(m => m.RemoveObjectAsync(
            It.IsAny<RemoveObjectArgs>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_AbsoluteUrl_ExtractsCorrectObjectName()
    {
        var fileUrl = "http://localhost:9000/culinary-blog/uploads/photo.jpg";

        await _service.DeleteAsync(fileUrl);

        _mockMinioClient.Verify(m => m.RemoveObjectAsync(It.IsAny<RemoveObjectArgs>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_EmptyUrl_DoesNotCallRemoveObject()
    {
        await _service.DeleteAsync("");
        await _service.DeleteAsync(null!);

        _mockMinioClient.Verify(m => m.RemoveObjectAsync(It.IsAny<RemoveObjectArgs>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
