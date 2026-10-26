using Xunit;
using CulinaryBlog.Application.Features.Auth.Services;
using CulinaryBlog.Infrastructure.Data;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace CulinaryBlog.Api.Tests;

// Factory boot Program thật nhưng thay hạ tầng ngoài bằng InMemory/fake để test
// không cần Postgres/Redis/Mailhog (chạy được trên CI và máy dev chưa docker).
public sealed class AuthWebFactory : WebApplicationFactory<Program>
{
    public GoogleUserInfo? GoogleResult { get; set; }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureTestServices(services =>
        {
            // 1. Thay Postgres bằng InMemory (mỗi factory 1 DB riêng).
            // AddDbContext đăng ký IDbContextOptionsConfiguration<T> dạng enumerable nên phải gỡ
            // hết (kẻo UseNpgsql gốc + UseInMemory cùng apply → lỗi dual provider).
            // InMemoryDatabaseRoot singleton dùng chung để dữ liệu persist xuyên suốt các scope/request
            // trong cùng factory (mặc định mỗi internal provider có store riêng → register xong login không thấy).
            services.RemoveAll(typeof(DbContextOptions<CulinaryBlogDbContext>));
            services.RemoveAll(typeof(DbContextOptions));
            services.RemoveAll(typeof(IDbContextOptionsConfiguration<CulinaryBlogDbContext>));
            services.RemoveAll(typeof(CulinaryBlogDbContext));
            var dbName = $"AuthTests_{Guid.NewGuid():N}";
            services.AddSingleton(new InMemoryDatabaseRoot());
            services.AddDbContext<CulinaryBlogDbContext>((sp, o) =>
                o.UseInMemoryDatabase(dbName, sp.GetRequiredService<InMemoryDatabaseRoot>()));

            // 2. Gỡ bỏ Hangfire PostgreSQL và thay bằng MemoryStorage (tránh mở socket kết nối Postgres khi test)
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

            var hangfireHostedServices = services.Where(d =>
                d.ServiceType == typeof(IHostedService) &&
                (IsHangfire(d.ImplementationType) || (d.ImplementationInstance != null && IsHangfire(d.ImplementationInstance.GetType())))
            ).ToList();
            foreach (var hs in hangfireHostedServices)
            {
                services.Remove(hs);
            }

            services.AddHangfire(h => h.UseMemoryStorage());

            // 3. Fake Google validator + welcome mail (không gọi mạng ngoài).
            services.RemoveAll(typeof(IGoogleTokenValidator));
            services.AddSingleton<IGoogleTokenValidator>(new FakeGoogleValidator(this));
            services.RemoveAll(typeof(IWelcomeEmailDispatcher));
            services.AddSingleton<IWelcomeEmailDispatcher>(new NoOpWelcomeEmailDispatcher());
        });
    }

    private sealed class FakeGoogleValidator(AuthWebFactory factory) : IGoogleTokenValidator
    {
        public Task<GoogleUserInfo?> ValidateAsync(string idToken, CancellationToken ct = default) =>
            Task.FromResult(factory.GoogleResult);
    }

    private sealed class NoOpWelcomeEmailDispatcher : IWelcomeEmailDispatcher
    {
        public Task DispatchAsync(string email, string displayName, CancellationToken ct = default) =>
            Task.CompletedTask;
    }
}
