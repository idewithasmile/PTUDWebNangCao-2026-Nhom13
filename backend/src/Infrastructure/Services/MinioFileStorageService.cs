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

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default)
    {
        if (stream == null || stream.Length == 0)
            throw new AppException("FILE_EMPTY", "Tệp tin tải lên không được rỗng.", 400);

        if (stream.Length > MaxFileSize)
            throw new AppException("FILE_SIZE_EXCEEDED", "Dung lượng tệp tin tải lên vượt quá giới hạn 5 MB.", 400);

        ValidateMagicBytes(stream, contentType);

        await EnsureBucketExistsAsync(ct);

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(ext))
        {
            ext = contentType.ToLowerInvariant() switch
            {
                "image/jpeg" or "image/jpg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/avif" => ".avif",
                _ => ".bin"
            };
        }

        var folderPath = string.IsNullOrWhiteSpace(folder)
            ? "uploads"
            : folder.Trim().Trim('/').Replace('\\', '/');

        var objectName = $"{folderPath}/{Guid.NewGuid()}{ext}";

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
                // Thao tác mang tính Idempotent: nếu tệp không tồn tại, coi như thành công
                if (ex.Message.Contains("NoSuchKey", StringComparison.OrdinalIgnoreCase) ||
                    ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                _logger?.LogWarning(ex, "Thử xóa file {Object} lần {Attempt}/{MaxRetries} thất bại.", objectName, attempt, maxRetries);
                if (attempt == maxRetries)
                {
                    _logger?.LogError(ex, "Không thể xóa file {Object} sau {MaxRetries} lần thử.", objectName, maxRetries);
                    return; // Vẫn đảm bảo Idempotent theo SRS FR-FILE-002
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

    private string ExtractObjectName(string fileUrl)
    {
        var path = fileUrl;
        if (Uri.TryCreate(fileUrl, UriKind.Absolute, out var uri))
        {
            path = uri.AbsolutePath;
        }

        path = path.TrimStart('/');
        if (path.StartsWith($"{_bucket}/", StringComparison.OrdinalIgnoreCase))
        {
            path = path.Substring(_bucket.Length + 1);
        }

        return path;
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
            }
        }
        catch (Exception ex)
        {
            _logger?.LogWarning(ex, "Không thể kiểm tra hoặc tạo bucket {Bucket}: {Message}", _bucket, ex.Message);
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

        var lowerMime = contentType.Trim().ToLowerInvariant();
        var isValid = lowerMime switch
        {
            "image/jpeg" or "image/jpg" => header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
            "image/png" => header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47,
            "image/webp" => header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                            header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50,
            "image/avif" => header[4] == 0x66 && header[5] == 0x74 && header[6] == 0x79 && header[7] == 0x70,
            _ => false
        };

        if (!isValid)
        {
            throw new AppException("FILE_MIME_INVALID", "Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi.", 400);
        }
    }
}
