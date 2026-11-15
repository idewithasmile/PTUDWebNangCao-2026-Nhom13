using CulinaryBlog.Application.Features.Newsletter.Commands.DeleteSubscriber;
using CulinaryBlog.Application.Features.Newsletter.Commands.SubscribeNewsletter;
using CulinaryBlog.Application.Features.Newsletter.Commands.UnsubscribeNewsletter;
using CulinaryBlog.Application.Features.Newsletter.DTOs;
using CulinaryBlog.Application.Features.Newsletter.Queries.ExportSubscribers;
using CulinaryBlog.Application.Features.Newsletter.Queries.GetSubscribers;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace CulinaryBlog.API.Endpoints;

public static class NewsletterEndpoints
{
    public static RouteGroupBuilder MapNewsletterEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Newsletter");

        // FR-NWL-001: Khách hàng để lại email nhận công thức & mẹo bếp
        group.MapPost("/subscribe", async (
            [FromBody] SubscribeNewsletterRequest body,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(
                new SubscribeNewsletterCommand(
                    body.Email,
                    body.CustomerName,
                    body.FavoriteCategorySlug,
                    string.IsNullOrWhiteSpace(body.Source) ? "HomeBanner" : body.Source),
                ct);
            return Results.Ok(result);
        })
        .AllowAnonymous()
        .WithSummary("Đăng ký nhận bản tin ẩm thực & công thức mới")
        .Produces<NewsletterSubscribeResultDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        // FR-NWL-002: Hủy đăng ký nhận bản tin theo token trong email
        group.MapPost("/unsubscribe", async (
            [FromBody] UnsubscribeNewsletterRequest body,
            ISender sender,
            CancellationToken ct) =>
        {
            await sender.Send(new UnsubscribeNewsletterCommand(body.Token), ct);
            return Results.Ok(new { message = "Bạn đã hủy đăng ký nhận bản tin ẩm thực thành công." });
        })
        .AllowAnonymous()
        .WithSummary("Hủy đăng ký bản tin bằng token")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-NWL-003: Danh sách khách hàng đăng ký (Admin only)
        group.MapGet("/subscribers", async (
            [FromQuery] string? search,
            [FromQuery] bool? isActive,
            [FromQuery] int? page,
            [FromQuery] int? pageSize,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(
                new GetSubscribersQuery(search, isActive, page ?? 1, pageSize ?? 15),
                ct);
            return Results.Ok(result);
        })
        .RequireAuthorization("AdminPolicy")
        .WithSummary("Lấy danh sách khách hàng đăng ký bản tin (Admin)")
        .Produces<NewsletterSubscribersListDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status403Forbidden);

        // FR-NWL-004: Xuất danh sách email khách hàng ra CSV (UTF-8 BOM, Admin only)
        group.MapGet("/subscribers/export", async (
            [FromQuery] bool? isActive,
            ISender sender,
            CancellationToken ct) =>
        {
            var bytes = await sender.Send(new ExportSubscribersQuery(isActive), ct);
            var fileName = $"culinary-subscribers-{DateTime.UtcNow:yyyyMMdd}.csv";
            return Results.File(bytes, "text/csv; charset=utf-8", fileName);
        })
        .RequireAuthorization("AdminPolicy")
        .WithSummary("Xuất danh sách khách hàng đăng ký bản tin ra file CSV (Admin)")
        .Produces(StatusCodes.Status200OK, contentType: "text/csv");

        // Xóa mềm subscriber khỏi danh sách quản trị (Admin only)
        group.MapDelete("/subscribers/{id:guid}", async (
            Guid id,
            ISender sender,
            CancellationToken ct) =>
        {
            await sender.Send(new DeleteSubscriberCommand(id), ct);
            return Results.NoContent();
        })
        .RequireAuthorization("AdminPolicy")
        .WithSummary("Xóa mềm khách hàng đăng ký bản tin (Admin)")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return group;
    }

    public sealed record SubscribeNewsletterRequest(
        string Email,
        string? CustomerName = null,
        string? FavoriteCategorySlug = null,
        string? Source = "HomeBanner");

    public sealed record UnsubscribeNewsletterRequest(string Token);
}
