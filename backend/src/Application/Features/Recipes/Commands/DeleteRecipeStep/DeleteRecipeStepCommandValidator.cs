using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class DeleteRecipeStepCommandValidator : AbstractValidator<DeleteRecipeStepCommand>
{
    public DeleteRecipeStepCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.StepId)
            .NotEmpty().WithMessage("Step Id là bắt buộc.");
    }
}
