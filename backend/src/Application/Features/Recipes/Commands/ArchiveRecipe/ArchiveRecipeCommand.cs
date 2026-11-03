using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe;

public record ArchiveRecipeCommand(Guid Id) : IRequest<RecipeDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["categories:all"];
}
