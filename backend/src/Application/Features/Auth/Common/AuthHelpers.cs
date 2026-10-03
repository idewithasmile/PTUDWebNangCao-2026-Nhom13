using CulinaryBlog.Application.Features.Auth.Dtos;
using CulinaryBlog.Domain.Entities;
using FluentValidation;

namespace CulinaryBlog.Application.Features.Auth.Common;

/// <summary>Map ApplicationUser → UserProfileDto (FR-AUTH-006/007 shape).</summary>
public static class AuthMapping
{
    public static UserProfileDto ToProfileDto(ApplicationUser user, IList<string> roles) =>
        new(
            Id: user.Id,
            Email: user.Email ?? string.Empty,
            UserName: user.UserName ?? string.Empty,
            DisplayName: user.DisplayName,
            AvatarUrl: user.AvatarUrl,
            Bio: user.Bio,
            Roles: roles.ToList().AsReadOnly(),
            CreatedAt: user.CreatedAt);
}

/// <summary>Rule mật khẩu dùng chung: ≥8 ký tự, ≥1 hoa, ≥1 thường, ≥1 số, ≥1 ký tự đặc biệt.</summary>
public static class PasswordRules
{
    public static IRuleBuilderOptions<T, string> PasswordComplexity<T>(this IRuleBuilder<T, string> rule) =>
        rule.MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
}
