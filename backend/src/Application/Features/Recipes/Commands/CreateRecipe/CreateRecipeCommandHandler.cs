using CulinaryBlog.Application.Common.Exceptions;

using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Helpers;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

public class CreateRecipeCommandHandler(
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<CreateRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(CreateRecipeCommand request, CancellationToken cancellationToken)
    {
        var authorId = currentUser.UserId;
        if (string.IsNullOrEmpty(authorId))
        {
            throw new ForbiddenException("FORBIDDEN", "Bạn cần đăng nhập để thực hiện chức năng này.");
        }

        var slug = SlugHelper.Generate(request.Title);
        var isUnique = await unitOfWork.Recipes.IsSlugUniqueAsync(slug, cancellationToken);
        if (!isUnique)
        {
            throw new ConflictException("RECIPE_CONFLICT", $"Slug '{slug}' đã tồn tại.");
        }

        // Lưu ý: Validate CategoryId tồn tại có thể làm bằng FluentValidation gọi Repository, 
        // hoặc ở đây. Nếu category không tồn tại, trả về 422. (Hiện tại mock)
        // var categoryExists = await unitOfWork.Categories.ExistsAsync(request.CategoryId);
        // if (!categoryExists) throw new CulinaryBlog.Domain.Exceptions.DomainException("Danh mục không tồn tại");

        var nutrition = new CulinaryBlog.Domain.ValueObjects.RecipeNutrition(
            request.Calories, request.Protein, request.Carbs, request.Fat);

        var recipe = Recipe.Create(
            request.Title,
            slug,
            request.Description,
            request.Instructions,
            request.PrepTimeMinutes,
            request.CookTimeMinutes,
            request.Servings,
            request.Difficulty,
            request.CategoryId,
            authorId,
            nutrition);

        await unitOfWork.Recipes.AddAsync(recipe, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new RecipeDto(
            recipe.Id,
            recipe.Title,
            recipe.Slug,
            recipe.Status,
            recipe.AuthorId,
            recipe.CategoryId,
            recipe.CreatedAt,
            recipe.UpdatedAt);
    }
}
