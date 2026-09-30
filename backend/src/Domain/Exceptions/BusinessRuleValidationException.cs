namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Ngoại lệ ném ra khi vi phạm các quy tắc nghiệp vụ cốt lõi trong tầng Domain.
/// Sẽ được ánh xạ thành HTTP 422 Unprocessable Entity.
/// </summary>
public class BusinessRuleValidationException : DomainException
{
    public BusinessRuleValidationException(string message)
        : base("BUSINESS_RULE_VIOLATION", message)
    {
    }

    public BusinessRuleValidationException(string errorCode, string message)
        : base(errorCode, message)
    {
    }
}
