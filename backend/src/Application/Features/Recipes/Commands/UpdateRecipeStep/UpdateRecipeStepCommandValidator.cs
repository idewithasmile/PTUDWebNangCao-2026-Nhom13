using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class UpdateRecipeStepCommandValidator : AbstractValidator<UpdateRecipeStepCommand>
{
    public UpdateRecipeStepCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.StepId)
            .NotEmpty().WithMessage("Step Id là bắt buộc.");

        RuleFor(v => v.Description)
            .NotEmpty().WithMessage("Mô tả bước là bắt buộc.")
            .MaximumLength(2000).WithMessage("Mô tả bước tối đa 2000 ký tự.");

        RuleFor(v => v.Title)
            .MaximumLength(200).WithMessage("Tiêu đề bước tối đa 200 ký tự.")
            .When(v => v.Title != null);

        RuleFor(v => v.TimerMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("Thời gian ước tính phải lớn hơn hoặc bằng 0.")
            .When(v => v.TimerMinutes.HasValue);

        RuleFor(v => v.ImageUrl)
            .Must(u => Uri.TryCreate(u, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("ImageUrl phải là URL http(s) hợp lệ.")
            .When(v => v.ImageUrl != null);
    }
}
