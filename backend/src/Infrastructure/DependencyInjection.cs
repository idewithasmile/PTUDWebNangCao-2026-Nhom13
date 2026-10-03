using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Services;
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
            // Đồng bộ với FluentValidation rule mật khẩu (FR-AUTH-001/007).
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
            // FR-AUTH-002: sai 5 lần → lockout 15 phút (handler tự áp dụng + trả 423).
            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<CulinaryBlogDbContext>();

        services.AddStackExchangeRedisCache(opt => opt.Configuration = config.GetConnectionString("Redis"));
        services.AddScoped<ICacheService, RedisCacheService>();

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IFileStorageService, MinioFileStorageService>();

        // FR-AUTH services (Member A — module Auth).
        services.AddScoped<IRefreshTokenStore, AuthRefreshTokenStore>();
        services.AddHttpClient<IGoogleTokenValidator, GoogleTokenValidator>();
        services.AddScoped<AuthWelcomeEmailJob>();
        services.AddScoped<IWelcomeEmailDispatcher, WelcomeEmailDispatcher>();

        services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

        // Hangfire setup với PostgreSQL
        services.AddHangfire(h => h.UsePostgreSqlStorage(c => c.UseNpgsqlConnection(connectionString)));
        services.AddHangfireServer();

        return services;
    }
}
