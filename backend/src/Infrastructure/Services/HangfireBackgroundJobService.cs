using System.Linq.Expressions;
using CulinaryBlog.Application.Common.Interfaces;
using Hangfire;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Hiện thực IBackgroundJobService bọc quanh thư viện Hangfire, bảo đảm Clean Architecture (CONS-001).
/// </summary>
public class HangfireBackgroundJobService(
    IBackgroundJobClient backgroundJobClient,
    IRecurringJobManager recurringJobManager) : IBackgroundJobService
{
    public string Enqueue(Expression<Action> methodCall) =>
        backgroundJobClient.Enqueue(methodCall);

    public string Enqueue(Expression<Func<Task>> methodCall) =>
        backgroundJobClient.Enqueue(methodCall);

    public string Enqueue<T>(Expression<Action<T>> methodCall) =>
        backgroundJobClient.Enqueue(methodCall);

    public string Enqueue<T>(Expression<Func<T, Task>> methodCall) =>
        backgroundJobClient.Enqueue(methodCall);

    public void AddOrUpdateRecurringJob<T>(string recurringJobId, Expression<Func<T, Task>> methodCall, string cronExpression) =>
        recurringJobManager.AddOrUpdate(recurringJobId, methodCall, cronExpression, new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });
}
