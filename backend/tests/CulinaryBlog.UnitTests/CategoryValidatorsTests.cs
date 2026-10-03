using CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;
using CulinaryBlog.Application.Features.Categories.Commands.UpdateCategory;
using FluentAssertions;

namespace CulinaryBlog.UnitTests;

public class CategoryValidatorsTests
{
    private readonly CreateCategoryCommandValidator _createValidator = new();
    private readonly UpdateCategoryCommandValidator _updateValidator = new();

    [Fact]
    public void CreateCommand_WithValidData_ShouldPassValidation()
    {
        var command = new CreateCategoryCommand("Món nướng", "Mô tả món nướng", "https://example.com/nuong.jpg", 1);
        var result = _createValidator.Validate(command);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("A")] // less than 2 chars
    public void CreateCommand_WithInvalidName_ShouldFail(string name)
    {
        var command = new CreateCategoryCommand(name, "Mô tả", null, 0);
        var result = _createValidator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateCategoryCommand.Name));
    }

    [Theory]
    [InlineData("<script>alert('xss')</script>")]
    [InlineData("Món nướng <img src=x onerror=alert(1)>")]
    [InlineData("javascript:alert(1)")]
    public void CreateCommand_WithMaliciousHtml_ShouldFail(string name)
    {
        var command = new CreateCategoryCommand(name, null, null, 0);
        var result = _createValidator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("không được chứa mã độc"));
    }

    [Fact]
    public void CreateCommand_WithNegativeOrderIndex_ShouldFail()
    {
        var command = new CreateCategoryCommand("Hợp lệ", null, null, -1);
        var result = _createValidator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateCategoryCommand.OrderIndex));
    }

    [Fact]
    public void UpdateCommand_WithValidData_ShouldPassValidation()
    {
        var command = new UpdateCategoryCommand(
            Guid.NewGuid(),
            "Món lẩu",
            "Mô tả món lẩu",
            "https://example.com/lau.jpg",
            2,
            [1, 2, 3]);

        var result = _updateValidator.Validate(command);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateCommand_WithEmptyIdOrEmptyRowVersion_ShouldFail()
    {
        var command = new UpdateCategoryCommand(
            Guid.Empty,
            "Món lẩu",
            null,
            null,
            0,
            []);

        var result = _updateValidator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateCategoryCommand.Id));
        result.Errors.Should().Contain(e => e.PropertyName == nameof(UpdateCategoryCommand.RowVersion));
    }
}
