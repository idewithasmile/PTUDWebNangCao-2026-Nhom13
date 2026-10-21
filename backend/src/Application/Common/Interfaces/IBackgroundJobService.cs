using System.Linq.Expressions;

namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// Abstraction cho background job runner (Hangfire) tuân thủ CONS-001 (không phụ thuộc Hangfire trực tiếp trong Application).
/// </summary>
public interface IBackgroundJobService
{
    string Enqueue(Expression<Action> methodCall);
    string Enqueue(Expression<Func<Task>> methodCall);
    string Enqueue<T>(Expression<Action<T>> methodCall);
    string Enqueue<T>(Expression<Func<T, Task>> methodCall);

    void AddOrUpdateRecurringJob<T>(string recurringJobId, Expression<Func<T, Task>> methodCall, string cronExpression);
}
