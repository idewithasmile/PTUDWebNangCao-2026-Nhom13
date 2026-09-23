using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var requestName = typeof(TRequest).Name;
        logger.LogInformation("Handling {RequestName}", requestName);
        var timer = Stopwatch.StartNew();

        var response = await next();

        timer.Stop();
        if (timer.ElapsedMilliseconds > 500)
            logger.LogWarning("Long Running Request: {RequestName} ({ElapsedMilliseconds}ms)", requestName, timer.ElapsedMilliseconds);
        else
            logger.LogInformation("Handled {RequestName} in {ElapsedMilliseconds}ms", requestName, timer.ElapsedMilliseconds);

        return response;
    }
}
