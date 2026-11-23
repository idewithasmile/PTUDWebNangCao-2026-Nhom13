using CulinaryBlog.Application.Features.Auth.Common;
using CulinaryBlog.Application.Features.Auth.Dtos;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using AppEx = CulinaryBlog.Application.Common.Exceptions;
using RefreshTokenEntity = CulinaryBlog.Domain.Entities.RefreshToken;

namespace CulinaryBlog.Application.Features.Auth.Commands.RefreshToken;

// FR-AUTH-004: POST /api/v1/auth/refresh — refresh token đọc từ HttpOnly Cookie (endpoint trích).
// Token Rotation: revoke cũ, cấp cặp mới. Reuse token đã revoke → revoke cả token family (401 REVOKED).
public sealed record RefreshTokenCommand(string RefreshToken, string? CreatedByIp = null)
    : IRequest<AuthResultDto>;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}

/// <summary>
/// HANDLER XỬ LÝ LÀM MỚI TOKEN (REFRESH TOKEN HANDLER):
/// Áp dụng 2 cơ chế bảo mật cấp doanh nghiệp:
/// 1. Token Rotation: Mỗi lần refresh thành công, token cũ sẽ bị hủy ngay lập tức và thay bằng token mới.
/// 2. Reuse Detection: Nếu phát hiện một token ĐÃ BỊ HỦY mà vẫn được gửi lên để xin cấp token,
///    hệ thống xác định đang có kẻ gian đánh cắp token và lập tức THU HỒI TOÀN BỘ TOKEN của tài khoản đó.
/// </summary>
public sealed class RefreshTokenCommandHandler(
    UserManager<ApplicationUser> users,
    IJwtService jwt,
    IRefreshTokenStore store) : IRequestHandler<RefreshTokenCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        // BƯỚC 1: Băm chuỗi Refresh Token nhận được từ Client để tìm trong CSDL (vì DB chỉ lưu chuỗi băm)
        var hash = jwt.HashToken(request.RefreshToken);
        var stored = await store.FindByHashAsync(hash, ct);

        // BƯỚC 2: Kiểm tra token có tồn tại trong hệ thống và còn hạn sử dụng hay không
        if (stored is null || stored.ExpiresAt <= DateTime.UtcNow)
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenExpired, "Refresh token is expired or does not exist.", 401);

        // BƯỚC 3: PHÁT HIỆN TÁI SỬ DỤNG TRÁI PHÉP (AUTOMATIC REUSE DETECTION)
        // Nếu RevokedAt khác null, nghĩa là token này ĐÃ ĐƯỢC DÙNG ĐỂ REFRESH TRƯỚC ĐÓ RỒI.
        // Trường hợp này chỉ xảy ra khi: Hacker chộp được token cũ hoặc đường truyền bị nghe lén (Replay Attack).
        if (stored.RevokedAt is not null)
        {
            // Trừng phạt lập tức: Thu hồi toàn bộ phiên đăng nhập của User để bảo vệ tài khoản
            await store.RevokeAllActiveByUserAsync(stored.UserId, ct);
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenRevoked, "Refresh token has been revoked.", 401);
        }

        // BƯỚC 4: Kiểm tra tài khoản người dùng có tồn tại và đang hoạt động không (chống trường hợp đã bị Admin Ban)
        var user = await users.FindByIdAsync(stored.UserId);
        if (user is null)
            throw new AppEx.AppException(
                AuthErrors.RefreshTokenExpired, "Refresh token is expired or does not exist.", 401);
        if (!user.IsActive)
            throw new AppEx.AppException(
                AuthErrors.AccountDisabled, "Account has been disabled.", 403);

        // BƯỚC 5: THỰC HIỆN XOAY VÒNG TOKEN (TOKEN ROTATION)
        // 5.1. Sinh chuỗi Refresh Token ngẫu nhiên mới và băm nó
        var rawNew = jwt.GenerateRefreshToken();
        var newHash = jwt.HashToken(rawNew);

        // 5.2. Đánh dấu thu hồi token hiện tại (Revoke) và lưu vết liên kết sang token mới thay thế
        stored.RevokedAt = DateTime.UtcNow;
        stored.ReplacedByTokenHash = newHash;
        await store.UpdateAsync(stored, ct);

        // 5.3. Lưu Refresh Token mới vào CSDL với thời hạn 7 ngày
        var expiresAt = DateTime.UtcNow.AddDays(7);
        await store.AddAsync(new RefreshTokenEntity
        {
            UserId = user.Id,
            TokenHash = newHash,
            ExpiresAt = expiresAt,
            CreatedByIp = request.CreatedByIp
        }, ct);

        // BƯỚC 6: CẤP ACCESS TOKEN MỚI (Thời hạn 15 phút) VÀ TRẢ VỀ CHO CLIENT
        var userRoles = await users.GetRolesAsync(user);
        var accessToken = jwt.GenerateAccessToken(user, userRoles);

        return new AuthResultDto(accessToken, rawNew, expiresAt,
            AuthMapping.ToProfileDto(user, userRoles));
    }
}
