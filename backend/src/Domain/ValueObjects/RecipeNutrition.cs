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

    public override bool Equals(object? obj)
    {
        if (obj is not RecipeNutrition other) return false;
        return Calories == other.Calories
            && Protein == other.Protein
            && Carbohydrates == other.Carbohydrates
            && Fat == other.Fat
            && Fiber == other.Fiber
            && Sodium == other.Sodium;
    }

    public override int GetHashCode()
        => HashCode.Combine(Calories, Protein, Carbohydrates, Fat, Fiber, Sodium);
}
