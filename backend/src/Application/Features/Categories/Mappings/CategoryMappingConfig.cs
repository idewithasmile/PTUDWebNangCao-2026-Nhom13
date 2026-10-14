using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Entities;
using Mapster;

namespace CulinaryBlog.Application.Features.Categories.Mappings;

/// <summary>
/// Cấu hình quy tắc ánh xạ Mapster toàn cục cho phân hệ Danh mục (FR-CAT).
/// Chuyển đổi thực thể Recipe sang DTO tóm tắt RecipeSummaryDto phục vụ phân trang hiệu năng cao.
/// </summary>
public static class CategoryMappingConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig.GlobalSettings.NewConfig<Recipe, RecipeSummaryDto>()
            .ConstructUsing(src => new RecipeSummaryDto(
                src.Id,
                src.Title,
                src.Slug,
                src.Description,
                src.PrepTimeMinutes,
                src.CookTimeMinutes,
                src.Servings,
                src.Difficulty,
                src.Images.FirstOrDefault(i => i.IsPrimary) != null
                    ? (src.Images.FirstOrDefault(i => i.IsPrimary)!.ThumbnailUrl ?? src.Images.FirstOrDefault(i => i.IsPrimary)!.OriginalUrl)
                    : (src.Images.FirstOrDefault() != null ? (src.Images.FirstOrDefault()!.ThumbnailUrl ?? src.Images.FirstOrDefault()!.OriginalUrl) : null),
                src.Author != null ? src.Author.DisplayName : null,
                src.PublishedAt ?? src.CreatedAt
            ));
    }
}
