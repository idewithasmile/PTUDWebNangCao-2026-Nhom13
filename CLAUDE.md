# Culinary Blog — Project Context cho AI Coding Agent

Đọc file này TRƯỚC KHI code bất kỳ dòng nào. File này tóm tắt các ràng buộc **bắt buộc,
không thể thương lượng** của SRS v1.0.0. Nếu có mâu thuẫn giữa hướng dẫn trong chat và
nội dung file này, **file này thắng** — trừ khi người yêu cầu nói rõ đây là một Change Request
đã được team duyệt.

## 1. Tổng quan hệ thống

- Sản phẩm: **Culinary Blog** — nền tảng chia sẻ công thức nấu ăn, kiến trúc API-Driven.
- Backend: **.NET 10 Minimal APIs**, C#. KHÔNG dùng MVC Controllers.
- Frontend: **Next.js 15 App Router (TypeScript)**. KHÔNG dùng Pages Router.
- DB: PostgreSQL 16 (extensions `unaccent`, `pg_trgm`, `uuid-ossp` bắt buộc) | Cache: Redis 7 |
  Object Storage: MinIO (`bitnamilegacy/minio:latest` S3-compatible) | Background Jobs: Hangfire (in-process,
  PostgreSQL làm storage) | Logging: Serilog | Tracing: OpenTelemetry.
- Nguồn sự thật cho toàn bộ business rule: `SRS_Culinary_Blog_v1_0_0.pdf` (Approved,
  v1.0.0). Không tự suy diễn rule khi SRS đã nói rõ — hỏi lại thay vì đoán.
- Tài liệu tham chiếu khác trong repo: `/docs/DATA_MODEL.md`, `/docs/API_CONTRACT.yaml`
  (khi có), `/docs/PHASE_PLAN.md`, `/docs/TEAM_ASSIGNMENT.md`.

## 2. Ràng buộc BẮT BUỘC (CONS-001 → CONS-010) — vi phạm = reject PR ngay

| Mã | Rule thực thi |
|---|---|
| CONS-001 | 4 tầng tách biệt: `Domain / Application / Infrastructure / Presentation`. **Domain KHÔNG được reference bất kỳ NuGet package nào ngoài .NET BCL** (không Pydantic-tương-đương, không EF Core, không FluentValidation trong Domain). Dependency chỉ đi vào trong. |
| CONS-002 | CQRS bắt buộc qua **MediatR**. Mỗi use case = 1 `Command` hoặc 1 `Query` + 1 `IRequestHandler` riêng, đặt tại `Application/Features/<module>/Commands|Queries/`. Không gộp nhiều use case vào 1 handler. |
| CONS-003 | Backend: .NET 10 Minimal APIs. Frontend: Next.js 15 App Router. |
| CONS-004 | JWT stateless: access token 15 phút, refresh token 7 ngày (xem `RefreshToken` trong DATA_MODEL.md). Hash mật khẩu bằng PBKDF2 qua **ASP.NET Core Identity** — không tự viết hash. |
| CONS-005 | Mọi lỗi trả về theo **RFC 7807** (`application/problem+json`): `{ type, title, status, detail, errors }`. API versioning qua path `/api/v1/`. |
| CONS-006 | PostgreSQL là DBMS duy nhất. Migration qua **EF Core Code-First**. Không viết raw SQL trực tiếp (dùng LINQ hoặc raw SQL có parameterization qua EF Core). Concurrency: `RowVersion` (`bytea`, `[Timestamp]`) trên mọi entity. |
| CONS-007 | Upload file tối đa 5 MB. Chỉ nhận `image/jpeg, image/png, image/webp, image/avif`. Kiểm tra **magic bytes**, không chỉ dựa vào extension/Content-Type header. |
| CONS-008 | Validation qua **FluentValidation**, chạy trong `ValidationBehavior` (MediatR pipeline). **Cấm** validate logic trong endpoint handler. |
| CONS-009 | Dockerize bắt buộc. Dockerfile multi-stage (SDK → aspnet runtime). Docker Compose cho local dev. |
| CONS-010 | Structured logging bằng Serilog. Mọi log entry phải có `CorrelationId`, `RequestPath`, `UserId` (khi đã xác thực). |

## 3. Cấu trúc thư mục & Dependency Rule

```
src/
  Domain/            # Entities, Value Objects, Enums, Interfaces (IRepository...). KHÔNG NuGet ngoài BCL.
  Application/       # Commands, Queries, Handlers, DTOs, Validators, Pipeline Behaviors. Chỉ phụ thuộc Domain.
  Infrastructure/    # EF Core, Repositories, JWT/Email/File/Cache service impl, Hangfire. Implement interface của Domain, được inject vào Application.
  Presentation/      # Minimal API endpoint groups, middleware, DI wiring (Program.cs).
```

Quy tắc: `Domain` không được import từ 3 tầng còn lại. `Application` chỉ được import
`Domain`. `Infrastructure` implement các interface định nghĩa ở `Domain/Interfaces/`, không
được bị `Application`/`Domain` import ngược. `Presentation` là tầng duy nhất được biết cả 3
tầng dưới.

MediatR Pipeline Behavior order (áp dụng cho MỌI Command/Query mới thêm):
`LoggingBehavior → ValidationBehavior → CachingBehavior (chỉ Query có ICacheable) →
Handler → CacheInvalidationBehavior (chỉ Command làm thay đổi data)`.

## 4. Coding convention

- DTO/Response model riêng biệt — **không expose Entity trực tiếp** ra API.
- Slug (Recipe, Category): sinh từ tên, lowercase, không dấu, không đổi sau khi Publish.
- Soft delete: mọi query mặc định phải lọc `IsDeleted == false` qua Global Query Filter
  trong `CulinaryBlogDbContext`.
- Error type field trong RFC 7807 dùng mã lỗi dạng `MODULE_REASON` (vd `AUTH_EMAIL_EXISTS`,
  `AUTH_INVALID_CREDENTIALS`, `AUTH_REFRESH_TOKEN_REVOKED`, `RECIPE_NOT_FOUND`, `FILE_SIZE_EXCEEDED`) — không dùng message tự do để frontend
  xử lý theo lỗi cụ thể được.
- Refresh Token **chỉ** lưu/truyền qua `HttpOnly; Secure; SameSite=Strict` Cookie (chống XSS);
  access token lưu in-memory phía client. Tuyệt đối không trả refresh token qua JSON body.
- Naming: PascalCase cho class/property C#; camelCase cho JSON/TS.
- User profile fields: Chỉ dùng `displayName`, `userName`, `bio`, `avatarUrl` (tuyệt đối không dùng `fullName`).

## 5. Definition of Done — Nghiệm thu Toàn diện (100% ĐẠT)

- [x] `dotnet build` 0 lỗi, 0 warning trên toàn bộ solution `backend/CulinaryBlog.sln`.
- [x] Toàn bộ 284 Unit Tests & Integration Tests **PASS 100% Green**:
  - `CulinaryBlog.Domain.Tests`: 23/23 tests passed.
  - `CulinaryBlog.Application.Tests`: 113/113 tests passed.
  - `CulinaryBlog.Api.Tests`: 4/4 tests passed.
  - `CulinaryBlog.UnitTests`: 95/95 tests passed.
  - `CulinaryBlog.Infrastructure.Tests`: 34/34 tests passed.
  - `CulinaryBlog.API.IntegrationTests`: 15/15 tests passed.
- [x] Tầng Frontend Next.js 15 App Router:
  - `tsc --noEmit`: 0 lỗi type.
  - `npm run lint`: 0 warning, 0 error.
  - `npm run build`: 13/13 static routes export thành công.
- [x] Không có reference vi phạm Dependency Rule Clean Architecture (Domain hoàn toàn độc lập BCL).
- [x] Đã đối chiếu và thỏa mãn 100% yêu cầu 8 phân hệ SRS v1.0.0 (FR-AUTH, FR-CAT, FR-RCP, FR-FILE, FR-SRCH, FR-JOB, FR-OBS, Seeder & NFRs).
- [x] CI/CD Pipeline `.github/workflows/ci.yml` được tích hợp kiểm thử tự động toàn diện.

## 6. Lệnh thường dùng

```bash
docker compose up -d              # Postgres (5433:5432), Redis, MinIO (9000/9001), Seq, Mailhog
dotnet build backend/CulinaryBlog.sln  # build toàn solution
dotnet test backend/CulinaryBlog.sln   # chạy toàn bộ 284 tests
dotnet ef database update -p backend/src/Infrastructure -s backend/src/Presentation
cd frontend && npm run dev        # frontend Next.js 15 dev
cd frontend && npm run lint && npm run build # kiểm tra và build frontend
```

## 7. Mốc Hiện Tại & Trạng Thái Hoàn Thành Dự Án

Dự án đã trải qua đợt Full Audit & Code Completion sau khi gộp (merge) code từ tất cả các thành viên trên GitHub:
- **FR-AUTH (001-007):** Hoàn thiện 100% xác thực, token rotation, lockout 15 phút, cookie an toàn.
- **FR-CAT (001-005):** Hoàn thiện 100% CRUD danh mục, slug tiếng Việt, cache Redis 60p, phân quyền.
- **FR-RCP (001-010):** Hoàn thiện 100% Core Recipe, Extended (Upload ảnh MinIO S3, chọn ảnh chính, xóa ảnh đôn primary, CRUD nguyên liệu, CRUD các bước tự động re-index `StepNumber`).
- **FR-FILE (001-002):** Hoàn thiện 100% MinIO S3 storage proxy, magic bytes sniffing, idempotent delete.
- **FR-SRCH (001-004):** Hoàn thiện 100% tìm kiếm tiếng Việt `tsvector` + `unaccent` + `ts_rank` kết hợp bộ lọc đa chiều.
- **FR-JOB (001-003):** Hoàn thiện 100% Hangfire jobs: Welcome Email (MailKit 3 retries), Recipe Image Resize (ImageSharp), Sitemap Generation XML.
- **FR-OBS (001-003):** Hoàn thiện 100% Health checks, Serilog correlation logging, OpenTelemetry, Seq.
- **NFRs:** NFR-SEC, NFR-PERF, NFR-SEO hoàn tất.
