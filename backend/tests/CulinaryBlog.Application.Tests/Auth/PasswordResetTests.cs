using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Commands.ForgotPassword;
using CulinaryBlog.Application.Features.Auth.Commands.ResetPassword;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Application.Tests.Fakes;
using CulinaryBlog.Domain.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class PasswordResetTests
{
    private sealed class FakeAppUrlService(string baseUrl = "http://localhost:3000") : IAppUrlService
    {
        public string GetFrontendBaseUrl() => baseUrl;
    }

    private sealed class FakePasswordResetEmailDispatcher : IPasswordResetEmailDispatcher
    {
        public readonly List<(string Email, string DisplayName, string ResetUrl)> Dispatched = [];

        public Task DispatchAsync(string email, string displayName, string resetUrl, CancellationToken ct = default)
        {
            Dispatched.Add((email, displayName, resetUrl));
            return Task.CompletedTask;
        }
    }

    private sealed class InMemoryResetTokenProvider : IUserTwoFactorTokenProvider<ApplicationUser>
    {
        public Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<ApplicationUser> manager, ApplicationUser user) =>
            Task.FromResult(true);

        public Task<string> GenerateAsync(string purpose, UserManager<ApplicationUser> manager, ApplicationUser user) =>
            Task.FromResult($"reset-{user.Id}-{purpose}");

        public Task<bool> ValidateAsync(string purpose, string token, UserManager<ApplicationUser> manager, ApplicationUser user) =>
            Task.FromResult(token == $"reset-{user.Id}-{purpose}");
    }

    private static (UserManager<ApplicationUser> Users, FakeUserStore Store) CreateUsersWithResetProvider()
    {
        var (users, store) = IdentityTestFactory.CreateUserManager();
        users.Options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultProvider;
        users.RegisterTokenProvider(TokenOptions.DefaultProvider, new InMemoryResetTokenProvider());
        return (users, store);
    }

    [Fact]
    public async Task ForgotPassword_UnknownEmail_DoesNotDispatch_And_Succeeds()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var dispatcher = new FakePasswordResetEmailDispatcher();
        var handler = new ForgotPasswordCommandHandler(
            users,
            new FakeAppUrlService(),
            dispatcher,
            IdentityTestFactory.CreateNullLogger<ForgotPasswordCommandHandler>());

        await handler.Handle(new ForgotPasswordCommand("missing@example.com"), CancellationToken.None);

        dispatcher.Dispatched.Should().BeEmpty();
    }

    [Fact]
    public async Task ForgotPassword_InactiveUser_DoesNotDispatch_And_Succeeds()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "disabled_u",
            Email = "disabled@example.com",
            DisplayName = "Disabled",
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var dispatcher = new FakePasswordResetEmailDispatcher();
        var handler = new ForgotPasswordCommandHandler(
            users,
            new FakeAppUrlService(),
            dispatcher,
            IdentityTestFactory.CreateNullLogger<ForgotPasswordCommandHandler>());

        await handler.Handle(new ForgotPasswordCommand("disabled@example.com"), CancellationToken.None);

        dispatcher.Dispatched.Should().BeEmpty();
    }

    [Fact]
    public async Task ForgotPassword_ActiveUser_DispatchesResetUrl_WithEncodedToken()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "chef_u",
            Email = "chef@example.com",
            DisplayName = "Chef Anna",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var dispatcher = new FakePasswordResetEmailDispatcher();
        var handler = new ForgotPasswordCommandHandler(
            users,
            new FakeAppUrlService("https://gocbep.vn/"),
            dispatcher,
            IdentityTestFactory.CreateNullLogger<ForgotPasswordCommandHandler>());

        await handler.Handle(new ForgotPasswordCommand("chef@example.com"), CancellationToken.None);

        dispatcher.Dispatched.Should().ContainSingle();
        var item = dispatcher.Dispatched[0];
        item.Email.Should().Be("chef@example.com");
        item.DisplayName.Should().Be("Chef Anna");
        item.ResetUrl.Should().StartWith("https://gocbep.vn/reset-password?email=chef%40example.com&token=");
    }

    [Fact]
    public async Task ResetPassword_ValidToken_ChangesPassword_RevokesRefreshTokens_And_ClearsLockout()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "reset_u",
            Email = "reset@example.com",
            DisplayName = "Reset User",
            IsActive = true,
            AccessFailedCount = 5,
            LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(10),
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var refreshStore = new FakeRefreshTokenStore();
        await refreshStore.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = "hash-active-token",
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        });

        var rawToken = await users.GeneratePasswordResetTokenAsync(user);
        var encodedToken = AuthTokenEncoding.Base64UrlEncode(rawToken);

        var handler = new ResetPasswordCommandHandler(users, refreshStore);
        await handler.Handle(
            new ResetPasswordCommand("reset@example.com", encodedToken, "NewP@ssw0rd2"),
            CancellationToken.None);

        (await users.CheckPasswordAsync(user, "NewP@ssw0rd2")).Should().BeTrue();
        (await users.CheckPasswordAsync(user, "OldP@ssw0rd1")).Should().BeFalse();
        user.AccessFailedCount.Should().Be(0);
        user.LockoutEnd.Should().BeNull();
        (await refreshStore.ListActiveByUserAsync(user.Id)).Should().BeEmpty();
    }

    [Fact]
    public async Task ResetPassword_InvalidToken_ThrowsResetTokenInvalid()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "bad_u",
            Email = "bad@example.com",
            DisplayName = "Bad Token",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var handler = new ResetPasswordCommandHandler(users, new FakeRefreshTokenStore());
        var encodedBad = AuthTokenEncoding.Base64UrlEncode("wrong-token");

        var act = async () => await handler.Handle(
            new ResetPasswordCommand("bad@example.com", encodedBad, "NewP@ssw0rd2"),
            CancellationToken.None);

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be(AuthErrors.ResetTokenInvalid);
        ex.Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task ResetPassword_SameAsCurrentPassword_ThrowsPasswordSameAsOld()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "same_pw_u",
            Email = "same@example.com",
            DisplayName = "Same Password User",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var refreshStore = new FakeRefreshTokenStore();
        await refreshStore.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = "hash-keep-token",
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        });

        var rawToken = await users.GeneratePasswordResetTokenAsync(user);
        var encodedToken = AuthTokenEncoding.Base64UrlEncode(rawToken);

        var handler = new ResetPasswordCommandHandler(users, refreshStore);
        var act = async () => await handler.Handle(
            new ResetPasswordCommand("same@example.com", encodedToken, "OldP@ssw0rd1"),
            CancellationToken.None);

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be(AuthErrors.PasswordSameAsOld);
        ex.Which.StatusCode.Should().Be(400);
        (await users.CheckPasswordAsync(user, "OldP@ssw0rd1")).Should().BeTrue();
        (await refreshStore.ListActiveByUserAsync(user.Id)).Should().ContainSingle();
    }

    [Fact]
    public async Task ResetPassword_InvalidToken_WithSamePassword_ThrowsResetTokenInvalid()
    {
        var (users, _) = CreateUsersWithResetProvider();
        var user = new ApplicationUser
        {
            UserName = "bad_same_u",
            Email = "badsame@example.com",
            DisplayName = "Bad Same",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await users.CreateAsync(user, "OldP@ssw0rd1");

        var handler = new ResetPasswordCommandHandler(users, new FakeRefreshTokenStore());
        var encodedBad = AuthTokenEncoding.Base64UrlEncode("wrong-token");

        var act = async () => await handler.Handle(
            new ResetPasswordCommand("badsame@example.com", encodedBad, "OldP@ssw0rd1"),
            CancellationToken.None);

        var ex = await act.Should().ThrowAsync<AppException>();
        ex.Which.ErrorCode.Should().Be(AuthErrors.ResetTokenInvalid);
        ex.Which.StatusCode.Should().Be(400);
    }
}
