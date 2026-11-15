using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Application.Features.Auth.Services;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class PasswordResetEmailDispatcher(
    IBackgroundJobService jobs,
    ILogger<PasswordResetEmailDispatcher> logger) : IPasswordResetEmailDispatcher
{
    public Task DispatchAsync(string email, string displayName, string resetUrl, CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<IPasswordResetEmailJob>(j => j.ExecuteAsync(email, displayName, resetUrl, CancellationToken.None));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "FR-AUTH-008: Hangfire enqueue PasswordResetEmail failed for {Email}", email);
        }

        return Task.CompletedTask;
    }
}

public sealed class NewsletterEmailDispatcher(
    IBackgroundJobService jobs,
    ILogger<NewsletterEmailDispatcher> logger) : INewsletterEmailDispatcher
{
    public Task DispatchWelcomeAsync(
        string email,
        string? customerName,
        string? favoriteCategorySlug,
        string unsubscribeToken,
        CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<INewsletterWelcomeEmailJob>(j =>
                j.ExecuteAsync(email, customerName, favoriteCategorySlug, unsubscribeToken, CancellationToken.None));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "FR-NWL: Hangfire enqueue NewsletterWelcomeEmail failed for {Email}", email);
        }

        return Task.CompletedTask;
    }
}

public sealed class RecipeEmailDispatcher(
    IBackgroundJobService jobs,
    ILogger<RecipeEmailDispatcher> logger) : IRecipeEmailDispatcher
{
    public Task DispatchRecipeAsync(string email, Guid recipeId, int servings, CancellationToken ct = default)
    {
        try
        {
            jobs.Enqueue<ISendRecipeEmailJob>(j =>
                j.ExecuteAsync(email, recipeId, servings, CancellationToken.None));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Hangfire enqueue SendRecipeEmail failed for {Email} (Recipe {RecipeId})", email, recipeId);
        }

        return Task.CompletedTask;
    }
}
