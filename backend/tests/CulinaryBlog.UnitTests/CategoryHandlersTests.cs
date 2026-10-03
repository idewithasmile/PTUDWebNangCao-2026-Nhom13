using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;
using CulinaryBlog.Application.Features.Categories.Commands.DeleteCategory;
using CulinaryBlog.Application.Features.Categories.Commands.UpdateCategory;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategories;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
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
    }

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
    public async Task GetCategoryBySlug_WhenExists_ShouldReturnDetailDto()
    {
        // Arrange
        var cat = new Category { Name = "Món hấp", Slug = "mon-hap", Description = "Mô tả", RowVersion = [1] };
        var recipes = new List<Recipe>
        {
            Recipe.Create("Gà hấp lá chanh", "ga-hap-la-chanh", "Ngon tuyệt", "Hướng dẫn hấp", 10, 15, 2, CulinaryBlog.Domain.Enums.RecipeDifficulty.Easy, Guid.NewGuid(), Guid.NewGuid().ToString())
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
}
