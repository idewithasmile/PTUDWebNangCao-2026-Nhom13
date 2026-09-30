namespace CulinaryBlog.Domain.Exceptions;

/// <summary>
/// Ngoại lệ ném ra khi cố gắng xóa một Danh mục vẫn còn chứa công thức (Recipes) đang hoạt động.
/// Tuân thủ ràng buộc toàn vẹn dữ liệu (Mâu thuẫn 8 / FR-CAT-005) -> Trả về HTTP 409 Conflict.
/// </summary>
public class CategoryNotEmptyException : DomainException
{
    public CategoryNotEmptyException(string categoryName, int recipeCount)
        : base("CATEGORY_DELETE_HAS_RECIPES",
               $"Không thể xóa danh mục '{categoryName}' vì vẫn còn {recipeCount} công thức nấu ăn đang hoạt động.")
    {
    }

    public CategoryNotEmptyException(string message)
        : base("CATEGORY_DELETE_HAS_RECIPES", message)
    {
    }
}
