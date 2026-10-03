using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CulinaryBlog.Infrastructure.Tests.Repositories;

/// <summary>
/// Bộ kiểm thử tích hợp InMemory cho BaseRepository, CategoryRepository và UnitOfWork.
/// Áp dụng cấu trúc chuẩn AAA (Arrange - Act - Assert) và môi trường CSDL độc lập.
/// </summary>
public class RepositoryTests
{
    private static CulinaryBlogDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(databaseName: $"RepoTestDb_{Guid.NewGuid()}")
            .Options;

        return new CulinaryBlogDbContext(options);
    }

    #region 1. Kiểm thử BaseRepository<T>

    [Fact]
    public async Task BaseRepository_AddAsync_ShouldInsertEntity()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new BaseRepository<Category>(db);
        var category = new Category
        {
            Name = "Món canh",
            Slug = "mon-canh",
            Description = "Các món canh dân dã",
            OrderIndex = 1
        };

        // Act
        var added = await repo.AddAsync(category);
        await db.SaveChangesAsync();

        // Assert
        added.Should().NotBeNull();
        added.Id.Should().NotBeEmpty();

        var retrieved = await repo.GetByIdAsync(category.Id);
        retrieved.Should().NotBeNull();
        retrieved!.Name.Should().Be("Món canh");
    }

    [Fact]
    public async Task BaseRepository_Update_ShouldModifyEntityAndSetUpdatedAt()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new BaseRepository<Category>(db);
        var category = new Category
        {
            Name = "Món xào cũ",
            Slug = "mon-xao-cu",
            OrderIndex = 1
        };
        await repo.AddAsync(category);
        await db.SaveChangesAsync();

        // Act
        category.Name = "Món xào mới";
        repo.Update(category);
        await db.SaveChangesAsync();

        // Assert
        var updated = await repo.GetByIdAsync(category.Id);
        updated.Should().NotBeNull();
        updated!.Name.Should().Be("Món xào mới");
        updated.UpdatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task BaseRepository_SoftDelete_ShouldExcludeFromGetByIdAndGetAll()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new BaseRepository<Category>(db);
        var category = new Category
        {
            Name = "Danh mục sắp xóa",
            Slug = "danh-muc-sap-xoa",
            OrderIndex = 2
        };
        await repo.AddAsync(category);
        await db.SaveChangesAsync();

        // Act: Thực hiện Soft Delete
        repo.SoftDelete(category);
        await db.SaveChangesAsync();

        // Assert: GetByIdAsync và GetAllAsync mặc định áp dụng filter !IsDeleted
        var retrievedById = await repo.GetByIdAsync(category.Id);
        retrievedById.Should().BeNull();

        var allCategories = await repo.GetAllAsync();
        allCategories.Should().NotContain(c => c.Id == category.Id);

        // Kiểm tra trực tiếp trong DB bản ghi vẫn tồn tại vật lý
        var physicalEntity = await db.Categories.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == category.Id);
        physicalEntity.Should().NotBeNull();
        physicalEntity!.IsDeleted.Should().BeTrue();
        physicalEntity.UpdatedAt.Should().NotBeNull();
    }

    #endregion

    #region 2. Kiểm thử CategoryRepository

    [Fact]
    public async Task CategoryRepository_GetBySlugAsync_WhenActive_ShouldReturnCategory()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var category = new Category
        {
            Name = "Món tráng miệng",
            Slug = "mon-trang-mieng",
            OrderIndex = 1
        };
        await repo.AddAsync(category);
        await db.SaveChangesAsync();

        // Act
        var result = await repo.GetBySlugAsync("mon-trang-mieng");

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Món tráng miệng");
        result.Slug.Should().Be("mon-trang-mieng");
    }

    [Fact]
    public async Task CategoryRepository_GetBySlugAsync_WhenSoftDeleted_ShouldReturnNull()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var category = new Category
        {
            Name = "Món nướng cũ",
            Slug = "mon-nuong-cu",
            IsDeleted = true
        };
        await db.Categories.AddAsync(category);
        await db.SaveChangesAsync();

        // Act
        var result = await repo.GetBySlugAsync("mon-nuong-cu");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CategoryRepository_HasActiveRecipesAsync_WhenActiveRecipesExist_ShouldReturnTrue()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var category = new Category { Name = "Món kho", Slug = "mon-kho" };
        await repo.AddAsync(category);

        var recipe = new Recipe
        {
            Title = "Thịt kho tàu",
            Slug = "thit-kho-tau",
            CategoryId = category.Id,
            AuthorId = Guid.NewGuid().ToString(),
            IsDeleted = false
        };
        await db.Recipes.AddAsync(recipe);
        await db.SaveChangesAsync();

        // Act
        var hasActive = await repo.HasActiveRecipesAsync(category.Id);

        // Assert
        hasActive.Should().BeTrue();
    }

    [Fact]
    public async Task CategoryRepository_HasActiveRecipesAsync_WhenOnlySoftDeletedRecipesExist_ShouldReturnFalse()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var category = new Category { Name = "Món lẩu", Slug = "mon-lau" };
        await repo.AddAsync(category);

        var softDeletedRecipe = new Recipe
        {
            Title = "Lẩu Thái chua cay",
            Slug = "lau-thai-chua-cay",
            CategoryId = category.Id,
            AuthorId = Guid.NewGuid().ToString(),
            IsDeleted = true // Đã bị soft delete
        };
        await db.Recipes.AddAsync(softDeletedRecipe);
        await db.SaveChangesAsync();

        // Act
        var hasActive = await repo.HasActiveRecipesAsync(category.Id);

        // Assert
        hasActive.Should().BeFalse();
    }

    [Fact]
    public async Task CategoryRepository_HasActiveRecipesAsync_WhenNoRecipes_ShouldReturnFalse()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var emptyCategory = new Category { Name = "Danh mục rỗng", Slug = "danh-muc-rong" };
        await repo.AddAsync(emptyCategory);
        await db.SaveChangesAsync();

        // Act
        var hasActive = await repo.HasActiveRecipesAsync(emptyCategory.Id);

        // Assert
        hasActive.Should().BeFalse();
    }

    [Fact]
    public async Task CategoryRepository_GetAllWithCountAsync_ShouldReturnActiveCategoriesWithActiveRecipes()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var repo = new CategoryRepository(db);
        var cat1 = new Category { Name = "A Món Luộc", Slug = "a-mon-luoc", OrderIndex = 1 };
        var cat2 = new Category { Name = "B Món Hấp", Slug = "b-mon-hap", OrderIndex = 2 };
        await repo.AddAsync(cat1);
        await repo.AddAsync(cat2);

        var recipe = new Recipe
        {
            Title = "Gà hấp lá chanh",
            Slug = "ga-hap-la-chanh",
            CategoryId = cat2.Id,
            AuthorId = Guid.NewGuid().ToString(),
            Status = RecipeStatus.Published,
            IsDeleted = false
        };
        await db.Recipes.AddAsync(recipe);
        await db.SaveChangesAsync();

        // Act
        var result = await repo.GetAllWithCountAsync();

        // Assert
        result.Should().HaveCount(2);
        result[0].Name.Should().Be("A Món Luộc");
        result[1].Name.Should().Be("B Món Hấp");
        result[1].Recipes.Should().HaveCount(1);
    }

    #endregion

    #region 3. Kiểm thử UnitOfWork

    [Fact]
    public async Task UnitOfWork_SaveChangesAsync_ShouldPersistEntitiesIntoDbContext()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var unitOfWork = new UnitOfWork(db);
        var repo = new BaseRepository<Category>(db);

        var category = new Category
        {
            Name = "Món cuốn",
            Slug = "mon-cuon",
            OrderIndex = 3
        };
        await repo.AddAsync(category);

        // Act: Dùng UnitOfWork để lưu thay đổi
        var rowsAffected = await unitOfWork.SaveChangesAsync();

        // Assert
        rowsAffected.Should().BeGreaterThan(0);
        var persisted = await repo.GetByIdAsync(category.Id);
        persisted.Should().NotBeNull();
        persisted!.Name.Should().Be("Món cuốn");
    }

    #endregion
}
