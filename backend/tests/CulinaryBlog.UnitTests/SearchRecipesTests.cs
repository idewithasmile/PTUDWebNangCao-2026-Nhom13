using CulinaryBlog.Application.Features.Categories.Mappings;
using CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.UnitTests;

/// <summary>
/// Bộ kiểm thử đơn vị cho phân hệ Tìm kiếm Toàn văn bản Công thức nấu ăn (FR-SRCH-001).
/// Kiểm tra tính năng tìm kiếm tiếng Việt không dấu, phân quyền 3 cấp (Guest / Author / Admin) và phân trang.
/// </summary>
public class SearchRecipesTests
{
    public SearchRecipesTests()
    {
        // Đăng ký cấu hình ánh xạ Mapster cho Recipe -> RecipeSummaryDto
        CategoryMappingConfig.RegisterMappings();
    }

    private static CulinaryBlogDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new CulinaryBlogDbContext(options);
    }

    private static Recipe CreateTestRecipe(
        string title,
        string slug,
        string description,
        Guid categoryId,
        string authorId,
        bool publish = false,
        RecipeDifficulty difficulty = RecipeDifficulty.Easy)
    {
        var recipe = Recipe.Create(
            title,
            slug,
            description,
            "Hướng dẫn chế biến",
            15,
            30,
            4,
            difficulty,
            categoryId,
            authorId);

        // Bổ sung bước thực hiện hợp lệ theo Domain Rule trước khi Publish
        recipe.AddStep("Bước 1", "Sơ chế và chế biến nguyên liệu");

        if (publish)
        {
            recipe.Publish();
        }

        return recipe;
    }

    [Fact]
    public async Task SearchRecipes_VietnameseUnaccent_ShouldFindRecipesWithoutAccents()
    {
        // Arrange: Chuẩn bị dữ liệu công thức có dấu tiếng Việt
        using var db = CreateInMemoryDbContext();
        var author = new ApplicationUser { Id = "author-1", UserName = "chef", DisplayName = "Đầu bếp", Email = "chef@test.com" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Món Nước", Slug = "mon-nuoc" };
        db.Users.Add(author);
        db.Categories.Add(category);

        var recipe1 = CreateTestRecipe("Phở Bò Tái Nạm", "pho-bo-tai-nam", "Món phở truyền thống Hà Nội thơm ngon", category.Id, author.Id, publish: true);
        var recipe2 = CreateTestRecipe("Cơm Tấm Sườn Bì", "com-tam-suon-bi", "Cơm tấm đặc sản Sài Gòn", category.Id, author.Id, publish: true);

        db.Recipes.AddRange(recipe1, recipe2);
        await db.SaveChangesAsync();

        var recipeRepo = new RecipeRepository(db);
        var handler = new SearchRecipesQueryHandler(recipeRepo);

        // Act: Tìm kiếm từ khóa không dấu "pho bo"
        var query = new SearchRecipesQuery("pho bo", Page: 1, PageSize: 10);
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Kết quả phải khớp chính xác với "Phở Bò Tái Nạm"
        result.TotalCount.Should().Be(1);
        result.Items.Should().ContainSingle(r => r.Title == "Phở Bò Tái Nạm");
    }

    [Fact]
    public async Task SearchRecipes_GuestRole_ShouldOnlyReturnPublishedRecipes()
    {
        // Arrange: Khách vãng lai tìm kiếm chỉ thấy bài Published
        using var db = CreateInMemoryDbContext();
        var author = new ApplicationUser { Id = "author-1", UserName = "chef", DisplayName = "Đầu bếp", Email = "chef@test.com" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Món Nước", Slug = "mon-nuoc" };
        db.Users.Add(author);
        db.Categories.Add(category);

        var pubRecipe = CreateTestRecipe("Bún Bò Huế", "bun-bo-hue", "Hương vị cay nồng miền Trung", category.Id, author.Id, publish: true);
        var draftRecipe = CreateTestRecipe("Bò Kho Bánh Mì", "bo-kho-banh-mi", "Bò kho đậm đà thơm béo", category.Id, author.Id, publish: false);

        db.Recipes.AddRange(pubRecipe, draftRecipe);
        await db.SaveChangesAsync();

        var recipeRepo = new RecipeRepository(db);
        var handler = new SearchRecipesQueryHandler(recipeRepo);

        // Act: Khách vãng lai tìm từ khóa "bo"
        var query = new SearchRecipesQuery("bo", CurrentUserId: null, IsAdmin: false);
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Chỉ thấy bài đã xuất bản (Published)
        result.TotalCount.Should().Be(1);
        result.Items.Should().ContainSingle(r => r.Title == "Bún Bò Huế");
        result.Items.Should().NotContain(r => r.Title == "Bò Kho Bánh Mì");
    }

    [Fact]
    public async Task SearchRecipes_AuthorRole_ShouldReturnPublishedAndOwnDraft()
    {
        // Arrange: Tác giả thấy bài Published chung và bài Draft của chính mình, không thấy Draft người khác
        using var db = CreateInMemoryDbContext();
        var myAuthor = new ApplicationUser { Id = "my-id", UserName = "me", DisplayName = "Tôi", Email = "me@test.com" };
        var otherAuthor = new ApplicationUser { Id = "other-id", UserName = "other", DisplayName = "Người khác", Email = "other@test.com" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Món Canh", Slug = "mon-canh" };
        db.Users.AddRange(myAuthor, otherAuthor);
        db.Categories.Add(category);

        var otherPub = CreateTestRecipe("Canh Chua Cá Hồi", "canh-chua-ca-hoi", "Canh chua cá hồi béo ngậy", category.Id, otherAuthor.Id, publish: true);
        var myDraft = CreateTestRecipe("Canh Chua Tôm", "canh-chua-tom", "Canh chua nấu tôm tươi", category.Id, myAuthor.Id, publish: false);
        var otherDraft = CreateTestRecipe("Canh Chua Lươn", "canh-chua-luon", "Canh chua lươn xứ Nghệ", category.Id, otherAuthor.Id, publish: false);

        db.Recipes.AddRange(otherPub, myDraft, otherDraft);
        await db.SaveChangesAsync();

        var recipeRepo = new RecipeRepository(db);
        var handler = new SearchRecipesQueryHandler(recipeRepo);

        // Act: Tác giả "my-id" tìm kiếm "canh chua"
        var query = new SearchRecipesQuery("canh chua", CurrentUserId: "my-id", IsAdmin: false);
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Thấy bài Published của người khác và Draft của mình (Tổng: 2 bài), không thấy Draft người khác
        result.TotalCount.Should().Be(2);
        result.Items.Should().Contain(r => r.Title == "Canh Chua Cá Hồi");
        result.Items.Should().Contain(r => r.Title == "Canh Chua Tôm");
        result.Items.Should().NotContain(r => r.Title == "Canh Chua Lươn");
    }

    [Fact]
    public async Task SearchRecipes_AdminRole_ShouldReturnAllMatchingRecipes()
    {
        // Arrange: Quản trị viên (Admin) thấy tất cả các bài viết
        using var db = CreateInMemoryDbContext();
        var author1 = new ApplicationUser { Id = "auth-1", UserName = "user1", DisplayName = "User 1", Email = "u1@test.com" };
        var author2 = new ApplicationUser { Id = "auth-2", UserName = "user2", DisplayName = "User 2", Email = "u2@test.com" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Bánh", Slug = "banh" };
        db.Users.AddRange(author1, author2);
        db.Categories.Add(category);

        var pubRecipe = CreateTestRecipe("Bánh Xèo Giòn Rụm", "banh-xeo-gion-rum", "Bánh xèo miền Tây", category.Id, author1.Id, publish: true);
        var draftRecipe1 = CreateTestRecipe("Bánh Khọt Vũng Tàu", "banh-khot-vung-tau", "Bánh khọt tôm", category.Id, author1.Id, publish: false);
        var draftRecipe2 = CreateTestRecipe("Bánh Bèo Huế", "banh-beo-hue", "Bánh bèo chén", category.Id, author2.Id, publish: false);

        db.Recipes.AddRange(pubRecipe, draftRecipe1, draftRecipe2);
        await db.SaveChangesAsync();

        var recipeRepo = new RecipeRepository(db);
        var handler = new SearchRecipesQueryHandler(recipeRepo);

        // Act: Admin tìm kiếm "banh"
        var query = new SearchRecipesQuery("banh", IsAdmin: true);
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Admin thấy toàn bộ 3 bài viết
        result.TotalCount.Should().Be(3);
    }

    [Fact]
    public async Task SearchRecipes_Pagination_ShouldReturnPaginatedResult()
    {
        // Arrange: Kiểm tra phân trang kết quả tìm kiếm
        using var db = CreateInMemoryDbContext();
        var author = new ApplicationUser { Id = "author-1", UserName = "chef", DisplayName = "Đầu bếp", Email = "chef@test.com" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Món Gà", Slug = "mon-ga" };
        db.Users.Add(author);
        db.Categories.Add(category);

        var recipe1 = CreateTestRecipe("Gà Hấp Lá Chanh", "ga-hap-la-chanh", "Gà ta hấp lá chanh", category.Id, author.Id, publish: true);
        var recipe2 = CreateTestRecipe("Gà Nướng Muối Ớt", "ga-nuong-muoi-ot", "Gà nướng cay nồng", category.Id, author.Id, publish: true);

        db.Recipes.AddRange(recipe1, recipe2);
        await db.SaveChangesAsync();

        var recipeRepo = new RecipeRepository(db);
        var handler = new SearchRecipesQueryHandler(recipeRepo);

        // Act: Lấy trang 1 với kích thước trang là 1
        var query = new SearchRecipesQuery("ga", Page: 1, PageSize: 1);
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Phân trang chính xác
        result.Items.Should().HaveCount(1);
        result.TotalCount.Should().Be(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(1);
        result.TotalPages.Should().Be(2);
        result.HasNextPage.Should().BeTrue();
        result.HasPreviousPage.Should().BeFalse();
    }

    [Theory]
    [InlineData("", false)]
    [InlineData("a", false)]
    [InlineData("ab", true)]
    [InlineData("pho bo", true)]
    public void SearchRecipesQueryValidator_ShouldValidateSearchTerm(string searchTerm, bool expectedIsValid)
    {
        // Arrange
        var validator = new SearchRecipesQueryValidator();
        var query = new SearchRecipesQuery(searchTerm);

        // Act
        var result = validator.Validate(query);

        // Assert
        result.IsValid.Should().Be(expectedIsValid);
    }
}
