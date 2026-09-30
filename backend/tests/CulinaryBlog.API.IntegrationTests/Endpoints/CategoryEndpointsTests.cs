using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using CulinaryBlog.API.IntegrationTests.Fixtures;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CulinaryBlog.API.IntegrationTests.Endpoints;

/// <summary>
/// Bộ kiểm thử Integration API cho 2 endpoints đọc dữ liệu của Categories:
/// - GET /api/v1/categories
/// - GET /api/v1/categories/{slug}
/// Sử dụng WebApplicationFactory<Program> gửi HTTP request thật qua toàn bộ pipeline.
/// </summary>
public class CategoryEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    public CategoryEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        await _factory.ResetDatabaseAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    #region 1. GET /api/v1/categories

    [Fact]
    public async Task GetCategories_ShouldReturn200WithOrderedCategoriesAndAccurateRecipeCount()
    {
        // Arrange
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

            var author = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "chef_test_1",
                DisplayName = "Bếp Trưởng 1",
                Email = "chef1@test.com"
            };
            db.Users.Add(author);

            var catA = new Category { Name = "Món Khai Vị", Slug = "mon-khai-vi", OrderIndex = 2 };
            var catB = new Category { Name = "Món Canh Đặc Sắc", Slug = "mon-canh", OrderIndex = 1 };
            db.Categories.AddRange(catA, catB);
            await db.SaveChangesAsync();

            // Thêm 2 recipes cho catB (1 Published, 1 Draft)
            var recipe1 = new Recipe
            {
                Title = "Canh chua cá lóc",
                Slug = "canh-chua-ca-loc",
                CategoryId = catB.Id,
                AuthorId = author.Id,
                Status = RecipeStatus.Published,
                IsDeleted = false
            };
            var recipe2 = new Recipe
            {
                Title = "Canh bí đỏ",
                Slug = "canh-bi-do",
                CategoryId = catB.Id,
                AuthorId = author.Id,
                Status = RecipeStatus.Draft, // Chưa published -> không đếm
                IsDeleted = false
            };
            db.Recipes.AddRange(recipe1, recipe2);
            await db.SaveChangesAsync();
        }

        // Act
        var response = await _client.GetAsync("/api/v1/categories");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var categories = await response.Content.ReadFromJsonAsync<List<CategoryDto>>(_jsonOptions);

        categories.Should().NotBeNull();
        categories.Should().HaveCount(2);

        // Kiểm tra sắp xếp theo OrderIndex tăng dần (catB có OrderIndex=1 trước catA có OrderIndex=2)
        categories![0].Slug.Should().Be("mon-canh");
        categories[0].RecipeCount.Should().Be(1); // Chỉ đếm bài Published

        categories[1].Slug.Should().Be("mon-khai-vi");
        categories[1].RecipeCount.Should().Be(0);
    }

    [Fact]
    public async Task GetCategories_SecondRequest_ShouldServeFromDistributedCache()
    {
        // Arrange
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            db.Categories.Add(new Category { Name = "Món Tráng Miệng", Slug = "mon-trang-mieng", OrderIndex = 1 });
            await db.SaveChangesAsync();
        }

        // Act 1: Lần đầu tiên gọi API nạp cache
        var response1 = await _client.GetAsync("/api/v1/categories");
        response1.StatusCode.Should().Be(HttpStatusCode.OK);
        var firstResult = await response1.Content.ReadFromJsonAsync<List<CategoryDto>>(_jsonOptions);

        // Thêm trực tiếp 1 category vào CSDL mà không thông qua Command (bỏ qua Cache Invalidator)
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            db.Categories.Add(new Category { Name = "Món Lẩu Nóng", Slug = "mon-lau-nong", OrderIndex = 2 });
            await db.SaveChangesAsync();
        }

        // Act 2: Lần thứ 2 gọi API
        var response2 = await _client.GetAsync("/api/v1/categories");
        response2.StatusCode.Should().Be(HttpStatusCode.OK);
        var secondResult = await response2.Content.ReadFromJsonAsync<List<CategoryDto>>(_jsonOptions);

        // Assert: Kết quả lần 2 vẫn là kết quả từ Cache (1 item), chưa có item mới
        secondResult.Should().NotBeNull();
        secondResult.Should().HaveCount(firstResult!.Count);
        secondResult![0].Slug.Should().Be(firstResult[0].Slug);
    }

    #endregion

    #region 2. GET /api/v1/categories/{slug}

    [Fact]
    public async Task GetCategoryBySlug_HappyPath_ShouldReturn200WithDetailAndRecipes()
    {
        // Arrange
        Guid catId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

            var author = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "chef_test_2",
                DisplayName = "Bếp Trưởng Huế",
                Email = "chef2@test.com"
            };
            db.Users.Add(author);

            var cat = new Category
            {
                Name = "Ẩm Thực Huế",
                Slug = "am-thuc-hue",
                Description = "Đặc sản cung đình Huế",
                OrderIndex = 1
            };
            db.Categories.Add(cat);
            await db.SaveChangesAsync();
            catId = cat.Id;

            var recipe = new Recipe
            {
                Title = "Bún bò Huế chuẩn vị",
                Slug = "bun-bo-hue-chuan-vi",
                CategoryId = catId,
                AuthorId = author.Id,
                Status = RecipeStatus.Published,
                IsDeleted = false
            };
            db.Recipes.Add(recipe);
            await db.SaveChangesAsync();
        }

        // Act
        var response = await _client.GetAsync("/api/v1/categories/am-thuc-hue");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var detail = await response.Content.ReadFromJsonAsync<CategoryDetailDto>(_jsonOptions);

        detail.Should().NotBeNull();
        detail!.Category.Name.Should().Be("Ẩm Thực Huế");
        detail.Category.Slug.Should().Be("am-thuc-hue");
        detail.Recipes.Items.Should().HaveCount(1);
        detail.Recipes.Items[0].Title.Should().Be("Bún bò Huế chuẩn vị");
    }

    [Fact]
    public async Task GetCategoryBySlug_WithPagination_ShouldReturnExactPageSizeAndCalculatedTotalPages()
    {
        // Arrange: Tạo 1 danh mục và 12 công thức nấu ăn đã published
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

            var author = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "chef_test_3",
                DisplayName = "Bếp Trưởng Chiên",
                Email = "chef3@test.com"
            };
            db.Users.Add(author);

            var cat = new Category { Name = "Món Chiên", Slug = "mon-chien", OrderIndex = 1 };
            db.Categories.Add(cat);
            await db.SaveChangesAsync();

            var recipes = Enumerable.Range(1, 12).Select(i => new Recipe
            {
                Title = $"Món chiên số {i}",
                Slug = $"mon-chien-{i}",
                CategoryId = cat.Id,
                AuthorId = author.Id,
                Status = RecipeStatus.Published,
                IsDeleted = false
            });
            db.Recipes.AddRange(recipes);
            await db.SaveChangesAsync();
        }

        // Act: Lấy page=1, pageSize=5
        var response = await _client.GetAsync("/api/v1/categories/mon-chien?page=1&pageSize=5");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var detail = await response.Content.ReadFromJsonAsync<CategoryDetailDto>(_jsonOptions);

        detail.Should().NotBeNull();
        detail!.Recipes.Items.Should().HaveCount(5);
        detail.Recipes.TotalCount.Should().Be(12);
        detail.Recipes.Page.Should().Be(1);
        detail.Recipes.PageSize.Should().Be(5);
        detail.Recipes.TotalPages.Should().Be(3); // ceil(12 / 5) = 3
        detail.Recipes.HasNextPage.Should().BeTrue();
        detail.Recipes.HasPreviousPage.Should().BeFalse();
    }

    [Fact]
    public async Task GetCategoryBySlug_WhenNotFound_ShouldReturn404ProblemDetails()
    {
        // Act: Gửi slug không tồn tại
        var response = await _client.GetAsync("/api/v1/categories/danh-muc-khong-co");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");

        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>(_jsonOptions);
        problem.Should().NotBeNull();
        problem!.Status.Should().Be(404);
        problem.Type.Should().Be("CATEGORY_NOT_FOUND");
    }

    #endregion
}
