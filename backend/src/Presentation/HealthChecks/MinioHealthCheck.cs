using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Minio;
using Minio.DataModel.Args;

namespace CulinaryBlog.API.HealthChecks;

/// <summary>
/// Health check for MinIO Object Storage (FR-OBS-001, NFR-REL-001).
/// </summary>
public class MinioHealthCheck(IConfiguration config) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var endpoint = config["MinIO:Endpoint"] ?? "localhost:9000";
            var accessKey = config["MinIO:AccessKey"];
            var secretKey = config["MinIO:SecretKey"];
            var useSsl = config.GetValue<bool>("MinIO:UseSSL");
            var bucket = config["MinIO:BucketName"] ?? "culinary-blog";

            var minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .WithSSL(useSsl)
                .Build();

            var bucketList = await minioClient.ListBucketsAsync(cancellationToken);

            return HealthCheckResult.Healthy($"MinIO storage is available. Found {bucketList.Buckets.Count} buckets.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"MinIO health check failed: {ex.Message}", ex);
        }
    }
}
