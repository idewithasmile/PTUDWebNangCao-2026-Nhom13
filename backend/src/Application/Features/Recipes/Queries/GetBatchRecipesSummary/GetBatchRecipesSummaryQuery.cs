using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetBatchRecipesSummary;

public record GetBatchRecipesSummaryQuery(List<Guid> RecipeIds) : IRequest<List<RecipeSummaryDto>>;
