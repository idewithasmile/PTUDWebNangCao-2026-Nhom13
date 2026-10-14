using CulinaryBlog.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;

namespace CulinaryBlog.Infrastructure.Services;

public class MinioFileStorageService : IFileStorageService
{
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    public MinioFileStorageService(IConfiguration config)
    {
        _bucket = config["MinIO:BucketName"] ?? "culinary-blog";
        _client = new MinioClient()
            .WithEndpoint(config["MinIO:Endpoint"] ?? "localhost:9000")
            .WithCredentials(config["MinIO:AccessKey"], config["MinIO:SecretKey"])
            .WithSSL(config.GetValue<bool>("MinIO:UseSSL"))
            .Build();
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, CancellationToken ct = default)
    {
        if (stream.Length > MaxFileSize)
            throw new ArgumentException("Kích thước file vượt quá 5MB.");

        // Kiểm tra Magic Bytes chống mã độc
        ValidateMagicBytes(stream, contentType);

        // FR-FILE-001 / FR-RCP-008: cho phép caller truyền object path đầy đủ
        // dạng "recipes/{recipeId}/{uuid}.{ext}". Sanitize để ngăn path traversal.
        // Fallback cũ "uploads/{guid}{ext}" khi chỉ truyền tên file đơn lẻ.
        var objectName = ResolveObjectName(fileName);

        // Đảm bảo bucket tồn tại (idempotent, best-effort cho local dev).
        try
        {
            var bucketExistsArgs = new BucketExistsArgs().WithBucket(_bucket);
            if (!await _client.BucketExistsAsync(bucketExistsArgs, ct))
            {
                await _client.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucket), ct);
            }
        }
        catch
        {
            // Bỏ qua lỗi kiểm tra bucket ở đây — PutObject sẽ ném lỗi thật
            // và handler map thành 503 (MinIO không khả dụng).
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

    public async Task DeleteAsync(string fileUrl, CancellationToken ct = default)
    {
        // FR-FILE-002: idempotent — object không tồn tại cũng không throw.
        var objectName = ExtractObjectName(fileUrl);
        try
        {
            var removeArgs = new RemoveObjectArgs().WithBucket(_bucket).WithObject(objectName);
            await _client.RemoveObjectAsync(removeArgs, ct);
        }
        catch (Exception ex) when (ex.Message.Contains("not exist", StringComparison.OrdinalIgnoreCase)
            || ex.Message.Contains("NoSuchKey", StringComparison.OrdinalIgnoreCase))
        {
            // Idempotent delete: bỏ qua khi object đã không còn trên MinIO.
        }
    }

    private static string ResolveObjectName(string fileName)
    {
        var sanitized = (fileName ?? string.Empty).Trim().Replace('\\', '/').TrimStart('/');
        // Ngăn path traversal: loại bỏ mọi segment "..".
        var segments = sanitized.Split('/', StringSplitOptions.RemoveEmptyEntries)
            .Where(s => s != ".." && s != ".")
            .ToArray();

        if (segments.Length >= 2 && segments[0].Equals("recipes", StringComparison.OrdinalIgnoreCase))
        {
            // Giữ nguyên path recipes/{id}/{file} — chỉ giữ ký tự an toàn ở filename.
            var folder = string.Join('/', segments[..^1]);
            var safeFile = SanitizeFileName(segments[^1]);
            return $"{folder}/{safeFile}";
        }

        var ext = Path.GetExtension(sanitized);
        return $"uploads/{Guid.NewGuid()}{ext}";
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
        // Hỗ trợ cả absolute URL (http://minio:9000/bucket/object),
        // relative URL (/bucket/object) và raw object name.
        var prefix = $"/{_bucket}/";
        var idx = trimmed.IndexOf(prefix, StringComparison.OrdinalIgnoreCase);
        if (idx >= 0) return trimmed[(idx + prefix.Length)..].TrimStart('/');
        if (trimmed.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            return trimmed[prefix.Length..];
        return trimmed.TrimStart('/');
    }

    private static void ValidateMagicBytes(Stream stream, string contentType)
    {
        stream.Position = 0;
        Span<byte> header = stackalloc byte[12];
        _ = stream.Read(header);
        stream.Position = 0; // Reset lại stream position

        var isValid = contentType.ToLower() switch
        {
            "image/jpeg" => header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
            "image/png" => header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47,
            "image/webp" => header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                            header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50,
            "image/avif" => header[4] == 0x66 && header[5] == 0x74 && header[6] == 0x79 && header[7] == 0x70,
            _ => false
        };

        if (!isValid) throw new ArgumentException("Định dạng file hoặc Magic Bytes không hợp lệ.");
    }
}
