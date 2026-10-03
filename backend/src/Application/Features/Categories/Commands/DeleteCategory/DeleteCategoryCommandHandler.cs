using CulinaryBlog.Domain.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Exceptions;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Commands.DeleteCategory;

public class DeleteCategoryCommandHandler(
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteCategoryCommand>
{
    public async Task Handle(DeleteCategoryCommand request, CancellationToken ct)
    {
        // 1. Kiểm tra tồn tại danh mục
        var category = await categoryRepository.GetByIdAsync(request.Id, ct);
        if (category is null)
        {
            throw new EntityNotFoundException("CATEGORY_NOT_FOUND", $"Danh mục với Id '{request.Id}' không tồn tại.");
        }

        // 2. Ràng buộc toàn vẹn: Kiểm tra số lượng recipes đang hoạt động (!IsDeleted)
        var hasActiveRecipes = await categoryRepository.HasActiveRecipesAsync(request.Id, ct);
        if (hasActiveRecipes)
        {
            var activeRecipeCount = await categoryRepository.GetActiveRecipeCountAsync(request.Id, ct);
            throw new CategoryNotEmptyException(category.Name, activeRecipeCount > 0 ? activeRecipeCount : 1);
        }

        // 3. Thực hiện Soft Delete theo FR-CAT-005 và SPEC.md Mâu thuẫn 8
        category.IsDeleted = true;
        category.UpdatedAt = DateTime.UtcNow;
        category.RowVersion = Guid.NewGuid().ToByteArray();

        categoryRepository.SoftDelete(category);
        await unitOfWork.SaveChangesAsync(ct);
    }
}
