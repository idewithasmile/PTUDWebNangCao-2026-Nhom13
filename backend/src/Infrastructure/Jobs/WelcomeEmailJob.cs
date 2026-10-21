using CulinaryBlog.Application.Common.Interfaces;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>
/// FR-JOB-001: Welcome Email Job (Fire-and-forget).
/// Gửi email HTML chào mừng sau khi người dùng đăng ký thành công.
/// Retry policy: Thử lại 3 lần với khoảng cách 1 phút, 5 phút, 30 phút.
/// </summary>
public class WelcomeEmailJob : IWelcomeEmailJob
{
    private readonly IEmailService _emailService;
    private readonly ILogger<WelcomeEmailJob> _logger;

    public WelcomeEmailJob(IEmailService emailService, ILogger<WelcomeEmailJob> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 300, 1800 }, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(string email, string displayName, CancellationToken ct = default)
    {
        _logger.LogInformation("FR-JOB-001: Bắt đầu xử lý WelcomeEmailJob cho Email: {Email}, DisplayName: {DisplayName}", email, displayName);

        try
        {
            await _emailService.SendWelcomeEmailAsync(email, displayName, ct);
            _logger.LogInformation("FR-JOB-001: Gửi Welcome Email thành công cho {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "FR-JOB-001: Gửi Welcome Email thất bại cho Email: {Email}, DisplayName: {DisplayName}", email, displayName);
            throw; // Hangfire cần bắt exception để kích hoạt retry theo DelaysInSeconds
        }
    }
}
