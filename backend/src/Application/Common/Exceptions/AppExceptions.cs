using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Application.Common.Exceptions;

public class AppException : Exception
{
    public string ErrorCode { get; }
    public int StatusCode { get; }

    public AppException(string errorCode, string message, int statusCode = 400) : base(message)
    {
        ErrorCode = errorCode;
        StatusCode = statusCode;
    }
}

public class ValidationException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("VALIDATION_ERROR", "One or more validation failures occurred.", 400) // Theo SPEC.md HTTP 400
    {
        Errors = errors;
    }
}

/// <summary>
/// Ngoại lệ ném ra khi không tìm thấy tài nguyên.
/// Kế thừa EntityNotFoundException để đảm bảo tính tương thích với cả tầng Domain và Application.
/// </summary>
public class NotFoundException : EntityNotFoundException
{
    public int StatusCode => 404;

    public NotFoundException(string errorCode, string message) : base(errorCode, message) { }
}

public class ConflictException : AppException
{
    public ConflictException(string errorCode, string message) : base(errorCode, message, 409) { }
}

public class ForbiddenException : AppException
{
    public ForbiddenException(string errorCode, string message) : base(errorCode, message, 403) { }
}
