using CulinaryBlog.Application.Common.Exceptions;

using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Helpers;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Recipes.Commands.CreateRecipe;

public class CreateRecipeCommandHandler(
    IRecipeRepository recipeRepository,
    CulinaryBlog.Domain.Common.Interfaces.ICategoryRepository categoryRepository,
    Domain.Common.Interfaces.IUnitOfWork unitOfWork,
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

        var category = await categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
        {
            throw new BusinessRuleValidationException("CATEGORY_NOT_FOUND", $"Danh mục với ID '{request.CategoryId}' không tồn tại.");
        }

        var slug = SlugHelper.Generate(request.Title);
        var isUnique = await recipeRepository.IsSlugUniqueAsync(slug, cancellationToken);
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

        // 1. Thêm Steps
        if (request.Steps != null && request.Steps.Count > 0)
        {
            foreach (var step in request.Steps)
            {
                if (!string.IsNullOrWhiteSpace(step.Description))
                {
                    recipe.AddStep(step.Title ?? string.Empty, step.Description, step.TimerMinutes, step.ImageUrl);
                }
            }
        }
        else if (!string.IsNullOrWhiteSpace(request.Instructions))
        {
            // Tự động tạo Bước 1 từ Instructions nếu người dùng chỉ nhập văn bản hướng dẫn chung
            recipe.AddStep("Hướng dẫn thực hiện", request.Instructions);
        }

        // 2. Thêm Ingredients
        if (request.Ingredients != null && request.Ingredients.Count > 0)
        {
            foreach (var ing in request.Ingredients)
            {
                if (!string.IsNullOrWhiteSpace(ing.Name))
                {
                    recipe.AddIngredient(ing.Name, ing.Quantity, ing.Unit, ing.Notes);
                }
            }
        }

        // 3. Thêm Primary Image
        if (!string.IsNullOrWhiteSpace(request.PrimaryImageUrl))
        {
            recipe.AddImage(request.PrimaryImageUrl, isPrimary: true);
        }

        await recipeRepository.AddAsync(recipe, cancellationToken);
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
