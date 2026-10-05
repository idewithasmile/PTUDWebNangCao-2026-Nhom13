using CulinaryBlog.Application.Common.Models;

namespace CulinaryBlog.Application.Features.Categories.DTOs;

/// <summary>
/// DTO phản hồi chi tiết danh mục kèm danh sách công thức phân trang (FR-CAT-002).
/// </summary>
/// <param name="Category">Thông tin chi tiết của danh mục</param>
/// <param name="Recipes">Danh sách công thức phân trang thuộc danh mục</param>
public record CategoryDetailResponseDto(
    CategoryDto Category,
    PaginatedResult<RecipeSummaryDto> Recipes);
