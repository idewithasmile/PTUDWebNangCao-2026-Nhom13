using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetRecipes;

public record GetRecipesQuery(
    string? SearchTerm = null,
    Guid? CategoryId = null,
    RecipeDifficulty? Difficulty = null,
    int? MaxTotalTimeMinutes = null,
    string? SortBy = null, // "newest", "oldest", "time_asc", "time_desc", "views_desc", "views_asc", "bookmarks_desc", "bookmarks_asc", "hot", "trending"
    int Page = 1,
    int PageSize = 10,
    bool? OnlyMine = false,
    RecipeStatus? Status = null,
    int? Days = null // Lọc các công thức đăng trong N ngày gần nhất (ví dụ days=7 cho tuần này)
) : IRequest<PagedResult<RecipeSummaryDto>>;
