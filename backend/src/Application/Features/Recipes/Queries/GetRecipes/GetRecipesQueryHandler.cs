using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Queries.GetRecipes;

/// <summary>
/// HANDLER XỬ LÝ LẤY DANH SÁCH CÔNG THỨC (FR-RCP-001):
/// Trọng tâm:
/// 1. Phân quyền xem danh sách (Guest chỉ thấy Published; Author thấy thêm bài Draft/Archived của mình; Admin thấy tất cả).
/// 2. Lọc đa điều kiện: Danh mục, độ khó, thời gian nấu tối đa, tìm kiếm tiêu đề.
/// 3. Sắp xếp linh hoạt (Mới nhất, Cũ nhất, Nhanh nhất, Lượt xem, Yêu thích, Hot/Trending).
/// 4. Phân trang dữ liệu dạng Offset: CountAsync -> Skip -> Take.
/// </summary>
public class GetRecipesQueryHandler(
    IRecipeRepository recipeRepository,
    ICurrentUser currentUser)
    : IRequestHandler<GetRecipesQuery, PagedResult<RecipeSummaryDto>>
{
    public async Task<PagedResult<RecipeSummaryDto>> Handle(GetRecipesQuery request, CancellationToken cancellationToken)
    {
        // Khởi tạo truy vấn AsNoTracking (Chỉ đọc, tối ưu tốc độ và giải phóng RAM)
        var queryable = recipeRepository.GetQueryable()
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Include(r => r.Images)
            .AsNoTracking();

        // 1. PHÂN QUYỀN VÀ BỘ LỌC SỞ HỮU (AUTHORIZATION & OWNERSHIP FILTER)
        var userId = currentUser.UserId;
        var isAdmin = currentUser.IsAdmin;

        if (request.OnlyMine == true)
        {
            if (string.IsNullOrEmpty(userId))
            {
                // Chưa đăng nhập mà yêu cầu xem bài của mình -> Trả về danh sách rỗng
                queryable = queryable.Where(r => false);
            }
            else
            {
                // Chỉ lấy các bài viết do chính tài khoản này tạo ra
                queryable = queryable.Where(r => r.AuthorId == userId);
            }
        }
        else
        {
            if (isAdmin)
            {
                // Admin: Thấy toàn bộ công thức trong hệ thống (kể cả bản nháp Draft và Archived)
            }
            else if (string.IsNullOrEmpty(userId))
            {
                // Khách vãng lai: CHỈ ĐƯỢC THẤY các bài đã xuất bản công khai (Published)
                queryable = queryable.Where(r => r.Status == RecipeStatus.Published);
            }
            else
            {
                // Tác giả đăng nhập: Thấy bài Published của mọi người VÀ thấy bài Draft/Archived của chính mình
                queryable = queryable.Where(r => r.Status == RecipeStatus.Published || r.AuthorId == userId);
            }
        }

        if (request.Status.HasValue)
        {
            queryable = queryable.Where(r => r.Status == request.Status.Value);
        }

        // 2. BỘ LỌC TÌM KIẾM THEO TIÊU CHÍ (FILTERS)
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            queryable = queryable.Where(r => r.Title.ToLower().Contains(search) || r.Description.ToLower().Contains(search));
        }

        if (request.CategoryId.HasValue)
        {
            queryable = queryable.Where(r => r.CategoryId == request.CategoryId.Value);
        }

        if (request.Difficulty.HasValue)
        {
            queryable = queryable.Where(r => r.Difficulty == request.Difficulty.Value);
        }

        if (request.MaxTotalTimeMinutes.HasValue)
        {
            // Lọc theo tổng thời gian chuẩn bị + thời gian nấu
            queryable = queryable.Where(r => (r.PrepTimeMinutes + r.CookTimeMinutes) <= request.MaxTotalTimeMinutes.Value);
        }

        if (request.Days.HasValue && request.Days.Value > 0)
        {
            var cutoff = DateTime.UtcNow.AddDays(-request.Days.Value);
            queryable = queryable.Where(r => r.CreatedAt >= cutoff);
        }

        // 3. SẮP XẾP DỮ LIỆU (SORTING QUA C# SWITCH EXPRESSION)
        queryable = request.SortBy?.ToLower() switch
        {
            "oldest" => queryable.OrderBy(r => r.CreatedAt),
            "time_asc" => queryable.OrderBy(r => r.PrepTimeMinutes + r.CookTimeMinutes),
            "time_desc" => queryable.OrderByDescending(r => r.PrepTimeMinutes + r.CookTimeMinutes),
            "views_desc" => queryable.OrderByDescending(r => r.ViewCount).ThenByDescending(r => r.CreatedAt),
            "views_asc" => queryable.OrderBy(r => r.ViewCount).ThenByDescending(r => r.CreatedAt),
            "bookmarks_desc" => queryable.OrderByDescending(r => r.BookmarkCount).ThenByDescending(r => r.CreatedAt),
            "bookmarks_asc" => queryable.OrderBy(r => r.BookmarkCount).ThenByDescending(r => r.CreatedAt),
            "hot" or "trending" => queryable.OrderByDescending(r => (r.BookmarkCount * 5) + r.ViewCount).ThenByDescending(r => r.CreatedAt),
            _ => queryable.OrderByDescending(r => r.CreatedAt) // Mặc định: Bài viết mới nhất lên đầu
        };

        // 4. PHÂN TRANG (PAGINATION)
        // 4.1. Đếm tổng số bản ghi thỏa mãn điều kiện lọc
        var totalCount = await queryable.CountAsync(cancellationToken);

        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 10 : request.PageSize;

        // 4.2. Áp dụng Skip và Take để chỉ lấy đúng số lượng của trang hiện tại
        var items = await queryable
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RecipeSummaryDto(
                r.Id,
                r.Title,
                r.Slug,
                r.Description,
                r.PrepTimeMinutes + r.CookTimeMinutes,
                r.Servings,
                r.Difficulty,
                r.Status,
                r.Category != null ? r.Category.Name : string.Empty,
                r.AuthorId,
                r.Author != null ? r.Author.DisplayName : "Unknown Author",
                r.CreatedAt,
                r.Images.FirstOrDefault(i => i.IsPrimary) != null 
                    ? r.Images.FirstOrDefault(i => i.IsPrimary)!.ThumbnailUrl ?? r.Images.FirstOrDefault(i => i.IsPrimary)!.OriginalUrl 
                    : null,
                r.ViewCount,
                r.BookmarkCount
            ))
            .ToListAsync(cancellationToken);

        // 4.3. Đóng gói kết quả phân trang trả về cho Client
        return new PagedResult<RecipeSummaryDto>(items, totalCount, page, pageSize);
    }
}
