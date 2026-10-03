using CulinaryBlog.Application.Features.Auth.Services;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Job chào mừng (FR-JOB-001). Thân job hiện tại chỉ log — chủ module FR-JOB sẽ thay bằng
/// gửi mail thật qua IEmailService. Tách class riêng để Hangfire serialize expression ổn định.
/// </summary>
public sealed class AuthWelcomeEmailJob(ILogger<AuthWelcomeEmailJob> logger)
{
    public Task SendAsync(string email, string displayName, CancellationToken ct = default)
    {
        logger.LogInformation("Welcome email queued for {Email} ({DisplayName})", email, displayName);
        return Task.CompletedTask;
    }
}

/// <summary>Enqueue WelcomeEmailJob qua Hangfire, best-effort (không throw về handler).</summary>
public sealed class WelcomeEmailDispatcher(
    IBackgroundJobClient jobs,
    ILogger<WelcomeEmailDispatcher> logger) : IWelcomeEmailDispatcher
{
    public Task DispatchAsync(string email, string displayName, CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<AuthWelcomeEmailJob>(j => j.SendAsync(email, displayName, CancellationToken.None));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Hangfire enqueue WelcomeEmail failed for {Email}", email);
        }

        return Task.CompletedTask;
    }
}
