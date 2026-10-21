using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CulinaryBlog.API.Filters;
using FluentAssertions;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Moq;

namespace CulinaryBlog.UnitTests.Filters;

public class HangfireAuthorizationFilterTests
{
    private readonly Mock<IWebHostEnvironment> _mockEnv = new();

    private static DashboardContext CreateDashboardContext(HttpContext httpContext)
    {
        if (httpContext.RequestServices == null)
        {
            var services = new ServiceCollection();
            httpContext.RequestServices = services.BuildServiceProvider();
        }

        return new AspNetCoreDashboardContext(
            storage: Mock.Of<JobStorage>(),
            options: new DashboardOptions(),
            httpContext: httpContext);
    }

    [Fact]
    public void Authorize_DevelopmentEnvironment_ReturnsTrue()
    {
        // Arrange
        _mockEnv.Setup(e => e.EnvironmentName).Returns("Development");
        var filter = new HangfireAuthorizationFilter(_mockEnv.Object);
        var httpContext = new DefaultHttpContext();
        var context = CreateDashboardContext(httpContext);

        // Act
        var result = filter.Authorize(context);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void Authorize_ProductionEnvironment_UnauthenticatedUser_ReturnsFalse()
    {
        // Arrange
        _mockEnv.Setup(e => e.EnvironmentName).Returns("Production");
        var filter = new HangfireAuthorizationFilter(_mockEnv.Object);
        var httpContext = new DefaultHttpContext();
        var context = CreateDashboardContext(httpContext);

        // Act
        var result = filter.Authorize(context);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void Authorize_ProductionEnvironment_NonAdminUser_ReturnsFalse()
    {
        // Arrange
        _mockEnv.Setup(e => e.EnvironmentName).Returns("Production");
        var filter = new HangfireAuthorizationFilter(_mockEnv.Object);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "user-1"),
            new Claim(ClaimTypes.Role, "Author")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var httpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) };
        var context = CreateDashboardContext(httpContext);

        // Act
        var result = filter.Authorize(context);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void Authorize_ProductionEnvironment_AdminUser_ReturnsTrue()
    {
        // Arrange
        _mockEnv.Setup(e => e.EnvironmentName).Returns("Production");
        var filter = new HangfireAuthorizationFilter(_mockEnv.Object);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "admin-1"),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var httpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) };
        var context = CreateDashboardContext(httpContext);

        // Act
        var result = filter.Authorize(context);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void Authorize_ProductionEnvironment_ValidAdminBearerToken_ReturnsTrue()
    {
        // Arrange
        _mockEnv.Setup(e => e.EnvironmentName).Returns("Production");
        var filter = new HangfireAuthorizationFilter(_mockEnv.Object);

        var secret = "super_secret_test_key_minimum_32_characters_long!";
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:SecretKey"] = secret,
            ["Jwt:Issuer"] = "CulinaryBlog",
            ["Jwt:Audience"] = "CulinaryBlog.Client"
        }).Build();

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "admin-user"),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = DateTime.UtcNow.AddMinutes(30),
            Issuer = "CulinaryBlog",
            Audience = "CulinaryBlog.Client",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256Signature)
        };
        var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(jwtToken);

        var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(config);
        var serviceProvider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = serviceProvider
        };
        httpContext.Request.Headers.Authorization = $"Bearer {tokenString}";
        var context = CreateDashboardContext(httpContext);

        // Act
        var result = filter.Authorize(context);

        // Assert
        result.Should().BeTrue();
    }
}
