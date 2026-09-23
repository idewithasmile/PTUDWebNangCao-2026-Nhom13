using System.Text.Json;
using CulinaryBlog.Application.Common.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.API.Middlewares;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled Exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, problemDetails) = exception switch
        {
            ValidationException valEx => (400, new ProblemDetails
            {
                Status = 400,
                Type = valEx.ErrorCode,
                Title = "Validation Failed",
                Detail = valEx.Message,
                Extensions = { ["errors"] = valEx.Errors }
            }),
            AppException appEx => (appEx.StatusCode, new ProblemDetails
            {
                Status = appEx.StatusCode,
                Type = appEx.ErrorCode,
                Title = "Application Error",
                Detail = appEx.Message
            }),
            _ => (500, new ProblemDetails
            {
                Status = 500,
                Type = "INTERNAL_SERVER_ERROR",
                Title = "Internal Server Error",
                Detail = "An unexpected error occurred."
            })
        };

        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}
