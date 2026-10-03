using CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;
using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
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
        Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.PublishRecipe.PublishRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> UnpublishRecipe(
        Guid id,
        IMediator mediator,
        Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.UnpublishRecipe.UnpublishRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> ArchiveRecipe(
        Guid id,
        IMediator mediator,
        Microsoft.AspNetCore.OutputCaching.IOutputCacheStore cacheStore,
        CancellationToken ct)
    {
        var result = await mediator.Send(new CulinaryBlog.Application.Features.Recipes.Commands.ArchiveRecipe.ArchiveRecipeCommand(id), ct);
        await cacheStore.EvictByTagAsync("recipes", ct);
        return Results.Ok(result);
    }
}
