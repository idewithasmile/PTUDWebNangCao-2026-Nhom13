# DATA_MODEL.md — Culinary Blog

Trích xuất field-level từ SRS v1.0.0 Chương 7.
DB: **PostgreSQL 16**, **EF Core 10 Code-First**. Mọi entity kế thừa `BaseEntity` và dùng
Soft Delete (`IsDeleted`).
Trạng thái hiện tại: **Đã triển khai 100% trong mã nguồn (`CulinaryBlogDbContext`), vượt qua 284 bài kiểm thử tự động.**

## BaseEntity (abstract — mọi entity kế thừa)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| Id | uuid | PK, `DEFAULT gen_random_uuid()` | UUID v4, tránh sequential ID guessing |
| CreatedAt | timestamptz | NOT NULL, `DEFAULT NOW()` | Set bởi `AuditInterceptor` |
| UpdatedAt | timestamptz | NULL | Set bởi `AuditInterceptor` khi `SaveChanges` |
| IsDeleted | boolean | NOT NULL, DEFAULT false | Soft delete — tự động filter bởi EF Core Global Query Filter |
| RowVersion | bytea | NOT NULL, Concurrency Token | `[Timestamp]` — optimistic concurrency, trả 409 Conflict |

## Recipe (bảng `Recipes`) — entity trung tâm

| Column | Kiểu | Ràng buộc | Index | Ghi chú |
|---|---|---|---|---|
| Title | varchar(200) | NOT NULL | GIN trigram | Không unique |
| Slug | varchar(220) | NOT NULL, UNIQUE | B-tree unique | Sinh từ Title, lowercase, không dấu, gạch nối. Không đổi sau Publish |
| Description | text | NOT NULL | — | ≤ 2000 ký tự, dùng cho card preview + SEO meta description |
| Instructions | text | NOT NULL | — | Markdown, mô tả tổng quan (chi tiết dùng RecipeStep) |
| PrepTime | integer | NOT NULL, CHECK > 0 | — | Phút |
| CookTime | integer | NOT NULL, CHECK >= 0 | — | Phút, 0 = "No cook" |
| Servings | integer | NOT NULL, CHECK > 0 | — | Số khẩu phần |
| Difficulty | smallint (enum) | NOT NULL, DEFAULT 1 | IDX_Recipe_Difficulty | `RecipeDifficulty`: 1=Easy, 2=Medium, 3=Hard, 4=Expert |
| Status | smallint (enum) | NOT NULL, DEFAULT 0 | IDX_Recipe_Status | `RecipeStatus`: 0=Draft, 1=Published, 2=Archived |
| CategoryId | uuid | NOT NULL, FK → Categories.Id, **ON DELETE RESTRICT** | IDX_Recipe_CategoryId | Không xóa được Category còn Recipe |
| AuthorId | varchar(450) | NOT NULL, FK → AspNetUsers.Id | IDX_Recipe_AuthorId | |
| SearchVector | tsvector | NULL | GIN | Cập nhật bởi PostgreSQL TRIGGER khi Title/Description đổi, dùng `unaccent` cho tiếng Việt |
| PublishedAt | timestamptz | NULL | IDX_Recipe_PublishedAt | Set khi Status → Published |

### RecipeNutrition (Owned Entity — cột nhúng trực tiếp vào bảng `Recipes`, tiền tố `Nutrition_`)

| Column DB | Property | Kiểu | Ghi chú |
|---|---|---|---|
| Nutrition_Calories | Calories | decimal(8,2)? | kcal/serving, nullable |
| Nutrition_Protein | Protein | decimal(8,2)? | gram/serving, nullable |
| Nutrition_Carbohydrates | Carbohydrates | decimal(8,2)? | gram/serving, nullable |
| Nutrition_Fat | Fat | decimal(8,2)? | gram/serving, nullable |
| Nutrition_Fiber | Fiber | decimal(8,2)? | gram/serving, nullable |
| Nutrition_Sodium | Sodium | decimal(8,2)? | mg/serving, nullable |

## RecipeStep (bảng `RecipeSteps`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| RecipeId | uuid | NOT NULL, FK → Recipes.Id, **ON DELETE CASCADE** | |
| StepNumber | integer | NOT NULL, CHECK > 0 | UNIQUE composite với RecipeId, tự động đánh lại số khi xóa |
| Title | varchar(200) | NOT NULL | vd "Sơ chế nguyên liệu" |
| Description | text | NOT NULL | Chi tiết bước thực hiện |
| TimerMinutes | integer | NULL, CHECK >= 0 | Thời gian hẹn giờ nếu có |
| ImageUrl | varchar(500) | NULL | URL trên MinIO S3 |

## RecipeIngredient (bảng `RecipeIngredients`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| RecipeId | uuid | NOT NULL, FK → Recipes.Id, ON DELETE CASCADE | |
| Name | varchar(200) | NOT NULL | vd "Thịt bò thăn" |
| Quantity | decimal(10,3) | NULL | nullable cho "vừa đủ" |
| Unit | varchar(50) | NULL | gram, ml, thìa canh... |
| Notes | varchar(500) | NULL | vd "thái lát mỏng" |
| OrderIndex | integer | NOT NULL, DEFAULT 0 | |

## RecipeImage (bảng `RecipeImages`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| RecipeId | uuid | NOT NULL, FK → Recipes.Id, ON DELETE CASCADE | |
| OriginalUrl | varchar(500) | NOT NULL | `.../recipes/{recipeId}/{guid}.jpg` |
| MediumUrl | varchar(500) | NULL | 800×600, sinh bởi FR-JOB-002 |
| ThumbnailUrl | varchar(500) | NULL | 300×300, sinh bởi FR-JOB-002 |
| AltText | varchar(200) | NULL | |
| IsPrimary | boolean | NOT NULL, DEFAULT false | chỉ 1 ảnh `IsPrimary=true`/Recipe; khi xóa tự động đôn ảnh khác |
| OrderIndex | integer | NOT NULL, DEFAULT 0 | |

## Category (bảng `Categories`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| Name | varchar(100) | NOT NULL, UNIQUE | Tên danh mục |
| Slug | varchar(120) | NOT NULL, UNIQUE | sinh từ Name, tiếng Việt SEO |
| Description | text | NULL | |
| ImageUrl | varchar(500) | NULL | |
| OrderIndex | integer | NOT NULL, DEFAULT 0 | thứ tự trên navigation |

## ApplicationUser (extends `IdentityUser<string>`, bảng `AspNetUsers`)

Custom columns thêm vào:

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| DisplayName | varchar(100) | NOT NULL | tên hiển thị công khai (thay cho fullName) |
| AvatarUrl | varchar(500) | NULL | lưu trên MinIO S3 hoặc URL Google OAuth |
| Bio | text | NULL | giới thiệu tiểu sử tác giả |
| IsActive | boolean | NOT NULL, DEFAULT true | Admin có thể deactivate (ban) |
| CreatedAt | timestamptz | NOT NULL, DEFAULT NOW() | |

Identity columns kế thừa sẵn (không tự tạo lại): `Id (varchar 450), UserName, NormalizedUserName, Email, NormalizedEmail, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount`.

## RefreshToken (bảng `RefreshTokens`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| UserId | varchar(450) | NOT NULL, FK → AspNetUsers.Id, ON DELETE CASCADE | |
| TokenHash | varchar(64) | NOT NULL, UNIQUE | SHA-256 hash — **không lưu raw token** |
| ExpiresAt | timestamptz | NOT NULL | 7 ngày kể từ CreatedAt |
| RevokedAt | timestamptz | NULL | NULL = còn hiệu lực |
| ReplacedByTokenHash | varchar(64) | NULL | hash token mới khi rotation, để trace token family |
| CreatedAt | timestamptz | NOT NULL, DEFAULT NOW() | |
| CreatedByIp | varchar(45) | NULL | audit |

## Quan hệ tổng quát (ERD)

```
Category (1) ───< (N) Recipe ───< (N) RecipeStep
                        │      ───< (N) RecipeIngredient
                        │      ───< (N) RecipeImage
                        │      ─── (1:1 Owned) RecipeNutrition
                        └───> (N:1) ApplicationUser (Author)
ApplicationUser (1) ───< (N) RefreshToken
```

## Bảng Mã Lỗi RFC 7807 Đã Hiện Thực (RFC 7807 Problem Details Error Codes)

Định dạng trả về:
```json
{
  "type": "MODULE_REASON",
  "title": "Tiêu đề lỗi",
  "status": 400,
  "detail": "Mô tả chi tiết nguyên nhân lỗi",
  "errors": { "field": ["Lỗi chi tiết"] }
}
```

| Phân hệ | Mã lỗi (`type`) | Mã HTTP | Mô tả nghiệp vụ |
|---|---|:---:|---|
| **AUTH** | `AUTH_EMAIL_EXISTS` | 409 | Email đăng ký đã tồn tại trong hệ thống |
| | `AUTH_INVALID_CREDENTIALS` | 401 | Email hoặc mật khẩu không chính xác |
| | `AUTH_TOKEN_EXPIRED` | 401 | Access Token đã hết hạn |
| | `AUTH_REFRESH_TOKEN_REVOKED`| 401 | Phát hiện Refresh Token bị thu hồi hoặc tái sử dụng (Reuse Detection) |
| | `AUTH_ACCOUNT_LOCKED` | 423 | Tài khoản bị tạm khóa 15 phút do nhập sai mật khẩu 5 lần |
| **CATEGORY** | `CATEGORY_NOT_FOUND` | 404 | Không tìm thấy danh mục theo Id hoặc Slug |
| | `CATEGORY_NAME_EXISTS` | 409 | Tên danh mục bị trùng lặp |
| | `CATEGORY_HAS_RECIPES` | 409 | Chặn xóa danh mục khi còn công thức liên kết |
| | `CATEGORY_CONCURRENCY_CONFLICT` | 409 | Xung đột cập nhật dữ liệu đồng thời (`RowVersion`) |
| **RECIPE** | `RECIPE_NOT_FOUND` | 404 | Không tìm thấy công thức nấu ăn |
| | `RECIPE_FORBIDDEN` | 403 | Người dùng không phải tác giả của công thức và không phải Admin |
| | `RECIPE_PUBLISH_REQUIRES_STEP` | 422 | Không thể Publish công thức khi chưa có ít nhất 1 bước nấu ăn |
| | `RECIPE_CONCURRENCY_CONFLICT` | 409 | Xung đột sửa đổi công thức đồng thời (`RowVersion`) |
| **FILE** | `FILE_SIZE_EXCEEDED` | 400 | Dung lượng file tải lên vượt quá giới hạn 5 MB |
| | `FILE_MIME_INVALID` | 400 | Định dạng file không hợp lệ hoặc Magic Bytes không khớp (JPEG, PNG, WebP, AVIF) |
| | `RECIPE_IMAGE_NOT_FOUND` | 404 | Không tìm thấy ảnh công thức để thao tác (Primary/Delete) |
| **RATE LIMIT** | `RATE_LIMIT_EXCEEDED` | 429 | Vượt quá tần suất yêu cầu cho phép (Auth: 10/min, Upload: 5/min, General: 100/min) |
