using System.Text;
using System.Text.RegularExpressions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using Hangfire;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// FR-JOB-003: Sitemap Generation Job (Recurring Job).
/// Chạy định kỳ lúc 02:00 AM UTC mỗi ngày, sinh file sitemap.xml chứa Published recipes, categories, static pages.
/// Retry policy: Thử lại tối đa 2 lần nếu có sự cố.
/// </summary>
public class SitemapGenerationJob : ISitemapGenerationJob
{
    private readonly ISitemapService _sitemapService;
    private readonly IFileStorageService _fileStorage;
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory? _httpClientFactory;
    private readonly ILogger<SitemapGenerationJob> _logger;

    public SitemapGenerationJob(
        ISitemapService sitemapService,
        IFileStorageService fileStorage,
        IConfiguration config,
        ILogger<SitemapGenerationJob> logger,
        IHttpClientFactory? httpClientFactory = null)
    {
        _sitemapService = sitemapService;
        _fileStorage = fileStorage;
        _config = config;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    [AutomaticRetry(Attempts = 2, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("FR-JOB-003: Bắt đầu thực thi SitemapGenerationJob định kỳ...");

        try
        {
            var xmlContent = await _sitemapService.GenerateSitemapXmlAsync(ct);

            // Đếm số lượng URL sinh ra trong XML
            var urlCount = Regex.Matches(xmlContent, "<url>").Count;

            // 1. Lưu file sitemap.xml vào wwwroot
            var wwwrootDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            if (!Directory.Exists(wwwrootDir))
            {
                Directory.CreateDirectory(wwwrootDir);
            }
            var sitemapFilePath = Path.Combine(wwwrootDir, "sitemap.xml");
            await File.WriteAllTextAsync(sitemapFilePath, xmlContent, Encoding.UTF8, ct);

            // 2. Best-effort upload bản sao lên MinIO
            try
            {
                using var xmlStream = new MemoryStream(Encoding.UTF8.GetBytes(xmlContent));
                await _fileStorage.UploadAsync(xmlStream, "sitemaps/sitemap.xml", "application/xml", folder: null, ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "FR-JOB-003: Không thể tải bản sao sitemap.xml lên MinIO (file wwwroot vẫn hợp lệ)");
            }

            // Ghi Structured Log theo chuẩn NFR-SEO-003
            _logger.LogInformation("FR-JOB-003: Hoàn thành tạo Sitemap XML thành công. Đã xuất {UrlCount} URLs ra file {Path}",
                urlCount, sitemapFilePath);

            // 3. Best-effort ping Google Search Console
            await PingSearchEnginesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "FR-JOB-003: Thất bại khi sinh sitemap.xml định kỳ.");
            throw; // Hangfire AutomaticRetry
        }
    }

    private async Task PingSearchEnginesAsync(CancellationToken ct)
    {
        var baseUrl = (_config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
        var sitemapUrl = $"{baseUrl}/sitemap.xml";

        if (_httpClientFactory != null)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(5);
                var pingUrl = $"https://www.google.com/ping?sitemap={Uri.EscapeDataString(sitemapUrl)}";
                var response = await client.GetAsync(pingUrl, ct);
                _logger.LogInformation("FR-JOB-003: Ping Google Search Console trả về status {StatusCode}", response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("FR-JOB-003: Không thể gửi ping Google Search Console (môi trường dev/offline): {Message}", ex.Message);
            }
        }
    }
}
