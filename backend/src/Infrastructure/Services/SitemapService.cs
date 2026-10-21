using System.Globalization;
using System.Xml.Linq;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Dịch vụ sinh chuỗi XML sitemap theo chuẩn sitemaps.org (FR-JOB-003, NFR-SEO-003).
/// </summary>
public class SitemapService : ISitemapService
{
    private readonly CulinaryBlogDbContext _dbContext;
    private readonly IConfiguration _config;
    private readonly ILogger<SitemapService> _logger;

    public SitemapService(CulinaryBlogDbContext dbContext, IConfiguration config, ILogger<SitemapService> logger)
    {
        _dbContext = dbContext;
        _config = config;
        _logger = logger;
    }

    public async Task<string> GenerateSitemapXmlAsync(CancellationToken ct = default)
    {
        var baseUrl = (_config["App:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
        XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

        var urlset = new XElement(ns + "urlset");

        int urlCount = 0;

        // 1. Các trang tĩnh (Trang chủ, /recipes, /categories) - priority: 1.0
        var staticPages = new (string Path, string ChangeFreq, double Priority)[]
        {
            ("/", "daily", 1.0),
            ("/recipes", "daily", 1.0),
            ("/categories", "weekly", 1.0)
        };

        foreach (var page in staticPages)
        {
            var urlElem = new XElement(ns + "url",
                new XElement(ns + "loc", $"{baseUrl}{page.Path}"),
                new XElement(ns + "changefreq", page.ChangeFreq),
                new XElement(ns + "priority", page.Priority.ToString("F1", CultureInfo.InvariantCulture))
            );
            urlset.Add(urlElem);
            urlCount++;
        }

        // 2. Danh mục (Categories: IsDeleted == false) - priority: 0.6, changefreq: monthly
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.OrderIndex)
            .ThenBy(c => c.Name)
            .Select(c => new
            {
                c.Slug,
                LastMod = c.UpdatedAt ?? c.CreatedAt
            })
            .ToListAsync(ct);

        foreach (var category in categories)
        {
            var urlElem = new XElement(ns + "url",
                new XElement(ns + "loc", $"{baseUrl}/categories/{category.Slug}"),
                new XElement(ns + "lastmod", category.LastMod.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)),
                new XElement(ns + "changefreq", "monthly"),
                new XElement(ns + "priority", (0.6).ToString("F1", CultureInfo.InvariantCulture))
            );
            urlset.Add(urlElem);
            urlCount++;
        }

        // 3. Công thức hợp lệ (Recipes: Published, IsDeleted == false) - priority: 0.8, changefreq: weekly
        var recipes = await _dbContext.Recipes
            .AsNoTracking()
            .Where(r => !r.IsDeleted && r.Status == RecipeStatus.Published)
            .OrderByDescending(r => r.PublishedAt ?? r.CreatedAt)
            .Select(r => new
            {
                r.Slug,
                LastMod = r.UpdatedAt ?? r.PublishedAt ?? r.CreatedAt
            })
            .ToListAsync(ct);

        foreach (var recipe in recipes)
        {
            var urlElem = new XElement(ns + "url",
                new XElement(ns + "loc", $"{baseUrl}/recipes/{recipe.Slug}"),
                new XElement(ns + "lastmod", recipe.LastMod.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)),
                new XElement(ns + "changefreq", "weekly"),
                new XElement(ns + "priority", (0.8).ToString("F1", CultureInfo.InvariantCulture))
            );
            urlset.Add(urlElem);
            urlCount++;
        }

        var doc = new XDocument(
            new XDeclaration("1.0", "UTF-8", "yes"),
            urlset
        );

        _logger.LogInformation("FR-JOB-003: Đã sinh nội dung sitemap XML với tổng cộng {UrlCount} URLs.", urlCount);

        using var sw = new StringWriterWithEncoding(System.Text.Encoding.UTF8);
        doc.Save(sw);
        return sw.ToString();
    }

    private sealed class StringWriterWithEncoding(System.Text.Encoding encoding) : StringWriter
    {
        public override System.Text.Encoding Encoding => encoding;
    }
}
