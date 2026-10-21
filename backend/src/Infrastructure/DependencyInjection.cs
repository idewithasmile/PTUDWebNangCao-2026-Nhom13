using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Data.Interceptors;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Repositories;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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

        // FR-JOB services & abstractions (CONS-001)
        services.AddScoped<IBackgroundJobService, HangfireBackgroundJobService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IImageProcessingService, ImageProcessingService>();
        services.AddScoped<ISitemapService, SitemapService>();

        // FR-JOB job classes
        services.AddScoped<IWelcomeEmailJob, WelcomeEmailJob>();
        services.AddScoped<WelcomeEmailJob>();
        services.AddScoped<IRecipeImageResizeJob, RecipeImageResizeJob>();
        services.AddScoped<RecipeImageResizeJob>();
        services.AddScoped<ISitemapGenerationJob, SitemapGenerationJob>();
        services.AddScoped<SitemapGenerationJob>();

        // FR-AUTH services (Member A — module Auth).
        services.AddScoped<IRefreshTokenStore, AuthRefreshTokenStore>();
        services.AddHttpClient<IGoogleTokenValidator, GoogleTokenValidator>();
        services.AddScoped<AuthWelcomeEmailJob>();
        services.AddScoped<IWelcomeEmailDispatcher, WelcomeEmailDispatcher>();

        // FR-RCP-008 (Thành viên D): cleanup file ảnh MinIO qua Hangfire (FR-FILE-002).
        services.AddScoped<RecipeImageDeleteJob>();
        services.AddScoped<CulinaryBlog.Application.Features.Recipes.Services.IRecipeImageCleanupService, RecipeImageCleanupService>();

        services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IRecipeRepository, RecipeRepository>();
        services.AddScoped<ICurrentUser, CurrentUserService>();
        services.AddHttpContextAccessor();

        // Hangfire setup với PostgreSQL
        services.AddHangfire(h => h.UsePostgreSqlStorage(c => c.UseNpgsqlConnection(connectionString)));
        services.AddHangfireServer();

        return services;
    }

    /// <summary>
    /// Đăng ký các Recurring Jobs cho Hangfire (FR-JOB-003).
    /// </summary>
    public static IApplicationBuilder UseHangfireJobs(this IApplicationBuilder app)
    {
        try
        {
            using var scope = app.ApplicationServices.CreateScope();
            var recurringJobs = scope.ServiceProvider.GetService<IRecurringJobManager>();
            if (recurringJobs != null)
            {
                // FR-JOB-003: Recurring Job tạo sitemap hàng ngày lúc 02:00 AM UTC
                recurringJobs.AddOrUpdate<ISitemapGenerationJob>(
                    "sitemap-generation",
                    job => job.ExecuteAsync(CancellationToken.None),
                    "0 2 * * *",
                    new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });
            }
        }
        catch (Exception ex)
        {
            var logger = app.ApplicationServices.GetService<ILoggerFactory>()?
                .CreateLogger("HangfireJobs");
            logger?.LogWarning(ex, "Không thể đăng ký recurring job lúc khởi động: {Message}", ex.Message);
        }

        return app;
    }
}
