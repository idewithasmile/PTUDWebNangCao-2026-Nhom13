using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.Primitives;

namespace CulinaryBlog.API.Policies;

/// <summary>
/// Policy OutputCache cho chi tiết bài viết công khai (Public Recipe Detail).
/// Tuyệt đối KHÔNG cache khi người dùng gửi kèm token Authorization hoặc đã đăng nhập
/// (nhằm tránh rò rỉ bài viết Draft/Archived của tác giả hoặc admin vào OutputCache chung).
/// </summary>
public sealed class PublicRecipeDetailCachePolicy : IOutputCachePolicy
{
    public static readonly PublicRecipeDetailCachePolicy Instance = new();

    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken cancellation)
    {
        var request = context.HttpContext.Request;

        // 1. Chỉ cache phương thức GET và HEAD
        if (!HttpMethods.IsGet(request.Method) && !HttpMethods.IsHead(request.Method))
        {
            context.EnableOutputCaching = false;
            return ValueTask.CompletedTask;
        }

        // 2. Tuyệt đối không cache khi có Authorization header hoặc đã đăng nhập
        if (!StringValues.IsNullOrEmpty(request.Headers.Authorization) ||
            context.HttpContext.User.Identity?.IsAuthenticated == true)
        {
            context.EnableOutputCaching = false;
            return ValueTask.CompletedTask;
        }

        // 3. Khách vãng lai xem bài viết công khai -> cho phép cache 60 phút
        context.EnableOutputCaching = true;
        context.AllowCacheLookup = true;
        context.AllowCacheStorage = true;
        context.AllowLocking = true;
        context.ResponseExpirationTimeSpan = TimeSpan.FromMinutes(60);
        context.Tags.Add("recipes");

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
