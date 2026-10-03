using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

public class RecipeStepConfiguration : IEntityTypeConfiguration<RecipeStep>
{
    public void Configure(EntityTypeBuilder<RecipeStep> builder)
    {
        builder.ToTable("RecipeSteps");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.StepNumber)
            .IsRequired();

        builder.Property(s => s.Title)
            .HasMaxLength(150);

        builder.Property(s => s.Description)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(s => s.ImageUrl)
            .HasMaxLength(500);

        // Concurrency token tường minh, giá trị do client quản lý (xem chú thích
        // tương tự trong RecipeConfiguration — KHÔNG dùng IsRowVersion()).
        builder.Property(s => s.RowVersion)
            .IsConcurrencyToken()
            .ValueGeneratedNever();

        builder.HasOne(s => s.Recipe)
            .WithMany(r => r.Steps)
            .HasForeignKey(s => s.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
