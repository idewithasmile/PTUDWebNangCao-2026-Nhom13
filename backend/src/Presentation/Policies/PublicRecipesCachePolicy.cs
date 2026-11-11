using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.Primitives;

namespace CulinaryBlog.API.Policies;

/// <summary>
/// Policy OutputCache chỉ dành cho khách vãng lai (Anonymous Guests) truy cập danh sách công thức công khai.
/// Tuyệt đối KHÔNG cache khi có token Authorization, user đã đăng nhập, hoặc query parameter mang tính cá nhân hóa (onlyMine).
/// </summary>
public sealed class PublicRecipesCachePolicy : IOutputCachePolicy
{
    public static readonly PublicRecipesCachePolicy Instance = new();

    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken cancellation)
    {
        var request = context.HttpContext.Request;

        // 1. Chỉ cache phương thức GET và HEAD
        if (!HttpMethods.IsGet(request.Method) && !HttpMethods.IsHead(request.Method))
        {
            context.EnableOutputCaching = false;
            return ValueTask.CompletedTask;
        }

        // 2. Tuyệt đối không cache khi request có header Authorization hoặc người dùng đã đăng nhập
        if (!StringValues.IsNullOrEmpty(request.Headers.Authorization) ||
            context.HttpContext.User.Identity?.IsAuthenticated == true)
        {
            context.EnableOutputCaching = false;
            return ValueTask.CompletedTask;
        }

        // 3. Tuyệt đối không cache khi có tham số mang tính cá nhân hóa (onlyMine)
        if (request.Query.ContainsKey("onlyMine"))
        {
            context.EnableOutputCaching = false;
            return ValueTask.CompletedTask;
        }

        // 4. Cho phép cache với khách vãng lai
        context.EnableOutputCaching = true;
        context.AllowCacheLookup = true;
        context.AllowCacheStorage = true;
        context.AllowLocking = true;
        context.ResponseExpirationTimeSpan = TimeSpan.FromMinutes(5);
        context.Tags.Add("recipes");

        // Phân loại cache theo các query filter công khai
        context.CacheVaryByRules.QueryKeys = new[]
        {
            "page", "pageSize", "searchTerm", "categoryId", "difficulty", "maxTotalTimeMinutes", "sortBy", "status", "days"
        };

        return ValueTask.CompletedTask;
    }

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken cancellation)
    {
        return ValueTask.CompletedTask;
    }

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken cancellation)
    {
        var response = context.HttpContext.Response;

        // Chỉ lưu vào cache khi response thành công 200 OK
        if (response.StatusCode != StatusCodes.Status200OK)
        {
            context.AllowCacheStorage = false;
            return ValueTask.CompletedTask;
        }

        return ValueTask.CompletedTask;
    }
}
