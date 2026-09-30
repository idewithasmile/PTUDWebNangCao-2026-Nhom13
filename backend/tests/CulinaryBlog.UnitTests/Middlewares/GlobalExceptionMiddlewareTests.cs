using System.IO;
using System.Text.Json;
using CulinaryBlog.API.Middlewares;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CulinaryBlog.UnitTests.Middlewares;

/// <summary>
/// Bộ kiểm thử đơn vị cho GlobalExceptionMiddleware theo chuẩn RFC 7807 (Problem Details).
/// Kiểm chứng ánh xạ mã trạng thái HTTP, Content-Type, và các trường thông tin lỗi.
/// </summary>
public class GlobalExceptionMiddlewareTests
{
    private readonly Mock<ILogger<GlobalExceptionMiddleware>> _loggerMock = new();

    private static (DefaultHttpContext Context, MemoryStream ResponseBody) CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        var responseBody = new MemoryStream();
        context.Response.Body = responseBody;
        context.Request.Path = "/api/v1/test-endpoint";
        return (context, responseBody);
    }

    private static async Task<ProblemDetails?> ReadProblemDetailsAsync(MemoryStream stream)
    {
        stream.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(stream);
        var json = await reader.ReadToEndAsync();
        return JsonSerializer.Deserialize<ProblemDetails>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }

    [Fact]
    public async Task InvokeAsync_WhenEntityNotFoundException_ShouldReturn404ProblemDetails()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        RequestDelegate next = _ => throw new EntityNotFoundException("CATEGORY_NOT_FOUND", "Category 'mon-la' not found.");
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
        context.Response.ContentType.Should().Contain("application/problem+json");

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(404);
        problem.Type.Should().Be("CATEGORY_NOT_FOUND");
        problem.Detail.Should().Be("Category 'mon-la' not found.");
        problem.Instance.Should().Be("/api/v1/test-endpoint");
    }

    [Fact]
    public async Task InvokeAsync_WhenCategoryNotEmptyException_ShouldReturn409Conflict()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        RequestDelegate next = _ => throw new CategoryNotEmptyException("Món lẩu", 3);
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status409Conflict);
        context.Response.ContentType.Should().Contain("application/problem+json");

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(409);
        problem.Type.Should().Be("CATEGORY_DELETE_HAS_RECIPES");
        problem.Detail.Should().Contain("Món lẩu");
    }

    [Fact]
    public async Task InvokeAsync_WhenConcurrencyConflictException_ShouldReturn409Conflict()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        RequestDelegate next = _ => throw new ConcurrencyConflictException("CATEGORY_CONCURRENCY_CONFLICT", "RowVersion mismatch.");
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status409Conflict);

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(409);
        problem.Type.Should().Be("CATEGORY_CONCURRENCY_CONFLICT");
        problem.Detail.Should().Be("RowVersion mismatch.");
    }

    [Fact]
    public async Task InvokeAsync_WhenDbUpdateConcurrencyException_ShouldReturn409Conflict()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        RequestDelegate next = _ => throw new DbUpdateConcurrencyException("Concurrency violation in DB");
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status409Conflict);

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(409);
        problem.Type.Should().Be("CONCURRENCY_CONFLICT");
    }

    [Fact]
    public async Task InvokeAsync_WhenValidationException_ShouldReturn400BadRequestWithErrors()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        var errors = new Dictionary<string, string[]>
        {
            ["Name"] = ["Tên danh mục không được để trống.", "Tên danh mục tối thiểu 2 ký tự."]
        };
        RequestDelegate next = _ => throw new ValidationException(errors);
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        context.Response.ContentType.Should().Contain("application/problem+json");

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(400);
        problem.Type.Should().Be("VALIDATION_ERROR");
        problem.Extensions.Should().ContainKey("errors");
    }

    [Fact]
    public async Task InvokeAsync_WhenUnhandledException_ShouldReturn500WithoutLeakingStackTrace()
    {
        // Arrange
        var (context, stream) = CreateHttpContext();
        RequestDelegate next = _ => throw new InvalidOperationException("Fatal internal database connection failure.");
        var middleware = new GlobalExceptionMiddleware(next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        context.Response.ContentType.Should().Contain("application/problem+json");

        var problem = await ReadProblemDetailsAsync(stream);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(500);
        problem.Type.Should().Be("INTERNAL_SERVER_ERROR");
        problem.Detail.Should().NotContain("Fatal internal database connection failure.");
        problem.Detail.Should().Be("An unexpected error occurred. Please contact the administrator.");
    }
}
