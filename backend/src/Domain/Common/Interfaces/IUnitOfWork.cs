namespace CulinaryBlog.Domain.Common.Interfaces;

/// <summary>
/// Hợp đồng Unit of Work đảm bảo tính nguyên tử (Atomicity) của các thao tác ghi dữ liệu.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
