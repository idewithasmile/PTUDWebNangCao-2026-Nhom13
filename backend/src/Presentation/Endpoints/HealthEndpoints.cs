using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace CulinaryBlog.API.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthChecks(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHealthChecks("/health");
        endpoints.MapHealthChecks("/health/live", new() { Predicate = _ => false });
        endpoints.MapHealthChecks("/health/ready", new() { Predicate = check => check.Tags.Contains("ready") });
        return endpoints;
    }
}
