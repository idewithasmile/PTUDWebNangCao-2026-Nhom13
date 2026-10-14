using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class DeleteRecipeImageCommandValidator : AbstractValidator<DeleteRecipeImageCommand>
{
    public DeleteRecipeImageCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.ImageId)
            .NotEmpty().WithMessage("Image Id là bắt buộc.");
    }
}
