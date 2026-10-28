namespace CulinaryBlog.Application.Features.Dashboard.DTOs;

public record CategoryDistributionDto(
    Guid CategoryId,
    string Name,
    int RecipeCount,
    double Percentage
);

public record DailyActivityDto(
    string Date,
    int RecipeCount
);

public record DashboardStatsDto(
    int TotalRecipes,
    int PublishedRecipes,
    int DraftRecipes,
    int ArchivedRecipes,
    int? TotalAuthors,
    List<CategoryDistributionDto> CategoryDistribution,
    List<DailyActivityDto> Activity7Days,
    bool IsSystemScope
);
