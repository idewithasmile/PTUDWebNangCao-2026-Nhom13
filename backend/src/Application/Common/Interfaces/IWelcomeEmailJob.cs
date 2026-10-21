namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// FR-JOB-001: Job gửi email chào mừng bất đồng bộ.
/// </summary>
public interface IWelcomeEmailJob
{
    Task ExecuteAsync(string email, string displayName, CancellationToken ct = default);
}
