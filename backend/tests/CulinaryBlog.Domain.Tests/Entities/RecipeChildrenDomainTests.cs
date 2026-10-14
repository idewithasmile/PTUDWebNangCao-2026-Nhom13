using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using Xunit;

namespace CulinaryBlog.Domain.Tests.Entities;

/// <summary>
/// FR-RCP-009/010: kiểm chứng domain behaviors mà Application handlers dựa vào
/// (Update/Remove ingredient, Update step, no-op an toàn khi Id không tồn tại).
/// </summary>
public class RecipeChildrenDomainTests
{
    private readonly Guid _validCategoryId = Guid.NewGuid();
    private readonly string _validAuthorId = Guid.NewGuid().ToString();

    private Recipe NewRecipe()
        => Recipe.Create("Pho Bo", "pho-bo", "Mo ta", "Huong dan",
            10, 20, 2, RecipeDifficulty.Easy, _validCategoryId, _validAuthorId);

    [Fact]
    public void UpdateIngredient_ShouldChangeFields()
    {
        var recipe = NewRecipe();
        var ing = recipe.AddIngredient("Thit bo", 500m, "gram");

        ing.Update("Than bo", 700m, "gram", "Loai ngon", 3);

        Assert.Equal("Than bo", ing.Name);
        Assert.Equal(700m, ing.Quantity);
        Assert.Equal("Loai ngon", ing.Notes);
        Assert.Equal(3, ing.OrderIndex);
    }

    [Fact]
    public void RemoveIngredient_ShouldRemoveOnlyTarget()
    {
        var recipe = NewRecipe();
        var ing1 = recipe.AddIngredient("Muoi", 5m, "gram");
        var ing2 = recipe.AddIngredient("Duong", 10m, "gram");

        recipe.RemoveIngredient(ing1.Id);

        Assert.Single(recipe.Ingredients);
        Assert.Equal(ing2.Id, recipe.Ingredients.First().Id);
    }

    [Fact]
    public void RemoveIngredient_NonExistentId_ShouldBeNoOp()
    {
        var recipe = NewRecipe();
        recipe.AddIngredient("Muoi", 5m, "gram");

        recipe.RemoveIngredient(Guid.NewGuid());

        Assert.Single(recipe.Ingredients);
    }

    [Fact]
    public void UpdateStep_ShouldChangeDescriptionAndKeepNumber()
    {
        var recipe = NewRecipe();
        var step = recipe.AddStep("B1", "So che");

        step.Update(step.StepNumber, "B1", "So che ky", 15);

        Assert.Equal(1, step.StepNumber);
        Assert.Equal("So che ky", step.Description);
        Assert.Equal(15, step.TimerMinutes);
    }

    [Fact]
    public void RemoveStep_NonExistentId_ShouldKeepNumberingUnchanged()
    {
        var recipe = NewRecipe();
        recipe.AddStep("B1", "So che");
        recipe.AddStep("B2", "Ham xuong");

        recipe.RemoveStep(Guid.NewGuid());

        Assert.Equal(2, recipe.Steps.Count);
        Assert.Equal([1, 2], recipe.Steps.OrderBy(s => s.StepNumber).Select(s => s.StepNumber));
    }

    [Fact]
    public void SetPrimaryImage_NonExistentId_ShouldKeepCurrentPrimary()
    {
        var recipe = NewRecipe();
        var img1 = recipe.AddImage("url1");
        var img2 = recipe.AddImage("url2");

        recipe.SetPrimaryImage(Guid.NewGuid());

        Assert.True(img1.IsPrimary);
        Assert.False(img2.IsPrimary);
    }

    [Fact]
    public void RemoveImage_LastImage_ShouldLeaveCollectionEmpty()
    {
        var recipe = NewRecipe();
        var img = recipe.AddImage("url1");

        recipe.RemoveImage(img.Id);

        Assert.Empty(recipe.Images);
    }
}
