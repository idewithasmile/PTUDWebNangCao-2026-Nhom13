namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// Abstraction cho dịch vụ gửi Email (MailKit / SMTP).
/// </summary>
public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);
    Task SendWelcomeEmailAsync(string toEmail, string displayName, CancellationToken ct = default);
}
