using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

public class CreateRecipeCommandValidator : AbstractValidator<CreateRecipeCommand>
{
    public CreateRecipeCommandValidator()
    {
        RuleFor(v => v.Title)
            .NotEmpty().WithMessage("Tiêu đề không được để rỗng.")
            .MinimumLength(5).WithMessage("Tiêu đề phải từ 5 đến 200 ký tự.")
            .MaximumLength(200).WithMessage("Tiêu đề phải từ 5 đến 200 ký tự.");

        RuleFor(v => v.Description)
            .NotEmpty().WithMessage("Mô tả không được để rỗng.");

        RuleFor(v => v.PrepTimeMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("Thời gian chuẩn bị phải lớn hơn hoặc bằng 0.");

        RuleFor(v => v.CookTimeMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("Thời gian nấu phải lớn hơn hoặc bằng 0.");

        RuleFor(v => v.Servings)
            .GreaterThan(0).WithMessage("Khẩu phần ăn phải lớn hơn 0.");

        RuleFor(v => v.CategoryId)
            .NotEmpty().WithMessage("Danh mục công thức là bắt buộc.");
    }
}
