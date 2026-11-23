using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

/// <summary>
/// Cấu hình ánh xạ Entity-Framework Core (Fluent API) cho thực thể Recipe vào bảng CSDL PostgreSQL.
/// Đảm bảo tính toàn vẹn dữ liệu, kiểm soát tranh chấp dữ liệu (Optimistic Concurrency), 
/// ánh xạ Value Object (DDD Owned Entity) và đóng gói đối tượng (Encapsulation qua Private Fields).
/// </summary>
public class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        // 1. Ánh xạ tên bảng CSDL là "Recipes"
        builder.ToTable("Recipes");

        // 2. Khóa chính (Primary Key) là cột Id (GUID)
        builder.HasKey(r => r.Id);

        // 3. Cấu hình cột Tiêu đề (Title): Tối đa 200 ký tự, bắt buộc (NOT NULL)
        builder.Property(r => r.Title)
            .HasMaxLength(200)
            .IsRequired();

        // 4. Cấu hình cột Đường dẫn định danh (Slug): Tối đa 220 ký tự, bắt buộc (NOT NULL)
        builder.Property(r => r.Slug)
            .HasMaxLength(220)
            .IsRequired();

        // 5. Tạo Unique Index cho cột Slug để tìm kiếm nhanh và đảm bảo không trùng URL (SEO Friendly)
        builder.HasIndex(r => r.Slug)
            .IsUnique();

        // 6. Mô tả (Description): kiểu 'text' trong PostgreSQL để chứa văn bản dài, bắt buộc
        builder.Property(r => r.Description)
            .HasColumnType("text")
            .IsRequired();

        // 7. Hướng dẫn tổng quan (Instructions): bắt buộc
        builder.Property(r => r.Instructions)
            .IsRequired();

        // 8. Thời gian chuẩn bị (PrepTimeMinutes): đơn vị phút, bắt buộc
        builder.Property(r => r.PrepTimeMinutes)
            .IsRequired();

        // 9. Thời gian nấu (CookTimeMinutes): đơn vị phút, bắt buộc
        builder.Property(r => r.CookTimeMinutes)
            .IsRequired();

        // 10. Khẩu phần ăn (Servings): số người ăn, bắt buộc
        builder.Property(r => r.Servings)
            .IsRequired();

        // 11. Độ khó (Difficulty): Chuyển đổi enum (Easy, Medium, Hard) thành dạng chuỗi string trong DB, tối đa 20 ký tự
        builder.Property(r => r.Difficulty)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        // 12. Trạng thái (Status): Chuyển đổi enum (Draft, Published, Archived) thành dạng chuỗi string trong DB, tối đa 20 ký tự
        builder.Property(r => r.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        // 13. Lượt xem (ViewCount): kiểu bigint (Int64), mặc định bằng 0, bắt buộc
        builder.Property(r => r.ViewCount)
            .HasDefaultValue(0L)
            .IsRequired();

        // 14. Lượt đánh dấu lưu bài (BookmarkCount): mặc định bằng 0, bắt buộc
        builder.Property(r => r.BookmarkCount)
            .HasDefaultValue(0)
            .IsRequired();

        // 15. Kiểm soát xung đột cập nhật đồng thời (Optimistic Concurrency Control):
        // IsConcurrencyToken(): Đánh dấu cột RowVersion (bytea) là token kiểm tra xung đột khi UPDATE.
        // Khi EF Core sinh câu lệnh UPDATE, nó sẽ tự động thêm: WHERE "Id" = @id AND "RowVersion" = @oldVersion.
        // Nếu có người khác sửa trước, số dòng bị ảnh hưởng = 0 -> EF Core ném ra DbUpdateConcurrencyException (HTTP 409 Conflict).
        // ValueGeneratedNever(): Yêu cầu EF Core luôn lấy giá trị byte[] do mã nguồn quản lý (AuditInterceptor) thay vì đợi DB tự sinh.
        builder.Property(r => r.RowVersion)
            .IsConcurrencyToken()
            .ValueGeneratedNever();

        // 16. Khóa ngoại liên kết Danh mục (Category) - Quan hệ 1-N:
        // Một Category có nhiều Recipe, một Recipe thuộc về một Category.
        // OnDelete(DeleteBehavior.Restrict): Ngăn xóa danh mục nếu danh mục đó vẫn còn công thức nấu ăn liên kết.
        builder.HasOne(r => r.Category)
            .WithMany(c => c.Recipes)
            .HasForeignKey(r => r.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // 17. Khóa ngoại liên kết Tác giả (Author / User) - Quan hệ 1-N:
        // Một User có nhiều Recipe, một Recipe thuộc về một AuthorId.
        // OnDelete(DeleteBehavior.Cascade): Khi tài khoản tác giả bị xóa hẳn khỏi hệ thống, các bài viết của họ cũng bị xóa theo.
        builder.HasOne(r => r.Author)
            .WithMany(u => u.Recipes)
            .HasForeignKey(r => r.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        // 18. Ánh xạ Value Object Dinh dưỡng (Owned Entity trong DDD):
        // RecipeNutrition không có bảng riêng, các thuộc tính của nó được gộp chung trực tiếp vào các cột của bảng "Recipes"
        builder.OwnsOne(r => r.Nutrition, n =>
        {
            n.Property(p => p.Calories).HasColumnName("Nutrition_Calories").HasPrecision(8, 2);
            n.Property(p => p.Protein).HasColumnName("Nutrition_Protein").HasPrecision(8, 2);
            n.Property(p => p.Carbohydrates).HasColumnName("Nutrition_Carbohydrates").HasPrecision(8, 2);
            n.Property(p => p.Fat).HasColumnName("Nutrition_Fat").HasPrecision(8, 2);
            n.Property(p => p.Fiber).HasColumnName("Nutrition_Fiber").HasPrecision(8, 2);
            n.Property(p => p.Sodium).HasColumnName("Nutrition_Sodium").HasPrecision(8, 2);
        });

        // 19. Đóng gói hướng đối tượng (DDD Encapsulation với Private Backing Fields):
        // Trong Domain Entity Recipe, các danh sách con (_steps, _ingredients, _images) là private List<T>
        // và chỉ phơi ra IReadOnlyCollection<T> bên ngoài để chống việc bên ngoài tự tiện .Add() hay .Clear().
        // Dòng cấu hình này báo cho EF Core biết phải nạp dữ liệu trực tiếp vào private backing field thay vì qua property công khai.
        builder.Navigation(r => r.Steps)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(r => r.Ingredients)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(r => r.Images)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
