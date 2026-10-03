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
    /// </summary>
    public static IEndpointRouteBuilder MapCategoriesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/categories")
                       .WithTags("Categories");

        // 1. GET /api/v1/categories - Public, Redis cached (TTL 30m)
        group.MapGet("/", async (IMediator mediator, CancellationToken ct) =>
        {
            var result = await mediator.Send(new GetCategoriesQuery(), ct);
            return Results.Ok(result);
        })
        .WithName("GetCategories")
        .WithSummary("Lấy danh sách tất cả danh mục kèm số lượng bài viết (Cached Redis 30m)")
        .WithDescription("Trả về danh sách danh mục sắp xếp theo thứ tự OrderIndex và Name, kèm theo số lượng công thức đang hoạt động.")
        .Produces<List<CategoryDto>>(StatusCodes.Status200OK);

        // 2. GET /api/v1/categories/{slug} - Public, phân trang query params page, pageSize (max 50)
        group.MapGet("/{slug}", async (
            string slug,
            [FromQuery] int? page,
            [FromQuery] int? pageSize,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var p = page ?? 1;
            var ps = pageSize ?? 12;
            var query = new GetCategoryBySlugQuery(slug, p, ps);
            var result = await mediator.Send(query, ct);
            return Results.Ok(result);
        })
        .WithName("GetCategoryBySlug")
        .WithSummary("Lấy thông tin chi tiết danh mục theo Slug kèm danh sách công thức phân trang")
        .WithDescription("Trả về thông tin chi tiết của danh mục và danh sách công thức nấu ăn đã xuất bản thuộc danh mục này.")
        .Produces<CategoryDetailDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

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
