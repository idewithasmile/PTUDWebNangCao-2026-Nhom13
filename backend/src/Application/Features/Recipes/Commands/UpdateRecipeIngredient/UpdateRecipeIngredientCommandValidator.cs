using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;

/// <summary>Validation chạy trong ValidationBehavior (CONS-008). Fail → 400 RFC 7807.</summary>
public class UpdateRecipeIngredientCommandValidator : AbstractValidator<UpdateRecipeIngredientCommand>
{
    public UpdateRecipeIngredientCommandValidator()
    {
        RuleFor(v => v.RecipeId)
            .NotEmpty().WithMessage("Recipe Id là bắt buộc.");

        RuleFor(v => v.IngredientId)
            .NotEmpty().WithMessage("Ingredient Id là bắt buộc.");

        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Tên nguyên liệu là bắt buộc.")
            .MinimumLength(1).WithMessage("Tên nguyên liệu tối thiểu 1 ký tự.")
            .MaximumLength(100).WithMessage("Tên nguyên liệu tối đa 100 ký tự.");

        RuleFor(v => v.Quantity)
            .GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0.")
            .When(v => v.Quantity.HasValue);

        RuleFor(v => v.Unit)
            .NotEmpty().WithMessage("Đơn vị là bắt buộc.")
            .MaximumLength(50).WithMessage("Đơn vị tối đa 50 ký tự.")
            .When(v => v.Unit != null);

        RuleFor(v => v.Notes)
            .MaximumLength(500).WithMessage("Ghi chú tối đa 500 ký tự.")
            .When(v => v.Notes != null);

        RuleFor(v => v.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
            .When(v => v.SortOrder.HasValue);
    }
}
