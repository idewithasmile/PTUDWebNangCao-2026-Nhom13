using System.Diagnostics;

namespace CulinaryBlog.Application.Common.Observability;

/// <summary>
/// Tracing constants and ActivitySource for CulinaryBlog (FR-OBS-003).
/// Uses only .NET BCL System.Diagnostics (CONS-001).
/// </summary>
public static class CulinaryBlogDiagnostics
{
    public const string ServiceName = "CulinaryBlog.Application";
    public const string ServiceVersion = "1.0.0";

    public static readonly ActivitySource ActivitySource = new(ServiceName, ServiceVersion);
}
