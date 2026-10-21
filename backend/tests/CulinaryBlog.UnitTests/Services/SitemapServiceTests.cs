using System.Xml.Linq;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;

namespace CulinaryBlog.UnitTests.Services;

public class SitemapServiceTests
{
    private readonly CulinaryBlogDbContext _dbContext;
    private readonly IConfiguration _config;
    private readonly SitemapService _service;

    public SitemapServiceTests()
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(databaseName: $"SitemapTestDb_{Guid.NewGuid()}")
            .Options;

        _dbContext = new CulinaryBlogDbContext(options);

        var configValues = new Dictionary<string, string?>
        {
            ["App:BaseUrl"] = "https://culinaryblog.com"
        };
        _config = new ConfigurationBuilder().AddInMemoryCollection(configValues).Build();

        _service = new SitemapService(_dbContext, _config, NullLogger<SitemapService>.Instance);
    }

    [Fact]
    public async Task GenerateSitemapXmlAsync_GeneratesValidXmlWithCorrectUrlsAndSchema()
    {
        // Arrange: Tạo dữ liệu mẫu
        var cat1 = new Category
        {
            Name = "Món Chay",
            Slug = "mon-chay",
            Description = "Món ăn thanh đạm",
            OrderIndex = 1
        };

        var catDeleted = new Category
        {
            Name = "Món Cũ",
            Slug = "mon-cu",
            Description = "Đã xóa",
            OrderIndex = 2
        };
        catDeleted.SoftDelete();

        _dbContext.Categories.AddRange(cat1, catDeleted);

        var authorId = Guid.NewGuid().ToString();
        var publishedRecipe = Recipe.Create(
            "Bún Chả Hà Nội",
            "bun-cha-ha-noi",
            "Món ngon Hà Nội",
            "Hướng dẫn nấu",
            20, 30, 2, RecipeDifficulty.Easy, cat1.Id, authorId);
        publishedRecipe.AddStep("Bước 1", "Sơ chế nguyên liệu và ướp thịt");
        publishedRecipe.Publish();

        var draftRecipe = Recipe.Create(
            "Phở Bò Tái Nạm",
            "pho-bo-tai-nam",
            "Công thức đang viết dở",
            "Chưa xong",
            15, 60, 4, RecipeDifficulty.Medium, cat1.Id, authorId);

        var deletedRecipe = Recipe.Create(
            "Gỏi Cuốn Tôm Thịt",
            "goi-cuon-tom-thit",
            "Công thức đã xóa",
            "Hướng dẫn",
            10, 10, 2, RecipeDifficulty.Easy, cat1.Id, authorId);
        deletedRecipe.AddStep("Bước 1", "Sơ chế nguyên liệu cuốn gỏi");
        deletedRecipe.Publish();
        deletedRecipe.SoftDelete();

        _dbContext.Recipes.AddRange(publishedRecipe, draftRecipe, deletedRecipe);
        await _dbContext.SaveChangesAsync();

        // Act
        var xmlString = await _service.GenerateSitemapXmlAsync();

        // Assert
        xmlString.Should().NotBeNullOrWhiteSpace();

        // Parse XML để xác thực cấu trúc hợp lệ
        var doc = XDocument.Parse(xmlString);
        XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

        doc.Root.Should().NotBeNull();
        doc.Root!.Name.Should().Be(ns + "urlset");

        var urls = doc.Root.Elements(ns + "url").ToList();

        // Kiểm tra các trang tĩnh
        urls.Should().Contain(u => u.Element(ns + "loc")!.Value == "https://culinaryblog.com/" &&
                                  u.Element(ns + "priority")!.Value == "1.0");
        urls.Should().Contain(u => u.Element(ns + "loc")!.Value == "https://culinaryblog.com/recipes" &&
                                  u.Element(ns + "priority")!.Value == "1.0");
        urls.Should().Contain(u => u.Element(ns + "loc")!.Value == "https://culinaryblog.com/categories" &&
                                  u.Element(ns + "priority")!.Value == "1.0");

        // Kiểm tra category hợp lệ
        urls.Should().Contain(u => u.Element(ns + "loc")!.Value == "https://culinaryblog.com/categories/mon-chay" &&
                                  u.Element(ns + "changefreq")!.Value == "monthly" &&
                                  u.Element(ns + "priority")!.Value == "0.6" &&
                                  u.Element(ns + "lastmod") != null);

        // Kiểm tra category đã xóa KHÔNG có trong sitemap
        urls.Should().NotContain(u => u.Element(ns + "loc")!.Value.Contains("mon-cu"));

        // Kiểm tra recipe published có trong sitemap
        urls.Should().Contain(u => u.Element(ns + "loc")!.Value == "https://culinaryblog.com/recipes/bun-cha-ha-noi" &&
                                  u.Element(ns + "changefreq")!.Value == "weekly" &&
                                  u.Element(ns + "priority")!.Value == "0.8" &&
                                  u.Element(ns + "lastmod") != null);

        // Kiểm tra draft và deleted recipes KHÔNG có trong sitemap
        urls.Should().NotContain(u => u.Element(ns + "loc")!.Value.Contains("pho-bo-tai-nam"));
        urls.Should().NotContain(u => u.Element(ns + "loc")!.Value.Contains("goi-cuon-tom-thit"));
    }
}
