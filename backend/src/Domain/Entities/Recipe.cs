using CulinaryBlog.Domain.Common;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Exceptions;
using CulinaryBlog.Domain.ValueObjects;

namespace CulinaryBlog.Domain.Entities;

public class Recipe : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Instructions { get; private set; } = string.Empty;
    public int PrepTime { get; private set; }
    public int CookTime { get; private set; }
    public int Servings { get; private set; }
    public RecipeDifficulty Difficulty { get; private set; } = RecipeDifficulty.Easy;
    public RecipeStatus Status { get; private set; } = RecipeStatus.Draft;

    public Guid CategoryId { get; private set; }
    public Category? Category { get; private set; }

    public string AuthorId { get; private set; } = string.Empty;
    public ApplicationUser? Author { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    public RecipeNutrition Nutrition { get; private set; } = new();

    private readonly List<RecipeStep> _steps = [];
    public IReadOnlyCollection<RecipeStep> Steps => _steps.AsReadOnly();

    private readonly List<RecipeIngredient> _ingredients = [];
    public IReadOnlyCollection<RecipeIngredient> Ingredients => _ingredients.AsReadOnly();

    private readonly List<RecipeImage> _images = [];
    public IReadOnlyCollection<RecipeImage> Images => _images.AsReadOnly();

    private Recipe() { } // Dành cho EF Core

    public static Recipe Create(
        string title,
        string slug,
        string description,
        string instructions,
        int prepTime,
        int cookTime,
        int servings,
        RecipeDifficulty difficulty,
        Guid categoryId,
        string authorId,
        RecipeNutrition? nutrition = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tiêu đề công thức không được để rỗng.");

        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainException("Slug công thức không được để rỗng.");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Mô tả công thức không được để rỗng.");

        if (prepTime < 0 || cookTime < 0)
            throw new DomainException("Thời gian chuẩn bị và nấu không được nhỏ hơn 0.");

        if (servings <= 0)
            throw new DomainException("Khẩu phần ăn phải lớn hơn 0.");

        if (categoryId == Guid.Empty)
            throw new DomainException("Danh mục công thức không hợp lệ.");

        if (string.IsNullOrWhiteSpace(authorId))
            throw new DomainException("Tác giả công thức không được để rỗng.");

        var recipe = new Recipe
        {
            Title = title.Trim(),
            Slug = slug.Trim().ToLowerInvariant(),
            Description = description.Trim(),
            Instructions = instructions?.Trim() ?? string.Empty,
            PrepTime = prepTime,
            CookTime = cookTime,
            Servings = servings,
            Difficulty = difficulty,
            Status = RecipeStatus.Draft,
            CategoryId = categoryId,
            AuthorId = authorId,
            Nutrition = nutrition ?? new RecipeNutrition()
        };

        return recipe;
    }

    public void Update(
        string title,
        string slug,
        string description,
        string instructions,
        int prepTime,
        int cookTime,
        int servings,
        RecipeDifficulty difficulty,
        Guid categoryId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tiêu đề công thức không được để rỗng.");

        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainException("Slug công thức không được để rỗng.");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Mô tả công thức không được để rỗng.");

        if (prepTime < 0 || cookTime < 0)
            throw new DomainException("Thời gian chuẩn bị và nấu không được nhỏ hơn 0.");

        if (servings <= 0)
            throw new DomainException("Khẩu phần ăn phải lớn hơn 0.");

        if (categoryId == Guid.Empty)
            throw new DomainException("Danh mục công thức không hợp lệ.");

        Title = title.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        Description = description.Trim();
        Instructions = instructions?.Trim() ?? string.Empty;
        PrepTime = prepTime;
        CookTime = cookTime;
        Servings = servings;
        Difficulty = difficulty;
        CategoryId = categoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (_steps.Count == 0)
        {
            throw new DomainException("Recipe phải có ít nhất 1 bước thực hiện trước khi Publish.");
        }

        Status = RecipeStatus.Published;
        PublishedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Unpublish()
    {
        Status = RecipeStatus.Draft;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        Status = RecipeStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetNutrition(RecipeNutrition nutrition)
    {
        Nutrition = nutrition ?? throw new DomainException("Thông tin dinh dưỡng không hợp lệ.");
        UpdatedAt = DateTime.UtcNow;
    }

    public RecipeStep AddStep(string title, string description, int? timerMinutes = null, string? imageUrl = null)
    {
        int nextStepNumber = _steps.Count > 0 ? _steps.Max(s => s.StepNumber) + 1 : 1;
        var step = RecipeStep.Create(Id, nextStepNumber, title, description, timerMinutes, imageUrl);
        _steps.Add(step);
        UpdatedAt = DateTime.UtcNow;
        return step;
    }

    public void RemoveStep(Guid stepId)
    {
        var step = _steps.FirstOrDefault(s => s.Id == stepId);
        if (step != null)
        {
            _steps.Remove(step);
            // Renumber lại các bước còn lại
            int index = 1;
            foreach (var remainingStep in _steps.OrderBy(s => s.StepNumber))
            {
                remainingStep.UpdateStepNumber(index++);
            }
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public RecipeIngredient AddIngredient(string name, decimal? quantity = null, string? unit = null, string? notes = null)
    {
        int nextOrderIndex = _ingredients.Count > 0 ? _ingredients.Max(i => i.OrderIndex) + 1 : 1;
        var ingredient = RecipeIngredient.Create(Id, name, quantity, unit, notes, nextOrderIndex);
        _ingredients.Add(ingredient);
        UpdatedAt = DateTime.UtcNow;
        return ingredient;
    }

    public void RemoveIngredient(Guid ingredientId)
    {
        var ingredient = _ingredients.FirstOrDefault(i => i.Id == ingredientId);
        if (ingredient != null)
        {
            _ingredients.Remove(ingredient);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public RecipeImage AddImage(string originalUrl, string? mediumUrl = null, string? thumbnailUrl = null, string? altText = null, bool isPrimary = false)
    {
        bool makePrimary = isPrimary || _images.Count == 0;
        if (makePrimary)
        {
            foreach (var img in _images)
            {
                img.SetPrimary(false);
            }
        }

        int nextOrderIndex = _images.Count > 0 ? _images.Max(i => i.OrderIndex) + 1 : 1;
        var image = RecipeImage.Create(Id, originalUrl, mediumUrl, thumbnailUrl, altText, makePrimary, nextOrderIndex);
        _images.Add(image);
        UpdatedAt = DateTime.UtcNow;
        return image;
    }

    public void SetPrimaryImage(Guid imageId)
    {
        var targetImage = _images.FirstOrDefault(i => i.Id == imageId);
        if (targetImage != null)
        {
            foreach (var img in _images)
            {
                img.SetPrimary(img.Id == imageId);
            }
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveImage(Guid imageId)
    {
        var image = _images.FirstOrDefault(i => i.Id == imageId);
        if (image != null)
        {
            bool wasPrimary = image.IsPrimary;
            _images.Remove(image);
            if (wasPrimary && _images.Count > 0)
            {
                _images.First().SetPrimary(true);
            }
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
