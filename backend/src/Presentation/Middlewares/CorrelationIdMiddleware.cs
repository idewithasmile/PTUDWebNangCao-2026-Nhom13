using Serilog.Context;

namespace CulinaryBlog.API.Middlewares;

public class CorrelationIdMiddleware(RequestDelegate next)
{
    private const string HeaderKey = "X-Correlation-ID";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[HeaderKey].FirstOrDefault() ?? Guid.NewGuid().ToString();
        context.Response.Headers[HeaderKey] = correlationId;

        using (LogContext.PushProperty("CorrelationId", correlationId))
        using (LogContext.PushProperty("RequestPath", context.Request.Path.Value))
        {
            await next(context);
        }
    }
}
