using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.Behaviors;

public class CachingBehavior<TRequest, TResponse>(ICacheService cache)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : ICacheable
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var cachedResponse = await cache.GetAsync<TResponse>(request.CacheKey, ct);
        if (cachedResponse is not null) return cachedResponse;

        var response = await next();
        await cache.SetAsync(request.CacheKey, response, request.Expiration, ct);
        return response;
    }
}

public class CacheInvalidationBehavior<TRequest, TResponse>(ICacheService cache)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : ICacheInvalidator
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var response = await next();
        foreach (var key in request.CacheKeysToInvalidate)
        {
            await cache.RemoveAsync(key, ct);
        }
        return response;
    }
}
