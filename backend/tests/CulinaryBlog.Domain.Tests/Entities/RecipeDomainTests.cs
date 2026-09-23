using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.ValueObjects;
using Xunit;

namespace CulinaryBlog.Domain.Tests.Entities;

public class RecipeDomainTests
{
    private readonly Guid _validCategoryId = Guid.NewGuid();
    private readonly string _validAuthorId = Guid.NewGuid().ToString();

    [Fact]
    public void Create_WithValidParameters_ShouldInitializeRecipeInDraftStatus()
    {
        // Act
        var recipe = Recipe.Create(
            title: "Phở Bò Hà Nội",
            slug: "pho-bo-ha-noi",
            description: "Công thức gia truyền nấu phở bò đậm đà chuẩn vị.",
            instructions: "Hầm xương, luộc thịt, chần bánh phở...",
            prepTime: 30,
            cookTime: 120,
            servings: 4,
            difficulty: RecipeDifficulty.Medium,
            categoryId: _validCategoryId,
            authorId: _validAuthorId
        );

        // Assert
        Assert.NotNull(recipe);
        Assert.Equal("Phở Bò Hà Nội", recipe.Title);
        Assert.Equal("pho-bo-ha-noi", recipe.Slug);
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
        Assert.Null(recipe.PublishedAt);
        Assert.Empty(recipe.Steps);
        Assert.Empty(recipe.Ingredients);
        Assert.Empty(recipe.Images);
    }

    [Theory]
    [InlineData("", "slug", "desc", "Tiêu đề công thức không được để rỗng.")]
    [InlineData("Title", "", "desc", "Slug công thức không được để rỗng.")]
    [InlineData("Title", "slug", "", "Mô tả công thức không được để rỗng.")]
    public void Create_WithEmptyRequiredFields_ShouldThrowDomainException(string title, string slug, string description, string expectedErrorMsg)
    {
        // Act & Assert
        var ex = Assert.Throws<DomainException>(() => Recipe.Create(
            title: title,
            slug: slug,
            description: description,
            instructions: "Instructions",
            prepTime: 10,
            cookTime: 20,
            servings: 2,
            difficulty: RecipeDifficulty.Easy,
            categoryId: _validCategoryId,
            authorId: _validAuthorId
        ));

        Assert.NotNull(ex.Message);
        Assert.Contains(expectedErrorMsg, ex.Message);
    }

    [Fact]
    public void Publish_WithoutSteps_ShouldThrowDomainException()
    {
        // Arrange
        var recipe = Recipe.Create(
            title: "Bún Chả Hà Nội",
            slug: "bun-cha-ha-noi",
            description: "Món bún chả thơm ngon.",
            instructions: "Nướng thịt...",
            prepTime: 20,
            cookTime: 30,
            servings: 2,
            difficulty: RecipeDifficulty.Easy,
            categoryId: _validCategoryId,
            authorId: _validAuthorId
        );

        // Act & Assert
        var exception = Assert.Throws<DomainException>(() => recipe.Publish());
        Assert.Equal("Recipe phải có ít nhất 1 bước thực hiện trước khi Publish.", exception.Message);
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
    }

    [Fact]
    public void Publish_WithSteps_ShouldChangeStatusToPublishedAndSetPublishedAt()
    {
        // Arrange
        var recipe = Recipe.Create(
            title: "Bún Chả Hà Nội",
            slug: "bun-cha-ha-noi",
            description: "Món bún chả thơm ngon.",
            instructions: "Nướng thịt...",
            prepTime: 20,
            cookTime: 30,
            servings: 2,
            difficulty: RecipeDifficulty.Easy,
            categoryId: _validCategoryId,
            authorId: _validAuthorId
        );

        recipe.AddStep("Ướp thịt", "Ướp thịt với mắm, đường, hành tỏi trong 30 phút.");

        // Act
        recipe.Publish();

        // Assert
        Assert.Equal(RecipeStatus.Published, recipe.Status);
        Assert.NotNull(recipe.PublishedAt);
    }

    [Fact]
    public void AddStepAndRemoveStep_ShouldAutoRenumberRemainingSteps()
    {
        // Arrange
        var recipe = Recipe.Create("Cơm Tấm", "com-tam", "Mô tả", "Hướng dẫn", 10, 20, 2, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        
        var step1 = recipe.AddStep("Bước 1", "Sơ chế nguyên liệu");
        var step2 = recipe.AddStep("Bước 2", "Nấu cơm");
        var step3 = recipe.AddStep("Bước 3", "Nướng sườn");

        Assert.Equal(3, recipe.Steps.Count);

        // Act - Xóa bước 2
        recipe.RemoveStep(step2.Id);

        // Assert
        Assert.Equal(2, recipe.Steps.Count);
        var remainingSteps = recipe.Steps.OrderBy(s => s.StepNumber).ToList();
        Assert.Equal(1, remainingSteps[0].StepNumber);
        Assert.Equal("Bước 1", remainingSteps[0].Title);
        Assert.Equal(2, remainingSteps[1].StepNumber);
        Assert.Equal("Bước 3", remainingSteps[1].Title);
    }

    [Fact]
    public void AddImage_FirstImage_ShouldAutomaticallyBePrimary()
    {
        // Arrange
        var recipe = Recipe.Create("Gỏi Cuốn", "goi-cuon", "Mô tả", "Hướng dẫn", 10, 10, 2, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);

        // Act
        var image1 = recipe.AddImage("https://example.com/img1.jpg");
        var image2 = recipe.AddImage("https://example.com/img2.jpg");

        // Assert
        Assert.True(image1.IsPrimary);
        Assert.False(image2.IsPrimary);
    }

    [Fact]
    public void SetPrimaryImage_ShouldUpdatePrimaryFlagCorrectly()
    {
        // Arrange
        var recipe = Recipe.Create("Gỏi Cuốn", "goi-cuon", "Mô tả", "Hướng dẫn", 10, 10, 2, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        var image1 = recipe.AddImage("https://example.com/img1.jpg");
        var image2 = recipe.AddImage("https://example.com/img2.jpg");

        // Act
        recipe.SetPrimaryImage(image2.Id);

        // Assert
        Assert.False(image1.IsPrimary);
        Assert.True(image2.IsPrimary);
    }
}
