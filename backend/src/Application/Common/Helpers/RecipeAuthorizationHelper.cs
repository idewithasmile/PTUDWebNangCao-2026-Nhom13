using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;

namespace CulinaryBlog.Application.Common.Helpers;

public static class RecipeAuthorizationHelper
{
    public static async Task<Recipe> LoadAndAuthorize(
        IUnitOfWork unitOfWork,
        ICurrentUser currentUser,
        Guid recipeId,
        CancellationToken ct)
    {
        var recipe = await unitOfWork.Recipes.GetByIdAsync(recipeId, ct)
            ?? throw new NotFoundException("RECIPE_NOT_FOUND", $"Không tìm thấy công thức với Id {recipeId}");
        
        if (!currentUser.IsAuthenticated)
            throw new ForbiddenException("RECIPE_FORBIDDEN", "Bạn cần đăng nhập.");
        
        if (recipe.AuthorId.ToString() != currentUser.UserId)
            throw new ForbiddenException("RECIPE_FORBIDDEN", 
                "Bạn không có quyền thực hiện thao tác này trên công thức của người khác.");
        
        return recipe;
    }
}
