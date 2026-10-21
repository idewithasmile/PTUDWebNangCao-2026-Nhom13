using CulinaryBlog.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Dịch vụ xử lý ảnh sử dụng SixLabors.ImageSharp (FR-JOB-002).
/// Tạo Thumbnail (300x300 crop) và Medium (800x600 fit aspect ratio).
/// </summary>
public class ImageProcessingService : IImageProcessingService
{
    private readonly ILogger<ImageProcessingService> _logger;

    public ImageProcessingService(ILogger<ImageProcessingService> logger)
    {
        _logger = logger;
    }

    public async Task<ImageResizeResult> CreateThumbnailAsync(Stream imageStream, int width = 300, int height = 300, CancellationToken ct = default)
    {
        if (imageStream.CanSeek)
        {
            imageStream.Position = 0;
        }

        using var image = await Image.LoadAsync(imageStream, ct);

        image.Mutate(x => x.Resize(new ResizeOptions
        {
            Size = new Size(width, height),
            Mode = ResizeMode.Crop
        }));

        using var outputStream = new MemoryStream();
        await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = 85 }, ct);

        _logger.LogDebug("Tạo thumbnail thành công: {Width}x{Height} px, {Bytes} bytes", image.Width, image.Height, outputStream.Length);

        return new ImageResizeResult(outputStream.ToArray(), "image/jpeg", image.Width, image.Height);
    }

    public async Task<ImageResizeResult> CreateMediumAsync(Stream imageStream, int maxWidth = 800, int maxHeight = 600, CancellationToken ct = default)
    {
        if (imageStream.CanSeek)
        {
            imageStream.Position = 0;
        }

        using var image = await Image.LoadAsync(imageStream, ct);

        image.Mutate(x => x.Resize(new ResizeOptions
        {
            Size = new Size(maxWidth, maxHeight),
            Mode = ResizeMode.Max
        }));

        using var outputStream = new MemoryStream();
        await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = 85 }, ct);

        _logger.LogDebug("Tạo medium image thành công: {Width}x{Height} px, {Bytes} bytes", image.Width, image.Height, outputStream.Length);

        return new ImageResizeResult(outputStream.ToArray(), "image/jpeg", image.Width, image.Height);
    }
}
