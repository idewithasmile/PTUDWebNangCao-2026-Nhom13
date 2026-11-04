using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CulinaryBlog.Application.Features.Users.Commands.ToggleUserStatus;

public record ToggleUserStatusCommand(
    string UserId,
    bool IsActive
) : IRequest<bool>;

public class ToggleUserStatusCommandHandler(
    UserManager<ApplicationUser> userManager,
    ICurrentUser currentUser)
    : IRequestHandler<ToggleUserStatusCommand, bool>
{
    public async Task<bool> Handle(ToggleUserStatusCommand request, CancellationToken ct)
    {
        // 1. Chỉ Quản trị viên (Admin) mới có quyền khóa / mở khóa tài khoản
        if (!currentUser.IsAdmin)
        {
            throw new ForbiddenException("FORBIDDEN", "Chỉ quản trị viên mới có quyền thay đổi trạng thái tài khoản người dùng.");
        }

        // 2. Không cho phép Admin tự khóa tài khoản của chính mình
        if (currentUser.UserId == request.UserId && !request.IsActive)
        {
            throw new AppException("CANNOT_DEACTIVATE_SELF", "Bạn không thể tự khóa tài khoản quản trị viên của chính mình.", 400);
        }

        // 3. Tìm người dùng trong hệ thống
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new NotFoundException("USER_NOT_FOUND", $"Không tìm thấy người dùng với Id '{request.UserId}'.");
        }

        // 4. Cập nhật trạng thái
        user.IsActive = request.IsActive;
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new AppException("UPDATE_STATUS_FAILED", $"Lỗi cập nhật trạng thái người dùng: {errors}", 500);
        }

        return true;
    }
}
