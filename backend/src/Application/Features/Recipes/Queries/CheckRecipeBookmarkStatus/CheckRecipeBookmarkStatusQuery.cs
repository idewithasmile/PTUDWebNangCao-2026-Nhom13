using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.CheckRecipeBookmarkStatus;

public record CheckRecipeBookmarkStatusQuery(Guid RecipeId) : IRequest<bool>;
