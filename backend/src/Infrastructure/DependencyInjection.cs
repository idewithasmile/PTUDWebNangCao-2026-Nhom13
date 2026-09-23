using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Data.Interceptors;
using CulinaryBlog.Infrastructure.Repositories;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CulinaryBlog.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var connectionString = config.GetConnectionString("DefaultConnection")!;

        services.AddSingleton<AuditInterceptor>();
        services.AddDbContext<CulinaryBlogDbContext>((sp, options) =>
        {
            options.UseNpgsql(connectionString)
                   .AddInterceptors(sp.GetRequiredService<AuditInterceptor>());
        });

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 8;
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<CulinaryBlogDbContext>();

        services.AddStackExchangeRedisCache(opt => opt.Configuration = config.GetConnectionString("Redis"));
        services.AddScoped<ICacheService, RedisCacheService>();

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IFileStorageService, MinioFileStorageService>();
        services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

        // Hangfire setup với PostgreSQL
        services.AddHangfire(h => h.UsePostgreSqlStorage(c => c.UseNpgsqlConnection(connectionString)));
        services.AddHangfireServer();

        return services;
    }
}
