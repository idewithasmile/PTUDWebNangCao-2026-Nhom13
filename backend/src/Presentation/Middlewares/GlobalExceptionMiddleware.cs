using System.Text.Json;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.API.Middlewares;

/// <summary>
/// Middleware xử lý lỗi toàn cục và chuyển đổi ngoại lệ thành chuẩn RFC 7807 Problem Details.
/// Tuân thủ CONS-005 và quy tắc Content-Type: application/problem+json.
/// </summary>
public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled Exception: {Message} at {Path}", ex.Message, context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, problemDetails) = exception switch
        {
            EntityNotFoundException notFoundEx => (StatusCodes.Status404NotFound, new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Type = notFoundEx.ErrorCode,
                Title = "Entity Not Found",
                Detail = notFoundEx.Message,
                Instance = context.Request.Path
            }),

            CategoryNotEmptyException notEmptyEx => (StatusCodes.Status409Conflict, new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Type = notEmptyEx.ErrorCode,
                Title = "Category Has Associated Recipes",
                Detail = notEmptyEx.Message,
                Instance = context.Request.Path
            }),

            ConcurrencyConflictException concEx => (StatusCodes.Status409Conflict, new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Type = concEx.ErrorCode,
                Title = "Concurrency Conflict",
                Detail = concEx.Message,
                Instance = context.Request.Path
            }),

            DbUpdateConcurrencyException => (StatusCodes.Status409Conflict, new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Type = "CONCURRENCY_CONFLICT",
                Title = "Concurrency Conflict",
                Detail = "Thực thể đã bị thay đổi hoặc xóa bởi một phiên làm việc khác. Thao tác cập nhật đã bị hủy để bảo toàn dữ liệu.",
                Instance = context.Request.Path
            }),

            ValidationException valEx => (StatusCodes.Status400BadRequest, new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = valEx.ErrorCode,
                Title = "Validation Failed",
                Detail = valEx.Message,
                Instance = context.Request.Path,
                Extensions = { ["errors"] = valEx.Errors }
            }),

            FluentValidation.ValidationException fValEx => (StatusCodes.Status400BadRequest, new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "VALIDATION_ERROR",
                Title = "Validation Failed",
                Detail = "One or more validation failures occurred.",
                Instance = context.Request.Path,
                Extensions =
                {
                    ["errors"] = fValEx.Errors
                        .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
                        .ToDictionary(g => g.Key, g => g.ToArray())
                }
            }),

            BusinessRuleValidationException ruleEx => (StatusCodes.Status422UnprocessableEntity, new ProblemDetails
            {
                Status = StatusCodes.Status422UnprocessableEntity,
                Type = ruleEx.ErrorCode,
                Title = "Business Rule Violation",
                Detail = ruleEx.Message,
                Instance = context.Request.Path
            }),

            DomainException domEx => (StatusCodes.Status422UnprocessableEntity, new ProblemDetails
            {
                Status = StatusCodes.Status422UnprocessableEntity,
                Type = domEx.ErrorCode,
                Title = "Domain Rule Violation",
                Detail = domEx.Message,
                Instance = context.Request.Path
            }),

            AppException appEx => (appEx.StatusCode, new ProblemDetails
            {
                Status = appEx.StatusCode,
                Type = appEx.ErrorCode,
                Title = "Application Error",
                Detail = appEx.Message,
                Instance = context.Request.Path
            }),

            _ => (StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Type = "INTERNAL_SERVER_ERROR",
                Title = "Internal Server Error",
                Detail = "An unexpected error occurred. Please contact the administrator.",
                Instance = context.Request.Path
            })
        };

        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, JsonOptions));
    }
}
