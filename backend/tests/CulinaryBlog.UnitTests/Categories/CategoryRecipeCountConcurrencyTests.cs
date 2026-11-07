using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;
using CulinaryBlog.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.UnitTests.Categories;

public class CategoryRecipeCountConcurrencyTests
{
    private CulinaryBlogDbContext CreateDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<CulinaryBlogDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new CulinaryBlogDbContext(options);
    }

    [Fact]
    public async Task GetAllWithRecipeCountAsync_UnderConcurrentMutations_AlwaysReflectsAccurateCounts()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var dbContext = CreateDbContext(dbName);

        var category = new Category
        {
            Name = "Món Á",
            Slug = "mon-a",
            Description = "Ẩm thực châu Á"
        };
        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync();

        var authorId = Guid.NewGuid().ToString();

        // Add 5 published recipes with at least 1 step each
        var recipes = new List<Recipe>();
        for (int i = 0; i < 5; i++)
        {
            var r = Recipe.Create($"Recipe {i}", $"recipe-{i}", "Desc", "Inst", 10, 20, 2, RecipeDifficulty.Easy, category.Id, authorId);
            r.AddStep("Sơ chế", "Rửa sạch nguyên liệu");
            r.Publish();
            recipes.Add(r);
            dbContext.Recipes.Add(r);
        }
        await dbContext.SaveChangesAsync();

        var repo = new CategoryRepository(dbContext);

        // Initial check: RecipeCount == 5
        var initialList = await repo.GetAllWithRecipeCountAsync();
        initialList.Should().ContainSingle(c => c.Category.Id == category.Id && c.RecipeCount == 5);

        // Act: Simulating 5 concurrent tasks modifying status / unpublishing recipes
        var tasks = recipes.Select(async r =>
        {
            using var localContext = CreateDbContext(dbName);
            var localRecipe = await localContext.Recipes.FindAsync(r.Id);
            if (localRecipe != null)
            {
                localRecipe.Unpublish();
                await localContext.SaveChangesAsync();
            }
        });

        await Task.WhenAll(tasks);

        // Assert: After all recipes unpublished, query directly reflects 0 published recipes
        var finalList = await repo.GetAllWithRecipeCountAsync();
        finalList.Should().ContainSingle(c => c.Category.Id == category.Id && c.RecipeCount == 0);
    }
}
