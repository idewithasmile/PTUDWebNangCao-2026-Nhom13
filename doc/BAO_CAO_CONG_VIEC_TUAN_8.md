# BÁO CÁO CÔNG VIỆC TUẦN 8 - DỰ ÁN CULINARY BLOG

- **Học phần:** Phát triển Ứng dụng Web Nâng Cao (PTUDWebNangCao-2026)
- **Nhóm thực hiện:** Nhóm 13
- **Thành viên thực hiện:** 2312719 - Lê Quốc Phước
- **Nhánh Git:** `2312719-Phuoc/Tuan-8`
- **Công nghệ nền tảng:** .NET 10 (C# 13, Minimal APIs, EF Core, MediatR, Hangfire, MinIO S3) & Next.js 15 App Router (TypeScript, Tailwind CSS, TanStack Query, next-themes).

---

## I. MỤC TIÊU VÀ TỔNG QUAN

Trong Tuần 8, mục tiêu trọng tâm là hoàn thiện việc kiểm tra và giải quyết dứt điểm 5 vấn đề kỹ thuật còn tồn tại (Vấn đề 7, 8, 9, 11, 12) theo tài liệu đối soát `doc/KIEM_TRA_VAN_DE_TON_TAI.md`:
1. **[VẤN ĐỀ 7]** Dọn dẹp tệp tin mồ côi (Orphan Files) trên MinIO S3 bằng Hangfire Recurring Job.
2. **[VẤN ĐỀ 8]** Thiết lập hạn mức Quota lưu trữ tệp tin theo Người dùng (Storage Quota).
3. **[VẤN ĐỀ 9]** Tối ưu tính nhất quán và loại bỏ Race Condition cho `RecipeCount` của Danh mục món ăn.
4. **[VẤN ĐỀ 11]** Cài đặt Chế độ Giao diện Tối (Dark Mode) toàn diện cho Frontend Next.js.
5. **[VẤN ĐỀ 12]** Xử lý ngoại lệ Graceful Fallback khi Backend gián đoạn trên Server-Side Render (SSR).

Tất cả các giải pháp được triển khai nghiêm ngặt theo tiêu chuẩn **Clean Architecture**, **CQRS (MediatR)**, kiểm thử tự động đạt **100% GREEN (295/295 tests pass)** và **0 lỗi TypeScript**.

---

## II. CHI TIẾT CÁC HẠNG MỤC ĐÃ HOÀN THÀNH

### 1. [VẤN ĐỀ 7] Dọn dẹp tệp tin mồ côi (Orphan Files) trên MinIO S3
- **Hiện trạng trước sửa đổi:** Khi người dùng upload ảnh lên MinIO bucket `culinary-blog` nhưng hủy form hoặc lỗi mạng, các object này không được CSDL liên kết và tồn tại vĩnh viễn gây lãng phí dung lượng storage.
- **Giải pháp kỹ thuật đã triển khai:**
  - Bổ sung `ListAllFilesAsync(string? folder = null, CancellationToken ct = default)` và `GetLastModifiedAsync(string fileKey, CancellationToken ct = default)` vào interface `IFileStorageService` và cài đặt trong `MinioFileStorageService` sử dụng `ListObjectsEnumAsync` và `StatObjectAsync`.
  - Tạo Hangfire Recurring Job `PurgeOrphanFilesJob` (`src/Infrastructure/Jobs/PurgeOrphanFilesJob.cs`):
    - Trích xuất toàn bộ Key ảnh đang sử dụng từ CSDL: `RecipeImages` (`OriginalUrl`, `MediumUrl`, `ThumbnailUrl`), `Categories` (`ImageUrl`), `Users` (`AvatarUrl`).
    - Quét toàn bộ object trong MinIO bucket `culinary-blog`.
    - Lọc những object không tồn tại trong CSDL và có thời gian tạo (`LastModified`) đã qua 24 giờ (đảm bảo an toàn không xóa nhầm file đang trong quá trình upload tạo công thức).
    - Thực hiện xóa idempotent và ghi nhận structured log chi tiết.
  - Đăng ký Recurring Job tự động kích hoạt vào lúc **02:00 AM hàng ngày** (`0 2 * * *`) trong `DependencyInjection.cs`.
  - Viết Unit Test: `PurgeOrphanFilesJobTests.cs` kiểm tra chính xác hành vi xóa orphan và giữ lại file hợp lệ hoặc file mới tạo < 24h.

---

### 2. [VẤN ĐỀ 8] Thiết lập Hạn mức Quota Lưu trữ Tệp tin theo Người dùng
- **Hiện trạng trước sửa đổi:** Chưa có cơ chế giới hạn số lượng ảnh cho mỗi công thức cũng như tổng dung lượng lưu trữ của tác giả, tiềm ẩn rủi ro cạn kiệt tài nguyên MinIO bucket.
- **Giải pháp kỹ thuật đã triển khai:**
  - Cấu hình hạn mức trong `appsettings.json`:
    ```json
    "StorageQuota": {
      "MaxImagesPerRecipe": 10,
      "MaxTotalStorageMbPerUser": 50
    }
    ```
  - Định nghĩa `StorageQuotaOptions` và tạo service `IStorageQuotaService` / `StorageQuotaService`:
    - `EnsureRecipeImageLimitNotReachedAsync(Guid recipeId)`: Kiểm tra số lượng ảnh hiện có của công thức. Nếu đạt $\ge 10$ ảnh, trả về mã lỗi HTTP 400 Problem Details (`RECIPE_IMAGE_LIMIT_REACHED`).
    - `EnsureUserStorageQuotaNotExceededAsync(Guid userId, long incomingFileSizeBytes)`: Tính tổng dung lượng ảnh thuộc sở hữu của User trong hệ thống (`RecipeImages` + `Users`), từ chối nếu vượt quá 50MB (`STORAGE_QUOTA_EXCEEDED` - HTTP 400).
  - Tích hợp kiểm tra hạn mức tại `UploadRecipeImageCommandHandler` và `POST /api/v1/files/upload`.
  - Viết Unit Test: `StorageQuotaServiceTests.cs` kiểm thử các trường hợp vượt hạn mức và hợp lệ.

---

### 3. [VẤN ĐỀ 9] Tối ưu Tính Nhất Quán và Loại Bỏ Race Condition cho `RecipeCount`
- **Hiện trạng trước sửa đổi:** Số lượng món ăn `RecipeCount` tính động trên danh mục có thể bị stale hoặc sai lệch khi nhiều tiến trình thêm/sửa/xóa bài viết đồng thời do bộ đệm Redis/Output Cache không được làm mới kịp thời.
- **Giải pháp kỹ thuật đã triển khai:**
  - `CategoryRepository.GetAllWithRecipeCountAsync()` sử dụng `AsNoTracking` kèm subquery đếm trực tiếp trên PostgreSQL: `Count(r => !r.IsDeleted && r.Status == RecipeStatus.Published)`.
  - Toàn bộ các CQRS Commands làm thay đổi trạng thái hoặc số lượng công thức:
    - `CreateRecipeCommand`
    - `UpdateRecipeCommand`
    - `PublishRecipeCommand`
    - `UnpublishRecipeCommand`
    - `ArchiveRecipeCommand`
    - `DeleteRecipeCommand`
    đều kế thừa `ICacheInvalidator` với cache key `"categories:all"` để xóa Distributed Cache Redis ngay khi giao dịch thành công.
  - Đồng thời tại `RecipesEndpoints.cs`, tất cả các endpoint mutation gọi `cacheStore.EvictByTagAsync("categories", ct)` để xóa sạch Output Cache tag `"categories"`.
  - Bổ sung Integration/Concurrency Test: `CategoryRecipeCountConcurrencyTests.cs` giả lập 5 tác vụ publish/unpublish đồng thời, xác nhận `RecipeCount` sau khi xóa cache luôn phản ánh chính xác 100% số liệu trong PostgreSQL.

---

### 4. [VẤN ĐỀ 11] Cài đặt Chế độ Giao diện Tối (Dark Mode) Toàn diện cho Next.js
- **Hiện trạng trước sửa đổi:** Giao diện chỉ có màu sáng Light Theme, thiếu cơ chế chuyển đổi chủ đề (Theme Toggle) và chưa có style Dark Mode.
- **Giải pháp kỹ thuật đã triển khai:**
  - Cài đặt thư viện `next-themes`.
  - Cấu hình `darkMode: 'class'` trong `frontend/tailwind.config.ts`.
  - Bọc `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`) trong `providers.tsx`.
  - Bổ sung `suppressHydrationWarning` trên thẻ `<html>` và cấu hình dark classes trên `<body>` trong `layout.tsx`.
  - Xây dựng component `ThemeToggle.tsx` (`frontend/src/components/common/ThemeToggle.tsx`):
    - Sử dụng các biểu tượng `Sun`, `Moon`, `Laptop` từ `lucide-react`.
    - Hỗ trợ đầy đủ 3 tùy chọn: Sáng (Light), Tối (Dark), Theo hệ thống (System).
    - Xử lý cơ chế chống hydration mismatch an toàn bằng state `mounted`.
  - Tích hợp `ThemeToggle` lên `SiteHeader.tsx` (cả phiên bản desktop và mobile drawer) và tối ưu hóa các class Tailwind dark mode trên toàn bộ Header, Footer (`site-footer.tsx`), Trang chủ (`page.tsx`), và Trang danh mục (`CategoriesClientView.tsx`).

---

### 5. [VẤN ĐỀ 12] Xử lý Ngoại lệ Graceful Fallback khi Backend gián đoạn trên SSR
- **Hiện trạng trước sửa đổi:** Khi Backend chưa khởi động hoặc gặp sự cố rớt mạng trong lúc Server-Side Render (SSR), các trang RSC ném unhandled exception làm crash ứng dụng (HTTP 500).
- **Giải pháp kỹ thuật đã triển khai:**
  - Tạo component `OfflineBanner.tsx` (`frontend/src/components/common/OfflineBanner.tsx`): Hiển thị thông báo nhẹ nhàng thân thiện kèm nút "Tải lại" / F5, hỗ trợ cả 2 theme Light & Dark.
  - Trong `category-service.ts`: Cung cấp phương thức `getCategoriesSafe()` bọc trong try-catch, bắt các lỗi mạng (`ECONNREFUSED`, `ETIMEDOUT`, `AbortError`) và trả về `{ categories: [], isOffline: true }` thay vì crash RSC.
  - Trong `recipe-service.ts`: Củng cố `getRecipes()` và `searchRecipes()` trả về fallback rỗng `{ items: [], totalCount: 0, ... }` an toàn khi không thể kết nối tới Backend.
  - Tích hợp cờ `isOffline` và hiển thị `OfflineBanner` tại `app/page.tsx` và `app/categories/page.tsx`.

---

## III. KẾT QUẢ KIỂM THỬ VÀ NGHIỆM THU

### 1. Kiểm thử Backend (.NET 10 Solution)
- **Lệnh thực hiện:** `dotnet test backend/CulinaryBlog.sln`
- **Kết quả:**
  - `CulinaryBlog.Domain.Tests`: 23/23 PASSED (100%)
  - `CulinaryBlog.Application.Tests`: 114/114 PASSED (100%)
  - `CulinaryBlog.Infrastructure.Tests`: 34/34 PASSED (100%)
  - `CulinaryBlog.Api.Tests`: 4/4 PASSED (100%)
  - `CulinaryBlog.UnitTests`: 105/105 PASSED (100%)
  - `CulinaryBlog.API.IntegrationTests`: 15/15 PASSED (100%)
  - **TỔNG CỘNG: 295 / 295 TESTS PASSED** (Vượt cam kết tối thiểu 284 tests, 0 failed, 0 skipped).

### 2. Kiểm thử Frontend (TypeScript & Next.js)
- **Lệnh thực hiện:** `cmd /c "cd frontend && npx tsc --noEmit"`
- **Kết quả:** **Exit code 0** (0 lỗi TypeScript, chuẩn type-safety 100%).

---

## IV. BẢNG TỔNG HỢP CÁC FILE ĐÃ TẠO MỚI VÀ SỬA ĐỔI

| STT | Tệp tin | Trạng thái | Nội dung chính |
|:---:|:---|:---:|:---|
| 1 | `backend/src/Domain/Interfaces/IFileStorageService.cs` | Tạo mới | Bổ sung `ListAllFilesAsync` và `GetLastModifiedAsync` |
| 2 | `backend/src/Infrastructure/Services/MinioFileStorageService.cs` | Sửa đổi | Cài đặt quét object và lấy ngày sửa đổi trên MinIO S3 |
| 3 | `backend/src/Application/Common/Interfaces/IPurgeOrphanFilesJob.cs` | Tạo mới | Interface Hangfire Job dọn dẹp file mồ côi |
| 4 | `backend/src/Infrastructure/Jobs/PurgeOrphanFilesJob.cs` | Tạo mới | Job đối soát CSDL với MinIO và xóa file mồ côi > 24h |
| 5 | `backend/src/Application/Common/Models/StorageQuotaOptions.cs` | Tạo mới | Model cấu hình hạn mức upload ảnh và dung lượng storage |
| 6 | `backend/src/Application/Common/Interfaces/IStorageQuotaService.cs` | Tạo mới | Interface kiểm tra quota ảnh/công thức và quota user |
| 7 | `backend/src/Infrastructure/Services/StorageQuotaService.cs` | Tạo mới | Service kiểm tra giới hạn 10 ảnh/món và 50MB/user |
| 8 | `backend/src/Presentation/appsettings.json` | Sửa đổi | Thêm cấu hình `"StorageQuota"` |
| 9 | `backend/src/Infrastructure/DependencyInjection.cs` | Sửa đổi | Đăng ký Quota Service, Orphan Purge Job, Hangfire 02:00 AM |
| 10 | `backend/src/Application/Features/Recipes/Commands/UploadRecipeImage/...` | Sửa đổi | Kiểm tra hạn mức 10 ảnh trước khi upload ảnh công thức |
| 11 | `backend/src/Presentation/Endpoints/FilesEndpoints.cs` | Sửa đổi | Kiểm tra quota dung lượng người dùng trước khi lưu file |
| 12 | `backend/src/Application/Features/Recipes/Commands/...` (6 commands) | Sửa đổi | Kế thừa `ICacheInvalidator` làm mới cache `categories:all` |
| 13 | `backend/src/Presentation/Endpoints/RecipesEndpoints.cs` | Sửa đổi | Xóa output cache tag `"categories"` khi sửa đổi công thức |
| 14 | `backend/tests/CulinaryBlog.UnitTests/Jobs/PurgeOrphanFilesJobTests.cs` | Tạo mới | Unit Test kiểm thử logic dọn dẹp file mồ côi |
| 15 | `backend/tests/CulinaryBlog.UnitTests/Services/StorageQuotaServiceTests.cs` | Tạo mới | Unit Test kiểm thử hạn mức quota lưu trữ |
| 16 | `backend/tests/CulinaryBlog.UnitTests/Categories/...ConcurrencyTests.cs` | Tạo mới | Test kiểm thử concurrency tính nhất quán của `RecipeCount` |
| 17 | `frontend/tailwind.config.ts` | Sửa đổi | Cấu hình `darkMode: 'class'` |
| 18 | `frontend/src/app/providers.tsx` | Sửa đổi | Bọc `ThemeProvider` quản lý Light/Dark/System mode |
| 19 | `frontend/src/app/layout.tsx` | Sửa đổi | Thêm `suppressHydrationWarning` và dark classes |
| 20 | `frontend/src/components/common/ThemeToggle.tsx` | Tạo mới | Component chuyển đổi giao diện Sáng / Tối / Hệ thống |
| 21 | `frontend/src/components/site-header.tsx` | Sửa đổi | Tích hợp ThemeToggle trên desktop và mobile drawer |
| 22 | `frontend/src/components/site-footer.tsx` | Sửa đổi | Bổ sung dark mode classes |
| 23 | `frontend/src/components/common/OfflineBanner.tsx` | Tạo mới | Component thông báo kết nối máy chủ gián đoạn |
| 24 | `frontend/src/lib/services/category-service.ts` | Sửa đổi | Bổ sung `getCategoriesSafe` hỗ trợ SSR Fallback |
| 25 | `frontend/src/lib/services/recipe-service.ts` | Sửa đổi | Thêm fallback an toàn khi backend offline |
| 26 | `frontend/src/app/categories/page.tsx` | Sửa đổi | Sử dụng `getCategoriesSafe` và hiển thị `OfflineBanner` |
| 27 | `frontend/src/components/categories/CategoriesClientView.tsx` | Sửa đổi | Hỗ trợ hiển thị banner offline và tối ưu Dark Mode |
| 28 | `frontend/src/app/page.tsx` | Sửa đổi | Tích hợp `OfflineBanner` và Dark Mode |

---

## V. ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN TIẾP THEO

- Toàn bộ 5 vấn đề kỹ thuật trọng tâm theo `doc/KIEM_TRA_VAN_DE_TON_TAI.md` đã được xử lý triệt để, đảm bảo tính ổn định, hiệu năng và trải nghiệm người dùng.
- Hệ thống sẵn sàng cho đợt báo cáo tiến độ và demo kết quả Tuần 8.
