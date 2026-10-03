using Xunit;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Auth.Commands.GoogleLogin;
using CulinaryBlog.Application.Features.Auth.Commands.Logout;
using CulinaryBlog.Application.Features.Auth.Commands.UpdateProfile;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Queries.GetMe;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Application.Tests.Fakes;
using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class GoogleLoginCommandHandlerTests
{
    private static (GoogleLoginCommandHandler Handler, FakeUserStore Store) Create(GoogleUserInfo? info)
    {
        var (users, store) = IdentityTestFactory.CreateUserManager();
        var (roles, _) = IdentityTestFactory.CreateRoleManager();
        var handler = new GoogleLoginCommandHandler(users, roles, new FakeJwtService(),
            new FakeRefreshTokenStore(), new FakeGoogleValidator(info),
            new FakeWelcomeEmailDispatcher(),
            IdentityTestFactory.CreateNullLogger<GoogleLoginCommandHandler>());
        return (handler, store);
    }

    [Fact]
    public async Task Google_InvalidToken_Throws400()
    {
        var (handler, _) = Create(null);

        var ex = await Assert.ThrowsAsync<AppException>(() =>
            handler.Handle(new GoogleLoginCommand("bad-token"), CancellationToken.None));
        Assert.Equal(AuthErrors.GoogleTokenInvalid, ex.ErrorCode);
        Assert.Equal(400, ex.StatusCode);
    }

    [Fact]
    public async Task Google_NewUser_Created_WithAuthorRole_And_GoogleAvatar()
    {
        var (handler, store) = Create(new GoogleUserInfo(
            "google-sub-1", "guser@example.com", "Google User", "https://lh3/photo.jpg", true));

        var result = await handler.Handle(new GoogleLoginCommand("valid-token"), CancellationToken.None);

        var saved = store.ById[result.User.Id];
        Assert.Equal("guser@example.com", saved.Email);
        Assert.True(saved.EmailConfirmed);
        Assert.Equal("https://lh3/photo.jpg", saved.AvatarUrl);
        // Fake UserManager chuẩn hóa role về uppercase ("AUTHOR"); DB thật giữ "Author".
        Assert.Contains(result.User.Roles, r => string.Equals(r, "Author", StringComparison.OrdinalIgnoreCase));
        Assert.StartsWith("access-", result.AccessToken);
    }

    [Fact]
    public async Task Google_ExistingEmail_LinksLogin_WithoutDuplicate()
    {
        var (handler, store) = Create(new GoogleUserInfo(
            "google-sub-2", "exist@example.com", "Google Name", null, true));

        // User đã đăng ký bằng email/password trước đó (seed trực tiếp vào store).
        var seed = new ApplicationUser
        {
            UserName = "exist_user",
            NormalizedUserName = "EXIST_USER",
            Email = "exist@example.com",
            NormalizedEmail = "EXIST@EXAMPLE.COM",
            DisplayName = "Exist User",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await store.CreateAsync(seed, CancellationToken.None);

        var result = await handler.Handle(new GoogleLoginCommand("valid-token"), CancellationToken.None);

        Assert.Equal(seed.Id, result.User.Id);
        Assert.Single(store.ById.Values, u => u.Email == "exist@example.com");
    }
}

public sealed class ProfileCommandTests
{
    private readonly FakeUserStore _store;
    private readonly Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> _users;

    public ProfileCommandTests()
    {
        var (users, store) = IdentityTestFactory.CreateUserManager();
        _users = users;
        _store = store;
    }

    private async Task<ApplicationUser> SeedAsync()
    {
        var user = new ApplicationUser
        {
            UserName = "profile_u",
            Email = "profile@example.com",
            DisplayName = "Profile User",
            AvatarUrl = "https://cdn.example.com/old.png",
            Bio = "old bio",
            CreatedAt = DateTime.UtcNow
        };
        Assert.True((await _users.CreateAsync(user, "P@ssw0rd!")).Succeeded);
        await _users.AddToRoleAsync(user, "Author");
        return user;
    }

    [Fact]
    public async Task GetMe_Returns_FullProfileShape()
    {
        var user = await SeedAsync();
        var handler = new GetMeQueryHandler(_users);

        var dto = await handler.Handle(new GetMeQuery(user.Id), CancellationToken.None);

        Assert.Equal(user.Id, dto.Id);
        Assert.Equal("profile@example.com", dto.Email);
        Assert.Equal("profile_u", dto.UserName);
        Assert.Equal("Profile User", dto.DisplayName);
        Assert.Equal("https://cdn.example.com/old.png", dto.AvatarUrl);
        Assert.Equal("old bio", dto.Bio);
        Assert.Contains(dto.Roles, r => string.Equals(r, "Author", StringComparison.OrdinalIgnoreCase));
        Assert.True(dto.CreatedAt > DateTime.MinValue);
    }

    [Fact]
    public async Task GetMe_UnknownUser_Throws404()
    {
        var handler = new GetMeQueryHandler(_users);
        var ex = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new GetMeQuery("missing-id"), CancellationToken.None));
        Assert.Equal(AuthErrors.UserNotFound, ex.ErrorCode);
    }

    [Fact]
    public async Task UpdateProfile_OnlyUpdates_SentFields()
    {
        var user = await SeedAsync();
        var handler = new UpdateProfileCommandHandler(_users);

        var dto = await handler.Handle(
            new UpdateProfileCommand(user.Id, DisplayName: "New Name"), CancellationToken.None);

        Assert.Equal("New Name", dto.DisplayName);
        Assert.Equal("https://cdn.example.com/old.png", dto.AvatarUrl); // giữ nguyên
        Assert.Equal("old bio", dto.Bio); // giữ nguyên
        Assert.Equal("profile@example.com", _store.ById[user.Id].Email); // cấm đổi email
        Assert.Equal("profile_u", _store.ById[user.Id].UserName); // cấm đổi userName
    }

    [Fact]
    public async Task Logout_RevokesToken_And_IsIdempotent()
    {
        var user = await SeedAsync();
        var jwt = new FakeJwtService();
        var store = new FakeRefreshTokenStore();
        const string raw = "raw-logout-1";
        await store.AddAsync(new Domain.Entities.RefreshToken
        {
            UserId = user.Id, TokenHash = jwt.HashToken(raw),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        var handler = new LogoutCommandHandler(jwt, store);

        await handler.Handle(new LogoutCommand(user.Id, raw), CancellationToken.None);
        Assert.NotNull(store.ByHash[jwt.HashToken(raw)].RevokedAt);

        // Gọi lại / không có token → vẫn thành công (204 ở endpoint).
        await handler.Handle(new LogoutCommand(user.Id, raw), CancellationToken.None);
        await handler.Handle(new LogoutCommand(user.Id, "raw-unknown"), CancellationToken.None);
        await handler.Handle(new LogoutCommand(user.Id), CancellationToken.None);
    }
}
