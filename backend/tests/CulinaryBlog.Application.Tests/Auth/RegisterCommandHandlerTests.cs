using Xunit;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Auth.Commands.Register;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Tests.Fakes;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class RegisterCommandHandlerTests
{
    private readonly FakeUserStore _store;
    private readonly FakeRefreshTokenStore _refresh;
    private readonly FakeWelcomeEmailDispatcher _mail;
    private readonly RegisterCommandHandler _handler;

    public RegisterCommandHandlerTests()
    {
        var (users, store) = IdentityTestFactory.CreateUserManager();
        var (roles, _) = IdentityTestFactory.CreateRoleManager();
        _store = store;
        _refresh = new FakeRefreshTokenStore();
        _mail = new FakeWelcomeEmailDispatcher();
        _handler = new RegisterCommandHandler(users, roles, new FakeJwtService(),
            _refresh, _mail, IdentityTestFactory.CreateNullLogger<RegisterCommandHandler>());
    }

    [Fact]
    public async Task Register_Success_AssignsAuthorRole_And_ReturnsTokens()
    {
        var result = await _handler.Handle(
            new RegisterCommand("chef@example.com", "P@ssw0rd!", "chef_user", "Chef Ngon"), CancellationToken.None);

        Assert.StartsWith("access-", result.AccessToken);
        Assert.StartsWith("raw-", result.RefreshToken);
        Assert.Equal("chef@example.com", result.User.Email);
        Assert.Equal("chef_user", result.User.UserName);
        Assert.Equal("Chef Ngon", result.User.DisplayName);
        Assert.Equal("chef_user", _store.ById[result.User.Id].UserName);
        // Fake UserManager chuẩn hóa role về uppercase ("AUTHOR"); DB thật giữ "Author".
        Assert.Contains(result.User.Roles, r => string.Equals(r, "Author", StringComparison.OrdinalIgnoreCase));
        Assert.Single(_refresh.ByHash); // refresh hash đã persist (không lưu raw)
        Assert.DoesNotContain(result.RefreshToken, _refresh.ByHash.Keys);
        Assert.Single(_mail.Sent); // FR-JOB-001 dispatched
    }

    [Fact]
    public async Task Register_DuplicateEmail_Throws409_AUTH_EMAIL_EXISTS()
    {
        await _handler.Handle(new RegisterCommand("dup@example.com", "P@ssw0rd!", "user_one", "User One"), CancellationToken.None);

        var ex = await Assert.ThrowsAsync<ConflictException>(() => _handler.Handle(
            new RegisterCommand("dup@example.com", "P@ssw0rd!", "user_two", "User Two"), CancellationToken.None));
        Assert.Equal(AuthErrors.EmailExists, ex.ErrorCode);
        Assert.Equal(409, ex.StatusCode);
    }

    [Fact]
    public async Task Register_DuplicateUserName_Throws409()
    {
        await _handler.Handle(new RegisterCommand("a@example.com", "P@ssw0rd!", "same_name", "User A"), CancellationToken.None);

        var ex = await Assert.ThrowsAsync<ConflictException>(() => _handler.Handle(
            new RegisterCommand("b@example.com", "P@ssw0rd!", "same_name", "User B"), CancellationToken.None));
        Assert.Equal(AuthErrors.UsernameExists, ex.ErrorCode);
    }
}
