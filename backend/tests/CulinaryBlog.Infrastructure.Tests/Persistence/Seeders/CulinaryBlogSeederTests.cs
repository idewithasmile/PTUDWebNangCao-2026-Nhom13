using Bogus;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Data.Interceptors;
using CulinaryBlog.Infrastructure.Persistence.Seeders;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace CulinaryBlog.Infrastructure.Tests.Persistence.Seeders;

/// <summary>
/// Bộ kiểm thử tự động toàn diện cho CulinaryBlogSeeder theo chuẩn xUnit, FluentAssertions và EF Core InMemory / Mocking.
/// Tuân thủ các nguyên tắc thiết kế và mô hình dữ liệu trong CLAUDE.md và DATA_MODEL.md.
/// </summary>
public class CulinaryBlogSeederTests
{
    private const int SEED = 42;

    private static readonly string[] StandardCategoryNames =
    [
        "Món khai vị", "Món chính", "Món canh", "Món kho", "Món xào",
        "Món nướng", "Món chiên rán", "Món hấp", "Món luộc", "Món gỏi - nộm",
        "Món lẩu", "Món chay", "Món ăn vặt", "Đồ uống", "Tráng miệng",
        "Bánh ngọt", "Mì - Bún - Phở", "Cơm & Cháo", "Hải sản", "Gia cầm",
        "Thịt bò", "Thịt heo", "Ẩm thực miền Bắc", "Ẩm thực miền Trung", "Ẩm thực miền Nam"
    ];

    #region Test Service Provider Helper

    /// <summary>
    /// Khởi tạo DI container độc lập cho mỗi bài kiểm thử với In-Memory Database riêng biệt.
    /// Đảm bảo tính độc lập (Isolation) và hỗ trợ chạy song song không bị xung đột dữ liệu.
    /// </summary>
    private static IServiceProvider CreateServiceProvider(
        string? dbName = null,
        Action<IServiceCollection>? configureServices = null)
    {
        var services = new ServiceCollection();

        services.AddLogging();
        services.AddSingleton<AuditInterceptor>();

        var databaseName = dbName ?? Guid.NewGuid().ToString();
        services.AddDbContext<CulinaryBlogDbContext>((sp, options) =>
        {
            options.UseInMemoryDatabase(databaseName);
            options.ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));
            options.AddInterceptors(sp.GetRequiredService<AuditInterceptor>());
        });

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireLowercase = false;
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<CulinaryBlogDbContext>();

        configureServices?.Invoke(services);

        return services.BuildServiceProvider();
    }

    #endregion

    #region 1. Kiểm thử Tạo Vai trò (Roles Initialization)

    [Fact]
    public async Task RolesInitialization_CleanDatabase_ShouldCreateAllThreeRequiredRoles()
    {
        // Arrange: Chuẩn bị cơ sở dữ liệu sạch
        var sp = CreateServiceProvider();

        // Act: Thực thi Seeder
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Xác thực đầy đủ 3 roles chuẩn: "Admin", "Author", "Reader"
        using var scope = sp.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var rolesInDb = await db.Roles.AsNoTracking().ToListAsync();
        rolesInDb.Should().HaveCount(3);

        (await roleManager.RoleExistsAsync("Admin")).Should().BeTrue();
        (await roleManager.RoleExistsAsync("Author")).Should().BeTrue();
        (await roleManager.RoleExistsAsync("Reader")).Should().BeTrue();

        rolesInDb.Select(r => r.Name)
            .Should().BeEquivalentTo(["Admin", "Author", "Reader"]);
    }

    [Fact]
    public async Task RolesInitialization_WhenSomeRolesAlreadyExist_ShouldBeIdempotentAndNotDuplicate()
    {
        // Arrange: Khởi tạo trước vai trò "Admin" trong hệ thống
        var sp = CreateServiceProvider();
        using (var initScope = sp.CreateScope())
        {
            var roleManager = initScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // Act: Thực thi Seeder
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Đảm bảo không tạo trùng vai trò "Admin", các vai trò còn lại được bổ sung đầy đủ
        using var verifyScope = sp.CreateScope();
        var roleManagerVerify = verifyScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var db = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var rolesInDb = await db.Roles.AsNoTracking().ToListAsync();
        rolesInDb.Should().HaveCount(3);
        rolesInDb.Count(r => r.Name == "Admin").Should().Be(1);

        (await roleManagerVerify.RoleExistsAsync("Admin")).Should().BeTrue();
        (await roleManagerVerify.RoleExistsAsync("Author")).Should().BeTrue();
        (await roleManagerVerify.RoleExistsAsync("Reader")).Should().BeTrue();
    }

    [Fact]
    public async Task RolesInitialization_RunMultipleTimes_ShouldRemainExactlyThreeRoles()
    {
        // Arrange: Chuẩn bị môi trường
        var sp = CreateServiceProvider();

        // Act: Chạy Seeder 2 lần liên tiếp
        await CulinaryBlogSeeder.SeedAsync(sp);
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Số lượng vai trò không bị gia tăng
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var roleCount = await db.Roles.CountAsync();
        roleCount.Should().Be(3);
    }

    [Fact]
    public async Task RolesInitialization_MockRoleManager_WhenRoleExists_ShouldNeverCallCreateAsync()
    {
        // Arrange: Thiết lập Mock RoleStore & RoleManager để kiểm chứng hành vi gọi hàm
        var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
        var roleManagerMock = new Mock<RoleManager<IdentityRole>>(
            roleStoreMock.Object, null!, null!, null!, null!);

        // Giả lập cả 3 vai trò đã tồn tại sẵn
        roleManagerMock.Setup(r => r.RoleExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(true);

        var sp = CreateServiceProvider(configureServices: services =>
        {
            services.AddScoped(_ => roleManagerMock.Object);
        });

        // Tạo sẵn 100 recipes để cô lập kiểm thử logic Roles và kích hoạt return early
        using (var setupScope = sp.CreateScope())
        {
            var db = setupScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            var dummyRecipes = Enumerable.Range(1, 100).Select(i => new Recipe
            {
                Title = $"Pre-existing Recipe {i}",
                Slug = $"pre-existing-recipe-{i}",
                Description = "Mô tả",
                Instructions = "Hướng dẫn",
                RowVersion = new byte[8]
            });
            await db.Recipes.AddRangeAsync(dummyRecipes);
            await db.SaveChangesAsync();
        }

        // Act: Thực thi Seeder
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Verify RoleManager.CreateAsync không được gọi bất kỳ lần nào khi role đã tồn tại
        roleManagerMock.Verify(r => r.CreateAsync(It.IsAny<IdentityRole>()), Times.Never);
    }

    #endregion

    #region 2. Kiểm thử Tác giả mẫu (Authors Seeding)

    [Fact]
    public async Task AuthorsSeeding_CleanDatabase_ShouldGenerateExactlyTenAuthorsWithValidFields()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Đúng 10 tác giả được sinh ra và các trường thông tin cơ bản hợp lệ
        using var scope = sp.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var authors = await userManager.Users.AsNoTracking().ToListAsync();

        authors.Should().HaveCount(10);
        foreach (var author in authors)
        {
            author.Id.Should().NotBeNullOrWhiteSpace();
            author.DisplayName.Should().NotBeNullOrWhiteSpace();
            author.UserName.Should().NotBeNullOrWhiteSpace();
            author.Email.Should().NotBeNullOrWhiteSpace().And.Contain("@");
            author.AvatarUrl.Should().NotBeNullOrWhiteSpace();
            author.EmailConfirmed.Should().BeTrue();
            author.IsActive.Should().BeTrue();
        }
    }

    [Fact]
    public async Task AuthorsSeeding_AllCreatedAuthors_ShouldBeAssignedAuthorRoleAndValidDefaultPassword()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Mọi user đều được gán role "Author", EmailConfirmed = true, và mật khẩu "Author@123456" hợp lệ
        using var scope = sp.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var authors = await userManager.Users.ToListAsync();

        authors.Should().HaveCount(10);
        foreach (var author in authors)
        {
            var isAuthor = await userManager.IsInRoleAsync(author, "Author");
            isAuthor.Should().BeTrue($"Author {author.Email} must have 'Author' role assigned.");

            var passwordValid = await userManager.CheckPasswordAsync(author, "Author@123456");
            passwordValid.Should().BeTrue($"Author {author.Email} must be authenticateable with default password 'Author@123456'.");
        }
    }

    [Fact]
    public async Task AuthorsSeeding_WhenAuthorEmailAlreadyExists_ShouldReuseExistingIdWithoutThrowingDuplicateError()
    {
        // Arrange: Sinh trước tác giả đầu tiên theo đúng seed 42 để biết email sẽ được Faker sinh ra
        var authorFaker = new Faker<ApplicationUser>("vi")
            .RuleFor(u => u.Id, f => Guid.NewGuid().ToString())
            .RuleFor(u => u.DisplayName, f => f.Name.FullName())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.EmailConfirmed, f => true)
            .RuleFor(u => u.AvatarUrl, f => f.Internet.Avatar());

        var expectedFirstAuthor = authorFaker.UseSeed(SEED).Generate(1).First();

        var sp = CreateServiceProvider();
        const string customPreExistingId = "pre-existing-author-id-99999";

        using (var setupScope = sp.CreateScope())
        {
            var roleManager = setupScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await roleManager.CreateAsync(new IdentityRole("Author"));

            var userManager = setupScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var preExistingUser = new ApplicationUser
            {
                Id = customPreExistingId,
                UserName = expectedFirstAuthor.UserName,
                Email = expectedFirstAuthor.Email,
                DisplayName = "Tác giả tiền định",
                EmailConfirmed = true,
                AvatarUrl = "https://example.com/avatar.jpg"
            };

            var createRes = await userManager.CreateAsync(preExistingUser, "Author@123456");
            createRes.Succeeded.Should().BeTrue();
            await userManager.AddToRoleAsync(preExistingUser, "Author");
        }

        // Act: Chạy Seeder trên DB đã có sẵn tác giả mang email này
        var act = async () => await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Không ném lỗi duplicate và tái sử dụng Id hiện có cho Recipe
        await act.Should().NotThrowAsync();

        using var verifyScope = sp.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var totalUsers = await verifyDb.Users.CountAsync();
        totalUsers.Should().Be(10, "1 user đã tồn tại trước đó + 9 user mới được sinh ra");

        // Kiểm tra xem Recipe có sử dụng customPreExistingId hay không
        var recipesReferencingPreExisting = await verifyDb.Recipes
            .Where(r => r.AuthorId == customPreExistingId)
            .ToListAsync();

        recipesReferencingPreExisting.Should().NotBeEmpty(
            "Seeder phải tái sử dụng Id của tác giả hiện có thay vì throw lỗi hoặc bỏ qua.");
    }

    [Fact]
    public async Task AuthorsSeeding_RunMultipleTimes_ShouldNotDuplicateUsers()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act: Chạy Seeder 2 lần
        await CulinaryBlogSeeder.SeedAsync(sp);
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Tổng số lượng users vẫn là 10
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        (await db.Users.CountAsync()).Should().Be(10);
    }

    #endregion

    #region 3. Kiểm thử Danh mục (Categories Seeding)

    [Fact]
    public async Task CategoriesSeeding_CleanDatabase_ShouldSeedAtLeastTwentyCategories()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Hệ thống nạp đủ ít nhất 20 danh mục
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var categories = await db.Categories.AsNoTracking().ToListAsync();

        categories.Count.Should().BeGreaterThanOrEqualTo(20);
        categories.Count.Should().Be(20, "Logic Seeder ngắt tại ngưỡng 20 categories.");

        // Tất cả các tên danh mục phải nằm trong CategoryNames mẫu
        categories.Select(c => c.Name).Should().BeSubsetOf(StandardCategoryNames);
    }

    [Fact]
    public async Task CategoriesSeeding_CategoryFields_ShouldMeetDataModelConstraints()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Kiểm tra từng trường của Category theo DATA_MODEL.md
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var categories = await db.Categories.AsNoTracking().ToListAsync();

        categories.Should().HaveCount(20);

        // 1. Name: Không rỗng, không trùng lặp
        categories.Should().OnlyContain(c => !string.IsNullOrWhiteSpace(c.Name));
        categories.Select(c => c.Name).Should().OnlyHaveUniqueItems();

        // 2. Slug: Chuẩn SEO, lowercase, không dấu cách, không trùng lặp
        categories.Should().OnlyContain(c => !string.IsNullOrWhiteSpace(c.Slug));
        categories.Should().OnlyContain(c => c.Slug == c.Slug.ToLowerInvariant(), "Slug phải ở dạng chữ thường");
        categories.Should().OnlyContain(c => !c.Slug.Contains(' '), "Slug chuẩn SEO không được chứa khoảng trắng");
        categories.Select(c => c.Slug).Should().OnlyHaveUniqueItems();

        // 3. OrderIndex: Đánh số tăng dần từ 1 đến 20
        var orderedIndices = categories.OrderBy(c => c.OrderIndex).Select(c => c.OrderIndex).ToList();
        orderedIndices.Should().Equal(Enumerable.Range(1, 20));

        // 4. RowVersion: Khởi tạo hợp lệ (8 byte)
        categories.Should().OnlyContain(c => c.RowVersion != null && c.RowVersion.Length == 8);

        // 5. Description: Đúng định dạng
        categories.Should().OnlyContain(c => c.Description != null && c.Description.StartsWith("Các món ăn thuộc danh mục "));
    }

    [Fact]
    public async Task CategoriesSeeding_AlreadyHasTwentyCategories_ShouldBeIdempotentAndNotAddMore()
    {
        // Arrange: Chạy lần đầu để sinh 20 categories
        var sp = CreateServiceProvider();
        await CulinaryBlogSeeder.SeedAsync(sp);

        List<Guid> initialCategoryIds;
        using (var scope = sp.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            initialCategoryIds = await db.Categories.Select(c => c.Id).ToListAsync();
        }
        initialCategoryIds.Should().HaveCount(20);

        // Act: Chạy Seeder lần thứ 2
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Không tạo thêm Category nào, danh sách ID giữ nguyên 100%
        using (var verifyScope = sp.CreateScope())
        {
            var verifyDb = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            var currentCategoryIds = await verifyDb.Categories.Select(c => c.Id).ToListAsync();

            currentCategoryIds.Should().HaveCount(20);
            currentCategoryIds.Should().BeEquivalentTo(initialCategoryIds);
        }
    }

    [Fact]
    public async Task CategoriesSeeding_WhenPartialCategoriesExist_ShouldSupplementMissingCategoriesUntilTwentyWithoutDuplicates()
    {
        // Arrange: Tạo trước 5 categories (3 categories trùng tên trong danh sách chuẩn, 2 danh mục đặc biệt)
        var sp = CreateServiceProvider();
        using (var initScope = sp.CreateScope())
        {
            var db = initScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            db.Categories.AddRange([
                new Category { Name = "Món khai vị", Slug = "mon-khai-vi-pre", OrderIndex = 1, RowVersion = new byte[8] },
                new Category { Name = "Món chính", Slug = "mon-chinh-pre", OrderIndex = 2, RowVersion = new byte[8] },
                new Category { Name = "Món canh", Slug = "mon-canh-pre", OrderIndex = 3, RowVersion = new byte[8] },
                new Category { Name = "Món đặc sản Tây Bắc", Slug = "mon-dac-san-tay-bac", OrderIndex = 4, RowVersion = new byte[8] },
                new Category { Name = "Món nhậu bình dân", Slug = "mon-nhau-binh-dan", OrderIndex = 5, RowVersion = new byte[8] }
            ]);
            await db.SaveChangesAsync();
        }

        // Act: Chạy Seeder
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Tổng số categories đạt đúng 20, không có category nào trùng tên
        using var verifyScope = sp.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var categories = await verifyDb.Categories.AsNoTracking().ToListAsync();

        categories.Should().HaveCount(20);
        categories.Select(c => c.Name).Should().OnlyHaveUniqueItems();

        // 3 categories ban đầu vẫn được giữ nguyên
        categories.Should().Contain(c => c.Name == "Món khai vị" && c.Slug == "mon-khai-vi-pre");
        categories.Should().Contain(c => c.Name == "Món chính" && c.Slug == "mon-chinh-pre");
        categories.Should().Contain(c => c.Name == "Món canh" && c.Slug == "mon-canh-pre");
    }

    #endregion

    #region 4. Kiểm thử Công thức nấu ăn (Recipes Seeding)

    [Fact]
    public async Task RecipesSeeding_CleanDatabase_ShouldGenerateExactlyOneHundredRecipes()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Cơ sở dữ liệu có chính xác 100 công thức nấu ăn
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var recipeCount = await db.Recipes.CountAsync();
        recipeCount.Should().Be(100);
    }

    [Fact]
    public async Task RecipesSeeding_EachRecipe_ShouldHaveValidPropertiesAndForeignKeys()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Xác thực từng Recipe theo quy chuẩn DATA_MODEL.md
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var validCategoryIds = (await db.Categories.Select(c => c.Id).ToListAsync()).ToHashSet();
        var validAuthorIds = (await db.Users.Select(u => u.Id).ToListAsync()).ToHashSet();
        var recipes = await db.Recipes.AsNoTracking().ToListAsync();

        recipes.Should().HaveCount(100);

        foreach (var recipe in recipes)
        {
            // Trạng thái mặc định là Published
            recipe.Status.Should().Be(RecipeStatus.Published);

            // Khóa ngoại CategoryId và AuthorId hợp lệ
            validCategoryIds.Should().Contain(recipe.CategoryId,
                $"Recipe '{recipe.Title}' phải liên kết với một CategoryId hợp lệ.");
            validAuthorIds.Should().Contain(recipe.AuthorId,
                $"Recipe '{recipe.Title}' phải liên kết với một AuthorId hợp lệ.");

            // Ràng buộc thời gian và khẩu phần
            recipe.PrepTime.Should().BeGreaterThan(0, "PrepTime phải > 0");
            recipe.PrepTime.Should().BeInRange(15, 60);

            recipe.CookTime.Should().BeGreaterThanOrEqualTo(0, "CookTime phải >= 0");
            recipe.CookTime.Should().BeInRange(20, 180);

            recipe.Servings.Should().BeGreaterThan(0, "Servings phải > 0");
            recipe.Servings.Should().BeInRange(2, 8);

            // Title và Slug không được để trống
            recipe.Title.Should().NotBeNullOrWhiteSpace();
            recipe.Slug.Should().NotBeNullOrWhiteSpace();
            recipe.Description.Should().NotBeNullOrWhiteSpace();
            recipe.Instructions.Should().NotBeNullOrWhiteSpace();

            // RowVersion byte[8]
            recipe.RowVersion.Should().NotBeNull();
            recipe.RowVersion.Length.Should().Be(8);
        }
    }

    [Fact]
    public async Task RecipesSeeding_WhenAlreadyHasOneHundredRecipes_ShouldReturnEarlyImmediately()
    {
        // Arrange: Chạy SeedAsync lần 1 để đạt 100 recipes
        var sp = CreateServiceProvider();
        await CulinaryBlogSeeder.SeedAsync(sp);

        int initialRecipeCount, initialStepCount, initialIngrCount;
        using (var scope = sp.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            initialRecipeCount = await db.Recipes.CountAsync();
            initialStepCount = await db.RecipeSteps.CountAsync();
            initialIngrCount = await db.RecipeIngredients.CountAsync();
        }

        initialRecipeCount.Should().Be(100);

        // Act: Chạy SeedAsync lần 2
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Seeder phải return early, không được tạo thêm bất kỳ Recipe, Step hay Ingredient nào
        using (var verifyScope = sp.CreateScope())
        {
            var verifyDb = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

            (await verifyDb.Recipes.CountAsync()).Should().Be(initialRecipeCount);
            (await verifyDb.RecipeSteps.CountAsync()).Should().Be(initialStepCount);
            (await verifyDb.RecipeIngredients.CountAsync()).Should().Be(initialIngrCount);
        }
    }

    [Fact]
    public async Task RecipesSeeding_WhenDatabaseHasPreExistingRecipesLessThanOneHundred_ShouldSeedOnlyRemaining()
    {
        // Arrange: Chuẩn bị 1 Category, 1 User và 35 dummy Recipes trước
        var sp = CreateServiceProvider();
        const int preExistingCount = 35;

        using (var initScope = sp.CreateScope())
        {
            var db = initScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
            var userManager = initScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = initScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await roleManager.CreateAsync(new IdentityRole("Author"));

            var author = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "initial_author",
                Email = "initial@example.com",
                DisplayName = "Initial Author",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(author, "Author@123456");

            var category = new Category
            {
                Name = "Món đặc sản",
                Slug = "mon-dac-san",
                OrderIndex = 1,
                RowVersion = new byte[8]
            };
            db.Categories.Add(category);
            await db.SaveChangesAsync();

            var dummyRecipes = Enumerable.Range(1, preExistingCount).Select(i => new Recipe
            {
                Title = $"Dummy Recipe {i}",
                Slug = $"dummy-recipe-{i}",
                Description = "Mô tả công thức mẫu",
                Instructions = "Hướng dẫn thực hiện mẫu",
                CategoryId = category.Id,
                AuthorId = author.Id,
                PrepTime = 20,
                CookTime = 30,
                Servings = 4,
                Status = RecipeStatus.Published,
                RowVersion = new byte[8]
            }).ToList();

            await db.Recipes.AddRangeAsync(dummyRecipes);
            await db.SaveChangesAsync();
        }

        // Act: Chạy Seeder
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Tổng số recipes sau khi nạp bổ sung phải đạt chính xác 100
        using var verifyScope = sp.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var totalRecipes = await verifyDb.Recipes.CountAsync();
        totalRecipes.Should().Be(100, $"Hệ thống cần bổ sung đúng {100 - preExistingCount} công thức để đủ 100.");
    }

    #endregion

    #region 5. Kiểm thử Thực thể con (Steps & Ingredients Integrity)

    [Fact]
    public async Task RecipeSteps_Integrity_ShouldHaveBetweenFiveAndEightStepsWithSequentialNumbersAndValidContent()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Kiểm tra tính toàn vẹn của RecipeSteps trong tất cả 100 Recipes
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var recipesWithSteps = await db.Recipes
            .AsNoTracking()
            .Include(r => r.Steps)
            .ToListAsync();

        recipesWithSteps.Should().HaveCount(100);

        foreach (var recipe in recipesWithSteps)
        {
            var steps = recipe.Steps.OrderBy(s => s.StepNumber).ToList();

            // Số lượng bước từ 5 đến 8
            steps.Count.Should().BeInRange(5, 8,
                $"Recipe '{recipe.Title}' phải có từ 5 đến 8 bước chế biến.");

            // StepNumber được đánh số liên tục bắt đầu từ 1
            var expectedStepNumbers = Enumerable.Range(1, steps.Count).ToList();
            steps.Select(s => s.StepNumber).Should().Equal(expectedStepNumbers);

            // Title, Description không rỗng, RowVersion hợp lệ
            foreach (var step in steps)
            {
                step.Title.Should().NotBeNullOrWhiteSpace();
                step.Title.Should().StartWith($"Bước {step.StepNumber}:");
                step.Description.Should().NotBeNullOrWhiteSpace();
                step.TimerMinutes.Should().BeInRange(5, 35);
                step.RowVersion.Should().NotBeNull();
                step.RowVersion.Length.Should().Be(8);
            }
        }
    }

    [Fact]
    public async Task RecipeIngredients_Integrity_ShouldHaveTenToFifteenDistinctIngredientsWithPositiveQuantity()
    {
        // Arrange
        var sp = CreateServiceProvider();

        // Act
        await CulinaryBlogSeeder.SeedAsync(sp);

        // Assert: Kiểm tra tính toàn vẹn của RecipeIngredients trong tất cả 100 Recipes
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var recipesWithIngredients = await db.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .ToListAsync();

        recipesWithIngredients.Should().HaveCount(100);

        var validUnits = new HashSet<string> { "gram", "ml", "thìa canh", "quả", "củ", "nhánh" };

        foreach (var recipe in recipesWithIngredients)
        {
            var ingredients = recipe.Ingredients.OrderBy(i => i.OrderIndex).ToList();

            // Số lượng nguyên liệu từ 10 đến 15
            ingredients.Count.Should().BeInRange(10, 15,
                $"Recipe '{recipe.Title}' phải có từ 10 đến 15 nguyên liệu.");

            // Không bị trùng lặp tên nguyên liệu trong cùng 1 Recipe (Distinct Name check)
            var distinctNames = ingredients.Select(i => i.Name).Distinct().ToList();
            distinctNames.Count.Should().Be(ingredients.Count,
                $"Recipe '{recipe.Title}' không được chứa các nguyên liệu trùng tên nhau.");

            // OrderIndex tăng dần từ 1
            var expectedOrderIndices = Enumerable.Range(1, ingredients.Count).ToList();
            ingredients.Select(i => i.OrderIndex).Should().Equal(expectedOrderIndices);

            // Quantity > 0, Name & Unit không rỗng, RowVersion hợp lệ
            foreach (var ingr in ingredients)
            {
                ingr.Name.Should().NotBeNullOrWhiteSpace();
                ingr.Quantity.Should().BeGreaterThan(0, "Quantity của nguyên liệu phải lớn hơn 0");
                ingr.Quantity.Should().BeInRange(5m, 500m);
                ingr.Unit.Should().NotBeNullOrWhiteSpace();
                validUnits.Should().Contain(ingr.Unit!);
                ingr.RowVersion.Should().NotBeNull();
                ingr.RowVersion.Length.Should().Be(8);
            }
        }
    }

    #endregion

    #region 6. Kiểm thử Tính lặp lại nhất quán (Seed Determinism)

    [Fact]
    public async Task SeedDeterminism_AcrossTwoIndependentCleanDatabases_ShouldProduceIdenticalOutputs()
    {
        // Arrange: Tạo 2 container DB hoàn toàn riêng biệt
        var sp1 = CreateServiceProvider();
        var sp2 = CreateServiceProvider();

        // Act: Thực thi Seeder trên cả 2 cơ sở dữ liệu với cùng SEED = 42
        await CulinaryBlogSeeder.SeedAsync(sp1);
        await CulinaryBlogSeeder.SeedAsync(sp2);

        // Assert: So sánh tính nhất quán 100% giữa 2 cơ sở dữ liệu
        using var scope1 = sp1.CreateScope();
        using var scope2 = sp2.CreateScope();

        var db1 = scope1.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var db2 = scope2.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        // 1. So sánh Categories
        var cat1 = await db1.Categories.OrderBy(c => c.OrderIndex).AsNoTracking().ToListAsync();
        var cat2 = await db2.Categories.OrderBy(c => c.OrderIndex).AsNoTracking().ToListAsync();

        cat1.Count.Should().Be(cat2.Count).And.Be(20);
        cat1.Select(c => c.Name).Should().Equal(cat2.Select(c => c.Name));
        cat1.Select(c => c.OrderIndex).Should().Equal(cat2.Select(c => c.OrderIndex));

        // 2. So sánh Authors
        var authors1 = await db1.Users.OrderBy(u => u.Email).AsNoTracking().ToListAsync();
        var authors2 = await db2.Users.OrderBy(u => u.Email).AsNoTracking().ToListAsync();

        authors1.Count.Should().Be(authors2.Count).And.Be(10);
        authors1.Select(a => a.Email).Should().Equal(authors2.Select(a => a.Email));
        authors1.Select(a => a.UserName).Should().Equal(authors2.Select(a => a.UserName));
        authors1.Select(a => a.DisplayName).Should().Equal(authors2.Select(a => a.DisplayName));

        // 3. So sánh Recipes
        var recipes1 = await db1.Recipes
            .OrderBy(r => r.Title)
            .ThenBy(r => r.Slug)
            .Include(r => r.Steps)
            .Include(r => r.Ingredients)
            .AsNoTracking()
            .ToListAsync();

        var recipes2 = await db2.Recipes
            .OrderBy(r => r.Title)
            .ThenBy(r => r.Slug)
            .Include(r => r.Steps)
            .Include(r => r.Ingredients)
            .AsNoTracking()
            .ToListAsync();

        recipes1.Count.Should().Be(recipes2.Count).And.Be(100);

        // Kiểm tra các thuộc tính chính của Recipes được sinh tất định từ Faker
        recipes1.Select(r => r.Title).Should().Equal(recipes2.Select(r => r.Title));
        recipes1.Select(r => r.Slug).Should().Equal(recipes2.Select(r => r.Slug));
        recipes1.Select(r => r.PrepTime).Should().Equal(recipes2.Select(r => r.PrepTime));
        recipes1.Select(r => r.CookTime).Should().Equal(recipes2.Select(r => r.CookTime));
        recipes1.Select(r => r.Servings).Should().Equal(recipes2.Select(r => r.Servings));
        recipes1.Select(r => r.Difficulty).Should().Equal(recipes2.Select(r => r.Difficulty));
        recipes1.Select(r => r.Status).Should().Equal(recipes2.Select(r => r.Status));

        // Kiểm tra số lượng Steps và Ingredients của mỗi Recipe tương ứng
        for (int i = 0; i < recipes1.Count; i++)
        {
            var r1 = recipes1[i];
            var r2 = recipes2[i];

            r1.Steps.Count.Should().Be(r2.Steps.Count,
                $"Recipe '{r1.Title}' phải có cùng số lượng steps qua các lần chạy deterministic.");
            r1.Ingredients.Count.Should().Be(r2.Ingredients.Count,
                $"Recipe '{r1.Title}' phải có cùng số lượng ingredients qua các lần chạy deterministic.");

            var r1Steps = r1.Steps.OrderBy(s => s.StepNumber).ToList();
            var r2Steps = r2.Steps.OrderBy(s => s.StepNumber).ToList();
            r1Steps.Select(s => s.Title).Should().Equal(r2Steps.Select(s => s.Title));
            r1Steps.Select(s => s.Description).Should().Equal(r2Steps.Select(s => s.Description));

            var r1Ingrs = r1.Ingredients.OrderBy(ing => ing.OrderIndex).ToList();
            var r2Ingrs = r2.Ingredients.OrderBy(ing => ing.OrderIndex).ToList();
            r1Ingrs.Select(ing => ing.Name).Should().Equal(r2Ingrs.Select(ing => ing.Name));
            r1Ingrs.Select(ing => ing.Quantity).Should().Equal(r2Ingrs.Select(ing => ing.Quantity));
            r1Ingrs.Select(ing => ing.Unit).Should().Equal(r2Ingrs.Select(ing => ing.Unit));
        }
    }

    #endregion
}
