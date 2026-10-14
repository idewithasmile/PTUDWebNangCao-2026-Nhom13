using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class DeleteRecipeIngredientCommandValidator : AbstractValidator<DeleteRecipeIngredientCommand>
{
    public DeleteRecipeIngredientCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.IngredientId)
            .NotEmpty().WithMessage("Ingredient Id là bắt buộc.");
    }
}
