# BÁO CÁO PHÂN TÍCH VÀ GIẢI QUYẾT MÂU THUẪN TRONG TÀI LIỆU SRS CULINARY BLOG V1.0.0

> **Tài liệu tham chiếu:** [SRS_Culinary_Blog_v1.0.0.md](file:///f:/PTUDWebNangCao_2026_Nhom13/SRS_Culinary_Blog_v1.0.0.md)  
> **Ngày thực hiện phân tích:** 16/09/2026  
> **Mục tiêu:** Phát hiện các điểm mâu thuẫn, bất bất nhất về mặt kiến trúc, nghiệp vụ, cơ sở dữ liệu và API trong tài liệu SRS; đồng thời đề xuất giải pháp xử lý chi tiết (kèm ưu/nhược điểm và ảnh hưởng lâu dài).

---

## TỔNG QUAN CÁC MÂU THUẪN PHÁT HIỆN

Qua quá trình rà soát toàn bộ tài liệu **SRS Culinary Blog v1.0.0**, hệ thống ghi nhận **11 mâu thuẫn kỹ thuật và nghiệp vụ**. Các mâu thuẫn này được phân loại theo 3 mức độ rủi ro:

| Mức độ Rủi ro | Số lượng | Mô tả ảnh hưởng |
| :---: | :---: | :--- |
| 🔴 **Nghiêm trọng (High)** | 4 | Ảnh hưởng trực tiếp đến tính toàn vẹn dữ liệu, logic nghiệp vụ cốt lõi, khả năng mở rộng kiến trúc và an toàn bảo mật. |
| 🟡 **Trung bình (Medium)** | 4 | Gây ra sự không nhất quán giữa các layer (API Spec, Code Implementation, Database Schema, HTTP Error Codes). |
| 🟢 **Thấp (Low)** | 3 | Sự bất bất nhất về phiên bản công nghệ, thuật ngữ đặt tên trường hoặc định hướng quy mô. |

---

## DẠNH SÁCH CHI TIẾT CÁC MÂU THUẪN VÀ GIẢI PHÁP XỬ LÝ

---

### 1. Mâu thuẫn 1 (🔴 Nghiêm trọng): Chiến lược Xóa dữ liệu Công thức (Soft Delete vs Hard Delete)

#### 📍 Vị trí mâu thuẫn trong SRS
- **NFR-REL-003 (Độ tin cậy)**, **Section 7.1 (BaseEntity)**, **Section 7.2 (Recipe)** & **Phụ lục C**: Quy định Recipe áp dụng **Soft Delete** (`IsDeleted = true`, có thể khôi phục dữ liệu, Global Query Filter `.Where(x => !x.IsDeleted)`).
- **FR-RCP-007 (Xóa Công thức)**: Quy định "Đây là **hard delete** (không dùng soft delete pattern cho recipe)... `_unitOfWork.Recipes.Remove(recipe)` - cascade delete Steps, Ingredients, Images trong database".
- **Chương 8.3 (Recipes Module API Table)**: Mô tả `DELETE /recipes/{id}` ghi là `(soft delete)`.

#### 📝 Mô tả mâu thuẫn
Tài liệu vừa khẳng định Recipe thuộc đối tượng Soft Delete để bảo toàn dữ liệu (NFR-REL-003, Section 7.1/7.2), vừa hướng dẫn lập trình viên gọi lệnh Hard Delete vật lý xóa sạch khỏi DB và Cascade Delete các bảng con (FR-RCP-007), đồng thời bảng mô tả API lại ghi chú là Soft Delete.

#### ⚠️ Đánh giá ảnh hưởng về sau
- Lập trình viên Backend không biết nên triển khai `recipe.IsDeleted = true` hay `DbContext.Recipes.Remove(recipe)`.
- Nếu dùng Hard Delete: Mất dữ liệu vĩnh viễn khi tác giả lỡ tay xóa, không thể khôi phục, vi phạm cam kết NFR-REL-003.
- Nếu dùng Soft Delete nhưng gọi `Remove()`: Các bản ghi con (`RecipeStep`, `RecipeIngredient`) có thể bị cascade delete vật lý hoặc mâu thuẫn FK constraint.

#### 💡 Đề xuất Giải pháp

##### **Phương án A (Khuyên dùng): Thống nhất áp dụng Soft Delete toàn bộ cho Recipe**
- **Nội dung:** Cập nhật FR-RCP-007 thành Soft Delete. Khi xóa công thức, hệ thống chỉ cập nhật `IsDeleted = true`, `UpdatedAt = UtcNow`. Các entity con (`RecipeStep`, `RecipeIngredient`, `RecipeImage`) giữ nguyên trong DB nhưng bị ẩn theo Global Query Filter của `Recipe`. Ảnh trên MinIO **chỉ dọn dẹp khi có tác vụ Purge định kỳ (Background Job)** hoặc giữ lại cho mục đích Audit.
- **Ưu điểm:**
  - Khôi phục công thức dễ dàng nếu bị xóa nhầm.
  - Đảm bảo toàn vẹn dữ liệu lịch sử và báo cáo thống kê.
  - Đồng nhất 100% với `BaseEntity`, `NFR-REL-003` và bảng đặc tả API.
- **Nhược điểm:** Dung lượng Database và MinIO tăng dần theo thời gian.
- **Ảnh hưởng lâu dài:** Cần xây dựng thêm tính năng "Thùng rác" (Trash/Recycle Bin) cho Author/Admin và Background Job dọn dẹp dữ liệu đã xóa sau 30 ngày.

##### **Phương án B: Áp dụng Hard Delete vật lý hoàn toàn**
- **Nội dung:** Bỏ cột `IsDeleted` khỏi `Recipe`, cập nhật NFR-REL-003 và bảng API thành Hard Delete.
- **Ưu điểm:** Tiết kiệm bộ nhớ DB và MinIO ngay lập tức.
- **Nhược điểm:** Không thể khôi phục dữ liệu nếu xóa nhầm; vi phạm nguyên tắc bảo toàn dữ liệu ứng dụng.

---

### 2. Mâu thuẫn 2 (🔴 Nghiêm trọng): Chiến lược Caching mâu thuẫn giữa Kiến trúc Stateless và Thực thi

#### 📍 Vị trí mâu thuẫn trong SRS
- **NFR-SCALE-001 (Stateless Backend)**: Bắt buộc dùng **Distributed Cache (Redis)**, "KHÔNG in-memory IMemoryCache cho mọi shared state".
- **FR-CAT-001 & FR-CAT-003 (Module Danh mục)**: Thực thi bằng **`IMemoryCache`** (in-memory) với key `"categories:all"`, xóa cache bằng `MemoryCache.Remove("categories:all")`.
- **FR-RCP-001 & FR-RCP-002**: Sử dụng **.NET 10 Output Cache** middleware với Output Cache Policy (`RecipeList`, `RecipeDetail`).
- **NFR-PERF-003**: Mô tả Redis Cache-Aside pattern cho Category list (TTL 30p) và Recipe detail (TTL 5p).

#### 📝 Mô tả mâu thuẫn
NFR-SCALE-001 cấm dùng `IMemoryCache` để đảm bảo Backend Stateless khi mở rộng nhiều instance. Nhưng FR-CAT-001/003 lại dùng `IMemoryCache`. Đồng thời, module Recipe lại kết hợp cả .NET Output Cache và Redis Cache-Aside mà không làm rõ cơ chế lưu trữ đằng sau của Output Cache.

#### ⚠️ Đánh giá ảnh hưởng về sau
- **Cache Invalidation Bug khi Scale-out:** Khi ứng dụng chạy 2+ container API, nếu Admin tạo danh mục mới ở Instance A, Instance A xóa `IMemoryCache` local của nó, nhưng Instance B vẫn giữ `IMemoryCache` cũ. Người dùng gửi request đến Instance B sẽ nhận dữ liệu danh mục cũ (Stale Data) tới 60 phút!
- Xung đột giữa Output Cache Middleware (.NET) và Manual Redis Cache-Aside.

#### 💡 Đề xuất Giải pháp

##### **Phương án A (Khuyên dùng): Chuẩn hóa 100% Caching qua Redis (Cache-Aside + Redis Backed Output Cache)**
- **Nội dung:**
  1. Loại bỏ toàn bộ `IMemoryCache` trong FR-CAT-001/003, thay bằng `IDistributedCache` (Redis) hoặc `RedisCacheService`.
  2. Cấu hình .NET Output Cache sử dụng **Redis làm Backing Store** (`builder.Services.AddStackExchangeRedisOutputCache(...)`).
  3. Sử dụng Redis Pub/Sub hoặc Event-driven Cache Tag Eviction (`ITagBuffer` / `EvictByTagAsync`) để invalidate cache đồng bộ trên toàn bộ cluster.
- **Ưu điểm:**
  - Đảm bảo tính Stateless 100% của Backend, sẵn sàng Horizontal Scaling (NFR-SCALE-001).
  - Tránh triệt để lỗi Stale Data giữa các instance API.
- **Nhược điểm:** Tăng Latency cực nhỏ (vài ms) so với RAM local `IMemoryCache` khi đọc cache.
- **Ảnh hưởng lâu dài:** Hạ tầng Redis thành điểm phụ thuộc quan trọng (Cần cấu hình Redis Sentinel/Cluster cho High Availability).

##### **Phương án B: Giữ `IMemoryCache` cho dữ liệu ít biến động nhưng thêm Bus Invalidation**
- **Nội dung:** Dùng `IMemoryCache` cho Categories nhưng dùng Redis Pub/Sub để phát tín hiệu xóa cache RAM ở tất cả các instance khi Admin thay đổi danh mục.
- **Ưu điểm:** Tốc độ đọc Category cực nhanh (RAM local).
- **Nhược điểm:** Phức tạp hóa kiến trúc code, vi phạm tuyên bố NFR-SCALE-001.

---

### 3. Mâu thuẫn 3 (🔴 Nghiêm trọng): Phương thức Truyền và Bảo mật Refresh Token (Request Body vs HttpOnly Cookie)

#### 📍 Vị trí mâu thuẫn trong SRS
- **Section 5.2 (REST API Spec)** & **Chương 8.1 (/auth)**: Quy định Refresh Token được truyền trong **Request Body** JSON (`{ "refreshToken": "..." }`), ghi rõ *"không dùng cookie để tránh CSRF"*.
- **NFR-SEC-005 (HTTPS & CORS)**: Lại quy định cấu hình Cookie cho Refresh Token: *"Cookie: SameSite=Strict, Secure=true (nếu dùng cookie cho refresh token)"*.

#### 📝 Mô tả mâu thuẫn
Đặc tả giao diện API và quy trình FR-AUTH yêu cầu Client lưu Refresh Token ở LocalStorage/Memory và gửi qua Request Body JSON. Trong khi đó, NFR-SEC-005 lại đưa ra hướng dẫn thiết lập Security Headers cho HttpOnly Cookie.

#### ⚠️ Đánh giá ảnh hưởng về sau
- **Rủi ro Bảo mật XSS vs CSRF:**
  - Nếu lưu Refresh Token trong LocalStorage và gửi qua Request Body: Dễ bị tấn công **XSS** (Kẻ trộm lấy được token từ `localStorage` qua malicious script).
  - Nếu dùng Cookie: Dễ bị tấn công **CSRF** nếu không cấu hình `SameSite` và anti-CSRF token chuẩn.
- Đội ngũ Frontend và Backend tranh cãi về vị trí trích xuất Refresh Token khi triển khai code.

#### 💡 Đề xuất Giải pháp

##### **Phương án A (Khuyên dùng): Sử dụng `HttpOnly`, `Secure`, `SameSite=Strict` Cookie cho Refresh Token**
- **Nội dung:** Cập nhật Section 5.2 và FR-AUTH: Refresh Token **PHẢI** được lưu trong `HttpOnly Cookie` (Javascript phía Client không thể đọc được). Access Token vẫn trả về trong JSON Body và lưu ở In-Memory của Frontend State (React Context/Zustand).
- **Ưu điểm:**
  - Chống tuyệt đối tấn công XSS lấy cắp Refresh Token.
  - `SameSite=Strict` và `HTTPS` ngăn chặn triệt để tấn công CSRF.
  - Tuân thủ khuyến nghị bảo mật OWASP cho SPA + REST API.
- **Nhược điểm:** Cần cấu hình CORS và Credentials (`withCredentials: true`) cẩn thận giữa Next.js và .NET API.
- **Ảnh hưởng lâu dài:** Bảo mật cao nhất cho tài khoản người dùng, chuẩn hóa luồng Auth với Auth.js v5.

##### **Phương án B: Giữ Refresh Token trong Request Body JSON**
- **Nội dung:** Loại bỏ đoạn tham chiếu Cookie trong NFR-SEC-005. Client tự quản lý Refresh Token trong bộ nhớ/Storage.
- **Ưu điểm:** Dễ viết code API, không vướng rào cản CORS Cookie giữa subdomain.
- **Nhược điểm:** Nguy cơ mất tài khoản cao nếu ứng dụng dính lỗi XSS.

---

### 4. Mâu thuẫn 4 (🔴 Nghiêm trọng): Bảo mật Luồng Upload Ảnh (Backend Proxy Upload vs Presigned URL)

#### 📍 Vị trí mâu thuẫn trong SRS
- **FR-RCP-008 (Quản lý Ảnh)** & **CONS-007**: Bắt buộc Upload qua Backend API bằng `multipart/form-data`. Backend thực hiện validate nghiêm ngặt: File size (≤ 5MB), MIME type, và **Magic Bytes (4 bytes đầu file)** để ngăn file độc hại.
- **Section 5.3 (Dịch vụ Bên thứ ba - MinIO)**: Ghi chú *"Presigned URL cho direct browser upload (optional)"*.

#### 📝 Mô tả mâu thuẫn
Nếu ứng dụng cho phép Browser upload trực tiếp lên MinIO bằng Presigned URL (Section 5.3), Client sẽ đẩy file thẳng tới MinIO mà **không qua Backend API**. Khi đó, toàn bộ cơ chế kiểm tra Magic Bytes, MIME validation và giới hạn kích thước tại Backend (FR-RCP-008 & CONS-007) hoàn toàn bị qua mặt (bypass).

#### ⚠️ Đánh giá ảnh hưởng về sau
- Người dùng có thể đổi đuôi file `.exe` / `.php` / `.sh` thành `.jpg` và upload thẳng lên MinIO S3 bucket qua Presigned URL.
- Nguy cơ tải lên các tệp tin chứa mã độc, vi phạm chính sách bảo mật NFR-SEC-004.

#### 💡 Đề xuất Giải pháp

##### **Phương án A (Khuyên dùng): Bỏ tùy chọn Presigned URL, bắt buộc Upload qua Backend Proxy API**
- **Nội dung:** Xóa bỏ ghi chú Presigned URL trong Section 5.3. Mọi file ảnh upload đều phải qua Endpoint `POST /api/v1/recipes/{id}/images`. Backend nhận Stream, đọc Magic Bytes kiểm tra tính hợp lệ, resize ảnh (Hangfire) rồi mới đẩy lên MinIO.
- **Ưu điểm:**
  - Kiểm soát và validate 100% tính an toàn tệp tin (magic bytes, virus scan nếu có).
  - Tuân thủ tuyệt đối CONS-007 và FR-RCP-008.
- **Nhược điểm:** Tăng băng thông và tải CPU cho Backend API server khi xử lý file.
- **Ảnh hưởng lâu dài:** Đảm bảo an toàn hệ thống, tránh nguy cơ bị chiếm quyền điều khiển kho lưu trữ.

##### **Phương án B: Dùng Presigned URL nhưng bổ sung MinIO Bucket Event + Lambda/Worker Validation**
- **Nội dung:** Cho upload thẳng lên MinIO `temp-bucket`, MinIO bắn Event sang Hangfire Worker để đọc magic bytes. Nếu tệp không hợp lệ thì Worker xóa file lập tức.
- **Ưu điểm:** Giảm tải cho API Server.
- **Nhược điểm:** Phức tạp hóa kiến trúc hạ tầng và luồng xử lý bất đồng bộ.

---

### 5. Mâu thuẫn 5 (🟡 Trung bình): Đồng bộ Tên trường Thông tin Người dùng (`FullName` vs `DisplayName` vs `Bio`)

#### 📍 Vị trí mâu thuẫn trong SRS
- **FR-AUTH-001 & FR-AUTH-007**: Định nghĩa người dùng đăng ký và cập nhật trường **`fullName`** (`{ "fullName": "...", "avatarUrl": "..." }`).
- **Section 7.7 (ApplicationUser Entity)**: Định nghĩa các cột custom gồm **`DisplayName`**, **`AvatarUrl`**, **`Bio`**.
- **Chương 8.1 (Auth Module API Table)**: Endpoint `PATCH /auth/me` nhận body `{ displayName?, avatarUrl?, bio? }`.

#### 📝 Mô tả mâu thuẫn
FR-AUTH-001/007 dùng thuật ngữ `fullName`, trong khi Database Entity (Section 7.7) và Đặc tả REST API (Chương 8.1) lại sử dụng `displayName` và hỗ trợ thêm trường `bio`.

#### ⚠️ Đánh giá ảnh hưởng về sau
- Xung đột tên thuộc tính DTO giữa Frontend và Backend (`fullName` vs `displayName`).
- Frontend gửi JSON `{ "fullName": "Nguyễn Văn A" }` nhưng Backend Validator lại chờ `{ "displayName": "Nguyễn Văn A" }` dẫn đến lỗi `400/422 Validation Error`.

#### 💡 Đề xuất Giải pháp
- **Giải pháp Thống nhất:** Chuẩn hóa toàn bộ tài liệu SRS sử dụng tên trường **`displayName`** và **`bio`**.
  - Cập nhật FR-AUTH-001 và FR-AUTH-007: Đổi `fullName` thành `displayName`, bổ sung field `bio` vào DTO cập nhật profile.
- **Ưu điểm:** Thống nhất 100% từ FR, Entity C#, DTO đến OpenAPI Spec. Tránh lỗi Mapping DTO.

---

### 6. Mâu thuẫn 6 (🟡 Trung bình): Bất bất nhất về Mã lỗi HTTP Status Code giữa FR Spec, API Spec và Phụ lục

#### 📍 Vị trí mâu thuẫn trong SRS
1. **Lỗi Validation (FluentValidation):**
   - FR-AUTH-001 & FR-RCP-003: Quy định trả về **HTTP 422 Unprocessable Entity**.
   - Phụ lục A, Phụ lục B (`VALIDATION_ERROR`) & Chapter 8.1: Quy định trả về **HTTP 400 Bad Request**.
2. **Lỗi Xung đột Dữ liệu Concurrency (`RowVersion` mismatch):**
   - FR-RCP-004: Quy định trả về **HTTP 409 Conflict**.
   - Phụ lục A & Phụ lục B (`RECIPE_CONCURRENCY_CONFLICT`): Quy định trả về **HTTP 422 Unprocessable Entity**.

#### 📝 Mô tả mâu thuẫn
Quy định mã phản hồi lỗi HTTP không nhất quán giữa các chương đặc tả chức năng (FR) và các Phụ lục mã lỗi (Phụ lục A, B).

#### ⚠️ Đánh giá ảnh hưởng về sau
- Frontend Interceptor / Error Handler không bắt đúng HTTP Status Code để hiển thị UI tương ứng (ví dụ: chờ 422 để hiển thị Form Inline Error nhưng API lại trả về 400).
- Vi phạm quy ước chuẩn hóa RFC 7807.

#### 💡 Đề xuất Giải pháp
- **Giải pháp Thống nhất:**
  1. **Validation Failures (Lỗi cú pháp / Dữ liệu đầu vào):** Thống nhất dùng **`HTTP 400 Bad Request`** (kèm RFC 7807 `errors` object).
  2. **Concurrency Conflict (`RowVersion` / Lock):** Thống nhất dùng **`HTTP 409 Conflict`** (đúng ngữ nghĩa RFC 7231 cho xung đột trạng thái tài nguyên).
  3. **Unprocessable Entity (HTTP 422):** Dùng cho các lỗi vi phạm Business Rule ngữ nghĩa (ví dụ: Publish recipe khi chưa có bước thực hiện).
- **Ưu điểm:** Chuẩn hóa toàn bộ hệ thống HTTP Status Code, trợ giúp Frontend catch error nhất quán.

---

### 7. Mâu thuẫn 7 (🟡 Trung bình): Phạm vi Tìm kiếm Công thức Nháp (Draft Recipe Search Policy)

#### 📍 Vị trí mâu thuẫn trong SRS
- **FR-RCP-001 & FR-CAT-002**: Tác giả (Author) có quyền xem công thức của mình ở cả trạng thái **`Published` và `Draft`** (`Status == Published OR (Draft AND AuthorId == currentUserId)`).
- **FR-SRCH-001 (Full-Text Search)**: Quy định cứng *"Chỉ trả về Status == Published recipes"*.

#### 📝 Mô tả mâu thuẫn
Khi dùng tính năng duyệt danh sách/danh mục (FR-RCP-001), Author tìm thấy bài viết nháp của mình. Nhưng khi gõ từ khóa vào ô Tìm kiếm (FR-SRCH-001), hệ thống lại không trả về bài viết nháp đó do bộ lọc cứng `Status == Published`.

#### ⚠️ Đánh giá ảnh hưởng về sau
Tác giả muốn tìm kiếm lại công thức nháp mình từng viết để chỉnh sửa nhưng ô Tìm kiếm không trả về kết quả, gây hiểu nhầm bài viết đã bị mất (trải nghiệm người dùng kém).

#### 💡 Đề xuất Giải pháp
- **Giải pháp:** Cập nhật FR-SRCH-001 áp dụng **Authorization Filter tương tự FR-RCP-001**:
  - Guest: Chỉ tìm thấy bài viết `Published`.
  - Author: Tìm thấy bài viết `Published` + bài viết `Draft` do chính mình tạo.
  - Admin: Tìm thấy bài viết ở tất cả trạng thái.
- **Ưu điểm:** Nhất quán logic phân quyền toàn ứng dụng, tối ưu UX cho Author.

---

### 8. Mâu thuẫn 8 (🟡 Trung bình): Quy định Xóa Danh mục chứa Công thức (Cascade vs Restrict vs Soft Delete)

#### 📍 Vị trí mâu thuẫn trong SRS
- **FR-CAT-005**: Quy định nghiệp vụ: KHÔNG được xóa danh mục còn chứa công thức (`count > 0` → trả HTTP 409 Conflict).
- **Section 7.2 (Recipe Entity)**: Cột `CategoryId` có ràng buộc `FK -> Categories.Id`, `ON DELETE RESTRICT`.
- **Chapter 8.2 (API Spec Table)**: Ghi chú `DELETE /categories/{id}` là `(soft delete)`.

#### 📝 Mô tả mâu thuẫn
FR-CAT-005 định nghĩa quy tắc nghiệp vụ dạng Soft Check (đếm số recipe), Section 7.2 cài đặt Hard Check DB (`ON DELETE RESTRICT`), trong khi API Spec lại ghi chú Soft Delete danh mục. Nếu Soft Delete Danh mục (`IsDeleted = true`), ràng buộc FK DB `ON DELETE RESTRICT` không phát huy tác dụng vì đây không phải câu lệnh SQL `DELETE` vật lý.

#### ⚠️ Đánh giá ảnh hưởng về sau
Nếu Admin Soft Delete một Danh mục, các Recipe thuộc Danh mục đó vẫn tham chiếu tới `CategoryId` đã bị đánh dấu `IsDeleted = true`. Khi hiển thị công thức lên Web, thông tin Danh mục có thể bị rác (`null` Category).

#### 💡 Đề xuất Giải pháp
- **Giải pháp:** Thống nhất quy trình Soft Delete Danh mục:
  1. Giữ quy tắc FR-CAT-005: Cấm Soft Delete danh mục nếu còn Recipe hoạt động (`IsDeleted = false`).
  2. Bắt buộc Admin phải chuyển toàn bộ Recipe sang Danh mục khác (hoặc Danh mục Mặc định "Uncategorized") trước khi thực hiện Soft Delete.
- **Ưu điểm:** Tránh orphan records, đảm bảo 100% công thức luôn có Danh mục hiển thị hợp lệ.

---

### 9. Mâu thuẫn 9 (🟢 Thấp): Bất nhất Phiên bản Framework Frontend (Next.js 14+ vs Next.js 15)

#### 📍 Vị trí mâu thuẫn trong SRS
- **Section 1.4 (Tài liệu Tham chiếu - STT 10)**: Trích dẫn *"Next.js 15 App Router Documentation"*.
- **Section 6.1 (Tổng quan Kiến trúc - Bảng 6.1)**: Ghi *"Next.js 14+ App Router"*.
- **Header & Cover Page**: Ghi *"Next.js App Router"*.

#### 📝 Mô tả mâu thuẫn
Sự không đồng nhất giữa phiên bản Next.js 14 và Next.js 15 trong tài liệu.

#### ⚠️ Đánh giá ảnh hưởng về sau
Next.js 15 có một số Breaking Changes lớn so với Next.js 14 (như cơ chế Uncached `fetch` mặc định, Async `params`/`searchParams` trong Server Components). Việc không chốt phiên bản cụ thể gây ra lỗi runtime khi nâng cấp package.

#### 💡 Đề xuất Giải pháp
- **Giải pháp:** Thống nhất chốt phiên bản **Next.js 15 LTS** cho dự án.
- **Cập nhật tài liệu:** Sửa tất cả các vị trí trong tài liệu thành `Next.js 15 (App Router)`.

---

### 10. Mâu thuẫn 10 (🟢 Thấp): Phân định Trách nhiệm Rate Limiting giữa các Tầng Hạ tầng

#### 📍 Vị trí mâu thuẫn trong SRS
- **Section 2.1.2 & Section 6.1**: Ghi Nginx đảm nhận *"Rate limiting basic"*.
- **Section 6.1 (Cache Layer)**: Ghi Redis lưu trữ *"Rate limiting counters"*.
- **NFR-SEC-003**: Ghi *"Implementation: ASP.NET Core Rate Limiting middleware"*.

#### 📝 Mô tả mâu thuẫn
Cả 3 thành phần (Nginx, Redis, ASP.NET Core Middleware) đều được ghi nhận làm nhiệm vụ Rate Limiting nhưng thiếu sơ đồ phân định rõ trách nhiệm tầng nào xử lý loại Rate Limit nào.

#### ⚠️ Đánh giá ảnh hưởng về sau
Dẫn đến việc cấu hình trùng lặp (ví dụ: Nginx chặn nhầm request hợp lệ trước khi tới được middleware của .NET) hoặc bỏ sót điểm kiểm soát.

#### 💡 Đề xuất Giải pháp
- **Giải pháp Phân định 2 Tầng Rate Limiting rõ ràng:**
  1. **Tầng Nginx (Layer 4/7 Infrastructure Limit):** Giới hạn thô chống DDOS toàn cục (ví dụ: tối đa 300 req/phút/IP cho toàn bộ static/API requests).
  2. **Tầng ASP.NET Core Middleware + Redis (Application Level Limit):** Giới hạn tinh chi tiết theo từng Endpoint nghiệp vụ như NFR-SEC-003 đã định nghĩa (Auth: 10 req/phút, Upload: 5 req/phút, API: 100 req/phút). Redis đóng vai trò lưu Distributed Counter cho Middleware khi scale out.
- **Ưu điểm:** Kiến trúc rõ ràng, bảo vệ hệ thống 2 lớp chuyên biệt.

---

### 11. Mâu thuẫn 11 (🟢 Thấp): Bất tương thích giữa Quy mô Kỳ vọng Ban đầu và Thiết kế Mở rộng

#### 📍 Vị trí mâu thuẫn trong SRS
- **Section 2.6.1 (Giả định)**: Xác định quy mô ban đầu nhỏ (`≤ 10,000 công thức`, `≤ 5,000 người dùng`), phù hợp triển khai **Single-Server Deployment**.
- **NFR-SCALE-002 & NFR-SCALE-003**: Đề xuất các giải pháp quy mô cực lớn như **Table Partitioning cho > 1 triệu rows**, **Multi-node MinIO Cluster (4+ nodes)**, và Read Replicas.

#### 📝 Mô tả mâu thuẫn
Quy mô dữ liệu kỳ vọng ở Chương 2 chỉ ở mức bài toán nhỏ/vừa (Single Server), trong khi Chương 4 (NFR-SCALE) lại đưa ra các giải pháp thiết kế cho hệ thống hàng triệu người dùng (High Scalability).

#### ⚠️ Đánh giá ảnh hưởng về sau
Gây ngợp cho đội ngũ phát triển (Over-engineering), tốn chi phí hạ tầng không cần thiết ở giai đoạn MVP / Khóa học.

#### 💡 Đề xuất Giải pháp
- **Giải pháp:** Phân kỳ kiến trúc rõ ràng trong tài liệu:
  - **Giai đoạn 1 (Baseline - Scope khóa học/MVP):** Triển khai Single Server qua Docker Compose (1 API container, 1 Postgres, 1 Redis, 1 MinIO) đúng như Section 2.6.1 và Section 5.4.
  - **Giai đoạn 2 (Future Enhancement):** Đánh dấu các mục Partitioning > 1M rows và Multi-node MinIO thành *"Định hướng mở rộng tương lai (Optional / Scalability Roadmap)"*.
- **Ưu điểm:** Giúp team tập trung hoàn thành đúng tiến độ MVP mà vẫn giữ được tầm nhìn kiến trúc dài hạn.

---

## BẢNG TỔNG HỢP ĐỀ XUẤT CHỈNH SỬA TRỰC TIẾP VÀO FILE SRS

Để chuẩn hóa file [SRS_Culinary_Blog_v1.0.0.md](file:///f:/PTUDWebNangCao_2026_Nhom13/SRS_Culinary_Blog_v1.0.0.md), cần thực hiện các chỉnh sửa sau:

| STT | Mục / Chương | Nội dung hiện tại (Lỗi/Mâu thuẫn) | Nội dung chuẩn hóa mới |
| :---: | :--- | :--- | :--- |
| 1 | **FR-RCP-007** | Hard delete vật lý (`Remove()`) | Đổi thành **Soft Delete** (`IsDeleted = true`). Thêm bớt bài viết con ngầm định ẩn theo Filter. |
| 2 | **FR-CAT-001/003** | Dùng `IMemoryCache` local | Đổi thành **`RedisCacheService`** để đảm bảo Backend Stateless. |
| 3 | **Section 5.2 & FR-AUTH** | Send Refresh Token in JSON Body | Đổi thành gửi qua **`HttpOnly Secure Cookie`** để chống XSS. |
| 4 | **FR-RCP-008 & Sec 5.3** | Nhắc tới Presigned URL direct upload | Xóa bỏ Presigned URL, bắt buộc **Proxy Upload qua API Backend** để kiểm tra Magic Bytes. |
| 5 | **FR-AUTH-001/007** | Dùng trường `fullName` | Đổi thành **`displayName`** và thêm **`bio`** cho đồng bộ với Entity & API Spec. |
| 6 | **Phụ lục A & B** | Xung đột HTTP 400 vs 422 vs 409 | Validation → **400**, Concurrency → **409**, Business Logic → **422**. |
| 7 | **FR-SRCH-001** | Chỉ search bài Published | Cho phép **Author search bài Draft của chính mình**. |
| 8 | **Toàn bộ SRS** | Nhắc tới Next.js 14+ / Next.js 15 | Thống nhất chốt phiên bản **Next.js 15 (App Router)**. |

---
*Báo cáo được tổng hợp tự động và phân tích chuyên sâu bởi Chuyên gia Kiến trúc Phần mềm.*
