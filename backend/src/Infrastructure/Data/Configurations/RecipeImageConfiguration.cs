using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

public class RecipeImageConfiguration : IEntityTypeConfiguration<RecipeImage>
{
    public void Configure(EntityTypeBuilder<RecipeImage> builder)
    {
        builder.ToTable("RecipeImages");

        builder.HasKey(img => img.Id);

        builder.Property(img => img.OriginalUrl)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(img => img.MediumUrl)
            .HasMaxLength(500);

        builder.Property(img => img.ThumbnailUrl)
            .HasMaxLength(500);

        builder.Property(img => img.AltText)
            .HasMaxLength(200);

        builder.Property(img => img.IsPrimary)
            .IsRequired();

        builder.Property(img => img.OrderIndex)
            .IsRequired();

        // Concurrency token tường minh, giá trị do client quản lý (xem chú thích
        // tương tự trong RecipeConfiguration — KHÔNG dùng IsRowVersion()).
        builder.Property(img => img.RowVersion)
            .IsConcurrencyToken()
            .ValueGeneratedNever();

        builder.HasOne(img => img.Recipe)
            .WithMany(r => r.Images)
            .HasForeignKey(img => img.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
