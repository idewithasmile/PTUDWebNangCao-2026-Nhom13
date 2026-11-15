using System.Globalization;
using CulinaryBlog.Application.Common.Interfaces;
using CulinaryBlog.Domain.Interfaces;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public class SendRecipeEmailJob(
    IEmailService emailService,
    IRecipeRepository recipeRepository,
    ILogger<SendRecipeEmailJob> logger) : ISendRecipeEmailJob
{
    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 300, 1800 }, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public async Task ExecuteAsync(string email, Guid recipeId, int servings, CancellationToken ct = default)
    {
        var recipe = await recipeRepository.GetQueryable()
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == recipeId && !r.IsDeleted, ct);

        if (recipe is null)
        {
            logger.LogWarning("SendRecipeEmailJob: Không tìm thấy công thức {RecipeId}, bỏ qua gửi email.", recipeId);
            return;
        }

        var baseServings = Math.Max(1, recipe.Servings);
        var targetServings = Math.Max(1, servings);
        var multiplier = (decimal)targetServings / baseServings;

        var ingredients = recipe.Ingredients
            .OrderBy(i => i.OrderIndex)
            .Select(i =>
            {
                var qtyDisplay = string.Empty;
                if (i.Quantity.HasValue)
                {
                    var scaled = Math.Round(i.Quantity.Value * multiplier, 2, MidpointRounding.AwayFromZero);
                    qtyDisplay = scaled.ToString("0.##", CultureInfo.InvariantCulture);
                }
                return new RecipeEmailIngredientItem(i.Name, qtyDisplay, i.Unit, i.Notes);
            })
            .ToList();

        var steps = recipe.Steps
            .OrderBy(s => s.StepNumber)
            .Select(s => new RecipeEmailStepItem(s.StepNumber, s.Title, s.Description))
            .ToList();

        await emailService.SendRecipeIngredientsEmailAsync(
            email,
            recipe.Title,
            recipe.Slug,
            targetServings,
            recipe.PrepTimeMinutes + recipe.CookTimeMinutes,
            ingredients,
            steps,
            ct);
    }
}
