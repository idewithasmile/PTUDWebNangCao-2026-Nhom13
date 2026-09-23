using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CulinaryBlog.Infrastructure.Data.Configurations;

public class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.ToTable("Recipes");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(r => r.Slug)
            .HasMaxLength(220)
            .IsRequired();

        builder.HasIndex(r => r.Slug)
            .IsUnique();

        builder.Property(r => r.Description)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(r => r.Instructions)
            .IsRequired();

        builder.Property(r => r.PrepTime)
            .IsRequired();

        builder.Property(r => r.CookTime)
            .IsRequired();

        builder.Property(r => r.Servings)
            .IsRequired();

        builder.Property(r => r.Difficulty)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(r => r.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(r => r.RowVersion)
            .IsRowVersion();

        // Foreign keys
        builder.HasOne(r => r.Category)
            .WithMany(c => c.Recipes)
            .HasForeignKey(r => r.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); // ON DELETE RESTRICT theo DATA_MODEL.md

        builder.HasOne(r => r.Author)
            .WithMany(u => u.Recipes)
            .HasForeignKey(r => r.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        // Owned entity: RecipeNutrition
        builder.OwnsOne(r => r.Nutrition, n =>
        {
            n.Property(p => p.Calories).HasColumnName("Nutrition_Calories").HasPrecision(8, 2);
            n.Property(p => p.Protein).HasColumnName("Nutrition_Protein").HasPrecision(8, 2);
            n.Property(p => p.Carbohydrates).HasColumnName("Nutrition_Carbohydrates").HasPrecision(8, 2);
            n.Property(p => p.Fat).HasColumnName("Nutrition_Fat").HasPrecision(8, 2);
            n.Property(p => p.Fiber).HasColumnName("Nutrition_Fiber").HasPrecision(8, 2);
            n.Property(p => p.Sodium).HasColumnName("Nutrition_Sodium").HasPrecision(8, 2);
        });

        // Navigation configuration cho Private Fields
        builder.Navigation(r => r.Steps)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(r => r.Ingredients)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(r => r.Images)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
