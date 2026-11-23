namespace CulinaryBlog.Domain.Common;

/// <summary>
/// LỚP THỰC THỂ CƠ SỞ (BASE ENTITY):
/// Mọi bảng trong CSDL (Recipe, Category, Review...) đều kế thừa từ class này.
/// Đảm bảo tính nhất quán: Tự động có Id (UUID), thời gian tạo/sửa, cờ xóa mềm và con dấu phiên bản.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>Khóa chính duy nhất (UUID/GUID) tự động sinh mới</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Thời điểm tạo bản ghi theo chuẩn giờ quốc tế UTC</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Thời điểm cập nhật bản ghi gần nhất</summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>Cờ xóa mềm: true = Đã xóa (ẩn khỏi người dùng), false = Còn hoạt động</summary>
    public bool IsDeleted { get; set; } = false;

    /// <summary>
    /// Con dấu phiên bản dữ liệu (Concurrency Token):
    /// Dùng cho Optimistic Concurrency Control, tự động nhảy số khi có thao tác UPDATE để chống ghi đè đồng thời.
    /// </summary>
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    /// <summary>
    /// Hàm Xóa mềm (Soft Delete): Đánh dấu IsDeleted = true thay vì xóa vĩnh viễn khỏi Database
    /// </summary>
    public virtual void SoftDelete()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Hàm Khôi phục bản ghi đã xóa mềm
    /// </summary>
    public virtual void Restore()
    {
        IsDeleted = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
