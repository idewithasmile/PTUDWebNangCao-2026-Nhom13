using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Domain.Interfaces;
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
            throw new NotFoundException("CATEGORY_NOT_FOUND", $"Danh mục với Id '{request.Id}' không tồn tại.");
        }

        // 2. Ràng buộc toàn vẹn: Kiểm tra số lượng recipes đang hoạt động (!IsDeleted)
        var activeRecipeCount = await categoryRepository.GetActiveRecipeCountAsync(request.Id, ct);
        if (activeRecipeCount > 0)
        {
            throw new ConflictException(
                "CATEGORY_DELETE_HAS_RECIPES",
                $"Không thể xóa danh mục '{category.Name}' vì vẫn còn {activeRecipeCount} công thức nấu ăn đang hoạt động. Vui lòng di chuyển hoặc xử lý các công thức trước.");
        }

        // 3. Thực hiện Soft Delete theo FR-CAT-005 và SPEC.md Mâu thuẫn 8
        category.IsDeleted = true;
        category.UpdatedAt = DateTime.UtcNow;
        category.RowVersion = Guid.NewGuid().ToByteArray();

        categoryRepository.SoftDelete(category);
        await unitOfWork.SaveChangesAsync(ct);
    }
}
