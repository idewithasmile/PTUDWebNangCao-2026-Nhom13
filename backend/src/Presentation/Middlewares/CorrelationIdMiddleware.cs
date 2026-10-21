using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace CulinaryBlog.API.Middlewares;

/// <summary>
/// Middleware to handle X-Correlation-ID and enrich logs with CorrelationId, RequestPath, TraceId, SpanId (FR-OBS-002, CONS-010).
/// </summary>
public class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string HeaderKey = "X-Correlation-ID";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[HeaderKey].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(correlationId))
        {
            correlationId = Guid.NewGuid().ToString();
        }

        context.Items["CorrelationId"] = correlationId;
        context.TraceIdentifier = correlationId;

        context.Response.Headers[HeaderKey] = correlationId;
        // Ensure Response Header is preserved if cleared before body streaming
        context.Response.OnStarting(() =>
        {
            if (!context.Response.Headers.ContainsKey(HeaderKey))
            {
                context.Response.Headers[HeaderKey] = correlationId;
            }
            return Task.CompletedTask;
        });

        var requestPath = context.Request.Path.Value ?? string.Empty;
        var activity = Activity.Current;
        var traceId = activity?.TraceId.ToString() ?? context.TraceIdentifier;
        var spanId = activity?.SpanId.ToString() ?? string.Empty;

        using (LogContext.PushProperty("CorrelationId", correlationId))
        using (LogContext.PushProperty("RequestPath", requestPath))
        using (LogContext.PushProperty("TraceId", traceId))
        using (LogContext.PushProperty("SpanId", spanId))
        using (LogContext.PushProperty("UserId", "anonymous"))
        {
            await next(context);
        }
    }
}
