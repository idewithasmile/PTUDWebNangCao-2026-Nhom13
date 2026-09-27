using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategories;

public class GetCategoriesQueryHandler(ICategoryRepository categoryRepository)
    : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken ct)
    {
        var categoriesWithCount = await categoryRepository.GetAllWithRecipeCountAsync(ct);

        return categoriesWithCount
            .Select(c => new CategoryDto(
                c.Category.Id,
                c.Category.Name,
                c.Category.Slug,
                c.Category.Description,
                c.Category.ImageUrl,
                c.Category.OrderIndex,
                c.RecipeCount)
            {
                RowVersion = c.Category.RowVersion
            })
            .ToList();
    }
}
