using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace CulinaryBlog.API.Middlewares;

/// <summary>
/// Enriches Serilog LogContext with authenticated UserId after authentication executes (FR-OBS-002, CONS-010).
/// </summary>
public class UserLogEnrichmentMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var userId = context.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? context.User?.FindFirstValue("sub")
                     ?? (context.User?.Identity?.IsAuthenticated == true ? "authenticated" : "anonymous");

        using (LogContext.PushProperty("UserId", userId))
        {
            await next(context);
        }
    }
}
