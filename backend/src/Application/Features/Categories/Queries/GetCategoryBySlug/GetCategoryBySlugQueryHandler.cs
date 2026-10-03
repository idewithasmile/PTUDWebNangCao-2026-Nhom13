using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;

public class GetCategoryBySlugQueryHandler(ICategoryRepository categoryRepository)
    : IRequestHandler<GetCategoryBySlugQuery, CategoryDetailDto>
{
    public async Task<CategoryDetailDto> Handle(GetCategoryBySlugQuery request, CancellationToken ct)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 12 : Math.Min(request.PageSize, 50);

        var (category, recipes, totalCount) = await categoryRepository.GetBySlugWithRecipesAsync(
            request.Slug, page, pageSize, ct);

        if (category is null)
        {
            throw new EntityNotFoundException("CATEGORY_NOT_FOUND", $"Category with slug '{request.Slug}' was not found.");
        }

        var categoryDto = new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.OrderIndex,
            totalCount)
        {
            RowVersion = category.RowVersion
        };

        var recipeDtos = recipes.Select(r =>
        {
            var primaryImage = r.Images.FirstOrDefault(img => img.IsPrimary) ?? r.Images.FirstOrDefault();
            var imageUrl = primaryImage?.ThumbnailUrl ?? primaryImage?.MediumUrl ?? primaryImage?.OriginalUrl;

            return new RecipeSummaryDto(
                r.Id,
                r.Title,
                r.Slug,
                r.Description,
                r.PrepTimeMinutes,
                r.CookTimeMinutes,
                r.Servings,
                r.Difficulty,
                imageUrl,
                r.Author?.DisplayName,
                r.PublishedAt ?? r.CreatedAt);
        }).ToList();

        var pagedRecipes = new PagedResult<RecipeSummaryDto>(recipeDtos, totalCount, page, pageSize);

        return new CategoryDetailDto(categoryDto, pagedRecipes);
    }
}
