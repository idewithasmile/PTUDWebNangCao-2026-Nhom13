using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CulinaryBlog.Api.Tests;

// Integration FR-AUTH-001 → FR-AUTH-007 qua endpoint thật (WebApplicationFactory<Program>).
// Luồng: Register → Login → /me → PATCH /me → /refresh → reuse → /logout + RFC 7807.
public sealed class AuthFlowTests : IClassFixture<AuthWebFactory>
{
    private readonly HttpClient _client;
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public AuthFlowTests(AuthWebFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
    }

    [Fact]
    public async Task FullFlow_Register_Login_Me_Update_Refresh_Reuse_Logout()
    {
        // --- FR-AUTH-001: Register → 201 + HttpOnly refresh cookie ---
        var registerRes = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "flow@example.com",
            password = "P@ssw0rd!",
            userName = "flow_user",
            displayName = "Flow User"
        });
        Assert.Equal(HttpStatusCode.Created, registerRes.StatusCode);
        var registerBody = await ReadBody(registerRes);
        var accessToken = registerBody.GetProperty("accessToken").GetString();
        Assert.False(string.IsNullOrWhiteSpace(accessToken));
        Assert.Equal("flow@example.com", registerBody.GetProperty("user").GetProperty("email").GetString());
        var cookie1 = ExtractRefreshCookie(registerRes);
        Assert.NotNull(cookie1);
        Assert.Contains("httponly", GetSetCookie(registerRes), StringComparison.OrdinalIgnoreCase);

        // --- FR-AUTH-002: Login → 200 ---
        var loginRes = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email = "flow@example.com",
            password = "P@ssw0rd!"
        });
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);
        var loginBody = await ReadBody(loginRes);
        var loginAccess = loginBody.GetProperty("accessToken").GetString()!;
        var cookie2 = ExtractRefreshCookie(loginRes);
        Assert.NotNull(cookie2);

        // --- FR-AUTH-006: /me đủ 8 trường SRS ---
        var meReq = authed($"Bearer {loginAccess}", null);
        var meRes = await _client.SendAsync(meReq);
        Assert.Equal(HttpStatusCode.OK, meRes.StatusCode);
        var me = await ReadBody(meRes);
        foreach (var field in new[] { "id", "email", "userName", "displayName", "avatarUrl", "bio", "roles", "createdAt" })
            Assert.True(me.TryGetProperty(field, out _), $"missing field: {field}");
        Assert.Equal("flow@example.com", me.GetProperty("email").GetString());
        Assert.Equal("flow_user", me.GetProperty("userName").GetString());
        Assert.Contains("Author", me.GetProperty("roles").EnumerateArray().Select(r => r.GetString()));
        Assert.False(me.TryGetProperty("passwordHash", out _)); // cấm lộ secret

        // Chưa login → 401.
        Assert.Equal(HttpStatusCode.Unauthorized, (await _client.GetAsync("/api/v1/auth/me")).StatusCode);

        // --- FR-AUTH-007: PATCH /me chỉ đổi field gửi ---
        var patchReq = authed($"Bearer {loginAccess}", JsonContent(new { displayName = "Flow Renamed", bio = "hello" }));
        patchReq.Method = HttpMethod.Patch;
        patchReq.RequestUri = new Uri("/api/v1/auth/me", UriKind.Relative);
        var patchRes = await _client.SendAsync(patchReq);
        Assert.Equal(HttpStatusCode.OK, patchRes.StatusCode);
        var patched = await ReadBody(patchRes);
        Assert.Equal("Flow Renamed", patched.GetProperty("displayName").GetString());
        Assert.Equal("hello", patched.GetProperty("bio").GetString());
        Assert.Equal("flow@example.com", patched.GetProperty("email").GetString()); // email không đổi

        // --- FR-AUTH-004: refresh rotation ---
        var refreshRes = await _client.SendAsync(withCookie(new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh"), cookie2!));
        Assert.Equal(HttpStatusCode.OK, refreshRes.StatusCode);
        var cookie3 = ExtractRefreshCookie(refreshRes);
        Assert.NotNull(cookie3);
        Assert.NotEqual(cookie2, cookie3); // token mới

        // Reuse token cũ → 401 AUTH_REFRESH_TOKEN_REVOKED (reuse detection).
        var reuseRes = await _client.SendAsync(withCookie(new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/refresh"), cookie2!));
        Assert.Equal(HttpStatusCode.Unauthorized, reuseRes.StatusCode);
        var reuseBody = await ReadBody(reuseRes);
        Assert.Equal("AUTH_REFRESH_TOKEN_REVOKED", reuseBody.GetProperty("type").GetString());

        // --- FR-AUTH-005: logout → 204, idempotent ---
        var logoutReq = authed($"Bearer {loginAccess}", null);
        logoutReq.Method = HttpMethod.Post;
        logoutReq.RequestUri = new Uri("/api/v1/auth/logout", UriKind.Relative);
        var logoutRes = await _client.SendAsync(logoutReq);
        Assert.Equal(HttpStatusCode.NoContent, logoutRes.StatusCode);
        // Gọi lại vẫn 204.
        var logoutReq2 = authed($"Bearer {loginAccess}", null);
        logoutReq2.Method = HttpMethod.Post;
        logoutReq2.RequestUri = new Uri("/api/v1/auth/logout", UriKind.Relative);
        Assert.Equal(HttpStatusCode.NoContent, (await _client.SendAsync(logoutReq2)).StatusCode);
    }

    [Fact]
    public async Task Errors_Return_RFC7807_ProblemJson()
    {
        await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "dup2@example.com",
            password = "P@ssw0rd!",
            userName = "dup2_user",
            displayName = "Dup User"
        });

        // Trùng email → 409 AUTH_EMAIL_EXISTS, content-type application/problem+json.
        var dup = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "dup2@example.com",
            password = "P@ssw0rd!",
            userName = "other_name",
            displayName = "Other User"
        });
        Assert.Equal(HttpStatusCode.Conflict, dup.StatusCode);
        Assert.StartsWith("application/problem+json", dup.Content.Headers.ContentType?.MediaType ?? "");
        var dupBody = await ReadBody(dup);
        Assert.Equal("AUTH_EMAIL_EXISTS", dupBody.GetProperty("type").GetString());
        Assert.Equal(409, dupBody.GetProperty("status").GetInt32());

        // Validate lỗi → 400 VALIDATION_ERROR kèm errors.
        var bad = await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "not-an-email",
            password = "weak",
            userName = "bad name!",
            displayName = "A"
        });
        Assert.Equal(HttpStatusCode.BadRequest, bad.StatusCode);
        var badBody = await ReadBody(bad);
        Assert.Equal("VALIDATION_ERROR", badBody.GetProperty("type").GetString());
        Assert.True(badBody.TryGetProperty("errors", out _));

        // Sai password → 401 AUTH_INVALID_CREDENTIALS.
        var wrong = await _client.PostAsJsonAsync("/api/v1/auth/login", new
        {
            email = "dup2@example.com",
            password = "Wrong1!xyz"
        });
        Assert.Equal(HttpStatusCode.Unauthorized, wrong.StatusCode);
        Assert.Equal("AUTH_INVALID_CREDENTIALS", (await ReadBody(wrong)).GetProperty("type").GetString());
    }

    [Fact]
    public async Task Lockout_After5Failures_Returns423()
    {
        await _client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "lock@example.com",
            password = "P@ssw0rd!",
            userName = "lock_user",
            displayName = "Lock User"
        });

        HttpStatusCode last = HttpStatusCode.OK;
        for (var i = 0; i < 5; i++)
        {
            var r = await _client.PostAsJsonAsync("/api/v1/auth/login", new
            {
                email = "lock@example.com",
                password = "Wrong1!xyz"
            });
            last = r.StatusCode;
        }
        Assert.Equal((HttpStatusCode)423, last);
    }

    [Fact]
    public async Task Google_InvalidToken_Returns400()
    {
        var res = await _client.PostAsJsonAsync("/api/v1/auth/google", new { idToken = "bad-token" });
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        Assert.Equal("AUTH_GOOGLE_TOKEN_INVALID", (await ReadBody(res)).GetProperty("type").GetString());
    }

    // ---------- helpers ----------
    private static async Task<JsonElement> ReadBody(HttpResponseMessage res)
    {
        var json = await res.Content.ReadAsStringAsync();
        return JsonDocument.Parse(json).RootElement;
    }

    private static string? ExtractRefreshCookie(HttpResponseMessage res)
    {
        if (!res.Headers.TryGetValues("Set-Cookie", out var values)) return null;
        var setCookie = values.FirstOrDefault(v => v.StartsWith("refreshToken=", StringComparison.Ordinal));
        return setCookie?.Split(';')[0].Split('=', 2)[1] is { Length: > 0 } v ? v : null;
    }

    private static string GetSetCookie(HttpResponseMessage res) =>
        res.Headers.TryGetValues("Set-Cookie", out var values) ? string.Join("; ", values) : "";

    private static HttpRequestMessage withCookie(HttpRequestMessage req, string cookie)
    {
        req.Headers.Add("Cookie", $"refreshToken={cookie}");
        return req;
    }

    private static HttpRequestMessage authed(string bearer, HttpContent? content)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/v1/auth/me") { Content = content };
        req.Headers.Add("Authorization", bearer);
        return req;
    }

    private static StringContent JsonContent(object value) =>
        new(JsonSerializer.Serialize(value, Json), System.Text.Encoding.UTF8, "application/json");
}
