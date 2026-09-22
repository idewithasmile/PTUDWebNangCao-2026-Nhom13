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

public class NotFoundException : AppException
{
    public NotFoundException(string errorCode, string message) : base(errorCode, message, 404) { }
}

public class ConflictException : AppException
{
    public ConflictException(string errorCode, string message) : base(errorCode, message, 409) { }
}
