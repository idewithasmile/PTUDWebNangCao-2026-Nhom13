using System.Diagnostics;
using CulinaryBlog.Application.Common.Observability;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Behaviors;

/// <summary>
/// MediatR Pipeline Behavior for Structured Logging, Distributed Tracing, and Metrics (FR-OBS-002, FR-OBS-003, CONS-010).
/// </summary>
public class LoggingBehavior<TRequest, TResponse>(
    ILogger<LoggingBehavior<TRequest, TResponse>> logger,
    ICurrentUser? currentUser = null)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var requestName = typeof(TRequest).Name;
        var userId = currentUser?.UserId ?? "anonymous";
        var isCommand = requestName.EndsWith("Command", StringComparison.OrdinalIgnoreCase);

        // Distributed Tracing: Start internal activity span
        using var activity = CulinaryBlogDiagnostics.ActivitySource.StartActivity(requestName, ActivityKind.Internal);
        activity?.SetTag("mediatr.request_name", requestName);
        activity?.SetTag("user.id", userId);

        logger.LogInformation("Handling {RequestName} for user {UserId}", requestName, userId);

        // Audit Trail (NFR-SEC-006): Log write operations with User and Timestamp
        if (isCommand)
        {
            logger.LogInformation("Audit Trail: Command {RequestName} initiated by user {UserId} at {Timestamp}",
                requestName, userId, DateTime.UtcNow);
        }

        var timer = Stopwatch.StartNew();

        try
        {
            var response = await next();
            timer.Stop();
            var elapsedMs = timer.ElapsedMilliseconds;

            // Metrics: Record request duration
            CulinaryBlogMetrics.MediatRDuration.Record(elapsedMs, new KeyValuePair<string, object?>("request.name", requestName));

            // Custom Business Metrics (FR-OBS-003)
            if (requestName.Equals("CreateRecipeCommand", StringComparison.OrdinalIgnoreCase))
            {
                CulinaryBlogMetrics.RecipesCreated.Add(1);
            }
            else if (requestName.Equals("PublishRecipeCommand", StringComparison.OrdinalIgnoreCase))
            {
                CulinaryBlogMetrics.RecipesPublished.Add(1);
            }

            // Performance Alert: Warn if request exceeds 500ms
            if (elapsedMs > 500)
            {
                logger.LogWarning("Performance Alert: Request {RequestName} took {ElapsedMs}ms (> 500ms)", requestName, elapsedMs);
            }
            else
            {
                logger.LogInformation("Handled {RequestName} in {ElapsedMs}ms for user {UserId}", requestName, elapsedMs, userId);
            }

            return response;
        }
        catch (Exception ex)
        {
            timer.Stop();
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            CulinaryBlogMetrics.RequestErrors.Add(1, new KeyValuePair<string, object?>("request.name", requestName));

            logger.LogError(ex, "Error handling {RequestName} for user {UserId} after {ElapsedMs}ms",
                requestName, userId, timer.ElapsedMilliseconds);
            throw;
        }
    }
}
