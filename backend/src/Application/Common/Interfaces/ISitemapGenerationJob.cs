namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// FR-JOB-003: Recurring Job tạo sitemap.xml định kỳ.
/// </summary>
public interface ISitemapGenerationJob
{
    Task ExecuteAsync(CancellationToken ct = default);
}
