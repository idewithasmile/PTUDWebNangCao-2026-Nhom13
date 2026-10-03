using System.Text.Json;
using CulinaryBlog.Application.Features.Auth.Services;
using Microsoft.Extensions.Configuration;

namespace CulinaryBlog.Infrastructure.Services;

/// <summary>
/// Xác thực Google ID token qua endpoint tokeninfo của Google.
/// Trả null khi token sai/hết hạn/audience lệch → handler map sang 400 AUTH_GOOGLE_TOKEN_INVALID.
/// </summary>
public sealed class GoogleTokenValidator(HttpClient http, IConfiguration config) : IGoogleTokenValidator
{
    public async Task<GoogleUserInfo?> ValidateAsync(string idToken, CancellationToken ct = default)
    {
        try
        {
            using var res = await http.GetAsync(
                $"https://oauth2.googleapis.com/tokeninfo?id_token={Uri.EscapeDataString(idToken)}", ct);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = await JsonDocument.ParseAsync(await res.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
            var root = doc.RootElement;

            var aud = root.TryGetProperty("aud", out var a) ? a.GetString() : null;
            var expectedAud = config["Google:ClientId"];
            if (!string.IsNullOrWhiteSpace(expectedAud) && !string.Equals(aud, expectedAud, StringComparison.Ordinal))
                return null;

            if (root.TryGetProperty("exp", out var exp)
                && DateTimeOffset.FromUnixTimeSeconds(exp.GetInt64()) <= DateTimeOffset.UtcNow)
                return null;

            var email = root.TryGetProperty("email", out var e) ? e.GetString() : null;
            if (string.IsNullOrWhiteSpace(email)) return null;

            var name = root.TryGetProperty("name", out var n) ? n.GetString() : null;
            var picture = root.TryGetProperty("picture", out var p) ? p.GetString() : null;
            var sub = root.TryGetProperty("sub", out var s) ? s.GetString() ?? "" : "";
            var verified = root.TryGetProperty("email_verified", out var v)
                && (v.ValueKind == JsonValueKind.True || v.GetString() == "true");

            return new GoogleUserInfo(sub, email, name ?? email.Split('@')[0], picture, verified);
        }
        catch
        {
            return null;
        }
    }
}
