using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.IntegrationTests.Fixtures;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CulinaryBlog.API.IntegrationTests.Endpoints;

public class FileEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    public FileEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        await _factory.ResetDatabaseAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private string CreateToken(string userId, string email, params string[] roles)
    {
        using var scope = _factory.Services.CreateScope();
        var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
        var user = new ApplicationUser
        {
            Id = userId,
            UserName = email,
            Email = email,
            DisplayName = "Test User"
        };
        return jwtService.GenerateAccessToken(user, roles.ToList());
    }

    [Fact]
    public async Task UploadFile_WithoutAuth_Returns401Unauthorized()
    {
        using var form = new MultipartFormDataContent();
        form.Add(new ByteArrayContent([0xFF, 0xD8, 0xFF, 0x00]), "file", "photo.jpg");

        var response = await _client.PostAsync("/api/v1/files/upload", form);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UploadFile_WithValidAuthAndFile_Returns201Created()
    {
        var token = CreateToken("user-1", "user1@test.com", "Author");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var form = new MultipartFormDataContent();
        form.Add(new ByteArrayContent([0xFF, 0xD8, 0xFF, 0x00]), "file", "avatar.jpg");

        var response = await _client.PostAsync("/api/v1/files/upload?folder=avatars", form);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var result = await response.Content.ReadFromJsonAsync<FileUploadResponse>(_jsonOptions);
        result.Should().NotBeNull();
        result!.Url.Should().StartWith("/culinary-blog/avatars/");
        result.FileName.Should().Be("avatar.jpg");
    }

    [Fact]
    public async Task DeleteFile_WithValidAuthAndUrl_Returns204NoContent()
    {
        var token = CreateToken("user-1", "user1@test.com", "Author");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.DeleteAsync("/api/v1/files?url=/culinary-blog/avatars/test.jpg");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task RecipeImages_FullFlow_UploadSetPrimaryDelete()
    {
        var authorId = "author-123";
        var token = CreateToken(authorId, "author@test.com", "Author");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        Guid recipeId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            var cat = new Category { Name = "Món Chính", Slug = "mon-chinh" };
            db.Categories.Add(cat);
            var recipe = Recipe.Create("Phở bò", "pho-bo", "Ngon", "Nấu", 20, 40, 4, RecipeDifficulty.Medium, cat.Id, authorId, null);
            db.Recipes.Add(recipe);
            await db.SaveChangesAsync();
            recipeId = recipe.Id;
        }

        // 1. POST /api/v1/recipes/{id}/images -> 201 Created
        using var form1 = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent([0xFF, 0xD8, 0xFF, 0x00]);
        fileContent1.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
        form1.Add(fileContent1, "file", "pho1.jpg");
        form1.Add(new StringContent("Ảnh tô phở"), "altText");

        var uploadResp1 = await _client.PostAsync($"/api/v1/recipes/{recipeId}/images", form1);
        var uploadBody1 = await uploadResp1.Content.ReadAsStringAsync();
        uploadResp1.StatusCode.Should().Be(HttpStatusCode.Created, because: uploadBody1);
        var img1 = await uploadResp1.Content.ReadFromJsonAsync<RecipeImageDto>(_jsonOptions);
        img1.Should().NotBeNull();
        img1!.IsPrimary.Should().BeTrue();
        img1.AltText.Should().Be("Ảnh tô phở");

        // 2. Upload second image
        using var form2 = new MultipartFormDataContent();
        var fileContent2 = new ByteArrayContent([0x89, 0x50, 0x4E, 0x47]);
        fileContent2.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
        form2.Add(fileContent2, "file", "pho2.png");
        var uploadResp2 = await _client.PostAsync($"/api/v1/recipes/{recipeId}/images", form2);
        var uploadBody2 = await uploadResp2.Content.ReadAsStringAsync();
        uploadResp2.StatusCode.Should().Be(HttpStatusCode.Created, because: uploadBody2);
        uploadResp2.StatusCode.Should().Be(HttpStatusCode.Created);
        var img2 = await uploadResp2.Content.ReadFromJsonAsync<RecipeImageDto>(_jsonOptions);
        img2!.IsPrimary.Should().BeFalse();

        // 3. PATCH /api/v1/recipes/{id}/images/{img2.Id}/primary -> 200 OK
        var primaryResp = await _client.PatchAsync($"/api/v1/recipes/{recipeId}/images/{img2.Id}/primary", null);
        primaryResp.StatusCode.Should().Be(HttpStatusCode.OK);

        // 4. DELETE /api/v1/recipes/{id}/images/{img1.Id} -> 204 NoContent
        var deleteResp = await _client.DeleteAsync($"/api/v1/recipes/{recipeId}/images/{img1.Id}");
        deleteResp.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
