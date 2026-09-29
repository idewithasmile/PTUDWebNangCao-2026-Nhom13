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

        group.MapPut("/{id:guid}", UpdateRecipe)
            .RequireAuthorization()
            .Produces<RecipeDto>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status422UnprocessableEntity);

        return group;
    }

    private static async Task<IResult> CreateRecipe(CreateRecipeCommand command, IMediator mediator)
    {
        var result = await mediator.Send(command);
        return Results.Created($"/api/v1/recipes/{result.Slug}", result);
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
}
