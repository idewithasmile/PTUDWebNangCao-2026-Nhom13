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
    string? SortBy = null, // "newest", "oldest", "time_asc", "time_desc"
    int Page = 1,
    int PageSize = 10
) : IRequest<PagedResult<RecipeSummaryDto>>;
