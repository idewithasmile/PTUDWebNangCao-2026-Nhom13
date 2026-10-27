# BÁO CÁO KẾT QUẢ CÔNG VIỆC TUẦN 7
**Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
**Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
**Vai trò:** Technical Lead & Core Developer  
**Nhánh làm việc:** `2312719-Phuoc/Tuan-7`  
**Tài liệu tham chiếu:** `SRS.md`, `CODE_MAP_SELECTION.md`, `BAO_CAO_CONG_VIEC_TUAN_6.md`, `quy tắt commit.docx`  
**Thời gian hoàn thành:** 27/10/2026  

---

## I. TỔNG QUAN MỤC TIÊU CÔNG VIỆC TUẦN 7

Trong khuôn khổ Tuần 7 môn học Phát triển Ứng dụng Web Nâng cao, toàn bộ các hạng mục công việc trọng tâm theo yêu cầu của đồ án đã được hoàn thành xuất sắc 100%:

| STT | Hạng mục Yêu cầu Tuần 7 | Thành phần Hiện thực Cụ thể | Trạng thái |
|:---:|---|---|:---:|
| **1** | **Hoàn thành cài đặt chức năng tìm kiếm toàn diện** | • Hộp thoại tìm kiếm nhanh toàn cục [SearchModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/search/SearchModal.tsx) kích hoạt qua phím tắt `Ctrl + K` / `Cmd + K`<br>• Thanh tìm kiếm nhanh Desktop Header & icon Mobile Header [SiteHeader.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/site-header.tsx)<br>• Khung tìm kiếm trực tiếp trên Banner Hero Trang chủ [HomeHeroSearch.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/home/HomeHeroSearch.tsx)<br>• Bộ lọc & thanh thông báo kết quả tìm kiếm thời gian thực [RecipesFilterBar.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesFilterBar.tsx) & [RecipesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesClientView.tsx)<br>• Kết nối backend PostgreSQL Full-Text Search `tsvector` + `unaccent` + `ts_rank` qua `GET /api/v1/recipes/search` (`FR-SRCH-001` đến `FR-SRCH-004`) | ✅ Hoàn thành 100% |
| **2** | **Hoàn thành xây dựng trang xem danh sách tất cả Category** | • Trang tĩnh động kết hợp Server Component & Client Component [app/categories/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx)<br>• Khung điều khiển tương tác [CategoriesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoriesClientView.tsx) với tìm kiếm danh mục tức thì, sắp xếp đa tiêu chí (Nhiều món nhất, Tên A-Z, Tên Z-A, Mặc định)<br>• Bảng thống kê tổng quan (Stats Bar): Tổng số danh mục, tổng số công thức, danh mục phong phú nhất<br>• Thanh thao tác Quản trị viên (Admin Action Bar) điều hướng nhanh đến [dashboard/categories](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx)<br>• Thẻ danh mục thẩm mỹ cao [CategoryCard.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryCard.tsx) có huy hiệu nổi bật `Phổ biến` kèm số lượng món ăn và hiệu ứng hover | ✅ Hoàn thành 100% |
| **3** | **Kiểm tra và chuẩn hóa tương tác giao diện Danh mục** | • Khắc phục triệt để lỗi không có nút thoát hoặc nhấn ra ngoài không thoát trên tất cả các Modal danh mục ([CategoryFormModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryFormModal.tsx), [DeleteCategoryModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/DeleteCategoryModal.tsx))<br>• Xây dựng mới Modal xem chi tiết danh mục [CategoryDetailModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryDetailModal.tsx) tích hợp nút xem nhanh trong bảng quản trị<br>• Thêm nút điều hướng thoát / quay lại danh sách trên trang chi tiết danh mục [app/categories/[slug]/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/[slug]/page.tsx) | ✅ Hoàn thành 100% |
| **4** | **Đảm bảo chất lượng kiểm thử & Vận hành hệ thống** | • Backend .NET 9: **284 / 284 Tests Passed (100% GREEN, 0 Failed, 0 Skipped)** trên toàn bộ 6 test projects<br>• Frontend Next.js 15: Kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`) thành công 100% không phát sinh cảnh báo<br>• Vận hành trơn tru toàn bộ 5 hạ tầng Docker containers (PostgreSQL, Redis, MinIO S3, Seq, MailHog) | ✅ Hoàn thành 100% |

---

## II. CHI TIẾT KẾT QUẢ THỰC HIỆN KỸ THUẬT

### 1. Hiện thực Phân hệ Tìm kiếm Toàn diện (Search Experience & Full-Text Search)

Hệ thống tìm kiếm được nâng cấp đồng bộ từ giao diện người dùng đến tầng truy vấn cơ sở dữ liệu chuyên sâu:

#### a. Hộp thoại Tìm kiếm Nhanh Toàn cục ([SearchModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/search/SearchModal.tsx))
- **Cơ chế kích hoạt phím tắt toàn cục:** Lắng nghe tổ hợp phím `Ctrl + K` (Windows/Linux) hoặc `Cmd + K` (macOS), và phím `Escape` để đóng modal bất kỳ lúc nào.
- **Trải nghiệm tìm kiếm tức thì (Live Debounced Search):** Kỹ thuật `debounce 250ms` giúp giảm thiểu số lượng request dư thừa gửi lên máy chủ khi người dùng đang gõ phím.
- **Tích hợp tìm kiếm đa thực thể (Multi-entity Search):**
  - **Khớp danh mục (Matching Categories):** Tìm kiếm và gợi ý các danh mục món ăn tương thích ngay trên đầu danh sách kết quả, cho phép người dùng click để chuyển nhanh đến `/categories/[slug]`.
  - **Khớp công thức nấu ăn (Matching Recipes):** Hiển thị danh sách món ăn kèm ảnh thumbnail, tên danh mục, thời gian nấu, huy hiệu độ khó (Dễ, Trung bình, Khó, Chuyên gia).
- **Hỗ trợ từ khóa phổ biến (Popular Searches):** Khi ô tìm kiếm chưa nhập từ khóa, hệ thống tự động hiển thị các từ khóa xu hướng ("Phở bò", "Bánh mì", "Sườn nướng", "Canh chua", "Món chay", "Salad") giúp người dùng khám phá nhanh chỉ bằng một cú nhấp chuột.
- **Điều hướng kết quả đầy đủ:** Nút "Xem kết quả tại Kho công thức" hoặc nhấn phím `Enter` tự động chuyển tiếp người dùng sang trang `/recipes?searchTerm={query}`.

#### b. Điểm chạm Tìm kiếm trên Header ([SiteHeader.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/site-header.tsx))
- **Desktop/Tablet:** Tích hợp ô nút bấm giả lập input tìm kiếm kèm nhãn phím tắt `Ctrl K` tinh tế, vừa đóng vai trò gợi ý tính năng vừa tạo điểm nhấn thẩm mỹ hiện đại.
- **Mobile Header:** Bổ sung nút biểu tượng kính lúp cạnh nút Menu di động, cho phép người dùng trên điện thoại mở modal tìm kiếm nhanh chóng bằng 1 chạm.

#### c. Khung Tìm kiếm Hero trên Trang chủ ([HomeHeroSearch.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/home/HomeHeroSearch.tsx))
- Đặt ngay tại vị trí trung tâm của Banner Hero [app/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/page.tsx).
- Gồm ô nhập liệu nổi bật trên nền kính mờ `backdrop-blur-md`, nút bấm "Tìm kiếm" màu cam thương hiệu và hàng gợi ý thẻ từ khóa (Chips) phong phú.

#### d. Đồng bộ Trạng thái Tìm kiếm & Phản hồi Kết quả ([RecipesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesClientView.tsx) & [RecipesFilterBar.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesFilterBar.tsx))
- **Thanh thông báo kết quả tìm kiếm tích cực:** Khi URL chứa tham số `searchTerm`, hiển thị banner thông báo số lượng công thức tìm được kèm nút "Xóa từ khóa" tiện lợi.
- **Xử lý trạng thái không có kết quả (Search Empty State):** Cung cấp thông điệp gợi ý trực quan: kiểm tra lỗi chính tả, sử dụng từ khóa ngắn hơn, hoặc thử tìm kiếm tiếng Việt không dấu (ví dụ: `pho bo` thay vì `phở bò tái lăn`).
- **Tầng Backend PostgreSQL FTS (`FR-SRCH-001`):** Sử dụng `EF.Functions.ToTsVector("simple", EF.Functions.Unaccent(...))` và `PlainToTsQuery` kết hợp `ts_rank` để đánh chỉ mục và xếp hạng độ liên quan của công thức nấu ăn.

---

### 2. Hiện thực Trang Xem Danh Sách Tất Cả Category (/categories)

Trang xem danh mục được tái thiết kế toàn diện, đáp ứng đầy đủ yêu cầu nghiệp vụ `FR-CAT-001` và tối ưu trải nghiệm người dùng:

#### a. Bố cục và Kiến trúc Trang ([app/categories/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx))
- Sử dụng mô hình kết hợp: Server Component fetch dữ liệu khởi tạo từ Backend API với cơ chế ISR Cache (`next: { revalidate: 3600 }`), truyền dữ liệu sang Client Component [CategoriesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoriesClientView.tsx) để thực thi lọc và sắp xếp mượt mà không cần reload trang.
- Tích hợp chuẩn SEO `Metadata` và `OpenGraph` cho trang danh mục.

#### b. Thanh Thống Kê Tổng Quan (Overview Stats Bar)
- **Tổng số danh mục:** Hiển thị tổng số nhóm thực đơn hiện có trong cơ sở dữ liệu.
- **Tổng số công thức:** Tính toán động tổng số bài viết công thức đã xuất bản trên toàn hệ thống.
- **Danh mục phong phú nhất:** Tự động tìm danh mục có số lượng bài viết lớn nhất để vinh danh nổi bật.

#### c. Bộ Lọc Thời Gian Thực & Sắp Xếp Đa Chiều
- **Tìm kiếm danh mục:** Ô nhập liệu hỗ trợ lọc ngay lập tức theo tên hoặc mô tả danh mục.
- **Sắp xếp linh hoạt:**
  - *Nhiều công thức nhất (Phổ biến)*: Ưu tiên các danh mục được đóng góp nhiều bài viết.
  - *Tên danh mục A → Z / Z → A*: Sắp xếp chuẩn bảng chữ cái tiếng Việt có dấu qua `Intl/localeCompare`.
  - *Thứ tự mặc định hệ thống*: Giữ nguyên theo `orderIndex` do Quản trị viên thiết lập.
- **Bộ lọc nhanh (Tabs):** "Tất cả", "Đang có công thức (> 0)", "Phổ biến (≥ 3 món)".

#### d. Phân quyền và Lối tắt Quản trị viên (Admin Action Bar)
- Tự động nhận diện quyền `Admin` qua `useMe` và `UserProfile.roles`.
- Nếu là Quản trị viên, trang hiển thị banner màu hổ phách chuyên dụng với nút truy cập thẳng đến trang quản lý danh mục [dashboard/categories](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx) để thực hiện thêm/sửa/xóa/đổi ảnh.

#### e. Thẻ Danh Mục Hiện Đại ([CategoryCard.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryCard.tsx))
- Khung ảnh tỷ lệ 16:10 với hiệu ứng zoom nhẹ khi rê chuột.
- Ảnh placeholder gradient kết hợp icon đầu bếp cách điệu khi danh mục chưa có ảnh.
- Huy hiệu `Phổ biến` kèm biểu tượng ngọn lửa (`Flame`) cho các danh mục có từ 3 công thức trở lên.
- Huy hiệu hiển thị số lượng công thức (`{count} món`) gắn cố định góc trên bên phải.
- Chân thẻ có mũi tên tương tác dẫn hướng đến `/categories/[slug]`.

---

### 3. Kiểm tra & Chuẩn hóa Trải nghiệm Tương tác Người dùng cho Phân hệ Danh mục (UI/UX)

Khắc phục hoàn toàn các vấn đề người dùng phản hồi về việc khó thoát hộp thoại hoặc không có nút thoát khi xem danh mục:

#### a. Cơ chế Thoát Modal Toàn diện (Escape Key & Backdrop Dismissal)
- **Lắng nghe phím `Escape`:** Bổ sung `window.addEventListener('keydown', handleKeyDown)` trên tất cả các Modal ([CategoryFormModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryFormModal.tsx), [DeleteCategoryModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/DeleteCategoryModal.tsx), [CategoryDetailModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryDetailModal.tsx)).
- **Nhấn ra ngoài để đóng (Click Outside Backdrop):** Lớp nền mờ được gán `onClick={onClose}` và phần thân modal được gán `onClick={(e) => e.stopPropagation()}` để người dùng dễ dàng thoát modal chỉ bằng một cú nhấp chuột bên ngoài.

#### b. Modal Xem Nhanh Chi Tiết Danh mục ([CategoryDetailModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryDetailModal.tsx))
- Cung cấp giao diện trực quan hiển thị ảnh đại diện MinIO, tên danh mục, đường dẫn tĩnh Slug, mô tả và số lượng công thức liên kết.
- Tích hợp 2 nút hành động rõ ràng: Nút "Đóng" (thoát modal) và nút "Xem công thức" (mở trang `/categories/[slug]`).

#### c. Nút Xem Nhanh trên Bảng Quản trị ([dashboard/categories](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx))
- Thêm cột thao tác với biểu tượng con mắt (`Eye`) cho phép Quản trị viên xem nhanh thông tin danh mục mà không cần mở form chỉnh sửa.

#### d. Nút Thoát và Quay lại Danh mục ([app/categories/[slug]/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/[slug]/page.tsx))
- Đặt nút bấm nổi bật *"Quay lại tất cả danh mục (Thoát)"* ngay đầu trang cạnh đường dẫn Breadcrumbs.
- Bổ sung nút *"Thoát về danh sách danh mục"* ngay trong Hero banner khi xem danh mục cụ thể.

---

## III. KẾT QUẢ KIỂM THỬ VÀ NGHIỆM THU (VERIFICATION & TESTING)

### 1. Kiểm thử Tự động Toàn diện Backend (`dotnet test backend/CulinaryBlog.sln`)

Toàn bộ 6 dự án kiểm thử tự động của Backend (.NET 9) đã được thực thi và đạt **100% GREEN (284/284 Tests Passed, 0 Failed, 0 Skipped)**:

| Dự án Kiểm thử | Phạm vi Kiểm thử | Số Lượng Tests | Kết Quả | Thời Gian |
|---|---|:---:|:---:|:---:|
| **`CulinaryBlog.Domain.Tests`** | Domain Invariants, Business Rules, Value Objects | **23 / 23** | **PASSED** | 0.2s |
| **`CulinaryBlog.Application.Tests`** | CQRS Handlers, Recipe Search Query Handler, Hangfire Jobs | **113 / 113** | **PASSED** | 5.0s |
| **`CulinaryBlog.UnitTests`** | MinIO Storage Tests (Magic Bytes, Retry, Sniffing), Handlers | **95 / 95** | **PASSED** | 11.0s |
| **`CulinaryBlog.Api.Tests`** | API Controllers, Model Binding, Problem Details RFC 7807 | **4 / 4** | **PASSED** | 16.0s |
| **`CulinaryBlog.Infrastructure.Tests`** | Repositories, Database Context, Hangfire Storage, Sitemap XML | **34 / 34** | **PASSED** | 47.0s |
| **`CulinaryBlog.API.IntegrationTests`** | E2E Flows, Observability Health Checks, Search Endpoints | **15 / 15** | **PASSED** | 18.0s |
| ****TỔNG CỘNG HỆ THỐNG** | **Toàn bộ giải pháp Backend (.NET 9)** | **284 / 284** | **100% GREEN** | **~97s** |

### 2. Kiểm thử Kiểu dữ liệu & Biên dịch Frontend Next.js 15 (`npx tsc --noEmit`)

Ứng dụng Next.js 15 đã được kiểm thử kiểu dữ liệu tĩnh nghiêm ngặt (Strict TypeScript Mode) và đạt kết quả hoàn hảo:
- **Mã thoát (Exit Code):** `0`
- **Lỗi / Cảnh báo:** Không phát sinh bất kỳ lỗi TypeScript hay xung đột interface nào.
- Toàn bộ các component mới (`SearchModal`, `CategoriesClientView`, `CategoryDetailModal`, `CategoryCard`) đều tuân thủ chặt chẽ design system và React 19 / Next.js 15 Client/Server Component boundaries.

### 3. Trạng thái Vận hành Hạ tầng & Dịch vụ

Toàn bộ hệ thống đang chạy ổn định và sẵn sàng cho việc thuyết minh, bảo vệ đồ án:
- **PostgreSQL 16:** `localhost:5433` (Container `culinary_postgres`) — Đầy đủ 20 categories và 100 recipes seed.
- **Redis 7:** `localhost:6379` (Container `culinary_redis`) — Bộ nhớ đệm cache hoạt động bình thường.
- **MinIO S3:** `localhost:9000` / Console `localhost:9001` (Container `culinary_minio`) — Bucket `culinary-blog` lưu trữ ảnh công thức và danh mục an toàn.
- **Seq Observability:** `localhost:5341` (Container `culinary_seq`) — Ghi nhận structured logs tập trung.
- **MailHog:** `localhost:8025` (Container `culinary_mailhog`) — Giả lập SMTP server gửi email xác thực.
- **Backend API:** `http://localhost:5001` (Status: Healthy).
- **Frontend App:** `http://localhost:3000` (Status: 200 OK).

---

## IV. BẢNG TỔNG HỢP USE CASES HOÀN THÀNH TRONG TUẦN 7

| Mã Chức Năng | Tên Chức Năng | Tác Nhân | Endpoint / Cơ Chế Kỹ Thuật | Kiểm Thử Nghiệm Thu | Trạng Thái |
|---|---|---|---|---|:---:|
| **FR-SRCH-001** | Tìm kiếm Toàn văn bản (FTS) | Guest / All | `GET /api/v1/recipes/search`<br>PostgreSQL `tsvector` + `unaccent` + `ts_rank` | `SearchRecipesQueryHandlerTests`<br>`RecipesEndpointsTests` | ✅ Hoàn thành 100% |
| **FR-SRCH-002** | Lọc theo Danh mục & Độ khó | Guest / All | Query params: `categoryId`, `difficulty`, `maxTotalTimeMinutes` | `GetRecipesQueryHandlerTests` | ✅ Hoàn thành 100% |
| **FR-SRCH-003** | Modal Tìm kiếm Nhanh Toàn cục | All Users | Phím tắt `Ctrl + K`, Debounce 250ms, multi-entity search | E2E Manual & TypeScript Check | ✅ Hoàn thành 100% |
| **FR-SRCH-004** | Tìm kiếm trực tiếp trên Hero Trang chủ | All Users | Form tìm kiếm tích hợp `HomeHeroSearch.tsx` | E2E Manual & TypeScript Check | ✅ Hoàn thành 100% |
| **FR-CAT-001** | Xem Danh sách Tất cả Danh mục | Guest / All | `GET /api/v1/categories`<br>Trang `/categories` + Client Filter/Sort | `CategoryEndpointsTests`<br>Next.js Build | ✅ Hoàn thành 100% |
| **FR-CAT-002** | Xem Chi tiết Danh mục & Công thức | Guest / All | `GET /api/v1/categories/{slug}`<br>Phân trang danh sách món ăn | `CategoryEndpointsTests` | ✅ Hoàn thành 100% |
| **FR-CAT-003** | Lối tắt Quản trị Danh mục | Admin | Điều hướng `/dashboard/categories` khi có role `Admin` | Integration Tests & UI Auth | ✅ Hoàn thành 100% |
| **FR-CAT-004** | Cơ chế Thoát Modal & Điều hướng Thân thiện | All Users | Phím `Escape`, Click backdrop outside, Nút thoát rõ ràng | Manual UI Verification | ✅ Hoàn thành 100% |

---

## V. HƯỚNG DẪN KIỂM THỬ & KỊCH BẢN DEMO (DEMO RUNBOOK)

### 1. Kịch bản Kiểm thử Chức năng Tìm kiếm
1. **Mở modal bằng phím tắt:** Truy cập bất kỳ trang nào (ví dụ `http://localhost:3000`), nhấn tổ hợp phím `Ctrl + K` (hoặc `Cmd + K`).
   - *Kết quả mong đợi:* Hộp thoại tìm kiếm hiện lên mượt mà với con trỏ tự động focus vào ô nhập liệu; danh sách từ khóa phổ biến và danh mục gợi ý hiển thị đầy đủ.
2. **Tìm kiếm tiếng Việt không dấu:** Gõ từ khóa `pho bo` vào ô tìm kiếm.
   - *Kết quả mong đợi:* Modal hiển thị kết quả món ăn "Phở Bò Tái Lăn Chuẩn Vị Hà Thành" kèm thời gian nấu và độ khó, đồng thời hiển thị danh mục "Món Nước & Súp".
3. **Tìm kiếm từ Header và Hero Banner:**
   - Tại trang chủ, gõ `bánh mì` vào ô tìm kiếm ở Hero Banner và nhấn **Tìm kiếm**.
   - Trình duyệt điều hướng sang `/recipes?searchTerm=b%C3%A1nh%20m%C3%AC`, hiển thị banner kết quả tìm kiếm với số lượng món ăn và nút "Xóa từ khóa".

### 2. Kịch bản Kiểm thử Trang Danh mục (/categories)
1. **Truy cập trang danh mục:** Nhấp vào liên kết **Danh mục** trên thanh điều hướng Header hoặc truy cập `http://localhost:3000/categories`.
2. **Kiểm tra thông số thống kê:** Xem 3 thẻ thống kê tổng quan (Tổng danh mục, Tổng công thức, Danh mục nhiều món nhất).
3. **Lọc danh mục tức thì:** Nhập từ khóa `Á` vào ô tìm kiếm danh mục. Lưới danh mục lập tức chỉ hiển thị "Món Á Truyền Thống".
4. **Sắp xếp danh mục:** Chọn sắp xếp "Tên danh mục: A → Z" hoặc "Nhiều công thức nhất".
5. **Kiểm tra tương tác thoát modal:** Bấm vào nút "Xem nhanh" hoặc "Thêm danh mục", sau đó nhấn phím `Escape` hoặc nhấp chuột ra ngoài vùng modal để kiểm tra tính năng thoát nhanh.

---

## VI. ĐÁNH GIÁ & KẾ HOẠCH BƯỚC TIẾP THEO

### 1. Đánh giá tiến độ Tuần 7
- Hoàn thành trọn vẹn 100% các chức năng tìm kiếm toàn cục, tìm kiếm toàn văn bản tiếng Việt FTS, tìm kiếm Hero và nâng cấp trải nghiệm trang danh mục.
- Toàn bộ kiến trúc Backend duy trì ổn định tuyệt đối với **284/284 bài test kiểm thử tự động xanh 100%**.
- Giao diện người dùng được tối ưu hóa khả năng tương tác, giải quyết triệt để các phản hồi về việc thoát modal và điều hướng trang.

### 2. Kế hoạch công việc tiếp theo (Bảo vệ đồ án & Triển khai Docker)
- Chạy toàn bộ hệ thống bằng Docker Compose (`docker compose -f infrastructure/docker-compose.yml up -d`).
- Tổng dượt kịch bản thuyết trình và bảo vệ đồ án theo `doc/KICH_BAN_DEMO_VA_BAO_VE.md`.
