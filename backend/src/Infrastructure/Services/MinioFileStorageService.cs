using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;

namespace CulinaryBlog.Infrastructure.Services;

public class MinioFileStorageService : IFileStorageService
{
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private readonly ILogger<MinioFileStorageService>? _logger;
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    public MinioFileStorageService(IConfiguration config, ILogger<MinioFileStorageService>? logger = null)
        : this(
            new MinioClient()
                .WithEndpoint(config["MinIO:Endpoint"] ?? "localhost:9000")
                .WithCredentials(config["MinIO:AccessKey"], config["MinIO:SecretKey"])
                .WithSSL(config.GetValue<bool>("MinIO:UseSSL"))
                .Build(),
            config,
            logger)
    {
    }

    public MinioFileStorageService(IMinioClient client, IConfiguration config, ILogger<MinioFileStorageService>? logger = null)
    {
        _client = client;
        _logger = logger;
        _bucket = config["MinIO:BucketName"] ?? "culinary-blog";
    }

    public async Task EnsureStorageReadyAsync(CancellationToken ct = default)
    {
        await EnsureBucketExistsAsync(ct);
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default)
    {
        if (stream == null || stream.Length == 0)
            throw new AppException("FILE_EMPTY", "Tệp tin tải lên không được rỗng.", 400);

        if (stream.Length > MaxFileSize)
            throw new AppException("FILE_SIZE_EXCEEDED", "Dung lượng tệp tin tải lên vượt quá giới hạn 5 MB.", 400);

        ValidateMagicBytes(stream, contentType);

        // Đảm bảo bucket tồn tại (idempotent, best-effort cho local dev).
        await EnsureBucketExistsAsync(ct);

        var objectName = ResolveObjectName(fileName, folder, contentType);

        try
        {
            if (stream.CanSeek)
            {
                stream.Position = 0;
            }

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucket)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType(contentType);

            await _client.PutObjectAsync(putObjectArgs, ct);
            return $"/{_bucket}/{objectName}";
        }
        catch (Exception ex) when (ex is not AppException)
        {
            _logger?.LogError(ex, "Lỗi khi tải file lên MinIO: {Message}", ex.Message);
            throw new AppException("STORAGE_UNAVAILABLE", "Hệ thống lưu trữ MinIO gặp sự cố khi tải tệp.", 503);
        }
    }

    public async Task DeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return;

        var objectName = ExtractObjectName(fileUrl);
        if (string.IsNullOrWhiteSpace(objectName)) return;

        const int maxRetries = 3;
        const int retryDelayMs = 200;

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                var removeArgs = new RemoveObjectArgs()
                    .WithBucket(_bucket)
                    .WithObject(objectName);

                await _client.RemoveObjectAsync(removeArgs, ct);
                return;
            }
            catch (MinioException ex)
            {
                // FR-FILE-002: thao tác Idempotent — tệp không tồn tại coi như thành công.
                if (ex.Message.Contains("NoSuchKey", StringComparison.OrdinalIgnoreCase) ||
                    ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase) ||
                    ex.Message.Contains("not exist", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                _logger?.LogWarning(ex, "Thử xóa file {Object} lần {Attempt}/{MaxRetries} thất bại.", objectName, attempt, maxRetries);
                if (attempt == maxRetries)
                {
                    _logger?.LogError(ex, "Không thể xóa file {Object} sau {MaxRetries} lần thử.", objectName, maxRetries);
                    return;
                }
                await Task.Delay(retryDelayMs * attempt, ct);
            }
            catch (Exception ex) when (attempt < maxRetries)
            {
                _logger?.LogWarning(ex, "Lỗi mạng khi xóa file {Object} lần {Attempt}/{MaxRetries}. Thử lại...", objectName, attempt, maxRetries);
                await Task.Delay(retryDelayMs * attempt, ct);
            }
        }
    }

    public async Task<Stream> GetStreamAsync(string fileUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(fileUrl))
            throw new AppException("FILE_NOT_FOUND", "URL tệp tin không hợp lệ.", 400);

        var objectName = ExtractObjectName(fileUrl);
        if (string.IsNullOrWhiteSpace(objectName))
            throw new AppException("FILE_NOT_FOUND", "Không tìm thấy đường dẫn tệp tin trên hệ thống lưu trữ.", 404);

        var memoryStream = new MemoryStream();
        try
        {
            var getObjectArgs = new GetObjectArgs()
                .WithBucket(_bucket)
                .WithObject(objectName)
                .WithCallbackStream(stream =>
                {
                    stream.CopyTo(memoryStream);
                });

            await _client.GetObjectAsync(getObjectArgs, ct);
            memoryStream.Position = 0;
            return memoryStream;
        }
        catch (MinioException ex)
        {
            _logger?.LogError(ex, "Lỗi khi tải stream file {Object} từ MinIO: {Message}", objectName, ex.Message);
            throw new AppException("FILE_NOT_FOUND", $"Không thể tải tệp tin từ MinIO: {objectName}", 404);
        }
        catch (Exception ex) when (ex is not AppException)
        {
            _logger?.LogError(ex, "Lỗi kết nối khi lấy stream file {Object} từ MinIO: {Message}", objectName, ex.Message);
            throw new AppException("STORAGE_UNAVAILABLE", "Hệ thống lưu trữ MinIO gặp sự cố khi đọc tệp.", 503);
        }
    }

    private string ResolveObjectName(string fileName, string? folder, string contentType)
    {
        var sanitized = (fileName ?? string.Empty).Trim().Replace('\\', '/').TrimStart('/');
        var segments = sanitized.Split('/', StringSplitOptions.RemoveEmptyEntries)
            .Where(s => s != ".." && s != ".")
            .ToArray();

        // Caller chỉ định thư mục đích (vd "recipes/{recipeId}") → sinh tên file mới.
        if (!string.IsNullOrWhiteSpace(folder))
        {
            var folderPath = folder.Trim().Trim('/').Replace('\\', '/');
            var extension = Path.GetExtension(sanitized);
            if (string.IsNullOrWhiteSpace(extension))
            {
                extension = ExtensionFromContentType(contentType);
            }
            return $"{folderPath}/{Guid.NewGuid()}{extension}";
        }

        // Caller truyền object path đầy đủ dạng "recipes/{id}/{uuid}.{ext}".
        if (segments.Length >= 2 && segments[0].Equals("recipes", StringComparison.OrdinalIgnoreCase))
        {
            var pathFolder = string.Join('/', segments[..^1]);
            var safeFile = SanitizeFileName(segments[^1]);
            return $"{pathFolder}/{safeFile}";
        }

        var ext = Path.GetExtension(sanitized);
        if (string.IsNullOrWhiteSpace(ext))
        {
            ext = ExtensionFromContentType(contentType);
        }
        return $"uploads/{Guid.NewGuid()}{ext}";
    }

    private static string ExtensionFromContentType(string contentType)
    {
        return contentType.ToLowerInvariant() switch
        {
            "image/jpeg" or "image/jpg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/avif" => ".avif",
            _ => ".bin"
        };
    }

    private static string SanitizeFileName(string name)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var cleaned = new string(name.Where(c => !invalid.Contains(c)).ToArray());
        return string.IsNullOrWhiteSpace(cleaned) ? $"{Guid.NewGuid()}.bin" : cleaned;
    }

    private string ExtractObjectName(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return string.Empty;

        var trimmed = fileUrl.Trim();
        // Hỗ trợ cả absolute URL (http://minio:9000/bucket/object) và relative URL.
        if (Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            trimmed = uri.AbsolutePath;
        }

        var prefix = $"/{_bucket}/";
        var idx = trimmed.IndexOf(prefix, StringComparison.OrdinalIgnoreCase);
        if (idx >= 0) return trimmed[(idx + prefix.Length)..].TrimStart('/');

        return trimmed.TrimStart('/');
    }

    private async Task EnsureBucketExistsAsync(CancellationToken ct)
    {
        try
        {
            var beArgs = new BucketExistsArgs().WithBucket(_bucket);
            bool found = await _client.BucketExistsAsync(beArgs, ct);
            if (!found)
            {
                var mbArgs = new MakeBucketArgs().WithBucket(_bucket);
                await _client.MakeBucketAsync(mbArgs, ct);
            }

            var policy = $$"""
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": ["arn:aws:s3:::{{_bucket}}/*"]
                    }
                ]
            }
            """;
            var spArgs = new SetPolicyArgs().WithBucket(_bucket).WithPolicy(policy);
            await _client.SetPolicyAsync(spArgs, ct);
            _logger?.LogInformation("MinIO bucket {Bucket} đã sẵn sàng với chính sách Public Read.", _bucket);
        }
        catch (Exception ex)
        {
            _logger?.LogWarning(ex, "Không thể kiểm tra hoặc cấu hình bucket {Bucket}: {Message}", _bucket, ex.Message);
        }
    }

    private static void ValidateMagicBytes(Stream stream, string contentType)
    {
        if (string.IsNullOrWhiteSpace(contentType))
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }

        if (stream.Length < 12)
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }

        if (stream.CanSeek)
        {
            stream.Position = 0;
        }

        Span<byte> header = stackalloc byte[12];
        int read = stream.Read(header);

        if (stream.CanSeek)
        {
            stream.Position = 0; // Reset lại stream position
        }

        if (read < 12)
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }

        var cleanMime = contentType.Split(';')[0].Trim().ToLowerInvariant();
        var isSupportedMime = cleanMime is "image/jpeg" or "image/jpg" or "image/pjpeg"
            or "image/png" or "image/x-png"
            or "image/webp"
            or "image/avif";

        if (!isSupportedMime)
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }

        bool isJpeg = header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
        bool isPng = header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
        bool isWebp = header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                      header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;
        bool isAvif = (header[4] == 0x66 && header[5] == 0x74 && header[6] == 0x79 && header[7] == 0x70) ||
                      (header[8] == 0x61 && header[9] == 0x76 && header[10] == 0x69 && header[11] == 0x66);

        bool isValid = isJpeg || isPng || isWebp || isAvif;

        if (!isValid)
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }
    }
}
