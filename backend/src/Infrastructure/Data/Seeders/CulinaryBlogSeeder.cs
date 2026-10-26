using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Domain.Enums;
using CulinaryBlog.Domain.Interfaces;
using CulinaryBlog.Infrastructure.Data;

namespace CulinaryBlog.Infrastructure.Persistence.Seeders;

public static class CulinaryBlogSeeder
{
    private const int SEED = 42;

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

    public static readonly CategorySeedItem[] PredefinedCategories =
    [
        new("Món khai vị", "mon-khai-vi", "Các món ăn thuộc danh mục Món khai vị nhẹ nhàng, tinh tế đánh thức vị giác đầu bữa tiệc như gỏi cuốn tôm thịt, nem rán, súp cua măng tây và các món nộm thanh mát.", "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"),
        new("Món chính", "mon-chinh", "Các món ăn thuộc danh mục Món chính giàu đạm và dinh dưỡng, đậm đà phong vị Việt, là tâm điểm ấm cúng trong mỗi mâm cơm sum họp gia đình.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"),
        new("Món canh", "mon-canh", "Các món ăn thuộc danh mục Món canh thanh mát, ngọt nước từ xương hầm và rau củ nhiệt đới tươi non, xua tan cái nóng oi bức và bồi bổ sức khỏe.", "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"),
        new("Món kho", "mon-kho", "Các món ăn thuộc danh mục Món kho đậm đà màu cánh gián, vị mặn ngọt hài hòa đặc trưng của thịt kho tàu nước dừa, cá lóc kho tộ ăn kèm cơm trắng nóng hổi.", "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"),
        new("Món xào", "mon-xao", "Các món ăn thuộc danh mục Món xào giòn ngọt trên lửa lớn, giữ trọn vẹn vitamin và sắc màu tươi sáng tự nhiên của rau củ tươi cùng hải sản, thịt bò.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"),
        new("Món nướng", "mon-nuong", "Các món ăn thuộc danh mục Món nướng thơm nức mũi trên than hoa rực hồng, tẩm ướp gia vị sả ớt, mật ong và thảo mộc đậm đà khó cưỡng.", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"),
        new("Món chiên rán", "mon-chien-ran", "Các món ăn thuộc danh mục Món chiên rán lớp vỏ ngoài giòn rụm màu vàng ruộm, bên trong giữ nguyên độ mềm ẩm, ăn kèm rau sống và nước chấm chua ngọt.", "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80"),
        new("Món hấp", "mon-hap", "Các món ăn thuộc danh mục Món hấp thanh tao và bổ dưỡng, lưu giữ nguyên vẹn độ ngọt tự nhiên, độ tươi ngon và dưỡng chất quý giá của món ăn.", "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"),
        new("Món luộc", "mon-luoc", "Các món ăn thuộc danh mục Món luộc mộc mạc, thuần túy, đề cao độ tươi ngọt tự nhiên của thịt và rau xanh, chấm cùng nước mắm tỏi ớt hoặc kho quẹt.", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"),
        new("Món gỏi - nộm", "mon-goi-nom", "Các món ăn thuộc danh mục Món gỏi - nộm giòn sần sật, hòa quyện bốn vị chua, cay, mặn, ngọt hài hòa kích thích vị giác và chống ngấy hiệu quả.", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"),
        new("Món lẩu", "mon-lau", "Các món ăn thuộc danh mục Món lẩu ấm nồng cho những dịp sum họp, nước lẩu chua cay hoặc ngọt thanh từ xương, phong phú các loại hải sản, thịt và rau nhúng.", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"),
        new("Món chay", "mon-chay", "Các món ăn thuộc danh mục Món chay thanh tịnh, chế biến sáng tạo từ nấm tươi, đậu hũ và rau củ quả thuần khiết mang lại sự an lành và dồi dào sức khỏe.", "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80"),
        new("Món ăn vặt", "mon-an-vat", "Các món ăn thuộc danh mục Món ăn vặt đường phố hấp dẫn, vui miệng như bánh tráng nướng, nem chua rán, cút lộn xào me gắn liền với tuổi trẻ.", "https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=800&q=80"),
        new("Đồ uống", "do-uong", "Các món ăn thuộc danh mục Đồ uống mát lạnh, sảng khoái từ các loại trà hoa quả nhiệt đới, cà phê sữa đá đậm đà và sinh tố tươi giàu dưỡng chất.", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"),
        new("Tráng miệng", "trang-mieng", "Các món ăn thuộc danh mục Tráng miệng ngọt dịu và tươi mát với các món chè ba miền, sữa chua dẻo, rau câu và hoa quả tươi khép lại bữa ăn hoàn mỹ.", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"),
        new("Bánh ngọt", "banh-ngot", "Các món ăn thuộc danh mục Bánh ngọt nướng thơm lừng mùi bơ Pháp, vani và socola với kết cấu bông mềm xốp mịn làm say đắm lòng người.", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"),
        new("Mì - Bún - Phở", "mi-bun-pho", "Các món ăn thuộc danh mục Mì - Bún - Phở chứa đựng linh hồn ẩm thực Việt với nước dùng ninh từ xương ống hồi quế thơm ngát, sợi bánh mềm dai truyền thống.", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80"),
        new("Cơm & Cháo", "com-chao", "Các món ăn thuộc danh mục Cơm & Cháo bình dị, chắc bụng từ cơm tấm sườn nướng, cơm chiên ngọc bích đến các bát cháo sườn, cháo hải sản ấm lòng.", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"),
        new("Hải sản", "hai-san", "Các món ăn thuộc danh mục Hải sản tươi rói mang hương vị mặn mòi của biển khơi từ tôm sú, cua biển, cá mú, mực trứng chế biến hấp, nướng, xào.", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"),
        new("Gia cầm", "gia-cam", "Các món ăn thuộc danh mục Gia cầm thịt ngọt da giòn từ gà thả vườn, vịt cỏ, bồ câu nấu chao, nướng muối ớt hay luộc lá chanh truyền thống.", "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80"),
        new("Thịt bò", "thit-bo", "Các món ăn thuộc danh mục Thịt bò mềm ngọt giàu sắt, biến hóa đa dạng từ bò lúc lắc, bít tết sốt tiêu, bò sốt vang đến phở bò tái lăn.", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"),
        new("Thịt heo", "thit-heo", "Các món ăn thuộc danh mục Thịt heo nguyên liệu quen thuộc hàng đầu mâm cơm Việt với thịt kho tàu, sườn nướng, chả giò và ba chỉ luộc giòn sần sật.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"),
        new("Ẩm thực miền Bắc", "am-thuc-mien-bac", "Các món ăn thuộc danh mục Ẩm thực miền Bắc nổi tiếng với nét tinh tế, vị thanh nhẹ vừa vặn không quá cay nồng, lưu giữ hồn cốt đất kinh kỳ ngàn năm.", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80"),
        new("Ẩm thực miền Trung", "am-thuc-mien-trung", "Các món ăn thuộc danh mục Ẩm thực miền Trung đậm đà, màu sắc rực rỡ và cay nồng đặc sắc với bún bò Huế, mì Quảng, nem nướng và các món mắm trứ danh.", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"),
        new("Ẩm thực miền Nam", "am-thuc-mien-nam", "Các món ăn thuộc danh mục Ẩm thực miền Nam hào sảng, phóng khoáng kết hợp vị ngọt tự nhiên của nước dừa, đường thốt nốt và rau đồng trù phú phù sa.", "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80")
    ];

    public static readonly ImageSeedItem[] RecipeImages =
    [
        new("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80", "Bát phở bò truyền thống bốc khói nghi ngút"),
        new("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", "Món sườn nướng mật ong óng ả thơm lừng"),
        new("https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80", "Gỏi cuốn tôm thịt thanh mát kèm nước chấm tương đen"),
        new("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80", "Nồi lẩu hải sản chua cay thơm nồng đậm đà"),
        new("https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80", "Cơm rang ngọc bích đỗ xanh giòn thơm"),
        new("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80", "Thịt xiên nướng than hoa sốt mè thơm phức"),
        new("https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80", "Dimsum hấp trong xửng tre nóng hổi"),
        new("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80", "Đĩa salad rau củ mùa hè thanh mát sốt giấm"),
        new("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80", "Món rau củ xào dầu hào giữ trọn độ giòn ngọt"),
        new("https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80", "Gà rán giòn rụm màu vàng óng hấp dẫn"),
        new("https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80", "Bít tết bò sốt tiêu đen thảo mộc"),
        new("https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80", "Tôm càng nướng bơ tỏi thơm lừng"),
        new("https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1200&q=80", "Đậu hũ sốt nấm hương tươi thanh đạm"),
        new("https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80", "Canh sườn hầm rau củ nhiệt đới thanh mát"),
        new("https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80", "Bánh mì giòn rụm kẹp thịt và pate thơm béo")
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
        Randomizer.Seed = new Random(SEED);
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

        // Bỏ qua nếu đã đủ 100 recipes (bảo đảm tính cô lập kiểm thử theo chuẩn)
        if (await db.Recipes.CountAsync() >= 100) return;

        // 2. Tạo 10 Authors mẫu qua Faker chuẩn xác định (Deterministic Seed 42)
        var authorFaker = new Faker<ApplicationUser>("vi")
            .RuleFor(u => u.Id, f => Guid.NewGuid().ToString())
            .RuleFor(u => u.DisplayName, f => f.Name.FullName())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.EmailConfirmed, f => true)
            .RuleFor(u => u.AvatarUrl, f => f.Internet.Avatar());

        var authors = authorFaker.UseSeed(SEED).Generate(10);
        for (int idx = 0; idx < authors.Count; idx++)
        {
            var author = authors[idx];
            var existingUser = await userManager.FindByEmailAsync(author.Email!);
            if (existingUser == null)
            {
                var result = await userManager.CreateAsync(author, "Author@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(author, "Author");
                    if (idx == 0)
                    {
                        // Gán thêm quyền Admin cho tác giả đầu tiên để hỗ trợ quản trị
                        await userManager.AddToRoleAsync(author, "Admin");
                    }
                }
            }
            else
            {
                author.Id = existingUser.Id;
            }
        }

        // 3. Tạo Categories (đảm bảo đúng 20 categories chuẩn với slug tiếng Việt)
        var currentCategories = await db.Categories.ToListAsync();
        if (currentCategories.Count < 20)
        {
            int order = currentCategories.Count;

            foreach (var item in PredefinedCategories)
            {
                if (currentCategories.Count >= 20) break;
                if (!currentCategories.Any(c => c.Name == item.Name))
                {
                    var slug = item.Slug;
                    if (currentCategories.Any(c => c.Slug == slug))
                    {
                        slug = $"{item.Slug}-{order + 1}";
                    }

                    var cat = new Category
                    {
                        Name = item.Name,
                        Slug = slug,
                        Description = item.Description,
                        ImageUrl = item.ImageUrl,
                        OrderIndex = ++order,
                        RowVersion = new byte[8]
                    };
                    db.Categories.Add(cat);
                    currentCategories.Add(cat);
                }
            }
            await db.SaveChangesAsync();
        }
        else
        {
            // Bổ sung ImageUrl & Description thật cho các categories đã tồn tại nếu đang thiếu
            bool hasUpdates = false;
            foreach (var cat in currentCategories)
            {
                var meta = PredefinedCategories.FirstOrDefault(p => p.Name == cat.Name);
                if (meta != null)
                {
                    if (string.IsNullOrWhiteSpace(cat.ImageUrl))
                    {
                        cat.ImageUrl = meta.ImageUrl;
                        hasUpdates = true;
                    }
                    if (string.IsNullOrWhiteSpace(cat.Description) || cat.Description == $"Các món ăn thuộc danh mục {cat.Name}")
                    {
                        cat.Description = meta.Description;
                        hasUpdates = true;
                    }
                }
            }
            if (hasUpdates)
            {
                await db.SaveChangesAsync();
            }
        }

        var categoryIds = currentCategories.Select(c => c.Id).ToList();

        // 4. Backfill Dữ liệu hình ảnh / bước / nguyên liệu cho recipes đã tồn tại nếu thiếu
        var existingRecipes = await db.Recipes
            .Include(r => r.Images)
            .Include(r => r.Steps)
            .Include(r => r.Ingredients)
            .ToListAsync();

        bool hasBackfillUpdates = false;
        var rand = new Random(SEED);

        foreach (var r in existingRecipes)
        {
            if (r.Images.Count == 0)
            {
                int imgCount = rand.Next(2, 4);
                var samples = RecipeImages.OrderBy(_ => rand.Next()).Take(imgCount).ToList();
                for (int idx = 0; idx < samples.Count; idx++)
                {
                    r.AddImage(
                        originalUrl: samples[idx].Url,
                        mediumUrl: samples[idx].Url,
                        thumbnailUrl: samples[idx].Url,
                        altText: samples[idx].Alt,
                        isPrimary: idx == 0);
                }
                hasBackfillUpdates = true;
            }

            if (r.Steps.Count == 0)
            {
                int stepCount = rand.Next(5, 8);
                for (int s = 1; s <= stepCount; s++)
                {
                    r.AddStep(
                        $"Bước {s}: Tiến hành chế biến",
                        StepDescriptions[rand.Next(StepDescriptions.Length)],
                        rand.Next(5, 35));
                }
                hasBackfillUpdates = true;
            }

            if (r.Ingredients.Count == 0)
            {
                int ingrCount = rand.Next(8, 12);
                var selected = IngredientPool.OrderBy(_ => rand.Next()).Take(ingrCount).ToList();
                foreach (var ingr in selected)
                {
                    r.AddIngredient(
                        ingr,
                        (decimal)rand.Next(10, 500),
                        "gram",
                        rand.Next(0, 3) == 0 ? "Ưu tiên chọn loại tươi ngon" : null);
                }
                hasBackfillUpdates = true;
            }
        }

        if (hasBackfillUpdates)
        {
            await db.SaveChangesAsync();
        }

        // 5. Tạo Recipes mới nếu chưa đủ 100 recipes
        int recipesNeeded = 100 - await db.Recipes.CountAsync();
        if (recipesNeeded <= 0) return;

        var recipeFaker = new Faker<Recipe>()
            .CustomInstantiator(f =>
            {
                var baseTitle = f.PickRandom(RecipeTitles);
                var title = $"{baseTitle} {f.Random.Int(1, 999)}";
                var slug = f.Lorem.Slug() + "-" + f.Random.Guid().ToString()[..8];
                var author = f.PickRandom(authors);

                return Recipe.Create(
                    title,
                    slug,
                    f.Lorem.Paragraph(2),
                    "Hướng dẫn chi tiết theo các bước thực hiện bên dưới.",
                    f.Random.Int(15, 60),
                    f.Random.Int(20, 180),
                    f.Random.Int(2, 8),
                    f.PickRandom<RecipeDifficulty>(),
                    f.PickRandom(categoryIds),
                    author.Id);
            });

        var recipes = recipeFaker.UseSeed(SEED).Generate(recipesNeeded);

        // 6. Tạo Steps (5-8 bước), Ingredients (10-15 nguyên liệu), và Images (2-4 ảnh) qua Rich Domain API
        var stepFaker = new Faker("vi");
        var ingrFaker = new Faker("vi");

        foreach (var recipe in recipes)
        {
            int stepCount = stepFaker.Random.Int(5, 8);
            for (int s = 1; s <= stepCount; s++)
            {
                recipe.AddStep(
                    $"Bước {s}: Tiến hành chế biến",
                    stepFaker.PickRandom(StepDescriptions),
                    stepFaker.Random.Int(5, 35));
            }

            int ingrCount = ingrFaker.Random.Int(10, 15);
            var selectedIngredients = ingrFaker.PickRandom(IngredientPool, ingrCount).ToList();

            for (int i = 0; i < selectedIngredients.Count; i++)
            {
                recipe.AddIngredient(
                    selectedIngredients[i],
                    ingrFaker.Random.Decimal(5, 500),
                    ingrFaker.PickRandom("gram", "ml", "thìa canh", "quả", "củ", "nhánh"),
                    ingrFaker.Random.Bool(0.3f) ? "Ưu tiên chọn loại tươi ngon" : null);
            }

            // Thêm từ 2 đến 4 ảnh cho mỗi recipe (ảnh đầu tiên là Primary)
            int imgCount = stepFaker.Random.Int(2, 4);
            var selectedImages = stepFaker.PickRandom(RecipeImages, imgCount).DistinctBy(x => x.Url).ToList();
            for (int idx = 0; idx < selectedImages.Count; idx++)
            {
                recipe.AddImage(
                    originalUrl: selectedImages[idx].Url,
                    mediumUrl: selectedImages[idx].Url,
                    thumbnailUrl: selectedImages[idx].Url,
                    altText: selectedImages[idx].Alt,
                    isPrimary: idx == 0);
            }

            // Seeder tạo dữ liệu Published (cần ít nhất 1 step — đã có ở trên).
            recipe.Publish();
        }

        await db.Recipes.AddRangeAsync(recipes);
        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Tạo các tài khoản Demo chuẩn phục vụ thuyết minh, bảo vệ đồ án và kiểm thử trực quan.
    /// Admin: admin@culinaryblog.com / Admin@123456
    /// Author: author@culinaryblog.com / Author@123456
    /// Reader: user@culinaryblog.com / User@123456
    /// Kèm 2 công thức showcase với đầy đủ ảnh, bước, nguyên liệu để kiểm thử Gallery & CRUD.
    /// </summary>
    public static async Task SeedDemoAccountsAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var db = scope.ServiceProvider.GetRequiredService<CulinaryBlogDbContext>();

        var demoAccounts = new[]
        {
            new
            {
                Email = "admin@culinaryblog.com",
                UserName = "admin",
                DisplayName = "Quản trị viên Hệ thống",
                Password = "Admin@123456",
                Roles = new[] { "Admin", "Author" },
                Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            },
            new
            {
                Email = "author@culinaryblog.com",
                UserName = "author",
                DisplayName = "Đầu bếp Chuẩn Vị",
                Password = "Author@123456",
                Roles = new[] { "Author" },
                Avatar = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
            },
            new
            {
                Email = "user@culinaryblog.com",
                UserName = "user",
                DisplayName = "Thành viên Khám Phá",
                Password = "User@123456",
                Roles = new[] { "Reader" },
                Avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
            }
        };

        ApplicationUser? demoAuthor = null;

        foreach (var demo in demoAccounts)
        {
            var user = await userManager.FindByEmailAsync(demo.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = demo.Email,
                    UserName = demo.UserName,
                    DisplayName = demo.DisplayName,
                    EmailConfirmed = true,
                    AvatarUrl = demo.Avatar
                };

                var createRes = await userManager.CreateAsync(user, demo.Password);
                if (createRes.Succeeded)
                {
                    foreach (var role in demo.Roles)
                    {
                        await userManager.AddToRoleAsync(user, role);
                    }
                }
            }
            else
            {
                foreach (var role in demo.Roles)
                {
                    if (!await userManager.IsInRoleAsync(user, role))
                    {
                        await userManager.AddToRoleAsync(user, role);
                    }
                }
            }

            if (demo.Email == "author@culinaryblog.com")
            {
                demoAuthor = user;
            }
        }

        // Tạo 2 công thức Showcase mẫu cho Demo/Thuyết minh (Author là author@culinaryblog.com)
        if (demoAuthor != null)
        {
            var demoCategory = await db.Categories.FirstOrDefaultAsync();
            if (demoCategory != null)
            {
                var showcaseItems = new[]
                {
                    new
                    {
                        Title = "Phở bò tái lăn chuẩn vị Hà Thành",
                        Slug = "pho-bo-tai-lan-chuan-vi-ha-thanh",
                        Description = "Công thức nấu phở bò tái lăn đậm đà nước dùng thơm mùi gừng tỏi xào lăn, sợi phở mềm mướt và thịt bò mềm ngọt chuẩn vị truyền thống Hà Nội.",
                        PrepTime = 30,
                        CookTime = 90,
                        Servings = 4,
                        Difficulty = RecipeDifficulty.Medium,
                        Images = new[]
                        {
                            new ImageSeedItem("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80", "Tô phở bò tái lăn bốc khói ngút ngàn"),
                            new ImageSeedItem("https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80", "Các loại rau thơm và gia vị ăn kèm phở"),
                            new ImageSeedItem("https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80", "Nồi nước dùng ninh từ xương ống trong veo")
                        }
                    },
                    new
                    {
                        Title = "Bánh mì kẹp thịt sườn nướng ngũ vị",
                        Slug = "banh-mi-kep-thit-suon-nuong-ngu-vi",
                        Description = "Bánh mì vỏ giòn rụm kẹp thịt sườn ướp ngũ vị hương nướng than hoa, kèm pate gan béo ngậy, đồ chua giòn ngọt và sốt bơ trứng đặc trưng.",
                        PrepTime = 20,
                        CookTime = 40,
                        Servings = 2,
                        Difficulty = RecipeDifficulty.Easy,
                        Images = new[]
                        {
                            new ImageSeedItem("https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80", "Bánh mì kẹp thịt sườn nướng hấp dẫn"),
                            new ImageSeedItem("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80", "Thịt sườn nướng xém cạnh thơm phức")
                        }
                    }
                };

                foreach (var dr in showcaseItems)
                {
                    if (!await db.Recipes.AnyAsync(r => r.Slug == dr.Slug))
                    {
                        var recipe = Recipe.Create(
                            dr.Title,
                            dr.Slug,
                            dr.Description,
                            "Hướng dẫn chi tiết từng bước nấu ăn bên dưới.",
                            dr.PrepTime,
                            dr.CookTime,
                            dr.Servings,
                            dr.Difficulty,
                            demoCategory.Id,
                            demoAuthor.Id);

                        recipe.AddStep("Sơ chế nguyên liệu", "Rửa sạch thịt bò và các loại rau gia vị thơm. Cắt thịt bò lát mỏng vừa ăn.", 15);
                        recipe.AddStep("Xào lăn thịt bò", "Đun chảo nóng già với mỡ gừng tỏi, cho thịt bò vào đảo nhanh tay trên lửa lớn trong 1 phút.", 5);
                        recipe.AddStep("Chan nước dùng và thưởng thức", "Trần bánh phở, xếp thịt bò lên trên, rắc hành hoa rồi chan nước dùng đang sôi sùng sục.", 5);

                        recipe.AddIngredient("Thịt bò bắp / thăn", 500, "gram", "Chọn thịt tươi màu đỏ thắm");
                        recipe.AddIngredient("Bánh phở tươi", 1, "kg", "Sợi phở mềm dai tự nhiên");
                        recipe.AddIngredient("Xương ống hầm", 1.5m, "kg", "Ninh lấy nước ngọt tự nhiên");
                        recipe.AddIngredient("Gừng già và tỏi ta", 100, "gram", "Đập dập phi thơm");

                        for (int i = 0; i < dr.Images.Length; i++)
                        {
                            recipe.AddImage(
                                dr.Images[i].Url,
                                dr.Images[i].Url,
                                dr.Images[i].Url,
                                dr.Images[i].Alt,
                                isPrimary: i == 0);
                        }

                        recipe.Publish();
                        db.Recipes.Add(recipe);
                    }
                }
                await db.SaveChangesAsync();
            }
        }
    }
}
