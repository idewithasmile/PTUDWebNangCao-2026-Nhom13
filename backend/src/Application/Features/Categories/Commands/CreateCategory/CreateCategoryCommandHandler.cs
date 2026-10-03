using CulinaryBlog.Application.Common.Exceptions;
using CulinaryBlog.Application.Common.Helpers;
using CulinaryBlog.Application.Features.Categories.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler(
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken ct)
    {
        // 1. Kiểm tra trùng Name (case-insensitive)
        var nameExists = await categoryRepository.ExistsByNameAsync(request.Name, null, ct);
        if (nameExists)
        {
            throw new ConflictException("CATEGORY_NAME_EXISTS", $"Danh mục với tên '{request.Name}' đã tồn tại trong hệ thống.");
        }

        // 2. Sinh Slug duy nhất
        var baseSlug = SlugHelper.GenerateSlug(request.Name);
        if (string.IsNullOrWhiteSpace(baseSlug))
        {
            baseSlug = "category-" + Guid.NewGuid().ToString("N")[..8];
        }

        var slug = baseSlug;
        var counter = 1;
        while (await categoryRepository.ExistsBySlugAsync(slug, null, ct))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        // 3. Tạo Entity
        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description?.Trim(),
            ImageUrl = request.ImageUrl?.Trim(),
            OrderIndex = request.OrderIndex,
            RowVersion = Guid.NewGuid().ToByteArray()
        };

        await categoryRepository.AddAsync(category, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.OrderIndex,
            0)
        {
            RowVersion = category.RowVersion
        };
    }
}
