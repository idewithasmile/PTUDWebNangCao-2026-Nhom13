using Xunit;
using CulinaryBlog.Application.Features.Auth.Commands.Login;
using CulinaryBlog.Application.Features.Auth.Commands.RefreshToken;
using CulinaryBlog.Application.Features.Auth.Commands.Register;
using CulinaryBlog.Application.Features.Auth.Commands.UpdateProfile;

namespace CulinaryBlog.Application.Tests.Auth;

public sealed class AuthValidatorsTests
{
    [Theory]
    [InlineData("P@ssw0rd!", true)]
    [InlineData("Str0ng#Pass", true)]
    [InlineData("short1!", false)]        // < 8 ký tự
    [InlineData("alllowercase1!", false)] // thiếu hoa
    [InlineData("ALLUPPERCASE1!", false)] // thiếu thường
    [InlineData("NoDigitsHere!", false)]  // thiếu số
    [InlineData("NoSpecial123", false)]   // thiếu ký tự đặc biệt
    public void Register_PasswordComplexity(string password, bool expectedValid)
    {
        var v = new RegisterCommandValidator();
        var r = v.Validate(new RegisterCommand("a@b.co", password, "validuser", "Valid Name"));
        Assert.Equal(expectedValid, r.IsValid);
    }

    [Theory]
    [InlineData("john_doe.99", true)]
    [InlineData("john@doe", false)]  // ký tự đặc biệt
    [InlineData("john doe", false)]  // khoảng trắng
    [InlineData("ab", false)]        // < 3 ký tự
    public void Register_UserName_Rules(string userName, bool expectedValid)
    {
        var v = new RegisterCommandValidator();
        var r = v.Validate(new RegisterCommand("a@b.co", "P@ssw0rd!", userName, "Valid Name"));
        Assert.Equal(expectedValid, r.IsValid);
    }

    [Theory]
    [InlineData("AB", true)]   // min 2
    [InlineData("A", false)]   // < 2
    [InlineData("", false)]
    public void Register_DisplayName_Length(string displayName, bool expectedValid)
    {
        var v = new RegisterCommandValidator();
        var r = v.Validate(new RegisterCommand("a@b.co", "P@ssw0rd!", "validuser", displayName));
        Assert.Equal(expectedValid, r.IsValid);
    }

    [Fact]
    public void Register_InvalidEmail_Fails()
    {
        var v = new RegisterCommandValidator();
        Assert.False(v.Validate(new RegisterCommand("not-an-email", "P@ssw0rd!", "validuser", "Valid Name")).IsValid);
    }

    [Fact]
    public void Login_EmptyPassword_Fails() =>
        Assert.False(new LoginCommandValidator().Validate(new LoginCommand("a@b.co", "")).IsValid);

    [Fact]
    public void Refresh_EmptyToken_Fails() =>
        Assert.False(new RefreshTokenCommandValidator().Validate(new RefreshTokenCommand("")).IsValid);

    [Theory]
    [InlineData("New Name", "https://cdn.example.com/a.png", "food lover", true)]
    [InlineData("A", null, null, false)]                       // displayName < 2
    [InlineData(null, "not-a-url", null, false)]               // avatarUrl sai
    [InlineData(null, "ftp://x/y.png", null, false)]           // scheme lạ
    public void UpdateProfile_Rules(string? name, string? avatar, string? bio, bool expectedValid)
    {
        var v = new UpdateProfileCommandValidator();
        Assert.Equal(expectedValid, v.Validate(new UpdateProfileCommand("u1", name, avatar, bio)).IsValid);
    }
}
