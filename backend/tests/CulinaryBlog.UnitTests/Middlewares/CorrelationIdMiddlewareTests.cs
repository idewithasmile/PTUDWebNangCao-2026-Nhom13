using CulinaryBlog.API.Middlewares;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace CulinaryBlog.UnitTests.Middlewares;

/// <summary>
/// Unit tests for CorrelationIdMiddleware (FR-OBS-002, CONS-010).
/// </summary>
public class CorrelationIdMiddlewareTests
{
    private const string HeaderKey = "X-Correlation-ID";

    [Fact]
    public async Task InvokeAsync_WhenHeaderPresent_ShouldPreserveCorrelationId()
    {
        // Arrange
        const string expectedCorrelationId = "test-correlation-12345";
        var context = new DefaultHttpContext();
        context.Request.Headers[HeaderKey] = expectedCorrelationId;

        string? capturedItemId = null;
        string? capturedTraceIdentifier = null;

        RequestDelegate next = ctx =>
        {
            capturedItemId = ctx.Items["CorrelationId"]?.ToString();
            capturedTraceIdentifier = ctx.TraceIdentifier;
            return Task.CompletedTask;
        };

        var middleware = new CorrelationIdMiddleware(next);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        capturedItemId.Should().Be(expectedCorrelationId);
        capturedTraceIdentifier.Should().Be(expectedCorrelationId);
        context.Response.Headers[HeaderKey].ToString().Should().Be(expectedCorrelationId);
    }

    [Fact]
    public async Task InvokeAsync_WhenHeaderMissing_ShouldGenerateNewCorrelationIdGuid()
    {
        // Arrange
        var context = new DefaultHttpContext();

        string? capturedItemId = null;
        string? capturedTraceIdentifier = null;

        RequestDelegate next = ctx =>
        {
            capturedItemId = ctx.Items["CorrelationId"]?.ToString();
            capturedTraceIdentifier = ctx.TraceIdentifier;
            return Task.CompletedTask;
        };

        var middleware = new CorrelationIdMiddleware(next);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        capturedItemId.Should().NotBeNullOrWhiteSpace();
        Guid.TryParse(capturedItemId, out _).Should().BeTrue("Generated correlation ID must be a valid GUID");
        capturedTraceIdentifier.Should().Be(capturedItemId);
        context.Response.Headers[HeaderKey].ToString().Should().Be(capturedItemId);
    }

    [Fact]
    public async Task InvokeAsync_WhenHeaderEmptyOrWhitespace_ShouldGenerateNewCorrelationIdGuid()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Request.Headers[HeaderKey] = "   ";

        string? capturedItemId = null;

        RequestDelegate next = ctx =>
        {
            capturedItemId = ctx.Items["CorrelationId"]?.ToString();
            return Task.CompletedTask;
        };

        var middleware = new CorrelationIdMiddleware(next);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        capturedItemId.Should().NotBeNullOrWhiteSpace();
        Guid.TryParse(capturedItemId, out _).Should().BeTrue("Whitespace correlation ID should be replaced by a valid GUID");
        context.Response.Headers[HeaderKey].ToString().Should().Be(capturedItemId);
    }
}
