using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CulinaryBlog.API.IntegrationTests.Fixtures;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"IntegrationTestsDb_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Host=localhost;Database=test;Username=test;Password=test",
                ["ConnectionStrings:Redis"] = "localhost:6379",
                ["Jwt:SecretKey"] = "SuperSecretKeyForIntegrationTestingPurposesOnly1234567890!",
                ["Jwt:Issuer"] = "CulinaryBlog",
                ["Jwt:Audience"] = "CulinaryBlogAudience"
            });
        });

        builder.ConfigureServices(services =>
        {
            // 1. Thay thế DbContext bằng InMemoryDatabase
            var dbContextDescriptors = services.Where(d =>
                d.ServiceType == typeof(DbContextOptions<CulinaryBlogDbContext>) ||
                d.ServiceType == typeof(DbContextOptions) ||
                d.ServiceType == typeof(CulinaryBlogDbContext) ||
                d.ServiceType.Namespace?.Contains("Npgsql") == true ||
                d.ImplementationType?.Namespace?.Contains("Npgsql") == true ||
                d.ServiceType.FullName?.Contains("Npgsql") == true ||
                d.ImplementationType?.FullName?.Contains("Npgsql") == true).ToList();
            foreach (var d in dbContextDescriptors) services.Remove(d);

            var inMemoryServiceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            services.AddDbContext<CulinaryBlogDbContext>((sp, options) =>
            {
                options.UseInMemoryDatabase(_dbName);
                options.UseInternalServiceProvider(inMemoryServiceProvider);
                options.AddInterceptors(sp.GetRequiredService<CulinaryBlog.Infrastructure.Data.Interceptors.AuditInterceptor>());
            });

            // 2. Thay thế Redis bằng DistributedMemoryCache
            var cacheDescriptors = services.Where(d =>
                d.ServiceType == typeof(IDistributedCache) ||
                d.ServiceType.FullName?.Contains("StackExchange") == true ||
                d.ImplementationType?.FullName?.Contains("StackExchange") == true).ToList();
            foreach (var d in cacheDescriptors) services.Remove(d);

            services.AddDistributedMemoryCache();
            services.AddScoped<ICacheService, RedisCacheService>();

            // OutputCaching Redis (Program.cs) cần IOutputCacheStore — thay bằng in-memory cho tests.
            services.AddOutputCache();

            // 3. Xóa toàn bộ cấu hình Hangfire cũ (PostgreSQL Storage & Server)
            static bool IsHangfire(Type? type)
            {
                if (type == null) return false;
                if (type.Namespace?.StartsWith("Hangfire") == true) return true;
                if (type.FullName?.Contains("Hangfire") == true) return true;
                if (type.IsGenericType && type.GenericTypeArguments.Any(IsHangfire)) return true;
                return false;
            }

            var hangfireDescriptors = services.Where(d =>
                IsHangfire(d.ServiceType) ||
                IsHangfire(d.ImplementationType) ||
                (d.ImplementationInstance != null && IsHangfire(d.ImplementationInstance.GetType()))
            ).ToList();

            foreach (var d in hangfireDescriptors)
            {
                services.Remove(d);
            }

            // Gỡ bỏ HostedService của Hangfire
            var hangfireHostedServices = services.Where(d =>
                d.ServiceType == typeof(IHostedService) &&
                (IsHangfire(d.ImplementationType) || (d.ImplementationInstance != null && IsHangfire(d.ImplementationInstance.GetType())))
            ).ToList();
            foreach (var hs in hangfireHostedServices)
            {
                services.Remove(hs);
            }

            // Đăng ký lại Hangfire hoàn toàn dùng MemoryStorage
            services.AddHangfire(h => h.UseMemoryStorage());

            // 4. Thay thế IFileStorageService bằng fake cho tests
            var fileStorageDescriptors = services.Where(d => d.ServiceType == typeof(CulinaryBlog.Domain.Interfaces.IFileStorageService)).ToList();
            foreach (var d in fileStorageDescriptors) services.Remove(d);
            services.AddSingleton<CulinaryBlog.Domain.Interfaces.IFileStorageService, FakeFileStorageService>();

            // 5. Vô hiệu hoá Rate Limiter cho môi trường testing để tránh 429 khi chạy test suite
            services.Configure<Microsoft.AspNetCore.RateLimiting.RateLimiterOptions>(options =>
            {
                options.GlobalLimiter = System.Threading.RateLimiting.PartitionedRateLimiter.Create<Microsoft.AspNetCore.Http.HttpContext, string>(_ =>
                    System.Threading.RateLimiting.RateLimitPartition.GetNoLimiter("testing"));
            });
        });
    }

    public class FakeFileStorageService : CulinaryBlog.Domain.Interfaces.IFileStorageService
    {
        public Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default)
        {
            var targetFolder = string.IsNullOrWhiteSpace(folder) ? "uploads" : folder.Trim().Trim('/');
            return Task.FromResult($"/culinary-blog/{targetFolder}/{Guid.NewGuid()}_{fileName}");
        }

        public Task DeleteAsync(string fileUrl, CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        // Xóa sạch distributed cache giữa các test case để đảm bảo tính cô lập
        var cache = scope.ServiceProvider.GetService<IDistributedCache>();
        if (cache != null)
        {
            await cache.RemoveAsync("categories:all");
        }
    }
}
