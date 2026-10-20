using CulinaryBlog.Application.Features.Recipes.DTOs;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UploadRecipeImage;

public record UploadRecipeImageCommand(
    Guid RecipeId,
    Stream FileStream,
    string FileName,
    string ContentType,
    string? AltText = null
) : IRequest<RecipeImageDto>;
