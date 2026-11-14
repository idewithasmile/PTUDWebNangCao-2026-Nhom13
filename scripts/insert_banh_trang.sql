DELETE FROM "Recipes" WHERE "Id" = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' OR "Slug" = 'banh-trang-nuong-da-lat-trung-cut';

INSERT INTO "Recipes" (
    "Id", "Title", "Slug", "Description", "Instructions",
    "PrepTimeMinutes", "CookTimeMinutes", "Servings", "Difficulty", "Status",
    "CategoryId", "AuthorId", "PublishedAt",
    "Nutrition_Calories", "Nutrition_Protein", "Nutrition_Carbohydrates", "Nutrition_Fat",
    "CreatedAt", "IsDeleted", "RowVersion"
) VALUES (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
    'Bánh Tráng Nướng Đà Lạt Trứng Cút Xúc Xích Giòn Rụm',
    'banh-trang-nuong-da-lat-trung-cut',
    'Món bánh tráng nướng Đà Lạt giòn rụm thơm lừng mùi bơ, đậm đà vị trứng cút béo dẻo, hòa quyện xúc xích xông khói, tép khô ngọt thanh và sốt mayonnaise béo ngậy trên than hồng.',
    'Nướng bánh tráng trên bếp than hoặc chảo chống dính, quết mỡ hành bơ, đập trứng cút tán đều, thêm xúc xích tép khô và phô mai, nướng giòn rụm rồi rưới tương ớt và sốt mayonnaise thưởng thức nóng.',
    10, 15, 3, 'Easy', 'Published',
    '296e3d59-90ae-48b1-a206-09816ba5a1c1', '852cc4dc-913d-4d95-8962-4c5407d77d3c', NOW(),
    320, 9, 38, 14,
    NOW(), false, '\x0000000000000001'
);

INSERT INTO "RecipeIngredients" ("Id", "RecipeId", "Name", "Quantity", "Unit", "Notes", "OrderIndex", "CreatedAt", "IsDeleted", "RowVersion") VALUES
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Bánh tráng dày nướng', 3, 'cái', 'Bản to, loại chuyên nướng than', 1, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Trứng cút tươi', 6, 'quả', '2 quả cho mỗi bánh', 2, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Xúc xích tiệt trùng', 2, 'cây', 'Cắt lát xéo mỏng', 3, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Tép sấy khô (ruốc đỏ)', 30, 'gram', 'Tép ngọt giòn đậm đà', 4, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Hành lá tươi', 4, 'nhánh', 'Rửa sạch, thái nhỏ', 5, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Bơ thực vật Tường An', 20, 'gram', 'Giúp bánh thơm béo', 6, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Phô mai con bò cười', 3, 'miếng', 'Tăng độ béo ngậy', 7, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Hành phi vàng giòn', 20, 'gram', 'Rắc mặt bánh', 8, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Sốt Mayonnaise', 30, 'ml', 'Rưới zíc zắc lên bề mặt', 9, NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Tương ớt Chinsu', 30, 'ml', 'Tạo vị cay ngọt đậm đà', 10, NOW(), false, '\x0000000000000001');

INSERT INTO "RecipeSteps" ("Id", "RecipeId", "StepNumber", "Title", "Description", "TimerMinutes", "ImageUrl", "CreatedAt", "IsDeleted", "RowVersion") VALUES
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 1, 'Sơ chế nguyên liệu & Làm mỡ hành', 'Hành lá rửa sạch, cắt nhỏ cho vào bát cùng 1 thìa dầu ăn, quay lò vi sóng 30 giây hoặc đun nóng dầu đổ vào làm mỡ hành. Xúc xích cắt lát xéo mỏng. Chuẩn bị sẵn trứng cút, bơ và tép khô.', 5, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80', NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 2, 'Làm nóng đế bánh tráng', 'Đặt vỉ nướng lên bếp than hồng (hoặc dùng chảo chống dính đáy bằng). Đặt bánh tráng lên nướng nhanh 30 giây với lửa nhỏ cho bánh phẳng và hơi ấm giòn.', 2, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 3, 'Quết bơ, mỡ hành và trứng cút', 'Quết 1 thìa bơ thực vật và 1 thìa mỡ hành lên mặt bánh. Đập 2 quả trứng cút vào giữa bánh, dùng cọ quét nhẹ hoặc thìa tán đều trứng lan ra khắp mặt bánh. Tán nhẹ miếng phô mai vào cùng để trứng chín quyện béo dẻo.', 3, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80', NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 4, 'Rải nhân xúc xích và tép khô', 'Rải đều các lát xúc xích, tép sấy khô và hành phi lên trên. Giữ lửa nhỏ đều, xoay nhẹ bánh tráng để nhiệt độ lan tỏa khắp rìa bánh cho đến khi đế bánh chín vàng giòn rụm.', 3, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80', NOW(), false, '\x0000000000000001'),
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 5, 'Rưới sốt và thưởng thức', 'Rưới tương ớt và sốt mayonnaise theo hình xoắn ốc zíc zắc lên bề mặt bánh. Dùng kéo cắt thành từng miếng tam giác hoặc gập đôi bánh lại thưởng thức ngay khi còn nóng hổi.', 2, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', NOW(), false, '\x0000000000000001');

INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "IsDeleted", "RowVersion") VALUES
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', 'Bánh tráng nướng Đà Lạt giòn rụm thơm ngậy', true, 1, NOW(), false, '\x0000000000000001');
