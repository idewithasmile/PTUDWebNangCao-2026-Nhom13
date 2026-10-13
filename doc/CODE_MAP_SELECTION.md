# 🗺️ BẢN ĐỒ TRA CỨU MÃ NGUỒN & VỊ TRÍ CHỨC NĂNG (DEV CODE MAP)
> **Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
> **Nhánh làm việc:** `2312719-Phuoc/Tuan-5`  
> **Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
> **Vai trò:** Technical Lead & Core Developer  
> **Cập nhật mốc:** Tuần 5 — Hoàn thiện Toàn diện Bảo mật, API Spec/Versioning, Phân hệ Danh mục (FR-CAT) & Frontend Types  

---

## 1. Mốc trạng thái hiện tại (Current Checkpoint)

- **Đã hoàn thành 100%:**
  - [x] **Cài đặt & Cấu hình Bảo mật Toàn diện:**
    - **CORS (NFR-SEC-005):** Cấu hình chính sách nghiêm ngặt qua `Cors:AllowedOrigins` (`http://localhost:3000`), kích hoạt `AllowCredentials` truyền nhận Cookie an toàn giữa Next.js và .NET API, giới hạn phương thức (`GET, POST, PUT, PATCH, DELETE, OPTIONS`), phơi bày response headers an toàn (`X-Correlation-ID`, `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).
    - **Kiến trúc Giới hạn Tần suất Yêu cầu Hai Tầng (Two-Tier Rate Limiting - NFR-SEC-003):** 
      - Tầng ứng dụng ASP.NET Core phân vùng thông minh theo IP và Endpoint path:
        - Nhóm xác thực (`/api/v1/auth/*`): Tối đa **10 requests/phút/IP** (Sliding Window chống Brute Force).
        - Toàn bộ API chung: Tối đa **100 requests/phút/IP** (Fixed Window).
      - Cơ chế `OnRejected` chuẩn hóa: Thiết lập mã `HTTP 429 Too Many Requests`, tự động tính toán Header `Retry-After`, trả về nội dung lỗi theo chuẩn **RFC 7807 Problem Details** (`type: "RATE_LIMIT_EXCEEDED"`, `detail: "Tần suất yêu cầu vượt quá giới hạn cho phép. Vui lòng thử lại sau..."`).
    - **Xác thực & Phân quyền (Authentication & Authorization - CONS-004, NFR-SEC-006):**
      - Access Token JWT stateless thời hạn 15 phút, khóa bí mật đối xứng `SymmetricSecurityKey`, kiểm tra Lifetime, Issuer, Audience.
      - Refresh Token lưu trữ an toàn trong `HttpOnly; Secure; SameSite=Strict` Cookie với đường dẫn giới hạn `Path=/api/v1/auth`, thời hạn 7 ngày, cơ chế Refresh Token Rotation (RTR) và Reuse Detection.
      - Phân quyền theo vai trò (Role-based Authorization): `AdminPolicy` (`RequireRole("Admin")`), `AuthorPolicy` (`RequireRole("Author", "Admin")`).
      - Kiểm soát quyền sở hữu tài nguyên (Resource Ownership): Tác giả chỉ được thao tác bài viết của chính mình, Admin có toàn quyền.
  - [x] **Sinh Tài liệu Đặc tả API & Phiên bản hóa API (API Versioning):**
    - **API Versioning (CONS-005):** Toàn bộ endpoint được định tuyến cố định theo tiền tố phiên bản `/api/v1/` (`/api/v1/auth`, `/api/v1/categories`, `/api/v1/recipes`).
    - **Định dạng Endpoint Danh mục:** Kiểm tra và đảm bảo 100% endpoint gốc có định dạng chuẩn `GET /api/v1/categories` (xử lý đồng nhất cả URL có dấu gạch chéo `/api/v1/categories/` và không có dấu gạch chéo `/api/v1/categories`).
    - **Đặc tả API Tự động:** Tích hợp OpenAPI native trong .NET 10 (`Microsoft.AspNetCore.OpenApi`) và giao diện tài liệu tương tác Scalar API Reference (`Scalar.AspNetCore`) tại tuyến `/scalar/v1` và `/openapi/v1.json`.
  - [x] **Module Quản lý Danh mục Ẩm thực (FR-CAT - 5 Endpoints Minimal APIs):**
    - `GET /api/v1/categories` (FR-CAT-001): Công khai, Redis Distributed Cache 60 phút (`categories:all`), trả về danh sách kèm số lượng công thức đã xuất bản (`Status == Published && !IsDeleted`).
    - `GET /api/v1/categories/{slug}` (FR-CAT-002): Công khai, phân trang `page` & `pageSize` (tối đa 50), tự động trích xuất JWT Claims (`NameIdentifier`, `Role`), ma trận phân quyền 3 cấp (Guest chỉ thấy bài Published; Author thấy bài Published + bài Draft của mình; Admin thấy toàn bộ bài viết).
    - `POST /api/v1/categories` (FR-CAT-003): Quyền Admin, sinh Slug SEO chuẩn tiếng Việt không dấu, kiểm tra trùng tên danh mục (409 Conflict), tự động xóa cache Redis `categories:all` qua `ICacheInvalidator`.
    - `PUT /api/v1/categories/{id}` (FR-CAT-004): Quyền Admin, kiểm tra Optimistic Concurrency qua `RowVersion` (409 Conflict), bảo toàn tuyệt đối giá trị `Slug` tránh broken link SEO, xóa cache Redis.
    - `DELETE /api/v1/categories/{id}` (FR-CAT-005): Quyền Admin, xóa mềm (`IsDeleted = true`), kiểm tra ràng buộc toàn vẹn dữ liệu: chặn mã lỗi 409 Conflict (`CATEGORY_DELETE_HAS_RECIPES`) nếu danh mục còn công thức hoạt động, xóa cache Redis.
  - [x] **Cài đặt Môi trường, Thư viện & Cấu trúc Dự án Phía Frontend:**
    - Khởi tạo dự án Next.js 15 App Router, React 18/19, TypeScript 5, Tailwind CSS.
    - Cấu hình thư viện quản lý trạng thái & bất đồng bộ: TanStack Query v5 (`@tanstack/react-query`).
    - Cấu hình biểu mẫu & kiểm thực: React Hook Form (`react-hook-form`) kết hợp Zod (`zod`, `@hookform/resolvers`).
    - Cấu hình Icons: `lucide-react`.
    - Tích hợp Auth.js v5 (`next-auth`) cho luồng xác thực Client-Side và Google OAuth PKCE.
    - Cấu hình phông chữ tiếng Việt sắc nét Google Font Inter (`subsets: ['latin', 'vietnamese']`), thẻ `lang="vi"`.
    - Cấu hình API Client (`api-client.ts`) tự động đính kèm `X-Correlation-ID`, xử lý `credentials: 'include'` cho Cookie Refresh Token.
  - [x] **Hệ thống Kiểu dữ liệu TypeScript (TS Types) Phía Frontend:**
    - Cài đặt tập trung tại `frontend/src/types/`:
      - [common.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/common.ts): `ProblemDetails` (RFC 7807), `PagedResult<T>`, `PaginatedResult<T>`, `ApiResponse<T>`.
      - [category.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/category.ts): `CategoryDto`, `CategoryDetailDto`, `CreateCategoryInput`, `UpdateCategoryInput`.
      - [recipe.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/recipe.ts): `RecipeDifficulty`, `RecipeStatus`, `RecipeNutritionDto`, `RecipeStepDto`, `RecipeIngredientDto`, `RecipeImageDto`, `RecipeAuthorSummaryDto`, `RecipeSummaryDto`, `RecipeDetailDto`, `CreateRecipeInput`, `UpdateRecipeInput`, `RecipeFilterParams`, `SearchRecipesParams`.
      - [auth.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/auth.ts): `UserRole`, `UserProfile`, `AuthResponse`, `LoginInput`, `RegisterInput`, `UpdateProfileInput`, `RefreshTokenResponse`.
      - [index.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/index.ts): Barrel export toàn bộ kiểu dữ liệu ra `@/types`.
      - Tương thích ngược: [frontend/src/lib/types/category.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/types/category.ts) tái xuất từ `@/types`.
  - [x] **Đồng bộ Solution & Bộ Kiểm thử Tự động (177/177 Tests Passed - 100% Green):**
    - Đồng bộ đầy đủ 5 test projects vào cả `CulinaryBlog.sln` và `CulinaryBlog.slnx`.
    - `CulinaryBlog.Domain.Tests`: **16/16 tests passed**.
    - `CulinaryBlog.Application.Tests`: **72/72 tests passed**.
    - `CulinaryBlog.Infrastructure.Tests`: **29/29 tests passed**.
    - `CulinaryBlog.UnitTests`: **55/55 tests passed**.
    - `CulinaryBlog.API.IntegrationTests`: **5/5 tests passed**.
    - Chạy toàn diện bộ test qua `dotnet test CulinaryBlog.sln` với thời gian thực thi tối ưu.
    - Frontend build thành công 100% với `npm run build` (0 lỗi TypeScript lint/type check).

---

## 2. Tiêu chuẩn Xây dựng Code Map cho AI (Bộ 5 Quy Tắc Vàng)

Bản đồ mã nguồn dưới đây được thiết kế tuân thủ nghiêm ngặt **Bộ 5 Quy Tắc Vàng của Code Map**:
1. **Quy tắc Khung xương (Skeletal Extraction Rule):** Chỉ lưu giữ định nghĩa cấp cao (tên file, class, interface, method signature, record, types). Loại bỏ triệt để logic thân hàm và thay bằng `...`. Toàn bộ map được bao bọc trong code block YAML (` ```yaml ... ``` `).
2. **Quy tắc Phân tích cú pháp AST (AST-Based Parsing):** Phản ánh đúng quan hệ phân cấp thụt đầu dòng (Indentation) chuẩn hóa: `File -> Class/Interface/Record -> Method/Property`.
3. **Quy tắc Lọc nhiễu nghiêm ngặt (Strict Ignore & Filtering):** Loại bỏ hoàn toàn các thư mục rác, build artifacts (`bin/`, `obj/`, `node_modules/`, `.next/`, `.git/`, lock files).
4. **Quy tắc Ngân sách Token (Token Budget Allocation):** Nén cấu trúc trong khoảng 1.500 – 3.000 tokens, đảm bảo cung cấp góc nhìn toàn cảnh mà không gây tràn context window của mô hình ngôn ngữ.
5. **Quy tắc Đồ thị Phụ thuộc và Xếp hạng (Dependency & Graph Ranking):** Ưu tiên hiển thị các thành phần cốt lõi được tham chiếu nhiều nhất trong kiến trúc (Entities, Repositories, Commands/Queries, Endpoints, DTOs, Types).

---

## 3. Bản đồ Khung xương Toàn diện (Project Code Map - YAML)

```yaml
# ==============================================================================
# PROJECT CODE MAP: CULINARY BLOG (API-DRIVEN ARCHITECTURE)
# Backend: .NET 10 Minimal APIs, Clean Architecture, CQRS (MediatR), PostgreSQL, Redis
# Frontend: Next.js 15 (App Router), TypeScript 5, Tailwind CSS, TanStack Query v5
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. BACKEND - DOMAIN LAYER (src/Domain/ - Pure BCL, CONS-001)
# ------------------------------------------------------------------------------
backend/src/Domain/Common/BaseEntity.cs:
  class BaseEntity:
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public byte[] RowVersion { get; set; }

backend/src/Domain/Entities/Category.cs:
  class Category : BaseEntity:
    public string Name { get; set; }
    public string Slug { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int OrderIndex { get; set; }
    public ICollection<Recipe> Recipes { get; set; }

backend/src/Domain/Entities/Recipe.cs:
  class Recipe : BaseEntity:
    public string Title { get; private set; }
    public string Slug { get; private set; }
    public string Description { get; private set; }
    public string Instructions { get; private set; }
    public int PrepTimeMinutes { get; private set; }
    public int CookTimeMinutes { get; private set; }
    public int Servings { get; private set; }
    public RecipeDifficulty Difficulty { get; private set; }
    public RecipeStatus Status { get; private set; }
    public Guid CategoryId { get; private set; }
    public string AuthorId { get; private set; }
    public RecipeNutrition? Nutrition { get; private set; }
    public ICollection<RecipeStep> Steps { get; }
    public ICollection<RecipeIngredient> Ingredients { get; }
    public ICollection<RecipeImage> Images { get; }
    public static Recipe Create(string title, string slug, string description, string instructions, int prepTimeMinutes, int cookTimeMinutes, int servings, RecipeDifficulty difficulty, Guid categoryId, string authorId) -> Recipe: ...
    public void Publish() -> void: ...
    public void Unpublish() -> void: ...
    public void Archive() -> void: ...
    public void SoftDelete() -> void: ...

backend/src/Domain/Common/Interfaces/ICategoryRepository.cs:
  interface ICategoryRepository : IRepository<Category>:
    Task<List<CategoryDto>> GetAllWithRecipeCountAsync(CancellationToken ct = default): ...
    Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default): ...
    Task<bool> HasActiveRecipesAsync(Guid categoryId, CancellationToken ct = default): ...
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken ct = default): ...

backend/src/Domain/Common/Interfaces/IUnitOfWork.cs:
  interface IUnitOfWork:
    Task<int> SaveChangesAsync(CancellationToken ct = default): ...
    Task BeginTransactionAsync(CancellationToken ct = default): ...
    Task CommitTransactionAsync(CancellationToken ct = default): ...
    Task RollbackTransactionAsync(CancellationToken ct = default): ...

backend/src/Domain/Interfaces/Interfaces.cs:
  interface ICacheable:
    string CacheKey { get; }
    TimeSpan? Expiration { get; }
  interface ICacheInvalidator:
    IEnumerable<string> CacheKeysToInvalidate { get; }
  interface ICurrentUser:
    string? UserId { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }

# ------------------------------------------------------------------------------
# 2. BACKEND - APPLICATION LAYER (src/Application/ - CQRS, MediatR, DTOs)
# ------------------------------------------------------------------------------
backend/src/Application/Features/Categories/DTOs/CategoryDto.cs:
  record CategoryDto(Guid Id, string Name, string Slug, string? Description, string? ImageUrl, int OrderIndex, int RecipeCount, byte[]? RowVersion): ...

backend/src/Application/Features/Categories/Queries/GetCategories/GetCategoriesQuery.cs:
  record GetCategoriesQuery() : IRequest<List<CategoryDto>>, ICacheable:
    public string CacheKey => "categories:all"
    public TimeSpan? Expiration => TimeSpan.FromMinutes(60)

backend/src/Application/Features/Categories/Queries/GetCategories/GetCategoriesQueryHandler.cs:
  class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>:
    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken ct): ...

backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/GetCategoryBySlugQuery.cs:
  record GetCategoryBySlugQuery(string Slug, int Page = 1, int PageSize = 12, string? CurrentUserId = null, bool IsAdmin = false) : IRequest<CategoryDetailResponseDto>: ...

backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/GetCategoryBySlugQueryHandler.cs:
  class GetCategoryBySlugQueryHandler : IRequestHandler<GetCategoryBySlugQuery, CategoryDetailResponseDto>:
    public async Task<CategoryDetailResponseDto> Handle(GetCategoryBySlugQuery request, CancellationToken ct): ...

backend/src/Application/Features/Categories/Commands/CreateCategory/CreateCategoryCommand.cs:
  record CreateCategoryCommand(string Name, string? Description, string? ImageUrl, int OrderIndex = 0) : IRequest<CategoryDto>, ICacheInvalidator:
    public IEnumerable<string> CacheKeysToInvalidate => ["categories:all"]

backend/src/Application/Features/Categories/Commands/UpdateCategory/UpdateCategoryCommand.cs:
  record UpdateCategoryCommand(Guid Id, string Name, string? Description, string? ImageUrl, int OrderIndex, byte[] RowVersion) : IRequest<CategoryDto>, ICacheInvalidator:
    public IEnumerable<string> CacheKeysToInvalidate => ["categories:all"]

backend/src/Application/Features/Categories/Commands/DeleteCategory/DeleteCategoryCommand.cs:
  record DeleteCategoryCommand(Guid Id) : IRequest<Unit>, ICacheInvalidator:
    public IEnumerable<string> CacheKeysToInvalidate => ["categories:all"]

backend/src/Application/Features/Recipes/Queries/SearchRecipes/SearchRecipesQuery.cs:
  record SearchRecipesQuery(string SearchTerm, Guid? CategoryId, int? Difficulty, int Page = 1, int PageSize = 12, string? CurrentUserId = null, bool IsAdmin = false) : IRequest<PaginatedResult<RecipeSummaryDto>>: ...

# ------------------------------------------------------------------------------
# 3. BACKEND - INFRASTRUCTURE LAYER (src/Infrastructure/ - EF Core, Redis, Repos)
# ------------------------------------------------------------------------------
backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs:
  class CulinaryBlogDbContext : IdentityDbContext<ApplicationUser>:
    public DbSet<Category> Categories { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<RecipeStep> RecipeSteps { get; set; }
    public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
    public DbSet<RecipeImage> RecipeImages { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

backend/src/Infrastructure/Repositories/CategoryRepository.cs:
  class CategoryRepository : BaseRepository<Category>, ICategoryRepository:
    public async Task<List<CategoryDto>> GetAllWithRecipeCountAsync(CancellationToken ct = default): ...
    public async Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default): ...
    public async Task<bool> HasActiveRecipesAsync(Guid categoryId, CancellationToken ct = default): ...
    public async Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken ct = default): ...

backend/src/Infrastructure/Services/RedisCacheService.cs:
  class RedisCacheService : ICacheService:
    public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default): ...
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken ct = default): ...
    public async Task RemoveAsync(string key, CancellationToken ct = default): ...
    public async Task RemoveByPrefixAsync(string prefix, CancellationToken ct = default): ...

# ------------------------------------------------------------------------------
# 4. BACKEND - PRESENTATION LAYER (src/Presentation/ - Minimal APIs, Security, Docs)
# ------------------------------------------------------------------------------
backend/src/Presentation/Program.cs:
  public partial class Program:
    # Services: AddApplication(), AddInfrastructure(), AddOpenApi("v1"), AddRateLimiter(), AddAuthentication(), AddAuthorization(), AddOutputCache(), AddCors()
    # Middlewares: CorrelationIdMiddleware, GlobalExceptionMiddleware, UseCors, UseOutputCache, UseRateLimiter, UseAuthentication, UseAuthorization
    # Route Group /api/v1/:
    #   /api/v1/auth        -> MapAuthEndpoints()
    #   /api/v1/recipes     -> MapRecipesEndpoints()
    #   /api/v1/categories  -> MapCategoriesEndpoints()

backend/src/Presentation/Endpoints/CategoriesEndpoints.cs:
  class CategoriesEndpoints:
    public static RouteGroupBuilder MapCategoriesEndpoints(this RouteGroupBuilder group) -> RouteGroupBuilder:
      # GET    /api/v1/categories         (FR-CAT-001 - Public, Redis cached 60m)
      # GET    /api/v1/categories/{slug}  (FR-CAT-002 - Public, Paged, 3-tier auth)
      # POST   /api/v1/categories         (FR-CAT-003 - Admin, Slug Gen, Cache Invalidation)
      # PUT    /api/v1/categories/{id}    (FR-CAT-004 - Admin, RowVersion Concurrency, Preserve Slug)
      # DELETE /api/v1/categories/{id}    (FR-CAT-005 - Admin, Soft Delete, Block if recipes exist)
    public static IEndpointRouteBuilder MapCategoriesEndpoints(this IEndpointRouteBuilder app) -> IEndpointRouteBuilder: ...

# ------------------------------------------------------------------------------
# 5. FRONTEND - TYPESCRIPT TYPES (frontend/src/types/ - Central TS Definitions)
# ------------------------------------------------------------------------------
frontend/src/types/common.ts:
  interface ProblemDetails: { type?, title?, status?, detail?, instance?, errors?, extensions? }
  interface PagedResult<T>: { items: T[], totalCount, page, pageSize, totalPages, hasNextPage, hasPreviousPage }
  type PaginatedResult<T> = PagedResult<T>
  interface ApiResponse<T>: { data?, error?, isSuccess }

frontend/src/types/category.ts:
  interface CategoryDto: { id, name, slug, description, imageUrl, orderIndex, recipeCount, rowVersion? }
  interface CategoryDetailDto: { category: CategoryDto, recipes: PagedResult<RecipeSummaryDto> }
  interface CreateCategoryInput: { name, description?, imageUrl?, orderIndex? }
  interface UpdateCategoryInput: { name, description?, imageUrl?, orderIndex?, rowVersion }

frontend/src/types/recipe.ts:
  enum RecipeDifficulty: { Easy = 1, Medium = 2, Hard = 3, Expert = 4 }
  enum RecipeStatus: { Draft = 0, Pending = 1, Published = 2, Archived = 3 }
  interface RecipeNutritionDto: { calories, fatGrams, carbsGrams, proteinGrams, fiberGrams?, sodiumMilligrams? }
  interface RecipeStepDto: { id?, stepNumber, title, instruction, imageUrl?, durationMinutes? }
  interface RecipeIngredientDto: { id?, name, quantity, unit, notes? }
  interface RecipeImageDto: { id?, originalUrl, thumbnailUrl?, caption?, isPrimary }
  interface RecipeSummaryDto: { id, title, slug, description, prepTime, cookTime, servings, difficulty, status?, thumbnailUrl, authorName, publishedAt }
  interface RecipeDetailDto: { id, title, slug, description, instructions?, prepTime, cookTime, servings, difficulty, status, categoryId, nutrition?, steps, ingredients, images, rowVersion }
  interface CreateRecipeInput: { title, description, instructions?, prepTimeMinutes, cookTimeMinutes, servings, difficulty, categoryId, nutrition?, steps?, ingredients? }
  interface UpdateRecipeInput: CreateRecipeInput & { id, rowVersion }

frontend/src/types/auth.ts:
  type UserRole = 'Admin' | 'Author' | 'Reader'
  interface UserProfile: { id, email, userName, displayName, avatarUrl, bio, roles, createdAt }
  interface AuthResponse: { accessToken, user: UserProfile }
  interface LoginInput: { email, password }
  interface RegisterInput: { email, userName, displayName, password }
  interface UpdateProfileInput: { displayName?, avatarUrl?, bio? }

frontend/src/types/index.ts:
  export * from './common'
  export * from './category'
  export * from './recipe'
  export * from './auth'

# ------------------------------------------------------------------------------
# 6. FRONTEND - APP & COMPONENTS (frontend/src/)
# ------------------------------------------------------------------------------
frontend/src/lib/services/category-service.ts:
  class CategoryService:
    getCategories(): Promise<CategoryDto[]>: ...
    getCategoryBySlug(slug, page?, pageSize?): Promise<CategoryDetailDto>: ...
    createCategory(input: CreateCategoryInput): Promise<CategoryDto>: ...
    updateCategory(id, input: UpdateCategoryInput): Promise<CategoryDto>: ...
    deleteCategory(id): Promise<void>: ...

frontend/src/components/site-header.tsx:
  export function SiteHeader(): JSX.Element: ... # Navigation, Logo, Quản Trị Viên (Admin), Profile, Logout

frontend/src/app/categories/page.tsx:
  export default function CategoriesPage(): Promise<JSX.Element>: ... # Public Category List Grid

frontend/src/app/categories/[slug]/page.tsx:
  export default function CategoryDetailPage({ params, searchParams }): Promise<JSX.Element>: ... # Detail & Paged Recipes

frontend/src/app/dashboard/categories/page.tsx:
  export default function AdminCategoriesPage(): JSX.Element: ... # Admin CRUD Categories DataTable & Modal
```

---

## 4. Bảng chỉ mục tra cứu nhanh: "Cần sửa gì -> Mở file nào?" (Quick Lookup Index)

| Nghiệp vụ / Logic cần can thiệp | Tệp tin đảm nhận (File Path) | Hàm / Khối code cụ thể |
|---|---|---|
| **Cấu hình CORS & Rate Limiting Toàn cục** | [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) | `AddCors("FrontendPolicy")`, `AddRateLimiter()`, phân vùng Sliding Window `/auth` (10 req/m) & Fixed Window (100 req/m), `OnRejected` RFC 7807 |
| **Cấu hình JWT Bearer & Chính sách Phân quyền** | [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) | `AddAuthentication(JwtBearerDefaults)`, `AddAuthorization(AdminPolicy, AuthorPolicy)` |
| **Đặc tả API OpenAPI .NET 10 & Scalar UI** | [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) | `builder.Services.AddOpenApi()`, `app.MapOpenApi()`, `app.MapScalarApiReference()` (`/scalar/v1`) |
| **Minimal APIs Phân hệ Danh mục (FR-CAT)** | [CategoriesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/CategoriesEndpoints.cs) | `MapCategoriesEndpoints`: 5 Endpoints chuẩn `/api/v1/categories`, bảo vệ `AdminPolicy`, trích xuất JWT claims |
| **Kiểm tra Định dạng Endpoint `GET /api/v1/categories`** | [CategoriesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/CategoriesEndpoints.cs) | Khối `group.MapGet("/", getCategoriesHandler)` xử lý chuẩn xác cả `/api/v1/categories` và `/api/v1/categories/` |
| **CQRS Lấy danh mục kèm Cache Redis (FR-CAT-001)** | [GetCategoriesQuery.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategories/GetCategoriesQuery.cs)<br>[GetCategoriesQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategories/GetCategoriesQueryHandler.cs) | `CacheKey => "categories:all"`, TTL 60m, kiểm tra Redis cache hit/miss, gọi `GetAllWithRecipeCountAsync()` |
| **CQRS Chi tiết danh mục & Phân quyền 3 cấp (FR-CAT-002)** | [GetCategoryBySlugQuery.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/GetCategoryBySlugQuery.cs)<br>[GetCategoryBySlugQueryHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/GetCategoryBySlugQueryHandler.cs) | Phân quyền: Khách (chỉ bài Published), Tác giả (Published + bài Draft của mình), Admin (toàn bộ bài), phân trang Mapster |
| **CQRS Tạo danh mục & Xóa Cache (FR-CAT-003)** | [CreateCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/CreateCategory/CreateCategoryCommandHandler.cs) | Sinh Slug SEO tự động tiếng Việt, kiểm tra trùng tên (409), xóa cache Redis `categories:all` qua `ICacheInvalidator` |
| **CQRS Cập nhật danh mục & Concurrency (FR-CAT-004)** | [UpdateCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/UpdateCategory/UpdateCategoryCommandHandler.cs) | Kiểm tra `RowVersion` Optimistic Concurrency, bảo toàn Slug tránh broken link SEO, xóa cache Redis |
| **CQRS Xóa mềm danh mục & Chặn 409 (FR-CAT-005)** | [DeleteCategoryCommandHandler.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Features/Categories/Commands/DeleteCategory/DeleteCategoryCommandHandler.cs) | Kiểm tra `HasActiveRecipesAsync`, chặn ném `CategoryNotEmptyException` (409 Conflict) nếu còn bài viết, xóa cache |
| **Hệ thống TypeScript Types Phía Frontend** | [frontend/src/types/index.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/index.ts) | Barrel export tập trung: `common.ts`, `category.ts`, `recipe.ts`, `auth.ts` |
| **Frontend: Dịch vụ Gọi API Danh mục** | [category-service.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/services/category-service.ts) | Các phương thức `getCategories()`, `getCategoryBySlug()`, `createCategory()`, `updateCategory()`, `deleteCategory()` |
| **Frontend: Trang Quản trị Danh mục Admin** | [dashboard/categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx) | Bảng Admin quản trị CRUD danh mục, TanStack Query mutation auto invalidation |
| **Frontend: Trang Danh mục Công khai & Chi tiết** | [categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx)<br>[categories/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/%5Bslug%5D/page.tsx) | Grid hiển thị danh mục kèm số món ăn; trang chi tiết danh mục kèm bài viết phân trang SSR |
| **Solution File Chứa Toàn Bộ Test Suites** | [CulinaryBlog.sln](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/CulinaryBlog.sln)<br>[CulinaryBlog.slnx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/CulinaryBlog.slnx) | Cấu hình tích hợp đầy đủ 5 dự án test: Domain, Application, Infrastructure, UnitTests, API.IntegrationTests |

---

## 5. Báo Cáo Bộ Kiểm Thử Tự Động (177/177 Tests - 100% Green)

```
Test Run Summary:
--------------------------------------------------------------------------------
1. CulinaryBlog.Domain.Tests:             16 / 16 PASSED  (100%) [~0.2s]
2. CulinaryBlog.Application.Tests:        72 / 72 PASSED  (100%) [~4.0s]
3. CulinaryBlog.Infrastructure.Tests:     29 / 29 PASSED  (100%) [~27.0s]
4. CulinaryBlog.UnitTests:                55 / 55 PASSED  (100%) [~4.0s]
5. CulinaryBlog.API.IntegrationTests:      5 /  5 PASSED  (100%) [~7.0s]
--------------------------------------------------------------------------------
TỔNG CỘNG:                               177 / 177 PASSED (100% GREEN)
```
- Lệnh chạy kiểm thử đơn giản nhất:
  ```bash
  cd backend
  dotnet test CulinaryBlog.sln
  ```
- Lệnh kiểm tra và biên dịch Frontend:
  ```bash
  cd frontend
  npm run build
  ```
