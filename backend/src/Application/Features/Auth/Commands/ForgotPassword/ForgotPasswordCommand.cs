using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Features.Auth.Commands.ForgotPassword;

// FR-AUTH-008: POST /api/v1/auth/forgot-password
public sealed record ForgotPasswordCommand(string Email) : IRequest<Unit>;

public sealed class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MaximumLength(256);
    }
}

public sealed class ForgotPasswordCommandHandler(
    UserManager<ApplicationUser> users,
    IAppUrlService appUrls,
    IPasswordResetEmailDispatcher resetEmailDispatcher,
    ILogger<ForgotPasswordCommandHandler> logger) : IRequestHandler<ForgotPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim();
        var user = await users.FindByEmailAsync(email);

        // Chống dò tìm tài khoản (OWASP User Enumeration):
        // Luôn trả về thành công kể cả khi email không tồn tại hoặc tài khoản bị vô hiệu hóa.
        if (user is null || !user.IsActive || string.IsNullOrWhiteSpace(user.Email))
        {
            logger.LogInformation("Yêu cầu quên mật khẩu cho email không tồn tại hoặc đã bị khóa: {Email}", email);
            return Unit.Value;
        }

        var token = await users.GeneratePasswordResetTokenAsync(user);
        var encodedToken = AuthTokenEncoding.Base64UrlEncode(token);
        var encodedEmail = Uri.EscapeDataString(user.Email);
        var baseUrl = appUrls.GetFrontendBaseUrl().TrimEnd('/');
        var resetUrl = $"{baseUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

        await resetEmailDispatcher.DispatchAsync(user.Email, user.DisplayName, resetUrl, ct);
        return Unit.Value;
    }
}
