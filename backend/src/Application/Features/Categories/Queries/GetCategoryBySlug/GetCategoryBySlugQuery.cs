using CulinaryBlog.Application.Features.Categories.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;

/// <summary>
/// Query lấy chi tiết danh mục và danh sách công thức phân trang theo Slug (FR-CAT-002).
/// Hỗ trợ thông tin người dùng và vai trò Admin để áp dụng phân quyền hiển thị bài viết linh hoạt:
/// - Khách vãng lai (Guest): chỉ thấy bài Published
/// - Tác giả (Author): thấy bài Published chung và bài Draft của chính mình
/// - Quản trị viên (Admin): thấy toàn bộ bài viết
/// </summary>
/// <param name="Slug">Đường dẫn thân thiện định danh danh mục</param>
/// <param name="Page">Chỉ số trang (mặc định: 1)</param>
/// <param name="PageSize">Kích thước trang (mặc định: 12, tối đa: 50)</param>
/// <param name="CurrentUserId">Mã định danh người dùng đăng nhập (nếu có)</param>
/// <param name="IsAdmin">Cờ xác định vai trò Admin</param>
public record GetCategoryBySlugQuery(
    string Slug,
    int Page = 1,
    int PageSize = 12,
    string? CurrentUserId = null,
    bool IsAdmin = false
) : IRequest<CategoryDetailResponseDto>;
