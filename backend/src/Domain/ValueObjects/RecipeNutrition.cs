namespace CulinaryBlog.Domain.ValueObjects;

public class RecipeNutrition
{
    public decimal? Calories { get; private set; }
    public decimal? Protein { get; private set; }
    public decimal? Carbohydrates { get; private set; }
    public decimal? Fat { get; private set; }
    public decimal? Fiber { get; private set; }
    public decimal? Sodium { get; private set; }

    public RecipeNutrition()
    {
    }

    public RecipeNutrition(
        decimal? calories = null,
        decimal? protein = null,
        decimal? carbohydrates = null,
        decimal? fat = null,
        decimal? fiber = null,
        decimal? sodium = null)
    {
        Calories = calories;
        Protein = protein;
        Carbohydrates = carbohydrates;
        Fat = fat;
        Fiber = fiber;
        Sodium = sodium;
    }
}
