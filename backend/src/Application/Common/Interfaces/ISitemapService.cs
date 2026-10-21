namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// Abstraction cho việc tạo nội dung Sitemap XML theo chuẩn sitemaps.org.
/// </summary>
public interface ISitemapService
{
    Task<string> GenerateSitemapXmlAsync(CancellationToken ct = default);
}
