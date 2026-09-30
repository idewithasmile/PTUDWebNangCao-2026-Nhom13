namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Ngoại lệ ném ra khi không tìm thấy thực thể theo Id hoặc Slug.
/// Sẽ được GlobalExceptionMiddleware ánh xạ thành HTTP 404 Not Found (RFC 7807).
/// </summary>
public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string errorCode, string message)
        : base(errorCode, message)
    {
    }

    public static EntityNotFoundException ForEntity(string entityName, object key)
        => new($"{entityName.ToUpperInvariant()}_NOT_FOUND", $"{entityName} with key '{key}' was not found.");
}
