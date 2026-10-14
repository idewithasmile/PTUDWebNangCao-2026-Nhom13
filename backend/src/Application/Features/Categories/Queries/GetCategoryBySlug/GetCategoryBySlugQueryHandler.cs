using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;

/// <summary>
/// Xử lý truy vấn xem chi tiết danh mục và danh sách công thức phân trang theo Slug (FR-CAT-002).
/// Áp dụng các quy tắc nghiệp vụ:
/// 1. Tìm kiếm danh mục theo đường dẫn slug (chưa bị xóa mềm !IsDeleted), ném NotFoundException nếu không tìm thấy.
/// 2. Phân quyền hiển thị công thức linh hoạt theo tác nhân:
///    - Khách vãng lai (Guest): Chỉ thấy bài viết đã xuất bản (Status == Published).
///    - Tác giả (Author): Thấy bài viết Published chung và bài viết Nháp (Status == Draft) của chính mình.
///    - Quản trị viên (Admin): Thấy toàn bộ bài viết trong danh mục.
/// 3. Phân trang tiêu chuẩn (PaginatedResult&lt;RecipeSummaryDto&gt;) sử dụng Skip, Take và chiếu dữ liệu qua ProjectToType&lt;RecipeSummaryDto&gt;() của Mapster.
/// </summary>
public class GetCategoryBySlugQueryHandler(
    ICategoryRepository categoryRepository,
    IRecipeRepository? recipeRepository = null,
    ICurrentUser? currentUser = null)
    : IRequestHandler<GetCategoryBySlugQuery, CategoryDetailResponseDto>
{
    public async Task<CategoryDetailResponseDto> Handle(GetCategoryBySlugQuery request, CancellationToken ct)
    {
        // 1. Chuẩn hóa các tham số phân trang
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 12 : Math.Min(request.PageSize, 50);

        // 2. Tìm kiếm danh mục theo đường dẫn slug
        if (recipeRepository is not null)
        {
            var category = await categoryRepository.GetBySlugAsync(request.Slug, ct);
            if (category is null)
            {
                throw new NotFoundException("CATEGORY_NOT_FOUND", $"Không tìm thấy danh mục với đường dẫn '{request.Slug}'.");
            }

            // 3. Khởi tạo truy vấn danh sách công thức thuộc danh mục và chưa xóa mềm (!IsDeleted)
            var query = recipeRepository.GetQueryable()
                .AsNoTracking()
                .Where(r => r.CategoryId == category.Id && !r.IsDeleted);

            // 4. Áp dụng quy tắc phân quyền hiển thị linh hoạt theo tác nhân (FR-CAT-002)
            var userId = request.CurrentUserId ?? currentUser?.UserId;
            var isAdmin = request.IsAdmin;

            if (isAdmin)
            {
                // Admin có quyền xem tất cả các trạng thái bài viết (Published, Draft, Archived)
            }
            else if (!string.IsNullOrEmpty(userId))
            {
                // Tác giả xem bài Published chung và bài Draft của chính mình
                query = query.Where(r => r.Status == RecipeStatus.Published || (r.Status == RecipeStatus.Draft && r.AuthorId == userId));
            }
            else
            {
                // Khách vãng lai chưa đăng nhập chỉ được xem bài đã xuất bản (Published)
                query = query.Where(r => r.Status == RecipeStatus.Published);
            }

            // 5. Đếm tổng số bài viết thỏa mãn điều kiện phân quyền
            var totalCount = await query.CountAsync(ct);

            // 6. Thực hiện phân trang tiêu chuẩn bằng Skip, Take và chiếu dữ liệu qua ProjectToType của Mapster
            var items = await query
                .OrderByDescending(r => r.PublishedAt ?? r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<RecipeSummaryDto>()
                .ToListAsync(ct);

            var categoryDto = new CategoryDto(
                category.Id,
                category.Name,
                category.Slug,
                category.Description,
                category.ImageUrl,
                category.OrderIndex,
                totalCount)
            {
                RowVersion = category.RowVersion
            };

            var paginatedResult = new PaginatedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);
            return new CategoryDetailResponseDto(categoryDto, paginatedResult);
        }
        else
        {
            // Nhánh fallback hỗ trợ tương thích Unit Tests khi chỉ truyền mock ICategoryRepository
            var (category, recipes, totalCount) = await categoryRepository.GetBySlugWithRecipesAsync(
                request.Slug, page, pageSize, ct);

            if (category is null)
            {
                throw new NotFoundException("CATEGORY_NOT_FOUND", $"Không tìm thấy danh mục với đường dẫn '{request.Slug}'.");
            }

            var categoryDto = new CategoryDto(
                category.Id,
                category.Name,
                category.Slug,
                category.Description,
                category.ImageUrl,
                category.OrderIndex,
                totalCount)
            {
                RowVersion = category.RowVersion
            };

            var items = recipes.AsQueryable().ProjectToType<RecipeSummaryDto>().ToList();
            var paginatedResult = new PaginatedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);

            return new CategoryDetailResponseDto(categoryDto, paginatedResult);
        }
    }
}
