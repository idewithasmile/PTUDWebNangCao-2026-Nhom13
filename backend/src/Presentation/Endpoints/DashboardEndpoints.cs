using CulinaryBlog.Application.Features.Dashboard.DTOs;
using CulinaryBlog.Application.Features.Dashboard.Queries.GetDashboardStats;
using CulinaryBlog.Application.Features.Dashboard.Queries.GetRecentFiles;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace CulinaryBlog.API.Endpoints;

public static class DashboardEndpoints
{
    public static RouteGroupBuilder MapDashboardEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Dashboard");

        // 1. GET /api/v1/dashboard/stats - Yêu cầu đăng nhập (Admin xem toàn trang hoặc Author xem cá nhân)
        group.MapGet("/stats", async (bool? onlyMine, IMediator mediator, CancellationToken ct) =>
        {
            var result = await mediator.Send(new GetDashboardStatsQuery(onlyMine), ct);
            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithName("GetDashboardStats")
        .WithSummary("Lấy thống kê tổng quan KPI, tỷ lệ danh mục và hoạt động 7 ngày (phân quyền Admin/Author)")
        .Produces<DashboardStatsDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status401Unauthorized);

        // 2. GET /api/v1/dashboard/recent-files - Yêu cầu đăng nhập
        group.MapGet("/recent-files", async (int? limit, IMediator mediator, CancellationToken ct) =>
        {
            var result = await mediator.Send(new GetRecentFilesQuery(limit ?? 6), ct);
            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithName("GetDashboardRecentFiles")
        .WithSummary("Lấy danh sách các tệp tin hình ảnh công thức gần đây từ kho lưu trữ")
        .Produces<List<RecentFileDto>>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status401Unauthorized);

        return group;
    }
}
