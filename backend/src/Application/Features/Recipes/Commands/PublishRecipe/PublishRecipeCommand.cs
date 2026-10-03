using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe;

public record PublishRecipeCommand(Guid Id) : IRequest<RecipeDto>;
