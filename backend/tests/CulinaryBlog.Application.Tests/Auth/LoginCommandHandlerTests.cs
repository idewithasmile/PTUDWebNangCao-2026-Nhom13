using Xunit;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Auth.Commands.Login;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Tests.Fakes;
using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class LoginCommandHandlerTests
{
    private readonly FakeUserStore _store;
    private readonly LoginCommandHandler _handler;
    private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _users;

    public LoginCommandHandlerTests()
    {
        var (users, store) = IdentityTestFactory.CreateUserManager();
        _users = users;
        _store = store;
        _handler = new LoginCommandHandler(users, new FakeJwtService(), new FakeRefreshTokenStore());
    }

    private async Task<ApplicationUser> SeedUserAsync(
        string email = "login@example.com", string password = "P@ssw0rd!", bool active = true)
    {
        var user = new ApplicationUser
        {
            UserName = email.Split('@')[0] + "_u",
            Email = email,
            DisplayName = "Login User",
            IsActive = active,
            LockoutEnabled = true,
            CreatedAt = DateTime.UtcNow
        };
        var result = await _users.CreateAsync(user, password);
        Assert.True(result.Succeeded);
        return user;
    }

    [Fact]
    public async Task Login_Success_ResetsFailedCount_And_ReturnsTokens()
    {
        var user = await SeedUserAsync();
        user.AccessFailedCount = 2;
        await _users.UpdateAsync(user);

        var result = await _handler.Handle(new LoginCommand("login@example.com", "P@ssw0rd!"), CancellationToken.None);

        Assert.StartsWith("access-", result.AccessToken);
        Assert.StartsWith("raw-", result.RefreshToken);
        Assert.Equal(0, _store.ById[user.Id].AccessFailedCount);
    }

    [Fact]
    public async Task Login_WrongPassword_Throws401_And_IncrementsFailedCount()
    {
        var user = await SeedUserAsync();

        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new LoginCommand("login@example.com", "Wrong1!x"), CancellationToken.None));

        Assert.Equal(AuthErrors.InvalidCredentials, ex.ErrorCode);
        Assert.Equal(401, ex.StatusCode);
        Assert.Equal(1, _store.ById[user.Id].AccessFailedCount);
    }

    [Fact]
    public async Task Login_UnknownEmail_Throws401()
    {
        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new LoginCommand("ghost@example.com", "P@ssw0rd!"), CancellationToken.None));
        Assert.Equal(AuthErrors.InvalidCredentials, ex.ErrorCode);
        Assert.Equal(401, ex.StatusCode);
    }

    [Fact]
    public async Task Login_DisabledAccount_Throws403_AUTH_ACCOUNT_DISABLED()
    {
        await SeedUserAsync(active: false);

        var ex = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new LoginCommand("login@example.com", "P@ssw0rd!"), CancellationToken.None));
        Assert.Equal(AuthErrors.AccountDisabled, ex.ErrorCode);
        Assert.Equal(403, ex.StatusCode);
    }

    [Fact]
    public async Task Login_FiveFailures_LocksAccount15Minutes_423()
    {
        await SeedUserAsync();

        for (var i = 0; i < 4; i++)
        {
            var ex = await Assert.ThrowsAsync<AppException>(() =>
                _handler.Handle(new LoginCommand("login@example.com", "Wrong1!x"), CancellationToken.None));
            Assert.Equal(401, ex.StatusCode);
        }

        var locked = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new LoginCommand("login@example.com", "Wrong1!x"), CancellationToken.None));
        Assert.Equal(AuthErrors.AccountLocked, locked.ErrorCode);
        Assert.Equal(423, locked.StatusCode);

        var stored = _store.ById.Values.Single(u => u.Email == "login@example.com");
        Assert.NotNull(stored.LockoutEnd);
        Assert.True(stored.LockoutEnd > DateTimeOffset.UtcNow.AddMinutes(14));

        // Ngay cả password đúng lúc này vẫn 423.
        var stillLocked = await Assert.ThrowsAsync<AppException>(() =>
            _handler.Handle(new LoginCommand("login@example.com", "P@ssw0rd!"), CancellationToken.None));
        Assert.Equal(423, stillLocked.StatusCode);
    }
}
