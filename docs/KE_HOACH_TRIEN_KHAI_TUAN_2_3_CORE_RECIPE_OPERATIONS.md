# KẾ HOẠCH TRIỂN KHAI CHI TIẾT TUẦN 2–3
**Chức năng:** Core Recipe Operations — FR-RCP-003 (Tạo), FR-RCP-002 (Xem chi tiết), FR-RCP-001 (Xem danh sách), FR-RCP-004 (Cập nhật)  
**Người thực hiện:** Nguyễn Thành Minh (MSSV: 2312691)  
**Tài liệu tham chiếu:** `SRS_Culinary_Blog_v1.0.0.md`, `SPEC.md`, `Ke_Hoach_Trien_Khai_Cua_Minh.md`  

---

## ⚠️ GHI CHÚ VỀ TÍNH ĐỒNG NHẤT TÀI LIỆU

Trước khi lập kế hoạch, tôi đã rà soát và phát hiện các điểm **không đồng nhất** giữa SRS, Ke_Hoach và SPEC.md. Những điểm này đã được sửa chữa:

| STT | Vấn đề | File bị ảnh hưởng | Giải pháp áp dụng |
|:---:|:---|:---|:---|
| 1 | **FR-RCP-007**: SRS và Ke_Hoach ghi "Hard Delete / Xóa vĩnh viễn" | `SRS` (dòng 684), `Ke_Hoach` (mục 8) | ✅ Đã sửa `Ke_Hoach` thành **Soft Delete** (`IsDeleted = true`) theo SPEC.md Mâu thuẫn 1. SRS chưa sửa vì thuộc phạm vi quản lý chung của nhóm. |
| 2 | **HTTP Status Codes**: SRS có xung đột 400 vs 422 | `SRS` (FR-RCP-003, Phụ lục A/B) | ⚡ Tuân theo SPEC.md Mâu thuẫn 6: **400** = Validation, **409** = Concurrency, **422** = Business Logic |
| 3 | **FR-SRCH-001**: SRS ghi "chỉ Published" | `SRS` (dòng 754) | ⚡ Tuân theo SPEC.md Mâu thuẫn 7: Author được tìm Draft của chính mình |

> **Quy tắc:** Khi SRS và SPEC.md mâu thuẫn → **SPEC.md là nguồn chính xác** (vì SPEC.md ra đời sau để giải quyết các mâu thuẫn trong SRS).  
> **Quy tắc:** Khi code triển khai, luôn tuân theo **README.md** (quy ước phát triển) và **SPEC.md** (giải pháp chuẩn hóa).

---

## 1. MỤC TIÊU TRIỂN KHAI TUẦN 2–3

Xây dựng hoàn chỉnh **4 API Endpoints** cốt lõi cho Module Recipe theo kiến trúc **CQRS + MediatR + Clean Architecture**:

1. **FR-RCP-003**: `POST /api/v1/recipes` — Tạo công thức nháp mới
2. **FR-RCP-002**: `GET /api/v1/recipes/{slug}` — Xem chi tiết công thức  
3. **FR-RCP-001**: `GET /api/v1/recipes` — Xem danh sách (phân trang, lọc, sắp xếp)
4. **FR-RCP-004**: `PUT /api/v1/recipes/{id}` — Cập nhật công thức (kèm Optimistic Concurrency)

### Phụ thuộc trước (Dependencies)
- ✅ **Tuần 1 (Đã hoàn thành):** Domain Entities & EF Core Configurations
- ⏳ **FR-AUTH** (Trịnh Trung Hiếu): Cần JWT Authentication + Role check (Author/Admin). Nếu chưa xong → mock `ICurrentUserService` để test.
- ⏳ **FR-CAT** (Trần Ngọc Bảo Phước): Cần `CategoryId` hợp lệ. Nếu chưa xong → seed dữ liệu Category giả.

---

## 2. PHÂN TÍCH CÁCH TRIỂN KHAI

### 2.1. Kiến trúc CQRS: Tách Command / Query

#### Cách 1: CQRS với MediatR Pipeline (Khuyến nghị ✅)

Mỗi chức năng tách thành:
- **Command** (ghi): `CreateRecipeCommand`, `UpdateRecipeCommand` → Handler riêng
- **Query** (đọc): `GetRecipeBySlugQuery`, `GetRecipesQuery` → Handler riêng
- **Validation**: `ValidationBehavior<TRequest, TResponse>` chạy FluentValidation tự động trong MediatR Pipeline

```
Client → Endpoint → MediatR.Send(Command/Query) → ValidationBehavior → Handler → Repository → DB
```

**Ưu điểm:**
- Tách biệt hoàn toàn Read/Write → dễ tối ưu cache cho Query, scale riêng
- Mỗi Handler chỉ làm 1 việc → tuân thủ SRP (Single Responsibility)
- Pipeline Behaviors cho phép AOP (Logging, Validation, Caching) mà không cần sửa Handler
- Tuân thủ đúng README Architecture: CQRS + MediatR

**Nhược điểm:**
- Số lượng file nhiều (mỗi chức năng cần Command/Query + Handler + Validator + DTO)
- Boilerplate code cho các operation đơn giản

**Ảnh hưởng lâu dài:**
- Khi team scale lên 10+ người, CQRS giúp tránh merge conflict vì mỗi người làm 1 Handler riêng
- Dễ dàng chuyển sang Event Sourcing hoặc Separate Read/Write Database sau này

#### Cách 2: Service Layer truyền thống (KHÔNG khuyến nghị ❌)

Gom toàn bộ logic vào `RecipeService` với các method: `Create()`, `GetBySlug()`, `GetList()`, `Update()`.

**Ưu điểm:**
- Ít file hơn, code đơn giản hơn cho dự án nhỏ

**Nhược điểm:**
- Vi phạm kiến trúc CQRS đã quy định trong README
- `RecipeService` sẽ phình to (Fat Service / God Class) khi thêm Publish/Archive/Delete
- Không có AOP Pipeline → phải gọi Validation thủ công trong mỗi method
- Khó cache chọn lọc cho từng query

**Ảnh hưởng lâu dài:**
- 4 người làm song song trên cùng 1 file `RecipeService.cs` → merge conflict liên tục
- Không phù hợp với Clean Architecture đã cam kết

> **Quyết định:** Chọn **Cách 1 — CQRS + MediatR** vì đúng với kiến trúc dự án (README, SRS Ch.6) và phù hợp làm việc nhóm 4 người song song.

---

### 2.2. Repository Pattern: Cách truy cập Database

#### Cách A: Generic Repository + Unit of Work (Khuyến nghị ✅)

```csharp
public interface IUnitOfWork
{
    IRecipeRepository Recipes { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

public interface IRecipeRepository : IRepository<Recipe>
{
    Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct);
    IQueryable<Recipe> GetQueryable(); // Cho phân trang & lọc
}
```

**Ưu điểm:**
- Đóng gói data access, tầng Application không biết EF Core
- Unit of Work đảm bảo transaction consistency
- Interface cho phép mock trong Unit Test
- Tuân thủ Clean Architecture (CONS-001)

**Nhược điểm:**
- Thêm abstraction layer → phức tạp hơn
- `IQueryable` leak sang Application nếu không cẩn thận

#### Cách B: Inject DbContext trực tiếp vào Handler (KHÔNG khuyến nghị ❌)

**Ưu điểm:** Nhanh, ít code
**Nhược điểm:** Vi phạm Clean Architecture — Domain/Application phụ thuộc trực tiếp vào EF Core

> **Quyết định:** Chọn **Cách A** vì dự án đã có `BaseRepository` và `IRepository<T>`. Ta chỉ cần mở rộng thêm `IRecipeRepository`.

---

### 2.3. Caching Strategy cho Read Operations

#### Cách I: Redis Backed Output Cache (Khuyến nghị ✅)

Sử dụng .NET Output Cache Middleware với Redis Backing Store (theo SPEC.md Mâu thuẫn 2 — Phương án A):

```csharp
// Program.cs
builder.Services.AddStackExchangeRedisOutputCache(options =>
    options.Configuration = connectionString);

// Endpoint
app.MapGet("/api/v1/recipes/{slug}", handler)
   .CacheOutput(policy => policy
       .Expire(TimeSpan.FromMinutes(60))
       .Tag("recipes")
       .SetVaryByRouteValue("slug"));
```

**Ưu điểm:**
- Stateless — Redis đảm bảo cache nhất quán khi scale out nhiều instance
- Tag-based invalidation: `EvictByTagAsync("recipes")` xóa toàn bộ cache liên quan khi Create/Update
- Tuân thủ README mục 2 (Chiến lược Cache Stateless) và SPEC.md

**Nhược điểm:**
- Phụ thuộc Redis — nếu Redis down thì cache mất (failover cần Redis Sentinel)
- Latency ~1-3ms so với IMemoryCache (~0.01ms)

#### Cách II: Manual Redis Cache-Aside (Cách bổ sung)

Handler tự đọc/ghi Redis cache bằng `IDistributedCache`:
```csharp
// Trong Handler
var cached = await _cache.GetStringAsync($"recipe:{slug}");
if (cached != null) return JsonSerializer.Deserialize<RecipeDetailDto>(cached);
// ... query DB, serialize, save to cache
```

**Ưu điểm:** Kiểm soát chi tiết logic cache
**Nhược điểm:** Boilerplate code, dễ quên invalidate

> **Quyết định:** Chọn **Cách I — Output Cache** cho `GET /recipes` và `GET /recipes/{slug}` (theo SRS FR-RCP-001/002). Không cần Cache-Aside ở tuần này.

---

### 2.4. Authorization Strategy

#### Cách α: Resource-Based Authorization với IAuthorizationService (Khuyến nghị ✅)

```csharp
// Tạo Authorization Policy + Handler
public class RecipeOwnerAuthorizationHandler 
    : AuthorizationHandler<OperationAuthorizationRequirement, Recipe>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        OperationAuthorizationRequirement requirement, 
        Recipe resource)
    {
        if (context.User.IsInRole("Admin") || resource.AuthorId == userId)
            context.Succeed(requirement);
        return Task.CompletedTask;
    }
}

// Trong Command Handler
var result = await _authorizationService.AuthorizeAsync(user, recipe, Operations.Update);
if (!result.Succeeded) throw new ForbiddenException();
```

**Ưu điểm:**
- Tập trung logic phân quyền → dễ audit, dễ test
- Tái sử dụng cho Update, Publish, Archive, Delete
- Tuân thủ SRS FR-RCP-004 (Resource-Based Authorization)

**Nhược điểm:** Cần setup thêm Policy/Handler infrastructure

#### Cách β: Check trực tiếp trong Handler (Đơn giản nhưng lặp code ❌)

```csharp
if (recipe.AuthorId != currentUserId && !user.IsInRole("Admin"))
    throw new ForbiddenException();
```

**Ưu điểm:** Nhanh, dễ hiểu
**Nhược điểm:** Copy-paste logic này vào 5+ handlers (Update, Publish, Archive, Delete...) → vi phạm DRY

> **Quyết định:** Chọn **Cách α** cho long-term, nhưng **tạm dùng Cách β** ở tuần 2 nếu FR-AUTH chưa sẵn sàng (sẽ refactor sau).

---

## 3. DANH SÁCH FILE CẦN TẠO MỚI VÀ CHỈNH SỬA

### A. Tầng Application (`backend/src/Application`)

#### A1. Shared Infrastructure (dùng chung cho tất cả Commands/Queries)

| STT | File | Mục đích |
|:---:|:---|:---|
| 1 | `Interfaces/IRecipeRepository.cs` [TẠO MỚI] | Interface mở rộng cho Repository Recipe |
| 2 | `Interfaces/IUnitOfWork.cs` [TẠO MỚI] | Interface Unit of Work pattern |
| 3 | `Interfaces/ICurrentUserService.cs` [TẠO MỚI] | Lấy thông tin user hiện tại từ JWT |
| 4 | `Common/Behaviours/ValidationBehavior.cs` [TẠO MỚI] | MediatR Pipeline tự chạy FluentValidation |
| 5 | `Common/Exceptions/NotFoundException.cs` [TẠO MỚI] | Exception cho 404 |
| 6 | `Common/Exceptions/ForbiddenException.cs` [TẠO MỚI] | Exception cho 403 |
| 7 | `Common/Exceptions/ConflictException.cs` [TẠO MỚI] | Exception cho 409 (Slug trùng, RowVersion) |
| 8 | `Common/Models/PagedResult.cs` [TẠO MỚI] | DTO kết quả phân trang |
| 9 | `Helpers/SlugHelper.cs` [TẠO MỚI] | Sinh slug từ title (chữ thường, không dấu, gạch nối) |

#### A2. FR-RCP-003: Create Recipe

| STT | File | Mục đích |
|:---:|:---|:---|
| 10 | `Recipes/Commands/CreateRecipe/CreateRecipeCommand.cs` [TẠO MỚI] | Command DTO |
| 11 | `Recipes/Commands/CreateRecipe/CreateRecipeCommandHandler.cs` [TẠO MỚI] | Business logic tạo recipe |
| 12 | `Recipes/Commands/CreateRecipe/CreateRecipeCommandValidator.cs` [TẠO MỚI] | FluentValidation rules |
| 13 | `Recipes/DTOs/RecipeDto.cs` [TẠO MỚI] | DTO trả về cho client |

#### A3. FR-RCP-002: Get Recipe Detail

| STT | File | Mục đích |
|:---:|:---|:---|
| 14 | `Recipes/Queries/GetRecipeBySlug/GetRecipeBySlugQuery.cs` [TẠO MỚI] | Query DTO |
| 15 | `Recipes/Queries/GetRecipeBySlug/GetRecipeBySlugQueryHandler.cs` [TẠO MỚI] | Eager loading + auth check |
| 16 | `Recipes/DTOs/RecipeDetailDto.cs` [TẠO MỚI] | DTO chi tiết kèm steps/ingredients/images |

#### A4. FR-RCP-001: Get Recipes List

| STT | File | Mục đích |
|:---:|:---|:---|
| 17 | `Recipes/Queries/GetRecipes/GetRecipesQuery.cs` [TẠO MỚI] | Query DTO + filter params |
| 18 | `Recipes/Queries/GetRecipes/GetRecipesQueryHandler.cs` [TẠO MỚI] | IQueryable + pagination + auth filter |
| 19 | `Recipes/DTOs/RecipeSummaryDto.cs` [TẠO MỚI] | DTO tóm tắt cho danh sách |

#### A5. FR-RCP-004: Update Recipe

| STT | File | Mục đích |
|:---:|:---|:---|
| 20 | `Recipes/Commands/UpdateRecipe/UpdateRecipeCommand.cs` [TẠO MỚI] | Command DTO + RowVersion |
| 21 | `Recipes/Commands/UpdateRecipe/UpdateRecipeCommandHandler.cs` [TẠO MỚI] | Resource-based auth + concurrency check |
| 22 | `Recipes/Commands/UpdateRecipe/UpdateRecipeCommandValidator.cs` [TẠO MỚI] | FluentValidation rules |

### B. Tầng Infrastructure (`backend/src/Infrastructure`)

| STT | File | Mục đích |
|:---:|:---|:---|
| 23 | `Repositories/RecipeRepository.cs` [TẠO MỚI] | Implement `IRecipeRepository` |
| 24 | `Repositories/UnitOfWork.cs` [TẠO MỚI] | Implement `IUnitOfWork` |
| 25 | `Services/CurrentUserService.cs` [TẠO MỚI] | Implement `ICurrentUserService` từ HttpContext |

### C. Tầng Presentation / API (`backend/src/Presentation`)

| STT | File | Mục đích |
|:---:|:---|:---|
| 26 | `Endpoints/RecipeEndpoints.cs` [TẠO MỚI] | Minimal API endpoints mapping |
| 27 | `Middleware/ExceptionHandlingMiddleware.cs` [TẠO MỚI] | Bắt DomainException → 422, NotFoundException → 404, etc. |

### D. Tầng Testing (`backend/tests`)

| STT | File | Mục đích |
|:---:|:---|:---|
| 28 | `Recipes/Commands/CreateRecipeCommandHandlerTests.cs` [TẠO MỚI] | Unit test cho Create |
| 29 | `Recipes/Queries/GetRecipeBySlugQueryHandlerTests.cs` [TẠO MỚI] | Unit test cho Get Detail |
| 30 | `Recipes/Queries/GetRecipesQueryHandlerTests.cs` [TẠO MỚI] | Unit test cho Get List |
| 31 | `Recipes/Commands/UpdateRecipeCommandHandlerTests.cs` [TẠO MỚI] | Unit test cho Update |

---

## 4. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC

### Giai đoạn 2.0: Chuẩn bị hạ tầng Application (Ngày 1)
**Nhánh:** `2312691/NguyenThanhMinh/fr-rcp-003-create-recipe`

1. Cài đặt NuGet packages cần thiết:
   - `MediatR` + `MediatR.Extensions.Microsoft.DependencyInjection`
   - `FluentValidation` + `FluentValidation.DependencyInjection`
2. Tạo các Interfaces: `IRecipeRepository`, `IUnitOfWork`, `ICurrentUserService`
3. Tạo các Exceptions: `NotFoundException`, `ForbiddenException`, `ConflictException`
4. Tạo `ValidationBehavior<TRequest, TResponse>`
5. Tạo `SlugHelper` (sử dụng `System.Globalization` để bỏ dấu tiếng Việt)
6. Tạo `PagedResult<T>` DTO
7. Implement `RecipeRepository`, `UnitOfWork`, `CurrentUserService` ở Infrastructure
8. Cấu hình DI Registration trong `Program.cs`
9. Tạo `ExceptionHandlingMiddleware`

### Giai đoạn 2.1: FR-RCP-003 — Tạo Công thức (Ngày 2)
**Nhánh:** `2312691/NguyenThanhMinh/fr-rcp-003-create-recipe` (tiếp tục)

1. Tạo `CreateRecipeCommand` + `CreateRecipeCommandHandler`
2. Tạo `CreateRecipeCommandValidator` (FluentValidation):
   - `Title`: 5–200 ký tự (SRS FR-RCP-003)
   - `Description`: không rỗng
   - `PrepTimeMinutes`, `CookTimeMinutes`: > 0
   - `Servings`: > 0
   - `CategoryId`: Guid hợp lệ
3. Tạo `RecipeDto`
4. Tạo Minimal API Endpoint: `POST /api/v1/recipes`
5. Sinh Slug tự động từ Title qua `SlugHelper`
6. Kiểm tra Slug unique → nếu trùng trả `HTTP 409 Conflict` (theo SPEC.md)
7. Kiểm tra CategoryId tồn tại → nếu không trả `HTTP 422` (theo SRS)
8. Trả về `HTTP 201 Created` + `RecipeDto` + `Location` header
9. Viết Unit Tests cho Handler (happy path + validation errors)
10. `dotnet build` + `dotnet test`
11. **Commit:** `feat(recipe): cài đặt CreateRecipeCommand và endpoint POST /api/v1/recipes cho FR-RCP-003`

### Giai đoạn 2.2: FR-RCP-002 — Xem Chi tiết (Ngày 3)
**Nhánh:** `2312691/NguyenThanhMinh/fr-rcp-002-get-recipe-detail`

1. Tạo `GetRecipeBySlugQuery` + `GetRecipeBySlugQueryHandler`
2. Implement Eager Loading: `.Include(Steps).Include(Ingredients).Include(Images).Include(Category).Include(Author)` + Owned Entity `Nutrition`
3. Kiểm tra quyền truy cập:
   - Recipe Published → cho phép tất cả
   - Recipe Draft/Archived → chỉ cho Author-Owner hoặc Admin
4. Tạo `RecipeDetailDto` (bao gồm nested `RecipeStepDto`, `RecipeIngredientDto`, `RecipeImageDto`, `RecipeNutritionDto`)
5. Tạo Minimal API Endpoint: `GET /api/v1/recipes/{slug}`
6. Cấu hình Output Cache: policy `"RecipeDetail"`, TTL 60 phút, tags `["recipes", "recipe:{slug}"]`
7. Viết Unit Tests (happy path + 404 + 403 cho Draft)
8. **Commit:** `feat(recipe): cài đặt GetRecipeBySlugQuery với Eager Loading và Output Cache cho FR-RCP-002`

### Giai đoạn 2.3: FR-RCP-001 — Xem Danh sách (Ngày 4)
**Nhánh:** `2312691/NguyenThanhMinh/fr-rcp-001-get-recipes-list`

1. Tạo `GetRecipesQuery` (chứa filter params: `Page`, `PageSize`, `CategoryId`, `Difficulty`, `MaxCookTime`, `Sort`)
2. Tạo `GetRecipesQueryHandler`:
   - Xây dựng `IQueryable` dynamically
   - **Authorization Filter** (theo SRS FR-RCP-001):
     - Guest → `Status == Published`
     - Author → `Published OR (Draft/Archived AND AuthorId == currentUserId)`
     - Admin → Tất cả
   - Áp dụng sorting: parse `sort=-createdAt` → `ORDER BY CreatedAt DESC`
   - `COUNT` total → pagination → Map sang `RecipeSummaryDto`
3. Tạo `RecipeSummaryDto` (chỉ gồm Title, Slug, Description tóm tắt, CookTime, Difficulty, Primary Image URL, Author Name)
4. Tạo Minimal API Endpoint: `GET /api/v1/recipes`
5. Cấu hình Output Cache: policy `"RecipeList"`, TTL 15 phút, vary by query string
6. Viết Unit Tests (happy path + pagination + filter + sort + auth filter)
7. **Commit:** `feat(recipe): cài đặt GetRecipesQuery với phân trang, lọc, sắp xếp và phân quyền cho FR-RCP-001`

### Giai đoạn 2.4: FR-RCP-004 — Cập nhật Công thức (Ngày 5)
**Nhánh:** `2312691/NguyenThanhMinh/fr-rcp-004-update-recipe`

1. Tạo `UpdateRecipeCommand` (bao gồm `RowVersion` byte[])
2. Tạo `UpdateRecipeCommandHandler`:
   - Lấy Recipe từ DB theo ID
   - Kiểm tra Resource-Based Authorization (Owner hoặc Admin)
   - Gọi domain method `recipe.Update(...)`
   - Cập nhật `Nutrition` nếu có: `recipe.SetNutrition(...)`
   - `SaveChangesAsync()` — EF Core tự kiểm tra `RowVersion`
   - Bắt `DbUpdateConcurrencyException` → throw `ConflictException` → HTTP 409
3. Tạo `UpdateRecipeCommandValidator`
4. Tạo Minimal API Endpoint: `PUT /api/v1/recipes/{id:guid}`
5. Invalidate cache tags: `"recipes"`, `"recipe:{slug}"`
6. Viết Unit Tests (happy path + 403 + 404 + 409 concurrency)
7. **Commit:** `feat(recipe): cài đặt UpdateRecipeCommand với Optimistic Concurrency Control cho FR-RCP-004`

---

## 5. QUY ƯỚC HTTP STATUS CODES (THEO SPEC.md)

Thống nhất triệt để mã lỗi HTTP cho toàn bộ Recipe API:

| Tình huống | HTTP Code | Ví dụ |
|:---|:---:|:---|
| Validation thất bại (FluentValidation) | **400** | Title < 5 ký tự, Servings <= 0 |
| Chưa đăng nhập | **401** | Không có JWT token |
| Không có quyền (không phải Owner/Admin) | **403** | Author khác sửa recipe |
| Không tìm thấy resource | **404** | Slug/ID không tồn tại |
| Xung đột dữ liệu (Concurrency / Slug trùng) | **409** | RowVersion mismatch, Slug đã tồn tại |
| Vi phạm Business Logic | **422** | CategoryId không tồn tại, Publish recipe không có steps |

---

## 6. GIT BRANCHING & COMMIT STRATEGY

### Danh sách nhánh cho Tuần 2–3:

| STT | Chức năng | Tên nhánh |
|:---:|:---|:---|
| 1 | Create Recipe + Shared Infrastructure | `2312691/NguyenThanhMinh/fr-rcp-003-create-recipe` |
| 2 | Get Recipe Detail | `2312691/NguyenThanhMinh/fr-rcp-002-get-recipe-detail` |
| 3 | Get Recipes List | `2312691/NguyenThanhMinh/fr-rcp-001-get-recipes-list` |
| 4 | Update Recipe | `2312691/NguyenThanhMinh/fr-rcp-004-update-recipe` |

### Quy tắc:
- Mỗi nhánh tách từ `2312691/NguyenThanhMinh/domain-recipe-entities` (nhánh Tuần 1)
- **Không merge vào main** — chỉ push nhánh riêng lên GitHub
- Commit message bằng Tiếng Việt, format: `feat(recipe): <nội dung>`

---

## 7. CHECKLIST NGHIỆM THU TUẦN 2–3

Trước khi hoàn tất tuần 2–3, tất cả các điều kiện sau phải được thỏa mãn:

- [ ] `dotnet build` không có error hoặc warning mới
- [ ] `dotnet test` tất cả Unit Tests pass xanh
- [ ] 4 API Endpoints hoạt động đúng (test bằng HTTP file / Postman / Scalar UI)
- [ ] Output Cache hoạt động cho GET endpoints
- [ ] Slug tự động sinh từ Title, đảm bảo unique
- [ ] Optimistic Concurrency Control hoạt động cho PUT endpoint
- [ ] Authorization check đúng (Owner/Admin) cho POST/PUT
- [ ] HTTP Status Codes đúng theo SPEC.md (400/401/403/404/409/422)
- [ ] Không vi phạm Clean Architecture (Application không import EF Core)
- [ ] Code đã push lên nhánh riêng trên GitHub

---

## 8. RỦI RO VÀ PHƯƠNG ÁN DỰ PHÒNG

| Rủi ro | Xác suất | Ảnh hưởng | Phương án dự phòng |
|:---|:---:|:---:|:---|
| FR-AUTH chưa xong → không test được Authorization thật | Cao | Trung bình | Mock `ICurrentUserService` trả về userId/role cố định |
| FR-CAT chưa xong → không có CategoryId hợp lệ | Trung bình | Thấp | Seed dữ liệu Category giả trong DB Migration |
| Redis chưa cài → Output Cache không hoạt động | Thấp | Thấp | Tạm dùng In-Memory Output Cache, cấu hình Redis sau |
| EF Core Migration lỗi do schema mới | Thấp | Cao | Test migration trên DB local trước khi push |
