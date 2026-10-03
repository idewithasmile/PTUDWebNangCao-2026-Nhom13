namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Lớp cơ sở trừu tượng cho tất cả các ngoại lệ phát sinh trong tầng Domain.
/// Tuân thủ CONS-001: Chỉ sử dụng .NET BCL, không phụ thuộc NuGet ngoài.
/// </summary>
public abstract class DomainException : Exception
{
    public string ErrorCode { get; }

    protected DomainException(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }

    protected DomainException(string errorCode, string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}
