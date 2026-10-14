using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeIngredient;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;
using CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MockQueryable.Moq;
using Moq;

namespace CulinaryBlog.Application.Tests;

/// <summary>
/// FR-RCP-009: test handler thật với entity Recipe thật (AddIngredient/Update/
/// RemoveIngredient chạy logic domain thật). Kèm test FluentValidation rules.
/// </summary>
public class RecipeIngredientsHandlerTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork = new();
    private readonly Mock<IRecipeRepository> _mockRecipeRepo = new();
    private readonly Mock<ICurrentUser> _mockCurrentUser = new();
    private readonly Mock<ICacheService> _mockCache = new();

    private static Recipe NewRecipe(string authorId = "author-1")
        => Recipe.Create("Pho Bo Ha Noi", "pho-bo-ha-noi", "Mo ta", "Huong dan",
            10, 20, 2, RecipeDifficulty.Easy, Guid.NewGuid(), authorId, null);

    private void SetupQueryable(Recipe? recipe)
    {
        var list = recipe is null ? new List<Recipe>() : new List<Recipe> { recipe };
        _mockRecipeRepo.Setup(r => r.GetQueryable()).Returns(list.AsQueryable().BuildMock());
    }

    private void SetupOwner(string authorId = "author-1")
    {
        _mockCurrentUser.Setup(c => c.IsAuthenticated).Returns(true);
        _mockCurrentUser.Setup(c => c.UserId).Returns(authorId);
    }

    [Fact]
    public async Task Add_ValidCommand_CreatesIngredient_ReturnsDto()
    {
        var recipe = NewRecipe();
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new AddRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new AddRecipeIngredientCommand(recipe.Id, "Thịt bò", 500m, "gram", "Thăn bò"), CancellationToken.None);

        result.Name.Should().Be("Thịt bò");
        result.Quantity.Should().Be(500m);
        result.Unit.Should().Be("gram");
        result.OrderIndex.Should().Be(1);
        recipe.Ingredients.Should().ContainSingle();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockCache.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Add_SecondIngredient_AutoIncrementsOrderIndex()
    {
        var recipe = NewRecipe();
        recipe.AddIngredient("Thịt bò", 500m, "gram");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new AddRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new AddRecipeIngredientCommand(recipe.Id, "Bánh phở", 1000m, "gram"), CancellationToken.None);

        result.OrderIndex.Should().Be(2);
        recipe.Ingredients.Should().HaveCount(2);
    }

    [Fact]
    public async Task Add_NotOwner_ThrowsForbidden()
    {
        var recipe = NewRecipe("author-1");
        SetupQueryable(recipe);
        SetupOwner("author-2");

        var handler = new AddRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new AddRecipeIngredientCommand(recipe.Id, "Muối", 5m, "gram"), CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Update_ValidCommand_UpdatesIngredient()
    {
        var recipe = NewRecipe();
        var ing = recipe.AddIngredient("Thit bo", 500m, "gram");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new UpdateRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new UpdateRecipeIngredientCommand(recipe.Id, ing.Id, "Thăn bò", 700m, "gram", "Loại ngon"), CancellationToken.None);

        result.Name.Should().Be("Thăn bò");
        result.Quantity.Should().Be(700m);
        result.Notes.Should().Be("Loại ngon");
        ing.Name.Should().Be("Thăn bò");
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Update_IngredientNotInRecipe_ThrowsNotFound()
    {
        var recipe = NewRecipe();
        recipe.AddIngredient("Muối", 5m, "gram");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new UpdateRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new UpdateRecipeIngredientCommand(recipe.Id, Guid.NewGuid(), "Đường", 10m, "gram"), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_INGREDIENT_NOT_FOUND");
    }

    [Fact]
    public async Task Delete_ValidCommand_RemovesIngredient()
    {
        var recipe = NewRecipe();
        var ing = recipe.AddIngredient("Muối", 5m, "gram");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new DeleteRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        await handler.Handle(new DeleteRecipeIngredientCommand(recipe.Id, ing.Id), CancellationToken.None);

        recipe.Ingredients.Should().BeEmpty();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_RecipeNotFound_ThrowsNotFound()
    {
        SetupQueryable(null);
        SetupOwner();

        var handler = new DeleteRecipeIngredientCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new DeleteRecipeIngredientCommand(Guid.NewGuid(), Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_NOT_FOUND");
    }

    // ---- FluentValidation rules (CONS-008): test validator trực tiếp ----

    [Theory]
    [InlineData("", false)]       // rỗng
    [InlineData("Muối", true)]    // hợp lệ
    public void AddValidator_Name_Rules(string name, bool expectedValid)
    {
        var validator = new AddRecipeIngredientCommandValidator();
        var result = validator.Validate(new AddRecipeIngredientCommand(Guid.NewGuid(), name, 5m, "gram"));

        result.IsValid.Should().Be(expectedValid);
    }

    [Fact]
    public void AddValidator_NameOver100Chars_Fails()
    {
        var validator = new AddRecipeIngredientCommandValidator();
        var result = validator.Validate(new AddRecipeIngredientCommand(Guid.NewGuid(), new string('a', 101), 5m, "gram"));

        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData(0, false)]
    [InlineData(-5, false)]
    [InlineData(10, true)]
    public void AddValidator_Quantity_MustBePositive(decimal qty, bool expectedValid)
    {
        var validator = new AddRecipeIngredientCommandValidator();
        var result = validator.Validate(new AddRecipeIngredientCommand(Guid.NewGuid(), "Đường", qty, "gram"));

        result.IsValid.Should().Be(expectedValid);
    }

    [Fact]
    public void AddValidator_EmptyUnit_Fails()
    {
        var validator = new AddRecipeIngredientCommandValidator();
        var result = validator.Validate(new AddRecipeIngredientCommand(Guid.NewGuid(), "Đường", 5m, ""));

        result.IsValid.Should().BeFalse();
    }
}
