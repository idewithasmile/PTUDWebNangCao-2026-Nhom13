using CulinaryBlog.Domain.Exceptions;
using FluentAssertions;
using Xunit;

namespace CulinaryBlog.UnitTests.Domain;

/// <summary>
/// Bộ kiểm thử đơn vị cho các lớp Domain Exceptions.
/// Tuân thủ CONS-001 (thuần .NET BCL) và chuẩn cấu trúc AAA (Arrange - Act - Assert).
/// </summary>
public class DomainExceptionTests
{
    [Fact]
    public void EntityNotFoundException_WithErrorCodeAndMessage_ShouldSetPropertiesCorrectly()
    {
        // Arrange
        const string errorCode = "CATEGORY_NOT_FOUND";
        const string message = "Category with slug 'mon-an-vat' was not found.";

        // Act
        var exception = new EntityNotFoundException(errorCode, message);

        // Assert
        exception.ErrorCode.Should().Be(errorCode);
        exception.Message.Should().Be(message);
        exception.Should().BeAssignableTo<DomainException>();
        exception.Should().BeAssignableTo<Exception>();
    }

    [Fact]
    public void EntityNotFoundException_ForEntity_ShouldGenerateStandardErrorCodeAndMessage()
    {
        // Arrange
        const string entityName = "Recipe";
        var key = Guid.NewGuid();

        // Act
        var exception = EntityNotFoundException.ForEntity(entityName, key);

        // Assert
        exception.ErrorCode.Should().Be("RECIPE_NOT_FOUND");
        exception.Message.Should().Contain(entityName);
        exception.Message.Should().Contain(key.ToString());
    }

    [Fact]
    public void CategoryNotEmptyException_WithRecipeCount_ShouldSetStandardErrorCodeAndMessage()
    {
        // Arrange
        const string categoryName = "Món nướng BBQ";
        const int activeRecipeCount = 5;

        // Act
        var exception = new CategoryNotEmptyException(categoryName, activeRecipeCount);

        // Assert
        exception.ErrorCode.Should().Be("CATEGORY_DELETE_HAS_RECIPES");
        exception.Message.Should().Contain(categoryName);
        exception.Message.Should().Contain(activeRecipeCount.ToString());
        exception.Should().BeAssignableTo<DomainException>();
    }

    [Fact]
    public void CategoryNotEmptyException_WithCustomMessage_ShouldRetainMessage()
    {
        // Arrange
        const string customMessage = "Custom category deletion blocked message.";

        // Act
        var exception = new CategoryNotEmptyException(customMessage);

        // Assert
        exception.ErrorCode.Should().Be("CATEGORY_DELETE_HAS_RECIPES");
        exception.Message.Should().Be(customMessage);
    }

    [Fact]
    public void ConcurrencyConflictException_DefaultConstructor_ShouldHaveDefaultProperties()
    {
        // Act
        var exception = new ConcurrencyConflictException();

        // Assert
        exception.ErrorCode.Should().Be("CONCURRENCY_CONFLICT");
        exception.Message.Should().NotBeNullOrWhiteSpace();
        exception.Should().BeAssignableTo<DomainException>();
    }

    [Fact]
    public void ConcurrencyConflictException_WithCustomErrorCodeAndMessage_ShouldSetProperties()
    {
        // Arrange
        const string errorCode = "CATEGORY_CONCURRENCY_CONFLICT";
        const string message = "RowVersion mismatch occurred while updating category.";

        // Act
        var exception = new ConcurrencyConflictException(errorCode, message);

        // Assert
        exception.ErrorCode.Should().Be(errorCode);
        exception.Message.Should().Be(message);
    }

    [Fact]
    public void BusinessRuleValidationException_WithMessage_ShouldSetStandardErrorCode()
    {
        // Arrange
        const string ruleMessage = "Recipe prep time cannot be negative.";

        // Act
        var exception = new BusinessRuleValidationException(ruleMessage);

        // Assert
        exception.ErrorCode.Should().Be("BUSINESS_RULE_VIOLATION");
        exception.Message.Should().Be(ruleMessage);
        exception.Should().BeAssignableTo<DomainException>();
    }

    [Fact]
    public void BusinessRuleValidationException_WithCustomErrorCode_ShouldSetProperties()
    {
        // Arrange
        const string customCode = "RECIPE_PREP_TIME_INVALID";
        const string message = "Invalid preparation duration.";

        // Act
        var exception = new BusinessRuleValidationException(customCode, message);

        // Assert
        exception.ErrorCode.Should().Be(customCode);
        exception.Message.Should().Be(message);
    }
}
