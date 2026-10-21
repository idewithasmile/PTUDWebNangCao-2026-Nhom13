using System.Diagnostics.Metrics;

namespace CulinaryBlog.Application.Common.Observability;

/// <summary>
/// Application metrics and instruments for CulinaryBlog (FR-OBS-003).
/// Uses only .NET BCL System.Diagnostics.Metrics (CONS-001).
/// </summary>
public static class CulinaryBlogMetrics
{
    public const string MeterName = "CulinaryBlog.Metrics";
    public const string MeterVersion = "1.0.0";

    public static readonly Meter Meter = new(MeterName, MeterVersion);

    /// <summary>
    /// Counter for created recipes (+1 on CreateRecipeCommand success).
    /// </summary>
    public static readonly Counter<long> RecipesCreated =
        Meter.CreateCounter<long>("culinaryblog.recipes.created", description: "Count of recipes created");

    /// <summary>
    /// Counter for published recipes (+1 on PublishRecipeCommand success).
    /// </summary>
    public static readonly Counter<long> RecipesPublished =
        Meter.CreateCounter<long>("culinaryblog.recipes.published", description: "Count of recipes published");

    /// <summary>
    /// Histogram for MediatR request execution duration in milliseconds.
    /// </summary>
    public static readonly Histogram<double> MediatRDuration =
        Meter.CreateHistogram<double>("culinaryblog.mediatr.duration", unit: "ms", description: "Execution duration of MediatR requests in milliseconds");

    /// <summary>
    /// Counter for failed requests (incremented when request throws exception).
    /// </summary>
    public static readonly Counter<long> RequestErrors =
        Meter.CreateCounter<long>("culinaryblog.requests.errors", description: "Count of failed requests");
}
