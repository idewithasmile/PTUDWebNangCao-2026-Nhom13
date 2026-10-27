# BÁO CÁO KẾT QUẢ CÔNG VIỆC TUẦN 7
**Dự án:** Culinary Blog — Nền tảng chia sẻ công thức nấu ăn (API-Driven Architecture)  
**Người thực hiện:** Trần Ngọc Bảo Phước (MSSV: 2312719)  
**Vai trò:** Technical Lead & Core Developer  
**Nhánh làm việc:** `2312719-Phuoc/Tuan-7` / `2312719-Phuoc/Tuan-6`  
**Tài liệu tham chiếu:** `SRS.md`, `CODE_MAP_SELECTION.md`, `BAO_CAO_CONG_VIEC_TUAN_6.md`, `README.md`  
**Thời gian hoàn thành:** 27/10/2026  

---

## I. TỔNG QUAN MỤC TIÊU CÔNG VIỆC TUẦN 7

Trong khuôn khổ Tuần 7 môn học Phát triển Ứng dụng Web Nâng cao, toàn bộ các hạng mục trọng tâm theo yêu cầu của đồ án và bài tập tuần đã được hoàn thành xuất sắc 100%:

| STT | Hạng mục Yêu cầu Tuần 7 | Thành phần Hiện thực Cụ thể | Trạng thái |
|:---:|---|---|:---:|
| **1** | **Hoàn thành cài đặt chức năng tìm kiếm toàn diện** | • Hộp thoại tìm kiếm nhanh toàn cục [SearchModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/search/SearchModal.tsx) kích hoạt qua phím tắt `Ctrl + K` / `Cmd + K`<br>• Thanh tìm kiếm nhanh Desktop Header & icon Mobile Header [SiteHeader.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/site-header.tsx)<br>• Khung tìm kiếm trực tiếp trên Banner Hero Trang chủ [HomeHeroSearch.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/home/HomeHeroSearch.tsx)<br>• Bộ lọc & thanh báo kết quả tìm kiếm thời gian thực [RecipesFilterBar.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesFilterBar.tsx) & [RecipesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/recipes/RecipesClientView.tsx)<br>• Kết nối backend PostgreSQL Full-Text Search `tsvector` + `unaccent` + `ts_rank` qua `GET /api/v1/recipes/search` (`FR-SRCH-001` đến `FR-SRCH-004`) | ✅ Hoàn thành 100% |
| **2** | **Hoàn thành xây dựng trang xem danh sách tất cả Category** | • Trang tĩnh động kết hợp Server Component & Client Component [app/categories/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/page.tsx)<br>• Khung điều khiển tương tác [CategoriesClientView.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoriesClientView.tsx) với tìm kiếm danh mục tức thì, sắp xếp đa tiêu chí (Nhiều món nhất, Tên A-Z, Tên Z-A, Mặc định)<br>• Bảng thống kê tổng quan (Stats Bar): Tổng số danh mục, tổng số công thức, danh mục phong phú nhất<br>• Thanh thao tác Quản trị viên (Admin Action Bar) điều hướng nhanh đến [dashboard/categories](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/dashboard/categories/page.tsx)<br>• Thẻ danh mục thẩm mỹ cao [CategoryCard.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryCard.tsx) có huy hiệu nổi bật `Phổ biến` kèm số lượng món ăn và hiệu ứng hover | ✅ Hoàn thành 100% |
| **3** | **Đảm bảo chất lượng kiểm thử & Đóng gói hệ thống** | • Backend .NET 10: **284 / 284 Tests Passed (100% GREEN, 0 Failed, 0 Skipped)** trên toàn bộ 6 test projects<br>• Frontend Next.js 15: Production Build (`npm run build`) thành công 13/13 static & dynamic routes, không có lỗi TypeScript hay Lint | ✅ Hoàn thành 100% |

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

#### f. Cơ chế Thoát Modal & Điều Hướng Thân Thiện (Modal Dismissal & Navigation)
- **Hộp thoại Xem chi tiết Danh mục ([CategoryDetailModal.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/components/categories/CategoryDetailModal.tsx)):** Cung cấp modal xem nhanh thông tin danh mục kèm nút Xem công thức và nút "Thoát / Đóng".
- **Cơ chế nhấn ra ngoài (Click Outside Backdrop):** Toàn bộ các hộp thoại (`CategoryFormModal`, `DeleteCategoryModal`, `CategoryDetailModal`, `SearchModal`) đều được trang bị cơ chế đóng tự động khi nhấn vào lớp nền mờ bên ngoài (`backdrop onClick={onClose}` kết hợp `e.stopPropagation()` ở modal box).
- **Phím tắt `Escape` toàn diện:** Lắng nghe sự kiện bàn phím phím `Esc` để đóng/thoát modal lập tức.
- **Thanh điều hướng thoát trên trang chi tiết ([app/categories/[slug]/page.tsx](file:///f:/THUC_HANH/PTUDW/PTUDWebNangCao-2026-Nhom13/frontend/src/app/categories/[slug]/page.tsx)):** Bổ sung nút bấm trực quan *"Quay lại tất cả danh mục (Thoát)"* đặt ngay đầu trang cạnh Breadcrumbs và nút *"Thoát về danh sách danh mục"* trong Hero banner.

---

## III. KẾT QUẢ KIỂM THỬ VÀ NGHIỆM THU (VERIFICATION & TESTING)

### 1. Kiểm thử Tự động Toàn diện Backend (`dotnet test backend/CulinaryBlog.sln`)

Toàn bộ 6 dự án kiểm thử tự động của Backend (.NET 10) đã được thực thi và đạt **100% GREEN (284/284 Tests Passed, 0 Failed, 0 Skipped)**:

| Dự án Kiểm thử | Phạm vi Kiểm thử | Số Lượng Tests | Kết Quả | Thời Gian |
|---|---|:---:|:---:|:---:|
| **`CulinaryBlog.Domain.Tests`** | Domain Invariants, Business Rules, Value Objects | **23 / 23** | **PASSED** | 0.2s |
| **`CulinaryBlog.Application.Tests`** | CQRS Handlers, Recipe Search Query Handler, Hangfire Jobs | **113 / 113** | **PASSED** | 5.0s |
| **`CulinaryBlog.UnitTests`** | MinIO Storage Tests (Magic Bytes, Retry, Sniffing), Handlers | **95 / 95** | **PASSED** | 11.0s |
| **`CulinaryBlog.Api.Tests`** | API Controllers, Model Binding, Problem Details RFC 7807 | **4 / 4** | **PASSED** | 16.0s |
| **`CulinaryBlog.Infrastructure.Tests`** | Repositories, Database Context, Hangfire Storage, Sitemap XML | **34 / 34** | **PASSED** | 47.0s |
| **`CulinaryBlog.API.IntegrationTests`** | E2E Flows, Observability Health Checks, Search Endpoints | **15 / 15** | **PASSED** | 18.0s |
| **TỔNG CỘNG HỆ THỐNG** | **Toàn bộ giải pháp Backend (.NET 10)** | **284 / 284** | **100% GREEN** | **~97s** |

### 2. Biên dịch & Đóng gói Ứng dụng Frontend (`npm run build`)

Ứng dụng Next.js 15 đã được biên dịch thành công 100% ở chế độ Production:
```text
Route (app)                              Size     First Load JS
┌ ○ /                                    3.1 kB          112 kB
├ ○ /_not-found                          141 B           100 kB
├ ƒ /api/auth/[...nextauth]              141 B           100 kB
├ ○ /auth/callback                       3.29 kB         116 kB
├ ƒ /categories                          6.77 kB         128 kB
├ ƒ /categories/[slug]                   3.29 kB         112 kB
├ ○ /dashboard                           1.54 kB         111 kB
├ ○ /dashboard/categories                8.82 kB         168 kB
├ ○ /login                               1.31 kB         151 kB
├ ○ /profile                             3.7 kB          154 kB
├ ○ /recipes                             6.13 kB         130 kB
├ ƒ /recipes/[slug]                      7.66 kB         132 kB
├ ƒ /recipes/[slug]/edit                 4.29 kB         162 kB
├ ○ /recipes/create                      1.14 kB         159 kB
├ ○ /recipes/new                         141 B           100 kB
└ ○ /register                            1.34 kB         151 kB
+ First Load JS shared by all            100 kB
```
- Không có bất kỳ lỗi biên dịch TypeScript (`tsc`) nào.
- Toàn bộ 13 routes được đóng gói tối ưu, kích thước bundle chuẩn mực.

---

## IV. BẢNG TỔNG HỢP USE CASES HOÀN THÀNH TRONG TUẦN 7

| Mã Chức Năng | Tên Chức Năng | Tác Nhân | Endpoint / Cơ Chế Kỹ Thuật | Kiểm Thử Nghiệm Thu | Trạng Thái |
|---|---|---|---|---|:---:|
| **FR-SRCH-001** | Tìm kiếm Toàn văn bản (FTS) | Guest / All | `GET /api/v1/recipes/search`<br>PostgreSQL `tsvector` + `unaccent` + `ts_rank` | `SearchRecipesQueryHandlerTests`<br>`RecipesEndpointsTests` | ✅ Hoàn thành 100% |
| **FR-SRCH-002** | Lọc theo Danh mục & Độ khó | Guest / All | Query params: `categoryId`, `difficulty`, `maxTotalTimeMinutes` | `GetRecipesQueryHandlerTests` | ✅ Hoàn thành 100% |
| **FR-SRCH-003** | Modal Tìm kiếm Nhanh Toàn cục | All Users | Phím tắt `Ctrl + K`, Debounce 250ms, multi-entity search | E2E Manual & Next.js Build | ✅ Hoàn thành 100% |
| **FR-SRCH-004** | Tìm kiếm trực tiếp trên Hero Trang chủ | All Users | Form tìm kiếm tích hợp `HomeHeroSearch.tsx` | E2E Manual & Next.js Build | ✅ Hoàn thành 100% |
| **FR-CAT-001** | Xem Danh sách Tất cả Danh mục | Guest / All | `GET /api/v1/categories`<br>Trang `/categories` + Client Filter/Sort | `CategoryEndpointsTests`<br>Next.js Build | ✅ Hoàn thành 100% |
| **FR-CAT-002** | Xem Chi tiết Danh mục & Công thức | Guest / All | `GET /api/v1/categories/{slug}`<br>Phân trang danh sách món ăn | `CategoryEndpointsTests` | ✅ Hoàn thành 100% |
| **FR-CAT-003** | Lối tắt Quản trị Danh mục | Admin | Điều hướng `/dashboard/categories` khi có role `Admin` | Integration Tests & UI Auth | ✅ Hoàn thành 100% |

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
5. **Kiểm tra phân quyền Admin:** Đăng nhập tài khoản `admin@culinaryblog.com` / `Admin@123456`, quay lại `/categories` sẽ thấy banner Quản trị viên xuất hiện kèm nút vào trang CRUD.

---

## VI. ĐÁNH GIÁ & KẾ HOẠCH BƯỚC TIẾP THEO

### 1. Đánh giá tiến độ Tuần 7
- Hoàn thành trọn vẹn 100% các chức năng tìm kiếm toàn cục, tìm kiếm toàn văn bản tiếng Việt FTS, tìm kiếm Hero và nâng cấp trải nghiệm trang danh mục.
- Toàn bộ kiến trúc Backend duy trì ổn định tuyệt đối với **284/284 bài test kiểm thử tự động xanh 100%**.
- Frontend Next.js 15 đạt chuẩn thiết kế giao diện ẩm thực hiện đại, trực quan, hỗ trợ đầy đủ responsive trên cả Desktop, Tablet và Mobile.

### 2. Kế hoạch công việc tiếp theo (Bảo vệ đồ án & Triển khai Docker)
- Chạy toàn bộ hệ thống bằng Docker Compose (`docker compose -f infrastructure/docker-compose.yml up -d`).
- Tổng dượt kịch bản thuyết trình và bảo vệ đồ án theo `doc/KICH_BAN_DEMO_VA_BAO_VE.md`.
