using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetRecipeBySlug;

/// <summary>
/// HANDLER XỬ LÝ XEM CHI TIẾT CÔNG THỨC THEO SLUG (FR-RCP-002):
/// Trọng tâm:
/// 1. Truy vấn nạp đầy đủ (Eager Loading) các thành phần con: Steps, Ingredients, Images, Category, Author.
/// 2. Kiểm tra quyền riêng tư (Privacy Check): Bài Draft và Archived chỉ cho phép Chính tác giả hoặc Admin xem.
/// 3. Trả về RecipeDetailDto kèm chuỗi RowVersion Base64 để Client dùng cho lần cập nhật sau.
/// </summary>
public class GetRecipeBySlugQueryHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetRecipeBySlugQuery, RecipeDetailDto>
{
    public async Task<RecipeDetailDto> Handle(GetRecipeBySlugQuery request, CancellationToken cancellationToken)
    {
        // BƯỚC 1: Tìm bài viết theo đường dẫn Slug trong CSDL
        var recipe = await recipeRepository.GetBySlugAsync(request.Slug, cancellationToken);
        if (recipe == null)
        {
            throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Slug '{request.Slug}'.");
        }

        // BƯỚC 2: KIỂM TRA QUYỀN TRUY CẬP TRẠNG THÁI BÀI VIẾT (PRIVACY RULE)
        // - Bài Published (Đã xuất bản): Công khai cho tất cả mọi người đọc (kể cả khách vãng lai).
        // - Bài Draft (Bản nháp) hoặc Archived (Lưu trữ): CHỈ CHO PHÉP Tác giả sở hữu hoặc Admin xem.
        if (recipe.Status != RecipeStatus.Published && !currentUser.IsAdmin)
        {
            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId) || recipe.AuthorId != userId)
            {
                // Nếu là người ngoài xem bài nháp của người khác -> Chặn ngay lập tức (403 Forbidden)
                throw new ForbiddenException("FORBIDDEN", "Bạn không có quyền xem công thức này.");
            }
        }

        // BƯỚC 3: Map thực thể Entity sang DTO chi tiết đầy đủ để gửi về Frontend
        return new RecipeDetailDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Description,
            recipe.Instructions,
            recipe.PrepTimeMinutes,
            recipe.CookTimeMinutes,
            recipe.Servings,
            recipe.Difficulty,
            recipe.Status,
            recipe.CategoryId,
            recipe.Category?.Name ?? string.Empty,
            recipe.AuthorId,
            recipe.Author?.DisplayName ?? "Unknown Author",
            recipe.CreatedAt,
            recipe.UpdatedAt,
            recipe.PublishedAt,
            new RecipeNutritionDto(
                recipe.Nutrition.Calories,
                recipe.Nutrition.Protein,
                recipe.Nutrition.Carbohydrates,
                recipe.Nutrition.Fat
            ),
            // Map danh sách các bước chế biến (sắp xếp tuần tự)
            recipe.Steps.Select(s => new RecipeStepDto(s.Id, s.StepNumber, s.Title, s.Description, s.TimerMinutes, s.ImageUrl)).ToList(),
            // Map danh sách nguyên liệu và định lượng
            recipe.Ingredients.Select(i => new RecipeIngredientDto(i.Id, i.Name, i.Quantity, i.Unit, i.Notes, i.OrderIndex)).ToList(),
            // Map danh sách hình ảnh minh họa
            recipe.Images.Select(i => new RecipeImageDto(i.Id, i.OriginalUrl, i.MediumUrl, i.ThumbnailUrl, i.AltText, i.IsPrimary, i.OrderIndex)).ToList(),
            // Chuyển RowVersion thành Base64 gửi về Frontend để chống xung đột Concurrency
            recipe.RowVersion != null ? Convert.ToBase64String(recipe.RowVersion) : null,
            recipe.ViewCount,
            recipe.BookmarkCount
        );
    }
}
