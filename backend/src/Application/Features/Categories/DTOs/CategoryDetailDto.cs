using CulinaryBlog.Application.Common.Models;

namespace CulinaryBlog.Application.Features.Categories.DTOs;

/// <summary>
/// DTO chi tiết danh mục, kế thừa CategoryDetailResponseDto để đảm bảo tính tương thích ngược cho hệ thống.
/// </summary>
public record CategoryDetailDto(
    CategoryDto Category,
    PaginatedResult<RecipeSummaryDto> Recipes)
    : CategoryDetailResponseDto(Category, Recipes);
