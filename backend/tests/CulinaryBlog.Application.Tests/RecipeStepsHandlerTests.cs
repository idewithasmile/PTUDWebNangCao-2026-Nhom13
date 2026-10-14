using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeStep;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;
using CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using FluentAssertions;
using MockQueryable.Moq;
using Moq;

namespace CulinaryBlog.Application.Tests;

/// <summary>
/// FR-RCP-010: test handler thật với entity Recipe thật (AddStep/Update/RemoveStep
/// chạy logic domain thật, gồm renumber 1-2-3 sau DELETE). Kèm test validator.
/// </summary>
public class RecipeStepsHandlerTests
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
    public async Task Add_FirstStep_GetsStepNumberOne()
    {
        var recipe = NewRecipe();
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new AddRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new AddRecipeStepCommand(recipe.Id, "Hầm xương 2 tiếng", "Sơ chế"), CancellationToken.None);

        result.StepNumber.Should().Be(1);
        result.Description.Should().Be("Hầm xương 2 tiếng");
        recipe.Steps.Should().ContainSingle();
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockCache.Verify(c => c.RemoveAsync($"recipe:{recipe.Slug}", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Add_NextStep_GetsMaxPlusOne()
    {
        var recipe = NewRecipe();
        recipe.AddStep("B1", "Sơ chế");
        recipe.AddStep("B2", "Hầm xương");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new AddRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new AddRecipeStepCommand(recipe.Id, "Nêm nếm"), CancellationToken.None);

        result.StepNumber.Should().Be(3);
        recipe.Steps.Should().HaveCount(3);
    }

    [Fact]
    public async Task Add_NotOwner_ThrowsForbidden()
    {
        var recipe = NewRecipe("author-1");
        SetupQueryable(recipe);
        SetupOwner("author-2");

        var handler = new AddRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new AddRecipeStepCommand(recipe.Id, "Làm gì đó"), CancellationToken.None);

        await act.Should().ThrowAsync<ForbiddenException>();
    }

    [Fact]
    public async Task Update_ValidCommand_UpdatesDescription_KeepsStepNumber()
    {
        var recipe = NewRecipe();
        var step = recipe.AddStep("B1", "Sơ chế");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new UpdateRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var result = await handler.Handle(
            new UpdateRecipeStepCommand(recipe.Id, step.Id, "Sơ chế kỹ", "Sơ chế", 15), CancellationToken.None);

        result.StepNumber.Should().Be(1);
        result.Description.Should().Be("Sơ chế kỹ");
        result.TimerMinutes.Should().Be(15);
        step.Description.Should().Be("Sơ chế kỹ");
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Update_StepNotInRecipe_ThrowsNotFound()
    {
        var recipe = NewRecipe();
        recipe.AddStep("B1", "Sơ chế");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new UpdateRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new UpdateRecipeStepCommand(recipe.Id, Guid.NewGuid(), "Mô tả"), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_STEP_NOT_FOUND");
    }

    [Fact]
    public async Task Delete_MiddleStep_RenumbersRemainingContinuously()
    {
        var recipe = NewRecipe();
        recipe.AddStep("Bước 1", "Sơ chế");
        var step2 = recipe.AddStep("Bước 2", "Hầm xương");
        recipe.AddStep("Bước 3", "Nêm nếm");
        SetupQueryable(recipe);
        SetupOwner();

        var handler = new DeleteRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        await handler.Handle(new DeleteRecipeStepCommand(recipe.Id, step2.Id), CancellationToken.None);

        recipe.Steps.Should().HaveCount(2);
        var ordered = recipe.Steps.OrderBy(s => s.StepNumber).ToList();
        ordered[0].StepNumber.Should().Be(1);
        ordered[0].Title.Should().Be("Bước 1");
        ordered[1].StepNumber.Should().Be(2);
        ordered[1].Title.Should().Be("Bước 3");
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_RecipeNotFound_ThrowsNotFound()
    {
        SetupQueryable(null);
        SetupOwner();

        var handler = new DeleteRecipeStepCommandHandler(
            _mockRecipeRepo.Object, _mockUnitOfWork.Object, _mockCurrentUser.Object, _mockCache.Object);
        var act = async () => await handler.Handle(
            new DeleteRecipeStepCommand(Guid.NewGuid(), Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>().Where(e => e.ErrorCode == "RECIPE_NOT_FOUND");
    }

    // ---- FluentValidation rules (CONS-008) ----

    [Fact]
    public void AddValidator_EmptyDescription_Fails()
    {
        var validator = new AddRecipeStepCommandValidator();
        var result = validator.Validate(new AddRecipeStepCommand(Guid.NewGuid(), ""));

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void AddValidator_DescriptionOver2000Chars_Fails()
    {
        var validator = new AddRecipeStepCommandValidator();
        var result = validator.Validate(new AddRecipeStepCommand(Guid.NewGuid(), new string('a', 2001)));

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void AddValidator_NegativeTimer_Fails()
    {
        var validator = new AddRecipeStepCommandValidator();
        var result = validator.Validate(new AddRecipeStepCommand(Guid.NewGuid(), "Mô tả", TimerMinutes: -1));

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void AddValidator_ValidCommand_Passes()
    {
        var validator = new AddRecipeStepCommandValidator();
        var result = validator.Validate(new AddRecipeStepCommand(Guid.NewGuid(), "Hầm xương", "Sơ chế", 30));

        result.IsValid.Should().BeTrue();
    }
}
