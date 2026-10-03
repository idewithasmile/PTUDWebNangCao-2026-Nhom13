# 🗺️ BẢN ĐỒ TRA CỨU MÃ NGUỒN & VỊ TRÍ CHỨC NĂNG (DEV CODE MAP)
> **Nhánh làm việc:** `2312719-Phuoc/db-seeding`  
> **Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
> **Vai trò:** Technical Lead & Core Developer  
> **Cập nhật lần cuối:** 29/09/2026  

---

## 1. Mốc trạng thái hiện tại (Current Checkpoint)

- **Đã hoàn thành 100%:**
  - [x] **Cấu hình `.gitignore` tiêu chuẩn:** Lọc sạch rác nhị phân .NET (`bin/`, `obj/`, `.vs/`) và artifact của Node/Next.js (`node_modules/`, `.next/`, `dist/`).
  - [x] **Module Khởi tạo Dữ liệu Tự động (CulinaryBlogSeeder):**
    - Sinh 3 Roles chuẩn hệ sinh thái (`Admin`, `Author`, `Reader`).
    - Sinh 10 Authors với mật khẩu băm PBKDF2 (`UserManager.CreateAsync`).
    - Sinh 25 Categories ẩm thực thực tế (Việt Nam + Quốc tế) kèm Slug SEO.
    - Sinh 100 Recipes (`Status = Published`) phân bổ ngẫu nhiên có kiểm soát vào Categories và Authors.
    - Sinh quan hệ 1-N lồng ghép: 5–8 `RecipeSteps` (thứ tự tăng dần `StepNumber`) và 10–15 `RecipeIngredients` không trùng tên trên cùng một công thức.
    - Cơ chế tất định: `SEED = 42` bảo đảm kết quả giống hệt nhau trên mọi máy trạm và môi trường CI/CD.
    - Tính Idempotent: Kiểm tra `CountAsync() >= 100` và `RoleExistsAsync` trước khi sinh.
  - [x] **Tích hợp Seeder vào vòng đời API:** Đăng ký trong `Program.cs`, tự động kích hoạt sau khi `Database.MigrateAsync()` hoàn tất trong môi trường Development qua một `IServiceScope` cô lập.
  - [x] **Giải quyết xung đột hợp nhất (Merge Conflicts):** Đồng bộ hoàn hảo 7 tệp xung đột với nhánh `origin/main` của Nhóm trưởng mà không làm mất mát cấu hình Global Query Filter, Identity, OpenAPI hay Docker.
  - [x] **Cơ sở dữ liệu vật lý (PostgreSQL):** Đã nạp thành công 100% dữ liệu quan hệ, kiểm thử kết nối và dữ liệu thực tế hoạt động trơn tru.
  - [x] **Domain Exceptions chuẩn hóa (src/Domain/Exceptions/):** Cài đặt `DomainException`, `EntityNotFoundException`, `CategoryNotEmptyException`, `ConcurrencyConflictException`, `BusinessRuleValidationException` thuần .NET BCL (CONS-001).
  - [x] **Hạ tầng Repository & Unit of Work:** Định nghĩa `IRepository<T>`, `ICategoryRepository`, `IUnitOfWork` tại `Domain/Common/Interfaces/` và implement `BaseRepository<T>`, `CategoryRepository`, `UnitOfWork` tại `Infrastructure/Repositories/`, đăng ký DI Scoped.
  - [x] **2 Endpoints Đọc công khai FR-CAT:** Hoàn thiện `GET /api/v1/categories` (Redis cache 30m) và `GET /api/v1/categories/{slug}` (phân trang, max 50 pageSize) qua Minimal APIs extension method `MapCategoriesEndpoints()`.
  - [x] **Global Exception Middleware (RFC 7807):** Xử lý tập trung các lỗi 404, 409, 400, 422, 500 với định dạng `application/problem+json` chuẩn hóa.

  - [x] **Bộ Kiểm Thử Tự Động Toàn Diện (75/75 Tests Passed - 100% Green):**
    - Kiểm thử Seeder tự động (Determinism SEED=42, Idempotency, quan hệ 1-N).
    - Kiểm thử Domain Exceptions thuần .NET BCL (CONS-001).
    - Kiểm thử Repository & Unit of Work (Soft Delete, Linq đếm Recipe, Concurrency).
    - Kiểm thử Integration API (WebApplicationFactory<Program>, HTTP 200, Ordering, RecipeCount, Distributed Cache, Phân trang, RFC 7807 Problem Details 404).
    - Kiểm thử Global Exception Middleware (Map mã lỗi 400, 404, 409, 500 kèm application/problem+json).

- **Điểm dừng hiện tại:**  
  Hoàn tất 100% toàn diện từ Backend Architecture, Seeding, Repositories, CQRS Handlers, Endpoints đến Bộ kiểm thử tự động (Automated Test Suite) với 75/75 tests passed (100% Green, 0 failed, 0 skipped) trên cả 3 tầng: Unit Tests, Infrastructure Tests và WebApplicationFactory Integration Tests. Sẵn sàng tạo Pull Request hợp nhất vào `origin/main`.

- **Bước kế tiếp cần làm:**  
  Tiến hành tạo Pull Request hợp nhất nhánh `2312719-Phuoc/db-seeding` vào `origin/main` và chuyển giao API cho các phân hệ Recipes/UI.

---

## 2. Bảng chỉ mục tra cứu: "Cần sửa gì -> Mở file nào?" (Quick Lookup Index)

| Nghiệp vụ / Logic cần can thiệp | Tệp tin đảm nhận (File Path) | Hàm / Khối code cụ thể |
|---|---|---|
| **Thay đổi hạt giống sinh dữ liệu ngẫu nhiên** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Biến hằng số `private const int SEED = 42;` (Dòng 13) |
| **Sửa danh sách tên danh mục mẫu (Categories)** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Mảng `private static readonly string[] CategoryNames` (Dòng 15–22) |
| **Sửa danh sách tên món ăn mẫu** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Mảng `private static readonly string[] RecipeTitles` (Dòng 24–34) |
| **Sửa kho nguyên liệu mẫu (Ingredient Pool)** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Mảng `private static readonly string[] IngredientPool` (Dòng 36–45) |
| **Sửa nội dung các bước thực hiện mẫu** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Mảng `private static readonly string[] StepDescriptions` (Dòng 47–57) |
| **Thay đổi số lượng bản ghi tối thiểu (Recipes/Authors/Steps)** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | Điều kiện dừng `CountAsync() >= 100` (Dòng 78), `Generate(10)` (Dòng 89), `Random.Int(5, 8)` (Dòng 172) |
| **Sửa tài khoản / mật khẩu mặc định của Author** | `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs` | `await userManager.CreateAsync(author, "Author@123456")` (Dòng 95) và role `"Author"` (Dòng 98) |
| **Bật / Tắt tự động nạp dữ liệu khi bật server** | `backend/src/Presentation/Program.cs` | Khối `if (app.Environment.IsDevelopment())` chứa dòng gọi `await CulinaryBlogSeeder.SeedAsync(app.Services);` (Dòng 94–105) |
| **Cấu hình DbSet, quan hệ bảng & Concurrency Token** | `backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs` | `public DbSet<Category> Categories`, `public DbSet<Recipe> Recipes`, và cấu hình `RowVersion` |
| **Cấu hình Owned Entity cho Nutrition trong Recipe** | `backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs` | Khối `modelBuilder.Entity<Recipe>().OwnsOne(r => r.Nutrition, ...)` (Dòng 24–33) |
| **Khai báo thuộc tính thực thể Danh mục** | `backend/src/Domain/Entities/Category.cs` | Lớp `Category : BaseEntity` chứa `Name`, `Slug`, `Description`, `ImageUrl`, `OrderIndex` |
| **Khai báo thuộc tính thực thể Công thức** | `backend/src/Domain/Entities/Recipe.cs` | Lớp `Recipe : BaseEntity` chứa quan hệ `CategoryId`, `AuthorId`, `Steps`, `Ingredients` |
| **Quản lý thư viện cài đặt thêm (Bogus, Npgsql, Redis...)** | `backend/src/Infrastructure/CulinaryBlog.Infrastructure.csproj` | Khối `<ItemGroup>` chứa `<PackageReference Include="Bogus" Version="35.6.5" />` |
| **Chặn file rác / artifact không cho đẩy lên Git** | `.gitignore` (tại thư mục gốc) | Các quy tắc lọc `bin/`, `obj/`, `.vs/`, `node_modules/`, `.next/` |
| **Endpoints Web API của Danh mục (FR-CAT)** | `backend/src/Presentation/Endpoints/CategoriesEndpoints.cs` | `MapCategoriesEndpoints` chứa các route `/api/v1/categories` (GET, POST, PUT, DELETE) |
| **Logic CQRS Tạo Danh mục mới** | `backend/src/Application/Features/Categories/Commands/CreateCategory/` | `CreateCategoryCommand.cs`, `CreateCategoryCommandHandler.cs`, `CreateCategoryCommandValidator.cs` |
| **Logic CQRS Xóa mềm & chặn xóa khi có công thức** | `backend/src/Application/Features/Categories/Commands/DeleteCategory/` | `DeleteCategoryCommandHandler.cs` (kiểm tra `Recipes.AnyAsync()` trả về 409 Conflict) |
| **Logic Caching Danh mục (Redis / Memory)** | `backend/src/Application/Features/Categories/Queries/GetCategories/` | `GetCategoriesQueryHandler.cs` (kiểm tra Cache Key `categories:all`, TTL 30m) |
| **Kiểm thử Seeder (Tất định & Idempotent)** | `backend/tests/CulinaryBlog.Infrastructure.Tests/Persistence/Seeders/CulinaryBlogSeederTests.cs` | 19 test cases kiểm chứng SEED=42, 1-N lồng ghép, tính Idempotency |
| **Kiểm thử Repositories & Unit of Work** | `backend/tests/CulinaryBlog.Infrastructure.Tests/Repositories/RepositoryTests.cs` | 10 test cases kiểm thử BaseRepository, CategoryRepository, UnitOfWork |
| **Kiểm thử Domain Exceptions (Pure BCL)** | `backend/tests/CulinaryBlog.UnitTests/Domain/DomainExceptionTests.cs` | 8 test cases kiểm thử EntityNotFound, Concurrency, CategoryNotEmpty |
| **Kiểm thử Middleware Xử lý Lỗi RFC 7807** | `backend/tests/CulinaryBlog.UnitTests/Middlewares/GlobalExceptionMiddlewareTests.cs` | 6 test cases kiểm thử HTTP 400, 404, 409, 500 với Problem Details |
| **Kiểm thử Integration API Categories** | `backend/tests/CulinaryBlog.API.IntegrationTests/Endpoints/CategoryEndpointsTests.cs` | 5 integration tests qua WebApplicationFactory (GET categories, slug, cache) |
| **Cấu hình Fixture TestServer Cô Lập** | `backend/tests/CulinaryBlog.API.IntegrationTests/Fixtures/CustomWebApplicationFactory.cs` | Cấu hình InMemory EF Core Provider, InMemory Hangfire & DistributedCache |

---

## 3. Cây thư mục chi tiết & Giải phẫu trách nhiệm từng file

```
f:\PTUDW\PTUDWebNangCao-2026-Nhom13\
│
├── .gitignore                                  <-- Bộ lọc artifact đa nền tảng (.NET, Node, IDE, OS)
├── CODE_MAP_SELECTION.md                      <-- Tệp này: Bản đồ điều hướng tra cứu mã nguồn nhanh
├── README.md                                  <-- Tài liệu tổng quan dự án & phân công trách nhiệm thành viên
│
├── infrastructure/
│   └── docker-compose.yml                     <-- Cấu hình container chạy PostgreSQL (5432) và Redis (6379)
│
├── backend/
│   ├── CulinaryBlog.slnx                      <-- Solution định dạng mới của .NET 10
│   │
│   ├── src/
│   │   ├── Domain/                            <-- TẦNG DOMAIN: Thuần C# BCL, không phụ thuộc framework ngoài
│   │   │   ├── Common/
│   │   │   │   └── BaseEntity.cs              <-- Lớp cơ sở chứa Id, CreatedAt, UpdatedAt, IsDeleted, RowVersion
│   │   │   ├── Entities/
│   │   │   │   ├── Category.cs                <-- Thực thể Danh mục (kế thừa BaseEntity, liên kết 1-N với Recipe)
│   │   │   │   ├── Recipe.cs                  <-- Thực thể Công thức (chứa Steps, Ingredients, Nutrition)
│   │   │   │   ├── RecipeStep.cs              <-- Thực thể Bước thực hiện (OrderIndex, Description, TimerMinutes)
│   │   │   │   ├── RecipeIngredient.cs        <-- Thực thể Nguyên liệu (Name, Quantity, Unit, OrderIndex)
│   │   │   │   └── ApplicationUser.cs         <-- Thực thể Người dùng kế thừa IdentityUser<string>
│   │   │   └── Enums/
│   │   │       ├── RecipeDifficulty.cs        <-- Độ khó: Easy, Medium, Hard
│   │   │       └── RecipeStatus.cs            <-- Trạng thái: Draft, Pending, Published, Archived
│   │   │
│   │   ├── Application/                       <-- TẦNG APPLICATION: Use cases, CQRS với MediatR, FluentValidation
│   │   │   ├── Common/Interfaces/             <-- Interface trừu tượng (ICacheService, ICurrentUserService...)
│   │   │   └── Features/Categories/           <-- Vertical Slice cho Danh mục (FR-CAT)
│   │   │       ├── Commands/
│   │   │       │   ├── CreateCategory/        <-- Tạo danh mục + tự sinh SEO Slug + xóa cache
│   │   │       │   ├── UpdateCategory/        <-- Sửa danh mục + kiểm tra Concurrency Token RowVersion
│   │   │       │   └── DeleteCategory/        <-- Xóa mềm danh mục + chặn 409 nếu có Recipes liên kết
│   │   │       ├── Queries/
│   │   │       │   ├── GetCategories/         <-- Lấy tất cả danh mục (Cached Redis TTL 30m)
│   │   │       │   └── GetCategoryBySlug/     <-- Lấy chi tiết danh mục + phân trang công thức
│   │   │       └── DTOs/                      <-- CategoryDto, CategoryDetailDto, RecipeSummaryDto
│   │   │
│   │   ├── Infrastructure/                    <-- TẦNG INFRASTRUCTURE: EF Core, CSDL vật lý, Redis, Bogus Seeder
│   │   │   ├── CulinaryBlog.Infrastructure.csproj
│   │   │   ├── Data/
│   │   │   │   ├── CulinaryBlogDbContext.cs   <-- DbContext quản lý DbSets, Owned Entities, Audit Interceptor
│   │   │   │   ├── Migrations/                <-- Các file EF Core Migration cho PostgreSQL
│   │   │   │   └── Seeders/
│   │   │   │       └── CulinaryBlogSeeder.cs  <-- BỘ SINH DỮ LIỆU TỰ ĐỘNG CHÍNH (Bogus, SEED=42)
│   │   │   ├── Repositories/
│   │   │   │   ├── BaseRepository.cs          <-- Generic Repository pattern
│   │   │   │   └── CategoryRepository.cs      <-- Repository riêng cho Danh mục
│   │   │   └── Services/
│   │   │       ├── RedisCacheService.cs       <-- Hiện thực ICacheService dùng StackExchange.Redis
│   │   │       └── JwtService.cs              <-- Sinh và thẩm định JWT Token
│   │   │
│   │   └── Presentation/                      <-- TẦNG PRESENTATION: ASP.NET Core Minimal APIs
│   │       ├── CulinaryBlog.API.csproj
│   │       ├── Program.cs                     <-- Điểm vào ứng dụng: DI Container, Migration, Kích hoạt Seeder
│   │       ├── Endpoints/
│   │       │   ├── CategoriesEndpoints.cs     <-- Khai báo Minimal API route cho Categories (/api/v1/categories)
│   │       │   ├── RecipesEndpoints.cs        <-- Skeleton cho Recipes Endpoints
│   │       │   └── AuthEndpoints.cs           <-- Đăng ký, đăng nhập, cấp phát JWT
│   │       └── Middlewares/
│   │           ├── CorrelationIdMiddleware.cs <-- Gắn Correlation ID theo dõi log phân tán
│   │           └── GlobalExceptionMiddleware.cs <-- Xử lý lỗi tập trung chuẩn RFC 7807 ProblemDetails
│   │
│   └── tests/
│       ├── CulinaryBlog.UnitTests/            <-- Bộ kiểm thử đơn vị cho Application Handlers & Validators
│       └── CulinaryBlog.Infrastructure.Tests/
│           └── Persistence/Seeders/
│               └── CulinaryBlogSeederTests.cs <-- Kiểm thử tính tất định và idempotent của Seeder
│
└── frontend/                                  <-- GIAO DIỆN CLIENT: Next.js 15 App Router + TailwindCSS
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app/
        │   ├── categories/                    <-- Trang Public hiển thị danh sách tất cả Danh mục
        │   │   ├── page.tsx
        │   │   └── [slug]/page.tsx            <-- Trang Public chi tiết danh mục + danh sách món theo slug
        │   └── dashboard/categories/          <-- Trang Quản trị Admin: Bảng CRUD Danh mục
        │       └── page.tsx
        └── services/
            └── categoryService.ts             <-- Gọi API Backend từ Frontend
```

### Giải Phẫu Trách Nhiệm Từng File & Mối Liên Hệ Với Các Phân Hệ Sau:
1. **`CulinaryBlogSeeder.cs`**:
   - *Trách nhiệm:* Đảm bảo CSDL luôn có sẵn dữ liệu chuẩn để dev và test mà không cần nhập tay.
   - *Liên hệ module khác:*
     - **FR-AUTH (Xác thực):** Cung cấp sẵn 10 tài khoản tác giả với Role `Author` để test đăng nhập, cấp quyền sửa bài.
     - **FR-REC (Công thức):** Cung cấp sẵn 100 công thức mẫu với đủ các trường phức tạp (`Nutrition`, `Steps`, `Ingredients`) để các thành viên khác code màn hình xem chi tiết công thức hoặc tính năng Bookmark.
     - **FR-SRCH (Tìm kiếm):** Cung cấp kho dữ liệu tiếng Việt phong phú để test tìm kiếm full-text search theo nguyên liệu hoặc tiêu đề.
2. **`CulinaryBlogDbContext.cs`**:
   - *Trách nhiệm:* Cầu nối giữa Domain Entities và bảng vật lý PostgreSQL.
   - *Liên hệ module khác:* Khi thêm bảng mới (ví dụ: `Comments`, `Bookmarks`, `Ratings`), bắt buộc phải khai báo `DbSet<T>` tại đây.
3. **`CategoriesEndpoints.cs`**:
   - *Trách nhiệm:* Nhận HTTP Request từ Client, chuyển tiếp vào MediatR Pipeline và trả về HTTP Response chuẩn RESTful.
   - *Liên hệ module khác:* Mẫu chuẩn (Golden Pattern) để các thành viên khác copy triển khai `RecipesEndpoints.cs` và `UsersEndpoints.cs`.

---

## 4. Luồng thực thi chi tiết của chức năng Seeding (Execution Flow)

Khi lập trình viên gõ lệnh `dotnet run` tại thư mục `backend/src/Presentation/`, tiến trình khởi tạo dữ liệu sẽ diễn ra tuần tự qua 7 bước:

```
[dotnet run]
     │
     ▼
[1. Program.cs - Bootstrap Host]
     │  - Cấu hình Serilog, DI Container (Application, Infrastructure)
     │  - Kiểm tra điều kiện: if (app.Environment.IsDevelopment())
     │
     ▼
[2. Khởi tạo DI Scope tạm thời]
     │  - using var scope = app.Services.CreateScope();
     │  - Lấy CulinaryBlogDbContext từ scope
     │  - await db.Database.MigrateAsync(); (Áp dụng các Migration mới nhất lên PostgreSQL)
     │
     ▼
[3. Kích hoạt CulinaryBlogSeeder.SeedAsync]
     │  - Đặt Randomizer.Seed = new Random(42); (Cố định bộ số sinh ngẫu nhiên)
     │  - Mở một Async Scope con để resolve DbContext, UserManager, RoleManager
     │
     ▼
[4. Kiểm tra Roles & Users]
     │  - Duyệt mảng ["Admin", "Author", "Reader"] -> Tạo Role nếu chưa có
     │  - Dùng Bogus sinh 10 ApplicationUser (locale "vi")
     │  - userManager.CreateAsync(author, "Author@123456") (Băm mật khẩu qua PBKDF2)
     │  - userManager.AddToRoleAsync(author, "Author")
     │
     ▼
[5. Kiểm tra Idempotency & Tạo Categories]
     │  - Kiểm tra: if (await db.Recipes.CountAsync() >= 100) return; -> Thoát ngay nếu đã seed
     │  - Nếu Category < 20: Duyệt mảng CategoryNames -> Sinh Slug tiếng Việt không dấu -> Add db.Categories
     │  - await db.SaveChangesAsync(); (Lưu để lấy Id thật của Categories)
     │
     ▼
[6. Tạo 100 Recipes & Quan hệ 1-N lồng ghép]
     │  - Tính toán: recipesNeeded = 100 - count
     │  - Sinh Recipe với tiêu đề tiếng Việt ngẫu nhiên, gán ngẫu nhiên CategoryId và AuthorId
     │  - Với mỗi Recipe:
     │      + Sinh 5–8 RecipeStep (StepNumber = 1..N, thời gian timer)
     │      + Lấy 10–15 nguyên liệu từ IngredientPool bằng phương pháp không trùng tên
     │  - await db.Recipes.AddRangeAsync(recipes);
     │  - await db.SaveChangesAsync();
     │
     ▼
[7. Giải phóng Scope & Bật Web Server]
        - Khối using kết thúc -> Giải phóng hoàn toàn DbContext và ChangeTracker khỏi RAM
        - Web API chuyển sang trạng thái lắng nghe HTTP Request tại http://localhost:5000
```

---

## 5. Lưu ý kỹ thuật quan trọng khi chỉnh sửa code

### 5.1. Tránh Lỗi Trùng Lặp Nguyên Liệu (Duplicate Ingredients Bug)
- Trong CSDL thực tế, một công thức nấu ăn không thể chứa hai dòng nguyên liệu có cùng một tên gọi (gây dư thừa hoặc mâu thuẫn định lượng).
- **Quy tắc khi sửa Seeder:** Tuyệt đối **không** dùng `faker.PickRandom(pool)` trong vòng lặp thêm nguyên liệu.
- **Cách viết chuẩn hiện tại:**
  ```csharp
  // Lấy ngẫu nhiên ingrCount nguyên liệu KHÔNG TRÙNG NHAU từ Pool:
  var selectedIngredients = ingrFaker.PickRandom(IngredientPool, ingrCount).ToList();
  for (int i = 0; i < selectedIngredients.Count; i++)
  {
      recipe.Ingredients.Add(new RecipeIngredient { Name = selectedIngredients[i], ... });
  }
  ```

### 5.2. Tránh Lỗi Tràn Bộ Nhớ (Memory Leak & DbContext Bloat)
- `CulinaryBlogDbContext` lưu lại dấu vết (Change Tracking) của toàn bộ 100 Recipes cùng hàng trăm Steps và Ingredients. Nếu giữ context này ở phạm vi Singleton hoặc toàn ứng dụng, RAM sẽ bị chiếm dụng vĩnh viễn.
- **Quy tắc:** Luôn gói lệnh gọi Seeder bên trong `using var scope = serviceProvider.CreateScope();`. Khi ra khỏi scope, bộ thu gom rác (Garbage Collector) sẽ lập tức thu hồi toàn bộ bộ nhớ đệm thực thể.

### 5.3. Tuân Thủ Ràng Buộc Soft Delete (Global Query Filters)
- Hệ thống áp dụng xóa mềm (`IsDeleted = true`). 
- Khi viết các truy vấn kiểm tra trong Seeder hoặc tính toán thống kê:
  - Nếu muốn kiểm tra số lượng bản ghi **thực tế trong DB** (bao gồm cả bài bị ẩn/xóa): Sử dụng `.IgnoreQueryFilters()`.
  - Nếu muốn hiển thị dữ liệu cho người dùng cuối: Giữ nguyên truy vấn mặc định của EF Core (đã tự động lọc `!IsDeleted`).

### 5.4. Kiểm Soát Cạnh Tranh Đồng Thời Với `RowVersion`
- Tất cả các bảng chính (`Category`, `Recipe`, `RecipeStep`, `RecipeIngredient`) đều kế thừa `BaseEntity` chứa trường `byte[] RowVersion`.
- Khi cập nhật dữ liệu qua API (ví dụ: `PUT /api/v1/categories/{id}`), Client **bắt buộc** phải gửi kèm chuỗi `RowVersion` hiện tại.
- Nếu `RowVersion` không khớp, EF Core sẽ ném `DbUpdateConcurrencyException`, API sẽ tự động chuyển thành mã lỗi `409 Conflict`.

### 5.5. Thuật Toán Sinh Slug Chuẩn SEO Tiếng Việt
- Khi thêm mới danh mục hoặc món ăn, trường `Slug` phải được chuẩn hóa:
  - Loại bỏ hoàn toàn dấu tiếng Việt (*"Món nướng"* $\rightarrow$ *"mon-nuong"*).
  - Thay thế khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang (`-`).
  - Chuyển toàn bộ về chữ thường (lowercase) và gắn kèm chuỗi định danh chống trùng lặp.

---

## 6. Bản đồ kiểm thử tự động (Automated Test Suite Map)

Hệ thống kiểm thử tự động được xây dựng toàn diện trên **xUnit, FluentAssertions, Moq, và Microsoft.AspNetCore.Mvc.Testing (WebApplicationFactory)** với cấu trúc **AAA (Arrange - Act - Assert)** chuẩn mực. Toàn bộ 75/75 test cases đều chạy độc lập, tự động hóa 100% trong bộ nhớ (In-Memory Database & Distributed Memory Cache), không phụ thuộc vào Docker hay cơ sở dữ liệu bên ngoài.

```
backend/tests/
├── CulinaryBlog.Infrastructure.Tests/          <-- [29 Tests PASSED]
│   ├── Persistence/Seeders/
│   │   └── CulinaryBlogSeederTests.cs          <-- 19 Tests: Determinism SEED=42, Idempotency, 1-N constraints
│   └── Repositories/
│       └── RepositoryTests.cs                  <-- 10 Tests: BaseRepository CRUD + Soft Delete, CategoryRepository
│
├── CulinaryBlog.UnitTests/                     <-- [41 Tests PASSED]
│   ├── CategoryValidatorsTests.cs              <-- 10 Tests: FluentValidation rules, XSS, OrderIndex
│   ├── CategoryHandlersTests.cs                <-- 9 Tests: MediatR CQRS Commands & Queries
│   ├── SlugHelperTests.cs                      <-- 8 Tests: Vietnamese Unicode normalization & SEO slugs
│   ├── Domain/
│   │   └── DomainExceptionTests.cs             <-- 8 Tests: Pure BCL domain exceptions (CONS-001)
│   └── Middlewares/
│       └── GlobalExceptionMiddlewareTests.cs   <-- 6 Tests: RFC 7807 Problem Details status mapping
│
└── CulinaryBlog.API.IntegrationTests/          <-- [5 Tests PASSED]
    ├── Fixtures/
    │   └── CustomWebApplicationFactory.cs      <-- TestServer cô lập (Memory EF Core, Memory Cache, Memory Hangfire)
    └── Endpoints/
        └── CategoryEndpointsTests.cs           <-- 5 Tests: GET /categories (Order, Count, Cache), GET /{slug} (404, Page)
```

### Tổng kết kết quả chạy `dotnet test`:
- **Tổng số bài kiểm thử:** **75 / 75 PASSED (100% Green)**
- **Số bài thất bại:** **0 Failed**
- **Số bài bỏ qua:** **0 Skipped**
- **Thời gian thực thi trung bình:** ~15 giây cho toàn bộ Solution.

