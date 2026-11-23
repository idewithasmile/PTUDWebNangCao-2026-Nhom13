using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

public class CreateRecipeCommandValidator : AbstractValidator<CreateRecipeCommand>
{
    public CreateRecipeCommandValidator()
    {
        // Kiểm tra Tiêu đề (Title): bắt buộc, không được để trống, độ dài từ 5 đến 200 ký tự
        RuleFor(v => v.Title)
            .NotEmpty().WithMessage("Tiêu đề không được để rỗng.")
            .MinimumLength(5).WithMessage("Tiêu đề phải từ 5 đến 200 ký tự.")
            .MaximumLength(200).WithMessage("Tiêu đề phải từ 5 đến 200 ký tự.");

        // Kiểm tra Mô tả (Description): bắt buộc nhập tóm tắt ngắn về món ăn
        RuleFor(v => v.Description)
            .NotEmpty().WithMessage("Mô tả không được để rỗng.");

        // Kiểm tra Thời gian chuẩn bị (PrepTimeMinutes): không được âm (>= 0)
        RuleFor(v => v.PrepTimeMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("Thời gian chuẩn bị phải lớn hơn hoặc bằng 0.");

        // Kiểm tra Thời gian nấu (CookTimeMinutes): không được âm (>= 0)
        RuleFor(v => v.CookTimeMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("Thời gian nấu phải lớn hơn hoặc bằng 0.");

        // Kiểm tra Khẩu phần ăn (Servings): số người ăn phải từ 1 trở lên (> 0)
        RuleFor(v => v.Servings)
            .GreaterThan(0).WithMessage("Khẩu phần ăn phải lớn hơn 0.");

        // Kiểm tra Danh mục (CategoryId): bắt buộc phải chọn danh mục (GUID không được rỗng)
        RuleFor(v => v.CategoryId)
            .NotEmpty().WithMessage("Danh mục công thức là bắt buộc.");

        // Kiểm tra Đường dẫn ảnh chính (PrimaryImageUrl): tối đa 500 ký tự và không được truyền chuỗi Base64 data:
        // (Bắt buộc ảnh phải được upload lên MinIO/Cloudinary trước rồi mới lấy link URL gán vào đây)
        RuleFor(v => v.PrimaryImageUrl)
            .MaximumLength(500).WithMessage("Đường dẫn ảnh đại diện không được vượt quá 500 ký tự.")
            .Must(url => string.IsNullOrEmpty(url) || !url.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Đường dẫn ảnh không được là chuỗi base64 (cần tải lên hệ thống lưu trữ).");
    }
}
