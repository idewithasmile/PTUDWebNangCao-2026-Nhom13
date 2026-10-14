using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategories;

/// <summary>
/// Query lấy danh sách tất cả các danh mục món ăn đang hoạt động (FR-CAT-001).
/// Triển khai ICacheable với khóa "categories:all" và TTL 60 phút trên Redis Cache để đảm bảo Backend Stateless.
/// </summary>
public record GetCategoriesQuery : IRequest<List<CategoryDto>>, ICacheable
{
    public string CacheKey => "categories:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(60); // TTL 60 phút theo đặc tả chuẩn FR-CAT-001
}
