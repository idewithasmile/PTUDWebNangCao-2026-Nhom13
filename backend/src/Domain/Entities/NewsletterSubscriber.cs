using CulinaryBlog.Domain.Common;

namespace CulinaryBlog.Domain.Entities;

/// <summary>
/// Khách hàng / độc giả để lại thông tin email nhận bản tin ẩm thực và công thức nấu ăn mới.
/// </summary>
public class NewsletterSubscriber : BaseEntity
{
    public string Email { get; private set; } = string.Empty;
    public string NormalizedEmail { get; private set; } = string.Empty;
    public string? CustomerName { get; private set; }
    public string? FavoriteCategorySlug { get; private set; }
    public string Source { get; private set; } = "HomeBanner";
    public bool IsActive { get; private set; } = true;
    public string UnsubscribeToken { get; private set; } = string.Empty;
    public DateTime SubscribedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UnsubscribedAt { get; private set; }

    private NewsletterSubscriber() { }

    public static NewsletterSubscriber Create(
        string email,
        string? customerName,
        string? favoriteCategorySlug,
        string? source,
        string unsubscribeToken)
    {
        var trimmedEmail = email.Trim();
        return new NewsletterSubscriber
        {
            Email = trimmedEmail,
            NormalizedEmail = trimmedEmail.ToUpperInvariant(),
            CustomerName = string.IsNullOrWhiteSpace(customerName) ? null : customerName.Trim(),
            FavoriteCategorySlug = string.IsNullOrWhiteSpace(favoriteCategorySlug) ? null : favoriteCategorySlug.Trim(),
            Source = string.IsNullOrWhiteSpace(source) ? "HomeBanner" : source.Trim(),
            IsActive = true,
            UnsubscribeToken = unsubscribeToken,
            SubscribedAt = DateTime.UtcNow,
            UnsubscribedAt = null,
            RowVersion = Guid.NewGuid().ToByteArray()[..8]
        };
    }

    public void Resubscribe(string? customerName, string? favoriteCategorySlug, string? source, string newUnsubscribeToken)
    {
        if (!string.IsNullOrWhiteSpace(customerName))
        {
            CustomerName = customerName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(favoriteCategorySlug))
        {
            FavoriteCategorySlug = favoriteCategorySlug.Trim();
        }

        if (!string.IsNullOrWhiteSpace(source))
        {
            Source = source.Trim();
        }

        IsActive = true;
        IsDeleted = false;
        UnsubscribeToken = newUnsubscribeToken;
        SubscribedAt = DateTime.UtcNow;
        UnsubscribedAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePreferences(string? customerName, string? favoriteCategorySlug)
    {
        if (!string.IsNullOrWhiteSpace(customerName))
        {
            CustomerName = customerName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(favoriteCategorySlug))
        {
            FavoriteCategorySlug = favoriteCategorySlug.Trim();
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void Unsubscribe()
    {
        IsActive = false;
        UnsubscribedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
