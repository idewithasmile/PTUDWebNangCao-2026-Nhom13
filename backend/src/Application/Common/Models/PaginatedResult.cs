namespace CulinaryBlog.Application.Common.Models;

/// <summary>
/// Đại diện cho kết quả phân trang tiêu chuẩn (Paginated Result) của danh sách dữ liệu.
/// Kế thừa PagedResult để đảm bảo tính nhất quán và tương thích đa hình trong toàn bộ hệ thống.
/// </summary>
/// <typeparam name="T">Kiểu dữ liệu của các phần tử trong danh sách</typeparam>
/// <param name="Items">Danh sách các phần tử thuộc trang hiện tại</param>
/// <param name="TotalCount">Tổng số lượng phần tử trên toàn bộ các trang</param>
/// <param name="Page">Chỉ số trang hiện tại (bắt đầu từ 1)</param>
/// <param name="PageSize">Số lượng phần tử tối đa trên một trang</param>
public record PaginatedResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize) : PagedResult<T>(Items, TotalCount, Page, PageSize);
