using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Domain.Enums;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;

/// <summary>
/// Truy vấn tìm kiếm toàn văn bản công thức nấu ăn (FR-SRCH-001).
/// Hỗ trợ tìm kiếm tiếng Việt không dấu sử dụng PostgreSQL tsvector, unaccent và ts_rank,
/// kết hợp lọc theo danh mục, độ khó, phân quyền người dùng và phân trang dữ liệu chuẩn PaginatedResult.
/// </summary>
/// <param name="SearchTerm">Từ khóa tìm kiếm (tối thiểu 2 ký tự)</param>
/// <param name="Page">Chỉ số trang (mặc định: 1)</param>
/// <param name="PageSize">Số lượng bài viết trên mỗi trang (mặc định: 10)</param>
/// <param name="CategoryId">Mã danh mục cần lọc (tùy chọn)</param>
/// <param name="Difficulty">Độ khó công thức cần lọc (tùy chọn)</param>
/// <param name="CurrentUserId">Mã định danh người dùng đăng nhập (nếu có)</param>
/// <param name="IsAdmin">Cờ xác định quyền Quản trị viên (Admin)</param>
public record SearchRecipesQuery(
    string SearchTerm,
    int Page = 1,
    int PageSize = 10,
    Guid? CategoryId = null,
    RecipeDifficulty? Difficulty = null,
    string? CurrentUserId = null,
    bool IsAdmin = false
) : IRequest<PaginatedResult<RecipeSummaryDto>>;
