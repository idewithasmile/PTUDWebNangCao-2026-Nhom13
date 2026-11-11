using System.Security.Claims;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeIngredient;
using CulinaryBlog.Application.Features.Recipes.Commands.AddRecipeStep;
using CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeImage;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeIngredient;
using CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipeStep;
using CulinaryBlog.Application.Features.Recipes.Commands.SetPrimaryImage;
using CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeIngredient;
using CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipeStep;
using CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;
using CulinaryBlog.Application.Features.Recipes.Commands.ToggleRecipeBookmark;
using CulinaryBlog.Application.Features.Recipes.Commands.SyncLocalBookmarks;
using CulinaryBlog.Application.Features.Recipes.Queries.GetMyBookmarks;
using CulinaryBlog.Application.Features.Recipes.Queries.GetBatchRecipesSummary;
using CulinaryBlog.Application.Features.Recipes.Queries.CheckRecipeBookmarkStatus;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using StackExchange.Redis;

namespace CulinaryBlog.API.Endpoints;

public static class RecipesEndpoints
{
    public static RouteGroupBuilder MapRecipesEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/", CreateRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        group.MapGet("/", GetRecipes)
            .AllowAnonymous()
            .CacheOutput("PublicRecipes")
            .Produces<PagedResult<RecipeSummaryDto>>(StatusCodes.Status200OK);

        group.MapGet("/search", SearchRecipes)
            .AllowAnonymous()
            .WithName("SearchRecipes")
            .WithSummary("Tìm kiếm toàn văn bản công thức (Full-Text Search) hỗ trợ tiếng Việt không dấu (FR-SRCH-001)")
            .WithDescription("Tìm kiếm công thức nấu ăn bằng PostgreSQL tsvector, unaccent và ts_rank. Hỗ trợ tìm kiếm tiếng Việt không dấu, phân quyền theo tác nhân và phân trang dữ liệu.")
            .Produces<PaginatedResult<RecipeSummaryDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        group.MapGet("/{slug}", GetRecipeBySlug)
            .AllowAnonymous()
            .CacheOutput("PublicRecipeDetail")
            .Produces<RecipeDetailDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}", UpdateRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        group.MapPatch("/{id:guid}/publish", PublishRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        group.MapPatch("/{id:guid}/unpublish", UnpublishRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapPatch("/{id:guid}/archive", ArchiveRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}", DeleteRecipe)
            .RequireAuthorization()
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-008: Upload ảnh (multipart/form-data, field "file"). Proxy upload
        // qua Backend để validate size/MIME/magic-bytes (SPEC.md §FR-RCP-008).
        group.MapPost("/{id:guid}/images", UploadImage)
            .RequireAuthorization()
            .DisableAntiforgery()
            .Accepts<IFormFile>("multipart/form-data")
            .WithName("UploadRecipeImage")
            .WithSummary("Tải ảnh công thức lên qua Proxy MinIO (FR-RCP-008 & FR-FILE-001)")
            .Produces<RecipeImageDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status503ServiceUnavailable);

        // FR-RCP-008: Đặt ảnh chính.
        group.MapPatch("/{id:guid}/images/{imageId:guid}/primary", SetPrimaryImage)
            .RequireAuthorization()
            .Produces<RecipeImageDto>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-008: Xóa ảnh (entity xóa đồng bộ, file MinIO xóa qua Hangfire).
        group.MapDelete("/{id:guid}/images/{imageId:guid}", DeleteRecipeImage)
            .RequireAuthorization()
            .Produces(StatusCodes.Status204NoContent)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-009: Thêm nguyên liệu.
        group.MapPost("/{id:guid}/ingredients", AddRecipeIngredient)
            .RequireAuthorization()
            .Produces<RecipeIngredientDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-009: Cập nhật nguyên liệu.
        group.MapPut("/{id:guid}/ingredients/{ingId:guid}", UpdateRecipeIngredient)
            .RequireAuthorization()
            .Produces<RecipeIngredientDto>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-009: Xóa nguyên liệu.
        group.MapDelete("/{id:guid}/ingredients/{ingId:guid}", DeleteRecipeIngredient)
            .RequireAuthorization()
            .Produces(StatusCodes.Status204NoContent)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-010: Thêm bước thực hiện (StepNumber tự tăng Max + 1).
        group.MapPost("/{id:guid}/steps", AddRecipeStep)
            .RequireAuthorization()
            .Produces<RecipeStepDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-010: Cập nhật bước thực hiện.
        group.MapPut("/{id:guid}/steps/{stepId:guid}", UpdateRecipeStep)
            .RequireAuthorization()
            .Produces<RecipeStepDto>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // FR-RCP-010: Xóa bước (tự renumber các bước còn lại).
        group.MapDelete("/{id:guid}/steps/{stepId:guid}", DeleteRecipeStep)
            .RequireAuthorization()
            .Produces(StatusCodes.Status204NoContent)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // Ghi nhận lượt xem (hỗ trợ cả ẩn danh và đã đăng nhập, qua Redis buffer)
        group.MapPost("/{id:guid}/view", RecordView)
            .AllowAnonymous()
            .Produces(StatusCodes.Status204NoContent);

        // Lưu / Bỏ lưu công thức (Bookmark toggle)
        group.MapPost("/{id:guid}/bookmark", ToggleBookmark)
            .RequireAuthorization()
            .Produces<ToggleBookmarkResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // Kiểm tra trạng thái lưu công thức của người dùng hiện tại
        group.MapGet("/{id:guid}/bookmark-status", CheckBookmarkStatus)
            .AllowAnonymous()
            .Produces<bool>(StatusCodes.Status200OK);

        // Lấy danh sách món đã lưu của người dùng hiện tại
        group.MapGet("/bookmarks/me", GetMyBookmarks)
            .RequireAuthorization()
            .Produces<PagedResult<RecipeSummaryDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        // Đồng bộ danh sách món từ localStorage của khách vãng lai khi vừa đăng nhập
        group.MapPost("/bookmarks/sync", SyncLocalBookmarks)
            .RequireAuthorization()
            .Produces<SyncLocalBookmarksResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        // Lấy danh sách tóm tắt cho nhiều công thức (dành cho trang /saved-recipes của khách vãng lai)
        group.MapPost("/batch-summary", GetBatchSummary)
            .AllowAnonymous()
            .Produces<List<RecipeSummaryDto>>(StatusCodes.Status200OK);

        return group;
    }

    private static async Task<IResult> CreateRecipe(
        CreateRecipeCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore? cacheStore = null,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(command, ct);
        if (cacheStore != null)
        {
            await cacheStore.EvictByTagAsync("recipes", ct);
            await cacheStore.EvictByTagAsync("categories", ct);
        }
        return Results.Created($"/api/v1/recipes/{result.Slug}", result);
    }

    private static async Task<IResult> GetRecipes(
        [AsParameters] CulinaryBlog.Application.Features.Recipes.Queries.GetRecipes.GetRecipesQuery query,
        IMediator mediator)
    {
        var result = await mediator.Send(query);
        return Results.Ok(result);
    }

    private static async Task<IResult> GetRecipeBySlug(
        string slug,
        IMediator mediator)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Queries.GetRecipeBySlug.GetRecipeBySlugQuery(slug));
        return Results.Ok(result);
    }

    private static async Task<IResult> UpdateRecipe(
        Guid id,
        CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipe.UpdateRecipeCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore? cacheStore = null,
        CancellationToken ct = default)
    {
        if (id != command.Id)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với Id trong body." });
        }

        var result = await mediator.Send(command, ct);
        if (cacheStore != null)
        {
            await cacheStore.EvictByTagAsync("recipes", ct);
            await cacheStore.EvictByTagAsync("categories", ct);
        }
        return Results.Ok(result);
    }

    private static async Task<IResult> PublishRecipe(
        Guid id,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe.PublishRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        await cacheStore.EvictByTagAsync("categories", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> UnpublishRecipe(
        Guid id,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.UnpublishRecipe.UnpublishRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        await cacheStore.EvictByTagAsync("categories", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> ArchiveRecipe(
        Guid id,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe.ArchiveRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        await cacheStore.EvictByTagAsync("categories", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteRecipe(
        Guid id,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.DeleteRecipe.DeleteRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        await cacheStore.EvictByTagAsync("categories", ct);
        return Results.NoContent();
    }

    private static async Task<IResult> UploadImage(
        Guid id,
        IFormFile file,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        [FromForm] string? altText,
        CancellationToken ct)
    {
        if (file is null || file.Length == 0)
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                { "file", ["File ảnh là bắt buộc (form field \"file\")."] }
            });
        }

        byte[] content;
        using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms, ct);
            content = ms.ToArray();
        }

        var result = await mediator.Send(new UploadRecipeImageCommand(
            id,
            content,
            file.FileName,
            file.ContentType,
            altText), ct);

        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Created($"/api/v1/recipes/{id}/images/{result.Id}", result);
    }

    private static async Task<IResult> SetPrimaryImage(
        Guid id,
        Guid imageId,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new SetPrimaryImageCommand(id, imageId), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteRecipeImage(
        Guid id,
        Guid imageId,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        await mediator.Send(new DeleteRecipeImageCommand(id, imageId), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.NoContent();
    }

    private static async Task<IResult> AddRecipeIngredient(
        Guid id,
        AddRecipeIngredientCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        if (id != command.RecipeId)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với RecipeId trong body." });
        }

        var result = await mediator.Send(command, ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Created($"/api/v1/recipes/{id}/ingredients/{result.Id}", result);
    }

    private static async Task<IResult> UpdateRecipeIngredient(
        Guid id,
        Guid ingId,
        UpdateRecipeIngredientCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        if (id != command.RecipeId || ingId != command.IngredientId)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với Id trong body." });
        }

        var result = await mediator.Send(command, ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteRecipeIngredient(
        Guid id,
        Guid ingId,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        await mediator.Send(new DeleteRecipeIngredientCommand(id, ingId), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.NoContent();
    }

    private static async Task<IResult> AddRecipeStep(
        Guid id,
        AddRecipeStepCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        if (id != command.RecipeId)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với RecipeId trong body." });
        }

        var result = await mediator.Send(command, ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Created($"/api/v1/recipes/{id}/steps/{result.Id}", result);
    }

    private static async Task<IResult> UpdateRecipeStep(
        Guid id,
        Guid stepId,
        UpdateRecipeStepCommand command,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        if (id != command.RecipeId || stepId != command.StepId)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với Id trong body." });
        }

        var result = await mediator.Send(command, ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> DeleteRecipeStep(
        Guid id,
        Guid stepId,
        IMediator mediator,
        [FromServices] Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        await mediator.Send(new DeleteRecipeStepCommand(id, stepId), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.NoContent();
    }

    private static async Task<IResult> SearchRecipes(
        [FromQuery] string? q,
        [FromQuery] string? searchTerm,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        [FromQuery] Guid? categoryId,
        [FromQuery] CulinaryBlog.Domain.Enums.RecipeDifficulty? difficulty,
        ClaimsPrincipal user,
        IMediator mediator,
        CancellationToken ct)
    {
        var queryTerm = q ?? searchTerm;
        if (string.IsNullOrWhiteSpace(queryTerm) || queryTerm.Trim().Length < 2)
        {
            return Results.UnprocessableEntity(new ProblemDetails
            {
                Status = StatusCodes.Status422UnprocessableEntity,
                Type = "INVALID_SEARCH_TERM",
                Title = "Tham số tìm kiếm không hợp lệ",
                Detail = "Từ khóa tìm kiếm phải có tối thiểu 2 ký tự (FR-SRCH-001)."
            });
        }

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? user.FindFirst("sub")?.Value;
        var isAdmin = user.IsInRole("Admin")
                      || user.FindFirst(ClaimTypes.Role)?.Value == "Admin"
                      || user.FindFirst("role")?.Value == "Admin";

        var query = new SearchRecipesQuery(
            queryTerm.Trim(),
            page ?? 1,
            pageSize ?? 10,
            categoryId,
            difficulty,
            userId,
            isAdmin);

        var result = await mediator.Send(query, ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> RecordView(
        Guid id,
        HttpContext context,
        IConnectionMultiplexer redis)
    {
        var db = redis.GetDatabase();

        string viewerId;
        if (context.User.Identity?.IsAuthenticated == true)
        {
            viewerId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? context.User.FindFirst("sub")?.Value
                ?? "anon";
        }
        else
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown_ip";
            var ua = context.Request.Headers.UserAgent.ToString();
            using var sha = System.Security.Cryptography.SHA256.Create();
            var hash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes($"{ip}_{ua}"));
            viewerId = Convert.ToHexString(hash)[..16];
        }

        string cooldownKey = $"view_lock:{id}:{viewerId}";
        bool isNew = await db.StringSetAsync(cooldownKey, "1", TimeSpan.FromMinutes(30), When.NotExists);

        if (isNew)
        {
            await db.StringIncrementAsync($"recipe:view:buffer:{id}");
        }

        return Results.NoContent();
    }

    private static async Task<IResult> ToggleBookmark(
        Guid id,
        ClaimsPrincipal user,
        ISender sender)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? user.FindFirst("sub")?.Value
            ?? string.Empty;

        var result = await sender.Send(new ToggleRecipeBookmarkCommand(id, userId));
        return Results.Ok(result);
    }

    private static async Task<IResult> CheckBookmarkStatus(
        Guid id,
        ISender sender)
    {
        var result = await sender.Send(new CheckRecipeBookmarkStatusQuery(id));
        return Results.Ok(result);
    }

    private static async Task<IResult> GetMyBookmarks(
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? sortBy,
        ISender sender)
    {
        var result = await sender.Send(new GetMyBookmarksQuery(page ?? 1, pageSize ?? 10, search, category, sortBy));
        return Results.Ok(result);
    }

    private static async Task<IResult> SyncLocalBookmarks(
        [FromBody] List<Guid> recipeIds,
        ISender sender)
    {
        var result = await sender.Send(new SyncLocalBookmarksCommand(recipeIds));
        return Results.Ok(result);
    }

    private static async Task<IResult> GetBatchSummary(
        [FromBody] List<Guid> recipeIds,
        ISender sender)
    {
        var result = await sender.Send(new GetBatchRecipesSummaryQuery(recipeIds));
        return Results.Ok(result);
    }
}
