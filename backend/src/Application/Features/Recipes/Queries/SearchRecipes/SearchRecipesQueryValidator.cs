using FluentValidation;

namespace CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;

/// <summary>
/// Bộ kiểm thực tính hợp lệ của truy vấn tìm kiếm công thức (SearchRecipesQuery).
/// Tuân thủ quy định nghiệp vụ FR-SRCH-001: từ khóa tối thiểu 2 ký tự và giới hạn phân trang an toàn.
/// </summary>
public class SearchRecipesQueryValidator : AbstractValidator<SearchRecipesQuery>
{
    public SearchRecipesQueryValidator()
    {
        RuleFor(x => x.SearchTerm)
            .NotEmpty().WithMessage("Từ khóa tìm kiếm không được để trống.")
            .MinimumLength(2).WithMessage("Từ khóa tìm kiếm phải có tối thiểu 2 ký tự.");

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Chỉ số trang (Page) phải lớn hơn hoặc bằng 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50).WithMessage("Kích thước trang (PageSize) phải nằm trong khoảng từ 1 đến 50.");
    }
}
