using System.Security.Claims;
using CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;
using CulinaryBlog.Application.Features.Categories.Commands.DeleteCategory;
using CulinaryBlog.Application.Features.Categories.Commands.UpdateCategory;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategories;
using CulinaryBlog.Application.Features.Categories.Queries.GetCategoryBySlug;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace CulinaryBlog.API.Endpoints;

public static class CategoriesEndpoints
{
    /// <summary>
    /// Extension method đăng ký các endpoints cho phân hệ Quản lý Danh mục (FR-CAT).
    /// Tuân thủ kiến trúc Minimal API trong .NET 10 với tài liệu OpenAPI/Scalar đầy đủ.
    /// </summary>
    public static IEndpointRouteBuilder MapCategoriesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/categories")
                       .WithTags("Categories");

        // 1. GET /api/v1/categories - Public, Redis cached (TTL 60m theo FR-CAT-001)
        group.MapGet("/", async (IMediator mediator, CancellationToken ct) =>
        {
            var result = await mediator.Send(new GetCategoriesQuery(), ct);
            return Results.Ok(result);
        })
        .WithName("GetCategories")
        .WithSummary("Lấy danh sách tất cả danh mục kèm số lượng bài viết đã xuất bản (Cached Redis 60m)")
        .WithDescription("Trả về toàn bộ danh sách các danh mục món ăn đang hoạt động (!IsDeleted), kèm theo số lượng công thức đã xuất bản (Status == Published). Dữ liệu được đệm trong Redis Distributed Cache với khóa 'categories:all' và TTL 60 phút để đảm bảo Backend hoàn toàn phi trạng thái (Stateless).")
        .Produces<List<CategoryDto>>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

        // 2. GET /api/v1/categories/{slug} - Public, phân trang query params page, pageSize (max 50) kèm trích xuất JWT Claims (FR-CAT-002)
        group.MapGet("/{slug}", async (
            string slug,
            [FromQuery] int? page,
            [FromQuery] int? pageSize,
            ClaimsPrincipal user,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var p = page ?? 1;
            var ps = pageSize ?? 12;

            // Tự động trích xuất mã định danh UserId và quyền Quản trị viên (Admin) từ JWT Claims
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? user.FindFirst("sub")?.Value;
            var isAdmin = user.IsInRole("Admin")
                          || user.FindFirst(ClaimTypes.Role)?.Value == "Admin"
                          || user.FindFirst("role")?.Value == "Admin";

            var query = new GetCategoryBySlugQuery(slug, p, ps, userId, isAdmin);
            var result = await mediator.Send(query, ct);
            return Results.Ok(result);
        })
        .WithName("GetCategoryBySlug")
        .WithSummary("Xem thông tin chi tiết danh mục theo Slug kèm danh sách công thức phân trang (FR-CAT-002)")
        .WithDescription("Trả về thông tin chi tiết danh mục theo Slug kèm danh sách công thức phân trang. Tự động áp dụng phân quyền hiển thị theo tác nhân: Khách vãng lai chỉ thấy bài Published; Tác giả thấy bài Published chung và bài Draft của mình; Admin thấy toàn bộ bài viết.")
        .Produces<CategoryDetailResponseDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

        // 3. POST /api/v1/categories - Admin only
        group.MapPost("/", async (
            [FromBody] CreateCategoryRequest request,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var command = new CreateCategoryCommand(
                request.Name,
                request.Description,
                request.ImageUrl,
                request.OrderIndex);

            var result = await mediator.Send(command, ct);
            return Results.Created($"/api/v1/categories/{result.Slug}", result);
        })
        .RequireAuthorization("AdminPolicy")
        .WithName("CreateCategory")
        .WithSummary("Tạo danh mục mới (Yêu cầu quyền Admin)")
        .WithDescription("Tự động sinh slug chuẩn SEO, kiểm tra trùng lặp tên và tự động xóa cache danh mục.")
        .Produces<CategoryDto>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status403Forbidden)
        .ProducesProblem(StatusCodes.Status409Conflict);

        // 4. PUT /api/v1/categories/{id} - Admin only
        group.MapPut("/{id:guid}", async (
            Guid id,
            [FromBody] UpdateCategoryRequest request,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var command = new UpdateCategoryCommand(
                id,
                request.Name,
                request.Description,
                request.ImageUrl,
                request.OrderIndex,
                request.RowVersion ?? []);

            var result = await mediator.Send(command, ct);
            return Results.Ok(result);
        })
        .RequireAuthorization("AdminPolicy")
        .WithName("UpdateCategory")
        .WithSummary("Cập nhật thông tin danh mục (Yêu cầu quyền Admin, bảo toàn Slug)")
        .WithDescription("Cập nhật thông tin danh mục, kiểm tra optimistic concurrency qua RowVersion, bảo toàn slug để tránh broken link và xóa cache.")
        .Produces<CategoryDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status403Forbidden)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status409Conflict);

        // 5. DELETE /api/v1/categories/{id} - Admin only
        group.MapDelete("/{id:guid}", async (
            Guid id,
            IMediator mediator,
            CancellationToken ct) =>
        {
            await mediator.Send(new DeleteCategoryCommand(id), ct);
            return Results.NoContent();
        })
        .RequireAuthorization("AdminPolicy")
        .WithName("DeleteCategory")
        .WithSummary("Xóa mềm danh mục (Yêu cầu quyền Admin, cấm xóa nếu còn công thức)")
        .WithDescription("Đánh dấu IsDeleted = true. Trả về 409 Conflict với type CATEGORY_DELETE_HAS_RECIPES nếu danh mục còn công thức.")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status403Forbidden)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status409Conflict);

        return app;
    }
}

public record CreateCategoryRequest(
    string Name,
    string? Description = null,
    string? ImageUrl = null,
    int OrderIndex = 0);

public record UpdateCategoryRequest(
    string Name,
    string? Description = null,
    string? ImageUrl = null,
    int OrderIndex = 0,
    byte[]? RowVersion = null);
