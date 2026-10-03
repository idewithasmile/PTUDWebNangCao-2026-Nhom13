using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Features.Auth.Services;

/// <summary>
/// Persist RefreshToken (lưu SHA-256 hash, không lưu raw).
/// Interface đặt ở Application để Handler không phụ thuộc Infrastructure (CONS-001).
/// </summary>
public interface IRefreshTokenStore
{
    Task<RefreshToken?> FindByHashAsync(string tokenHash, CancellationToken ct = default);
    Task AddAsync(RefreshToken token, CancellationToken ct = default);
    Task UpdateAsync(RefreshToken token, CancellationToken ct = default);
    Task<IReadOnlyList<RefreshToken>> ListActiveByUserAsync(string userId, CancellationToken ct = default);
    /// <summary>Thu hồi toàn bộ token còn hiệu lực của user (reuse detection).</summary>
    Task RevokeAllActiveByUserAsync(string userId, CancellationToken ct = default);
}

/// <summary>Thông tin user trích từ Google ID token đã xác thực.</summary>
public sealed record GoogleUserInfo(
    string Sub,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    bool EmailVerified);

/// <summary>Xác thực Google ID token qua Google SDK/endpoint. Trả null khi token sai/hết hạn.</summary>
public interface IGoogleTokenValidator
{
    Task<GoogleUserInfo?> ValidateAsync(string idToken, CancellationToken ct = default);
}

/// <summary>
/// Phát sự kiện chào mừng sau đăng ký (FR-JOB-001 WelcomeEmailJob qua Hangfire).
/// Implement ở Infrastructure, best-effort: không làm fail Register khi mail/job lỗi.
/// </summary>
public interface IWelcomeEmailDispatcher
{
    Task DispatchAsync(string email, string displayName, CancellationToken ct = default);
}
