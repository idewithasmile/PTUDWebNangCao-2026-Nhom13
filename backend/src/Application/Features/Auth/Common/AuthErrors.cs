// Mã lỗi RFC 7807 `type` cho module Auth — format MODULE_REASON (CLAUDE.md mục 4).
// Đối chiếu SRS Chương 8.1 + Phụ lục A/B và SPEC Mâu thuẫn 6:
// Validation → 400, Conflict → 409, Business rule → 422.
namespace CulinaryBlog.Application.Features.Auth.Common;

public static class AuthErrors
{
    public const string EmailExists = "AUTH_EMAIL_EXISTS";                       // 409
    public const string UsernameExists = "AUTH_USERNAME_EXISTS";                 // 409
    public const string InvalidCredentials = "AUTH_INVALID_CREDENTIALS";         // 401
    public const string AccountLocked = "AUTH_ACCOUNT_LOCKED";                   // 423
    public const string AccountDisabled = "AUTH_ACCOUNT_DISABLED";               // 403
    public const string GoogleTokenInvalid = "AUTH_GOOGLE_TOKEN_INVALID";       // 400
    public const string RefreshTokenExpired = "AUTH_REFRESH_TOKEN_EXPIRED";     // 401
    public const string RefreshTokenRevoked = "AUTH_REFRESH_TOKEN_REVOKED";     // 401
    public const string UserNotFound = "AUTH_USER_NOT_FOUND";                   // 404
}
