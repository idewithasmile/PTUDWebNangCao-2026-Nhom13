# Culinary Blog — Project Context cho AI Coding Agent

Đọc file này TRƯỚC KHI code bất kỳ dòng nào. File này tóm tắt các ràng buộc **bắt buộc,
không thể thương lượng** của SRS v1.0.0. Nếu có mâu thuẫn giữa hướng dẫn trong chat và
nội dung file này, **file này thắng** — trừ khi người yêu cầu nói rõ đây là một Change Request
đã được team duyệt.

## 1. Tổng quan hệ thống

- Sản phẩm: **Culinary Blog** — nền tảng chia sẻ công thức nấu ăn, kiến trúc API-Driven.
- Backend: **.NET 10 Minimal APIs**, C#. KHÔNG dùng MVC Controllers.
- Frontend: **Next.js App Router (TypeScript)**. KHÔNG dùng Pages Router.
- DB: PostgreSQL 16 (extensions `unaccent`, `pg_trgm` bắt buộc) | Cache: Redis 7 |
  Object Storage: MinIO (S3-compatible) | Background Jobs: Hangfire (in-process,
  PostgreSQL làm storage) | Logging: Serilog | Tracing: OpenTelemetry.
- Nguồn sự thật cho toàn bộ business rule: `SRS_Culinary_Blog_v1_0_0.pdf` (Approved,
  v1.0.0). Không tự suy diễn rule khi SRS đã nói rõ — hỏi lại thay vì đoán.
- Tài liệu tham chiếu khác trong repo: `/docs/DATA_MODEL.md`, `/docs/API_CONTRACT.yaml`
  (khi có), `/docs/PHASE_PLAN.md`, `/docs/TEAM_ASSIGNMENT.md`.

## 2. Ràng buộc BẮT BUỘC (CONS-001 → CONS-010) — vi phạm = reject PR ngay

| Mã | Rule thực thi |
|---|---|
| CONS-001 | 4 tầng tách biệt: `Domain / Application / Infrastructure / Presentation`. **Domain KHÔNG được reference bất kỳ NuGet package nào ngoài .NET BCL** (không Pydantic-tương-đương, không EF Core, không FluentValidation trong Domain). Dependency chỉ đi vào trong. |
| CONS-002 | CQRS bắt buộc qua **MediatR**. Mỗi use case = 1 `Command` hoặc 1 `Query` + 1 `IRequestHandler` riêng, đặt tại `application/features/<module>/commands|queries/`. Không gộp nhiều use case vào 1 handler. |
| CONS-003 | Backend: .NET 10 Minimal APIs. Frontend: Next.js App Router. |
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
  domain/            # Entities, Value Objects, Enums, Interfaces (IRepository...). KHÔNG NuGet ngoài BCL.
  application/        # Commands, Queries, Handlers, DTOs, Validators, Pipeline Behaviors. Chỉ phụ thuộc Domain.
  infrastructure/      # EF Core, Repositories, JWT/Email/File/Cache service impl, Hangfire. Implement interface của Domain, được inject vào Application.
  presentation/        # Minimal API endpoint groups, middleware, DI wiring (Program.cs).
```

Quy tắc: `domain` không được import từ 3 tầng còn lại. `application` chỉ được import
`domain`. `infrastructure` implement các interface định nghĩa ở `domain/interfaces/`, không
được bị `application`/`domain` import ngược. `presentation` là tầng duy nhất được biết cả 3
tầng dưới.

MediatR Pipeline Behavior order (áp dụng cho MỌI Command/Query mới thêm):
`LoggingBehavior → ValidationBehavior → CachingBehavior (chỉ Query có `ICacheable`) →
Handler → CacheInvalidationBehavior (chỉ Command làm thay đổi data)`.

## 4. Coding convention

- DTO/Response model riêng biệt — **không expose Entity trực tiếp** ra API.
- Slug (Recipe, Category): sinh từ tên, lowercase, không dấu, không đổi sau khi Publish.
- Soft delete: mọi query mặc định phải lọc `IsDeleted == false` (chưa có Global Query Filter
  sẵn như EF Core — phải tự áp dụng nhất quán ở base repository, xem README.md gap #2).
- Error type field trong RFC 7807 dùng mã lỗi dạng `MODULE_REASON` (vd `AUTH_EMAIL_EXISTS`,
  `AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_EXPIRED`) — không dùng message tự do để frontend
  xử lý theo lỗi cụ thể được.
- Naming: PascalCase cho class/property C#; camelCase cho JSON/TS.

## 5. Definition of Done — mọi task agent làm xong phải thỏa cả 6 mục

- [ ] `dotnet build` không lỗi, không warning mới.
- [ ] Unit test cho Handler mới (happy path + ít nhất 1 lỗi nghiệp vụ).
- [ ] Nếu là Command/Query có endpoint: có Integration test gọi qua endpoint thật.
- [ ] Không có reference vi phạm Dependency Rule (chạy architecture test nếu đã có).
- [ ] Mô tả PR ghi rõ đã thỏa mãn **FR/CONS code** nào (vd "Thoả FR-CAT-003, CONS-002,
      CONS-008").
- [ ] Không sửa file ngoài phạm vi module được giao trong `/docs/TEAM_ASSIGNMENT.md`
      (tránh conflict giữa 4 thành viên).

## 6. Lệnh thường dùng

```bash
docker compose up -d              # Postgres, Redis, MinIO, Seq, Mailhog
dotnet build                      # build toàn solution
dotnet test                       # chạy toàn bộ test
dotnet ef migrations add <Name> -p src/Infrastructure -s src/Presentation
dotnet ef database update -p src/Infrastructure -s src/Presentation
npm run dev                       # frontend (trong thư mục frontend/)
npm run build && npm run lint
```

## 7. Khi không chắc chắn

Nếu SRS không nói rõ một chi tiết (vd tên field phụ, thứ tự param), **dừng lại và hỏi**
thay vì tự quyết — nhất là với các quy tắc CONS ở trên, vì đây là đồ án được chấm điểm theo
đúng SRS, sai lệch kiến trúc sẽ bị trừ điểm trực tiếp.
