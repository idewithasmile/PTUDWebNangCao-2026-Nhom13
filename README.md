# 🍳 Culinary Blog - Nền tảng Chia sẻ Công thức Nấu ăn

Chào mừng đội ngũ phát triển đến với dự án **Culinary Blog**! 
Đây là tài liệu hướng dẫn khởi tạo dự án, kiến trúc tổng quan và các quy tắc nghiệp vụ quan trọng nhằm đảm bảo tính đồng nhất trong quá trình code (dựa trên SRS v1.0.0 và báo cáo phân tích kỹ thuật SPEC).

---

## 🚀 Công nghệ sử dụng (Tech Stack)

Hệ thống được thiết kế theo mô hình **API-Driven Architecture**, tách biệt hoàn toàn giữa Frontend và Backend.

### Backend (Clean Architecture + CQRS)
- **Framework:** .NET 10 (Minimal APIs, C#)
- **Database:** PostgreSQL 16 (Entity Framework Core 10, Code-First)
- **Cache:** Redis 7 (Distributed Cache & Redis Backed Output Cache)
- **Object Storage:** MinIO (S3-Compatible)
- **Background Jobs:** Hangfire
- **Observability:** Serilog (Logging), OpenTelemetry (Tracing)

### Frontend
- **Framework:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **State Management & Data Fetching:** TanStack Query (React Query)
- **Authentication:** Auth.js v5
- **Form Handling:** React Hook Form + Zod

### Deployment & DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server / Reverse Proxy:** Nginx

---

## ⚙️ Yêu cầu Môi trường (Prerequisites)

Để chạy dự án trên máy cá nhân (Local Development), bạn cần cài đặt:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Bắt buộc để chạy DB, Redis, MinIO).
2. **[.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)**.
3. **[Node.js 22 LTS](https://nodejs.org/)** (hoặc tối thiểu v20) và `npm` v10+.
4. **IDE khuyến nghị:** Visual Studio 2022 v17.12+ / JetBrains Rider / VS Code (với C# Dev Kit & ESLint, Prettier extensions).
5. **Git** (khuyến nghị có Git LFS).

---

## 🛠 Hướng dẫn Cài đặt & Chạy dự án (Getting Started)

### Bước 1: Khởi động Hạ tầng (Infrastructure)
Dự án sử dụng Docker Compose để tự động dựng PostgreSQL, Redis, MinIO và Seq (để xem log).

```bash
# Di chuyển vào thư mục chứa file docker-compose.yml
cd infrastructure

# Khởi động các dịch vụ ngầm
docker-compose up -d
```
*Các cổng dịch vụ mặc định:* PostgreSQL (5432), Redis (6379), MinIO (9000), MinIO Console (9001), Seq (5341).

### Bước 2: Chạy Backend API (.NET 10)
```bash
# Di chuyển vào thư mục Backend
cd backend/CulinaryBlog.API

# Khôi phục các packages
dotnet restore

# Chạy Entity Framework Migrations để tạo cấu trúc Database
dotnet ef database update

# Khởi chạy API
dotnet run
```
*API sẽ chạy tại: `http://localhost:5000/api/v1`* (Giao diện Swagger/Scalar có tại `http://localhost:5000/scalar`).

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

---

## 🚨 Quy ước Phát triển Quan trọng (BẮT BUỘC ĐỌC)

Dựa trên phân tích kiến trúc (SPEC.md), toàn bộ team cần **tuân thủ nghiêm ngặt** các quy định sau để tránh conflict và bug tiềm ẩn:

### 1. Quản lý Dữ liệu (Soft Delete)
- **Công thức (Recipe) và Danh mục (Category) PHẢI sử dụng Soft Delete.**
- Tuyệt đối **không** dùng `DbContext.Remove()`. Thay vào đó, gán `IsDeleted = true` và `UpdatedAt = DateTime.UtcNow`.
- Các Entity con (Steps, Ingredients) sẽ được tự động ẩn nhờ Global Query Filter `.Where(x => !x.IsDeleted)` thiết lập ở `DbContext`.

### 2. Chiến lược Cache (Stateless)
- **Chỉ sử dụng Redis** (`IDistributedCache` / `RedisCacheService`) cho mọi tác vụ caching (Recipe, Category).
- Tuyệt đối **KHÔNG sử dụng `IMemoryCache`** để đảm bảo Backend hoàn toàn Stateless khi scale out.
- Sử dụng Output Cache của .NET nhưng phải cấu hình dùng Redis làm Backing Store.

### 3. Bảo mật Token & Authentication
- **Access Token (JWT - 15 phút):** Frontend lưu trong In-Memory / React State.
- **Refresh Token (7 ngày):** **PHẢI** được trả về và đọc thông qua **`HttpOnly`, `Secure`, `SameSite=Strict` Cookie**. Tuyệt đối không trả Refresh Token qua JSON Body để phòng chống tấn công XSS.

### 4. Xử lý File Upload (Ảnh)
- Toàn bộ ảnh tải lên **PHẢI** đi qua endpoint của Backend (`POST /api/v1/recipes/{id}/images`).
- Backend sẽ kiểm tra dung lượng (≤ 5MB), MIME type, và **đọc Magic Bytes (4 bytes đầu)** để chặn file độc hại trước khi chuyển tiếp lên MinIO. 
- **Không** sử dụng tính năng Presigned URL upload trực tiếp từ Browser lên MinIO.

### 5. Chuẩn hóa Tên biến (Naming Convention)
- Thông tin cá nhân của `ApplicationUser` sử dụng thống nhất 2 trường: **`displayName`** và **`bio`** (Tuyệt đối không dùng `fullName`). DTO mapping giữa Frontend và Backend phải tuân thủ tên này.

### 6. Mã phản hồi lỗi HTTP (Status Codes)
Hệ thống sử dụng chuẩn **RFC 7807 Problem Details** với các HTTP code được quy ước rõ như sau:
- `400 Bad Request`: Các lỗi do dữ liệu đầu vào (Validation Failures từ FluentValidation).
- `409 Conflict`: Xung đột dữ liệu (Ví dụ: `RowVersion` mismatch do 2 người cùng sửa, Email trùng lặp).
- `422 Unprocessable Entity`: Dữ liệu đúng cú pháp nhưng vi phạm quy tắc nghiệp vụ (Business Logic) - ví dụ: *Publish công thức nhưng chưa có bước thực hiện nào*.

---

## 📁 Cấu trúc Thư mục (Folder Structure)

```text
culinary-blog/
├── backend/                  # .NET 10 Solution
│   ├── CulinaryBlog.Domain         # Entities, Enums, Interfaces (Core)
│   ├── CulinaryBlog.Application    # CQRS (MediatR), DTOs, FluentValidation
│   ├── CulinaryBlog.Infrastructure # EF Core, Redis, MinIO, Hangfire, Email
│   └── CulinaryBlog.API            # Minimal APIs, Middlewares, DI Setup
├── frontend/                 # Next.js 15 Application
│   ├── src/app                     # App Router pages
│   ├── src/components              # Reusable UI components (Tailwind)
│   ├── src/hooks                   # Custom React hooks (TanStack Query)
│   ├── src/services                # API calls (Axios/Fetch)
│   └── src/types                   # TypeScript interfaces
├── infrastructure/           # Docker configuration
│   ├── docker-compose.yml
│   └── nginx/
└── docs/                     # SRS, Specifications, Database Diagram
```

---

## 🔗 Các liên kết hữu ích trong quá trình Dev
- **API Documentation (Scalar UI):** `http://localhost:5000/scalar`
- **Hangfire Dashboard (Quản lý Job):** `http://localhost:5000/hangfire` (Cần role Admin)
- **MinIO Console (Quản lý File):** `http://localhost:9001` (User/Pass trong docker-compose)
- **Seq Log Dashboard:** `http://localhost:5341`
 
