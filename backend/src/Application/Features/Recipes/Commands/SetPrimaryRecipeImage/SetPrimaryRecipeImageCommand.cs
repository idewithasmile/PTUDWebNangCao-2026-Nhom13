using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryRecipeImage;

public record SetPrimaryRecipeImageCommand(Guid RecipeId, Guid ImageId) : IRequest<RecipeImageDto>;
