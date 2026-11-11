using CulinaryBlog.Application.Features.Users.Commands.ToggleUserStatus;
using CulinaryBlog.Application.Features.Users.DTOs;
using CulinaryBlog.Application.Features.Users.Queries.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace CulinaryBlog.API.Endpoints;

public record UpdateUserStatusRequest(bool IsActive);

public static class UsersEndpoints
{
    public static RouteGroupBuilder MapUsersEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Users");

        // 1. GET /api/v1/users - Lấy danh sách người dùng & tác giả phân trang, lọc vai trò, tìm kiếm
        group.MapGet("/", async (
            string? searchTerm,
            string? role,
            bool? isActive,
            int? page,
            int? pageSize,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetUsersQuery(
                SearchTerm: searchTerm,
                Role: role,
                IsActive: isActive,
                Page: page ?? 1,
                PageSize: pageSize ?? 10
            ), ct);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithName("GetUsersList")
        .WithSummary("Lấy danh sách người dùng và tác giả phân trang, hỗ trợ lọc vai trò, trạng thái và tìm kiếm")
        .Produces<PagedUsersResultDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status401Unauthorized);

        // 2. PATCH /api/v1/users/{id}/status - Khóa hoặc mở khóa tài khoản người dùng (chỉ Admin)
        group.MapPatch("/{id}/status", async (
            string id,
            UpdateUserStatusRequest body,
            ISender sender,
            CancellationToken ct) =>
        {
            await sender.Send(new ToggleUserStatusCommand(id, body.IsActive), ct);
            return Results.Ok(new
            {
                success = true,
                message = body.IsActive ? "Đã kích hoạt lại tài khoản thành công." : "Đã tạm khóa tài khoản thành công."
            });
        })
        .RequireAuthorization("AdminPolicy")
        .WithName("ToggleUserStatus")
        .WithSummary("Khóa hoặc mở khóa tài khoản người dùng (Yêu cầu quyền Quản trị viên)")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status403Forbidden)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return group;
    }
}
