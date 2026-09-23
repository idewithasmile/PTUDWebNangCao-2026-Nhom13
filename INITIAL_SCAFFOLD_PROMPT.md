# Prompt khởi tạo Codebase — chạy 1 lần duy nhất

Cách dùng: mở AI coding agent (vd Claude Code) tại thư mục repo trống, đảm bảo 3 file
`CLAUDE.md`, `docs/DATA_MODEL.md` và `SRS_Culinary_Blog_v1_0_0.pdf` đã có trong thư mục
(đặt PDF vào `docs/SRS_Culinary_Blog_v1_0_0.pdf`), rồi dán nguyên văn prompt bên dưới.

---

```
Bạn là AI coding agent khởi tạo codebase nền tảng cho dự án Culinary Blog. Đọc kỹ
CLAUDE.md và docs/DATA_MODEL.md trước khi bắt đầu — đây là rule bắt buộc, không được
vi phạm. Nếu cần chi tiết nghiệp vụ không có trong 2 file này, tra cứu
docs/SRS_Culinary_Blog_v1_0_0.pdf (chương 6-8).

MỤC TIÊU: tạo một codebase NỀN TẢNG hoàn chỉnh, để 4 lập trình viên có thể làm việc
song song trên các module riêng biệt mà không đụng file của nhau. Đây KHÔNG phải lúc
implement tính năng nghiệp vụ (Auth, Category, Recipe...) — chỉ implement phần hạ tầng
dùng chung.

PHẠM VI CẦN TẠO:

1. Backend — solution .NET 10 theo đúng 4 tầng trong CLAUDE.md (Domain/Application/
   Infrastructure/Presentation), mỗi tầng 1 project riêng, reference đúng chiều.

2. Domain layer — implement ĐẦY ĐỦ:
   - BaseEntity (abstract) đúng theo DATA_MODEL.md.
   - Toàn bộ entity: Recipe (+ RecipeNutrition owned value object), RecipeStep,
     RecipeIngredient, RecipeImage, Category, ApplicationUser, RefreshToken — đúng
     từng field/kiểu/ràng buộc trong DATA_MODEL.md, không thêm/bớt field.
   - Enum: RecipeDifficulty, RecipeStatus.
   - Interface (chưa cần implement): IRecipeRepository, ICategoryRepository,
     IApplicationUserRepository, IUnitOfWork, IJwtService, IFileStorageService,
     IEmailService, ICurrentUser, ICacheable, ICacheInvalidator.
   - Domain project KHÔNG được reference bất kỳ NuGet package nào ngoài .NET BCL.

3. Application layer — implement ĐẦY ĐỦ phần hạ tầng dùng chung (KHÔNG viết Command/
   Query nghiệp vụ cụ thể nào — để trống cho 4 thành viên tự thêm sau):
   - Common DTOs: PagedResult<T>.
   - MediatR Pipeline Behaviors HOẠT ĐỘNG THẬT (không phải stub): LoggingBehavior,
     ValidationBehavior (chạy FluentValidation), CachingBehavior (áp dụng cho Query
     implement ICacheable, dùng Redis qua interface), CacheInvalidationBehavior (áp
     dụng cho Command implement ICacheInvalidator).
   - Thư mục rỗng sẵn sàng: application/features/{auth,categories,recipes}/
     {commands,queries}/ — chỉ tạo thư mục + 1 file .gitkeep, không tạo class nghiệp
     vụ bên trong.

4. Infrastructure layer — implement ĐẦY ĐỦ phần cross-cutting:
   - CulinaryBlogDbContext (EF Core) với configuration cho TẤT CẢ entity ở bước 2,
     đúng type/constraint/index/relationship trong DATA_MODEL.md, bao gồm Owned
     Entity RecipeNutrition, RowVersion concurrency token, soft-delete IsDeleted.
   - AuditInterceptor tự set CreatedAt/UpdatedAt khi SaveChanges.
   - Base repository generic implement IRepository<T> với helper filter
     !IsDeleted mặc định cho mọi query (bù cho việc EF Core không có Global Query
     Filter tự động như EF Core .NET gốc — implement bằng cách override/base method
     nhất quán).
   - JwtService (sinh + verify JWT) — implement thật vì đây là hạ tầng dùng chung.
   - RedisCacheService implement interface cache của Application.
   - MinioFileStorageService — implement upload/delete cơ bản theo CONS-007 (kiểm
     tra magic bytes, max 5MB, MIME jpeg/png/webp/avif).
   - Hangfire registration (chưa cần job cụ thể, chỉ setup server + dashboard tại
     /hangfire, PostgreSQL storage).
   - Migration đầu tiên tạo đủ bảng cho toàn bộ entity ở bước 2.

5. Presentation layer — implement ĐẦY ĐỦ phần cross-cutting:
   - Program.cs: DI wiring (AddApplication, AddInfrastructure, AddPresentation),
     JWT Bearer authentication, CORS cho frontend origin.
   - GlobalExceptionMiddleware: bắt mọi exception, trả về đúng format RFC 7807 theo
     CLAUDE.md mục 4.
   - CorrelationIdMiddleware: đọc/sinh X-Correlation-ID, gắn vào Serilog context.
   - RateLimitingMiddleware: skeleton dùng built-in .NET rate limiting, cấu hình mặc
     định (điều chỉnh sau).
   - Health check endpoints THẬT (không phải stub) theo FR-OBS-001: GET /health,
     GET /health/live, GET /health/ready — check Postgres + Redis + MinIO.
   - Endpoint route groups RỖNG cho auth/categories/recipes (chỉ MapGroup, chưa map
     route con nào) — để 4 thành viên tự thêm route trong module của mình.
   - Serilog configuration: sink Console (JSON) + File (rolling daily), theo
     CONS-010 (CorrelationId, RequestPath, UserId trong mỗi log entry).

6. Docker & CI:
   - docker-compose.yml: nginx, api, frontend, postgres (extension unaccent,
     pg_trgm bật sẵn qua init script), redis (--appendonly yes), minio, seq
     (dev only), mailhog (dev only).
   - Dockerfile multi-stage cho backend (SDK → aspnet runtime).
   - CI pipeline (GitHub Actions) chạy dotnet build + dotnet test trên mọi PR.

7. Frontend — khởi tạo Next.js App Router (TypeScript) skeleton:
   - Cấu trúc thư mục app/ rỗng cho các route chính theo SRS mục 5.1 (trang chủ,
     /recipes, /recipes/[slug], /categories, /categories/[slug], /login,
     /register, /dashboard) — chỉ layout rỗng, chưa có nội dung nghiệp vụ.
   - Cấu hình: Tailwind CSS, TanStack Query provider, React Hook Form + Zod đã cài
     đặt (chưa cần schema cụ thể), thư mục lib/api-client.ts gọi tới
     NEXT_PUBLIC_API_URL.
   - Auth.js v5 config skeleton cho Google OAuth (chưa cần hoàn chỉnh logic).
   - Dockerfile cho Next.js (standalone output).

8. README.md ở root: hướng dẫn chạy `docker compose up -d`, chạy migration, chạy
   backend, chạy frontend, và trỏ tới CLAUDE.md + docs/TEAM_ASSIGNMENT.md để biết
   ai làm module nào tiếp theo.

TUYỆT ĐỐI KHÔNG LÀM trong lần này:
- KHÔNG viết bất kỳ Command/Query/Handler nghiệp vụ cụ thể nào (đăng ký, đăng nhập,
  CRUD category/recipe...).
- KHÔNG viết endpoint route con nào bên trong các route group (chỉ tạo group rỗng).
- KHÔNG viết trang/component nghiệp vụ nào ở frontend (chỉ layout rỗng).
- KHÔNG thêm package ngoài những gì đã liệt kê trong SRS chương 1.4/6.1.

TIÊU CHÍ HOÀN THÀNH (chạy để tự kiểm tra trước khi báo xong):
- [ ] `dotnet build` thành công, không lỗi.
- [ ] `docker compose up -d` chạy được toàn bộ service, /health trả 200.
- [ ] `dotnet ef database update` chạy migration thành công, đủ bảng theo
      DATA_MODEL.md.
- [ ] `npm run dev` (frontend) chạy được, trang chủ load không lỗi console.
- [ ] CI pipeline chạy xanh trên nhánh vừa tạo.
- [ ] Không có project nào trong Domain reference NuGet ngoài BCL (kiểm tra .csproj).

Sau khi xong, liệt kê ngắn gọn các file/thư mục đã tạo, và xác nhận rõ những phần
NÀO còn để trống (route con, Command/Query, trang frontend) để 4 thành viên biết
chính xác điểm bắt đầu của mình theo docs/TEAM_ASSIGNMENT.md.
```
