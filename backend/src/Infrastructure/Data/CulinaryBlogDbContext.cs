using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Data;

public class CulinaryBlogDbContext(DbContextOptions<CulinaryBlogDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();
    public DbSet<RecipeImage> RecipeImages => Set<RecipeImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Global query filter cho Soft Delete trên tất cả BaseEntity
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                builder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.RowVersion))
                    .IsRowVersion();

                var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                var property = System.Linq.Expressions.Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var falseConstant = System.Linq.Expressions.Expression.Constant(false);
                var lambda = System.Linq.Expressions.Expression.Lambda(
                    System.Linq.Expressions.Expression.Equal(property, falseConstant), parameter);

                builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }

        // Configuration cho Recipe
        builder.Entity<Recipe>(b =>
        {
            b.ToTable("Recipes");
            b.Property(r => r.Title).HasMaxLength(200).IsRequired();
            b.Property(r => r.Slug).HasMaxLength(220).IsRequired();
            b.HasIndex(r => r.Slug).IsUnique();
            b.Property(r => r.Description).IsRequired();
            b.Property(r => r.Instructions).IsRequired();

            b.HasOne(r => r.Category)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // ON DELETE RESTRICT theo DATA_MODEL.md

            b.HasOne(r => r.Author)
                .WithMany(u => u.Recipes)
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Owned entity: RecipeNutrition
            b.OwnsOne(r => r.Nutrition, n =>
            {
                n.Property(p => p.Calories).HasColumnName("Nutrition_Calories").HasPrecision(8, 2);
                n.Property(p => p.Protein).HasColumnName("Nutrition_Protein").HasPrecision(8, 2);
                n.Property(p => p.Carbohydrates).HasColumnName("Nutrition_Carbohydrates").HasPrecision(8, 2);
                n.Property(p => p.Fat).HasColumnName("Nutrition_Fat").HasPrecision(8, 2);
                n.Property(p => p.Fiber).HasColumnName("Nutrition_Fiber").HasPrecision(8, 2);
                n.Property(p => p.Sodium).HasColumnName("Nutrition_Sodium").HasPrecision(8, 2);
            });
        });

        // Category Configuration
        builder.Entity<Category>(b =>
        {
            b.ToTable("Categories");
            b.Property(c => c.Name).HasMaxLength(100).IsRequired();
            b.HasIndex(c => c.Name).IsUnique();
            b.Property(c => c.Slug).HasMaxLength(120).IsRequired();
            b.HasIndex(c => c.Slug).IsUnique();
        });

        // RefreshToken Configuration
        builder.Entity<RefreshToken>(b =>
        {
            b.ToTable("RefreshTokens");
            b.HasKey(rt => rt.Id);
            b.Property(rt => rt.TokenHash).HasMaxLength(64).IsRequired();
            b.HasIndex(rt => rt.TokenHash).IsUnique();
            b.HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
