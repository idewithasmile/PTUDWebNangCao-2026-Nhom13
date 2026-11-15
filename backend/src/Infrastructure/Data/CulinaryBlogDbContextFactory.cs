using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CulinaryBlog.Infrastructure.Data;

/// <summary>
/// Design-time factory hỗ trợ `dotnet ef migrations` không phụ thuộc startup host đầy đủ.
/// </summary>
public sealed class CulinaryBlogDbContextFactory : IDesignTimeDbContextFactory<CulinaryBlogDbContext>
{
    public CulinaryBlogDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Port=5433;Database=culinary_blog;Username=postgres;Password=postgres_dev_password";

        var optionsBuilder = new DbContextOptionsBuilder<CulinaryBlogDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new CulinaryBlogDbContext(optionsBuilder.Options);
    }
}
