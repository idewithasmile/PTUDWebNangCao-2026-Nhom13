using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetMyBookmarks;

public record GetMyBookmarksQuery(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    string? Category = null,
    string? SortBy = null) : IRequest<PagedResult<RecipeSummaryDto>>;
