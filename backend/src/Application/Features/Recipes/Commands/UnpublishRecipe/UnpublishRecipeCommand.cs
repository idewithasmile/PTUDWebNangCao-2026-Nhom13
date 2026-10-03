using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UnpublishRecipe;

public record UnpublishRecipeCommand(Guid Id) : IRequest<RecipeDto>;
