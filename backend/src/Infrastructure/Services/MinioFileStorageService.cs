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

        var ext = Path.GetExtension(fileName);
        var objectName = $"uploads/{Guid.NewGuid()}{ext}";

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
        var objectName = fileUrl.Replace($"/{_bucket}/", "");
        var removeArgs = new RemoveObjectArgs().WithBucket(_bucket).WithObject(objectName);
        await _client.RemoveObjectAsync(removeArgs, ct);
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
