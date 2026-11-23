using CulinaryBlog.Application.Common.Exceptions;

using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Helpers;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

/// <summary>
/// HANDLER XỬ LÝ TẠO MỚI CÔNG THỨC (FR-RCP-003):
/// Trách nhiệm:
/// 1. Kiểm tra xác thực tác giả (bắt buộc đăng nhập).
/// 2. Kiểm tra danh mục món ăn có tồn tại trong CSDL hay không.
/// 3. Tự động sinh đường link Slug không dấu và duy nhất (Unique Slug).
/// 4. Khởi tạo thực thể Recipe qua Domain Factory Method (Recipe.Create).
/// 5. Nạp danh sách các bước nấu ăn (Steps), nguyên liệu (Ingredients) và ảnh đại diện.
/// 6. Lưu xuống PostgreSQL và trả về RecipeDto.
/// </summary>
public class CreateRecipeCommandHandler(
    IRecipeRepository recipeRepository,                                        // Dùng để thao tác bảng Recipes và sinh slug
    CulinaryBlog.Domain.Common.Interfaces.ICategoryRepository categoryRepository, // Dùng để kiểm tra danh mục tồn tại
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,                           // Dùng để chốt lưu thay đổi vào DB (Commit)
    ICurrentUser currentUser)                                                  // Dùng để lấy thông tin tài khoản đang gọi API
    : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Xác thực người dùng (Lấy UserId từ Token JWT)
        var authorId = currentUser.UserId;
        if (string.IsNullOrEmpty(authorId))
        {
            // Nếu chưa đăng nhập hoặc token sai -> ném lỗi 403 Forbidden
            throw new ForbiddenException("FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");
        }

        // BƯỚC 2: Kiểm tra danh mục (Category) có thật trong Database không
        var category = await categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
        {
            // Nếu danh mục không tồn tại -> ném lỗi nghiệp vụ trả mã 422/400
            throw new BusinessRuleValidationException("CATEGORY_NOT_FOUND", $"Danh mục với ID '{request.CategoryId}' không tồn tại.");
        }

        // BƯỚC 3: Sinh đường dẫn Slug duy nhất (VD: "Bánh Tráng Nướng" -> "banh-trang-nuong")
        var baseSlug = SlugHelper.Generate(request.Title);
        // Kiểm tra trong DB, nếu đã có "banh-trang-nuong" thì tự đổi thành "banh-trang-nuong-1"
        var slug = await recipeRepository.GenerateUniqueSlugAsync(baseSlug, cancellationToken);

        // BƯỚC 4: Khởi tạo đối tượng giá trị dinh dưỡng (Value Object)
        var nutrition = new CulinaryBlog.Domain.ValueObjects.RecipeNutrition(
            request.Calories, request.Protein, request.Carbs, request.Fat);

        // BƯỚC 5: Gọi Factory Method của tầng Domain để tạo Entity Recipe
        // (Không dùng new Recipe() bừa bãi nhằm bảo vệ tính đóng gói Encapsulation của Domain)
        var recipe = Recipe.Create(
            request.Title,
            slug,
            request.Description,
            request.Instructions,
            request.PrepTimeMinutes,
            request.CookTimeMinutes,
            request.Servings,
            request.Difficulty,
            request.CategoryId,
            authorId,
            nutrition);

        // BƯỚC 6: Nạp danh sách các bước nấu ăn (Steps)
        if (request.Steps != null && request.Steps.Count > 0)
        {
            foreach (var step in request.Steps)
            {
                // Chỉ thêm các bước có mô tả hợp lệ, toán tử ?? gán chuỗi rỗng nếu tiêu đề bị null
                if (!string.IsNullOrWhiteSpace(step.Description))
                {
                    recipe.AddStep(step.Title ?? string.Empty, step.Description, step.TimerMinutes, step.ImageUrl);
                }
            }
        }
        else if (!string.IsNullOrWhiteSpace(request.Instructions))
        {
            // Tự động tạo Bước 1 từ Instructions nếu người dùng chỉ nhập văn bản hướng dẫn chung
            recipe.AddStep("Hướng dẫn thực hiện", request.Instructions);
        }

        // BƯỚC 7: Nạp danh sách nguyên liệu (Ingredients)
        if (request.Ingredients != null && request.Ingredients.Count > 0)
        {
            foreach (var ing in request.Ingredients)
            {
                if (!string.IsNullOrWhiteSpace(ing.Name))
                {
                    recipe.AddIngredient(ing.Name, ing.Quantity, ing.Unit, ing.Notes);
                }
            }
        }

        // BƯỚC 8: Thêm ảnh đại diện chính (Primary Image) nếu có
        if (!string.IsNullOrWhiteSpace(request.PrimaryImageUrl))
        {
            recipe.AddImage(request.PrimaryImageUrl, isPrimary: true);
        }

        // BƯỚC 9: Đưa vào bộ theo dõi Change Tracker và lưu vĩnh viễn xuống PostgreSQL
        await recipeRepository.AddAsync(recipe, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // BƯỚC 10: Đóng gói kết quả thành DTO trả về cho Client
        return new RecipeDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Status,
            recipe.AuthorId,
            recipe.CategoryId,
            recipe.CreatedAt,
            recipe.UpdatedAt);
    }
}
