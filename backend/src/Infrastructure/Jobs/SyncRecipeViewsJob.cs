using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Infrastructure.Data;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace CulinaryBlog.Infrastructure.Jobs;

public class SyncRecipeViewsJob : ISyncRecipeViewsJob
{
    private readonly CulinaryBlogDbContext _dbContext;
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<SyncRecipeViewsJob> _logger;

    public SyncRecipeViewsJob(
        CulinaryBlogDbContext dbContext,
        IConnectionMultiplexer redis,
        ILogger<SyncRecipeViewsJob> logger)
    {
        _dbContext = dbContext;
        _redis = redis;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(CancellationToken ct = default)
    {
        try
        {
            var server = _redis.GetServers().FirstOrDefault();
            if (server == null || !server.IsConnected)
            {
                _logger.LogWarning("Không thể kết nối Redis Server để đồng bộ lượt xem.");
                return;
            }

            var db = _redis.GetDatabase();
            var keys = server.Keys(pattern: "recipe:view:buffer:*").ToList();

            if (keys.Count == 0)
            {
                return;
            }

            _logger.LogInformation("Bắt đầu đồng bộ lượt xem từ Redis về PostgreSQL: {Count} công thức cần cập nhật.", keys.Count);

            foreach (var key in keys)
            {
                var keyStr = key.ToString();
                var recipeIdStr = keyStr.Replace("recipe:view:buffer:", string.Empty);

                if (Guid.TryParse(recipeIdStr, out var recipeId))
                {
                    // Lấy số view đệm và xóa key khỏi Redis
                    var rawValue = await db.StringGetDeleteAsync(key);
                    if (rawValue.HasValue && long.TryParse(rawValue.ToString(), out var deltaViews) && deltaViews > 0)
                    {
                        await _dbContext.Recipes
                            .Where(r => r.Id == recipeId)
                            .ExecuteUpdateAsync(s => s.SetProperty(r => r.ViewCount, r => r.ViewCount + deltaViews), ct);

                        _logger.LogDebug("Đã cộng dồn {Delta} lượt xem cho công thức {RecipeId}", deltaViews, recipeId);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình đồng bộ lượt xem SyncRecipeViewsJob.");
            throw;
        }
    }
}
