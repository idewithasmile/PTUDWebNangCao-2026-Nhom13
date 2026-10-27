using System.Net;
using System.Text.Json;
using CulinaryBlog.API.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Xunit;

namespace CulinaryBlog.API.IntegrationTests.Endpoints;

/// <summary>
/// Integration tests for Observability endpoints (/health, /health/live, /health/ready)
/// and CorrelationIdMiddleware (FR-OBS-001, FR-OBS-002, CONS-010).
/// </summary>
public class ObservabilityEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ObservabilityEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                // Override health checks for isolated integration testing environment
                services.Configure<HealthCheckServiceOptions>(options =>
                {
                    options.Registrations.Clear();
                });

                services.AddHealthChecks()
                    .AddCheck("self", () => HealthCheckResult.Healthy("API process is running"), tags: ["live"])
                    .AddCheck("database", () => HealthCheckResult.Healthy("PostgreSQL connection healthy"), tags: ["ready"])
                    .AddCheck("redis", () => HealthCheckResult.Healthy("Redis cache healthy"), tags: ["ready"])
                    .AddCheck("minio", () => HealthCheckResult.Healthy("MinIO bucket healthy"), tags: ["storage"]);
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetHealthLive_ShouldReturn200AndHealthyStatus()
    {
        // Act
        var response = await _client.GetAsync("/health/live");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("status").GetString().Should().Be("Healthy");
        doc.RootElement.GetProperty("entries").TryGetProperty("self", out _).Should().BeTrue();
    }

    [Fact]
    public async Task GetHealthReady_ShouldReturn200WithDatabaseAndRedis()
    {
        // Act
        var response = await _client.GetAsync("/health/ready");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("status").GetString().Should().Be("Healthy");

        var entries = doc.RootElement.GetProperty("entries");
        entries.TryGetProperty("database", out var dbEntry).Should().BeTrue();
        dbEntry.GetProperty("status").GetString().Should().Be("Healthy");

        entries.TryGetProperty("redis", out var redisEntry).Should().BeTrue();
        redisEntry.GetProperty("status").GetString().Should().Be("Healthy");

        // "minio" and "self" should not be in readiness probe
        entries.TryGetProperty("minio", out _).Should().BeFalse();
        entries.TryGetProperty("self", out _).Should().BeFalse();
    }

    [Fact]
    public async Task GetHealth_ShouldReturn200WithAllComponents()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("status").GetString().Should().Be("Healthy");

        var entries = doc.RootElement.GetProperty("entries");
        entries.TryGetProperty("database", out _).Should().BeTrue();
        entries.TryGetProperty("redis", out _).Should().BeTrue();
        entries.TryGetProperty("minio", out _).Should().BeTrue();

        // "self" should not be in component checks
        entries.TryGetProperty("self", out _).Should().BeFalse();
    }

    [Fact]
    public async Task Request_WithCustomCorrelationId_ShouldEchoCorrelationIdInResponseHeader()
    {
        // Arrange
        const string customCorrelationId = "custom-trace-test-uuid-999";
        var request = new HttpRequestMessage(HttpMethod.Get, "/health/live");
        request.Headers.Add("X-Correlation-ID", customCorrelationId);

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Contains("X-Correlation-ID").Should().BeTrue();
        response.Headers.GetValues("X-Correlation-ID").First().Should().Be(customCorrelationId);
    }

    [Fact]
    public async Task Request_WithoutCorrelationId_ShouldGenerateNewCorrelationIdInResponseHeader()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/health/live");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.Contains("X-Correlation-ID").Should().BeTrue();
        var generatedId = response.Headers.GetValues("X-Correlation-ID").First();
        generatedId.Should().NotBeNullOrWhiteSpace();
        Guid.TryParse(generatedId, out _).Should().BeTrue("Auto-generated Correlation ID must be a valid GUID");
    }

    [Fact]
    public async Task GetSitemapXml_ShouldReturn200AndValidXmlContent()
    {
        // Act
        var response = await _client.GetAsync("/sitemap.xml");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/xml");
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("<?xml");
        content.Should().Contain("urlset");
    }
}
