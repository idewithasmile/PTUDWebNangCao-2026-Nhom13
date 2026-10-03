// FR-AUTH DTOs — response model riêng biệt, không expose Entity (CLAUDE.md mục 4).
// JSON serialize camelCase ở tầng Presentation (Minimal API JsonSerializerOptions.Web).
namespace CulinaryBlog.Application.Features.Auth.Dtos;

/// <summary>Profile công khai của user — dùng cho FR-AUTH-006/007 và lồng trong AuthResponse.</summary>
public sealed record UserProfileDto(
    string Id,
    string Email,
    string UserName,
    string DisplayName,
    string? AvatarUrl,
    string? Bio,
    IReadOnlyList<string> Roles,
    DateTime CreatedAt);

/// <summary>Kết quả xác thực: access token trả trong JSON body, refresh token raw
/// chỉ dùng nội bộ để endpoint set HttpOnly Cookie (SPEC Mâu thuẫn 3 — không trả qua body).</summary>
public sealed record AuthResultDto(
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt,
    UserProfileDto User);
