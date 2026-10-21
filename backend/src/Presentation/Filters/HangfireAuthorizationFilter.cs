using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace CulinaryBlog.API.Filters;

/// <summary>
/// Bộ lọc phân quyền truy cập Hangfire Dashboard (/hangfire).
/// Trong môi trường Development: Cho phép truy cập tự do/local.
/// Trong môi trường Production: Bắt buộc xác thực và có quyền Admin (qua HttpContext.User, Bearer token, hoặc Cookie).
/// </summary>
public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    private readonly IWebHostEnvironment _environment;

    public HangfireAuthorizationFilter(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // 1. Môi trường Development / Testing: Cho phép truy cập local
        if (_environment.IsDevelopment() || _environment.IsEnvironment("Testing"))
        {
            return true;
        }

        // 2. Môi trường Production: Kiểm tra danh tính đã xác thực và có Role Admin
        var user = httpContext.User;
        if (user?.Identity?.IsAuthenticated == true &&
            (user.IsInRole("Admin") || user.HasClaim(ClaimTypes.Role, "Admin") || user.HasClaim("role", "Admin")))
        {
            return true;
        }

        // 3. Thử phân giải JWT Token từ Authorization Header hoặc Cookie
        var authHeader = httpContext.Request.Headers.Authorization.ToString();
        string? token = null;

        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            token = authHeader["Bearer ".Length..].Trim();
        }
        else if (httpContext.Request.Cookies.TryGetValue("access_token", out var cookieToken))
        {
            token = cookieToken;
        }

        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var config = httpContext.RequestServices.GetService<IConfiguration>();
                var secretKey = config?["Jwt:SecretKey"];
                if (config != null && !string.IsNullOrEmpty(secretKey))
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var validationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = config["Jwt:Issuer"],
                        ValidAudience = config["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                        ClockSkew = TimeSpan.Zero
                    };

                    var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                    if (principal.IsInRole("Admin") ||
                        principal.HasClaim(ClaimTypes.Role, "Admin") ||
                        principal.HasClaim("role", "Admin"))
                    {
                        return true;
                    }
                }
            }
            catch
            {
                // Token không hợp lệ hoặc đã hết hạn
            }
        }

        return false;
    }
}
