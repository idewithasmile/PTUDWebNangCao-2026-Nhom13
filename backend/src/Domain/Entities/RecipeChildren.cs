using CulinaryBlog.Domain.Common;

namespace CulinaryBlog.Domain.Entities;

public class RecipeStep : BaseEntity
{
    public Guid RecipeId { get; set; }
    public Recipe? Recipe { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? TimerMinutes { get; set; }
    public string? ImageUrl { get; set; }
}

public class RecipeIngredient : BaseEntity
{
    public Guid RecipeId { get; set; }
    public Recipe? Recipe { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Notes { get; set; }
    public int OrderIndex { get; set; } = 0;
}

public class RecipeImage : BaseEntity
{
    public Guid RecipeId { get; set; }
    public Recipe? Recipe { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string? MediumUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; } = false;
    public int OrderIndex { get; set; } = 0;
}
