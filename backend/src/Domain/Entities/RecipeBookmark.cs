using CulinaryBlog.Domain.Common;

namespace CulinaryBlog.Domain.Entities;

public class RecipeBookmark : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public Guid RecipeId { get; set; }
    public Recipe? Recipe { get; set; }

    public RecipeBookmark() { }

    public static RecipeBookmark Create(string userId, Guid recipeId) => new()
    {
        UserId = userId,
        RecipeId = recipeId
    };
}
