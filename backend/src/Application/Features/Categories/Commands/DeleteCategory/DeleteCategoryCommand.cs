using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["categories:all"];
}
