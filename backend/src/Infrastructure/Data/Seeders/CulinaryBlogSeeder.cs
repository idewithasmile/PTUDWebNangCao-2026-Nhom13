using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Infrastructure.Data;

namespace CulinaryBlog.Infrastructure.Persistence.Seeders;

public static class CulinaryBlogSeeder
{
    private const int SEED = 42;

    private static readonly string[] CategoryNames =
    [
        "Món khai vị", "Món chính", "Món canh", "Món kho", "Món xào",
        "Món nướng", "Món chiên rán", "Món hấp", "Món luộc", "Món gỏi - nộm",
        "Món lẩu", "Món chay", "Món ăn vặt", "Đồ uống", "Tráng miệng",
        "Bánh ngọt", "Mì - Bún - Phở", "Cơm & Cháo", "Hải sản", "Gia cầm",
        "Thịt bò", "Thịt heo", "Ẩm thực miền Bắc", "Ẩm thực miền Trung", "Ẩm thực miền Nam"
    ];

    private static readonly string[] RecipeTitles =
    [
        "Phở bò truyền thống Hà Nội", "Bánh mì kẹp thịt nướng", "Bún bò Huế đặc biệt",
        "Cơm tấm sườn bì chả", "Gỏi cuốn tôm thịt", "Bánh xèo miền Nam",
        "Canh chua cá lóc", "Thịt kho tàu nước dừa", "Cà ri gà nước cốt dừa",
        "Chả giò chiên giòn rụm", "Bún chả Hà Nội", "Cá basa kho tộ",
        "Bò lúc lắc hạt tiêu", "Gà hấp lá chanh", "Mực xào chua ngọt",
        "Súp cua măng tây", "Lẩu Thái hải sản chua cay", "Chè hạt sen long nhãn",
        "Nem nướng Nha Trang", "Bún riêu cua đồng", "Cơm chiên ngọc bích",
        "Vịt nấu chao Cần Thơ", "Sườn xào chua ngọt", "Miến xào cua bể"
    ];

    private static readonly string[] IngredientPool =
    [
        "Thịt bò thăn", "Thịt ba chỉ", "Tôm sú tươi", "Cá lóc đồng", "Thịt đùi gà",
        "Trứng gà ta", "Xương ống hầm", "Rau muống non", "Hành hoa", "Hành khô",
        "Tỏi cô đơn", "Gừng già", "Sả cây", "Ớt hiểm đỏ", "Rau mùi (ngò rí)",
        "Húng quế", "Giá đỗ", "Nước mắm cá cơm", "Dầu hào cao cấp", "Muối hạt",
        "Đường cát", "Tiêu đen xay", "Bột ngọt", "Dầu ăn thực vật", "Nước cốt dừa",
        "Rượu mai quế lộ", "Hồi hoa", "Quế thanh", "Thảo quả", "Hạt tiêu sọ",
        "Bột năng", "Nấm đông cô", "Mộc nhĩ", "Cà chua chín", "Dứa chua", "Me chín"
    ];

    private static readonly string[] StepDescriptions =
    [
        "Sơ chế, làm sạch và khử mùi hôi của nguyên liệu tươi sống bằng nước muối loãng cùng gừng đập dập.",
        "Ướp thịt và gia vị đã chuẩn bị theo định lượng, để ngấm đều trong khoảng 20 đến 30 phút.",
        "Chuẩn bị nồi nước dùng, cho xương và thảo quả vào ninh liu riu trên lửa nhỏ, vớt sạch bọt nổi.",
        "Phi thơm tỏi, hành băm nhuyễn cùng dầu ăn cho đến khi dậy mùi thơm và ngả sang màu vàng óng.",
        "Cho phần nguyên liệu chính vào xào săn trên lửa lớn, đảo đều tay để gia vị thấm đều.",
        "Hạ lửa nhỏ, đậy nắp vung và om nguyên liệu đến khi chín mềm và nước sốt sánh lại.",
        "Nêm nếm lại gia vị cho vừa miệng, rắc thêm tiêu xay, ớt tươi và hành lá cắt nhỏ.",
        "Bày món ăn ra đĩa hoặc tô sâu lòng, trang trí thêm ngò rí và thưởng thức ngay khi còn nóng."
    ];

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // 0. Tạo Roles nếu chưa có
        string[] roles = ["Admin", "Author", "Reader"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Bỏ qua nếu đã đủ 100 recipes
        if (await db.Recipes.CountAsync() >= 100) return;

        // 1. Tạo Authors mẫu
        var authorFaker = new Faker<ApplicationUser>("vi")
            .RuleFor(u => u.Id, f => Guid.NewGuid().ToString())
            .RuleFor(u => u.DisplayName, f => f.Name.FullName())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.EmailConfirmed, f => true)
            .RuleFor(u => u.AvatarUrl, f => f.Internet.Avatar());

        var authors = authorFaker.UseSeed(SEED).Generate(10);
        foreach (var author in authors)
        {
            var existingUser = await userManager.FindByEmailAsync(author.Email!);
            if (existingUser == null)
            {
                var result = await userManager.CreateAsync(author, "Author@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(author, "Author");
                }
            }
            else
            {
                author.Id = existingUser.Id;
            }
        }

        // 2. Tạo Categories (đảm bảo ít nhất 20 categories)
        var currentCategories = await db.Categories.ToListAsync();
        if (currentCategories.Count < 20)
        {
            var categoryFaker = new Faker("vi");
            int order = currentCategories.Count;

            foreach (var name in CategoryNames)
            {
                if (currentCategories.Count >= 20) break;
                if (!currentCategories.Any(c => c.Name == name))
                {
                    var cat = new Category
                    {
                        Name = name,
                        Slug = categoryFaker.Lorem.Slug() + "-" + categoryFaker.Random.Int(100, 999),
                        Description = $"Các món ăn thuộc danh mục {name}",
                        OrderIndex = ++order,
                        RowVersion = new byte[8]
                    };
                    db.Categories.Add(cat);
                    currentCategories.Add(cat);
                }
            }
            await db.SaveChangesAsync();
        }

        var categoryIds = currentCategories.Select(c => c.Id).ToList();

        // 3. Tạo Recipes (đủ 100 recipes)
        int recipesNeeded = 100 - await db.Recipes.CountAsync();
        if (recipesNeeded <= 0) return;

        var recipeFaker = new Faker<Recipe>()
            .CustomInstantiator(f =>
            {
                var baseTitle = f.PickRandom(RecipeTitles);
                var title = $"{baseTitle} {f.Random.Int(1, 999)}";
                var slug = f.Lorem.Slug() + "-" + f.Random.Guid().ToString()[..8];

                return new Recipe
                {
                    Title = title,
                    Slug = slug,
                    Description = f.Lorem.Paragraph(2),
                    Instructions = "Hướng dẫn chi tiết theo các bước thực hiện bên dưới.",
                    CategoryId = f.PickRandom(categoryIds),
                    AuthorId = f.PickRandom(authors).Id,
                    PrepTime = f.Random.Int(15, 60),
                    CookTime = f.Random.Int(20, 180),
                    Servings = f.Random.Int(2, 8),
                    Difficulty = f.PickRandom<RecipeDifficulty>(),
                    Status = RecipeStatus.Published,
                    RowVersion = new byte[8]
                };
            });

        var recipes = recipeFaker.UseSeed(SEED).Generate(recipesNeeded);

        // 4. Tạo Steps (5-8 bước) và Ingredients (10-15 nguyên liệu)
        var stepFaker = new Faker("vi");
        var ingrFaker = new Faker("vi");

        foreach (var recipe in recipes)
        {
            int stepCount = stepFaker.Random.Int(5, 8);
            for (int s = 1; s <= stepCount; s++)
            {
                recipe.Steps.Add(new RecipeStep
                {
                    StepNumber = s,
                    Title = $"Bước {s}: Tiến hành chế biến",
                    Description = stepFaker.PickRandom(StepDescriptions),
                    TimerMinutes = stepFaker.Random.Int(5, 35),
                    RowVersion = new byte[8]
                });
            }

            int ingrCount = ingrFaker.Random.Int(10, 15);
            var selectedIngredients = ingrFaker.PickRandom(IngredientPool, ingrCount).ToList();

            for (int i = 0; i < selectedIngredients.Count; i++)
            {
                recipe.Ingredients.Add(new RecipeIngredient
                {
                    Name = selectedIngredients[i],
                    Quantity = ingrFaker.Random.Decimal(5, 500),
                    Unit = ingrFaker.PickRandom("gram", "ml", "thìa canh", "quả", "củ", "nhánh"),
                    Notes = ingrFaker.Random.Bool(0.3f) ? "Ưu tiên chọn loại tươi ngon" : null,
                    OrderIndex = i + 1,
                    RowVersion = new byte[8]
                });
            }
        }

        await db.Recipes.AddRangeAsync(recipes);
        await db.SaveChangesAsync();
    }
}