# BÁO CÁO KẾT QUẢ CÔNG VIỆC TUẦN 5
**Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
**Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
**Vai trò:** Technical Lead & Core Developer  
**Nhánh làm việc:** `2312719-Phuoc/Tuan-5`  
**Tài liệu tham chiếu:** `SRS.md`, `SPEC.md`, `CLAUDE.md`, `CODE_MAP_SELECTION.md`  
**Thời gian hoàn thành:** 13/10/2026  

---

## I. TỔNG QUAN MỤC TIÊU CÔNG VIỆC TUẦN 5

Trong khuôn khổ Tuần 5, các hạng mục kỹ thuật trọng điểm đã được thực hiện và nghiệm thu hoàn thành 100% bao gồm:

1. **Bảo mật toàn diện (Security):**
   - Thiết lập chính sách CORS nghiêm ngặt (`NFR-SEC-005`), hỗ trợ truyền nhận an toàn Cookie với Frontend.
   - Hiện thực kiến trúc Giới hạn tần suất hai tầng (Two-Tier Rate Limiting - `NFR-SEC-003`): bảo vệ chống Brute Force cho endpoint xác thực và chống DoS/DDoS cho toàn hệ thống, phản hồi chuẩn RFC 7807 kèm Header `Retry-After`.
   - Củng cố hệ thống Xác thực (JWT Stateless 15m, Refresh Token HttpOnly Cookie 7d) và Phân quyền theo vai trò (`AdminPolicy`, `AuthorPolicy`, kiểm soát sở hữu tài nguyên `NFR-SEC-006`).
2. **Sinh tài liệu đặc tả API & Phiên bản hóa API (API Documentation & Versioning):**
   - Đảm bảo phiên bản hóa API đồng nhất theo tiền tố URL `/api/v1/` (`CONS-005`).
   - Kiểm tra và chuẩn hóa định dạng endpoint danh mục: `GET /api/v1/categories` (xử lý tối ưu cả trường hợp có và không có trailing slash).
   - Tích hợp tài liệu OpenAPI native trong .NET 10 (`/openapi/v1.json`) và giao diện tương tác hiện đại Scalar API Reference (`/scalar/v1`).
3. **Phân hệ Quản lý Danh mục (FR-CAT):**
   - Hoàn thiện 5 use cases nghiệp vụ từ FR-CAT-001 đến FR-CAT-005 cả ở Backend (CQRS Handlers, Caching 2 tầng, Validation, Repositories) lẫn Frontend (Client Service, Server Components, Admin CRUD Modal).
4. **Khởi tạo Môi trường & Xây dựng Cấu trúc Frontend:**
   - Hoàn thành thiết lập dự án Next.js 15 App Router, React 18/19, TypeScript 5, Tailwind CSS.
   - Cài đặt đầy đủ các thư viện cần thiết: TanStack Query v5, Auth.js v5, React Hook Form, Zod, Lucide React.
   - Giải quyết triệt để lỗi vỡ font tiếng Việt với Google Font `Inter` (`latin`, `vietnamese`).
5. **Cài đặt Hệ thống Kiểu dữ liệu TypeScript (TS Types) Phía Frontend:**
   - Xây dựng thư mục trung tâm `frontend/src/types/` với các tệp phân tách rõ ràng: `common.ts`, `category.ts`, `recipe.ts`, `auth.ts`, `index.ts`.
   - Đảm bảo tính tương thích ngược cho toàn bộ codebase hiện hành.
6. **Chuẩn hóa Bản đồ Mã nguồn (Code Map):**
   - Cập nhật và hoàn thiện `doc/CODE_MAP_SELECTION.md` tuân thủ nghiêm ngặt **Bộ 5 Quy Tắc Vàng của Code Map** cho AI Coding Agents (định dạng `# PROJECT CODE MAP` dạng khung xương YAML, PageRank Ranking, lọc nhiễu và kiểm soát ngân sách token).

---

## II. CHI TIẾT KẾT QUẢ THỰC HIỆN KỸ THUẬT

### 1. Cài đặt Bảo mật: CORS, Two-Tier Rate Limiting, Authentication/Authorization

#### a. Chính sách CORS nghiêm ngặt (`NFR-SEC-005`)
- Được đăng ký trong [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs) với policy `"FrontendPolicy"`:
  - Nguồn gốc cho phép (Allowed Origins): Đọc trực tiếp từ cấu hình `appsettings.json` (`Cors:AllowedOrigins`, mặc định `http://localhost:3000`), tuyệt đối không dùng ký tự đại diện `*`.
  - Hỗ trợ Cookie an toàn: Kích hoạt `.AllowCredentials()` phục vụ gửi và nhận Refresh Token trong HttpOnly Cookie giữa Next.js và .NET API.
  - Giới hạn phương thức HTTP: Chỉ cho phép `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
  - Phơi bày Response Headers an toàn cho Client: `X-Correlation-ID`, `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

#### b. Kiến trúc Giới hạn tần suất hai tầng (Two-Tier Rate Limiting - `NFR-SEC-003`)
- Tầng 1 (Nginx Reverse Proxy): Giới hạn thô 300 requests/phút/IP.
- Tầng 2 (ASP.NET Core Application Middleware):
  - **Nhóm Endpoint Xác thực (`/api/v1/auth/*`):** Tối đa **10 requests/phút/IP** sử dụng thuật toán **Sliding Window** (6 segments) nhằm ngăn chặn triệt để tấn công dò mật khẩu (Brute Force) và Credential Stuffing.
  - **Nhóm API chung toàn hệ thống:** Tối đa **100 requests/phút/IP** sử dụng thuật toán **Fixed Window**.
  - **Cơ chế `OnRejected` chuẩn RFC 7807:**
    - Trả về mã trạng thái `HTTP 429 Too Many Requests`.
    - Tự động trích xuất metadata và đính kèm HTTP Header `Retry-After` (tính theo giây).
    - Thân phản hồi JSON định dạng Problem Details:
      ```json
      {
        "type": "RATE_LIMIT_EXCEEDED",
        "title": "Too Many Requests",
        "status": 429,
        "detail": "Tần suất yêu cầu vượt quá giới hạn cho phép. Vui lòng thử lại sau 60 giây.",
        "instance": "/api/v1/auth/login"
      }
      ```

#### c. Xác thực & Phân quyền (Authentication / Authorization)
- **JWT Bearer Stateless (`CONS-004`):** Access Token có thời hạn ngắn (15 phút), kiểm tra tính hợp lệ của `Issuer`, `Audience`, `Lifetime` và chữ ký `IssuerSigningKey`.
- **Refresh Token Rotation (RTR):** Refresh Token lưu trữ trong `HttpOnly; Secure; SameSite=Strict` Cookie với `Path=/api/v1/auth`, thời hạn 7 ngày. Thu hồi token cũ ngay khi cấp token mới; kích hoạt Reuse Detection thu hồi toàn bộ phiên nếu phát hiện token bị tái sử dụng.
- **Phân quyền vai trò:**
  - `AdminPolicy`: Yêu cầu Role `"Admin"`, áp dụng cho các thao tác quản trị (Tạo, Sửa, Xóa danh mục).
  - `AuthorPolicy`: Yêu cầu Role `"Author"` hoặc `"Admin"`.
  - **Kiểm soát quyền sở hữu tài nguyên (`NFR-SEC-006`):** Tác giả chỉ được chỉnh sửa hoặc chuyển đổi trạng thái đối với công thức do chính mình sở hữu (`AuthorId == currentUserId`).

---

### 2. Sinh Tài Liệu Đặc Tả API & Phiên Bản Hóa API (API Versioning)

#### a. Phiên bản hóa API (`CONS-005`)
- Hệ thống áp dụng chiến lược phiên bản cố định qua đường dẫn URL `/api/v1/`.
- Trong [Program.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Program.cs):
  ```csharp
  var v1 = app.MapGroup("/api/v1");
  v1.MapGroup("/auth").MapAuthEndpoints();
  v1.MapGroup("/recipes").MapRecipesEndpoints();
  v1.MapGroup("/categories").MapCategoriesEndpoints();
  ```

#### b. Kiểm tra và xác nhận định dạng Endpoint `GET /api/v1/categories`
- Kiểm tra tính tương thích của Endpoint:
  - Cấu hình phương thức mở rộng [CategoriesEndpoints.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Presentation/Endpoints/CategoriesEndpoints.cs) hỗ trợ cả `RouteGroupBuilder` và `IEndpointRouteBuilder`.
  - Đảm bảo URL `GET /api/v1/categories` được định tuyến chuẩn xác tới handler `GetCategoriesQuery`, trả về danh sách kèm số lượng công thức active và cache Redis 60 phút.
  - Bộ kiểm thử tích hợp [CategoryEndpointsTests.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/tests/CulinaryBlog.API.IntegrationTests/Endpoints/CategoryEndpointsTests.cs) xác nhận yêu cầu `_client.GetAsync("/api/v1/categories")` trả về mã `200 OK` với dữ liệu chính xác 100%.

#### c. Sinh tài liệu OpenAPI & Scalar API Reference
- Sử dụng thư viện `Microsoft.AspNetCore.OpenApi` (.NET 10) và `Scalar.AspNetCore`.
- Tài liệu JSON đặc tả API v1 được sinh tự động tại: `GET /openapi/v1.json`.
- Giao diện tra cứu và thử nghiệm API trực quan (Interactive API Documentation) của Scalar được tích hợp tại: `GET /scalar/v1`.
- Toàn bộ endpoints của Categories, Recipes, Auth đều được gắn thẻ (`Tags`), tóm tắt (`Summary`), mô tả chi tiết (`Description`), và các mã lỗi mong đợi (`Produces`, `ProducesProblem`).

---

### 3. Chi Tiết Thực Thi Phân Hệ Quản Lý Danh Mục (FR-CAT)

| Mã yêu cầu | Endpoint & Phương thức | Tác nhân & Quyền | Cơ chế Kỹ thuật | Trạng thái |
|---|---|---|---|:---:|
| **FR-CAT-001** | `GET /api/v1/categories` | Public (Mọi người) | Redis Distributed Cache (`categories:all`, TTL 60m), đếm số công thức `Status == Published && !IsDeleted`, sắp xếp theo `OrderIndex`. | ✅ Đạt 100% |
| **FR-CAT-002** | `GET /api/v1/categories/{slug}` | Public (Mọi người) | Phân quyền 3 cấp (Guest chỉ thấy Published; Author thấy Published + Draft cá nhân; Admin thấy toàn bộ), phân trang Mapster `PaginatedResult<RecipeSummaryDto>`. | ✅ Đạt 100% |
| **FR-CAT-003** | `POST /api/v1/categories` | Admin (`AdminPolicy`) | Sinh Slug SEO tiếng Việt không dấu, kiểm tra trùng tên (HTTP 409 `CATEGORY_NAME_EXISTS`), tự động xóa cache Redis (`ICacheInvalidator`). | ✅ Đạt 100% |
| **FR-CAT-004** | `PUT /api/v1/categories/{id}` | Admin (`AdminPolicy`) | Kiểm tra Optimistic Concurrency qua `RowVersion` (HTTP 409), bảo toàn `Slug` tránh broken link, xóa cache Redis. | ✅ Đạt 100% |
| **FR-CAT-005** | `DELETE /api/v1/categories/{id}` | Admin (`AdminPolicy`) | Xóa mềm (`IsDeleted = true`), kiểm tra toàn vẹn: cấm xóa nếu còn công thức active (HTTP 409 `CATEGORY_DELETE_HAS_RECIPES`), xóa cache. | ✅ Đạt 100% |

---

### 4. Xây Dựng Môi Trường, Cấu Trúc Dự Án & Thư Viện Phía Frontend

#### a. Môi trường phát triển & Thư viện sử dụng
- **Next.js 15 (App Router):** Tận dụng Server Components (RSC) cho việc render trang danh mục chuẩn SEO và Client Components cho tương tác động.
- **TypeScript 5:** Bắt buộc Strict Mode, kiểm soát chặt chẽ kiểu dữ liệu của Props, DTOs và State.
- **Tailwind CSS v3:** Hệ thống tiện ích CSS hiện đại, tối ưu giao diện Responsive và Dark/Light styling.
- **TanStack Query v5 (`@tanstack/react-query`):** Quản lý Server State, cơ chế stale-while-revalidate, tự động làm mới bộ đệm (Mutation Invalidation) khi thêm/sửa/xóa danh mục.
- **React Hook Form & Zod:** Xử lý biểu mẫu quản trị danh mục, kiểm thực đầu vào từ phía Client trước khi gửi request tới API.
- **Auth.js v5 (`next-auth`):** Quản lý phiên xác thực người dùng phía Client.
- **Lucide React:** Bộ icon giao diện sắc nét, dung lượng nhẹ.

#### b. Cấu trúc thư mục dự án Frontend chuẩn hóa
```
frontend/src/
├── app/                               <-- Next.js 15 App Router
│   ├── layout.tsx                     <-- Root Layout tích hợp Font Inter (Vietnamese), TanStack Query Provider
│   ├── page.tsx                       <-- Trang chủ
│   ├── categories/                    <-- Phân hệ Danh mục (Public)
│   │   ├── page.tsx                   <-- Danh sách toàn bộ danh mục (FR-CAT-001)
│   │   └── [slug]/page.tsx            <-- Chi tiết danh mục kèm công thức phân trang (FR-CAT-002)
│   ├── dashboard/                     <-- Bảng điều khiển Quản trị (Admin)
│   │   ├── page.tsx                   <-- Hub quản trị tổng quan
│   │   └── categories/page.tsx        <-- Quản lý CRUD Danh mục (FR-CAT-003/004/005)
│   ├── recipes/                       <-- Phân hệ Công thức (Public & Detail)
│   └── (auth)/                        <-- Các trang Đăng nhập, Đăng ký, Hồ sơ
├── components/                        <-- Reusable UI Components
│   ├── site-header.tsx                <-- Header điều hướng, hiển thị vai trò Admin & Menu
│   ├── categories/                    <-- CategoryCard, CategoryFormModal, DeleteCategoryModal
│   ├── recipes/                       <-- RecipeCard
│   └── common/                        <-- Toast, Spinner, Pagination controls
├── features/                          <-- Feature modules logic (auth, categories)
├── lib/                               <-- Tiện ích & Services
│   ├── api-client.ts                  <-- Fetch wrapper với CorrelationId & Credentials
│   └── services/category-service.ts   <-- Dịch vụ gọi API Categories (CRUD)
└── types/                             <-- Hệ thống TypeScript Types trung tâm của dự án
```

---

### 5. Hệ Thống Kiểu Dữ Liệu TypeScript (TS Types) Phía Frontend

Đã xây dựng kiến trúc kiểu dữ liệu trung tâm tại thư mục `frontend/src/types/`:

1. [common.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/common.ts):
   - `ProblemDetails`: Chuẩn hóa lỗi API theo RFC 7807 (`type`, `title`, `status`, `detail`, `errors`, `instance`).
   - `PagedResult<T>` & `PaginatedResult<T>`: Cấu trúc phân trang thống nhất (`items`, `totalCount`, `page`, `pageSize`, `totalPages`, `hasNextPage`, `hasPreviousPage`).
   - `ApiResponse<T>`: Generic response wrapper.
2. [category.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/category.ts):
   - `CategoryDto`: Thực thể danh mục kèm `recipeCount` và `rowVersion`.
   - `CategoryDetailDto` / `CategoryDetailResponseDto`: Chi tiết danh mục kèm danh sách công thức phân trang.
   - `CreateCategoryInput`: Tham số tạo mới danh mục.
   - `UpdateCategoryInput`: Tham số cập nhật danh mục kèm concurrency token.
3. [recipe.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/recipe.ts):
   - Enums: `RecipeDifficulty` (1: Dễ, 2: Trung bình, 3: Khó, 4: Chuyên gia), `RecipeStatus` (0: Draft, 1: Pending, 2: Published, 3: Archived).
   - Sub-DTOs: `RecipeNutritionDto`, `RecipeStepDto`, `RecipeIngredientDto`, `RecipeImageDto`, `RecipeAuthorSummaryDto`.
   - Aggregate DTOs: `RecipeSummaryDto`, `RecipeDetailDto`.
   - Form Inputs & Params: `CreateRecipeInput`, `UpdateRecipeInput`, `RecipeFilterParams`, `SearchRecipesParams`.
4. [auth.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/auth.ts):
   - `UserRole`, `UserProfile`, `AuthResponse`, `LoginInput`, `RegisterInput`, `UpdateProfileInput`, `RefreshTokenResponse`.
5. [index.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/types/index.ts):
   - Barrel export cho phép import trực tiếp ngắn gọn: `import { CategoryDto, RecipeSummaryDto } from '@/types';`.
6. [frontend/src/lib/types/category.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/types/category.ts):
   - Re-export toàn bộ kiểu từ `@/types` để bảo toàn tính tương thích ngược cho các component hiện có.

---

### 6. Cập Nhật & Hoàn Thiện Bản Đồ Mã Nguồn (Code Map)

Tệp [CODE_MAP_SELECTION.md](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/doc/CODE_MAP_SELECTION.md) đã được tái cấu trúc hoàn chỉnh dựa trên **Bộ 5 Quy Tắc Vàng của Code Map**:
- Bổ sung khối `# PROJECT CODE MAP` theo định dạng YAML rút gọn (`...`), loại bỏ toàn bộ phần thân method/function, chỉ giữ lại định nghĩa khung xương và chữ ký hàm.
- Sắp xếp và xếp hạng các tệp theo thuật toán PageRank ưu tiên các Core Entities, Handlers, Endpoints và Types được gọi nhiều nhất.
- Lược bỏ toàn bộ thư mục nhiễu (`bin/`, `obj/`, `node_modules/`, `.next/`).
- Dung lượng token được kiểm soát tối ưu (~2.000 tokens), đóng vai trò như bản đồ địa hình định vị tức thì cho các mô hình AI Coding mà không gây tràn context window hay sinh lỗi ảo giác.

---

## III. KẾT QUẢ KIỂM THỬ VÀ NGHIỆM THU (VERIFICATION & TESTING)

### 1. Kiểm thử Tự động Backend (`dotnet test CulinaryBlog.sln`)
Hệ thống giải pháp Backend (.NET 10) đã đồng bộ đầy đủ 5 dự án kiểm thử tự động, kết quả thực thi đạt **100% GREEN (177/177 Tests Passed)**:

| Dự án Kiểm thử | Phạm vi & Tầng kiến trúc | Số test cases | Kết quả | Thời gian |
|---|---|:---:|:---:|:---:|
| **`CulinaryBlog.Domain.Tests`** | Domain Model Invariants, Value Objects | 16 / 16 | **PASSED** | 0.2s |
| **`CulinaryBlog.Application.Tests`** | CQRS Handlers, FluentValidation, Auth Handlers | 72 / 72 | **PASSED** | 4.0s |
| **`CulinaryBlog.Infrastructure.Tests`** | Bogus Deterministic Seeder (SEED=42), Repositories | 29 / 29 | **PASSED** | 27.0s |
| **`CulinaryBlog.UnitTests`** | Category CQRS, Redis Cache, Diacritics FTS, RFC 7807 | 55 / 55 | **PASSED** | 4.0s |
| **`CulinaryBlog.API.IntegrationTests`** | API Endpoints E2E (`GET /api/v1/categories`, Slug, Cache) | 5 / 5 | **PASSED** | 7.0s |
| **TỔNG CỘNG** | **Toàn bộ hệ thống Backend** | **177 / 177** | **100% GREEN** | **~42.2s** |

### 2. Biên dịch & Kiểm tra Kiểu Frontend (`npm run build`)
- Thực hiện kiểm tra TypeScript Type Checking và Production Build cho Next.js 15:
  ```bash
  cd frontend
  npm run build
  ```
- **Kết quả:** Biên dịch thành công 100% (Mã thoát 0). Tất cả 12 static/dynamic routes được sinh hoàn chỉnh, không có bất kỳ lỗi cú pháp, linting hay type error nào.

---

## IV. ĐÁNH GIÁ & KẾ HOẠCH BƯỚC TIẾP THEO (TUẦN 6)

### 1. Đánh giá tiến độ
- Mọi yêu cầu được giao trong Tuần 5 đều được hoàn thành xuất sắc, vượt mức kế hoạch về tính chỉn chu của kiến trúc bảo mật (Two-Tier Rate Limiting), tài liệu API tự động (Scalar UI) và chuẩn hóa kiểu dữ liệu TypeScript.
- Phân hệ Danh mục (FR-CAT) đã hoàn thiện cả 2 đầu Backend và Frontend, sẵn sàng phục vụ làm nền tảng cho việc phân loại món ăn của phân hệ Công thức (FR-RCP).

### 2. Kế hoạch công việc Tuần 6
- Hoàn thiện và ghép nối giao diện Soạn thảo Công thức (Recipe Editor Form) với đầy đủ các bước thực hiện, nguyên liệu và thông tin dinh dưỡng.
- Tích hợp tính năng Upload ảnh công thức qua MinIO S3 Object Storage (`FR-FILE`).
- Triển khai tối ưu SEO nâng cao: JSON-LD Schema.org cho Recipe và Category (`NFR-SEO`), sinh Sitemap tự động và thẻ OpenGraph meta tags.
- Bổ sung thêm các Integration Test trường hợp ngoại lệ cho phân hệ Quản trị danh mục.
