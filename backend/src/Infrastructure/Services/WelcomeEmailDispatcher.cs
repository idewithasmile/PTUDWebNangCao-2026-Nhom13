using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Infrastructure.Jobs;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Bridge class giữ tương thích ngược với các queued jobs cũ trong Hangfire database (nếu có).
/// </summary>
public sealed class AuthWelcomeEmailJob(IWelcomeEmailJob welcomeEmailJob)
{
    public Task SendAsync(string email, string displayName, CancellationToken ct = default) =>
        welcomeEmailJob.ExecuteAsync(email, displayName, ct);
}

/// <summary>
/// Enqueue WelcomeEmailJob qua IBackgroundJobService (hoặc IBackgroundJobClient), best-effort (không throw về handler).
/// </summary>
public sealed class WelcomeEmailDispatcher(
    IBackgroundJobService jobs,
    ILogger<WelcomeEmailDispatcher> logger) : IWelcomeEmailDispatcher
{
    public Task DispatchAsync(string email, string displayName, CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<IWelcomeEmailJob>(j => j.ExecuteAsync(email, displayName, CancellationToken.None));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "FR-JOB-001: Hangfire enqueue WelcomeEmail failed for {Email}", email);
        }

        return Task.CompletedTask;
    }
}
