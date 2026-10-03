using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe;

public record ArchiveRecipeCommand(Guid Id) : IRequest<RecipeDto>;
