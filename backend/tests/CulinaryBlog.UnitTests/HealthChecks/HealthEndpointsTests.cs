using System.IO;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.HealthChecks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Xunit;

namespace CulinaryBlog.UnitTests.HealthChecks;

/// <summary>
/// Unit tests for HealthChecks and SRS Section 8.7 JSON writer format (FR-OBS-001, NFR-REL-001).
/// </summary>
public class HealthEndpointsTests
{
    [Fact]
    public async Task WriteHealthCheckResponse_ShouldFormatJsonAccordingToSrs87()
    {
        // Arrange
        var context = new DefaultHttpContext();
        var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        var entries = new Dictionary<string, HealthReportEntry>
        {
            ["database"] = new(
                HealthStatus.Healthy,
                "PostgreSQL connection active",
                TimeSpan.FromMilliseconds(15),
                null,
                null),
            ["redis"] = new(
                HealthStatus.Healthy,
                "Redis cache ping successful",
                TimeSpan.FromMilliseconds(8),
                null,
                null),
            ["minio"] = new(
                HealthStatus.Healthy,
                "MinIO storage bucket verified",
                TimeSpan.FromMilliseconds(20),
                null,
                null)
        };

        var report = new HealthReport(entries, TimeSpan.FromMilliseconds(43));

        // Act
        await HealthEndpoints.WriteHealthCheckResponse(context, report);

        // Assert
        context.Response.ContentType.Should().Contain("application/json");

        responseBody.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(responseBody);
        var json = await reader.ReadToEndAsync();

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        root.GetProperty("status").GetString().Should().Be("Healthy");

        var entriesProp = root.GetProperty("entries");
        entriesProp.TryGetProperty("database", out var dbEntry).Should().BeTrue();
        dbEntry.GetProperty("status").GetString().Should().Be("Healthy");
        dbEntry.GetProperty("description").GetString().Should().Be("PostgreSQL connection active");
        dbEntry.GetProperty("duration").GetString().Should().NotBeNullOrWhiteSpace();

        entriesProp.TryGetProperty("redis", out var redisEntry).Should().BeTrue();
        redisEntry.GetProperty("status").GetString().Should().Be("Healthy");
        redisEntry.GetProperty("description").GetString().Should().Be("Redis cache ping successful");

        entriesProp.TryGetProperty("minio", out var minioEntry).Should().BeTrue();
        minioEntry.GetProperty("status").GetString().Should().Be("Healthy");
        minioEntry.GetProperty("description").GetString().Should().Be("MinIO storage bucket verified");
    }

    [Fact]
    public async Task WriteHealthCheckResponse_WhenComponentUnhealthy_ShouldReflectUnhealthyStatus()
    {
        // Arrange
        var context = new DefaultHttpContext();
        var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        var entries = new Dictionary<string, HealthReportEntry>
        {
            ["database"] = new(
                HealthStatus.Healthy,
                "PostgreSQL connection active",
                TimeSpan.FromMilliseconds(10),
                null,
                null),
            ["minio"] = new(
                HealthStatus.Unhealthy,
                "MinIO connection timed out",
                TimeSpan.FromMilliseconds(50),
                new System.Net.Http.HttpRequestException("Connection refused"),
                null)
        };

        var report = new HealthReport(entries, TimeSpan.FromMilliseconds(60));

        // Act
        await HealthEndpoints.WriteHealthCheckResponse(context, report);

        // Assert
        responseBody.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(responseBody);
        var json = await reader.ReadToEndAsync();

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        root.GetProperty("status").GetString().Should().Be("Unhealthy");
        root.GetProperty("entries").GetProperty("minio").GetProperty("status").GetString().Should().Be("Unhealthy");
        root.GetProperty("entries").GetProperty("minio").GetProperty("description").GetString().Should().Be("MinIO connection timed out");
    }

    [Fact]
    public async Task MinioHealthCheck_WhenEndpointUnreachable_ShouldReturnUnhealthy()
    {
        // Arrange
        var inMemorySettings = new Dictionary<string, string?>
        {
            ["MinIO:Endpoint"] = "localhost:59999", // Unreachable port
            ["MinIO:AccessKey"] = "dummy",
            ["MinIO:SecretKey"] = "dummy",
            ["MinIO:BucketName"] = "culinary-blog",
            ["MinIO:UseSSL"] = "false"
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var check = new MinioHealthCheck(configuration);
        var checkContext = new HealthCheckContext();

        // Act
        var result = await check.CheckHealthAsync(checkContext, CancellationToken.None);

        // Assert
        result.Status.Should().Be(HealthStatus.Unhealthy);
        result.Description.Should().Contain("MinIO health check failed");
    }
}
