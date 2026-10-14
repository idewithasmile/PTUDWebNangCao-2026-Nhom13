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

        // FR-RCP-008: Upload ảnh (multipart/form-data, field "file"). Proxy upload
        // qua Backend để validate size/MIME/magic-bytes (SPEC.md §FR-RCP-008).
        group.MapPost("/{id:guid}/images", UploadImage)
            .RequireAuthorization()
            .DisableAntiforgery()
            .Accepts<IFormFile>("multipart/form-data")
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
}
