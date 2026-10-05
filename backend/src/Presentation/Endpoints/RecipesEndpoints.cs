using System.Security.Claims;
using CulinaryBlog.Application.Common.Models;
using CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Features.Recipes.Queries.SearchRecipes;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

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
            .CacheOutput(policy => policy
                .Expire(TimeSpan.FromMinutes(5))
                .SetVaryByQuery("page", "pageSize", "searchTerm", "categoryId", "difficulty", "maxTotalTimeMinutes", "sortBy")
                .Tag("recipes"))
            .Produces<CulinaryBlog.Application.Common.Models.PagedResult<RecipeSummaryDto>>(StatusCodes.Status200OK);

        group.MapGet("/search", SearchRecipes)
            .AllowAnonymous()
            .WithName("SearchRecipes")
            .WithSummary("Tìm kiếm toàn văn bản công thức (Full-Text Search) hỗ trợ tiếng Việt không dấu (FR-SRCH-001)")
            .WithDescription("Tìm kiếm công thức nấu ăn bằng PostgreSQL tsvector, unaccent và ts_rank. Hỗ trợ tìm kiếm tiếng Việt không dấu, phân quyền theo tác nhân và phân trang dữ liệu.")
            .Produces<PaginatedResult<RecipeSummaryDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        group.MapGet("/{slug}", GetRecipeBySlug)
            .AllowAnonymous()
            .CacheOutput(policy => policy
                .Expire(TimeSpan.FromMinutes(60))
                .Tag("recipes"))
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

        return group;
    }

    private static async Task<IResult> CreateRecipe(CreateRecipeCommand command, IMediator mediator)
    {
        var result = await mediator.Send(command);
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
        IMediator mediator)
    {
        if (id != command.Id)
        {
            return Results.BadRequest(new { message = "Id trên URL không khớp với Id trong body." });
        }

        var result = await mediator.Send(command);
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
}

