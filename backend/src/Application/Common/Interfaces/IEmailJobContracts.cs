namespace CulinaryBlog.Application.Common.Interfaces;

public interface IPasswordResetEmailJob
{
    Task ExecuteAsync(string email, string displayName, string resetUrl, CancellationToken ct = default);
}

public interface INewsletterWelcomeEmailJob
{
    Task ExecuteAsync(string email, string? customerName, string? favoriteCategorySlug, string unsubscribeToken, CancellationToken ct = default);
}

public interface ISendRecipeEmailJob
{
    Task ExecuteAsync(string email, Guid recipeId, int servings, CancellationToken ct = default);
}

public interface INewsletterEmailDispatcher
{
    Task DispatchWelcomeAsync(string email, string? customerName, string? favoriteCategorySlug, string unsubscribeToken, CancellationToken ct = default);
}

public interface IRecipeEmailDispatcher
{
    Task DispatchRecipeAsync(string email, Guid recipeId, int servings, CancellationToken ct = default);
}
