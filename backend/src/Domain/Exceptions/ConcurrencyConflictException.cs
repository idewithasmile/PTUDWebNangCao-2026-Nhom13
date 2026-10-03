namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Ngoại lệ ném ra khi phát hiện xung đột cập nhật đồng thời (Optimistic Concurrency / RowVersion mismatch).
/// Tuân thủ CONS-004 / CONS-006 -> Ánh xạ thành HTTP 409 Conflict.
/// </summary>
public class ConcurrencyConflictException : DomainException
{
    public ConcurrencyConflictException(string message = "Thực thể đã bị thay đổi hoặc xóa bởi người dùng khác trong khi bạn đang thao tác.")
        : base("CONCURRENCY_CONFLICT", message)
    {
    }

    public ConcurrencyConflictException(string errorCode, string message)
        : base(errorCode, message)
    {
    }
}
