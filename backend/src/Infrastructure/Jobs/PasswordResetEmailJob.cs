using CulinaryBlog.Application.Common.Interfaces;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public class PasswordResetEmailJob(
    IEmailService emailService,
    ILogger<PasswordResetEmailJob> logger) : IPasswordResetEmailJob
{
    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 300, 1800 }, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(string email, string displayName, string resetUrl, CancellationToken ct = default)
    {
        logger.LogInformation("FR-AUTH-008: Bắt đầu gửi email đặt lại mật khẩu cho {Email}", email);
        await emailService.SendPasswordResetEmailAsync(email, displayName, resetUrl, ct);
    }
}
