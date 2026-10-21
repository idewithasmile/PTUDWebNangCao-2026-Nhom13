using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.HealthChecks;
using CulinaryBlog.API.Middlewares;
using CulinaryBlog.Application;
using CulinaryBlog.Application.Common.Observability;
using CulinaryBlog.Infrastructure;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Persistence.Seeders;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Formatting.Compact;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Serilog Structured Logging (FR-OBS-002, CONS-010)
builder.Host.UseSerilog((ctx, lc) =>
{
    lc.ReadFrom.Configuration(ctx.Configuration)
      .Enrich.FromLogContext();

    if (ctx.HostingEnvironment.IsDevelopment())
    {
        lc.MinimumLevel.Debug();
    }
    else
    {
        lc.MinimumLevel.Information();
    }

    lc.WriteTo.Console(new CompactJsonFormatter())
      .WriteTo.File(
          new CompactJsonFormatter(),
          path: "logs/culinaryblog-.log",
          rollingInterval: RollingInterval.Day,
          retainedFileCountLimit: 14)
      .WriteTo.Seq(ctx.Configuration["Seq:ServerUrl"] ?? "http://localhost:5341");
});

// Cấu hình OpenTelemetry Distributed Tracing & Metrics (FR-OBS-003, SRS 3.7 & 5.3)
var otlpEndpoint = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT")
                   ?? builder.Configuration["OpenTelemetry:OtlpEndpoint"]
                   ?? "http://localhost:5341/ingest/otlp";

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource
        .AddService(serviceName: CulinaryBlogDiagnostics.ServiceName, serviceVersion: CulinaryBlogDiagnostics.ServiceVersion))
    .WithTracing(tracing =>
    {
        tracing
            .AddSource(CulinaryBlogDiagnostics.ServiceName)
            .AddAspNetCoreInstrumentation(options =>
            {
                options.RecordException = true;
            })
            .AddHttpClientInstrumentation(options =>
            {
                options.RecordException = true;
            })
            .AddEntityFrameworkCoreInstrumentation()
            .AddNpgsql()
            .AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri(otlpEndpoint);
            });
    })
    .WithMetrics(metrics =>
    {
        metrics
            .AddMeter(CulinaryBlogMetrics.MeterName)
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri(otlpEndpoint);
            });
    });

// Đăng ký các tầng kiến trúc
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Đăng ký OpenAPI native (.NET 10)
builder.Services.AddOpenApi();

// Rate Limiting (NFR-SEC-003: Two-Tier Rate Limiting & RFC 7807)
builder.Services.AddRateLimiter(options =>
{
    // Môi trường Testing: tắt giới hạn để test suite gọi auth liên tục không bị 429.
    if (builder.Environment.IsEnvironment("Testing"))
    {
        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(_ =>
            RateLimitPartition.GetNoLimiter("testing"));
        return;
    }

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/problem+json";

        var retryAfterSeconds = 60;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retrySpan))
        {
            retryAfterSeconds = Math.Max(1, (int)retrySpan.TotalSeconds);
        }
        context.HttpContext.Response.Headers.RetryAfter = retryAfterSeconds.ToString();

        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status = StatusCodes.Status429TooManyRequests,
            Title = "Too Many Requests",
            Type = "RATE_LIMIT_EXCEEDED",
            Detail = $"Tần suất yêu cầu vượt quá giới hạn cho phép. Vui lòng thử lại sau {retryAfterSeconds} giây.",
            Instance = context.HttpContext.Request.Path
        };
        await context.HttpContext.Response.WriteAsJsonAsync(problem, cancellationToken: token);
    };

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var path = httpContext.Request.Path.Value ?? string.Empty;

        // Nhóm xác thực (/api/v1/auth/*): 10 requests/phút/IP (Sliding Window chống Brute Force - NFR-SEC-003)
        if (path.StartsWith("/api/v1/auth", StringComparison.OrdinalIgnoreCase))
        {
            return RateLimitPartition.GetSlidingWindowLimiter(
                partitionKey: $"auth_{ip}",
                factory: _ => new SlidingWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    SegmentsPerWindow = 6,
                    QueueLimit = 0
                });
        }

        // Nhóm tải tệp tin (/images, /files): 5 requests/phút/IP (NFR-SEC-003)
        if (path.Contains("/images", StringComparison.OrdinalIgnoreCase) || path.StartsWith("/api/v1/files", StringComparison.OrdinalIgnoreCase))
        {
            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: $"upload_{ip}",
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                });
        }

        // Toàn bộ API chung: 100 requests/phút/IP (Fixed Window theo NFR-SEC-003)
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: $"general_{ip}",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });
    });
});

// Authentication với JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.AddPolicy("AdminPolicy", policy => policy.RequireAssertion(_ => true));
    }
    else
    {
        options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    }
    options.AddPolicy("AuthorPolicy", policy => policy.RequireRole("Author", "Admin"));
});

// Output Caching với Redis
builder.Services.AddStackExchangeRedisOutputCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "CulinaryBlog_";
});
builder.Services.AddOutputCache();

// CORS tuân thủ nghiêm ngặt NFR-SEC-005
builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?
        .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? ["http://localhost:3000"];

    options.AddPolicy("FrontendPolicy", p =>
        p.WithOrigins(allowedOrigins)
         .AllowAnyHeader()
         .WithMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
         .AllowCredentials()
         .WithExposedHeaders("X-Correlation-ID", "Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"));
});

// Health Checks (FR-OBS-001, NFR-REL-001)
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy("API process is running"), tags: ["live"])
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!, name: "database", tags: ["ready"])
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!, name: "redis", tags: ["ready"])
    .AddCheck<MinioHealthCheck>("minio", tags: ["storage"]);

var app = builder.Build();

// Middlewares (FR-OBS-002, CONS-010)
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<GlobalExceptionMiddleware>();

// Serilog HTTP Request Logging với diagnostic context enrichment
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("CorrelationId", httpContext.Items["CorrelationId"]?.ToString() ?? httpContext.TraceIdentifier);
        diagnosticContext.Set("RequestPath", httpContext.Request.Path.Value ?? string.Empty);
        var userId = httpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? httpContext.User?.FindFirstValue("sub")
                     ?? (httpContext.User?.Identity?.IsAuthenticated == true ? "authenticated" : "anonymous");
        diagnosticContext.Set("UserId", userId);

        var activity = Activity.Current;
        if (activity != null)
        {
            diagnosticContext.Set("TraceId", activity.TraceId.ToString());
            diagnosticContext.Set("SpanId", activity.SpanId.ToString());
        }
    };
});

app.UseCors("FrontendPolicy");
app.UseOutputCache();
app.UseRateLimiter();
app.UseAuthentication();
app.UseMiddleware<UserLogEnrichmentMiddleware>();
app.UseAuthorization();

// OpenAPI & Scalar Documentation + Tự động Migration và Seed Data
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    // Tự động Apply Migration & Seed dữ liệu mẫu khi start app
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
    await db.Database.MigrateAsync();

    await CulinaryBlogSeeder.SeedAsync(app.Services);
}

// Hangfire Dashboard (Dev & Admin)
app.UseHangfireDashboard("/hangfire");

// Route Groups có tiền tố /api/v1/ (API Versioning v1)
var v1 = app.MapGroup("/api/v1");
v1.MapGroup("/auth").MapAuthEndpoints();
v1.MapGroup("/recipes").MapRecipesEndpoints();
v1.MapGroup("/categories").MapCategoriesEndpoints();
v1.MapGroup("/files").MapFilesEndpoints();

// Health Check Endpoints (/health, /health/live, /health/ready)
app.MapHealthChecks();

app.Run();

// Public để WebApplicationFactory<Program> (integration tests) truy cập.
public partial class Program { }
