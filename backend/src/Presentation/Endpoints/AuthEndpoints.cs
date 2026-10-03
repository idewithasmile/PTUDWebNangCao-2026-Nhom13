using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Auth.Commands.GoogleLogin;
using CulinaryBlog.Application.Features.Auth.Commands.Login;
using CulinaryBlog.Application.Features.Auth.Commands.Logout;
using CulinaryBlog.Application.Features.Auth.Commands.RefreshToken;
using CulinaryBlog.Application.Features.Auth.Commands.Register;
using CulinaryBlog.Application.Features.Auth.Commands.UpdateProfile;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Queries.GetMe;
using MediatR;

namespace CulinaryBlog.API.Endpoints;

// FR-AUTH-001 → FR-AUTH-007 (Member A). CONS-008: không validate trong handler —
// mọi rule nằm ở FluentValidation + ValidationBehavior. Lỗi chuẩn RFC 7807 qua middleware.
public static class AuthEndpoints
{
    public const string RefreshCookieName = "refreshToken";

    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        // FR-AUTH-001: Đăng ký — 201, auto-login + HttpOnly refresh cookie.
        group.MapPost("/register", async (
            RegisterRequest body, ISender sender, HttpContext http) =>
        {
            var result = await sender.Send(new RegisterCommand(
                body.Email, body.Password, body.UserName, body.DisplayName,
                http.Connection.RemoteIpAddress?.ToString()));
            SetRefreshCookie(http, result.RefreshToken, result.RefreshTokenExpiresAt);
            return Results.Json(ToAuthResponse(result.AccessToken, result.User),
                statusCode: StatusCodes.Status201Created);
        });

        // FR-AUTH-002: Đăng nhập — 200 (sai pass 401, lockout 423, bị ban 403).
        group.MapPost("/login", async (
            LoginRequest body, ISender sender, HttpContext http) =>
        {
            var result = await sender.Send(new LoginCommand(
                body.Email, body.Password,
                http.Connection.RemoteIpAddress?.ToString()));
            SetRefreshCookie(http, result.RefreshToken, result.RefreshTokenExpiresAt);
            return Results.Json(ToAuthResponse(result.AccessToken, result.User));
        });

        // FR-AUTH-003: Google OAuth — 200 (token sai 400 AUTH_GOOGLE_TOKEN_INVALID).
        group.MapPost("/google", async (
            GoogleRequest body, ISender sender, HttpContext http) =>
        {
            var result = await sender.Send(new GoogleLoginCommand(
                body.IdToken, http.Connection.RemoteIpAddress?.ToString()));
            SetRefreshCookie(http, result.RefreshToken, result.RefreshTokenExpiresAt);
            return Results.Json(ToAuthResponse(result.AccessToken, result.User));
        });

        // FR-AUTH-004: Refresh — đọc token từ HttpOnly Cookie (SPEC Mâu thuẫn 3).
        group.MapPost("/refresh", async (ISender sender, HttpContext http) =>
        {
            var raw = http.Request.Cookies[RefreshCookieName];
            if (string.IsNullOrWhiteSpace(raw))
                throw new AppException(AuthErrors.RefreshTokenExpired,
                    "Refresh token is expired or does not exist.", 401);

            var result = await sender.Send(new RefreshTokenCommand(
                raw, http.Connection.RemoteIpAddress?.ToString()));
            SetRefreshCookie(http, result.RefreshToken, result.RefreshTokenExpiresAt);
            return Results.Json(ToAuthResponse(result.AccessToken, result.User));
        });

        // FR-AUTH-005: Đăng xuất — 204, idempotent.
        group.MapPost("/logout", async (ISender sender, HttpContext http) =>
        {
            await sender.Send(new LogoutCommand(
                GetUserId(http), http.Request.Cookies[RefreshCookieName]));
            ClearRefreshCookie(http);
            return Results.NoContent();
        }).RequireAuthorization();

        // FR-AUTH-006: Xem profile — 200 { id, email, userName, displayName, avatarUrl, bio, roles, createdAt }.
        group.MapGet("/me", async (ISender sender, HttpContext http) =>
            Results.Json(await sender.Send(new GetMeQuery(GetUserId(http)))))
            .RequireAuthorization();

        // FR-AUTH-007: Cập nhật profile — 200. Cấm đổi email/userName (contract không có 2 field này).
        group.MapPatch("/me", async (
            UpdateProfileRequest body, ISender sender, HttpContext http) =>
            Results.Json(await sender.Send(new UpdateProfileCommand(
                GetUserId(http), body.DisplayName, body.AvatarUrl, body.Bio))))
            .RequireAuthorization();

        return group;
    }

    private static string GetUserId(HttpContext http) =>
        http.User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? http.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
        ?? throw new AppException(AuthErrors.UserNotFound, "User not found.", 404);

    private static void SetRefreshCookie(HttpContext http, string rawToken, DateTime expiresAt)
    {
        // SPEC Mâu thuẫn 3: HttpOnly + Secure + SameSite=Strict. Refresh 7 ngày (CONS-004).
        // Local dev http: đặt Auth:SecureCookies=false trong appsettings.Development.json.
        var secure = http.RequestServices.GetRequiredService<IConfiguration>()
            .GetValue("Auth:SecureCookies", true);
        http.Response.Cookies.Append(RefreshCookieName, rawToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = new DateTimeOffset(expiresAt),
            MaxAge = TimeSpan.FromDays(7)
        });
    }

    private static void ClearRefreshCookie(HttpContext http)
    {
        http.Response.Cookies.Delete(RefreshCookieName);
        http.Response.Cookies.Append(RefreshCookieName, string.Empty, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTimeOffset.UnixEpoch
        });
    }

    private static object ToAuthResponse(string accessToken, object user) =>
        new { accessToken, user };
}

// Presentation contracts — tách khỏi Application Command để đổi API không vỡ handler.
public sealed record RegisterRequest(string Email, string Password, string UserName, string DisplayName);
public sealed record LoginRequest(string Email, string Password);
public sealed record GoogleRequest(string IdToken);
public sealed record UpdateProfileRequest(string? DisplayName, string? AvatarUrl, string? Bio);
