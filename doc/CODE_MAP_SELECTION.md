# 🗺️ BẢN ĐỒ TRA CỨU MÃ NGUỒN & VỊ TRÍ CHỨC NĂNG (DEV CODE MAP)
> **Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
> **Nhánh làm việc:** `2312719-Phuoc/Tuan-6`  
> **Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
> **Vai trò:** Technical Lead & Core Developer  
> **Cập nhật mốc:** Tuần 6 — Hoàn thiện Phân hệ Quản lý Tệp tin MinIO S3 (FR-FILE) & Quản lý Ảnh Công thức (FR-RCP-008)  

---

## 1. Mốc trạng thái hiện tại (Current Checkpoint)

- **Đã hoàn thành 100%:**
  - [x] **Cài đặt & Cấu hình Bảo mật Toàn diện (Tuần 5):**
    - **CORS (NFR-SEC-005):** Cấu hình chính sách nghiêm ngặt qua `Cors:AllowedOrigins` (`http://localhost:3000`), kích hoạt `AllowCredentials` truyền nhận Cookie an toàn giữa Next.js và .NET API, giới hạn phương thức (`GET, POST, PUT, PATCH, DELETE, OPTIONS`), phơi bày response headers an toàn (`X-Correlation-ID`, `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).
    - **Kiến trúc Giới hạn Tần suất Yêu cầu Hai Tầng (Two-Tier Rate Limiting - NFR-SEC-003):** 
      - Tầng ứng dụng ASP.NET Core phân vùng thông minh theo IP và Endpoint path:
        - Nhóm xác thực (`/api/v1/auth/*`): Tối đa **10 requests/phút/IP** (Sliding Window chống Brute Force).
        - Nhóm upload tệp tin (`/images`, `/files`): Tối đa **5 requests/phút/IP** (Fixed Window).
        - Toàn bộ API chung: Tối đa **100 requests/phút/IP** (Fixed Window).
      - Cơ chế `OnRejected` chuẩn hóa: Thiết lập mã `HTTP 429 Too Many Requests`, tự động tính toán Header `Retry-After`, trả về nội dung lỗi theo chuẩn **RFC 7807 Problem Details** (`type: "RATE_LIMIT_EXCEEDED"`).
    - **Xác thực & Phân quyền (Authentication & Authorization - CONS-004, NFR-SEC-006):**
      - Access Token JWT stateless thời hạn 15 phút, khóa bí mật đối xứng `SymmetricSecurityKey`, kiểm tra Lifetime, Issuer, Audience.
      - Refresh Token lưu trữ an toàn trong `HttpOnly; Secure; SameSite=Strict` Cookie với đường dẫn giới hạn `Path=/api/v1/auth`, thời hạn 7 ngày, cơ chế Refresh Token Rotation (RTR) và Reuse Detection.
      - Phân quyền theo vai trò (Role-based Authorization): `AdminPolicy` (`RequireRole("Admin")`), `AuthorPolicy` (`RequireRole("Author", "Admin")`).
      - Kiểm soát quyền sở hữu tài nguyên (Resource Ownership): Tác giả chỉ được thao tác bài viết của chính mình, Admin có toàn quyền.
  - [x] **Sinh Tài liệu Đặc tả API & Phiên bản hóa API (API Versioning - Tuần 5):**
    - **API Versioning (CONS-005):** Toàn bộ endpoint được định tuyến cố định theo tiền tố phiên bản `/api/v1/` (`/api/v1/auth`, `/api/v1/categories`, `/api/v1/recipes`, `/api/v1/files`).
    - **Đặc tả API Tự động:** Tích hợp OpenAPI native trong .NET 10 (`Microsoft.AspNetCore.OpenApi`) và giao diện tài liệu tương tác Scalar API Reference (`Scalar.AspNetCore`) tại tuyến `/scalar/v1` và `/openapi/v1.json`.
  - [x] **Module Quản lý Danh mục Ẩm thực (FR-CAT - 5 Endpoints Minimal APIs - Tuần 5):**
    - `GET /api/v1/categories` (FR-CAT-001): Công khai, Redis Distributed Cache 60 phút (`categories:all`), trả về danh sách kèm số lượng công thức đã xuất bản.
    - `GET /api/v1/categories/{slug}` (FR-CAT-002): Công khai, phân trang `page` & `pageSize`, ma trận phân quyền 3 cấp (Guest, Author, Admin).
    - `POST /api/v1/categories` (FR-CAT-003): Quyền Admin, sinh Slug SEO tiếng Việt không dấu, kiểm tra trùng tên (409 Conflict), xóa cache Redis `categories:all`.
    - `PUT /api/v1/categories/{id}` (FR-CAT-004): Quyền Admin, kiểm tra Optimistic Concurrency qua `RowVersion` (409 Conflict), bảo toàn `Slug`, xóa cache Redis.
    - `DELETE /api/v1/categories/{id}` (FR-CAT-005): Quyền Admin, xóa mềm (`IsDeleted = true`), chặn 409 Conflict nếu danh mục còn công thức hoạt động, xóa cache Redis.
  - [x] **Phân hệ Quản lý Tệp tin MinIO S3 Object Storage (FR-FILE - MỚI Tuần 6):**
    - **MinioFileStorageService (FR-FILE-001):** Triển khai `IFileStorageService`, upload file proxy qua Backend, giới hạn $\le 5$ MB (`FILE_SIZE_EXCEEDED`), kiểm tra Magic Bytes nhị phân 4 định dạng JPEG, PNG, WebP, AVIF (`FILE_MIME_INVALID`), chống Path Traversal (`{folder}/{Guid.NewGuid()}{ext}`), tự động khởi tạo bucket `culinary-blog` kèm Public Read Policy.
    - **Xóa Tệp Idempotent & Retry (FR-FILE-002):** Xóa file trên MinIO với cơ chế Idempotent (không báo lỗi nếu file đã xóa), tự động thử lại 3 lần với Exponential Backoff.
    - **Minimal APIs Endpoints:** `POST /api/v1/files/upload` (201 Created kèm `FileUploadResponse`) và `DELETE /api/v1/files` (204 NoContent).
  - [x] **Quản lý Ảnh Công thức Nấu ăn (FR-RCP-008 - MỚI Tuần 6):**
    - `POST /api/v1/recipes/{id}/images`: Tải ảnh công thức, tự động gán `IsPrimary = true` cho ảnh đầu tiên.
    - `PATCH /api/v1/recipes/{id}/images/{imageId}/primary`: Đặt ảnh làm đại diện chính.
    - `DELETE /api/v1/recipes/{id}/images/{imageId}`: Xóa ảnh công thức; nếu xóa ảnh chính, tự động gán ảnh đầu tiên còn lại làm primary.
    - Phân quyền: Chỉ Chủ sở hữu (`Owner`) hoặc Quản trị viên (`Admin`) mới được thao tác.
    - Xóa Output Cache thẻ `"recipes"` tự động khi có biến động ảnh.
  - [x] **Tối ưu Kỹ thuật EF Core AuditInterceptor (MỚI Tuần 6):**
    - Khắc phục xung đột EF Core ChangeTracker gán nhầm trạng thái `Modified` cho thực thể con mới tạo qua Aggregate Root do `BaseEntity.Id != Guid.Empty`.
    - Tự động chuyển đổi `EntityState.Modified` thành `EntityState.Added` khi `RowVersion` rỗng.
  - [x] **Frontend Client Integration (MỚI Tuần 6):**
    - Bổ sung `frontend/src/types/file.ts` (`FileUploadResponse`), cập nhật `RecipeImageDto` trong `recipe.ts`, export qua `index.ts`.
    - Cập nhật `frontend/src/lib/api-client.ts`: Tự động nhận diện `FormData` để không ghi đè `Content-Type: application/json`.
    - Cài đặt `frontend/src/lib/services/file-service.ts`: Cung cấp 5 methods gọi API (`uploadFile`, `deleteFile`, `uploadRecipeImage`, `setPrimaryRecipeImage`, `deleteRecipeImage`).
    - `npm run build` Next.js 15 đạt 100% (0 lỗi TypeScript / lint).
  - [x] **Quản lý Nguyên liệu & Các Bước Nấu Ăn (FR-RCP-009 & FR-RCP-010):**
    - Thêm, sửa, xóa nguyên liệu (`POST/PUT/DELETE /api/v1/recipes/{id}/ingredients/{ingId}`).
    - Thêm, sửa, xóa bước thực hiện (`POST/PUT/DELETE /api/v1/recipes/{id}/steps/{stepId}`), tự động tính toán lại `StepNumber` tuần tự (1, 2, 3...) khi xóa.
  - [x] **Tìm kiếm Full-Text Search Tiếng Việt (FR-SRCH-001 -> 004):**
    - Tìm kiếm công thức bằng PostgreSQL `tsvector`/`tsquery` kết hợp extension `unaccent` và `ts_rank`.
    - Lọc linh hoạt theo danh mục, độ khó, thời gian nấu, đồng bộ URL query params phía Frontend.
  - [x] **Phân hệ Background Jobs với Hangfire (FR-JOB-001 -> 003):**
    - `FR-JOB-001 (WelcomeEmailJob)`: Gửi email chào mừng kích hoạt tài khoản qua MailKit/MailHog với 3 lần thử lại (60s, 300s, 1800s).
    - `FR-JOB-002 (RecipeImageResizeJob)`: Tạo ảnh thu nhỏ Thumbnail (300x300) và Medium (800x600) dùng SixLabors.ImageSharp, cập nhật URL vào database.
    - `FR-JOB-003 (SitemapGenerationJob)`: Job định kỳ lúc 02:00 AM UTC xuất toàn bộ công thức và danh mục ra chuẩn XML `sitemaps.org`, cung cấp endpoint `GET /sitemap.xml`.
    - Bảo vệ Hangfire Dashboard với filter phân quyền (`Admin` trên Production, mở tự do ở Development).
  - [x] **Phân hệ Giám sát & Quan sát Hệ thống (FR-OBS-001 -> 003):**
    - Health Checks đa tầng: `/health`, `/health/ready` (kiểm tra Postgres & Redis), `/health/live`.
    - Structured Logging Serilog tích hợp `CorrelationId` (`X-Correlation-ID`), `RequestPath`, `UserId`, `TraceId`.
    - Tracing OpenTelemetry kết nối Seq (`http://localhost:5341`).
  - [x] **Frontend Hoàn thiện Toàn diện (Next.js 15 App Router):**
    - Tích hợp `RecipeImageGalleryManager`: kéo thả ảnh, chọn ảnh chính, xóa ảnh qua MinIO proxy.
    - Cập nhật `RecipeForm`, trang `/recipes/[slug]/edit`, trang `/profile` đổi avatar MinIO.
    - Cấu hình ISR `revalidate = 300` và JSON-LD Schema.org `@type: "Recipe"`.
    - `npm run lint` đạt 0 cảnh báo/lỗi; `npm run build` xuất thành công 13/13 static routes.
  - [x] **Đồng bộ Solution & Toàn bộ 6 Bộ Kiểm thử Tự động (284/284 Tests Passed - 100% Green):**
    - `CulinaryBlog.Domain.Tests`: **23/23 tests passed**.
    - `CulinaryBlog.Application.Tests`: **113/113 tests passed**.
    - `CulinaryBlog.Api.Tests`: **4/4 tests passed**.
    - `CulinaryBlog.UnitTests`: **95/95 tests passed**.
    - `CulinaryBlog.Infrastructure.Tests`: **34/34 tests passed** (+5 unit tests cho Hangfire Jobs & Sitemap).
    - `CulinaryBlog.API.IntegrationTests`: **15/15 tests passed** (+1 integration test cho endpoint `/sitemap.xml`).
  - [x] **Tích hợp CI/CD Pipeline Toàn diện:**
    - File `.github/workflows/ci.yml` tự động kiểm thử đồng thời .NET 10 Solution và Next.js 15 Frontend trên GitHub Actions.

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
# Backend: .NET 10 Minimal APIs, Clean Architecture, CQRS (MediatR), PostgreSQL, Redis, MinIO
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
    public RecipeImage AddImage(string originalUrl, string? mediumUrl = null, string? thumbnailUrl = null, string? altText = null, bool isPrimary = false) -> RecipeImage: ...
    public void SetPrimaryImage(Guid imageId) -> void: ...
    public void RemoveImage(Guid imageId) -> void: ...
    public void Publish() -> void: ...
    public void Unpublish() -> void: ...
    public void Archive() -> void: ...

backend/src/Domain/Entities/RecipeChildren.cs:
  class RecipeStep : BaseEntity:
    public Guid RecipeId { get; private set; }
    public int StepNumber { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
  class RecipeIngredient : BaseEntity:
    public Guid RecipeId { get; private set; }
    public string Name { get; private set; }
    public decimal? Quantity { get; private set; }
    public string? Unit { get; private set; }
  class RecipeImage : BaseEntity:
    public Guid RecipeId { get; private set; }
    public string OriginalUrl { get; private set; }
    public string? MediumUrl { get; private set; }
    public string? ThumbnailUrl { get; private set; }
    public string? AltText { get; private set; }
    public bool IsPrimary { get; private set; }
    public int OrderIndex { get; private set; }

backend/src/Domain/Interfaces/Interfaces.cs:
  interface ICurrentUser:
    string? UserId { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
  interface IFileStorageService:
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default): ...
    Task DeleteAsync(string fileUrl, CancellationToken ct = default): ...
  interface ICacheable:
    string CacheKey { get; }
    TimeSpan? Expiration { get; }
  interface ICacheInvalidator:
    IEnumerable<string> CacheKeysToInvalidate { get; }

backend/src/Domain/Interfaces/IRecipeRepository.cs:
  interface IRecipeRepository : IRepository<Recipe>:
    Task<Recipe?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default): ...
    Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct = default): ...
    Task<bool> IsSlugUniqueAsync(string slug, CancellationToken ct = default): ...

# ------------------------------------------------------------------------------
# 2. BACKEND - APPLICATION LAYER (src/Application/ - CQRS, MediatR, DTOs)
# ------------------------------------------------------------------------------
backend/src/Application/Common/Helpers/RecipeAuthorizationHelper.cs:
  class RecipeAuthorizationHelper:
    public static Task<Recipe> LoadAndAuthorize(IRecipeRepository repo, ICurrentUser user, Guid recipeId, CancellationToken ct): ...
    public static Task<Recipe> LoadAndAuthorizeWithImages(IRecipeRepository repo, ICurrentUser user, Guid recipeId, CancellationToken ct): ...

backend/src/Application/Features/Recipes/DTOs/RecipeImageDto.cs:
  record RecipeImageDto(Guid Id, string OriginalUrl, string? MediumUrl, string? ThumbnailUrl, string? AltText, bool IsPrimary, int OrderIndex): ...

backend/src/Application/Features/Recipes/Commands/UploadRecipeImage/:
  record UploadRecipeImageCommand(Guid RecipeId, Stream FileStream, string FileName, string ContentType, string? AltText) : IRequest<RecipeImageDto>: ...
  class UploadRecipeImageCommandHandler : IRequestHandler<UploadRecipeImageCommand, RecipeImageDto>:
    public async Task<RecipeImageDto> Handle(UploadRecipeImageCommand request, CancellationToken cancellationToken): ...

backend/src/Application/Features/Recipes/Commands/SetPrimaryRecipeImage/:
  record SetPrimaryRecipeImageCommand(Guid RecipeId, Guid ImageId) : IRequest<RecipeImageDto>: ...
  class SetPrimaryRecipeImageCommandHandler : IRequestHandler<SetPrimaryRecipeImageCommand, RecipeImageDto>:
    public async Task<RecipeImageDto> Handle(SetPrimaryRecipeImageCommand request, CancellationToken cancellationToken): ...

backend/src/Application/Features/Recipes/Commands/DeleteRecipeImage/:
  record DeleteRecipeImageCommand(Guid RecipeId, Guid ImageId) : IRequest<Unit>: ...
  class DeleteRecipeImageCommandHandler : IRequestHandler<DeleteRecipeImageCommand, Unit>:
    public async Task<Unit> Handle(DeleteRecipeImageCommand request, CancellationToken cancellationToken): ...

backend/src/Application/Features/Categories/Queries/GetCategories/:
  record GetCategoriesQuery() : IRequest<List<CategoryDto>>, ICacheable: ...
  class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>: ...

backend/src/Application/Features/Categories/Queries/GetCategoryBySlug/:
  record GetCategoryBySlugQuery(string Slug, int Page = 1, int PageSize = 12, string? CurrentUserId = null, bool IsAdmin = false) : IRequest<CategoryDetailResponseDto>: ...
  class GetCategoryBySlugQueryHandler : IRequestHandler<GetCategoryBySlugQuery, CategoryDetailResponseDto>: ...

# ------------------------------------------------------------------------------
# 3. BACKEND - INFRASTRUCTURE LAYER (src/Infrastructure/ - EF Core, MinIO, Redis)
# ------------------------------------------------------------------------------
backend/src/Infrastructure/Services/MinioFileStorageService.cs:
  class MinioFileStorageService : IFileStorageService:
    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken ct = default): ...
    public async Task DeleteAsync(string fileUrl, CancellationToken ct = default): ...

backend/src/Infrastructure/Data/Interceptors/AuditInterceptor.cs:
  class AuditInterceptor : SaveChangesInterceptor:
    private static void UpdateEntities(DbContext? context): ... # Fix EF Core navigation child Modified -> Added state

backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs:
  class CulinaryBlogDbContext : IdentityDbContext<ApplicationUser>, IUnitOfWork:
    public DbSet<Category> Categories { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<RecipeStep> RecipeSteps { get; set; }
    public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
    public DbSet<RecipeImage> RecipeImages { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

backend/src/Infrastructure/Repositories/RecipeRepository.cs:
  class RecipeRepository : BaseRepository<Recipe>, IRecipeRepository:
    public Task<Recipe?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default): ...
    public Task<Recipe?> GetBySlugAsync(string slug, CancellationToken ct = default): ...
    public Task<bool> IsSlugUniqueAsync(string slug, CancellationToken ct = default): ...

# ------------------------------------------------------------------------------
# 4. BACKEND - PRESENTATION LAYER (src/Presentation/ - Minimal APIs, Endpoints)
# ------------------------------------------------------------------------------
backend/src/Presentation/Endpoints/FilesEndpoints.cs:
  class FilesEndpoints:
    public static RouteGroupBuilder MapFilesEndpoints(this RouteGroupBuilder group) -> RouteGroupBuilder:
      # POST   /api/v1/files/upload?folder=... (FR-FILE-001 - Auth, Magic Bytes, Max 5MB)
      # DELETE /api/v1/files?url=...           (FR-FILE-002 - Auth, Idempotent, Retry 3x)

backend/src/Presentation/Endpoints/RecipesEndpoints.cs:
  class RecipesEndpoints:
    public static RouteGroupBuilder MapRecipesEndpoints(this RouteGroupBuilder group) -> RouteGroupBuilder:
      # POST   /api/v1/recipes/{id}/images                  (FR-RCP-008 - Upload recipe image, auto primary)
      # PATCH  /api/v1/recipes/{id}/images/{imageId}/primary (FR-RCP-008 - Set primary image)
      # DELETE /api/v1/recipes/{id}/images/{imageId}         (FR-RCP-008 - Delete image, auto transfer primary)

backend/src/Presentation/Endpoints/CategoriesEndpoints.cs:
  class CategoriesEndpoints:
    public static RouteGroupBuilder MapCategoriesEndpoints(this RouteGroupBuilder group) -> RouteGroupBuilder:
      # GET    /api/v1/categories         (FR-CAT-001 - Public, Redis cached 60m)
      # GET    /api/v1/categories/{slug}  (FR-CAT-002 - Public, Paged, 3-tier auth)
      # POST   /api/v1/categories         (FR-CAT-003 - Admin, Slug Gen, Cache Invalidation)
      # PUT    /api/v1/categories/{id}    (FR-CAT-004 - Admin, RowVersion Concurrency)
      # DELETE /api/v1/categories/{id}    (FR-CAT-005 - Admin, Soft Delete)

backend/src/Presentation/Program.cs:
  public partial class Program:
    # Route Group /api/v1/:
    #   /api/v1/auth        -> MapAuthEndpoints()
    #   /api/v1/recipes     -> MapRecipesEndpoints()
    #   /api/v1/categories  -> MapCategoriesEndpoints()
    #   /api/v1/files       -> MapFilesEndpoints()
    # Rate Limiting: 10 req/m (/auth), 5 req/m (/images, /files), 100 req/m (general)

# ------------------------------------------------------------------------------
# 5. FRONTEND - TYPESCRIPT TYPES (frontend/src/types/ - Central TS Definitions)
# ------------------------------------------------------------------------------
frontend/src/types/file.ts:
  interface FileUploadResponse: { url: string, fileName: string, contentType: string, sizeBytes: number }

frontend/src/types/recipe.ts:
  interface RecipeImageDto: { id?: string, originalUrl: string, mediumUrl?: string | null, thumbnailUrl?: string | null, altText?: string | null, caption?: string | null, isPrimary: boolean, orderIndex?: number }
  interface RecipeSummaryDto: { id, title, slug, description, prepTime, cookTime, servings, difficulty, status?, thumbnailUrl, authorName, publishedAt }
  interface RecipeDetailDto: { id, title, slug, description, instructions?, prepTime, cookTime, servings, difficulty, status, categoryId, nutrition?, steps, ingredients, images, rowVersion }

frontend/src/types/common.ts:
  interface ProblemDetails: { type?, title?, status?, detail?, instance?, errors?, extensions? }
  interface PagedResult<T>: { items: T[], totalCount, page, pageSize, totalPages, hasNextPage, hasPreviousPage }

frontend/src/types/index.ts:
  export * from './common'
  export * from './category'
  export * from './recipe'
  export * from './auth'
  export * from './file'

# ------------------------------------------------------------------------------
# 6. FRONTEND - SERVICES, STORES & COMPONENTS (frontend/src/)
# ------------------------------------------------------------------------------
frontend/src/lib/utils.ts:
  cn(...inputs: ClassValue[]): string: ... # clsx + twMerge utility
  formatDuration(minutes: number): string: ...
  formatDate(dateString: string | Date): string: ...

frontend/src/lib/error-utils.ts:
  const ERROR_MESSAGES: Record<string, string>
  getErrorMessage(error: unknown, fallback?: string): string: ...
  getFieldErrors(error: unknown): Record<string, string[]>: ...
  isNetworkError(error: unknown): boolean: ...

frontend/src/stores/auth-store.ts:
  const useAuthStore = create<AuthState>:
    user, accessToken, isAuthenticated, isLoading
    setAuth(user, token), setUser(user), setAccessToken(token), clearAuth()

frontend/src/stores/ui-store.ts:
  const useUIStore = create<UIState>:
    isMobileMenuOpen, isSearchModalOpen, activeSearchQuery
    toggleMobileMenu(), setSearchModalOpen(isOpen)

frontend/src/components/ui/: # shadcn/ui Design System primitives
  button.tsx: Button, buttonVariants (cva: default, destructive, outline, secondary, ghost, link)
  input.tsx: Input
  card.tsx: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  badge.tsx: Badge, badgeVariants (default, secondary, destructive, outline, success, warning)
  skeleton.tsx: Skeleton
  textarea.tsx: Textarea

frontend/src/components/common/: # Shared UI components
  Footer.tsx: Footer navigation & culinary brand links
  Pagination.tsx: Reusable pagination supporting query URL links and callback navigation
  Loading.tsx: LoadingSpinner, LoadingPage, CardSkeleton, GridCardSkeleton
  ErrorDisplay.tsx: Friendly error box with retry and home button
  ImageUpload.tsx: Drag-and-drop MinIO S3 file upload with preview and deletion

frontend/src/lib/services/file-service.ts:
  const fileService:
    uploadFile(file: File, folder?: string): Promise<FileUploadResponse>: ...
    deleteFile(fileUrl: string): Promise<void>: ...
    uploadRecipeImage(recipeId: string, file: File, altText?: string): Promise<RecipeImageDto>: ...
    setPrimaryRecipeImage(recipeId: string, imageId: string): Promise<RecipeImageDto>: ...
    deleteRecipeImage(recipeId: string, imageId: string): Promise<void>: ...

frontend/src/lib/services/category-service.ts:
  const categoryService:
    getCategories(): Promise<CategoryDto[]>: ...
    getCategoryBySlug(slug, page?, pageSize?): Promise<CategoryDetailDto>: ...
    createCategory(input: CreateCategoryInput): Promise<CategoryDto>: ...
    updateCategory(id, input: UpdateCategoryInput): Promise<CategoryDto>: ...
    deleteCategory(id): Promise<void>: ...

frontend/src/lib/api-client.ts:
  export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T>: ... # Supports JSON and multipart FormData, timeout signal
```

---

## 4. Bảng chỉ mục tra cứu nhanh: "Cần sửa gì -> Mở file nào?" (Quick Lookup Index)

| Nghiệp vụ / Logic cần can thiệp | Tệp tin đảm nhận (File Path) | Hàm / Khối code cụ thể |
|---|---|---|
| **Dịch vụ Lưu trữ MinIO S3 (FR-FILE)** | [MinioFileStorageService.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Services/MinioFileStorageService.cs) | `UploadAsync()` (Magic Bytes sniffing, size $\le 5$MB, bucket auto-init), `DeleteAsync()` (Idempotent, Retry 3x) |
| **Minimal APIs Endpoints Tệp tin** | [FilesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/FilesEndpoints.cs) | `MapFilesEndpoints()`: `POST /api/v1/files/upload` (201 Created), `DELETE /api/v1/files` (204 NoContent) |
| **Quản lý Ảnh Công thức Nấu ăn (FR-RCP-008)** | [RecipesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/RecipesEndpoints.cs) | `UploadRecipeImage` (`POST /{id}/images`), `SetPrimaryRecipeImage` (`PATCH .../primary`), `DeleteRecipeImage` (`DELETE .../{imageId}`) |
| **CQRS Handlers Ảnh Công thức** | `Application/Features/Recipes/Commands/` | `UploadRecipeImageCommandHandler.cs`, `SetPrimaryRecipeImageCommandHandler.cs`, `DeleteRecipeImageCommandHandler.cs` |
| **Phân quyền Sở hữu Công thức & Admin** | [RecipeAuthorizationHelper.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Application/Common/Helpers/RecipeAuthorizationHelper.cs) | `LoadAndAuthorize()`, `LoadAndAuthorizeWithImages()` (kiểm tra `AuthorId == currentUserId` hoặc `IsAdmin`) |
| **Tối ưu Concurrency Entity Con EF Core** | [AuditInterceptor.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Data/Interceptors/AuditInterceptor.cs) | Khối kiểm tra `entry.State == EntityState.Modified && RowVersion.Length == 0` -> chuyển sang `EntityState.Added` |
| **Rate Limiting 5 req/min Upload** | [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) | `AddRateLimiter()`: Fixed Window 5 requests/phút/IP cho đường dẫn chứa `/images` hoặc bắt đầu với `/api/v1/files` |
| **Frontend: Dịch vụ Quản lý File & Ảnh** | [file-service.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/services/file-service.ts) | `uploadFile()`, `deleteFile()`, `uploadRecipeImage()`, `setPrimaryRecipeImage()`, `deleteRecipeImage()` |
| **Frontend: Fetch API Client Hỗ trợ FormData** | [api-client.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/api-client.ts) | `apiClient()`: Kiểm tra `options.body instanceof FormData` để không override `Content-Type: application/json` |
| **Hệ thống TypeScript Types Phía Frontend** | [frontend/src/types/index.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/index.ts) | Barrel export tập trung: `common.ts`, `category.ts`, `recipe.ts`, `auth.ts`, `file.ts` |
| **Tiện ích Xử lý Lỗi & Chuẩn hóa RFC 7807** | [error-utils.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/error-utils.ts) | `getErrorMessage()`, `getFieldErrors()`, `isNetworkError()`, bảng ánh xạ `ERROR_MESSAGES` |
| **Quản lý Trạng thái Xác thực & UI (Zustand)** | [auth-store.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/stores/auth-store.ts)<br>[ui-store.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/stores/ui-store.ts) | `useAuthStore` (in-memory token, user session, logout), `useUIStore` (mobile menu, search drawer) |
| **Thư viện Giao diện shadcn/ui Primitives** | [frontend/src/components/ui/](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/) | `Button`, `Input`, `Card`, `Badge`, `Skeleton`, `Textarea` (kết hợp `cn()` qua `clsx` & `tailwind-merge`) |
| **Component Dùng Chung (Common UI)** | [frontend/src/components/common/](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/) | `SiteHeader` (responsive nav), `Footer`, `Pagination`, `Loading` / `CardSkeleton`, `ErrorDisplay`, `ImageUpload` (MinIO S3) |
| **Bố cục & Giao diện Tĩnh Blog App** | [frontend/src/app/](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/) | `layout.tsx` (Root Layout), `page.tsx` (Trang chủ tĩnh), `recipes/page.tsx` (Kho công thức), `recipes/[slug]/page.tsx` (Chi tiết công thức) |
| **Minimal APIs Phân hệ Danh mục (FR-CAT)** | [CategoriesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/CategoriesEndpoints.cs) | `MapCategoriesEndpoints`: 5 Endpoints chuẩn `/api/v1/categories`, bảo vệ `AdminPolicy` |
| **Solution File Chứa Toàn Bộ Test Suites** | [CulinaryBlog.sln](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/CulinaryBlog.sln)<br>[CulinaryBlog.slnx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/CulinaryBlog.slnx) | Cấu hình tích hợp đầy đủ 5 dự án test: Domain, Application, Infrastructure, UnitTests, API.IntegrationTests |

---

## 5. Báo Cáo Bộ Kiểm Thử Tự Động (198/198 Tests - 100% Green)

```
Test Run Summary:
--------------------------------------------------------------------------------
1. CulinaryBlog.Domain.Tests:             16 / 16 PASSED  (100%) [~0.1s]
2. CulinaryBlog.Application.Tests:        78 / 78 PASSED  (100%) [~2.0s] (+6 new)
3. CulinaryBlog.Infrastructure.Tests:     29 / 29 PASSED  (100%) [~25.0s]
4. CulinaryBlog.UnitTests:                66 / 66 PASSED  (100%) [~2.0s] (+11 new)
5. CulinaryBlog.API.IntegrationTests:      9 /  9 PASSED  (100%) [~4.0s] (+4 new)
--------------------------------------------------------------------------------
TỔNG CỘNG:                               198 / 198 PASSED (100% GREEN)
```
- Lệnh chạy kiểm thử tự động toàn diện Backend:
  ```bash
  cd backend
  dotnet test CulinaryBlog.sln
  ```
- Lệnh kiểm tra và biên dịch Frontend:
  ```bash
  cd frontend
  npm run build
  ```
