namespace CulinaryBlog.Application.Common.Interfaces;

/// <summary>
/// Abstraction cho dịch vụ gửi Email (MailKit / SMTP).
/// </summary>
public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);
    Task SendWelcomeEmailAsync(string toEmail, string displayName, CancellationToken ct = default);
    Task SendPasswordResetEmailAsync(string toEmail, string displayName, string resetUrl, CancellationToken ct = default);
    Task SendNewsletterWelcomeEmailAsync(
        string toEmail,
        string? customerName,
        string? favoriteCategoryName,
        IReadOnlyList<NewsletterFeaturedRecipeEmailItem> featuredRecipes,
        string unsubscribeUrl,
        CancellationToken ct = default);
    Task SendRecipeIngredientsEmailAsync(
        string toEmail,
        string recipeTitle,
        string recipeSlug,
        int servings,
        int totalTimeMinutes,
        IReadOnlyList<RecipeEmailIngredientItem> ingredients,
        IReadOnlyList<RecipeEmailStepItem> steps,
        CancellationToken ct = default);
}

public sealed record NewsletterFeaturedRecipeEmailItem(string Title, string Slug, string CategoryName, int TotalTimeMinutes);
public sealed record RecipeEmailIngredientItem(string Name, string QuantityDisplay, string? Unit, string? Notes);
public sealed record RecipeEmailStepItem(int StepNumber, string Title, string Description);
