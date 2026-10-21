namespace CulinaryBlog.Application.Common.Interfaces;

public record ImageResizeResult(byte[] Data, string ContentType, int Width, int Height);

/// <summary>
/// Abstraction cho xử lý ảnh (SixLabors.ImageSharp) tuân thủ CONS-001.
/// </summary>
public interface IImageProcessingService
{
    Task<ImageResizeResult> CreateThumbnailAsync(Stream imageStream, int width = 300, int height = 300, CancellationToken ct = default);
    Task<ImageResizeResult> CreateMediumAsync(Stream imageStream, int maxWidth = 800, int maxHeight = 600, CancellationToken ct = default);
}
