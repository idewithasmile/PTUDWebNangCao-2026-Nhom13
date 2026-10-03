using Xunit;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Auth.Commands.RefreshToken;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Tests.Fakes;
using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class RefreshTokenCommandHandlerTests
{
    private readonly FakeUserStore _userStore;
    private readonly FakeRefreshTokenStore _store;
    private readonly FakeJwtService _jwt;
    private readonly RefreshTokenCommandHandler _handler;
    private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _users;

    public RefreshTokenCommandHandlerTests()
    {
        var (users, userStore) = IdentityTestFactory.CreateUserManager();
        _users = users;
        _userStore = userStore;
        _store = new FakeRefreshTokenStore();
        _jwt = new FakeJwtService();
        _handler = new RefreshTokenCommandHandler(users, _jwt, _store);
    }

    private async Task<(ApplicationUser User, string Raw)> SeedSessionAsync(bool active = true)
    {
        var user = new ApplicationUser
        {
            UserName = "refresh_u",
            Email = "refresh@example.com",
            DisplayName = "Refresh User",
            IsActive = active,
            CreatedAt = DateTime.UtcNow
        };
        Assert.True((await _users.CreateAsync(user, "P@ssw0rd!")).Succeeded);

        const string raw = "raw-session-1";
        await _store.AddAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = _jwt.HashToken(raw),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        return (user, raw);
    }

    [Fact]
    public async Task Refresh_Success_RotatesToken_And_RevokesOld()
    {
        var (_, raw) = await SeedSessionAsync();

        var result = await _handler.Handle(new RefreshTokenCommand(raw), CancellationToken.None);

        Assert.StartsWith("access-", result.AccessToken);
        Assert.NotEqual(raw, result.RefreshToken); // rotation: cặp mới
        Assert.NotNull(_store.ByHash[_jwt.HashToken(raw)].RevokedAt); // cũ bị revoke
        Assert.NotNull(_store.ByHash[_jwt.HashToken(raw)].ReplacedByTokenHash);
        Assert.Null(_store.ByHash[_jwt.HashToken(result.RefreshToken)].RevokedAt);
    }

    [Fact]
    public async Task Refresh_UnknownToken_Throws401_EXPIRED()
    {
        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new RefreshTokenCommand("raw-unknown"), CancellationToken.None));
        Assert.Equal(AuthErrors.RefreshTokenExpired, ex.ErrorCode);
        Assert.Equal(401, ex.StatusCode);
    }

    [Fact]
    public async Task Refresh_ExpiredToken_Throws401_EXPIRED()
    {
        var (user, _) = await SeedSessionAsync();
        const string raw = "raw-expired";
        await _store.AddAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = _jwt.HashToken(raw),
            ExpiresAt = DateTime.UtcNow.AddMinutes(-1)
        });

        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new RefreshTokenCommand(raw), CancellationToken.None));
        Assert.Equal(AuthErrors.RefreshTokenExpired, ex.ErrorCode);
    }

    [Fact]
    public async Task Refresh_ReuseRevokedToken_RevokesFamily_And_Throws401_REVOKED()
    {
        var (user, rawOld) = await SeedSessionAsync();
        // Tạo thêm 1 session song song (device khác).
        const string rawOther = "raw-other-device";
        await _store.AddAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = _jwt.HashToken(rawOther),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });

        var rotated = await _handler.Handle(new RefreshTokenCommand(rawOld), CancellationToken.None);

        // Kẻ tấn công dùng lại token cũ → phát hiện reuse.
        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new RefreshTokenCommand(rawOld), CancellationToken.None));
        Assert.Equal(AuthErrors.RefreshTokenRevoked, ex.ErrorCode);
        Assert.Equal(401, ex.StatusCode);

        // Cả family bị thu hồi: token mới rotate + token device khác đều chết.
        Assert.NotNull(_store.ByHash[_jwt.HashToken(rotated.RefreshToken)].RevokedAt);
        Assert.NotNull(_store.ByHash[_jwt.HashToken(rawOther)].RevokedAt);
    }

    [Fact]
    public async Task Refresh_DisabledAccount_Throws403()
    {
        var (_, raw) = await SeedSessionAsync(active: false);

        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new RefreshTokenCommand(raw), CancellationToken.None));
        Assert.Equal(AuthErrors.AccountDisabled, ex.ErrorCode);
        Assert.Equal(403, ex.StatusCode);
    }
}
