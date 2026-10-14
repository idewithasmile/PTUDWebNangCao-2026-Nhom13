using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class SetPrimaryImageCommandValidator : AbstractValidator<SetPrimaryImageCommand>
{
    public SetPrimaryImageCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.ImageId)
            .NotEmpty().WithMessage("Image Id là bắt buộc.");
    }
}
