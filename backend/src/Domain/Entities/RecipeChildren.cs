using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Exceptions;

namespace CulinaryBlog.Domain.Entities;

public class RecipeStep : BaseEntity
{
    public Guid RecipeId { get; private set; }
    public Recipe? Recipe { get; private set; }
    public int StepNumber { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public int? TimerMinutes { get; private set; }
    public string? ImageUrl { get; private set; }

    private RecipeStep() { } // Dành cho EF Core

    public static RecipeStep Create(Guid recipeId, int stepNumber, string title, string description, int? timerMinutes = null, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new DomainException("Mô tả bước thực hiện không được để rỗng.");
        }

        if (stepNumber <= 0)
        {
            throw new DomainException("Thứ tự bước phải lớn hơn 0.");
        }

        return new RecipeStep
        {
            RecipeId = recipeId,
            StepNumber = stepNumber,
            Title = title?.Trim() ?? string.Empty,
            Description = description.Trim(),
            TimerMinutes = timerMinutes,
            ImageUrl = imageUrl
        };
    }

    public void Update(int stepNumber, string title, string description, int? timerMinutes = null, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new DomainException("Mô tả bước thực hiện không được để rỗng.");
        }

        if (stepNumber <= 0)
        {
            throw new DomainException("Thứ tự bước phải lớn hơn 0.");
        }

        StepNumber = stepNumber;
        Title = title?.Trim() ?? string.Empty;
        Description = description.Trim();
        TimerMinutes = timerMinutes;
        ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    internal void UpdateStepNumber(int newStepNumber)
    {
        StepNumber = newStepNumber;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class RecipeIngredient : BaseEntity
{
    public Guid RecipeId { get; private set; }
    public Recipe? Recipe { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public decimal? Quantity { get; private set; }
    public string? Unit { get; private set; }
    public string? Notes { get; private set; }
    public int OrderIndex { get; private set; } = 0;

    private RecipeIngredient() { } // Dành cho EF Core

    public static RecipeIngredient Create(Guid recipeId, string name, decimal? quantity = null, string? unit = null, string? notes = null, int orderIndex = 0)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Tên nguyên liệu không được để rỗng.");
        }

        return new RecipeIngredient
        {
            RecipeId = recipeId,
            Name = name.Trim(),
            Quantity = quantity,
            Unit = unit?.Trim(),
            Notes = notes?.Trim(),
            OrderIndex = orderIndex
        };
    }

    public void Update(string name, decimal? quantity = null, string? unit = null, string? notes = null, int orderIndex = 0)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Tên nguyên liệu không được để rỗng.");
        }

        Name = name.Trim();
        Quantity = quantity;
        Unit = unit?.Trim();
        Notes = notes?.Trim();
        OrderIndex = orderIndex;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class RecipeImage : BaseEntity
{
    public Guid RecipeId { get; private set; }
    public Recipe? Recipe { get; private set; }
    public string OriginalUrl { get; private set; } = string.Empty;
    public string? MediumUrl { get; private set; }
    public string? ThumbnailUrl { get; private set; }
    public string? AltText { get; private set; }
    public bool IsPrimary { get; private set; } = false;
    public int OrderIndex { get; private set; } = 0;

    private RecipeImage() { } // Dành cho EF Core

    public static RecipeImage Create(Guid recipeId, string originalUrl, string? mediumUrl = null, string? thumbnailUrl = null, string? altText = null, bool isPrimary = false, int orderIndex = 0)
    {
        if (string.IsNullOrWhiteSpace(originalUrl))
        {
            throw new DomainException("URL ảnh gốc không được để rỗng.");
        }

        return new RecipeImage
        {
            RecipeId = recipeId,
            OriginalUrl = originalUrl.Trim(),
            MediumUrl = mediumUrl?.Trim(),
            ThumbnailUrl = thumbnailUrl?.Trim(),
            AltText = altText?.Trim(),
            IsPrimary = isPrimary,
            OrderIndex = orderIndex
        };
    }

    internal void SetPrimary(bool isPrimary)
    {
        IsPrimary = isPrimary;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateUrls(string originalUrl, string? mediumUrl = null, string? thumbnailUrl = null, string? altText = null)
    {
        if (string.IsNullOrWhiteSpace(originalUrl))
        {
            throw new DomainException("URL ảnh gốc không được để rỗng.");
        }

        OriginalUrl = originalUrl.Trim();
        MediumUrl = mediumUrl?.Trim();
        ThumbnailUrl = thumbnailUrl?.Trim();
        AltText = altText?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
