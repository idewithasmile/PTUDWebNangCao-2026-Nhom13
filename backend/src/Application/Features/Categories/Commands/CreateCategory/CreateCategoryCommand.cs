using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(
    string Name,
    string? Description = null,
    string? ImageUrl = null,
    int OrderIndex = 0) : IRequest<CategoryDto>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => ["categories:all"];
}
