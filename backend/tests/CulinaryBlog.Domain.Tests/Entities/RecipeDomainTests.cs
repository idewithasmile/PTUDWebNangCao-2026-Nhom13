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
            prepTimeMinutes: 30,
            cookTimeMinutes: 120,
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
            prepTimeMinutes: 10,
            cookTimeMinutes: 20,
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
            prepTimeMinutes: 20,
            cookTimeMinutes: 30,
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
            prepTimeMinutes: 20,
            cookTimeMinutes: 30,
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
    [Fact]
    public void Update_WithValidData_ShouldUpdateFieldsAndTimestamp()
    {
        // Arrange
        var recipe = Recipe.Create("Cũ", "cu", "Mô tả cũ", "", 10, 20, 2, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        var oldUpdatedAt = recipe.UpdatedAt;

        // Act
        recipe.Update("Mới", "moi", "Mô tả mới", "HD mới", 15, 25, 4, RecipeDifficulty.Hard, _validCategoryId);

        // Assert
        Assert.Equal("Mới", recipe.Title);
        Assert.Equal("moi", recipe.Slug);
        Assert.Equal("Mô tả mới", recipe.Description);
        Assert.Equal("HD mới", recipe.Instructions);
        Assert.Equal(15, recipe.PrepTimeMinutes);
        Assert.Equal(25, recipe.CookTimeMinutes);
        Assert.Equal(4, recipe.Servings);
        Assert.Equal(RecipeDifficulty.Hard, recipe.Difficulty);
        Assert.NotEqual(oldUpdatedAt, recipe.UpdatedAt);
    }

    [Fact]
    public void Archive_ShouldChangeStatusToArchived()
    {
        var recipe = Recipe.Create("T", "s", "d", "", 1, 1, 1, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        recipe.Archive();
        Assert.Equal(RecipeStatus.Archived, recipe.Status);
    }

    [Fact]
    public void Unpublish_ShouldRevertStatusToDraft()
    {
        var recipe = Recipe.Create("T", "s", "d", "", 1, 1, 1, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        recipe.AddStep("Step 1", "Desc");
        recipe.Publish();
        recipe.Unpublish();
        Assert.Equal(RecipeStatus.Draft, recipe.Status);
    }

    [Fact]
    public void AddIngredient_ShouldIncrementOrderIndexAutomatically()
    {
        var recipe = Recipe.Create("T", "s", "d", "", 1, 1, 1, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        var ing1 = recipe.AddIngredient("Đường");
        var ing2 = recipe.AddIngredient("Muối");

        Assert.Equal(1, ing1.OrderIndex);
        Assert.Equal(2, ing2.OrderIndex);
    }

    [Fact]
    public void RemoveImage_WhenPrimary_ShouldPromoteNextImageAsPrimary()
    {
        var recipe = Recipe.Create("T", "s", "d", "", 1, 1, 1, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);
        var img1 = recipe.AddImage("url1"); // IsPrimary = true
        var img2 = recipe.AddImage("url2"); // IsPrimary = false

        recipe.RemoveImage(img1.Id);

        Assert.Single(recipe.Images);
        Assert.True(recipe.Images.First().IsPrimary);
    }

    [Fact]
    public void Create_WithZeroServings_ShouldThrowDomainException()
    {
        var ex = Assert.Throws<DomainException>(() => Recipe.Create(
            "T", "s", "d", "", 10, 10, 0, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId
        ));
        Assert.Equal("Khẩu phần ăn phải lớn hơn 0.", ex.Message);
    }
}
