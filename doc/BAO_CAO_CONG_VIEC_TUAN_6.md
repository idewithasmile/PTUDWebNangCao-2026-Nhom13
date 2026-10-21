# BÁO CÁO KẾT QUẢ CÔNG VIỆC TUẦN 6
**Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
**Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
**Vai trò:** Technical Lead & Core Developer  
**Nhánh làm việc:** `2312719-Phuoc/Tuan-6`  
**Tài liệu tham chiếu:** `SRS.md`, `CODE_MAP_SELECTION.md`, `BAO_CAO_CONG_VIEC_TUAN_5.md`  
**Thời gian hoàn thành:** 20/10/2026  

---

## I. TỔNG QUAN MỤC TIÊU CÔNG VIỆC TUẦN 6

Trong khuôn khổ Tuần 6 môn học Phát triển Ứng dụng Web Nâng cao, toàn bộ các hạng mục trọng tâm theo yêu cầu chuẩn đầu ra và bài tập tuần đã được hoàn thành 100%:

| STT | Hạng mục Yêu cầu Tuần 6 | Thành phần Hiện thực Cụ thể | Trạng thái |
|:---:|---|---|:---:|
| **1** | **Cài đặt các lớp tiện ích xử lý lỗi, gọi API** | `api-client.ts`, `error-utils.ts`, `ApiError`, RFC 7807 Problem Details, Signal Timeout chống treo SSG | ✅ Hoàn thành 100% |
| **2** | **Cài đặt gói thư viện giao diện shadcn/ui** | `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, `components/ui/*` | ✅ Hoàn thành 100% |
| **3** | **Cài đặt store quản lý trạng thái** | `auth-store.ts` (Zustand in-memory token & profile), `ui-store.ts` (mobile menu, search drawer) | ✅ Hoàn thành 100% |
| **4** | **Thiết kế giao diện (tĩnh) cho blog app** | `app/page.tsx` (Home), `app/recipes/page.tsx` (Kho công thức), `app/recipes/[slug]/page.tsx` (Chi tiết) | ✅ Hoàn thành 100% |
| **5** | **Xây dựng component dùng chung** | `SiteHeader`, `Footer`, `Pagination`, `Loading` / `CardSkeleton`, `ErrorDisplay`, `not-found.tsx` | ✅ Hoàn thành 100% |
| **6** | **Xây dựng bố cục (layout) chung** | `app/layout.tsx` (Inter Font Việt hóa, Sticky Header, Container flex-1, Footer, Providers) | ✅ Hoàn thành 100% |
| **7** | **Module Quản lý Danh mục (FR-CAT)** | FR-CAT-001 đến FR-CAT-005 (Danh sách, Chi tiết, Tạo mới, Sửa giữ Slug, Xóa mềm [Admin]) | ✅ Hoàn thành 100% |
| **8** | **Hoàn thiện FR-FILE (MinIO S3)** | Backend Proxy upload, Magic bytes sniffing, Idempotent retry delete, Frontend `ImageUpload.tsx` | ✅ Hoàn thành 100% |

---

## II. CHI TIẾT KẾT QUẢ THỰC HIỆN KỸ THUẬT

### 1. Cài đặt Lớp Tiện ích Xử lý Lỗi & Gọi API (api-client & error-utils)

#### a. Client Gọi API Tập trung ([api-client.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/api-client.ts))
- **Hỗ trợ Đa hình Nội dung (JSON & Multipart FormData):** Tự động nhận diện body là thể hiện của `FormData` để không ghi đè header `Content-Type: application/json`, cho phép trình duyệt tự gắn `boundary` chính xác khi upload ảnh lên MinIO S3 (`FR-FILE-001`).
- **Xử lý Token Rotation Reuse Detection (FR-AUTH-004):** Bắt mã lỗi 401 đi kèm `type: "AUTH_REFRESH_TOKEN_REVOKED"` từ RFC 7807 để lập tức xóa session, phát sự kiện `SESSION_REVOKED_EVENT` và điều hướng về trang đăng nhập kèm banner cảnh báo.
- **Signal Timeout Chống Treo Build SSG:** Tích hợp `AbortSignal.any([options.signal, AbortSignal.timeout(2500)])` đảm bảo khi render tĩnh hoặc khi Backend chưa khởi chạy, các hàm fetch không bị treo vô hạn thời gian kết nối TCP trên Windows.

#### b. Lớp Biểu diễn & Chuẩn hóa Lỗi ([error-utils.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/error-utils.ts))
- **`ApiError`:** Đóng gói mã trạng thái HTTP status, RFC 7807 type, title, detail và danh sách lỗi validation theo trường (`errors`).
- **`getErrorMessage(error, fallback)`:** Chuẩn hóa mọi ngoại lệ (mất mạng, server timeout, validation 400, conflict 409, concurrency 409) thành thông điệp tiếng Việt tường minh.
- **`getFieldErrors(error)`:** Trích xuất mảng lỗi theo từng trường input để hiển thị trực quan dưới form.
- **`isNetworkError(error)`:** Nhận diện nhanh lỗi mất kết nối máy chủ để hiển thị giao diện Offline/Retry thân thiện.

---

### 2. Cài đặt Gói Thư viện Thiết kế Giao diện (shadcn/ui)

Đã cài đặt thành công bộ phụ thuộc cốt lõi của shadcn/ui:
- `clsx` & `tailwind-merge`: Hợp nhất linh hoạt các lớp tiện ích Tailwind CSS, xử lý xung đột class qua hàm tiện ích `cn()` tại [utils.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/lib/utils.ts).
- `class-variance-authority` (cva): Quản lý các biến thể kích thước và giao diện (variants & sizes) cho components.
- `@radix-ui/react-slot`: Hỗ trợ kỹ thuật `asChild` composition linh hoạt cho các thẻ Link / Button.

Hệ thống component UI chuẩn hoá tại `frontend/src/components/ui/`:
1. [button.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/button.tsx): 6 biến thể (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) và 4 kích thước (`sm`, `default`, `lg`, `icon`).
2. [input.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/input.tsx): Ô nhập liệu hiện đại có trạng thái focus cam thương hiệu và cảnh báo lỗi `error`.
3. [card.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/card.tsx): Bộ thẻ cấu trúc (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
4. [badge.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/badge.tsx): Huy hiệu hiển thị danh mục, độ khó món ăn, trạng thái bài viết (`default`, `secondary`, `destructive`, `outline`, `success`, `warning`).
5. [skeleton.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/skeleton.tsx): Khung xương hiển thị hiệu ứng sóng động khi chờ tải dữ liệu.
6. [textarea.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/ui/textarea.tsx): Ô nhập văn bản đa dòng cho mô tả danh mục và hướng dẫn nấu nướng.

---

### 3. Cài đặt Store Quản lý Trạng thái (Zustand)

Cài đặt thư viện **Zustand** gọn nhẹ và hiệu quả cao cho React/Next.js:

#### a. Quản lý Phiên Người Dùng ([auth-store.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/stores/auth-store.ts))
- Quản lý trạng thái xác thực: `user: UserProfile | null`, `accessToken: string | null`, `isAuthenticated: boolean`, `isLoading: boolean`.
- Đồng bộ đa chiều với `token-store.ts` (bảo đảm Access Token chỉ lưu in-memory theo đúng đặc tả bảo mật) và React Query cache (`authKeys.me`).
- Cung cấp các hành động tiện ích: `setAuth()`, `setUser()`, `setAccessToken()`, `clearAuth()`.

#### b. Quản lý Trạng thái Giao diện ([ui-store.ts](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/stores/ui-store.ts))
- Quản lý đóng/mở Mobile Navigation Drawer (`isMobileMenuOpen`, `toggleMobileMenu`).
- Quản lý hộp thoại tìm kiếm nhanh (`isSearchModalOpen`) và từ khóa tìm kiếm toàn cục (`activeSearchQuery`).

---

### 4. Thiết kế Giao diện (Tĩnh) Cho Blog App

Xây dựng hệ thống giao diện blog hiện đại, chuẩn thẩm mỹ ẩm thực với màu cam chủ đạo (Warm Orange):

1. **Trang Chủ ([app/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/page.tsx)):**
   - **Hero Section:** Tiêu đề lớn ấn tượng, nút kêu gọi hành động ("Khám Phá Công Thức", "Xem Danh Mục"), thống kê nhanh (500+ công thức, 50+ danh mục, 10k+ đầu bếp), ảnh món ăn nổi bật kèm huy hiệu kiểm chứng chất lượng.
   - **Danh Mục Món Ăn Nổi Bật:** Lưới danh mục kèm số lượng món ăn và hình ảnh đại diện hấp dẫn.
   - **Công Thức Mới Cập Nhật:** Lưới các thẻ món ăn (`RecipeCard`) hiển thị ảnh bìa, độ khó, thời gian chế biến, số khẩu phần và tên tác giả.
   - **Giá Trị Nổi Bật (Value Proposition):** 3 khối giá trị cốt lõi: Định lượng chuẩn xác, Lưu trữ ảnh MinIO S3 chất lượng cao, Quản trị phân loại thông minh (FR-CAT).
2. **Kho Công Thức Nấu Ăn ([app/recipes/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/recipes/page.tsx)):**
   - Bộ thanh công cụ tìm kiếm và lọc tĩnh: Lọc theo từ khóa, lọc theo mức độ khó (Dễ, Trung bình, Khó).
   - Thống kê kết quả tìm kiếm và nút đặt lại bộ lọc.
   - Lưới danh sách bài viết công thức kèm phân trang `Pagination`.
3. **Chi Tiết Công Thức Món Ăn ([app/recipes/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/recipes/[slug]/page.tsx)):**
   - Thanh điều hướng Breadcrumbs (`Trang chủ / Công thức / Chi tiết`).
   - Tiêu đề, thông tin tác giả, ngày đăng, nút chia sẻ và nút lưu công thức.
   - Ảnh bìa Hero độ phân giải cao tỉ lệ 16:9.
   - **Bảng Thông Số Nhanh (Stats Bar):** Thời gian chuẩn bị, thời gian nấu, khẩu phần ăn, năng lượng (kcal / phần).
   - **Danh Sách Nguyên Liệu (Checklist):** Hỗ trợ checkbox tương tác đánh dấu nguyên liệu đã chuẩn bị.
   - **Hướng Dẫn Từng Bước (Steps):** Đánh số thứ tự từng bước thực hiện rõ ràng, dễ theo dõi.
   - Thẻ tác giả kèm avatar và phần gợi ý món ăn liên quan cùng danh mục.

---

### 5. Xây dựng Các Component Dùng Chung (Shared Components)

1. **Thanh Điều Hướng Chung ([SiteHeader.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/site-header.tsx)):**
   - Header sticky cố định đầu trang với hiệu ứng kính mờ `backdrop-blur`.
   - Nhận diện trạng thái đăng nhập tự động: Hiển thị tên người dùng, nút vào Dashboard/Quản trị viên nếu là Admin, nút Hồ sơ cá nhân và Đăng xuất an toàn.
   - Menu di động (Mobile Drawer) responsive hoàn chỉnh thông qua `useUIStore`.
2. **Chân Trang Chung ([Footer.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/Footer.tsx)):**
   - Logo thương hiệu, phần mô tả giới thiệu nền tảng ẩm thực.
   - Liên kết khám phá danh mục, công thức, quản trị.
   - Thông tin bản quyền Nhóm 13 và liên hệ hỗ trợ.
3. **Phân Trang Tái Sử Dụng ([Pagination.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/Pagination.tsx)):**
   - Tự động tính toán trang đầu, trang cuối và dải trang xung quanh trang hiện tại kèm dấu ba chấm `...`.
   - Hỗ trợ cả 2 chế độ: Điều hướng qua URL query params (`baseUrl="/recipes"`) và điều hướng qua sự kiện callback (`onPageChange`).
4. **Trạng Thái Chờ Tải Dữ Liệu ([Loading.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/Loading.tsx) & [app/loading.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/loading.tsx)):**
   - Cung cấp `LoadingSpinner`, `LoadingPage` toàn màn hình.
   - Cung cấp `CardSkeleton` và `GridCardSkeleton` mô phỏng cấu trúc thẻ bài viết.
5. **Xử Lý & Hiển Thị Lỗi Thân Thiện ([ErrorDisplay.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/ErrorDisplay.tsx), [app/error.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/error.tsx), [app/not-found.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/not-found.tsx)):**
   - Component `ErrorDisplay` hiển thị hộp cảnh báo với nút "Thử lại" và nút "Về trang chủ".
   - Tích hợp Error Boundary toàn cục và trang báo lỗi 404 tùy biến đẹp mắt.

---

### 6. Xây dựng Bố Cục (Layout) Chung Cho Blog App

Triển khai tại [app/layout.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/layout.tsx):
- Cấu hình phông chữ Google Font **Inter** hỗ trợ đầy đủ bộ ký tự `vietnamese` và `latin`, khắc phục triệt để lỗi vỡ font tiếng Việt.
- Bố cục linh hoạt `min-h-screen flex flex-col`: Header cố định ở trên, phần nội dung `<main className="flex-1">` co giãn tự nhiên, Footer luôn dính đáy màn hình khi nội dung ngắn (Sticky Footer Pattern).
- Tích hợp `Providers` bọc toàn bộ ứng dụng (TanStack Query Client Provider, Session Provider).

---

### 7. Module Quản lý Danh mục Ẩm thực (FR-CAT)

Hiện thực trọn vẹn 5 Use Cases nghiệp vụ quản lý danh mục:
- **FR-CAT-001 (Xem Danh sách Tất cả Danh mục):** [app/categories/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx) kết nối API Backend `GET /api/v1/categories`, hiển thị danh sách qua [CategoryCard.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryCard.tsx).
- **FR-CAT-002 (Xem Chi tiết Danh mục & Công thức):** [app/categories/[slug]/page.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/[slug]/page.tsx) kết nối `GET /api/v1/categories/{slug}`, hỗ trợ phân trang danh sách món ăn, hiển thị banner danh mục và số lượng bài viết.
- **FR-CAT-003 (Tạo Danh mục Mới [Admin]):** Modal [CategoryFormModal.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryFormModal.tsx) gọi `POST /api/v1/categories`, tự động sinh Slug chuẩn SEO.
- **FR-CAT-004 (Cập nhật Danh mục [Admin]):** Form cập nhật bảo vệ `Slug` cố định chống broken links, kiểm soát Optimistic Concurrency qua `RowVersion`.
- **FR-CAT-005 (Xóa Danh mục Soft Delete [Admin]):** Modal [DeleteCategoryModal.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/DeleteCategoryModal.tsx) gọi `DELETE /api/v1/categories/{id}`, kiểm tra ràng buộc không cho xóa danh mục đang có công thức liên kết (409 Conflict).

---

### 8. Phân hệ Lưu trữ Tệp tin MinIO S3 (FR-FILE & FR-RCP-008)

- **Backend Storage Proxy (`FR-FILE-001`):** Triển khai [MinioFileStorageService.cs](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/backend/src/Infrastructure/Services/MinioFileStorageService.cs), kiểm tra kích thước $\le 5$ MB (`FILE_SIZE_EXCEEDED`), kiểm tra Magic Bytes nhị phân (JPEG, PNG, WebP, AVIF), chống Path Traversal bằng GUID, tự động khởi tạo bucket `culinary-blog` kèm chính sách Anonymous Read-Only.
- **Xóa Tệp Idempotent & Retry (`FR-FILE-002`):** Xóa file an toàn với cơ chế Idempotent và thử lại 3 lần Exponential Backoff.
- **Quản lý Ảnh Công thức (`FR-RCP-008`):** CQRS Handlers tải ảnh, chọn ảnh đại diện chính (`IsPrimary`), xóa ảnh và tự động chuyển giao primary, giới hạn quyền tác giả/admin.
- **Frontend File Upload Component ([ImageUpload.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/common/ImageUpload.tsx)):** Hỗ trợ kéo thả ảnh (drag-and-drop), kiểm tra kích thước và định dạng ở client, hiển thị ảnh xem trước, tích hợp trực tiếp vào [CategoryFormModal.tsx](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryFormModal.tsx).

---

## III. KẾT QUẢ KIỂM THỬ VÀ NGHIỆM THU (VERIFICATION & TESTING)

### 1. Kiểm thử Tự động Backend (`dotnet test backend/CulinaryBlog.sln`)
Toàn bộ giải pháp Backend (.NET 10) gồm 5 dự án test đã được thực thi và đạt **100% GREEN (198/198 Tests Passed)**:

| Dự án Kiểm thử | Phạm vi Kiểm thử | Số Tests Tuần 5 | Số Tests Mới Tuần 6 | Tổng Tests Tuần 6 | Kết quả | Thời gian |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **`CulinaryBlog.Domain.Tests`** | Domain Invariants, Value Objects, Business Rules | 16 | 0 | **16 / 16** | **PASSED** | 0.1s |
| **`CulinaryBlog.Application.Tests`** | CQRS Handlers, Recipe Image Handlers, FluentValidation | 72 | +6 | **78 / 78** | **PASSED** | 4.0s |
| **`CulinaryBlog.Infrastructure.Tests`** | Repositories, Bogus Deterministic Seeder | 29 | 0 | **29 / 29** | **PASSED** | 27.0s |
| **`CulinaryBlog.UnitTests`** | MinIO Storage Tests (Magic Bytes, Size, Retry), Handlers | 55 | +11 | **66 / 66** | **PASSED** | 4.0s |
| **`CulinaryBlog.API.IntegrationTests`** | File Endpoints, Recipe Image E2E Flows, Categories | 5 | +4 | **9 / 9** | **PASSED** | 8.0s |
| **TỔNG CỘNG** | **Toàn bộ hệ thống Backend** | **177** | **+21** | **198 / 198** | **100% GREEN** | **~43s** |

### 2. Biên dịch & Đóng gói Ứng dụng Frontend (`npm run build`)
Thực thi kiểm tra mã nguồn và biên dịch Next.js 15:
```bash
cd frontend
npm run build
```
**Kết quả:**
- Biên dịch thành công 100% (Mã thoát 0).
- Toàn bộ các tuyến đường tĩnh và động đều được đóng gói tối ưu, không có lỗi TypeScript hay Lint:
  ```
  Route (app)                              Size     First Load JS
  ┌ ○ /                                    1.33 kB         113 kB
  ├ ○ /_not-found                          138 B           100 kB
  ├ ƒ /api/auth/[...nextauth]              138 B           100 kB
  ├ ○ /auth/callback                       3.29 kB         116 kB
  ├ ƒ /categories                          2.97 kB         112 kB
  ├ ƒ /categories/[slug]                   196 B           112 kB
  ├ ○ /dashboard                           1.54 kB         111 kB
  ├ ○ /dashboard/categories                11.8 kB         165 kB
  ├ ○ /login                               1.31 kB         150 kB
  ├ ○ /profile                             4.36 kB         137 kB
  ├ ƒ /recipes                             196 B           112 kB
  ├ ƒ /recipes/[slug]                      196 B           112 kB
  └ ○ /register                            1.34 kB         150 kB
  ```

---

## IV. BẢNG TỔNG HỢP USE CASES HOÀN THÀNH TRONG TUẦN 6

| Mã Chức Năng | Tên Chức Năng | Tác Nhân | Endpoint / Cơ chế | Kiểm thử Đảm bảo | Trạng thái |
|---|---|---|---|---|:---:|
| **FR-CAT-001** | Xem Danh sách Danh mục | Guest / All | `GET /api/v1/categories`<br>Redis Cache 60m | `CategoryEndpointsTests` | ✅ Hoàn thành |
| **FR-CAT-002** | Xem Chi tiết Danh mục & Món | Guest / All | `GET /api/v1/categories/{slug}` | `CategoryEndpointsTests` | ✅ Hoàn thành |
| **FR-CAT-003** | Tạo Danh mục Mới | Admin | `POST /api/v1/categories` | `CategoryEndpointsTests` | ✅ Hoàn thành |
| **FR-CAT-004** | Cập nhật Danh mục | Admin | `PUT /api/v1/categories/{id}` | `CategoryEndpointsTests` | ✅ Hoàn thành |
| **FR-CAT-005** | Xóa Danh mục (Soft Delete) | Admin | `DELETE /api/v1/categories/{id}` | `CategoryEndpointsTests` | ✅ Hoàn thành |
| **FR-FILE-001** | Backend Proxy Upload MinIO | Authenticated | `POST /api/v1/files/upload`<br>Magic Bytes + $\le 5$MB | `MinioFileStorageServiceTests`<br>`FileEndpointsTests` | ✅ Hoàn thành |
| **FR-FILE-002** | Xóa Tệp MinIO Idempotent | Authenticated | `DELETE /api/v1/files`<br>Retry 3 lần + Idempotent | `MinioFileStorageServiceTests`<br>`FileEndpointsTests` | ✅ Hoàn thành |
| **FR-RCP-008.1** | Upload Ảnh Công thức | Owner / Admin | `POST /api/v1/recipes/{id}/images`<br>Tự động IsPrimary ảnh đầu | `RecipeImageCommandHandlerTests`<br>`FileEndpointsTests` | ✅ Hoàn thành |
| **FR-RCP-008.2** | Chọn Ảnh Đại diện Chính | Owner / Admin | `PATCH /api/v1/recipes/{id}/images/{imgId}/primary` | `RecipeImageCommandHandlerTests`<br>`FileEndpointsTests` | ✅ Hoàn thành |
| **FR-RCP-008.3** | Xóa Ảnh Công thức | Owner / Admin | `DELETE /api/v1/recipes/{id}/images/{imgId}`<br>Tự động chuyển primary | `RecipeImageCommandHandlerTests`<br>`FileEndpointsTests` | ✅ Hoàn thành |

---

## V. ĐÁNH GIÁ & KẾ HOẠCH BƯỚC TIẾP THEO (TUẦN 7)

### 1. Đánh giá tiến độ Tuần 6
- Toàn bộ 6/6 yêu cầu bài tập Tuần 6 cùng 2 module nghiệp vụ trọng điểm `FR-CAT` và `FR-FILE` đã được hiện thực chỉn chu, đạt chuẩn chất lượng sản phẩm thực tế.
- Frontend sở hữu hệ thống thiết kế hiện đại, nhất quán nhờ shadcn/ui primitives, Zustand store, bố cục chung hoàn thiện và các trang tĩnh phong phú.
- Backend tiếp tục duy trì trạng thái 100% Green trên toàn bộ 198 tests.

### 2. Kế hoạch công việc Tuần 7
- Ghép nối dữ liệu động cho Recipe Editor Form ở Frontend (Upload drag-and-drop nhiều ảnh món ăn, chọn ảnh đại diện chính, các bước thực hiện động).
- Tối ưu SEO nâng cao: Bổ sung JSON-LD Schema.org cho Recipe và Category (`NFR-SEO`), sinh Sitemap tự động và thẻ OpenGraph linh hoạt.
- Triển khai phân hệ Bình luận và Đánh giá công thức ẩm thực (`FR-REV`).
