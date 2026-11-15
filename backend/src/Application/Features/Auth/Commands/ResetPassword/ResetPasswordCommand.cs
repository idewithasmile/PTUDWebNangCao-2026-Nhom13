using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using AppEx = CulinaryBlog.Application.Common.Exceptions;

namespace CulinaryBlog.Application.Features.Auth.Commands.ResetPassword;

// FR-AUTH-009: POST /api/v1/auth/reset-password
public sealed record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<Unit>;

public sealed class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MaximumLength(256);

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Mã khôi phục mật khẩu không được để trống.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Mật khẩu mới không được để trống.")
            .MaximumLength(128)
            .PasswordComplexity();
    }
}

public sealed class ResetPasswordCommandHandler(
    UserManager<ApplicationUser> users,
    IRefreshTokenStore refreshTokens) : IRequestHandler<ResetPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim();
        var user = await users.FindByEmailAsync(email);
        if (user is null || !user.IsActive)
        {
            throw new AppEx.AppException(
                AuthErrors.ResetTokenInvalid,
                "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
                400);
        }

        string decodedToken;
        try
        {
            decodedToken = AuthTokenEncoding.Base64UrlDecode(request.Token.Trim());
        }
        catch (FormatException)
        {
            throw new AppEx.AppException(
                AuthErrors.ResetTokenInvalid,
                "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
                400);
        }

        var result = await users.ResetPasswordAsync(user, decodedToken, request.NewPassword);
        if (!result.Succeeded)
        {
            var isInvalidToken = result.Errors.Any(e =>
                string.Equals(e.Code, "InvalidToken", StringComparison.OrdinalIgnoreCase));

            if (isInvalidToken)
            {
                throw new AppEx.AppException(
                    AuthErrors.ResetTokenInvalid,
                    "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
                    400);
            }

            var errors = result.Errors
                .GroupBy(e => e.Code, e => e.Description)
                .ToDictionary(g => g.Key, g => g.ToArray());
            throw new AppEx.ValidationException(errors);
        }

        // Bảo mật phiên: thu hồi toàn bộ refresh token cũ và xóa lockout (nếu có).
        await refreshTokens.RevokeAllActiveByUserAsync(user.Id, ct);

        if (user.AccessFailedCount != 0 || user.LockoutEnd is not null)
        {
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            await users.UpdateAsync(user);
        }

        return Unit.Value;
    }
}
