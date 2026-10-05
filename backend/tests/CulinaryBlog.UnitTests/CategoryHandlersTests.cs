using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;
using CulinaryBlog.Application.Features.Categories.Commands.DeleteCategory;
using CulinaryBlog.Application.Features.Categories.Commands.UpdateCategory;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Application.Features.Categories.Mappings;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategories;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace CulinaryBlog.UnitTests;

public class CategoryHandlersTests
{
    private readonly Mock<ICategoryRepository> _categoryRepoMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();

    public CategoryHandlersTests()
    {
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        CategoryMappingConfig.RegisterMappings();
    }

    #region FR-CAT-001: GetCategoriesQuery Tests

    [Fact]
    public async Task GetCategories_ShouldReturnMappedDtosWithRecipeCount()
    {
        // Arrange
        var cat1 = new Category { Name = "Món chính", Slug = "mon-chinh", OrderIndex = 1, RowVersion = [1, 2] };
        var cat2 = new Category { Name = "Món tráng miệng", Slug = "mon-trang-mieng", OrderIndex = 2, RowVersion = [3, 4] };

        _categoryRepoMock.Setup(r => r.GetAllWithRecipeCountAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<(Category, int)>
            {
                (cat1, 5),
                (cat2, 10)
            });

        var handler = new GetCategoriesQueryHandler(_categoryRepoMock.Object);

        // Act
        var result = await handler.Handle(new GetCategoriesQuery(), CancellationToken.None);

        // Assert
        result.Should().HaveCount(2);
        result[0].Name.Should().Be("Món chính");
        result[0].RecipeCount.Should().Be(5);
        result[1].Name.Should().Be("Món tráng miệng");
        result[1].RecipeCount.Should().Be(10);
    }

    [Fact]
    public async Task GetCategories_WhenCacheHit_ShouldReturnCachedDataWithoutCallingRepository()
    {
        // Arrange: Cache Redis đã có dữ liệu sẵn
        var cacheMock = new Mock<ICacheService>();
        var cachedList = new List<CategoryDto>
        {
            new(Guid.NewGuid(), "Món đệm cache", "mon-dem-cache", "Mô tả", "img.jpg", 1, 3)
        };

        cacheMock.Setup(c => c.GetAsync<List<CategoryDto>>("categories:all", It.IsAny<CancellationToken>()))
            .ReturnsAsync(cachedList);

        var handler = new GetCategoriesQueryHandler(_categoryRepoMock.Object, cacheMock.Object);

        // Act
        var result = await handler.Handle(new GetCategoriesQuery(), CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(cachedList);
        _categoryRepoMock.Verify(r => r.GetAllWithRecipeCountAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetCategories_WhenCacheMiss_ShouldQueryRepositoryAndSetCacheWith60MinutesTtl()
    {
        // Arrange: Cache trống (Cache Miss) -> truy vấn repository và set cache TTL 60m
        var cacheMock = new Mock<ICacheService>();
        cacheMock.Setup(c => c.GetAsync<List<CategoryDto>>("categories:all", It.IsAny<CancellationToken>()))
            .ReturnsAsync((List<CategoryDto>?)null);

        var cat = new Category { Name = "Món kho", Slug = "mon-kho", OrderIndex = 1, RowVersion = [1] };
        _categoryRepoMock.Setup(r => r.GetAllWithRecipeCountAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<(Category, int)> { (cat, 4) });

        var handler = new GetCategoriesQueryHandler(_categoryRepoMock.Object, cacheMock.Object);

        // Act
        var result = await handler.Handle(new GetCategoriesQuery(), CancellationToken.None);

        // Assert
        result.Should().HaveCount(1);
        result[0].Name.Should().Be("Món kho");
        result[0].RecipeCount.Should().Be(4);

        cacheMock.Verify(c => c.SetAsync(
            "categories:all",
            It.Is<List<CategoryDto>>(list => list.Count == 1 && list[0].Name == "Món kho"),
            TimeSpan.FromMinutes(60),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion

    #region FR-CAT-002: GetCategoryBySlugQuery Tests

    [Fact]
    public async Task GetCategoryBySlug_WhenExists_ShouldReturnDetailDto()
    {
        // Arrange
        var cat = new Category { Name = "Món hấp", Slug = "mon-hap", Description = "Mô tả", RowVersion = [1] };
        var recipes = new List<Recipe>
        {
            Recipe.Create("Gà hấp lá chanh", "ga-hap-la-chanh", "Ngon tuyệt", "Hướng dẫn hấp", 10, 15, 2, RecipeDifficulty.Easy, Guid.NewGuid(), Guid.NewGuid().ToString())
        };

        _categoryRepoMock.Setup(r => r.GetBySlugWithRecipesAsync("mon-hap", 1, 12, It.IsAny<CancellationToken>()))
            .ReturnsAsync((cat, recipes, 1));

        var handler = new GetCategoryBySlugQueryHandler(_categoryRepoMock.Object);

        // Act
        var result = await handler.Handle(new GetCategoryBySlugQuery("mon-hap"), CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Category.Name.Should().Be("Món hấp");
        result.Recipes.Items.Should().HaveCount(1);
        result.Recipes.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task GetCategoryBySlug_WhenNotFound_ShouldThrowNotFoundException()
    {
        // Arrange
        _categoryRepoMock.Setup(r => r.GetBySlugWithRecipesAsync("khong-ton-tai", 1, 12, It.IsAny<CancellationToken>()))
            .ReturnsAsync((null, new List<Recipe>(), 0));

        var handler = new GetCategoryBySlugQueryHandler(_categoryRepoMock.Object);

        // Act & Assert
        var act = () => handler.Handle(new GetCategoryBySlugQuery("khong-ton-tai"), CancellationToken.None);
        var ex = await act.Should().ThrowAsync<EntityNotFoundException>();
        ex.Which.ErrorCode.Should().Be("CATEGORY_NOT_FOUND");
    }

    [Fact]
    public async Task GetCategoryBySlug_RoleFiltering_Guest_ShouldOnlySeePublishedRecipes()
    {
        // Arrange: Khách vãng lai chỉ thấy bài viết Published
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        using var db = new CulinaryBlogDbContext(options);

        var author = new ApplicationUser { Id = "author-1", UserName = "author1", DisplayName = "Bếp Trưởng 1", Email = "author1@test.com" };
        db.Users.Add(author);

        var cat = new Category { Id = Guid.NewGuid(), Name = "Món Canh", Slug = "mon-canh" };
        db.Categories.Add(cat);

        var pubRecipe = Recipe.Create("Canh Chua", "canh-chua", "Mô tả", "Nấu canh", 10, 20, 4, RecipeDifficulty.Easy, cat.Id, author.Id);
        pubRecipe.AddStep("Sơ chế", "Mô tả");
        pubRecipe.Publish();

        var draftRecipe = Recipe.Create("Canh Bí", "canh-bi", "Mô tả", "Nấu canh", 10, 15, 2, RecipeDifficulty.Easy, cat.Id, author.Id);

        db.Recipes.AddRange(pubRecipe, draftRecipe);
        await db.SaveChangesAsync();

        var categoryRepo = new CategoryRepository(db);
        var recipeRepo = new RecipeRepository(db);
        var handler = new GetCategoryBySlugQueryHandler(categoryRepo, recipeRepo);

        // Act (Guest: userId null, isAdmin false)
        var result = await handler.Handle(new GetCategoryBySlugQuery("mon-canh", 1, 12, null, false), CancellationToken.None);

        // Assert
        result.Category.Name.Should().Be("Món Canh");
        result.Recipes.TotalCount.Should().Be(1);
        result.Recipes.Items.Should().ContainSingle(r => r.Title == "Canh Chua");
    }

    [Fact]
    public async Task GetCategoryBySlug_RoleFiltering_Author_ShouldSeePublishedAndOwnDraft()
    {
        // Arrange: Tác giả thấy bài Published chung và bài Draft của chính mình
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        using var db = new CulinaryBlogDbContext(options);

        var otherAuthor = new ApplicationUser { Id = "other-author", UserName = "other", DisplayName = "Người khác", Email = "other@test.com" };
        var myAuthor = new ApplicationUser { Id = "author-me", UserName = "me", DisplayName = "Tôi", Email = "me@test.com" };
        db.Users.AddRange(otherAuthor, myAuthor);

        var cat = new Category { Id = Guid.NewGuid(), Name = "Món Canh", Slug = "mon-canh" };
        db.Categories.Add(cat);

        var pubRecipe = Recipe.Create("Canh Cua", "canh-cua", "Mô tả", "Nấu", 10, 20, 4, RecipeDifficulty.Easy, cat.Id, otherAuthor.Id);
        pubRecipe.AddStep("Sơ chế", "Mô tả");
        pubRecipe.Publish();

        var myDraft = Recipe.Create("Canh Của Tôi", "canh-cua-toi", "Mô tả", "Nấu", 10, 15, 2, RecipeDifficulty.Easy, cat.Id, myAuthor.Id);
        var otherDraft = Recipe.Create("Canh Người Khác", "canh-nguoi-khac", "Mô tả", "Nấu", 10, 15, 2, RecipeDifficulty.Easy, cat.Id, otherAuthor.Id);

        db.Recipes.AddRange(pubRecipe, myDraft, otherDraft);
        await db.SaveChangesAsync();

        var categoryRepo = new CategoryRepository(db);
        var recipeRepo = new RecipeRepository(db);
        var handler = new GetCategoryBySlugQueryHandler(categoryRepo, recipeRepo);

        // Act (Author: userId "author-me", isAdmin false)
        var result = await handler.Handle(new GetCategoryBySlugQuery("mon-canh", 1, 12, "author-me", false), CancellationToken.None);

        // Assert
        result.Recipes.TotalCount.Should().Be(2);
        result.Recipes.Items.Select(r => r.Title).Should().Contain(["Canh Cua", "Canh Của Tôi"]);
        result.Recipes.Items.Select(r => r.Title).Should().NotContain("Canh Người Khác");
    }

    [Fact]
    public async Task GetCategoryBySlug_RoleFiltering_Admin_ShouldSeeAllRecipes()
    {
        // Arrange: Quản trị viên (Admin) thấy tất cả bài viết trong danh mục
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        using var db = new CulinaryBlogDbContext(options);

        var author1 = new ApplicationUser { Id = "author-1", UserName = "author1", DisplayName = "Tác giả 1", Email = "a1@test.com" };
        var author2 = new ApplicationUser { Id = "author-2", UserName = "author2", DisplayName = "Tác giả 2", Email = "a2@test.com" };
        db.Users.AddRange(author1, author2);

        var cat = new Category { Id = Guid.NewGuid(), Name = "Món Nướng", Slug = "mon-nuong" };
        db.Categories.Add(cat);

        var pubRecipe = Recipe.Create("Bò Nướng", "bo-nuong", "Mô tả", "Nướng", 10, 20, 4, RecipeDifficulty.Easy, cat.Id, author1.Id);
        pubRecipe.AddStep("Sơ chế", "Mô tả");
        pubRecipe.Publish();

        var draft1 = Recipe.Create("Gà Nướng", "ga-nuong", "Mô tả", "Nướng", 10, 15, 2, RecipeDifficulty.Easy, cat.Id, author1.Id);
        var draft2 = Recipe.Create("Heo Nướng", "heo-nuong", "Mô tả", "Nướng", 10, 15, 2, RecipeDifficulty.Easy, cat.Id, author2.Id);

        db.Recipes.AddRange(pubRecipe, draft1, draft2);
        await db.SaveChangesAsync();

        var categoryRepo = new CategoryRepository(db);
        var recipeRepo = new RecipeRepository(db);
        var handler = new GetCategoryBySlugQueryHandler(categoryRepo, recipeRepo);

        // Act (Admin: isAdmin true)
        var result = await handler.Handle(new GetCategoryBySlugQuery("mon-nuong", 1, 12, "admin-id", true), CancellationToken.None);

        // Assert
        result.Recipes.TotalCount.Should().Be(3);
    }

    #endregion

    #region Category CRUD Commands Tests

    [Fact]
    public async Task CreateCategory_WhenNameUnique_ShouldCreateAndReturnDto()
    {
        // Arrange
        _categoryRepoMock.Setup(r => r.ExistsByNameAsync("Món xào", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _categoryRepoMock.Setup(r => r.ExistsBySlugAsync("mon-xao", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var handler = new CreateCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);
        var command = new CreateCategoryCommand("Món xào", "Mô tả", "https://example.com/xao.jpg", 1);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Món xào");
        result.Slug.Should().Be("mon-xao");
        _categoryRepoMock.Verify(r => r.AddAsync(It.Is<Category>(c => c.Name == "Món xào" && c.Slug == "mon-xao"), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateCategory_WhenNameExists_ShouldThrowConflictException()
    {
        // Arrange
        _categoryRepoMock.Setup(r => r.ExistsByNameAsync("Món xào", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var handler = new CreateCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);
        var command = new CreateCategoryCommand("Món xào", null, null, 1);

        // Act & Assert
        var act = () => handler.Handle(command, CancellationToken.None);
        var ex = await act.Should().ThrowAsync<ConflictException>();
        ex.Which.ErrorCode.Should().Be("CATEGORY_NAME_EXISTS");
    }

    [Fact]
    public async Task UpdateCategory_WhenValid_ShouldPreserveOriginalSlugAndChangeFields()
    {
        // Arrange
        var catId = Guid.NewGuid();
        var rowVersion = new byte[] { 1, 2, 3, 4 };
        var category = new Category
        {
            Id = catId,
            Name = "Tên cũ",
            Slug = "ten-cu-giu-nguyen",
            Description = "Mô tả cũ",
            OrderIndex = 1,
            RowVersion = rowVersion
        };

        _categoryRepoMock.Setup(r => r.GetByIdAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        _categoryRepoMock.Setup(r => r.ExistsByNameAsync("Tên mới", catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _categoryRepoMock.Setup(r => r.GetActiveRecipeCountAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(3);

        var handler = new UpdateCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);
        var command = new UpdateCategoryCommand(catId, "Tên mới", "Mô tả mới", "https://example.com/img.jpg", 5, rowVersion);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Name.Should().Be("Tên mới");
        result.Slug.Should().Be("ten-cu-giu-nguyen"); // Bảo toàn slug FR-CAT-004
        result.OrderIndex.Should().Be(5);
        _categoryRepoMock.Verify(r => r.Update(category), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateCategory_WhenRowVersionMismatched_ShouldThrowConcurrencyConflict()
    {
        // Arrange
        var catId = Guid.NewGuid();
        var category = new Category
        {
            Id = catId,
            Name = "Tên cũ",
            RowVersion = [1, 2, 3, 4]
        };

        _categoryRepoMock.Setup(r => r.GetByIdAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new UpdateCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);
        var command = new UpdateCategoryCommand(catId, "Tên mới", null, null, 1, [9, 9, 9, 9]);

        // Act & Assert
        var act = () => handler.Handle(command, CancellationToken.None);
        var ex = await act.Should().ThrowAsync<ConcurrencyConflictException>();
        ex.Which.ErrorCode.Should().Be("CATEGORY_CONCURRENCY_CONFLICT");
    }

    [Fact]
    public async Task DeleteCategory_WhenCategoryHasActiveRecipes_ShouldThrowConflictException()
    {
        // Arrange
        var catId = Guid.NewGuid();
        var category = new Category { Id = catId, Name = "Món nướng" };

        _categoryRepoMock.Setup(r => r.GetByIdAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        _categoryRepoMock.Setup(r => r.HasActiveRecipesAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _categoryRepoMock.Setup(r => r.GetActiveRecipeCountAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(4); // Có 4 công thức đang hoạt động

        var handler = new DeleteCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);

        // Act & Assert
        var act = () => handler.Handle(new DeleteCategoryCommand(catId), CancellationToken.None);
        var ex = await act.Should().ThrowAsync<CategoryNotEmptyException>();
        ex.Which.ErrorCode.Should().Be("CATEGORY_DELETE_HAS_RECIPES");
        _categoryRepoMock.Verify(r => r.SoftDelete(It.IsAny<Category>()), Times.Never);
    }

    [Fact]
    public async Task DeleteCategory_WhenCategoryHasNoRecipes_ShouldSoftDelete()
    {
        // Arrange
        var catId = Guid.NewGuid();
        var category = new Category { Id = catId, Name = "Danh mục trống", IsDeleted = false };

        _categoryRepoMock.Setup(r => r.GetByIdAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        _categoryRepoMock.Setup(r => r.HasActiveRecipesAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _categoryRepoMock.Setup(r => r.GetActiveRecipeCountAsync(catId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0);

        var handler = new DeleteCategoryCommandHandler(_categoryRepoMock.Object, _unitOfWorkMock.Object);

        // Act
        await handler.Handle(new DeleteCategoryCommand(catId), CancellationToken.None);

        // Assert
        category.IsDeleted.Should().BeTrue();
        category.UpdatedAt.Should().NotBeNull();
        _categoryRepoMock.Verify(r => r.SoftDelete(category), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion
}
