using CulinaryBlog.Application.Common.Exceptions;

using CulinaryBlog.Application.Features.Recipes.DTOs;
using CulinaryBlog.Application.Helpers;
using CulinaryBlog.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Features.Recipes.Commands.UpdateRecipe;

public class UpdateRecipeCommandHandler(
    IUnitOfWork unitOfWork,
    ICurrentUser currentUser)
    : IRequestHandler<UpdateRecipeCommand, RecipeDto>
{
    public async Task<RecipeDto> Handle(UpdateRecipeCommand request, CancellationToken cancellationToken)
    {
        var recipe = await unitOfWork.Recipes.GetByIdAsync(request.Id, cancellationToken);
        if (recipe == null)
        {
            throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {request.Id}");
        }

        // Check Authorization (Resource-based)
        // Hiện tại chỉ owner mới được sửa (có thể mở rộng cho Admin sau nếu có role claims)
        if (recipe.AuthorId != currentUser.UserId)
        {
            throw new ForbiddenException("FORBIDDEN", "Bạn không có quyền chỉnh sửa công thức này.");
        }

        var slug = SlugHelper.Generate(request.Title);
        // Kiểm tra slug có bị trùng với recipe khác không
        if (recipe.Slug != slug)
        {
            var isUnique = await unitOfWork.Recipes.IsSlugUniqueAsync(slug, cancellationToken);
            if (!isUnique)
            {
                throw new ConflictException("RECIPE_CONFLICT", $"Slug '{slug}' đã tồn tại.");
            }
        }

        var nutrition = new CulinaryBlog.Domain.ValueObjects.RecipeNutrition(
            request.Calories, request.Protein, request.Carbs, request.Fat);

        recipe.Update(
            request.Title,
            slug,
            request.Description,
            request.Instructions,
            request.PrepTimeMinutes,
            request.CookTimeMinutes,
            request.Servings,
            request.Difficulty,
            request.CategoryId);

        recipe.SetNutrition(nutrition);

        byte[] rowVersion;
        try
        {
            rowVersion = Convert.FromBase64String(request.RowVersionBase64);
        }
        catch (FormatException)
        {
            throw new CulinaryBlog.Application.Common.Exceptions.ValidationException(
                new Dictionary<string, string[]> { { "RowVersionBase64", ["RowVersion không hợp lệ."] } });
        }

        // Set Original RowVersion for Concurrency check
        unitOfWork.Recipes.SetOriginalRowVersion(recipe, rowVersion);

        try
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConflictException("CONCURRENCY_CONFLICT", "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang.");
        }

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
