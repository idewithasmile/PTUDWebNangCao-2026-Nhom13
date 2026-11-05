using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipe;

public record DeleteRecipeCommand(Guid Id) : IRequest<Unit>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["categories:all"];
}
