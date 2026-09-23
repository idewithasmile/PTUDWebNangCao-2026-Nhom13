# DATA_MODEL.md — Culinary Blog

Trích xuất field-level từ SRS v1.0.0 Chương 7. Đây là spec để agent generate Domain
Entities + EF Core Configurations trong scaffold ban đầu — **không tự thêm/bớt field**.
DB: PostgreSQL 16, EF Core 10 Code-First. Mọi entity kế thừa `BaseEntity` và dùng
Soft Delete (`IsDeleted`).

## BaseEntity (abstract — mọi entity kế thừa)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| Id | uuid | PK, `DEFAULT gen_random_uuid()` | UUID v4, tránh sequential ID guessing |
| CreatedAt | timestamptz | NOT NULL, `DEFAULT NOW()` | Set bởi `AuditInterceptor` |
| UpdatedAt | timestamptz | NULL | Set bởi `AuditInterceptor` khi `SaveChanges` |
| IsDeleted | boolean | NOT NULL, DEFAULT false | Soft delete — mọi query phải tự filter `!IsDeleted` |
| RowVersion | bytea | NOT NULL, Concurrency Token | `[Timestamp]` — optimistic concurrency, trả 409/422 khi conflict |

## Recipe (bảng `Recipes`) — entity trung tâm

| Column | Kiểu | Ràng buộc | Index | Ghi chú |
|---|---|---|---|---|
| Title | varchar(200) | NOT NULL | GIN trigram (optional) | Không unique |
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
| StepNumber | integer | NOT NULL, CHECK > 0 | UNIQUE composite với RecipeId |
| Title | varchar(200) | NOT NULL | vd "Sơ chế nguyên liệu" |
| Description | text | NOT NULL | |
| TimerMinutes | integer | NULL, CHECK >= 0 | |
| ImageUrl | varchar(500) | NULL | URL trên MinIO |

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
| IsPrimary | boolean | NOT NULL, DEFAULT false | chỉ 1 ảnh `IsPrimary=true`/Recipe |
| OrderIndex | integer | NOT NULL, DEFAULT 0 | |

## Category (bảng `Categories`)

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| Name | varchar(100) | NOT NULL, UNIQUE | |
| Slug | varchar(120) | NOT NULL, UNIQUE | sinh từ Name |
| Description | text | NULL | |
| ImageUrl | varchar(500) | NULL | |
| OrderIndex | integer | NOT NULL, DEFAULT 0 | thứ tự trên navigation |

## ApplicationUser (extends `IdentityUser<string>`, bảng `AspNetUsers`)

Custom columns thêm vào:

| Column | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| DisplayName | varchar(100) | NOT NULL | tên hiển thị công khai |
| AvatarUrl | varchar(500) | NULL | sinh từ Google Avatar khi OAuth |
| Bio | text | NULL | hiển thị author profile |
| IsActive | boolean | NOT NULL, DEFAULT true | Admin có thể deactivate (ban) |
| CreatedAt | timestamptz | NOT NULL, DEFAULT NOW() | |

Identity columns kế thừa sẵn (không tự tạo lại): `Id (varchar 450), UserName,
NormalizedUserName, Email, NormalizedEmail, PasswordHash, SecurityStamp,
ConcurrencyStamp, PhoneNumber, TwoFactorEnabled, LockoutEnd, LockoutEnabled,
AccessFailedCount`.

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

## Quan hệ tổng quát

```
Category (1) ───< (N) Recipe ───< (N) RecipeStep
                        │      ───< (N) RecipeIngredient
                        │      ───< (N) RecipeImage
                        │      ─── (1:1 Owned) RecipeNutrition
                        └───> (N:1) ApplicationUser (Author)
ApplicationUser (1) ───< (N) RefreshToken
```

## RFC 7807 error codes tham chiếu (Phụ lục A/B của SRS)

Format: `{ type: "AUTH_EMAIL_EXISTS", title, status, detail, errors? }`. Ví dụ đã định
nghĩa: `AUTH_EMAIL_EXISTS` (409), `AUTH_INVALID_CREDENTIALS` (401),
`AUTH_TOKEN_EXPIRED` (401). Mỗi module cần bổ sung mã lỗi riêng theo cùng format
`MODULE_REASON` khi implement — ghi thêm vào file này khi phát sinh mã mới để tránh
trùng/lệch giữa các thành viên.
