# 🍳 Culinary Blog - Nền tảng Chia sẻ Công thức Nấu ăn

Chào mừng đội ngũ phát triển đến với dự án **Culinary Blog**! 
Đây là tài liệu hướng dẫn khởi tạo dự án, kiến trúc tổng quan, quy tắc nghiệp vụ và **bảng theo dõi tiến độ hoàn thiện 100%** dựa trên SRS v1.0.0 và báo cáo phân tích kỹ thuật SPEC sau đợt audit & gộp nhánh toàn dự án.

---

## 📊 Bảng Theo Dõi Hiện Trạng & Tiến Độ SRS v1.0.0 (100% Hoàn Thành)

| Phân hệ / Yêu cầu | Mô tả kỹ thuật cốt lõi | Backend (.NET 10) | Frontend (Next.js 15) | Trạng thái |
|---|---|:---:|:---:|:---:|
| **FR-AUTH (001-007)** | Đăng ký, Đăng nhập (khóa 15p khi sai 5 lần), Google OAuth, Refresh Token (RTR & Cookie HttpOnly Strict), Logout, Profile (`displayName`, `bio`, MinIO Avatar) | ✅ 7 Endpoints Minimal APIs | ✅ `/login`, `/register`, `/profile`, Zustand store | **100% Hoàn tất** |
| **FR-CAT (001-005)** | CRUD Danh mục, Slug tiếng Việt SEO, Phân quyền 3 cấp (Guest/Author/Admin), Redis Distributed Cache `categories:all` (60p) | ✅ 5 Endpoints Minimal APIs | ✅ `/categories`, `/categories/[slug]`, Modal Admin | **100% Hoàn tất** |
| **FR-RCP Core (001-007)** | Danh sách phân trang, Chi tiết (Eager loading, Output Cache `recipes`), Tạo mới Draft, Sửa (RowVersion concurrency), Publish (Validate $\ge 1$ step), Soft Delete | ✅ 7 Endpoints Minimal APIs | ✅ `/recipes`, `/recipes/[slug]`, `/recipes/create`, `/recipes/[slug]/edit` | **100% Hoàn tất** |
| **FR-RCP Ext & FR-FILE** | Upload ảnh MinIO S3 (Magic bytes sniffing, $\le 5$MB), Chọn ảnh chính, Xóa ảnh tự đôn primary; Quản lý Nguyên liệu & Các bước (Auto re-index `StepNumber`) | ✅ 8 Endpoints Minimal APIs, `MinioFileStorageService` | ✅ `RecipeImageGalleryManager`, Form CRUD steps/ingredients | **100% Hoàn tất** |
| **FR-SRCH (001-004)** | Tìm kiếm Full-Text tiếng Việt PostgreSQL `tsvector` + `unaccent` + `ts_rank`, bộ lọc Category, Difficulty, Prep/Cook time | ✅ Query Handler chuyên biệt | ✅ Đồng bộ Search Bar & Filters qua URL Query params | **100% Hoàn tất** |
| **FR-JOB (001-003)** | `WelcomeEmailJob` (MailKit 3 retries), `RecipeImageResizeJob` (ImageSharp 300x300, 800x600), `SitemapGenerationJob` (02:00 AM UTC, `/sitemap.xml`) | ✅ Hangfire Background Jobs + Dashboard auth | ✅ Tự động kích hoạt khi có sự kiện backend | **100% Hoàn tất** |
| **FR-OBS (001-003)** | Health checks (`/health`, `/health/ready`, `/health/live`), Serilog Structured Logging (`CorrelationId`, `UserId`), OpenTelemetry, Seq Dashboard | ✅ Middlewares & Endpoints | ✅ Truyền `X-Correlation-ID`, chuẩn RFC 7807 | **100% Hoàn tất** |
| **Seeder Dữ liệu mẫu** | Tự động sinh dữ liệu khởi tạo khi chạy ứng dụng: Admin, Author, Categories, Recipes mẫu kèm Nutrition, Steps, Ingredients | ✅ `DbInitializer` / `DatabaseSeeder` | ✅ Hiển thị đầy đủ trên giao diện người dùng | **100% Hoàn tất** |
| **NFR-SEC & NFR-PERF** | Two-tier Rate Limiting, CORS strict, In-memory Access Token + HttpOnly Cookie Refresh Token, Redis Cache & Output Cache | ✅ Configured | ✅ Configured | **100% Hoàn tất** |
| **NFR-SEO** | Meta tags, Open Graph, JSON-LD Schema.org `@type: "Recipe"`, ISR `revalidate = 300`, `GET /sitemap.xml` | ✅ Endpoint XML | ✅ `generateMetadata`, JSON-LD script, ISR config | **100% Hoàn tất** |

### 🧪 Báo cáo Kiểm thử Tự động & Chất lượng Mã nguồn
- **Tổng số Unit & Integration Tests Backend:** **284 / 284 PASSED (100% GREEN, 0 Failed, 0 Skipped)**
  - `CulinaryBlog.Domain.Tests`: **23/23 tests passed**
  - `CulinaryBlog.Application.Tests`: **113/113 tests passed**
  - `CulinaryBlog.Api.Tests`: **4/4 tests passed**
  - `CulinaryBlog.UnitTests`: **95/95 tests passed**
  - `CulinaryBlog.Infrastructure.Tests`: **34/34 tests passed** (Bao gồm kiểm thử Hangfire Jobs & Sitemap)
  - `CulinaryBlog.API.IntegrationTests`: **15/15 tests passed** (Bao gồm kiểm thử Observability & `/sitemap.xml`)
- **Frontend Code Quality & Production Build:**
  - TypeScript Check (`tsc --noEmit`): **0 Errors**
  - Linter (`npm run lint`): **0 Warnings, 0 Errors**
  - Next.js Production Build (`npm run build`): **13/13 static routes generated thành công**
- **Continuous Integration (CI):** File cấu hình `.github/workflows/ci.yml` tự động build và test cả Backend (.NET 10) và Frontend (Next.js 15) trên GitHub Actions.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

Hệ thống được thiết kế theo mô hình **API-Driven Architecture**, tách biệt hoàn toàn giữa Frontend và Backend.

### Backend (Clean Architecture + CQRS)
- **Framework:** .NET 10 (Minimal APIs, C#)
- **Database:** PostgreSQL 16 (Entity Framework Core 10, Code-First, extensions `unaccent`, `pg_trgm`, `uuid-ossp`)
- **Cache:** Redis 7 (Distributed Cache & Redis Backed Output Cache)
- **Object Storage:** MinIO S3-Compatible (`bitnamilegacy/minio:latest`)
- **Background Jobs:** Hangfire (in-process, PostgreSQL storage)
- **Observability:** Serilog (Structured Logging), OpenTelemetry (Tracing)

### Frontend
- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS, shadcn/ui primitives
- **State Management & Data Fetching:** TanStack Query v5 (React Query), Zustand
- **Authentication:** Auth.js v5 (NextAuth) + Custom JWT In-Memory Store
- **Form Handling:** React Hook Form + Zod

### Deployment & DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server / Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)

---

## ⚙️ Yêu cầu Môi trường (Prerequisites)

Để chạy dự án trên máy cá nhân (Local Development), bạn cần cài đặt:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Bắt buộc để chạy DB, Redis, MinIO, Seq, MailHog).
2. **[.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)**.
3. **[Node.js 22 LTS](https://nodejs.org/)** (hoặc tối thiểu v20) và `npm` v10+.
4. **IDE khuyến nghị:** Visual Studio 2022 v17.12+ / JetBrains Rider / VS Code (với C# Dev Kit & ESLint, Prettier extensions).
5. **Git** (khuyến nghị có Git LFS).

---

## 🛠 Hướng dẫn Cài đặt & Chạy dự án (Getting Started)

### Bước 1: Khởi động Hạ tầng (Infrastructure)
Dự án sử dụng Docker Compose để tự động dựng PostgreSQL, Redis, MinIO, Seq và MailHog:

```bash
# Di chuyển vào thư mục chứa file docker-compose.yml
cd infrastructure

# Khởi động các dịch vụ ngầm
docker compose up -d
```
*Các cổng dịch vụ mặc định:*
- **PostgreSQL 16:** `5433 -> 5432` (kết nối qua `localhost:5433` hoặc container nội bộ `5432`)
- **Redis 7:** `6379`
- **MinIO S3 API:** `9000` | **MinIO Console UI:** `9001` (User: `minioadmin` / Pass: `minioadmin`)
- **Seq Log Dashboard:** `5341`
- **MailHog SMTP:** `1025` | **MailHog Web UI:** `8025`

### Bước 2: Chạy Backend API (.NET 10)
```bash
# Di chuyển vào thư mục Backend (project CulinaryBlog.API nằm ở src/Presentation)
cd backend/src/Presentation

# Khôi phục các packages
dotnet restore

# Chạy Entity Framework Migrations để tạo cấu trúc Database
dotnet ef database update -p ../Infrastructure

# Khởi chạy API
dotnet run
```
*API sẽ chạy tại: `http://localhost:5000/api/v1`* (Giao diện Scalar OpenAPI có tại `http://localhost:5000/scalar`).

Chạy toàn bộ 284 bài test tự động:
```bash
cd backend
dotnet test CulinaryBlog.sln
```

### Bước 3: Chạy Frontend (Next.js 15)
```bash
# Di chuyển vào thư mục Frontend
cd frontend

# Cài đặt dependencies
npm install

# Khởi chạy Next.js ở chế độ phát triển
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:3000`*

Kiểm tra linter và build tĩnh sản phẩm:
```bash
npm run lint
npm run build
```

---

## 🚨 Quy ước Phát triển Quan trọng (BẮT BUỘC ĐỌC)

Dựa trên phân tích kiến trúc (SPEC.md) và ràng buộc kỹ thuật (CONS-001 → CONS-010):

### 1. Quản lý Dữ liệu (Soft Delete & Optimistic Concurrency)
- **Công thức (Recipe) và Danh mục (Category) PHẢI sử dụng Soft Delete.**
- Tuyệt đối **không** dùng `DbContext.Remove()`. Thay vào đó, gán `IsDeleted = true` và `UpdatedAt = DateTime.UtcNow`.
- Các Entity con (Steps, Ingredients) được tự động ẩn nhờ Global Query Filter `.Where(x => !x.IsDeleted)` thiết lập ở `DbContext`.
- Kiểm soát xung đột sửa đổi đồng thời qua cột `RowVersion` (`bytea`, `[Timestamp]`) trả lỗi `409 Conflict`.

### 2. Chiến lược Cache (Stateless)
- **Chỉ sử dụng Redis** (`IDistributedCache` / `RedisCacheService`) cho mọi tác vụ caching (Recipe, Category).
- Tuyệt đối **KHÔNG sử dụng `IMemoryCache`** để đảm bảo Backend hoàn toàn Stateless khi scale out.
- Sử dụng Output Cache của .NET 10 với tag `"recipes"` và cấu hình dùng Redis làm Backing Store.

### 3. Bảo mật Token & Authentication
- **Access Token (JWT - 15 phút):** Frontend lưu trong In-Memory / React State.
- **Refresh Token (7 ngày):** **PHẢI** được trả về và đọc thông qua **`HttpOnly`, `Secure`, `SameSite=Strict` Cookie**. Tuyệt đối không trả Refresh Token qua JSON Body để phòng chống tấn công XSS.
- Mật khẩu băm bằng PBKDF2 qua ASP.NET Core Identity.

### 4. Xử lý File Upload (Ảnh MinIO S3)
- Toàn bộ ảnh tải lên **PHẢI** đi qua endpoint của Backend (`POST /api/v1/recipes/{id}/images` hoặc `POST /api/v1/files/upload`).
- Backend kiểm tra dung lượng ($\le 5$MB), MIME type, và **đọc Magic Bytes (4 bytes đầu)** (JPEG, PNG, WebP, AVIF) để chặn file độc hại trước khi lưu trữ lên MinIO.
- Xóa ảnh trên MinIO với cơ chế Idempotent và Retry 3 lần.

### 5. Chuẩn hóa Tên biến (Naming Convention)
- Thông tin cá nhân của `ApplicationUser` sử dụng thống nhất 2 trường: **`displayName`** và **`bio`** (Tuyệt đối không dùng `fullName`). DTO mapping giữa Frontend và Backend phải tuân thủ tên này.

### 6. Mã phản hồi lỗi HTTP (Status Codes)
Hệ thống sử dụng chuẩn **RFC 7807 Problem Details** (`application/problem+json`):
- `400 Bad Request`: Các lỗi do dữ liệu đầu vào (Validation Failures từ FluentValidation).
- `401 Unauthorized`: Lỗi xác thực token hoặc hết hạn session.
- `403 Forbidden`: Người dùng không có quyền trên tài nguyên (không phải tác giả hoặc không phải Admin).
- `404 Not Found`: Không tìm thấy tài nguyên.
- `409 Conflict`: Xung đột dữ liệu (`RowVersion` mismatch, Email/Slug trùng lặp).
- `422 Unprocessable Entity`: Dữ liệu đúng cú pháp nhưng vi phạm quy tắc nghiệp vụ (ví dụ: *Publish công thức nhưng chưa có bước thực hiện nào*).
- `423 Locked`: Tài khoản bị khóa tạm thời 15 phút sau 5 lần đăng nhập thất bại liên tiếp.
- `429 Too Many Requests`: Vượt ngưỡng giới hạn tần suất yêu cầu (Rate Limiting).

---

## 📁 Cấu trúc Thư mục (Folder Structure)

```text
culinary-blog/
├── backend/                         # .NET 10 Solution
│   ├── src/
│   │   ├── Domain/                  # Entities, Enums, Value Objects (Pure BCL, CONS-001)
│   │   ├── Application/             # CQRS (MediatR), DTOs, FluentValidation, Pipeline Behaviors
│   │   ├── Infrastructure/          # EF Core 10 DbContext, Redis, MinIO, Hangfire, MailKit, ImageSharp
│   │   └── Presentation/            # Minimal APIs, Middlewares, DI Setup, Program.cs
│   └── tests/
│       ├── CulinaryBlog.Domain.Tests
│       ├── CulinaryBlog.Application.Tests
│       ├── CulinaryBlog.Api.Tests
│       ├── CulinaryBlog.UnitTests
│       ├── CulinaryBlog.Infrastructure.Tests
│       └── CulinaryBlog.API.IntegrationTests
├── frontend/                        # Next.js 15 Application (App Router)
│   ├── src/app                      # App Router pages (/recipes, /categories, /profile, /login, /dashboard)
│   ├── src/components               # Reusable UI components (Tailwind, shadcn/ui, recipes, categories)
│   ├── src/features                 # Auth & Recipe feature hooks (TanStack Query)
│   ├── src/lib                      # API Client, Services (recipe-service, file-service, auth-service)
│   ├── src/stores                   # Zustand stores (auth-store, ui-store)
│   └── src/types                    # TypeScript interfaces & DTOs
├── infrastructure/                  # Docker configuration
│   ├── docker-compose.yml           # Postgres, Redis, MinIO, Seq, MailHog
│   └── nginx/
├── .github/workflows/               # GitHub Actions CI/CD Pipeline
│   └── ci.yml
└── docs/                            # SRS, Specifications, Database Diagram
```

---

## 🔗 Các liên kết hữu ích trong quá trình Dev & Vận hành
- **API Documentation (Scalar UI):** `http://localhost:5000/scalar`
- **Hangfire Dashboard (Quản lý Job):** `http://localhost:5000/hangfire` (Môi trường Dev mở tự do; Production yêu cầu role Admin)
- **MinIO Console (Quản lý File S3):** `http://localhost:9001` (User: `minioadmin` / Pass: `minioadmin`)
- **Seq Log Dashboard:** `http://localhost:5341`
- **MailHog Web UI (Xem email phát sinh):** `http://localhost:8025`
- **Sitemap XML:** `http://localhost:5000/sitemap.xml`
- **Health Checks:** `http://localhost:5000/health`, `/health/ready`, `/health/live`

---

# TEAM_ASSIGNMENT.md — Phân công 4 thành viên & Kết quả nghiệm thu

## Bảng phân công theo tuần & Trạng thái nghiệm thu

| Tuần | Module | FR/NFR | Phụ trách chính | Hỗ trợ | Trạng thái Nghiệm thu |
|---|---|---|---|---|:---:|
| 0 | Scaffold codebase | — | Cả 4 người review kết quả AI Agent tạo, chạy thử local | — | ✅ 100% Hoàn thành |
| 1 | Domain entities + EF configs | Ch.7 | Trần Ngọc Bảo Phước, Nguyễn Thành Minh, Đặng Nam Huy | Trịnh Trung Hiếu | ✅ 100% Hoàn thành |
| 1 | **FR-AUTH** (đăng ký, login, Google OAuth, refresh, logout, profile) | 7 FR | **Trịnh Trung Hiếu** | — | ✅ 100% Hoàn thành |
| 2 | **FR-CAT** (CRUD danh mục, cần role Admin) | 5 FR | **Trần Ngọc Bảo Phước** | Trịnh Trung Hiếu | ✅ 100% Hoàn thành |
| 2 | **FR-FILE** (upload/xóa ảnh trên MinIO S3) | 2 FR | **Đặng Nam Huy** | — | ✅ 100% Hoàn thành |
| 2–3 | **FR-RCP-001→004** (list, detail, tạo, cập nhật recipe) | 4 FR | **Nguyễn Thành Minh** | — | ✅ 100% Hoàn thành |
| 3–4 | **FR-RCP-005→007** (publish/unpublish, archive, xóa mềm) | 3 FR | **Nguyễn Thành Minh** | — | ✅ 100% Hoàn thành |
| 3–4 | **FR-RCP-008→010** (ảnh, nguyên liệu, các bước nấu) | 3 FR | **Đặng Nam Huy** | — | ✅ 100% Hoàn thành |
| 4 | **FR-SRCH** (full-text search tiếng Việt, filter, sort) | 4 FR | **Trần Ngọc Bảo Phước** | Nguyễn Thành Minh | ✅ 100% Hoàn thành |
| 2–5 | **FR-OBS** (health check, structured logging, tracing) | 3 FR | **Trịnh Trung Hiếu** | — | ✅ 100% Hoàn thành |
| 5 | **FR-JOB** (welcome email, resize ảnh ImageSharp, sitemap XML) | 3 FR | **Đặng Nam Huy** | Trịnh Trung Hiếu | ✅ 100% Hoàn thành |
| 6 | **NFR-SEO** hoàn thiện (JSON-LD Schema.org, meta tags, sitemap route, ISR) | 4 NFR | **Trần Ngọc Bảo Phước, Nguyễn Thành Minh** | — | ✅ 100% Hoàn thành |
| 6–7 | Hardening: NFR-SEC, NFR-PERF, 284 Tests, CI Pipeline, Báo cáo & Tài liệu | — | Cả 4 người | — | ✅ 100% Hoàn thành |

## Quy tắc PR/Review & DoD (Definition of Done)
- Mọi PR đã tuân thủ phạm vi module, giải quyết 100% các xung đột sau khi merge trên GitHub.
- `dotnet build` và `dotnet test` đạt **284/284 Green** trước khi đóng mốc dự án.
- Frontend đạt **0 cảnh báo Lint** và `npm run build` xuất thành công 13/13 routes tĩnh.
