using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace CulinaryBlog.API.Endpoints;

/// <summary>
/// Health check endpoints for FR-OBS-001 (SRS 3.7, 8.7 & NFR-REL-001).
/// </summary>
public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthChecks(this IEndpointRouteBuilder endpoints)
    {
        var options = new HealthCheckOptions
        {
            ResponseWriter = WriteHealthCheckResponse
        };

        // 1. GET /health: Tổng hợp tất cả components (database, redis, minio)
        endpoints.MapHealthChecks("/health", new HealthCheckOptions
        {
            Predicate = check => check.Name != "self",
            ResponseWriter = WriteHealthCheckResponse
        }).AllowAnonymous();

        // 2. GET /health/live: Liveness probe - kiểm tra API process còn sống
        endpoints.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("live"),
            ResponseWriter = WriteHealthCheckResponse
        }).AllowAnonymous();

        // 3. GET /health/ready: Readiness probe - kiểm tra dependencies sẵn sàng (database, redis)
        endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = WriteHealthCheckResponse
        }).AllowAnonymous();

        return endpoints;
    }

    /// <summary>
    /// Custom ResponseWriter producing application/json compliant with SRS Section 8.7.
    /// </summary>
    public static Task WriteHealthCheckResponse(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        var response = new
        {
            status = report.Status.ToString(),
            entries = report.Entries.ToDictionary(
                entry => entry.Key,
                entry => new
                {
                    status = entry.Value.Status.ToString(),
                    description = entry.Value.Description,
                    duration = entry.Value.Duration.ToString()
                }
            )
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        return context.Response.WriteAsync(json);
    }
}
