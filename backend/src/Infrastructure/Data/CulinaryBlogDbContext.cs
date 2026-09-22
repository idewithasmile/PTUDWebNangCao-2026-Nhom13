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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Khai báo RecipeNutrition là Owned Entity (nhúng vào bảng Recipes)
        modelBuilder.Entity<Recipe>()
            .OwnsOne(r => r.Nutrition, n =>
            {
                n.Property(x => x.Calories).HasColumnName("Nutrition_Calories");
                n.Property(x => x.Protein).HasColumnName("Nutrition_Protein");
                n.Property(x => x.Carbohydrates).HasColumnName("Nutrition_Carbohydrates");
                n.Property(x => x.Fat).HasColumnName("Nutrition_Fat");
                n.Property(x => x.Fiber).HasColumnName("Nutrition_Fiber");
                n.Property(x => x.Sodium).HasColumnName("Nutrition_Sodium");
            });

        // Cấu hình các EntityConfigurations khác nếu có
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CulinaryBlogDbContext).Assembly);
    }
}
