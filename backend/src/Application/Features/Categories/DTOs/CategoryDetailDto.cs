using CulinaryBlog.Application.Common.Models;

namespace CulinaryBlog.Application.Features.Categories.DTOs;

public record CategoryDetailDto(
    CategoryDto Category,
    PagedResult<RecipeSummaryDto> Recipes);
