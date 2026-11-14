using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Domain.ValueObjects;
using CulinaryBlog.Infrastructure.Data;

namespace CulinaryBlog.Infrastructure.Persistence.Seeders;

public static class CulinaryBlogSeeder
{
    public record CategorySeedItem(
        string Name,
        string Slug,
        string Description,
        string ImageUrl
    );

    public record ImageSeedItem(
        string Url,
        string Alt
    );

    public record AuthorSeedItem(
        string Email,
        string UserName,
        string DisplayName,
        string Password,
        string[] Roles,
        string Avatar
    );

    public static readonly AuthorSeedItem[] PredefinedAuthors =
    [
        new("admin@culinaryblog.com", "admin", "Quản trị viên Hệ thống", "Admin@123456", ["Admin", "Author"], "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"),
        new("author@culinaryblog.com", "author", "Đầu bếp Chuẩn Vị", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"),
        new("user@culinaryblog.com", "user", "Thành viên Khám Phá", "User@123456", ["Reader"], "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"),
        new("nguyenanh@culinaryblog.com", "nguyenanh", "Bếp trưởng Nguyễn Anh", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80"),
        new("tranbinh@culinaryblog.com", "tranbinh", "Nghệ nhân Trần Bình", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80"),
        new("lechi@culinaryblog.com", "lechi", "Chuyên gia Lê Chi", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"),
        new("phamdung@culinaryblog.com", "phamdung", "Bếp trưởng Phạm Dũng", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"),
        new("hoangyen@culinaryblog.com", "hoangyen", "Đầu bếp Hoàng Yến", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"),
        new("voha@culinaryblog.com", "voha", "Chuyên gia Võ Hà", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"),
        new("dangkhoa@culinaryblog.com", "dangkhoa", "Đầu bếp Đặng Khoa", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"),
        new("buimai@culinaryblog.com", "buimai", "Nghệ nhân Bùi Mai", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"),
        new("donam@culinaryblog.com", "donam", "Bếp trưởng Đỗ Nam", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"),
        new("ngophuong@culinaryblog.com", "ngophuong", "Chuyên gia Ngô Phương", "Author@123456", ["Author"], "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80")
    ];

    public static readonly CategorySeedItem[] PredefinedCategories =
    [
        new("Món khai vị", "mon-khai-vi", "Các món khai vị nhẹ nhàng, tinh tế đánh thức vị giác đầu bữa tiệc như gỏi cuốn tôm thịt, nem rán, súp cua và các món nộm thanh mát.", "/culinary-blog/categories/mon-khai-vi.jpg"),
        new("Món chính", "mon-chinh", "Các món ăn chính đậm đà phong vị Việt, giàu dinh dưỡng, là linh hồn của mỗi bữa cơm gia đình sum vầy.", "/culinary-blog/categories/mon-chinh.jpg"),
        new("Canh & Súp", "canh-sup", "Các món canh thanh mát và súp bổ dưỡng từ xương hầm rau củ nhiệt đới tươi ngon, cân bằng dinh dưỡng và xua tan mệt mỏi.", "/culinary-blog/categories/canh-sup.jpg"),
        new("Món chay", "mon-chay", "Các món chay thanh tịnh, chế biến tinh tế từ đậu hũ, nấm tươi và các loại củ quả thanh khiết cho sức khỏe an lành.", "/culinary-blog/categories/mon-chay.jpg"),
        new("Tráng miệng", "trang-mieng", "Các món chè ba miền, bánh ngọt, sữa chua và hoa quả tươi thanh mát khép lại trọn vẹn bữa tiệc gia đình.", "/culinary-blog/categories/trang-mieng.jpg"),
        new("Đồ uống", "do-uong", "Các loại đồ uống mát lạnh sảng khoái từ trà hoa quả nhiệt đới, cà phê truyền thống và nước ép thanh lọc cơ thể.", "/culinary-blog/categories/do-uong.jpg"),
        new("Món kho", "mon-kho", "Các món kho đậm đà màu cánh gián đặc trưng như thịt kho tàu, cá lóc kho tộ sánh quyện ăn kèm cơm trắng nóng hổi.", "/culinary-blog/categories/mon-kho.jpg"),
        new("Món xào", "mon-xao", "Các món xào giòn ngọt trên lửa lớn, lưu giữ trọn vẹn độ tươi ngon và sắc màu tự nhiên của rau củ, hải sản và thịt bò.", "/culinary-blog/categories/mon-xao.jpg"),
        new("Món nướng", "mon-nuong", "Các món nướng thơm lừng trên than hoa rực hồng, tẩm ướp gia vị sả ớt, mật ong và thảo mộc đậm đà cuốn hút.", "/culinary-blog/categories/mon-nuong.jpg"),
        new("Món chiên & rán", "mon-chien-ran", "Các món chiên rán vỏ ngoài vàng ươm giòn rụm, bên trong mềm ẩm mọng nước, chấm cùng nước chấm chua ngọt.", "/culinary-blog/categories/mon-chien-ran.jpg"),
        new("Món hấp", "mon-hap", "Các món hấp thanh tao giữ nguyên vẹn độ tươi ngọt, vitamin và dưỡng chất quý giá của tôm cá và thịt tươi non.", "/culinary-blog/categories/mon-hap.jpg"),
        new("Món luộc", "mon-luoc", "Các món luộc mộc mạc, ngọt tự nhiên từ thịt và rau xanh tươi, chấm kèm mắm gừng, mắm tôm hoặc kho quẹt đậm đà.", "/culinary-blog/categories/mon-luoc.jpg"),
        new("Món gỏi & nộm", "mon-goi-nom", "Các món gỏi nộm giòn sần sật hòa quyện vị chua cay mặn ngọt thanh mát kích thích vị giác và chống ngấy tuyệt hảo.", "/culinary-blog/categories/mon-goi-nom.jpg"),
        new("Món lẩu", "mon-lau", "Các món lẩu nghi ngút khói cho những buổi tụ họp ấm áp, nước lẩu ngọt thơm từ xương hòa cùng hải sản tươi rói.", "/culinary-blog/categories/mon-lau.jpg"),
        new("Bún - Phở - Mì", "bun-pho-mi", "Linh hồn ẩm thực sợi Việt Nam với nước dùng ninh xương ống hồi quế thơm lừng và sợi bánh tươi dẻo mềm.", "/culinary-blog/categories/bun-pho-mi.jpg"),
        new("Cơm & Cháo", "com-chao", "Các món cơm tấm sườn bì chả, cơm chiên ngọc bích và cháo sánh mịn ấm lòng, nền tảng thân thương của ẩm thực Á Đông.", "/culinary-blog/categories/com-chao.jpg"),
        new("Hải sản", "hai-san", "Hải sản tươi sống đậm vị mặn mòi của biển khơi từ tôm sú, cua biển, mực trứng, cá mú nướng hấp xào phong phú.", "/culinary-blog/categories/hai-san.jpg"),
        new("Món ăn vặt", "mon-an-vat", "Ẩm thực đường phố cuốn hút như bánh tráng nướng, nem chua rán, cút lộn xào me gắn liền với ký ức tuổi trẻ.", "/culinary-blog/categories/mon-an-vat.jpg"),
        new("Bánh ngọt & mặn", "banh-ngot", "Các loại bánh truyền thống và bánh nướng thơm lừng mùi bơ, cốt dừa, bột gạo với kết cấu mềm xốp khó quên.", "/culinary-blog/categories/banh-ngot.jpg"),
        new("Ẩm thực Miền Bắc", "am-thuc-mien-bac", "Nét tinh hoa kinh kỳ ngàn năm thanh tao, chuẩn mực, vị thanh nhẹ vừa vặn không quá cay nồng.", "/culinary-blog/categories/am-thuc-mien-bac.jpg"),
        new("Ẩm thực Miền Trung", "am-thuc-mien-trung", "Hương vị cung đình và dân gian miền Trung đậm đà sắc đỏ ớt cay nồng, mắm thơm và đậm đà khó phai.", "/culinary-blog/categories/am-thuc-mien-trung.jpg"),
        new("Ẩm thực Miền Nam", "am-thuc-mien-nam", "Hào sảng, phóng khoáng mang vị ngọt tự nhiên của nước dừa, đường thốt nốt và rau đồng trù phú phù sa.", "/culinary-blog/categories/am-thuc-mien-nam.jpg"),
        new("Gia cầm", "gia-cam", "Thịt gà ta thả vườn, vịt cỏ thơm ngon, da giòn thịt ngọt chế biến nướng muối ớt, luộc lá chanh hoặc xáo măng.", "/culinary-blog/categories/gia-cam.jpg"),
        new("Thịt bò", "thit-bo", "Thịt bò mềm mọng giàu sắt, biến hóa đa dạng từ bò lúc lắc, sốt tiêu, bò kho gừng đến phở bò tái lăn chuẩn vị.", "/culinary-blog/categories/thit-bo.jpg"),
        new("Thịt heo", "thit-heo", "Nguyên liệu gần gũi nhất trong mâm cơm Việt với thịt kho tàu, sườn nướng mật ong, ba chỉ cuộn rau rừng.", "/culinary-blog/categories/thit-heo.jpg")
    ];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var fileStorage = scope.ServiceProvider.GetService<IFileStorageService>();

        // 0. Đảm bảo MinIO storage bucket & anonymous public read policy
        if (fileStorage != null)
        {
            try
            {
                await fileStorage.EnsureStorageReadyAsync();
            }
            catch
            {
                // Best-effort: Không làm đứt mạch seed dữ liệu nếu MinIO chưa bật
            }
        }

        // 1. Tạo Roles nếu chưa có
        string[] roles = ["Admin", "Author", "Reader"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Tạo Demo Accounts & Culinary Author Accounts
        var authorList = new List<ApplicationUser>();
        foreach (var def in PredefinedAuthors)
        {
            var existingUser = await userManager.FindByEmailAsync(def.Email);
            if (existingUser == null)
            {
                var newUser = new ApplicationUser
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = def.Email,
                    UserName = def.UserName,
                    DisplayName = def.DisplayName,
                    EmailConfirmed = true,
                    AvatarUrl = def.Avatar,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var createRes = await userManager.CreateAsync(newUser, def.Password);
                if (createRes.Succeeded)
                {
                    foreach (var role in def.Roles)
                    {
                        try
                        {
                            await userManager.AddToRoleAsync(newUser, role);
                        }
                        catch
                        {
                            // Best-effort trong môi trường mock testing
                        }
                    }
                    if (def.Roles.Contains("Author"))
                    {
                        authorList.Add(newUser);
                    }
                }
            }
            else
            {
                foreach (var role in def.Roles)
                {
                    try
                    {
                        if (!await userManager.IsInRoleAsync(existingUser, role))
                        {
                            await userManager.AddToRoleAsync(existingUser, role);
                        }
                    }
                    catch
                    {
                        // Best-effort trong môi trường mock testing
                    }
                }
                if (def.Roles.Contains("Author"))
                {
                    authorList.Add(existingUser);
                }
            }
        }

        // 3. Chỉ nạp Master Dataset khi cơ sở dữ liệu chưa có công thức nào
        // Tuyệt đối không TRUNCATE TABLE trên mỗi lần restart để bảo toàn các công thức do người dùng/tác giả tạo.
        var hasRecipes = await db.Recipes.IgnoreQueryFilters().AnyAsync();
        if (hasRecipes)
        {
            return;
        }

        // 4. Ingest Master Dataset
        var masterDataset = LoadMasterDataset();

        // 5. Upsert Categories (tất cả 25 danh mục chuẩn)
        var existingCategories = await db.Categories.ToListAsync();
        var categoryMap = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);

        foreach (var catItem in masterDataset.Categories)
        {
            var existing = existingCategories.FirstOrDefault(c =>
                string.Equals(c.Slug, catItem.Slug, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(c.Name, catItem.Name, StringComparison.OrdinalIgnoreCase) ||
                IsCategoryNameMatch(c.Name, catItem.Name) ||
                c.Id == catItem.Id);

            if (existing != null)
            {
                existing.Name = catItem.Name;
                existing.Slug = catItem.Slug;
                existing.Description = catItem.Description;
                existing.ImageUrl = catItem.ImageUrl;
                existing.OrderIndex = catItem.OrderIndex;
                categoryMap[catItem.Slug] = existing.Id;
            }
            else
            {
                var newCat = new Category
                {
                    Id = catItem.Id != Guid.Empty ? catItem.Id : Guid.NewGuid(),
                    Name = catItem.Name,
                    Slug = catItem.Slug,
                    Description = catItem.Description,
                    ImageUrl = catItem.ImageUrl,
                    OrderIndex = catItem.OrderIndex,
                    RowVersion = new byte[8]
                };
                db.Categories.Add(newCat);
                categoryMap[catItem.Slug] = newCat.Id;
            }
        }
        await db.SaveChangesAsync();

        // 6. Ingest Recipes (104 công thức nấu ăn thực tế qua Rich Domain Model)
        var demoAuthor = authorList.FirstOrDefault(u => u.Email == "author@culinaryblog.com")
            ?? authorList.FirstOrDefault()
            ?? (await userManager.Users.FirstOrDefaultAsync())!;

        var recipesToAdd = new List<Recipe>();

        for (int rIdx = 0; rIdx < masterDataset.Recipes.Count; rIdx++)
        {
            var rItem = masterDataset.Recipes[rIdx];

            if (!categoryMap.TryGetValue(rItem.CategorySlug, out var catId))
            {
                catId = categoryMap.Values.FirstOrDefault();
            }

            // Gán AuthorId: Phở bò tái lăn gán cho author@culinaryblog.com, các món khác phân bổ tác giả thực tế
            string authorId;
            if (rItem.Slug == "pho-bo-tai-lan-chuan-vi-ha-thanh")
            {
                authorId = demoAuthor.Id;
            }
            else
            {
                var matchedAuthor = !string.IsNullOrWhiteSpace(rItem.AuthorEmail)
                    ? authorList.FirstOrDefault(u => string.Equals(u.Email, rItem.AuthorEmail, StringComparison.OrdinalIgnoreCase))
                    : null;

                if (matchedAuthor != null && matchedAuthor.Email != "author@culinaryblog.com")
                {
                    authorId = matchedAuthor.Id;
                }
                else
                {
                    authorId = authorList[rIdx % authorList.Count].Id;
                }
            }

            var nutrition = rItem.Nutrition != null
                ? new RecipeNutrition(
                    rItem.Nutrition.Calories,
                    rItem.Nutrition.Protein,
                    rItem.Nutrition.Carbohydrates,
                    rItem.Nutrition.Fat,
                    rItem.Nutrition.Fiber,
                    rItem.Nutrition.Sodium)
                : new RecipeNutrition();

            if (!Enum.TryParse<RecipeDifficulty>(rItem.Difficulty, true, out var diff))
            {
                diff = RecipeDifficulty.Medium;
            }

            var recipe = Recipe.Create(
                rItem.Title,
                rItem.Slug,
                rItem.Description,
                rItem.Instructions,
                rItem.PrepTimeMinutes,
                rItem.CookTimeMinutes,
                rItem.Servings,
                diff,
                catId,
                authorId,
                nutrition);

            if (rItem.Id != Guid.Empty)
            {
                recipe.Id = rItem.Id;
            }

            // Add Ingredients (>= 10 nguyên liệu)
            foreach (var ingr in rItem.Ingredients.OrderBy(i => i.OrderIndex))
            {
                var qty = ingr.Quantity ?? ingr.Amount ?? 1m;
                recipe.AddIngredient(ingr.Name, qty, ingr.Unit, ingr.Notes);
            }

            // Add Steps (>= 5 bước)
            foreach (var step in rItem.Steps.OrderBy(s => s.StepNumber))
            {
                var desc = !string.IsNullOrWhiteSpace(step.Description)
                    ? step.Description
                    : (step.Instruction ?? step.Title);
                var timer = step.TimerMinutes ?? (step.TimerSeconds.HasValue ? step.TimerSeconds.Value / 60 : null);
                recipe.AddStep(step.Title, desc, timer, step.ImageUrl);
            }

            // Add Images: Đúng 1 ảnh chính (OrderIndex = 0, IsPrimary = true), 2-4 ảnh phụ (OrderIndex = 1..4, IsPrimary = false)
            var sortedImages = rItem.Images.OrderBy(img => img.OrderIndex).ToList();
            for (int i = 0; i < sortedImages.Count; i++)
            {
                var img = sortedImages[i];
                var url = img.Url ?? img.OriginalUrl ?? string.Empty;
                var alt = img.AltText ?? img.Alt ?? recipe.Title;
                bool isPrimary = (i == 0);
                recipe.AddImage(url, img.MediumUrl ?? url, img.ThumbnailUrl ?? url, alt, isPrimary);
            }

            // Chuyển trạng thái sang Published và gán PublishedAt
            recipe.Publish();

            recipesToAdd.Add(recipe);
        }

        await db.Recipes.AddRangeAsync(recipesToAdd);
        await db.SaveChangesAsync();
    }

    public static async Task SeedDemoAccountsAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles = ["Admin", "Author", "Reader"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        foreach (var def in PredefinedAuthors)
        {
            var user = await userManager.FindByEmailAsync(def.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = def.Email,
                    UserName = def.UserName,
                    DisplayName = def.DisplayName,
                    EmailConfirmed = true,
                    AvatarUrl = def.Avatar,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var createRes = await userManager.CreateAsync(user, def.Password);
                if (createRes.Succeeded)
                {
                    foreach (var role in def.Roles)
                    {
                        try
                        {
                            await userManager.AddToRoleAsync(user, role);
                        }
                        catch
                        {
                            // Best-effort trong môi trường mock testing
                        }
                    }
                }
            }
            else
            {
                if (user.DisplayName != def.DisplayName || (user.DisplayName != null && user.DisplayName.Contains('?')))
                {
                    user.DisplayName = def.DisplayName;
                    await userManager.UpdateAsync(user);
                }

                foreach (var role in def.Roles)
                {
                    try
                    {
                        if (!await userManager.IsInRoleAsync(user, role))
                        {
                            await userManager.AddToRoleAsync(user, role);
                        }
                    }
                    catch
                    {
                        // Best-effort trong môi trường mock testing
                    }
                }
            }
        }
    }

    public static async Task SeedAuthorBookmarksAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var recipes = await db.Recipes
            .Where(r => r.Status == RecipeStatus.Published)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();

        if (recipes.Count == 0) return;

        var users = await db.Users.ToListAsync();
        if (users.Count == 0) return;

        var adminUser = users.FirstOrDefault(u => u.Email == "admin@culinaryblog.com");
        var authorUser = users.FirstOrDefault(u => u.Email == "author@culinaryblog.com");
        var readerUser = users.FirstOrDefault(u => u.Email == "user@culinaryblog.com");
        var otherAuthors = users.Where(u => u.Email != "admin@culinaryblog.com" && u.Email != "author@culinaryblog.com").ToList();

        var existingBookmarks = await db.RecipeBookmarks.ToListAsync();
        var existingSet = new HashSet<string>(existingBookmarks.Select(b => $"{b.UserId}_{b.RecipeId}"));
        var newBookmarks = new List<RecipeBookmark>();

        if (existingBookmarks.Count < 10)
        {
            for (int i = 0; i < recipes.Count; i++)
            {
                var recipe = recipes[i];
                int targetBookmarkCount;

                if (i < 3) targetBookmarkCount = 12 + (i * 2);
                else if (i < 8) targetBookmarkCount = 7 + (i % 4);
                else if (i < 20) targetBookmarkCount = 3 + (i % 3);
                else if (i < 40) targetBookmarkCount = 1 + (i % 2);
                else targetBookmarkCount = 0;

                var candidateUsers = new List<ApplicationUser>();

                if (authorUser != null && (i == 1 || i == 2 || i == 4 || i == 6 || i == 9 || i == 13 || i == 17))
                {
                    candidateUsers.Add(authorUser);
                }

                if (adminUser != null && (i == 0 || i == 2 || i == 3 || i == 5 || i == 8 || i == 12 || i == 16 || i == 20))
                {
                    candidateUsers.Add(adminUser);
                }

                if (readerUser != null && (i == 0 || i == 1 || i == 3 || i == 4 || i == 7 || i == 10))
                {
                    candidateUsers.Add(readerUser);
                }

                int userIdx = i;
                while (candidateUsers.Count < targetBookmarkCount && otherAuthors.Count > 0)
                {
                    var candidate = otherAuthors[userIdx % otherAuthors.Count];
                    if (!candidateUsers.Contains(candidate))
                    {
                        candidateUsers.Add(candidate);
                    }
                    userIdx++;
                    if (userIdx - i > otherAuthors.Count * 2) break;
                }

                foreach (var u in candidateUsers)
                {
                    var key = $"{u.Id}_{recipe.Id}";
                    if (!existingSet.Contains(key))
                    {
                        existingSet.Add(key);
                        var bm = RecipeBookmark.Create(u.Id, recipe.Id);
                        newBookmarks.Add(bm);
                    }
                }
            }

            if (newBookmarks.Count > 0)
            {
                await db.RecipeBookmarks.AddRangeAsync(newBookmarks);
                await db.SaveChangesAsync();
            }
        }

        var bookmarkCounts = await db.RecipeBookmarks
            .GroupBy(b => b.RecipeId)
            .Select(g => new { RecipeId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.RecipeId, x => x.Count);

        foreach (var r in recipes)
        {
            int currentActualCount = bookmarkCounts.GetValueOrDefault(r.Id, 0);
            int delta = currentActualCount - r.BookmarkCount;
            if (delta != 0)
            {
                r.AdjustBookmarkCount(delta);
            }

            if (r.ViewCount == 0 || r.ViewCount < currentActualCount * 10)
            {
                long baseViews = currentActualCount > 0 ? (currentActualCount * 140) : 45;
                long seedViews = baseViews + ((Math.Abs(r.Slug.GetHashCode()) % 250) + 15);
                long viewDelta = seedViews - r.ViewCount;
                if (viewDelta > 0)
                {
                    r.IncrementViews(viewDelta);
                }
            }
        }

        await db.SaveChangesAsync();
    }

    private static bool IsCategoryNameMatch(string? nameInDb, string datasetName)
    {
        if (string.IsNullOrWhiteSpace(nameInDb)) return false;
        if (nameInDb.Equals("Món canh", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Canh & Súp", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Món chiên rán", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Món chiên & rán", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Món gỏi - nộm", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Món gỏi & nộm", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Mì - Bún - Phở", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Bún - Phở - Mì", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Bánh ngọt", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Bánh ngọt & mặn", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Ẩm thực miền Bắc", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Ẩm thực Miền Bắc", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Ẩm thực miền Trung", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Ẩm thực Miền Trung", StringComparison.OrdinalIgnoreCase)) return true;
        if (nameInDb.Equals("Ẩm thực miền Nam", StringComparison.OrdinalIgnoreCase) && datasetName.Equals("Ẩm thực Miền Nam", StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }

    private static MasterDataset LoadMasterDataset()
    {
        // 1. Tìm trong EmbeddedResource của assembly
        var assembly = typeof(CulinaryBlogSeeder).Assembly;
        var resourceName = "CulinaryBlog.Infrastructure.Data.Datasets.recipes_master_dataset.json";
        using (var stream = assembly.GetManifestResourceStream(resourceName))
        {
            if (stream != null)
            {
                using var reader = new StreamReader(stream, Encoding.UTF8);
                var json = reader.ReadToEnd();
                var data = JsonSerializer.Deserialize<MasterDataset>(json, JsonOptions);
                if (data != null && data.Categories.Count > 0 && data.Recipes.Count > 0)
                {
                    return data;
                }
            }
        }

        // 2. Tìm theo các đường dẫn tương đối
        string[] candidatePaths = [
            Path.Combine(AppContext.BaseDirectory, "Data", "Datasets", "recipes_master_dataset.json"),
            Path.Combine(AppContext.BaseDirectory, "recipes_master_dataset.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "backend", "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "Data", "Datasets", "recipes_master_dataset.json")
        ];

        foreach (var path in candidatePaths)
        {
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path, Encoding.UTF8);
                var data = JsonSerializer.Deserialize<MasterDataset>(json, JsonOptions);
                if (data != null && data.Categories.Count > 0 && data.Recipes.Count > 0)
                {
                    return data;
                }
            }
        }

        // 3. Quét ngược lên các thư mục cha
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null && dir.Exists)
        {
            var target = Path.Combine(dir.FullName, "backend", "src", "Infrastructure", "Data", "Datasets", "recipes_master_dataset.json");
            if (File.Exists(target))
            {
                var json = File.ReadAllText(target, Encoding.UTF8);
                var data = JsonSerializer.Deserialize<MasterDataset>(json, JsonOptions);
                if (data != null && data.Categories.Count > 0 && data.Recipes.Count > 0)
                {
                    return data;
                }
            }
            dir = dir.Parent;
        }

        throw new FileNotFoundException("Không tìm thấy tệp recipes_master_dataset.json trong EmbeddedResource hoặc hệ thống tệp.");
    }

    private class MasterDataset
    {
        public List<CategoryDatasetItem> Categories { get; set; } = [];
        public List<RecipeDatasetItem> Recipes { get; set; } = [];
    }

    private class CategoryDatasetItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int OrderIndex { get; set; }
    }

    private class RecipeDatasetItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public string AuthorEmail { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public int PrepTimeMinutes { get; set; }
        public int CookTimeMinutes { get; set; }
        public int Servings { get; set; }
        public string Difficulty { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public RecipeNutritionDatasetItem? Nutrition { get; set; }
        public List<IngredientDatasetItem> Ingredients { get; set; } = [];
        public List<StepDatasetItem> Steps { get; set; } = [];
        public List<ImageDatasetItem> Images { get; set; } = [];
    }

    private class RecipeNutritionDatasetItem
    {
        public decimal? Calories { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Carbohydrates { get; set; }
        public decimal? Fat { get; set; }
        public decimal? Fiber { get; set; }
        public decimal? Sodium { get; set; }
    }

    private class IngredientDatasetItem
    {
        public string Name { get; set; } = string.Empty;
        public decimal? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public string? Unit { get; set; }
        public string? Notes { get; set; }
        public int OrderIndex { get; set; }
    }

    private class StepDatasetItem
    {
        public int StepNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instruction { get; set; }
        public int? TimerMinutes { get; set; }
        public int? TimerSeconds { get; set; }
        public string? ImageUrl { get; set; }
        public int OrderIndex { get; set; }
    }

    private class ImageDatasetItem
    {
        public Guid? Id { get; set; }
        public string? Url { get; set; }
        public string? OriginalUrl { get; set; }
        public string? MediumUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Alt { get; set; }
        public string? AltText { get; set; }
        public bool IsPrimary { get; set; }
        public int OrderIndex { get; set; }
    }
}
