using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Data;

public class CulinaryBlogDbContext(DbContextOptions<CulinaryBlogDbContext> options)
    : IdentityDbContext<ApplicationUser>(options), IUnitOfWork
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

        // Khai báo RecipeNutrition là Owned Entity (nhúng vào bảng Recipes) — giữ từ main (Phước).
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

        // Global query filter cho Soft Delete trên tất cả BaseEntity — từ branch Recipe.
        // RowVersion là concurrency token tường minh trên cột bytea, giá trị do client
        // quản lý (AuditInterceptor/seeder). ValueGeneratedNever để EF luôn gửi giá trị
        // client trên INSERT (Npgsql không có default cho bytea, bỏ qua sẽ vi phạm
        // NOT NULL constraint khi Seed trên PostgreSQL thật).
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.RowVersion))
                    .IsConcurrencyToken()
                    .ValueGeneratedNever();

                var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                var property = System.Linq.Expressions.Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var falseConstant = System.Linq.Expressions.Expression.Constant(false);
                var lambda = System.Linq.Expressions.Expression.Lambda(
                    System.Linq.Expressions.Expression.Equal(property, falseConstant), parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }

        // Cấu hình các EntityConfigurations khác nếu có
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CulinaryBlogDbContext).Assembly);
    }
}