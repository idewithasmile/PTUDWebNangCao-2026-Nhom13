using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>, ICacheable
{
    public string CacheKey => "categories:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30); // TTL 30 phút theo SPEC
}
