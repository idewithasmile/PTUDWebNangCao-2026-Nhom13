using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategories;

/// <summary>
/// Xử lý truy vấn lấy danh sách tất cả các danh mục món ăn (FR-CAT-001).
/// Tích hợp cơ chế bộ nhớ đệm phân tán Redis (ICacheService) với khóa "categories:all" và TTL 60 phút,
/// đảm bảo Backend hoàn toàn phi trạng thái (Stateless) và tối ưu hóa hiệu năng truy vấn CSDL PostgreSQL.
/// </summary>
public class GetCategoriesQueryHandler(
    ICategoryRepository categoryRepository,
    ICacheService? cacheService = null)
    : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    private const string CacheKey = "categories:all";
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(60); // 60 phút theo đặc tả FR-CAT-001

    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken ct)
    {
        // 1. Kiểm tra dữ liệu trong bộ nhớ đệm phân tán Redis (Cache Hit)
        if (cacheService is not null)
        {
            var cachedCategories = await cacheService.GetAsync<List<CategoryDto>>(CacheKey, ct);
            if (cachedCategories is not null)
            {
                return cachedCategories;
            }
        }

        // 2. Cache Miss: Truy vấn CSDL PostgreSQL lọc danh mục chưa xóa mềm (!IsDeleted)
        // và tính toán chính xác tổng số công thức đã xuất bản (Status == Published && !IsDeleted)
        var categoriesWithCount = await categoryRepository.GetAllWithRecipeCountAsync(ct);

        var result = categoriesWithCount
            .Select(c => new CategoryDto(
                c.Category.Id,
                c.Category.Name,
                c.Category.Slug,
                c.Category.Description,
                c.Category.ImageUrl,
                c.Category.OrderIndex,
                c.RecipeCount)
            {
                RowVersion = c.Category.RowVersion
            })
            .ToList();

        // 3. Lưu trữ kết quả vào Redis Distributed Cache với TTL 60 phút để Backend Stateless
        if (cacheService is not null)
        {
            await cacheService.SetAsync(CacheKey, result, CacheTtl, ct);
        }

        return result;
    }
}
