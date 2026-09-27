using System.Collections;
using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler(
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken ct)
    {
        // 1. Kiểm tra tồn tại
        var category = await categoryRepository.GetByIdAsync(request.Id, ct);
        if (category is null)
        {
            throw new NotFoundException("CATEGORY_NOT_FOUND", $"Danh mục với Id '{request.Id}' không tồn tại.");
        }

        // 2. Kiểm tra trùng Name với danh mục khác (case-insensitive)
        var nameExists = await categoryRepository.ExistsByNameAsync(request.Name, request.Id, ct);
        if (nameExists)
        {
            throw new ConflictException("CATEGORY_NAME_EXISTS", $"Danh mục với tên '{request.Name}' đã tồn tại trong hệ thống.");
        }

        // 3. Kiểm tra Concurrency qua RowVersion
        if (request.RowVersion.Length > 0 && category.RowVersion.Length > 0 &&
            !StructuralComparisons.StructuralEqualityComparer.Equals(category.RowVersion, request.RowVersion))
        {
            throw new ConflictException(
                "CATEGORY_CONCURRENCY_CONFLICT",
                "Danh mục đã bị thay đổi bởi người dùng khác trong khi bạn đang thao tác. Vui lòng tải lại dữ liệu mới nhất.");
        }

        // 4. Cập nhật thông tin - TUYỆT ĐỐI KHÔNG ĐỔI SLUG theo FR-CAT-004
        category.Name = request.Name.Trim();
        category.Description = request.Description?.Trim();
        category.ImageUrl = request.ImageUrl?.Trim();
        category.OrderIndex = request.OrderIndex;
        category.UpdatedAt = DateTime.UtcNow;
        category.RowVersion = Guid.NewGuid().ToByteArray();

        categoryRepository.Update(category);
        await unitOfWork.SaveChangesAsync(ct);

        // Lấy số lượng recipe hiện tại
        var recipeCount = await categoryRepository.GetActiveRecipeCountAsync(category.Id, ct);

        return new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.OrderIndex,
            recipeCount)
        {
            RowVersion = category.RowVersion
        };
    }
}
