namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Lớp cơ sở cho tất cả các ngoại lệ phát sinh trong tầng Domain.
/// Tuân thủ CONS-001: Chỉ sử dụng .NET BCL, không phụ thuộc NuGet ngoài.
/// Giữ ErrorCode (Auth/Category) đồng thời hỗ trợ khởi tạo trực tiếp với message
/// cho Module Recipe (incoming branch).
/// </summary>
public class DomainException : Exception
{
    public string ErrorCode { get; }

    public DomainException(string message) : base(message)
    {
        ErrorCode = "DOMAIN_ERROR";
    }

    public DomainException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = "DOMAIN_ERROR";
    }

    protected DomainException(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }

    protected DomainException(string errorCode, string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}
