using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Repositories;

/// <summary>
/// REPOSITORY THAO TÁC CƠ SỞ DỮ LIỆU BẢNG RECIPES (INFRASTRUCTURE LAYER):
/// Nhiệm vụ:
/// 1. Triển khai các câu truy vấn LINQ tương tác với Entity Framework Core và PostgreSQL.
/// 2. Áp dụng Eager Loading (.Include) để chống triệt để vấn đề N+1 Query.
/// 3. Thuật toán tự động sinh và xử lý Slug không trùng lặp (GenerateUniqueSlugAsync).
/// </summary>
public class RecipeRepository(CulinaryBlogDbContext dbContext) : BaseRepository<Recipe>(dbContext), IRecipeRepository
{
    /// <summary>
    /// Tìm bài viết theo Id kèm nạp sẵn danh sách Steps và Images (chỉ lấy bài chưa bị xóa mềm)
    /// </summary>
    public override Task<Recipe?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Steps)
            .Include(r => r.Images)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);
    }

    /// <summary>
    /// Tìm bài viết kèm nạp hình ảnh để phục vụ việc cập nhật/xóa ảnh
    /// </summary>
    public Task<Recipe?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Images)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, ct);
    }

    /// <summary>
    /// EAGER LOADING TOÀN PHẦN THEO SLUG:
    /// Nạp đồng thời tất cả các bảng quan hệ (Steps, Ingredients, Images, Category, Author)
    /// chỉ trong 1 truy vấn để trang chi tiết món ăn hiển thị tức thì.
    /// </summary>
    public Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return Context.Recipes
            .Include(r => r.Steps)
            .Include(r => r.Ingredients)
            .Include(r => r.Images)
            .Include(r => r.Category)
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.Slug == slug, ct);
    }

    /// <summary>
    /// Kiểm tra tính duy nhất của Slug trong bảng Recipes
    /// </summary>
    public Task<bool> IsSlugUniqueAsync(string slug, CancellationToken ct = default)
    {
        return Context.Recipes
            .AllAsync(r => r.Slug != slug, ct);
    }

    /// <summary>
    /// THUẬT TOÁN SINH SLUG DUY NHẤT:
    /// 1. Nếu slug "banh-mi" chưa có -> lấy luôn "banh-mi".
    /// 2. Nếu đã có -> quét toàn bộ slug có tiền tố "banh-mi-" đưa vào HashSet.
    /// 3. Dùng vòng lặp tìm số đuôi nhỏ nhất chưa bị trùng ("banh-mi-2", "banh-mi-3"...).
    /// </summary>
    public async Task<string> GenerateUniqueSlugAsync(string baseSlug, CancellationToken ct = default)
    {
        var cleanedBaseSlug = string.IsNullOrWhiteSpace(baseSlug) ? "cong-thuc" : baseSlug.Trim().ToLowerInvariant();

        var isUnique = await IsSlugUniqueAsync(cleanedBaseSlug, ct);
        if (isUnique)
        {
            return cleanedBaseSlug;
        }

        var prefix = cleanedBaseSlug + "-";
        var existingSlugs = await Context.Recipes
            .AsNoTracking()
            .Where(r => r.Slug == cleanedBaseSlug || r.Slug.StartsWith(prefix))
            .Select(r => r.Slug)
            .ToListAsync(ct);

        var slugSet = new HashSet<string>(existingSlugs, StringComparer.OrdinalIgnoreCase);
        if (!slugSet.Contains(cleanedBaseSlug))
        {
            return cleanedBaseSlug;
        }

        int counter = 2;
        while (slugSet.Contains($"{cleanedBaseSlug}-{counter}"))
        {
            counter++;
        }

        return $"{cleanedBaseSlug}-{counter}";
    }

    /// <summary>
    /// Trả về IQueryable phục vụ việc ghép nối bộ lọc (Filter), sắp xếp (Sort) và phân trang ở tầng Application
    /// </summary>
    public IQueryable<Recipe> GetQueryable()
    {
        return Context.Recipes.AsQueryable();
    }

    public bool IsPostgreSql => Context.Database.IsNpgsql();
}
