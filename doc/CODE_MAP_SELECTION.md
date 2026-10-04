# 🗺️ BẢN ĐỒ TRA CỨU MÃ NGUỒN & VỊ TRÍ CHỨC NĂNG (DEV CODE MAP)
> **Nhánh làm việc:** `2312719-Phuoc/Tuan-4`  
> **Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
> **Vai trò:** Technical Lead & Core Developer  
> **Cập nhật lần cuối:** 04/10/2026  

---

## 1. Mốc trạng thái hiện tại (Current Checkpoint)

- **Đã hoàn thành 100%:**
  - [x] **Cấu hình `.gitignore` tiêu chuẩn:** Lọc sạch rác nhị phân .NET (`bin/`, `obj/`, `.vs/`) và artifact của Node/Next.js (`node_modules/`, `.next/`, `dist/`).
  - [x] **Module Khởi tạo Dữ liệu Tự động ([CulinaryBlogSeeder.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs)):**
    - Sinh 3 Roles chuẩn hệ sinh thái (`Admin`, `Author`, `Reader`).
    - Sinh 10 Authors với mật khẩu băm PBKDF2 (`UserManager.CreateAsync`).
    - Sinh 25 Categories ẩm thực thực tế (Việt Nam + Quốc tế) kèm Slug SEO.
    - Sinh 100 Recipes (`Status = Published`) phân bổ ngẫu nhiên có kiểm soát vào Categories và Authors.
    - Sinh quan hệ 1-N lồng ghép: 5–8 `RecipeSteps` (thứ tự tăng dần `StepNumber`) và 10–15 `RecipeIngredients` không trùng tên trên cùng một công thức.
    - Sinh Owned Entity `RecipeNutrition` (Calories, Fat, Carbs, Protein) và liên kết `RecipeImage`.
    - Cơ chế tất định: `SEED = 42` bảo đảm kết quả giống hệt nhau trên mọi máy trạm và môi trường CI/CD.
    - Tính Idempotent: Kiểm tra `CountAsync() >= 100` và `RoleExistsAsync` trước khi sinh.
  - [x] **Tích hợp Seeder & EF Core Migration vào vòng đời API:** Đăng ký trong [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs), tự động kích hoạt `Database.MigrateAsync()` và Seeder trong môi trường Development qua một `IServiceScope` cô lập.
  - [x] **Đồng bộ hóa Domain Model & Cơ sở dữ liệu vật lý (PostgreSQL):**
    - Cấu hình Entity Configuration: [RecipeConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeConfiguration.cs), [RecipeStepConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeStepConfiguration.cs), [RecipeIngredientConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeIngredientConfiguration.cs), [RecipeImageConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeImageConfiguration.cs).
    - Bộ chặn kiểm toán dữ liệu [AuditInterceptor.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Interceptors/AuditInterceptor.cs) tự động điền `CreatedAt`, `UpdatedAt`.
    - Áp dụng thành công các bản di chuyển EF Core: `20260930112628_InitialCreate` và `20261003110543_SyncRecipeDomainModel`.
  - [x] **Domain Exceptions chuẩn hóa ([src/Domain/Exceptions/](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/)):** Cài đặt [DomainException.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/DomainException.cs), [EntityNotFoundException.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/EntityNotFoundException.cs), [CategoryNotEmptyException.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/CategoryNotEmptyException.cs), [ConcurrencyConflictException.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/ConcurrencyConflictException.cs), [BusinessRuleValidationException.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Exceptions/BusinessRuleValidationException.cs) thuần .NET BCL (CONS-001).
  - [x] **Hạ tầng Repository & Unit of Work:** Định nghĩa [IRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Common/Interfaces/IRepository.cs), [ICategoryRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Common/Interfaces/ICategoryRepository.cs), [IRecipeRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Interfaces/IRecipeRepository.cs), [IUnitOfWork.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Common/Interfaces/IUnitOfWork.cs) tại Domain và hiện thực [BaseRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/BaseRepository.cs), [CategoryRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/CategoryRepository.cs), [RecipeRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/RecipeRepository.cs), [UnitOfWork.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/UnitOfWork.cs) tại Infrastructure, đăng ký Scoped DI.
  - [x] **Phân hệ Quản lý Danh mục (FR-CAT - 5 Endpoints Minimal APIs):**
    - `GET /api/v1/categories`: Công khai, Redis cache 30m, trả về danh sách kèm số lượng công thức.
    - `GET /api/v1/categories/{slug}`: Công khai, phân trang công thức con (max 50 pageSize).
    - `POST /api/v1/categories`: Quyền Admin, sinh Slug SEO chuẩn tiếng Việt, xóa cache.
    - `PUT /api/v1/categories/{id}`: Quyền Admin, kiểm tra Optimistic Concurrency qua `RowVersion`, bảo toàn Slug.
    - `DELETE /api/v1/categories/{id}`: Quyền Admin, xóa mềm, chặn mã lỗi 409 Conflict (`CATEGORY_DELETE_HAS_RECIPES`) nếu còn bài viết.
  - [x] **Phân hệ Quản lý Công thức (FR-RCP - 8 Endpoints Minimal APIs):**
    - `POST /api/v1/recipes`: Tạo mới công thức (bước, nguyên liệu, thông số dinh dưỡng).
    - `GET /api/v1/recipes/{slug}`: Chi tiết công thức, Output Cache 60m (gắn tag `"recipes"`).
    - `PUT /api/v1/recipes/{id}`: Cập nhật công thức toàn diện (bước, nguyên liệu, dinh dưỡng, ảnh).
    - `PATCH /api/v1/recipes/{id}/publish`: Xuất bản công thức, kích hoạt xóa cache theo tag `"recipes"`.
    - `PATCH /api/v1/recipes/{id}/unpublish`: Đưa công thức về trạng thái Draft, xóa cache tag.
    - `PATCH /api/v1/recipes/{id}/archive`: Lưu trữ công thức (Archive), xóa cache tag.
    - `DELETE /api/v1/recipes/{id}`: Xóa mềm công thức (`IsDeleted = true`), xóa cache tag.
  - [x] **Phân hệ Tìm kiếm & Lọc nâng cao (FR-SRCH):**
    - Tích hợp tại `GET /api/v1/recipes` qua [GetRecipesQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Queries/GetRecipes/GetRecipesQueryHandler.cs).
    - Hỗ trợ đa tiêu chí: `SearchTerm` (tìm tiêu đề hoặc mô tả), `CategoryId`, `Difficulty`, `MaxTotalTimeMinutes` (thời gian chuẩn bị + nấu), `SortBy` (`newest`, `oldest`, `time_asc`, `time_desc`).
    - Phân quyền động: Khách ẩn danh chỉ xem bài `Published`; Tác giả đã đăng nhập xem bài `Published` + toàn bộ bài nháp/lưu trữ của chính mình.
    - Tích hợp Output Cache 5 phút với `SetVaryByQuery`.
  - [x] **Phân hệ Xác thực & Người dùng (FR-AUTH - 7 Endpoints Minimal APIs):**
    - `POST /api/v1/auth/register`: Đăng ký tài khoản, tự động đăng nhập, trả JWT Bearer và gán HttpOnly Cookie refresh token.
    - `POST /api/v1/auth/login`: Đăng nhập bằng Email/Password, xử lý lockout (423) và ban (403).
    - `POST /api/v1/auth/google`: Đăng nhập / đăng ký qua Google OAuth ID Token.
    - `POST /api/v1/auth/refresh`: Cấp mới JWT từ HttpOnly Cookie refresh token.
    - `POST /api/v1/auth/logout`: Đăng xuất idempotent, thu hồi refresh token và xóa cookie.
    - `GET /api/v1/auth/me`: Lấy thông tin tài khoản hiện tại.
    - `PATCH /api/v1/auth/me`: Cập nhật DisplayName, AvatarUrl, Bio (chặn đổi Email/UserName).
  - [x] **Global Middlewares & Bảo mật chuẩn Enterprise:**
    - [GlobalExceptionMiddleware.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Middlewares/GlobalExceptionMiddleware.cs): Xử lý tập trung các lỗi 400, 401, 403, 404, 409, 422, 500 theo chuẩn RFC 7807 (`application/problem+json`).
    - [CorrelationIdMiddleware.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Middlewares/CorrelationIdMiddleware.cs): Đính kèm `X-Correlation-ID` xuyên suốt luồng gọi API và Serilog.
    - Fixed Window Rate Limiter: 100 requests/phút trên từng IP.
    - Tích hợp Scalar API Reference (`/scalar/v1`) và OpenAPI document native (.NET 10).
  - [x] **Giao diện Client Next.js 15 (App Router + TailwindCSS):**
    - Public UI: Trang danh sách danh mục ([categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx)), Trang chi tiết danh mục kèm bài viết ([categories/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/%5Bslug%5D/page.tsx)).
    - Recipe Shell: Trang danh sách công thức ([recipes/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/recipes/page.tsx)), chi tiết công thức ([recipes/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/recipes/%5Bslug%5D/page.tsx)).
    - Admin UI: Trang quản lý danh mục CRUD với modal form và modal xác nhận xóa ([dashboard/categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx)).
    - Auth UI: Đăng nhập ([login/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/login/page.tsx)), Đăng ký ([register/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/register/page.tsx)), Hồ sơ cá nhân ([profile/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/profile/page.tsx)).
    - Services & Components: [category-service.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/services/category-service.ts), [api-client.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/api-client.ts), [CategoryCard.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryCard.tsx), [CategoryFormModal.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryFormModal.tsx), [DeleteCategoryModal.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/DeleteCategoryModal.tsx), [RecipeCard.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipeCard.tsx), [site-header.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/site-header.tsx).
  - [x] **Hạ tầng Container hóa ([docker-compose.yml](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/infrastructure/docker-compose.yml)):**
    - PostgreSQL 16 (Port 5432) kèm kịch bản [init-db.sql](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/infrastructure/init-db.sql).
    - Redis 7 Alpine (Port 6379, AOF persistence).
    - Seq Log Collector (Port 5341).
    - MailHog Mock SMTP (Port 1025, Web UI 8025).
  - [x] **Bộ Kiểm Thử Tự Động Toàn Diện (163/163 Tests Passed - 100% Green):**
    - `CulinaryBlog.Domain.Tests`: 16 tests passed.
    - `CulinaryBlog.Application.Tests`: 72 tests passed.
    - `CulinaryBlog.Infrastructure.Tests`: 29 tests passed.
    - `CulinaryBlog.UnitTests`: 41 tests passed.
    - `CulinaryBlog.API.IntegrationTests`: 5 tests passed.

- **Điểm dừng hiện tại:**  
  Toàn bộ Backend Core Architecture từ Domain Model, Seeding, Repositories, CQRS Handlers (Categories, Recipes, Search, Auth), Minimal APIs Endpoints, Caching, Middleware RFC 7807 đến Bộ kiểm thử tự động (163 tests passed - 100% Green) đã được nghiệm thu và chạy ổn định. Phía Frontend Next.js 15 đã hoàn thiện toàn diện giao diện Public Categories, Admin Categories Dashboard, và các luồng xác thực.

- **Bước kế tiếp cần làm:**  
  Tiếp tục phối hợp cùng các thành viên hoàn thiện các phân hệ nâng cao (Bình luận, Đánh giá, Bookmark) và ghép nối màn hình soạn thảo công thức chi tiết (Recipe Editor) trên Next.js 15.

---

## 2. Bảng chỉ mục tra cứu: "Cần sửa gì -> Mở file nào?" (Quick Lookup Index)

| Nghiệp vụ / Logic cần can thiệp | Tệp tin đảm nhận (File Path) | Hàm / Khối code cụ thể |
|---|---|---|
| **Thay đổi hạt giống sinh ngẫu nhiên Seeder** | [CulinaryBlogSeeder.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs) | Hằng số `private const int SEED = 42;` |
| **Sửa danh mục mẫu tiếng Việt & Quốc tế** | [CulinaryBlogSeeder.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs) | Mảng `private static readonly string[] CategoryNames` |
| **Sửa kho công thức & nguyên liệu mẫu** | [CulinaryBlogSeeder.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs) | Mảng `RecipeTitles`, `IngredientPool`, `StepDescriptions` |
| **Thay đổi số lượng bản ghi mẫu Seeder** | [CulinaryBlogSeeder.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs) | Điều kiện `CountAsync() >= 100`, `Generate(10)`, `Random.Int(5, 8)` |
| **Cấu hình tự động Migration & Seeder khi khởi động** | [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) | Khối `if (app.Environment.IsDevelopment())` gọi `Database.MigrateAsync()` & `CulinaryBlogSeeder.SeedAsync` |
| **Cấu hình DbContext, DbSets & Interceptors** | [CulinaryBlogDbContext.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs) | `DbSet<Category>`, `DbSet<Recipe>`, `DbSet<RecipeStep>`, `DbSet<RecipeIngredient>`, `DbSet<RecipeImage>` |
| **Cấu hình Fluent API bảng Recipe & Owned Nutrition** | [RecipeConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeConfiguration.cs) | `builder.OwnsOne(r => r.Nutrition, ...)`, cấu hình `RowVersion` Concurrency Token |
| **Cấu hình bảng Bước thực hiện (RecipeStep)** | [RecipeStepConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeStepConfiguration.cs) | Khóa ngoại `RecipeId`, chỉ mục `StepNumber`, ràng buộc chuỗi |
| **Cấu hình bảng Nguyên liệu (RecipeIngredient)** | [RecipeIngredientConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeIngredientConfiguration.cs) | Khóa ngoại `RecipeId`, `Name`, `Quantity`, `Unit` |
| **Cấu hình bảng Hình ảnh công thức (RecipeImage)** | [RecipeImageConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeImageConfiguration.cs) | Khóa ngoại `RecipeId`, `OriginalUrl`, `ThumbnailUrl`, `IsPrimary` |
| **Thực thể Danh mục & Công thức gốc (Domain)** | [Category.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Entities/Category.cs), [Recipe.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Entities/Recipe.cs) | Khai báo thuộc tính, liên kết 1-N, enum `RecipeStatus`, `RecipeDifficulty` |
| **Thực thể con Công thức (Steps, Ingredients, Images)** | [RecipeChildren.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Entities/RecipeChildren.cs) | Lớp `RecipeStep`, `RecipeIngredient`, `RecipeImage` |
| **Value Object Dinh dưỡng công thức** | [RecipeNutrition.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/ValueObjects/RecipeNutrition.cs) | `RecipeNutrition(int Calories, decimal FatGrams, decimal CarbsGrams, decimal ProteinGrams)` |
| **Repository Danh mục & Đếm công thức active** | [CategoryRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/CategoryRepository.cs) | `GetAllWithRecipeCountAsync()`, `GetBySlugWithRecipesAsync()` |
| **Repository Công thức & Include quan hệ** | [RecipeRepository.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/RecipeRepository.cs) | `GetBySlugAsync()`, `GetByIdWithDetailsAsync()`, `GetQueryable()` |
| **Quản lý giao dịch dữ liệu Unit of Work** | [UnitOfWork.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Repositories/UnitOfWork.cs) | `SaveChangesAsync()`, `BeginTransactionAsync()`, `CommitTransactionAsync()` |
| **Minimal APIs Endpoints Danh mục (FR-CAT)** | [CategoriesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/CategoriesEndpoints.cs) | `MapCategoriesEndpoints()`: Các route `GET /`, `GET /{slug}`, `POST /`, `PUT /{id}`, `DELETE /{id}` |
| **Minimal APIs Endpoints Công thức & Tìm kiếm (FR-RCP & FR-SRCH)** | [RecipesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/RecipesEndpoints.cs) | `MapRecipesEndpoints()`: Tuyến `GET /` (Tìm kiếm/Lọc/Sort/Cache), `GET /{slug}`, `POST /`, `PUT /{id}`, `PATCH /*` |
| **Minimal APIs Endpoints Xác thực (FR-AUTH)** | [AuthEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/AuthEndpoints.cs) | `MapAuthEndpoints()`: Tuyến `/register`, `/login`, `/google`, `/refresh`, `/logout`, `/me` |
| **CQRS Tìm kiếm & Lọc công thức** | [GetRecipesQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Queries/GetRecipes/GetRecipesQueryHandler.cs) | Xử lý `SearchTerm`, `CategoryId`, `Difficulty`, `MaxTotalTimeMinutes`, `SortBy`, Phân quyền xem bài |
| **CQRS Xem chi tiết công thức** | [GetRecipeBySlugQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Queries/GetRecipeBySlug/GetRecipeBySlugQueryHandler.cs) | Lấy chi tiết công thức kèm bước, nguyên liệu, thông số dinh dưỡng, kiểm tra quyền tác giả |
| **CQRS Tạo mới công thức** | [CreateRecipeCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Commands/CreateRecipe/CreateRecipeCommandHandler.cs) | Sinh Slug SEO, kiểm tra trùng lặp tiêu đề, lưu Steps & Ingredients |
| **CQRS Cập nhật công thức & Concurrency** | [UpdateRecipeCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Commands/UpdateRecipe/UpdateRecipeCommandHandler.cs) | Cập nhật thông tin, thay thế danh sách Steps/Ingredients, kiểm tra quyền sở hữu |
| **CQRS Xuất bản / Thu hồi / Lưu trữ công thức** | [PublishRecipeCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Commands/PublishRecipe/PublishRecipeCommandHandler.cs) | Chuyển đổi trạng thái `RecipeStatus`, kiểm tra điều kiện xuất bản |
| **CQRS Xóa công thức** | [DeleteRecipeCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Recipes/Commands/DeleteRecipe/DeleteRecipeCommandHandler.cs) | Kiểm tra quyền tác giả, thực hiện xóa mềm `IsDeleted = true` |
| **CQRS Tạo danh mục & Xóa Cache** | [CreateCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/CreateCategory/CreateCategoryCommandHandler.cs) | Sinh Slug SEO, kiểm tra trùng tên danh mục, xóa cache Redis `categories:all` |
| **CQRS Sửa danh mục & Kiểm tra Concurrency** | [UpdateCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/UpdateCategory/UpdateCategoryCommandHandler.cs) | Kiểm tra `RowVersion`, bảo toàn Slug chống broken link, xóa cache |
| **CQRS Xóa mềm danh mục & Chặn 409 Conflict** | [DeleteCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/DeleteCategory/DeleteCategoryCommandHandler.cs) | Kiểm tra `Recipes.AnyAsync()`, ném `CategoryNotEmptyException` nếu còn bài viết |
| **CQRS Lấy danh mục kèm Cache Redis** | [GetCategoriesQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategories/GetCategoriesQueryHandler.cs) | Kiểm tra Cache Key `categories:all`, TTL 30m, fallback truy vấn Database |
| **CQRS Chi tiết danh mục kèm phân trang món** | [GetCategoryBySlugQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/GetCategoryBySlugQueryHandler.cs) | Truy vấn Category kèm danh sách Recipe đã Published, hỗ trợ phân trang |
| **Xử lý lỗi toàn cục RFC 7807 Problem Details** | [GlobalExceptionMiddleware.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Middlewares/GlobalExceptionMiddleware.cs) | Map các ngoại lệ sang mã HTTP 400, 401, 403, 404, 409, 422, 500 |
| **Thuật toán sinh Slug tiếng Việt chuẩn SEO** | [SlugHelper.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Common/Helpers/SlugHelper.cs) | Khử dấu tiếng Việt Unicode Normalization Form C/D, Regex ký tự an toàn |
| **Dịch vụ Cache phân tán Redis** | [RedisCacheService.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Services/RedisCacheService.cs) | `GetAsync<T>`, `SetAsync<T>`, `RemoveAsync`, `RemoveByPrefixAsync` |
| **Frontend: Trang xem danh mục công khai** | [frontend/src/app/categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx) | Hiển thị Grid danh mục kèm số món ăn, gọi qua `categoryService.getAll()` |
| **Frontend: Trang chi tiết danh mục + Món ăn** | [frontend/src/app/categories/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/%5Bslug%5D/page.tsx) | Server Component SSR hiển thị banner danh mục và danh sách công thức |
| **Frontend: Trang quản trị CRUD danh mục** | [frontend/src/app/dashboard/categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx) | Bảng Admin quản lý danh mục, thêm mới, chỉnh sửa và xác nhận xóa |
| **Frontend: Gọi API danh mục từ Client** | [category-service.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/services/category-service.ts) | Các phương thức `getAll()`, `getBySlug()`, `create()`, `update()`, `delete()` |
| **Cấu hình Docker Compose đa dịch vụ** | [docker-compose.yml](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/infrastructure/docker-compose.yml) | Thiết lập Postgres 16, Redis 7, Seq (5341), MailHog (8025/1025) |

---

## 3. Cây thư mục chi tiết & Giải phẫu trách nhiệm từng file

```
f:\PTUDW\PTUDWebNangCao-2026-Nhom13\
│
├── .gitignore                                  <-- Bộ lọc artifact đa nền tảng (.NET, Node, Next.js, IDE, OS)
├── README.md                                  <-- Tài liệu tổng quan dự án & phân công trách nhiệm thành viên
├── DATA_MODEL.md                              <-- Đặc tả cấu trúc cơ sở dữ liệu và quan hệ thực thể
├── SPEC.md / SRS_Culinary_Blog_v1.0.0.md      <-- Bản đặc tả yêu cầu kỹ thuật & phân tích mâu thuẫn hệ thống
│
├── infrastructure/
│   ├── docker-compose.yml                     <-- Cấu hình container: PostgreSQL (5432), Redis (6379), Seq (5341), MailHog (8025)
│   └── init-db.sql                            <-- Kịch bản khởi tạo mở rộng UUID và cấu hình ban đầu cho PostgreSQL
│
├── backend/
│   ├── CulinaryBlog.sln                       <-- Solution chuẩn Visual Studio
│   ├── CulinaryBlog.slnx                      <-- Solution định dạng mới hiện đại của .NET 10
│   ├── Dockerfile                             <-- File đóng gói container Backend .NET 10 đa tầng (Multi-stage build)
│   │
│   ├── src/
│   │   ├── Domain/                            <-- TẦNG DOMAIN: Thuần C# BCL, không phụ thuộc framework ngoài (CONS-001)
│   │   │   ├── CulinaryBlog.Domain.csproj
│   │   │   ├── Common/
│   │   │   │   ├── BaseEntity.cs              <-- Thực thể cơ sở: Id (Guid), CreatedAt, UpdatedAt, IsDeleted, RowVersion (byte[])
│   │   │   │   └── Interfaces/
│   │   │   │       ├── IRepository.cs          <-- Generic Repository interface
│   │   │   │       ├── ICategoryRepository.cs  <-- Interface đặc thù cho danh mục (đếm món, phân trang slug)
│   │   │   │       └── IUnitOfWork.cs          <-- Quản lý transaction và Commit đồng bộ
│   │   │   ├── Entities/
│   │   │   │   ├── Category.cs                <-- Thực thể Danh mục (Name, Slug, Description, ImageUrl, OrderIndex)
│   │   │   │   ├── Recipe.cs                  <-- Thực thể Công thức (Title, Slug, Prep/CookTime, Servings, Difficulty, Status)
│   │   │   │   ├── RecipeChildren.cs          <-- Thực thể con: RecipeStep, RecipeIngredient, RecipeImage
│   │   │   │   └── Identity.cs                <-- Thực thể người dùng & phân quyền Identity mở rộng
│   │   │   ├── ValueObjects/
│   │   │   │   └── RecipeNutrition.cs         <-- Value Object thông tin dinh dưỡng (Calories, Fat, Carbs, Protein)
│   │   │   ├── Enums/
│   │   │   │   ├── RecipeDifficulty.cs        <-- Easy (1), Medium (2), Hard (3)
│   │   │   │   └── RecipeStatus.cs            <-- Draft (0), Pending (1), Published (2), Archived (3)
│   │   │   ├── Exceptions/
│   │   │   │   ├── DomainException.cs         <-- Ngoại lệ cơ sở cho toàn bộ tầng nghiệp vụ
│   │   │   │   ├── EntityNotFoundException.cs  <-- Ngoại lệ không tìm thấy bản ghi (Map HTTP 404)
│   │   │   │   ├── CategoryNotEmptyException.cs<-- Ngoại lệ cấm xóa danh mục còn công thức (Map HTTP 409)
│   │   │   │   ├── ConcurrencyConflictException.cs <-- Ngoại lệ xung đột phiên bản RowVersion (Map HTTP 409)
│   │   │   │   └── BusinessRuleValidationException.cs <-- Vi phạm quy tắc nghiệp vụ cốt lõi (Map HTTP 422)
│   │   │   └── Interfaces/
│   │   │       ├── IRecipeRepository.cs       <-- Interface truy vấn chuyên sâu cho công thức
│   │   │       └── Interfaces.cs              <-- Giao diện ngữ cảnh người dùng ICurrentUser
│   │   │
│   │   ├── Application/                       <-- TẦNG APPLICATION: Use cases, CQRS với MediatR, FluentValidation
│   │   │   ├── CulinaryBlog.Application.csproj
│   │   │   ├── DependencyInjection.cs         <-- Đăng ký MediatR, FluentValidation và Pipeline Behaviors
│   │   │   ├── Behaviors/
│   │   │   │   ├── ValidationBehavior.cs      <-- Tự động kiểm tra FluentValidation trước khi vào Handler
│   │   │   │   ├── LoggingBehavior.cs         <-- Ghi log có cấu trúc thời gian thực thi từng Request
│   │   │   │   └── CachingBehaviors.cs        <-- Pipeline cache tự động cho các truy vấn dữ liệu
│   │   │   ├── Common/
│   │   │   │   ├── Exceptions/AppExceptions.cs <-- Định nghĩa các mã lỗi hệ thống và lỗi xác thực
│   │   │   │   ├── Helpers/
│   │   │   │   │   ├── SlugHelper.cs          <-- Chuẩn hóa chuỗi tiếng Việt có dấu sang URL Slug chuẩn SEO
│   │   │   │   │   └── RecipeAuthorizationHelper.cs <-- Kiểm tra quyền tác giả hoặc quyền Admin với bài viết
│   │   │   │   ├── Interfaces/
│   │   │   │   │   └── ICacheService.cs       <-- Hợp đồng dịch vụ Cache phân tán
│   │   │   │   └── Models/
│   │   │   │       └── PagedResult.cs         <-- Cấu trúc phân trang chuẩn (Items, TotalCount, Page, PageSize, TotalPages)
│   │   │   └── Features/
│   │   │       ├── Categories/                <-- Phân hệ Danh mục (FR-CAT)
│   │   │       │   ├── Commands/
│   │   │       │   │   ├── CreateCategory/    <-- Tạo danh mục mới + sinh Slug SEO + xóa Cache
│   │   │       │   │   ├── UpdateCategory/    <-- Cập nhật danh mục + kiểm tra RowVersion Concurrency
│   │   │       │   │   └── DeleteCategory/    <-- Xóa mềm danh mục + chặn 409 Conflict nếu có công thức
│   │   │       │   ├── Queries/
│   │   │       │   │   ├── GetCategories/     <-- Lấy tất cả danh mục (Redis Cache 30 phút, đếm bài viết)
│   │   │       │   │   └── GetCategoryBySlug/ <-- Lấy chi tiết danh mục kèm danh sách công thức phân trang
│   │   │       │   └── DTOs/                  <-- CategoryDto, CategoryDetailDto, RecipeSummaryDto
│   │   │       ├── Recipes/                   <-- Phân hệ Công thức (FR-RCP & FR-SRCH)
│   │   │       │   ├── Commands/
│   │   │       │   │   ├── CreateRecipe/      <-- Tạo công thức kèm các bước, nguyên liệu và thông tin dinh dưỡng
│   │   │       │   │   ├── UpdateRecipe/      <-- Cập nhật công thức toàn diện kèm kiểm tra quyền sở hữu
│   │   │       │   │   ├── DeleteRecipe/      <-- Xóa mềm công thức (IsDeleted = true)
│   │   │       │   │   ├── PublishRecipe/     <-- Xuất bản công thức (Status = Published)
│   │   │       │   │   ├── UnpublishRecipe/   <-- Rút bài công thức về bản nháp (Status = Draft)
│   │   │       │   │   └── ArchiveRecipe/     <-- Lưu trữ công thức vào kho (Status = Archived)
│   │   │       │   ├── Queries/
│   │   │       │   │   ├── GetRecipes/        <-- Tìm kiếm & lọc đa tiêu chí (SearchTerm, Category, Difficulty, Time, Sort)
│   │   │       │   │   └── GetRecipeBySlug/   <-- Lấy chi tiết công thức đầy đủ các thông tin hiển thị
│   │   │       │   └── DTOs/                  <-- RecipeDto, RecipeDetailDto, RecipeSummaryDto
│   │   │       └── Auth/                      <-- Phân hệ Xác thực (FR-AUTH)
│   │   │           ├── Commands/              <-- Login, Register, GoogleLogin, RefreshToken, Logout, UpdateProfile
│   │   │           ├── Queries/               <-- GetMeQuery lấy thông tin cá nhân
│   │   │           ├── DTOs/                  <-- AuthDtos chứa Token, UserProfile
│   │   │           └── Services/              <-- Giao diện dịch vụ bảo mật IAuthServices
│   │   │
│   │   ├── Infrastructure/                    <-- TẦNG INFRASTRUCTURE: EF Core, PostgreSQL, Redis, Seeder, Dịch vụ ngoài
│   │   │   ├── CulinaryBlog.Infrastructure.csproj
│   │   │   ├── DependencyInjection.cs         <-- Đăng ký DbContext, Redis, Identity, Hangfire, Repositories
│   │   │   ├── Data/
│   │   │   │   ├── CulinaryBlogDbContext.cs   <-- Quản lý DbSets, Owned Entities, Bộ lọc Soft Delete toàn cục
│   │   │   │   ├── Configurations/            <-- Cấu hình Fluent API bảng Recipe, Steps, Ingredients, Images
│   │   │   │   ├── Interceptors/
│   │   │   │   │   └── AuditInterceptor.cs    <-- Tự động cập nhật CreatedAt, UpdatedAt khi SaveChanges
│   │   │   │   └── Seeders/
│   │   │   │       └── CulinaryBlogSeeder.cs  <-- BỘ SINH DỮ LIỆU TỰ ĐỘNG CHÍNH (Bogus, SEED=42, Idempotent)
│   │   │   ├── Migrations/                    <-- Lịch sử di chuyển schema CSDL trên PostgreSQL
│   │   │   ├── Repositories/
│   │   │   │   ├── BaseRepository.cs          <-- Hiện thực Generic Repository cho các thực thể kế thừa BaseEntity
│   │   │   │   ├── CategoryRepository.cs      <-- Hiện thực ICategoryRepository với truy vấn đếm công thức tối ưu
│   │   │   │   ├── RecipeRepository.cs        <-- Hiện thực IRecipeRepository với Eager Loading quan hệ 1-N
│   │   │   │   └── UnitOfWork.cs              <-- Hiện thực IUnitOfWork điều phối Transaction
│   │   │   └── Services/
│   │   │       ├── RedisCacheService.cs       <-- Triển khai ICacheService qua StackExchange.Redis
│   │   │       ├── JwtService.cs              <-- Sinh và thẩm định tính hợp lệ của JSON Web Token
│   │   │       ├── CurrentUserService.cs      <-- Trích xuất thông tin UserId/Role từ ClaimsPrincipal hiện tại
│   │   │       ├── GoogleTokenValidator.cs    <-- Xác thực Google OAuth ID Token
│   │   │       ├── MinioFileStorageService.cs <-- Dịch vụ lưu trữ file tương thích S3 (MinIO)
│   │   │       └── WelcomeEmailDispatcher.cs  <-- Gửi email chào mừng nền qua Hangfire & MailHog
│   │   │
│   │   └── Presentation/                      <-- TẦNG PRESENTATION: ASP.NET Core Minimal APIs (.NET 10)
│   │       ├── CulinaryBlog.API.csproj
│   │       ├── Program.cs                     <-- Host entry point: Cấu hình Middleware, Cache, Scalar, Endpoint mapping
│   │       ├── Endpoints/
│   │       │   ├── CategoriesEndpoints.cs     <-- Định nghĩa Minimal API endpoints cho FR-CAT (/api/v1/categories)
│   │       │   ├── RecipesEndpoints.cs        <-- Định nghĩa Minimal API endpoints cho FR-RCP & FR-SRCH (/api/v1/recipes)
│   │       │   ├── AuthEndpoints.cs           <-- Định nghĩa Minimal API endpoints cho FR-AUTH (/api/v1/auth)
│   │       │   └── HealthEndpoints.cs         <-- Tuyến kiểm tra sức khỏe ứng dụng (/health, /health/ready, /health/live)
│   │       └── Middlewares/
│   │           ├── CorrelationIdMiddleware.cs <-- Tự động gắn và lưu vết X-Correlation-ID
│   │           └── GlobalExceptionMiddleware.cs <-- Xử lý lỗi tập trung chuẩn RFC 7807 (application/problem+json)
│   │
│   └── tests/                                 <-- TOÀN BỘ BỘ KIỂM THỬ TỰ ĐỘNG (163 TESTS PASSED)
│       ├── CulinaryBlog.Domain.Tests/         <-- [16 Tests PASSED] Kiểm thử Domain Entities, Value Objects, Business Invariants
│       ├── CulinaryBlog.Application.Tests/    <-- [72 Tests PASSED] Kiểm thử CQRS Handlers, Validators (Recipes, Search, Auth)
│       ├── CulinaryBlog.Infrastructure.Tests/ <-- [29 Tests PASSED] Kiểm thử Seeder (Tất định, Idempotent), Repositories, UnitOfWork
│       ├── CulinaryBlog.UnitTests/            <-- [41 Tests PASSED] Kiểm thử Category Handlers, Validators, SlugHelper, Exceptions, RFC 7807 Middleware
│       ├── CulinaryBlog.API.IntegrationTests/ <-- [5 Tests PASSED] Kiểm thử WebApplicationFactory end-to-end Minimal APIs Category
│       └── CulinaryBlog.Api.Tests/            <-- Bộ kiểm thử tích hợp Auth Flow với Live Database
│
└── frontend/                                  <-- GIAO DIỆN CLIENT: Next.js 15 App Router + TailwindCSS
    ├── package.json                           <-- Quản lý dependencies (Next 15.0.3, React 18, React Query 5, Zod, Lucide)
    ├── tailwind.config.ts                     <-- Cấu hình hệ màu và thiết kế giao diện
    ├── tsconfig.json                          <-- Cấu hình TypeScript
    └── src/
        ├── auth.ts                            <-- Cấu hình NextAuth v5
        ├── app/
        │   ├── layout.tsx                     <-- Layout gốc bao bọc SiteHeader, React Query Providers và Toast Container
        │   ├── page.tsx                       <-- Trang chủ giới thiệu hệ thống
        │   ├── globals.css                    <-- Biến CSS giao diện và tiện ích Tailwind
        │   ├── providers.tsx                  <-- Bọc QueryClientProvider cho State Management
        │   ├── categories/
        │   │   ├── page.tsx                   <-- Trang Public: Hiển thị danh mục dạng Grid Card kèm số lượng món
        │   │   └── [slug]/page.tsx            <-- Trang Public: Xem chi tiết danh mục và danh sách công thức thuộc danh mục
        │   ├── recipes/
        │   │   ├── page.tsx                   <-- Trang Public: Khung hiển thị danh sách công thức & thanh tìm kiếm
        │   │   └── [slug]/page.tsx            <-- Trang Public: Khung hiển thị chi tiết công thức
        │   ├── dashboard/
        │   │   └── categories/page.tsx        <-- Trang Admin: Bảng CRUD danh mục, tìm kiếm danh mục, phân trang
        │   ├── login/page.tsx                 <-- Trang Đăng nhập hệ thống (Email/Password & Google Login)
        │   ├── register/page.tsx              <-- Trang Đăng ký tài khoản tác giả / độc giả
        │   └── profile/page.tsx               <-- Trang xem và chỉnh sửa thông tin cá nhân
        ├── components/
        │   ├── site-header.tsx                <-- Thanh điều hướng chính (Logo, Categories, Recipes, Auth Button)
        │   ├── categories/
        │   │   ├── CategoryCard.tsx           <-- Component thẻ danh mục hiển thị hình ảnh, tên, mô tả và badge số lượng
        │   │   ├── CategoryFormModal.tsx      <-- Modal form tạo mới / chỉnh sửa danh mục kèm validate Zod
        │   │   └── DeleteCategoryModal.tsx    <-- Modal hộp thoại cảnh báo và xác nhận xóa danh mục
        │   ├── recipes/
        │   │   └── RecipeCard.tsx             <-- Component thẻ công thức hiển thị thời gian, độ khó, tác giả, ảnh bìa
        │   └── common/
        │       └── Toast.tsx                  <-- Hệ thống thông báo toast phản hồi thao tác người dùng
        ├── features/auth/                     <-- Phân hệ Xác thực phía Client
        │   ├── api.ts                         <-- Client gọi API Auth Backend (/register, /login, /refresh, /logout)
        │   ├── google-button.tsx              <-- Nút đăng nhập Google OAuth
        │   ├── hooks.ts                       <-- Custom React hooks quản lý phiên đăng nhập
        │   ├── schemas.ts                     <-- Lược đồ xác thực biểu mẫu đăng ký / đăng nhập với Zod
        │   ├── token-store.ts                 <-- Lưu trữ Access Token trong bộ nhớ client an toàn
        │   └── types.ts                       <-- Khai báo Type TypeScript cho User, AuthState, Tokens
        └── lib/
            ├── api-client.ts                  <-- Wrapper cấu hình Fetch Client tự động đính kèm Bearer Token & bắt lỗi
            ├── services/
            │   └── category-service.ts        <-- Dịch vụ gọi API danh mục kết nối trực tiếp Backend (/api/v1/categories)
            └── types/
                └── category.ts                <-- Interface TypeScript: Category, CategoryDetail, RecipeSummary
```

---

## 4. Luồng thực thi chi tiết (Execution Flows)

### 4.1. Luồng Khởi tạo & Seeding Dữ liệu Tự động (Seeding Lifecycle Flow)

Khi lập trình viên gõ lệnh `dotnet run` tại thư mục [Presentation/](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/):

```
[dotnet run]
     │
     ▼
[1. Program.cs - Bootstrap Host]
     │  - Cấu hình Serilog Structured Logging, Rate Limiter (100 req/min), CORS
     │  - Đăng ký DI: AddApplication(), AddInfrastructure()
     │  - Kiểm tra điều kiện: if (app.Environment.IsDevelopment())
     │
     ▼
[2. Khởi tạo Scope DI tạm thời]
     │  - using var scope = app.Services.CreateScope();
     │  - Lấy CulinaryBlogDbContext từ scope
     │  - await db.Database.MigrateAsync(); (Áp dụng các bản Migration mới nhất lên PostgreSQL)
     │
     ▼
[3. Kích hoạt CulinaryBlogSeeder.SeedAsync]
     │  - Đặt Randomizer.Seed = new Random(42); (Cố định chuỗi giả ngẫu nhiên tất định)
     │  - Mở Async Scope con độc lập để resolve DbContext, UserManager, RoleManager
     │
     ▼
[4. Kiểm tra Roles & Authors]
     │  - Duyệt mảng ["Admin", "Author", "Reader"] -> Tạo Role nếu chưa có trong DB
     │  - Bogus sinh 10 ApplicationUser (locale "vi") với mật khẩu chuẩn băm PBKDF2 ("Author@123456")
     │  - Gán Role "Author" cho các tài khoản vừa tạo
     │
     ▼
[5. Kiểm tra Idempotency & Nạp 25 Categories]
     │  - Kiểm tra: if (await db.Recipes.CountAsync() >= 100) return; -> Dừng ngay nếu DB đã đủ dữ liệu
     │  - Duyệt 25 CategoryNames -> Sinh Slug SEO tiếng Việt không dấu -> Thêm vào db.Categories
     │  - await db.SaveChangesAsync(); (Lưu để sinh Id khóa chính thật)
     │
     ▼
[6. Tạo 100 Recipes & Quan hệ 1-N lồng ghép]
     │  - Tính toán số lượng cần nạp: recipesNeeded = 100 - count
     │  - Phân bổ ngẫu nhiên CategoryId và AuthorId
     │  - Gán Value Object Nutrition (Calories, Fat, Carbs, Protein)
     │  - Với mỗi Recipe:
     │      + Thêm 5–8 RecipeStep (StepNumber = 1..N, thời gian timer tăng dần)
     │      + Lấy 10–15 nguyên liệu từ IngredientPool bằng thuật toán chọn không trùng tên
     │      + Tạo liên kết hình ảnh RecipeImage (đánh dấu IsPrimary = true)
     │  - await db.Recipes.AddRangeAsync(recipes);
     │  - await db.SaveChangesAsync();
     │
     ▼
[7. Giải phóng Scope & Bật Web Server]
        - Khối using kết thúc -> Giải phóng hoàn toàn DbContext và ChangeTracker khỏi RAM
        - Web API chuyển sang trạng thái sẵn sàng lắng nghe HTTP Request tại http://localhost:5000
```

---

### 4.2. Luồng Tìm kiếm & Lọc Công thức Nâng cao (FR-SRCH & FR-RCP Execution Flow)

Khi người dùng thực hiện tìm kiếm công thức hoặc Client gửi yêu cầu:  
`GET /api/v1/recipes?searchTerm=pho&categoryId={guid}&difficulty=Medium&maxTotalTimeMinutes=60&sortBy=newest&page=1&pageSize=10`

```
[HTTP Request: GET /api/v1/recipes]
     │
     ▼
[1. Middleware Pipeline]
     │  - CorrelationIdMiddleware: Sinh hoặc truyền tiếp X-Correlation-ID
     │  - GlobalExceptionMiddleware: Lắng nghe và bọc bắt ngoại lệ RFC 7807
     │  - RateLimiter: Kiểm tra ngưỡng 100 req/min theo IP
     │  - OutputCache Middleware: Kiểm tra Redis Cache theo các Query Parameters (VaryByQuery)
     │    + Nếu Cache HIT: Trả về ngay PagedResult JSON (HTTP 200) mà không gọi Database.
     │    + Nếu Cache MISS: Tiếp tục chuyển tiếp vào Controller / Endpoint Handler.
     │
     ▼
[2. RecipesEndpoints.GetRecipes]
     │  - Map các tham số truy vấn vào GetRecipesQuery qua [AsParameters]
     │  - Gửi Query qua MediatR: await mediator.Send(query);
     │
     ▼
[3. MediatR Pipeline Behaviors]
     │  - LoggingBehavior: Ghi log bắt đầu xử lý GetRecipesQuery
     │  - ValidationBehavior: Kiểm tra tính hợp lệ của Page, PageSize (>= 1)
     │
     ▼
[4. GetRecipesQueryHandler.Handle]
     │  - Khởi tạo queryable = recipeRepository.GetQueryable().AsNoTracking()
     │  - Eager Loading: .Include(r => r.Category).Include(r => r.Author).Include(r => r.Images)
     │
     ▼
[5. Áp dụng Bộ lọc Bảo mật (Authorization Scope)]
     │  - Đọc currentUser.UserId:
     │    + Khách (Guest - chưa đăng nhập): Chỉ lọc bài viết có Status == RecipeStatus.Published.
     │    + Tác giả (Author đã đăng nhập): Lọc bài có Status == RecipeStatus.Published HOẶC AuthorId == currentUser.UserId.
     │
     ▼
[6. Áp dụng Bộ lọc Nghiệp vụ (Search & Filter Criteria)]
     │  - SearchTerm: .Where(r => r.Title.ToLower().Contains(search) || r.Description.ToLower().Contains(search))
     │  - CategoryId: .Where(r => r.CategoryId == categoryId)
     │  - Difficulty: .Where(r => r.Difficulty == difficulty)
     │  - MaxTotalTimeMinutes: .Where(r => (r.PrepTimeMinutes + r.CookTimeMinutes) <= maxTotalTimeMinutes)
     │
     ▼
[7. Sắp xếp dữ liệu (Sorting)]
     │  - "newest"    -> .OrderByDescending(r => r.CreatedAt) [Mặc định]
     │  - "oldest"    -> .OrderBy(r => r.CreatedAt)
     │  - "time_asc"  -> .OrderBy(r => r.PrepTimeMinutes + r.CookTimeMinutes)
     │  - "time_desc" -> .OrderByDescending(r => r.PrepTimeMinutes + r.CookTimeMinutes)
     │
     ▼
[8. Phân trang & Chiếu sang DTO (Pagination & Projection)]
     │  - Đếm tổng số bản ghi thỏa điều kiện: totalCount = await queryable.CountAsync()
     │  - Lấy trang dữ liệu: .Skip((page - 1) * pageSize).Take(pageSize)
     │  - Chiếu sang RecipeSummaryDto (chọn ảnh Primary ThumbnailUrl hoặc OriginalUrl)
     │  - Đóng gói PagedResult<RecipeSummaryDto>(items, totalCount, page, pageSize)
     │
     ▼
[9. Ghi Cache & Trả về Client]
        - OutputCache lưu kết quả vào Redis với TTL 5 phút, gắn thẻ Tag "recipes"
        - Trả về HTTP 200 OK kèm payload kết quả phân trang
```

---

### 4.3. Luồng Thay đổi Dữ liệu & Xóa Cache Phân tán (Mutation & Invalidation Flow)

Khi tác giả hoặc Quản trị viên thực hiện chỉnh sửa / xuất bản công thức (`PATCH /api/v1/recipes/{id}/publish`):

```
[HTTP Request: PATCH /api/v1/recipes/{id}/publish]
     │
     ▼
[1. Authentication & Authorization Middleware]
     │  - Thẩm định JWT Bearer Token -> Xác nhận danh tính ClaimsPrincipal
     │  - Trích xuất UserId tác giả
     │
     ▼
[2. PublishRecipeCommandHandler]
     │  - Truy vấn Recipe từ RecipeRepository
     │  - Kiểm tra quyền sở hữu (AuthorId == currentUser.UserId hoặc Admin)
     │  - Chuyển trạng thái: recipe.Status = RecipeStatus.Published
     │  - Lưu thay đổi: await unitOfWork.SaveChangesAsync()
     │
     ▼
[3. Cache Eviction qua IOutputCacheStore]
     │  - Kích hoạt lệnh xóa cache theo Tag:
     │    await cacheStore.EvictByTagAsync("recipes", cancellationToken);
     │  - Toàn bộ danh sách công thức, kết quả tìm kiếm đã cache trước đó lập tức bị vô hiệu hóa
     │
     ▼
[4. Phản hồi Client]
        - Trả về HTTP 200 OK kèm RecipeDto cập nhật
```

---

## 5. Lưu ý kỹ thuật quan trọng khi chỉnh sửa code

### 5.1. Cơ chế Sinh dữ liệu Không Trùng lặp (Unique Pool Strategy)
- Một công thức nấu ăn thực tế không được phép chứa hai dòng nguyên liệu trùng tên.
- **Quy tắc khi chỉnh sửa Seeder:** Tuyệt đối **không** dùng `faker.PickRandom(pool)` trong vòng lặp độc lập.
- **Cách viết chuẩn hiện tại:**
  ```csharp
  var selectedIngredients = ingrFaker.PickRandom(IngredientPool, ingrCount).ToList();
  for (int i = 0; i < selectedIngredients.Count; i++)
  {
      recipe.Ingredients.Add(new RecipeIngredient 
      { 
          Name = selectedIngredients[i],
          Quantity = ingrFaker.Random.Int(1, 500),
          Unit = ingrFaker.PickRandom("g", "ml", "thìa cà phê", "quả", "củ"),
          OrderIndex = i + 1
      });
  }
  ```

### 5.2. Quản lý Bộ nhớ Change Tracker của DbContext
- Trong quá trình Seeding 100 Recipes cùng hàng trăm Steps và Ingredients, `CulinaryBlogDbContext` lưu vết trong Change Tracker. Nếu DbContext này tồn tại quá lâu ở phạm vi mở rộng, RAM máy chủ sẽ bị phình to.
- **Quy tắc:** Luôn gói thao tác Seed bên trong `using var scope = serviceProvider.CreateScope();`. Sau khi `SeedAsync` hoàn tất và ra khỏi khối using, Garbage Collector sẽ lập tức giải phóng bộ nhớ thực thể.

### 5.3. Tuân thủ Ràng buộc Soft Delete (Global Query Filters)
- Hệ thống kích hoạt xóa mềm tự động bằng cấu hình `builder.Entity<T>().HasQueryFilter(e => !e.IsDeleted)`.
- Khi thực hiện kiểm tra tính tồn tại hoặc thống kê:
  - Nếu muốn kiểm tra số lượng bản ghi **thực tế trong cơ sở dữ liệu** (bao gồm cả bản ghi đã xóa mềm): Bắt buộc dùng `.IgnoreQueryFilters()`.
  - Nếu truy vấn dữ liệu phục vụ hiển thị cho người dùng: Giữ nguyên truy vấn mặc định của EF Core.

### 5.4. Kiểm soát Cạnh tranh Lạc quan với `RowVersion`
- Tất cả các thực thể kế thừa [BaseEntity.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Domain/Common/BaseEntity.cs) đều được trang bị trường Concurrency Token `byte[] RowVersion`.
- Trong [RecipeConfiguration.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Configurations/RecipeConfiguration.cs), trường này được khai báo `builder.Property(r => r.RowVersion).IsRowVersion()`.
- Khi gọi lệnh cập nhật qua API (`PUT /api/v1/categories/{id}` hoặc `PUT /api/v1/recipes/{id}`), Client **bắt buộc** phải gửi kèm `RowVersion` hiện hành. Nếu xảy ra xung đột cập nhật đồng thời, [GlobalExceptionMiddleware.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Middlewares/GlobalExceptionMiddleware.cs) sẽ bắt ngoại lệ và trả về mã lỗi chuẩn `409 Conflict`.

### 5.5. Thuật toán Chuẩn hóa Slug SEO Tiếng Việt Không Dấu
- Sử dụng tiện ích tập trung tại [SlugHelper.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Common/Helpers/SlugHelper.cs):
  - Chuẩn hóa Unicode Normalization Form D để tách rời dấu thanh và ký tự gốc.
  - Loại bỏ các ký tự dấu qua bộ lọc `NonSpacingMark`.
  - Chuyển `đ`/`Đ` thành `d`/`D`.
  - Thay thế toàn bộ khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang (`-`).
  - Chuyển về chữ thường (lowercase) và cắt tỉa dấu gạch dư thừa ở hai đầu chuỗi.

### 5.6. Chiến lược Quản lý Bộ nhớ Đệm Phân tán (Redis Cache Invalidation)
- Danh mục công khai được cache theo key cố định `categories:all` với thời gian sống (TTL) 30 phút. Bất kỳ lệnh tạo mới, cập nhật hoặc xóa danh mục nào cũng sẽ tự động gọi `_cacheService.RemoveAsync("categories:all")`.
- Danh sách công thức và kết quả tìm kiếm được cache qua ASP.NET Core Output Caching với Redis store, gắn thẻ thống nhất Tag `"recipes"`. Mọi thao tác Mutation (Thêm/Sửa/Xóa/Publish/Archive công thức) đều kích hoạt xóa cache toàn bộ qua `IOutputCacheStore.EvictByTagAsync("recipes")`.

---

## 6. Bản đồ kiểm thử tự động (Automated Test Suite Map)

Toàn bộ hệ thống kiểm thử được xây dựng theo tiêu chuẩn công nghiệp với **xUnit, FluentAssertions, Moq, và Microsoft.AspNetCore.Mvc.Testing (WebApplicationFactory)**. 100% các bài kiểm thử đơn vị, kiến trúc và tích hợp đều chạy hoàn toàn độc lập trong bộ nhớ (In-Memory Database & Distributed Memory Cache), không yêu cầu khởi chạy Docker hay máy chủ bên ngoài để vượt qua kiểm thử.

```
backend/tests/
│
├── CulinaryBlog.Domain.Tests/                  <-- [16 Tests PASSED - 100% GREEN]
│   ├── UnitTest1.cs
│   └── Entities/
│       └── RecipeDomainTests.cs                <-- 16 Tests: Kiểm thử tính toàn vẹn nghiệp vụ Domain,
│                                                    bảo vệ bất biến thực thể Recipe, tính toán thời gian,
│                                                    ràng buộc số lượng nguyên liệu và bước thực hiện.
│
├── CulinaryBlog.Application.Tests/             <-- [72 Tests PASSED - 100% GREEN]
│   ├── CreateRecipeCommandHandlerTests.cs      <-- Kiểm thử logic tạo công thức, sinh slug SEO, validate đầu vào
│   ├── UpdateRecipeCommandHandlerTests.cs      <-- Kiểm thử cập nhật công thức, thay thế steps/ingredients, kiểm tra quyền
│   ├── DeleteRecipeCommandHandlerTests.cs      <-- Kiểm thử xóa mềm công thức, bảo vệ bài viết của tác giả khác
│   ├── PublishRecipeCommandHandlerTests.cs     <-- Kiểm thử xuất bản bài viết và điều kiện chuyển trạng thái
│   ├── UnpublishRecipeCommandHandlerTests.cs   <-- Kiểm thử rút bài viết về trạng thái nháp
│   ├── ArchiveRecipeCommandHandlerTests.cs     <-- Kiểm thử lưu trữ công thức
│   ├── GetRecipeBySlugQueryHandlerTests.cs     <-- Kiểm thử truy vấn chi tiết công thức, quyền xem bài nháp
│   ├── GetRecipesQueryHandlerTests.cs          <-- Kiểm thử tìm kiếm đa tiêu chí, phân quyền xem bài viết,
│   │                                               lọc theo danh mục, độ khó, thời gian nấu và sắp xếp
│   ├── UnitTest1.cs
│   └── Auth/
│       ├── RegisterCommandHandlerTests.cs      <-- Kiểm thử đăng ký người dùng mới, trùng email, mã hóa mật khẩu
│       ├── LoginCommandHandlerTests.cs         <-- Kiểm thử đăng nhập, sai mật khẩu, khóa tài khoản
│       ├── RefreshTokenCommandHandlerTests.cs  <-- Kiểm thử cấp mới JWT qua refresh token, token hết hạn
│       ├── GoogleAndProfileTests.cs            <-- Kiểm thử Google OAuth login và cập nhật hồ sơ cá nhân
│       └── AuthValidatorsTests.cs              <-- Kiểm thử FluentValidation cho toàn bộ Request DTO xác thực
│
├── CulinaryBlog.Infrastructure.Tests/          <-- [29 Tests PASSED - 100% GREEN]
│   ├── Persistence/Seeders/
│   │   └── CulinaryBlogSeederTests.cs          <-- 19 Tests: Kiểm chứng cơ chế tất định SEED=42, Idempotency,
│   │                                               ràng buộc 1-N lồng ghép, tính duy nhất nguyên liệu
│   └── Repositories/
│       └── RepositoryTests.cs                  <-- 10 Tests: Kiểm thử Generic BaseRepository CRUD, Soft Delete filter,
│                                                   CategoryRepository đếm công thức active và UnitOfWork Commit
│
├── CulinaryBlog.UnitTests/                     <-- [41 Tests PASSED - 100% GREEN]
│   ├── CategoryValidatorsTests.cs              <-- 10 Tests: FluentValidation rules cho Create/Update Category, XSS
│   ├── CategoryHandlersTests.cs                <-- 9 Tests: MediatR CQRS Commands & Queries cho phân hệ Danh mục
│   ├── SlugHelperTests.cs                      <-- 8 Tests: Thuật toán khử dấu tiếng Việt Unicode & chuẩn hóa URL
│   ├── Domain/
│   │   └── DomainExceptionTests.cs             <-- 8 Tests: Ngoại lệ thuần C# BCL (CONS-001)
│   └── Middlewares/
│       └── GlobalExceptionMiddlewareTests.cs   <-- 6 Tests: Ánh xạ mã lỗi HTTP 400, 404, 409, 500 kèm RFC 7807
│
└── CulinaryBlog.API.IntegrationTests/          <-- [5 Tests PASSED - 100% GREEN]
    ├── Fixtures/
    │   └── CustomWebApplicationFactory.cs      <-- TestServer cô lập (InMemory EF Core, Distributed Memory Cache, Mock Hangfire)
    └── Endpoints/
        └── CategoryEndpointsTests.cs           <-- 5 Tests: GET /categories (Thứ tự OrderIndex, Đếm bài, Cache Redis),
                                                    GET /categories/{slug} (Phân trang, Problem Details 404)
```

---

### Bảng Thống Kê Kết Quả Chạy Kiểm Thử Tự Động (`dotnet test`):

| Dự án Kiểm thử (Test Project) | Tầng kiểm thử | Số bài kiểm thử | Trạng thái | Thời gian thực thi |
|---|---|:---:|:---:|:---:|
| **`CulinaryBlog.Domain.Tests`** | Domain Layer (Unit) | **16 / 16** | **100% PASSED** | ~0.4 giây |
| **`CulinaryBlog.Application.Tests`** | Application Layer (CQRS & Validation) | **72 / 72** | **100% PASSED** | ~2.0 giây |
| **`CulinaryBlog.Infrastructure.Tests`** | Infrastructure Layer (Seeder & Repos) | **29 / 29** | **100% PASSED** | ~21 giây |
| **`CulinaryBlog.UnitTests`** | Presentation & Cross-Cutting (Unit) | **41 / 41** | **100% PASSED** | ~0.4 giây |
| **`CulinaryBlog.API.IntegrationTests`** | API Endpoints (Integration E2E) | **5 / 5** | **100% PASSED** | ~2.0 giây |
| **TỔNG CỘNG HỆ THỐNG** | **Toàn diện 3 tầng kiến trúc** | **163 / 163** | **100% GREEN** | **~26 giây** |

> **Ghi chú về kiểm thử phụ thuộc môi trường:** Dự án `CulinaryBlog.Api.Tests` là bộ kiểm thử tích hợp chuyên biệt của phân hệ Xác thực (`AuthFlowTests`), được thiết kế để kiểm tra kết nối mạng thực tế với container PostgreSQL vật lý (Port 5432) và Hangfire storage khi khởi chạy qua Docker Compose. Bộ kiểm thử này được chạy riêng biệt trong môi trường kiểm thử tích hợp chuyên dụng.
