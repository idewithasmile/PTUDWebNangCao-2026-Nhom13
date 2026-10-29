import subprocess

sql_commands = """
-- 1. Xóa bỏ các đuôi số timestamp (ví dụ 1793072944913) trong tiêu đề món ăn
UPDATE "Recipes"
SET "Title" = regexp_replace("Title", '\\s+\\d{6,}$', '', 'g')
WHERE "Title" ~ '\\s+\\d{6,}$';

UPDATE "Recipes"
SET "Title" = regexp_replace("Title", '\\s+\\(E2E Test\\)$', '', 'g')
WHERE "Title" ~ '\\s+\\(E2E Test\\)$';

-- 2. Cập nhật ảnh đại diện chuẩn cho món 'Bò xào lúc lắc rau củ tươi ngon' (id: d37a018f-e96e-496a-aad9-b740685ba846)
-- Đặt ảnh chảo bò xào lúc lắc rau củ bốc khói rực rỡ đúng chuẩn mockup của người dùng
DELETE FROM "RecipeImages" WHERE "RecipeId" = 'd37a018f-e96e-496a-aad9-b740685ba846';

INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), 'd37a018f-e96e-496a-aad9-b740685ba846', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', 
   'Chảo bò xào lúc lắc ớt chuông bốc khói thơm lừng', true, 1, NOW(), NOW(), false, '\\x0000000000000001'),
  (gen_random_uuid(), 'd37a018f-e96e-496a-aad9-b740685ba846', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', 
   'Thịt bò thăn ướp đậm đà và ớt chuông tươi sạch', false, 2, NOW(), NOW(), false, '\\x0000000000000001'),
  (gen_random_uuid(), 'd37a018f-e96e-496a-aad9-b740685ba846', 
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80', 
   'Lắc đều trên lửa lớn dậy mùi bơ tỏi', false, 3, NOW(), NOW(), false, '\\x0000000000000001');

-- 3. Cập nhật ảnh cho Bò Bít Tết (id: 661f5f8e-ffa2-4210-992b-649c75eb5918)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '661f5f8e-ffa2-4210-992b-649c75eb5918';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '661f5f8e-ffa2-4210-992b-649c75eb5918', 
   'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80', 
   'Bò bít tết áp chảo bơ tỏi sốt tiêu đen', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 4. Cập nhật ảnh cho Bò Bít Tết khác (id: 252e66ce-1077-4876-8279-978c034d39ba)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '252e66ce-1077-4876-8279-978c034d39ba';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '252e66ce-1077-4876-8279-978c034d39ba', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', 
   'Thăn ngoại bò áp chảo mềm mọng', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 5. Cập nhật ảnh cho Cà ri gà nước cốt dừa (id: 14dde64c-2b7a-47e9-a8e9-4bede025b923)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '14dde64c-2b7a-47e9-a8e9-4bede025b923';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '14dde64c-2b7a-47e9-a8e9-4bede025b923', 
   'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=80', 
   'Tô cà ri gà béo ngậy nước cốt dừa', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 6. Cập nhật ảnh cho Phở bò truyền thống (id: 0c062344-5252-4e15-b522-a5828ab5d581)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '0c062344-5252-4e15-b522-a5828ab5d581';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '0c062344-5252-4e15-b522-a5828ab5d581', 
   'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80', 
   'Tô phở bò gia truyền nước dùng trong ngọt', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 7. Cập nhật ảnh cho Thịt kho tàu nước dừa (id: 2a4d7564-f0d2-455c-acfe-a88d7ae1e8f6)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '2a4d7564-f0d2-455c-acfe-a88d7ae1e8f6';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '2a4d7564-f0d2-455c-acfe-a88d7ae1e8f6', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', 
   'Nồi thịt kho tàu màu cánh gián mềm rục', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 8. Cập nhật ảnh cho Bún chả Hà Nội (id: 254e4034-3d6e-41f1-8ea0-fbdd137daf36)
DELETE FROM "RecipeImages" WHERE "RecipeId" = '254e4034-3d6e-41f1-8ea0-fbdd137daf36';
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
VALUES 
  (gen_random_uuid(), '254e4034-3d6e-41f1-8ea0-fbdd137daf36', 
   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80', 
   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 
   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80', 
   'Bún chả que tre nướng than hoa thơm lừng', true, 1, NOW(), NOW(), false, '\\x0000000000000001');

-- 9. Gán ảnh mặc định cho bất kỳ công thức nào chưa có ảnh đại diện
INSERT INTO "RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion")
SELECT 
  gen_random_uuid(),
  r."Id",
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  'Món ngon chuẩn vị ẩm thực Việt',
  true,
  1,
  NOW(),
  NOW(),
  false,
  '\\x0000000000000001'
FROM "Recipes" r
WHERE NOT EXISTS (
  SELECT 1 FROM "RecipeImages" ri WHERE ri."RecipeId" = r."Id" AND ri."IsDeleted" = false
);
"""

process = subprocess.Popen(
    ['docker', 'exec', '-i', 'culinary_postgres', 'psql', '-U', 'postgres', '-d', 'culinary_blog'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    encoding='utf-8'
)

stdout, stderr = process.communicate(input=sql_commands)
print("STDOUT:", stdout)
if stderr:
    print("STDERR:", stderr)
