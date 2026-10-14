# GIÁO TRÌNH PHÁT TRIỂN ỨNG DỤNG WEB NÂNG CAO
### Phiên bản V4 · .NET 10 + Next.js 15 (App Router)

---

# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM
## Software Requirements Specification (SRS)
### Tiêu chuẩn IEEE 830-1998 / ISO/IEC/IEEE 29148:2018

---

## Dự án: Blog Ẩm thực và Nấu ăn (Culinary Blog)

| Thuộc tính | Giá trị |
| :--- | :--- |
| **Phiên bản tài liệu** | 1.1.0 |
| **Ngày phát hành** | 16/09/2026 |
| **Trạng thái** | Đã duyệt (Approved) |
| **Căn cứ chuẩn hóa** | Báo cáo Phân tích Kỹ thuật & Xử lý Mâu thuẫn (CR-001 / SPEC.md) |
| **Công nghệ Backend** | .NET 10 Minimal APIs, C# 13, Clean Architecture, CQRS (MediatR) |
| **Công nghệ Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, TanStack Query |
| **Cơ sở dữ liệu** | PostgreSQL 16 (EF Core 10 Code-First, Full-Text Search) |
| **Object Storage** | MinIO S3-Compatible (Backend Proxy Upload & Magic Bytes Validation) |
| **Distributed Cache** | Redis 7 (Cache-Aside & Redis Backed Output Cache) |
| **Background Processing** | Hangfire (PostgreSQL Storage) |
| **Observability** | Serilog (Structured Logging), OpenTelemetry (Distributed Tracing) |

> *Tài liệu này được biên soạn và chuẩn hóa toàn diện theo tiêu chuẩn IEEE 830-1998 / ISO/IEC/IEEE 29148:2018, đồng thời tích hợp toàn bộ các quyết định kỹ thuật từ tài liệu [SPEC.md](file:///f:/PTUDW/PTUDWebNangCao-2026-Nhom13/SPEC.md).*

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU (DOCUMENT REVISION HISTORY)

| Phiên bản | Ngày | Tác giả / Vai trò | Nội dung thay đổi | Trạng thái |
| :---: | :---: | :--- | :--- | :---: |
| **1.1.0** | 16/09/2026 | Lead Architect & Senior BA | **Chuẩn hóa toàn diện tài liệu theo Change Request CR-001 (SPEC.md):**<br>1. Thống nhất cơ chế **Soft Delete** cho Recipe và Category (`IsDeleted = true`).<br>2. Loại bỏ `IMemoryCache`, chuyển 100% sang **Distributed Redis Cache** & Redis-backed Output Cache.<br>3. Chuyển Refresh Token sang lưu trữ và truyền nhận qua **`HttpOnly`, `Secure`, `SameSite=Strict` Cookie** để triệt tiêu lỗ hổng XSS.<br>4. Loại bỏ Presigned URL MinIO, bắt buộc **Proxy Upload qua Backend** kết hợp kiểm tra Magic Bytes.<br>5. Chuẩn hóa tên trường người dùng thành **`displayName`** và bổ sung **`bio`**.<br>6. Chuẩn hóa mã phản hồi lỗi HTTP (Validation: 400 Bad Request; Concurrency: 409 Conflict; Business Rules: 422 Unprocessable Entity).<br>7. Cho phép Author tìm kiếm bài viết **`Draft`** của chính mình qua Full-Text Search.<br>8. Chốt chuẩn **Next.js 15 LTS (App Router)** cho Frontend.<br>9. Phân định rõ 2 tầng Rate Limiting (Nginx Layer 7 thô & .NET Middleware + Redis tinh).<br>10. Phân kỳ lộ trình mở rộng hệ thống (Phase 1: Single-Server MVP; Phase 2: Scalability Roadmap). | **Approved** |
| **1.0.0** | 04/06/2026 | Senior BA / Architect | Phát hành lần đầu – Bản hoàn chỉnh theo IEEE 830 / ISO 29148. | Approved |
| **0.9.0** | 20/05/2026 | Senior BA | Bổ sung Chương 7 (Data Model), Chương 8 (API Spec) và Phụ lục. | Under Review |
| **0.8.0** | 05/05/2026 | Senior BA | Hoàn thiện Chương 3 (FR), bổ sung FR-FILE, FR-JOB, FR-OBS. | Draft |
| **0.5.0** | 15/04/2026 | Senior BA | Phác thảo ban đầu: Chương 1–4 (skeleton). | Draft |

**Quy trình Phê duyệt:** Bản cập nhật 1.1.0 đã được xem xét và thông qua bởi Trưởng nhóm Kiến trúc Hệ thống (Lead Systems Architect). Mọi thay đổi tiếp theo bắt buộc phải tuân theo quy trình Yêu cầu Thay đổi (Change Request - CR) và được ghi nhận tại bảng này.

---

## MỤC LỤC

- [CHƯƠNG 1. GIỚI THIỆU](#chương-1-giới-thiệu)
  - [1.1. Mục đích Tài liệu](#11-mục-đích-tài-liệu)
  - [1.2. Phạm vi Sản phẩm](#12-phạm-vi-sản-phẩm)
    - [1.2.1. Tên và Định danh](#121-tên-và-định-danh)
    - [1.2.2. Mô tả Sản phẩm](#122-mô-tả-sản-phẩm)
    - [1.2.3. Những gì KHÔNG thuộc phạm vi (Out of Scope)](#123-những-gì-không-thuộc-phạm-vi-out-of-scope)
  - [1.3. Định nghĩa, Từ viết tắt và Ký hiệu](#13-định-nghĩa-từ-viết-tắt-và-ký-hiệu)
  - [1.4. Tài liệu Tham chiếu](#14-tài-liệu-tham-chiếu)
  - [1.5. Tổng quan Cấu trúc Tài liệu](#15-tổng-quan-cấu-trúc-tài-liệu)
- [CHƯƠNG 2. MÔ TẢ TỔNG QUAN HỆ THỐNG](#chương-2-mô-tả-tổng-quan-hệ-thống)
  - [2.1. Bối cảnh Sản phẩm](#21-bối-cảnh-sản-phẩm)
    - [2.1.1. Vị trí trong Hệ sinh thái](#211-vị-trí-trong-hệ-sinh-thái)
    - [2.1.2. Quan hệ với Hệ thống Ngoài](#212-quan-hệ-với-hệ-thống-ngoài)
  - [2.2. Chức năng Sản phẩm Tổng quát](#22-chức-năng-sản-phẩm-tổng-quát)
  - [2.3. Các Lớp Người dùng và Đặc điểm](#23-các-lớp-người-dùng-và-đặc-điểm)
  - [2.4. Môi trường Vận hành](#24-môi-trường-vận-hành)
    - [2.4.1. Môi trường Server (Production)](#241-môi-trường-server-production)
    - [2.4.2. Môi trường Phát triển (Development)](#242-môi-trường-phát-triển-development)
    - [2.4.3. Yêu cầu Trình duyệt Client](#243-yêu-cầu-trình-duyệt-client)
  - [2.5. Ràng buộc Thiết kế và Hiện thực (CONS-001 -> CONS-010)](#25-ràng-buộc-thiết-kế-và-hiện-thực)
  - [2.6. Giả định và Phụ thuộc](#26-giả-định-và-phụ-thuộc)
    - [2.6.1. Giả định và Phân kỳ Lộ trình Triển khai](#261-giả-định-và-phân-kỳ-lộ-trình-triển-khai)
    - [2.6.2. Phụ thuộc Bên ngoài và Kế hoạch Dự phòng](#262-phụ-thuộc-bên-ngoài-và-kế-hoạch-dự-phòng)
- [CHƯƠNG 3. YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)](#chương-3-yêu-cầu-chức-năng-chi-tiết)
  - [3.1. Module Xác thực và Quản lý Người dùng (FR-AUTH)](#31-module-xác-thực-và-quản-lý-người-dùng-fr-auth)
    - [FR-AUTH-001: Đăng ký Tài khoản Mới (User Registration)](#fr-auth-001-đăng-ký-tài-khoản-mới-user-registration)
    - [FR-AUTH-002: Đăng nhập bằng Email và Mật khẩu (Local Login)](#fr-auth-002-đăng-nhập-bằng-email-và-mật-khẩu-local-login)
    - [FR-AUTH-003: Đăng nhập / Đăng ký bằng Google OAuth 2.0](#fr-auth-003-đăng-nhập--đăng-ký-bằng-google-oauth-20)
    - [FR-AUTH-004: Làm mới Access Token (Token Refresh)](#fr-auth-004-làm-mới-access-token-token-refresh)
    - [FR-AUTH-005: Đăng xuất và Thu hồi Token (Logout / Token Revocation)](#fr-auth-005-đăng-xuất-và-thu-hồi-token-logout--token-revocation)
    - [FR-AUTH-006: Xem Hồ sơ Cá nhân (View Profile)](#fr-auth-006-xem-hồ-sơ-cá-nhân-view-profile)
    - [FR-AUTH-007: Cập nhật Hồ sơ Cá nhân (Update Profile)](#fr-auth-007-cập-nhật-hồ-sơ-cá-nhân-update-profile)
  - [3.2. Module Quản lý Danh mục (FR-CAT)](#32-module-quản-lý-danh-mục-fr-cat)
    - [FR-CAT-001: Xem Danh sách Tất cả Danh mục](#fr-cat-001-xem-danh-sách-tất-cả-danh-mục)
    - [FR-CAT-002: Xem Chi tiết Danh mục và Danh sách Công thức](#fr-cat-002-xem-chi-tiết-danh-mục-và-danh-sách-công-thức)
    - [FR-CAT-003: Tạo Danh mục Mới [Admin]](#fr-cat-003-tạo-danh-mục-mới-admin)
    - [FR-CAT-004: Cập nhật Danh mục [Admin]](#fr-cat-004-cập-nhật-danh-mục-admin)
    - [FR-CAT-005: Xóa Danh mục (Soft Delete) [Admin]](#fr-cat-005-xóa-danh-mục-soft-delete-admin)
  - [3.3. Module Quản lý Công thức Nấu ăn (FR-RCP)](#33-module-quản-lý-công-thức-nấu-ăn-fr-rcp)
    - [FR-RCP-001: Xem Danh sách Công thức (Paginated + Filtered + Sorted)](#fr-rcp-001-xem-danh-sách-công-thức-paginated--filtered--sorted)
    - [FR-RCP-002: Xem Chi tiết Công thức Nấu ăn](#fr-rcp-002-xem-chi-tiết-công-thức-nấu-ăn)
    - [FR-RCP-003: Tạo Công thức Nấu ăn Mới [Author/Admin]](#fr-rcp-003-tạo-công-thức-nấu-ăn-mới-authoradmin)
    - [FR-RCP-004: Cập nhật Thông tin Công thức [Author-Owner/Admin]](#fr-rcp-004-cập-nhật-thông-tin-công-thức-author-owneradmin)
    - [FR-RCP-005: Xuất bản / Hủy Xuất bản Công thức](#fr-rcp-005-xuất-bản--hủy-xuất-bản-công-thức)
    - [FR-RCP-006: Lưu trữ Công thức (Archive / Unarchive)](#fr-rcp-006-lưu-trữ-công-thức-archive--unarchive)
    - [FR-RCP-007: Xóa Công thức (Soft Delete) [Author-Owner/Admin]](#fr-rcp-007-xóa-công-thức-soft-delete-author-owneradmin)
    - [FR-RCP-008: Quản lý Ảnh Công thức (Proxy Upload / Set Primary / Delete)](#fr-rcp-008-quản-lý-ảnh-công-thức-proxy-upload--set-primary--delete)
    - [FR-RCP-009: Quản lý Nguyên liệu Công thức (CRUD RecipeIngredient)](#fr-rcp-009-quản-lý-nguyên-liệu-công-thức-crud-recipeingredient)
    - [FR-RCP-010: Quản lý Các bước Thực hiện (CRUD RecipeStep)](#fr-rcp-010-quản-lý-các-bước-thực-hiện-crud-recipestep)
  - [3.4. Module Tìm kiếm và Phân trang (FR-SRCH)](#34-module-tìm-kiếm-và-phân-trang-fr-srch)
    - [FR-SRCH-001: Tìm kiếm Toàn văn bản (Full-Text Search)](#fr-srch-001-tìm-kiếm-toàn-văn-bản-full-text-search)
    - [FR-SRCH-002/003/004: Lọc, Sắp xếp và Phân trang](#fr-srch-002003004-lọc-sắp-xếp-và-phân-trang)
  - [3.5. Module Quản lý Tệp tin (FR-FILE)](#35-module-quản-lý-tệp-tin-fr-file)
    - [FR-FILE-001: Proxy Upload File lên MinIO](#fr-file-001-proxy-upload-file-lên-minio)
    - [FR-FILE-002: Xóa File khỏi MinIO](#fr-file-002-xóa-file-khỏi-minio)
  - [3.6. Module Background Jobs (FR-JOB)](#36-module-background-jobs-fr-job)
    - [FR-JOB-001: Welcome Email Job](#fr-job-001-welcome-email-job)
    - [FR-JOB-002: Image Resize / Thumbnail Job](#fr-job-002-image-resize--thumbnail-job)
    - [FR-JOB-003: Sitemap Generation Job](#fr-job-003-sitemap-generation-job)
  - [3.7. Module Quan sát Hệ thống (FR-OBS)](#37-module-quan-sát-hệ-thống-fr-obs)
    - [FR-OBS-001: Health Check Endpoints](#fr-obs-001-health-check-endpoints)
    - [FR-OBS-002: Structured Logging (Serilog)](#fr-obs-002-structured-logging-serilog)
    - [FR-OBS-003: Distributed Tracing & Metrics (OpenTelemetry)](#fr-obs-003-distributed-tracing--metrics-opentelemetry)
- [CHƯƠNG 4. YÊU CẦU PHI CHỨC NĂNG (NFR)](#chương-4-yêu-cầu-phi-chức-năng-nfr)
  - [4.1. Hiệu năng (NFR-PERF)](#41-hiệu-năng-nfr-perf)
  - [4.2. Bảo mật (NFR-SEC)](#42-bảo-mật-nfr-sec)
  - [4.3. Khả năng Sử dụng (NFR-USE)](#43-khả-năng-sử-dụng-nfr-use)
  - [4.4. Độ tin cậy (NFR-REL)](#44-độ-tin-cậy-nfr-rel)
  - [4.5. Khả năng Bảo trì (NFR-MAINT)](#45-khả-năng-bảo-trì-nfr-maint)
  - [4.6. Khả năng Mở rộng (NFR-SCALE)](#46-khả-năng-mở-rộng-nfr-scale)
  - [4.7. Tối ưu SEO (NFR-SEO)](#47-tối-ưu-seo-nfr-seo)
- [CHƯƠNG 5. YÊU CẦU GIAO DIỆN NGOÀI](#chương-5-yêu-cầu-giao-diện-ngoài)
  - [5.1. Giao diện Người dùng (UI - Next.js 15)](#51-giao-diện-người-dùng-ui---nextjs-15)
  - [5.2. Giao diện Phần mềm – REST API Specification](#52-giao-diện-phần-mềm--rest-api-specification)
  - [5.3. Giao diện Dịch vụ Bên thứ ba](#53-giao-diện-dịch-vụ-bên-thứ-ba)
  - [5.4. Giao diện Phần cứng](#54-giao-diện-phần-cứng)
- [CHƯƠNG 6. KIẾN TRÚC HỆ THỐNG](#chương-6-kiến-trúc-hệ-thống)
  - [6.1. Tổng quan Kiến trúc](#61-tổng-quan-kiến-trúc)
  - [6.2. Kiến trúc Backend – Clean Architecture](#62-kiến-trúc-backend--clean-architecture)
  - [6.3. CQRS + MediatR Pipeline Behavior Execution](#63-cqrs--mediatr-pipeline-behavior-execution)
  - [6.4. Mô hình Quan hệ Thực thể Tóm tắt](#64-mô-hình-quan-hệ-thực-thể-tóm-tắt)
  - [6.5. Đóng gói & Triển khai Docker Compose](#65-đóng-gói--triển-khai-docker-compose)
- [CHƯƠNG 7. MÔ HÌNH DỮ LIỆU (DATA MODEL)](#chương-7-mô-hình-dữ-liệu-data-model)
  - [7.1. BaseEntity (Abstract)](#71-baseentity-abstract)
  - [7.2. Recipe Entity](#72-recipe-entity)
    - [7.2.1. RecipeNutrition (Owned Entity)](#721-recipenutrition-owned-entity)
  - [7.3. RecipeStep Entity](#73-recipestep-entity)
  - [7.4. RecipeIngredient Entity](#74-recipeingredient-entity)
  - [7.5. RecipeImage Entity](#75-recipeimage-entity)
  - [7.6. Category Entity](#76-category-entity)
  - [7.7. ApplicationUser Entity (Extends IdentityUser)](#77-applicationuser-entity-extends-identityuser)
  - [7.8. RefreshToken Entity](#78-refreshtoken-entity)
- [CHƯƠNG 8. ĐẶC TẢ REST API](#chương-8-đặc-tả-rest-api)
  - [8.1. Module Xác thực (/api/v1/auth)](#81-module-xác-thực-apiv1auth)
  - [8.2. Module Danh mục (/api/v1/categories)](#82-module-danh-mục-apiv1categories)
  - [8.3. Module Công thức Nấu ăn (/api/v1/recipes)](#83-module-công-thức-nấu-ăn-apiv1recipes)
  - [8.4. Module Ảnh Công thức (/api/v1/recipes/{id}/images)](#84-module-ảnh-công-thức-apiv1recipesidimages)
  - [8.5. Module Các bước Thực hiện (/api/v1/recipes/{id}/steps)](#85-module-các-bước-thực-hiện-apiv1recipesidsteps)
  - [8.6. Module Nguyên liệu (/api/v1/recipes/{id}/ingredients)](#86-module-nguyên-liệu-apiv1recipesidingredients)
  - [8.7. Health Check Endpoints](#87-health-check-endpoints)
- [PHỤ LỤC](#phụ-lục)
  - [Phụ lục A – Bảng mã HTTP Status Codes](#phụ-lục-a--bảng-mã-http-status-codes)
  - [Phụ lục B – Bảng mã Application Error Codes (RFC 7807)](#phụ-lục-b--bảng-mã-application-error-codes-rfc-7807)
  - [Phụ lục C – Từ điển Thuật ngữ Kỹ thuật (Glossary)](#phụ-lục-c--từ-điển-thuật-ngữ-kỹ-thuật-glossary)

---

# CHƯƠNG 1. GIỚI THIỆU

### 1.1. Mục đích Tài liệu
Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification – SRS) này được biên soạn theo tiêu chuẩn **IEEE 830-1998** và **ISO/IEC/IEEE 29148:2018** nhằm mô tả đầy đủ, chính xác, không mâu thuẫn và nhất quán toàn bộ các yêu cầu chức năng (Functional Requirements - FR) và yêu cầu phi chức năng (Non-Functional Requirements - NFR) của dự án **Culinary Blog – Blog Ẩm thực và Nấu ăn**.

Tài liệu này là cam kết kỹ thuật chính thức và phục vụ các bên liên quan:
- **Nhóm phát triển Backend (.NET 10/C#):** Căn cứ thiết kế API, Domain Model, Data Access, Application Handlers và Business Rules.
- **Nhóm phát triển Frontend (Next.js 15/TypeScript):** Căn cứ thiết kế giao diện (UI), luồng trải nghiệm người dùng (UX), quản lý Server/Client State và tích hợp REST API.
- **Kỹ sư Kiểm thử (QA/QC):** Căn cứ xây dựng bộ Test Case tự động hóa (Unit, Integration, E2E) và nghiệm thu chất lượng phần mềm.
- **Kiến trúc sư Hệ thống (Software Architect):** Căn cứ giám sát sự tuân thủ các nguyên tắc thiết kế kiến trúc Clean Architecture, CQRS, bảo mật và hiệu năng.
- **Giảng viên và Sinh viên:** Tài liệu học thuật chuẩn mực, áp dụng xuyên suốt môn học Phát triển Ứng dụng Web Nâng cao.
- **Stakeholder / Product Owner:** Căn cứ nghiệm thu phạm vi nghiệp vụ và lộ trình bàn giao sản phẩm.

**Phạm vi hiệu lực:** Tài liệu có hiệu lực từ phiên bản **1.1.0** (thay thế hoàn toàn bản 1.0.0). Mọi điều chỉnh yêu cầu kỹ thuật phát sinh đều phải thông qua quy trình Quản lý Thay đổi (Change Management Process).

---

### 1.2. Phạm vi Sản phẩm

#### 1.2.1. Tên và Định danh
| Thuộc tính | Giá trị |
| :--- | :--- |
| **Tên sản phẩm thương mại** | Culinary Blog – Blog Ẩm thực và Nấu ăn |
| **Mã định danh dự án** | `CULINARY-BLOG-V1` |
| **Kiểu kiến trúc hệ thống** | Web Full-Stack tách biệt (API-Driven Architecture) |
| **Phiên bản hệ thống** | 1.1.0 |
| **Môi trường triển khai** | Container hóa qua Docker Compose & Reverse Proxy Nginx |

#### 1.2.2. Mô tả Sản phẩm
Culinary Blog là nền tảng web hiện đại cho phép cộng đồng đam mê ẩm thực khám phá, học hỏi và chia sẻ các công thức nấu ăn chất lượng cao. Hệ thống cung cấp các khối tính năng toàn diện:
1. **Nền tảng Quản trị & Chia sẻ Nội dung Ẩm thực:** Tác giả (Author) có thể soạn thảo, cập nhật và quản lý công thức nấu ăn phong phú gồm nhiều bước chi tiết, thời gian thực hiện, định lượng nguyên liệu chuẩn xác, thông tin giá trị dinh dưỡng và bộ sưu tập ảnh minh họa sắc nét.
2. **Tổ chức Nội dung Đa chiều:** Hệ thống phân loại công thức theo danh mục ẩm thực (Category), cấp độ khó (Difficulty: Easy, Medium, Hard, Expert), thời gian chuẩn bị và thời gian nấu.
3. **Công cụ Tìm kiếm Nâng cao:** Tích hợp Full-Text Search (FTS) ngôn ngữ tiếng Việt dựa trên engine PostgreSQL (`tsvector`/`tsquery`) kết hợp tiện ích mở rộng `unaccent` giúp người dùng tìm kiếm không dấu ("pho" -> "phở") nhanh chóng và chính xác.
4. **Bảo mật Đa lớp:** Xác thực phi trạng thái bằng JWT Access Token (15 phút) kết hợp Refresh Token (7 ngày) được bảo vệ tuyệt đối trong `HttpOnly Secure Cookie`; phân quyền dựa trên vai trò (RBAC) và dựa trên quyền sở hữu tài nguyên (Resource-Based Authorization); hỗ trợ đăng nhập nhanh bằng Google OAuth 2.0.
5. **Tối ưu Tốc độ & Chuẩn SEO Quốc tế:** Cấu trúc dữ liệu có cấu trúc JSON-LD theo chuẩn Schema.org Recipe, cơ chế Server-Side Rendering (SSR) và Incremental Static Regeneration (ISR) của Next.js 15, phân tán bộ nhớ đệm với Redis Cache và Output Cache.
6. **Quan sát Hệ thống Toàn diện (Observability):** Ghi vết có cấu trúc (Structured Logging với Serilog), phân tích vết phân tán (Distributed Tracing qua OpenTelemetry) và các cổng kiểm tra sức khỏe hệ thống (Health Check Endpoints).

#### 1.2.3. Những gì KHÔNG thuộc phạm vi (Out of Scope)
Các tính năng sau đây **nằm ngoài phạm vi triển khai** của phiên bản 1.1.0:
- Hệ thống bình luận (Comments) và đánh giá sao (Ratings/Reviews).
- Tính năng đánh dấu/lưu công thức yêu thích (Bookmarks/Favorites).
- Truyền tải thông báo thời gian thực qua WebSocket/SignalR.
- Ứng dụng di động native (iOS / Android).
- Tích hợp cổng thanh toán trực tuyến hoặc tính năng thương mại điện tử.
- Nhắn tin trò chuyện trực tiếp (Live Chat / Direct Message) giữa các thành viên.
- Giao diện truy vấn GraphQL (sẽ xem xét tại các giai đoạn sau).

---

### 1.3. Định nghĩa, Từ viết tắt và Ký hiệu

| Thuật ngữ / Viết tắt | Định nghĩa đầy đủ |
| :--- | :--- |
| **SRS** | Software Requirements Specification – Tài liệu Đặc tả Yêu cầu Phần mềm. |
| **FR** | Functional Requirement – Yêu cầu chức năng của hệ thống. |
| **NFR** | Non-Functional Requirement – Yêu cầu phi chức năng (chất lượng hệ thống). |
| **API** | Application Programming Interface – Giao diện lập trình ứng dụng. |
| **REST** | Representational State Transfer – Kiểu kiến trúc dịch vụ web dựa trên HTTP. |
| **JWT** | JSON Web Token (RFC 7519) – Chuẩn mã hóa token phục vụ xác thực phi trạng thái. |
| **RBAC** | Role-Based Access Control – Kiểm soát truy cập dựa trên vai trò người dùng. |
| **CQRS** | Command Query Responsibility Segregation – Mẫu kiến trúc tách biệt luồng ghi và luồng đọc dữ liệu. |
| **DDD** | Domain-Driven Design – Phương pháp thiết kế phần mềm định hướng nghiệp vụ lõi. |
| **ORM** | Object-Relational Mapping – Kỹ thuật ánh xạ thực thể lập trình vào cơ sở dữ liệu quan hệ (Entity Framework Core). |
| **FTS** | Full-Text Search – Tìm kiếm toàn văn bản trong cơ sở dữ liệu. |
| **ISR** | Incremental Static Regeneration – Cơ chế tái tạo trang tĩnh định kỳ của Next.js. |
| **LCP / CLS / INP** | Largest Contentful Paint / Cumulative Layout Shift / Interaction to Next Paint – Bộ chỉ số chất lượng website Google Core Web Vitals. |
| **CI/CD** | Continuous Integration / Continuous Deployment – Tự động hóa tích hợp và triển khai mã nguồn. |
| **TTL** | Time-To-Live – Thời gian tồn tại hiệu lực của một bản ghi dữ liệu trong cache. |
| **SSR / SSG / CSR** | Server-Side Rendering / Static Site Generation / Client-Side Rendering. |
| **MoSCoW** | Must Have / Should Have / Could Have / Won't Have – Khung phân loại mức độ ưu tiên nghiệp vụ. |
| **RFC 7807** | Problem Details for HTTP APIs – Chuẩn định dạng cấu trúc báo lỗi thống nhất qua HTTP. |
| **ERD** | Entity Relationship Diagram – Sơ đồ quan hệ thực thể cơ sở dữ liệu. |
| **PBKDF2** | Password-Based Key Derivation Function 2 – Thuật toán băm mật khẩu an toàn theo khuyến nghị NIST. |
| **MIME Type** | Multipurpose Internet Mail Extensions – Định dạng tệp tin chuẩn truyền thông Internet. |
| **JSON-LD** | JavaScript Object Notation for Linked Data – Định dạng dữ liệu có cấu trúc phục vụ máy tìm kiếm (SEO). |
| **AEC** | Application Error Code – Mã lỗi tùy chỉnh dạng chữ hoa viết tắt đại diện cho từng tình huống nghiệp vụ cụ thể. |
| **UoW** | Unit of Work – Mẫu thiết kế duy trì một transaction xuyên suốt nhiều thao tác ghi dữ liệu. |
| **OTEL** | OpenTelemetry – Khung chuẩn mở theo dõi metric và phân tích trace phân tán. |

---

### 1.4. Tài liệu Tham chiếu

| STT | Tài liệu / Tiêu chuẩn | Nguồn tham khảo |
| :---: | :--- | :--- |
| 1 | IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications | [IEEE Xplore](https://standards.ieee.org/) |
| 2 | ISO/IEC/IEEE 29148:2018 – Systems and Software Engineering — Life Cycle Processes — Requirements Engineering | [ISO Standard](https://www.iso.org/standard/72089.html) |
| 3 | OWASP Top 10:2021 – Top 10 Web Application Security Risks | [OWASP Project](https://owasp.org/www-project-top-ten/) |
| 4 | RFC 7807 – Problem Details for HTTP APIs | [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc7807) |
| 5 | RFC 7519 – JSON Web Token (JWT) | [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc7519) |
| 6 | RFC 6749 – The OAuth 2.0 Authorization Framework | [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc6749) |
| 7 | .NET 10 Minimal APIs Documentation | [Microsoft Learn](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis) |
| 8 | ASP.NET Core Identity & Security Core | [Microsoft Learn](https://learn.microsoft.com/aspnet/core/security/) |
| 9 | Entity Framework Core 10 Documentation | [Microsoft Learn](https://learn.microsoft.com/ef/core/) |
| 10 | Next.js 15 (App Router) Official Documentation | [Next.js Docs](https://nextjs.org/docs) |
| 11 | PostgreSQL 16 Documentation (Full-Text Search & Indexes) | [PostgreSQL Official](https://www.postgresql.org/docs/16/textsearch.html) |
| 12 | Redis 7 Documentation (Commands & Persistence) | [Redis Official](https://redis.io/docs/) |
| 13 | MinIO S3-Compatible Object Storage Documentation | [MinIO Docs](https://min.io/docs/) |
| 14 | Google Core Web Vitals Guidelines | [web.dev](https://web.dev/explore/learn-core-web-vitals) |
| 15 | Schema.org Recipe Structured Data Specification | [Schema.org Recipe](https://schema.org/Recipe) |
| 16 | OpenTelemetry .NET SDK & OTLP Protocol | [OpenTelemetry](https://opentelemetry.io/docs/languages/dotnet/) |
| 17 | Serilog Structured Logging Framework | [Serilog Docs](https://serilog.net/) |
| 18 | Hangfire Background Processing for .NET | [Hangfire Docs](https://docs.hangfire.io/) |
| 19 | FluentValidation in .NET Documentation | [FluentValidation](https://docs.fluentvalidation.net/) |
| 20 | Báo cáo Phân tích Mâu thuẫn SPEC.md (Dự án Culinary Blog) | Nội bộ dự án |

---

### 1.5. Tổng quan Cấu trúc Tài liệu
Tài liệu SRS được cấu trúc logic từ tổng quan đến chi tiết kỹ thuật:
- **Chương 2 – Mô tả Tổng quan Hệ thống:** Định vị bối cảnh sản phẩm trong hệ sinh thái, phân loại nhóm người dùng, môi trường vận hành, 10 ràng buộc thiết kế bắt buộc (CONS-001 -> CONS-010), giả định và kế hoạch dự phòng.
- **Chương 3 – Yêu cầu Chức năng Chi tiết:** Đặc tả chi tiết 27 yêu cầu chức năng (FR) thuộc 7 module nghiệp vụ với bảng chuẩn hóa 12 trường thông tin.
- **Chương 4 – Yêu cầu Phi Chức năng (NFR):** Xác định ngưỡng định lượng về hiệu năng, bảo mật, khả năng tiếp cận, độ tin cậy, bảo trì, mở rộng và SEO.
- **Chương 5 – Yêu cầu Giao diện Ngoài:** Định nghĩa giao diện người dùng Next.js 15, chuẩn truyền thông REST API, giao diện tích hợp dịch vụ ngoài và cấu hình phần cứng.
- **Chương 6 – Kiến trúc Hệ thống:** Mô hình Clean Architecture 4 tầng, luồng xử lý CQRS/MediatR Pipeline Behaviors, sơ đồ thực thể tóm tắt và mô hình Docker Compose.
- **Chương 7 – Mô hình Dữ liệu Chi tiết:** Đặc tả bảng biểu, thuộc tính, kiểu dữ liệu PostgreSQL, ràng buộc khóa ngoại, indexes và quy tắc Soft Delete.
- **Chương 8 – Đặc tả REST API:** Bảng tổng hợp toàn bộ các endpoints, HTTP verbs, payload request/response và các quy ước tham số phân trang, bộ lọc.
- **Phụ lục A, B, C:** Bảng mã trạng thái HTTP chuẩn, từ điển Application Error Codes và thuật ngữ kỹ thuật.

---

# CHƯƠNG 2. MÔ TẢ TỔNG QUAN HỆ THỐNG

### 2.1. Bối cảnh Sản phẩm

#### 2.1.1. Vị trí trong Hệ sinh thái
Culinary Blog vận hành theo mô hình **API-Driven Architecture**. Tầng Backend (.NET 10 Minimal APIs) và Tầng Frontend (Next.js 15 App Router) là hai hệ thống độc lập hoàn toàn, không chia sẻ view engine hay session máy chủ. Giao tiếp duy nhất giữa hai tầng là các cuộc gọi HTTP/HTTPS RESTful API truyền tải dữ liệu theo định dạng JSON chuẩn hóa.

```
┌────────────────────────────────────────────────────────────────────────┐
│ CULINARY BLOG DISTRIBUTED SYSTEM                                       │
│                                                                        │
│  ┌───────────────────────┐             ┌─────────────────────────────┐ │
│  │   NEXT.JS 15 CLIENT   │◄───────────►│    .NET 10 BACKEND API      │ │
│  │     (App Router)      │  REST/JSON  │  (Clean Arch + CQRS)        │ │
│  │      Port: 3000       │   HTTPS     │        Port: 5000           │ │
│  └───────────────────────┘             └──────────────┬──────────────┘ │
│                                                       │                │
│    ┌───────────┬───────────┬──────────────┬───────────┴──┬───────────┐ │
│    │PostgreSQL │  Redis 7  │  MinIO S3    │   Hangfire   │  Google   │ │
│    │   16.x    │Cache/Lock │Storage: 9000 │Worker Engine │  OAuth2   │ │
│    │ Port: 5432│ Port: 6379│(Proxy Upload)│ (PostgreSQL) │  (Auth)   │ │
│    └───────────┴───────────┴──────────────┴──────────────┴───────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.2. Quan hệ với Hệ thống Ngoài
| Hệ thống Ngoài | Vai trò Kỹ thuật | Giao thức / Thư viện | Hướng Tích hợp |
| :--- | :--- | :--- | :--- |
| **PostgreSQL 16** | Hệ quản trị CSDL quan hệ chính (RDBMS) | TCP + Npgsql Driver (EF Core 10) | Backend -> PostgreSQL |
| **Redis 7** | Distributed Cache, Redis Output Cache & Rate Limiting Counters | TCP + StackExchange.Redis | Backend -> Redis |
| **MinIO (S3-Compatible)** | Lưu trữ đối tượng tập trung cho ảnh công thức (Proxy Upload) | HTTP/S3 API + MinIO / AWS SDK | Backend -> MinIO |
| **Google OAuth 2.0** | Dịch vụ xác thực danh tính bên thứ ba (IdP) | HTTPS + OpenID Connect / PKCE | Next.js <-> Google <-> Backend |
| **Hangfire Worker** | Xử lý tác vụ chạy ngầm bất đồng bộ (In-process host) | Bộ nhớ tiến trình .NET + bảng PostgreSQL | Backend (Nội bộ) |
| **Serilog / Seq** | Thu thập, tổng hợp nhật ký ghi vết có cấu trúc (Log Aggregation) | HTTP OTLP / Sink -> Seq Server | Backend -> Seq |
| **OpenTelemetry Collector** | Giám sát hiệu năng và phân tích Trace phân tán | OTLP / gRPC | Backend -> Collector |
| **Nginx (Reverse Proxy)** | SSL Termination, bảo vệ DDoS thô, định tuyến Gateway | HTTP / HTTPS (TLS 1.2+) | Client -> Nginx -> Next.js / API |

---

### 2.2. Chức năng Sản phẩm Tổng quát
Hệ thống cung cấp **7 phân hệ chức năng**, tương ứng với **27 yêu cầu chức năng (FR)** chi tiết tại Chương 3:

| Nhóm chức năng | Mã nhóm | Số FR | Mô tả tóm tắt |
| :--- | :---: | :---: | :--- |
| **Xác thực & Quản lý Người dùng** | `FR-AUTH` | 7 | Đăng ký, đăng nhập Local & Google OAuth, JWT Access Token & HttpOnly Cookie Refresh Token, thu hồi token, quản lý thông tin tài khoản (`displayName`, `bio`). |
| **Quản lý Danh mục** | `FR-CAT` | 5 | CRUD danh mục công thức, Soft Delete danh mục với ràng buộc kiểm tra công thức active, sinh slug SEO, đồng bộ Redis Cache. |
| **Quản lý Công thức Nấu ăn** | `FR-RCP` | 10 | CRUD công thức nấu ăn, Soft Delete (`IsDeleted = true`), xuất bản/hủy xuất bản, lưu trữ (Archive), kiểm soát xung đột dữ liệu `RowVersion`, quản lý nguyên liệu và các bước. |
| **Tìm kiếm & Phân trang** | `FR-SRCH` | 4 | Tìm kiếm toàn văn bản tiếng Việt không dấu (`tsvector`/`unaccent`), tìm kiếm bài Draft cho Author, bộ lọc đa tiêu chí, phân trang linh hoạt. |
| **Quản lý Tệp tin** | `FR-FILE` | 2 | Tải tệp tin ảnh an toàn thông qua Backend Proxy (kiểm tra MIME & Magic Bytes), dọn dẹp tệp tin bất đồng bộ. |
| **Tác vụ Nền (Background Jobs)** | `FR-JOB` | 3 | Gửi email chào mừng kích hoạt, tự động cắt ảnh Thumbnail/Medium, định kỳ sinh `sitemap.xml` báo cáo công cụ tìm kiếm. |
| **Giám sát & Đo lường** | `FR-OBS` | 3 | Giám sát trạng thái hoạt động (Liveness/Readiness), ghi vết Serilog chuẩn hóa CorrelationId, giám sát số liệu qua OpenTelemetry. |

---

### 2.3. Các Lớp Người dùng và Đặc điểm
Hệ thống định nghĩa 3 lớp tác nhân (Actor) chính:

| Vai trò (Actor) | Mô tả & Điều kiện xác thực | Quyền hạn chính trong hệ thống | Ưu tiên phục vụ |
| :--- | :--- | :--- | :---: |
| **Khách vãng lai (Guest / Anonymous)** | Người dùng chưa đăng nhập hệ thống, truy cập ẩn danh qua trình duyệt web. Không cần tài khoản. | - Xem danh sách và chi tiết các công thức đã xuất bản (`Published`).<br>- Xem danh mục món ăn.<br>- Tìm kiếm công thức qua bộ lọc và FTS.<br>- **Tuyệt đối không** được tạo, sửa, xóa, hay xem bài viết nháp (`Draft`). | **Cao** (Chiếm trên 85% lưu lượng truy cập) |
| **Tác giả (Author)** | Người dùng đã đăng ký tài khoản thành công và đăng nhập qua JWT/Cookie. Role mặc định là `Author`. | - Thừa hưởng toàn bộ quyền của Khách.<br>- Tạo mới công thức nấu ăn (trạng thái khởi tạo `Draft`).<br>- Quản lý (Sửa, Soft Delete, Đổi ảnh, Quản lý bước/nguyên liệu) **chỉ trên các công thức do chính mình tạo ra** (`AuthorId == currentUserId`).<br>- Chuyển đổi trạng thái Publish/Archive bài viết của mình.<br>- Tìm kiếm các bài viết `Draft` của chính mình.<br>- Cập nhật hồ sơ cá nhân (`displayName`, `avatarUrl`, `bio`). | **Cao** (Lực lượng đóng góp nội dung chính) |
| **Quản trị viên (Admin)** | Người dùng quản trị cấp cao nhất, được định danh qua Database Seeding hoặc phân quyền bởi SuperAdmin. Role `Admin`. | - Thừa hưởng toàn bộ quyền của Tác giả.<br>- Quyền Bypass: Có thể chỉnh sửa hoặc Soft Delete **bất kỳ công thức nào** trong hệ thống.<br>- Quản lý toàn diện Danh mục (Thêm, Sửa, Soft Delete Category).<br>- Truy cập Dashboard quản lý tác vụ ngầm Hangfire (`/hangfire`).<br>- Xem xét và cấu hình trạng thái tài khoản người dùng (`IsActive`). | **Trung bình** (Số lượng người dùng hạn chế) |

**Cơ chế Phân quyền 3 tầng:**
1. **Tầng 1 (Role-Based Authorization):** Phân chia rõ quyền hạn dựa trên Role (Guest, Author, Admin) áp dụng tại các Endpoint Route.
2. **Tầng 2 (Resource-Based Authorization):** Tác giả chỉ được phép thao tác trên tài nguyên công thức nếu `recipe.AuthorId == currentUserId`. Admin tự động bypass kiểm tra này.
3. **Tầng 3 (Policy-Based Authorization):** Chính sách kiểm tra trạng thái kích hoạt tài khoản (`IsActive == true`) trước khi cấp quyền xử lý luồng ghi.

---

### 2.4. Môi trường Vận hành

#### 2.4.1. Môi trường Server (Production)
| Thành phần | Yêu cầu Tối thiểu | Cấu hình Khuyến nghị | Ghi chú Triển khai |
| :--- | :--- | :--- | :--- |
| **Hệ điều hành** | Linux Ubuntu 22.04 LTS / Debian 12 | Ubuntu 22.04 LTS | Triển khai 100% trong Docker Containers. |
| **.NET Runtime** | .NET 10.0 Runtime (`aspnet:10.0`) | .NET 10.0 Latest Patch | Container base `mcr.microsoft.com/dotnet/aspnet:10.0`. |
| **Node.js** | Node.js 20 LTS (Chỉ dùng lúc Build) | Node.js 22 LTS | Production chạy Docker Standalone Output của Next.js 15. |
| **PostgreSQL** | PostgreSQL 16.x | PostgreSQL 16.3+ | Bắt buộc bật extensions `unaccent` và `pg_trgm`. |
| **Redis** | Redis 7.x | Redis 7.2+ Alpine | Chế độ Persistence với cơ chế Append-Only File (AOF). |
| **MinIO** | MinIO RELEASE.2024+ | Bản Stable mới nhất | Cấu hình Bucket Policy `public-read` phục vụ xem ảnh công thức. |
| **Reverse Proxy** | Nginx 1.24+ | Nginx 1.26+ Stable | Đóng vai trò SSL Termination, HTTP/2 và DDoS Rate Limiting. |
| **Tài nguyên Máy chủ** | 2 vCPU, 4 GB RAM, 50 GB SSD | 4 vCPU, 8 GB RAM, 100 GB NVMe SSD | Đảm bảo hiệu năng cho Full-Text Search và In-memory Cache. |

#### 2.4.2. Môi trường Phát triển (Development)
- **.NET SDK:** .NET 10.0.x SDK (bao gồm CLI và Runtime).
- **Node.js:** Node.js v20.x hoặc v22.x LTS kết hợp npm v10+.
- **Docker Desktop:** Docker Desktop 4.x+ (hỗ trợ WSL2 trên Windows hoặc macOS/Linux) để khởi tạo PostgreSQL, Redis, MinIO, Seq, MailHog thông qua file `docker-compose.yml`.
- **IDE Khuyến nghị:** Visual Studio 2022 v17.12+, JetBrains Rider 2024+, hoặc VS Code với C# Dev Kit extension.
- **Công cụ kiểm thử API:** Scalar UI (tích hợp sẵn tại `http://localhost:5000/scalar`) hoặc Postman.

#### 2.4.3. Yêu cầu Trình duyệt Client
| Trình duyệt | Phiên bản Tối thiểu | Mức độ Hỗ trợ | Ghi chú |
| :--- | :--- | :---: | :--- |
| **Google Chrome** | 100+ | Hoàn hảo | Trình duyệt khuyến nghị chuẩn cho người dùng & kiểm thử. |
| **Mozilla Firefox** | 100+ | Hoàn hảo | Hỗ trợ toàn bộ chuẩn ES2022 và CSS Grid. |
| **Microsoft Edge** | 100+ | Hoàn hảo | Nền tảng nhân Chromium tương đồng Chrome. |
| **Apple Safari** | 16+ (macOS / iOS) | Hoàn hảo | Kiểm thử giao diện trên thiết bị di động Apple. |
| **Mobile Browsers** | Chrome Mobile, Safari Mobile | Hoàn hảo | Hỗ trợ thiết kế đáp ứng (Responsive), cử chỉ cảm ứng. |
| **Internet Explorer** | Mọi phiên bản | **Từ chối (EOL)** | Hệ thống hoàn toàn không hỗ trợ các trình duyệt lỗi thời. |

---

### 2.5. Ràng buộc Thiết kế và Hiện thực
Toàn bộ dự án phải tuân thủ nghiêm ngặt **10 nguyên tắc kỹ thuật cốt lõi (CONS-001 -> CONS-010)**. Mọi vi phạm đều bị từ chối sáp nhập mã nguồn:

| Mã Ràng buộc | Phân loại | Nội dung Ràng buộc Kỹ thuật |
| :--- | :--- | :--- |
| **CONS-001** | **Kiến trúc 4 Tầng** | Backend **PHẢI** tuân thủ Clean Architecture chuẩn mực với 4 tầng phân lập rõ ràng: `Domain`, `Application`, `Infrastructure`, `Presentation`. **Tầng Domain KHÔNG được tham chiếu bất kỳ thư viện ngoài nào** (chỉ sử dụng .NET BCL). Nguyên tắc phụ thuộc (Dependency Rule) chỉ được hướng tâm vào trong. |
| **CONS-002** | **Mẫu thiết kế CQRS** | Tầng Application **PHẢI** sử dụng mẫu CQRS thông qua thư viện **MediatR**. Mỗi use-case nghiệp vụ phải là một `Command` hoặc `Query` đi kèm một `IRequestHandler` độc lập. Tuyệt đối không gộp nhiều use-case vào chung một class handler. |
| **CONS-003** | **Công nghệ & Framework** | Backend sử dụng **.NET 10 Minimal APIs** (tuyệt đối không dùng MVC Controllers truyền thống). Frontend sử dụng **Next.js 15 (App Router)** với TypeScript (tuyệt đối không dùng Pages Router cũ). |
| **CONS-004** | **Bảo mật Xác thực Token** | Xác thực sử dụng **JWT Access Token phi trạng thái** (thời hạn 15 phút, lưu trữ in-memory tại Client). **Refresh Token** (thời hạn 7 ngày) **BẮT BUỘC lưu trữ và truyền tải qua `HttpOnly`, `Secure`, `SameSite=Strict` Cookie** để triệt tiêu lỗ hổng XSS. Mật khẩu phải được băm an toàn bằng PBKDF2 thông qua ASP.NET Core Identity. |
| **CONS-005** | **Thiết kế REST API & Chuẩn Lỗi** | Thiết kế API chuẩn hóa RESTful, tiền tố đường dẫn phân phiên bản `/api/v1/`. Mọi phản hồi lỗi **BẮT BUỘC tuân thủ chuẩn RFC 7807 (Problem Details)** với kiểu `application/problem+json`, bao gồm mã lỗi tùy biến (`AEC`). |
| **CONS-006** | **Cơ sở Dữ liệu & Tính toàn vẹn** | PostgreSQL 16 là hệ quản trị CSDL quan hệ duy nhất. Ánh xạ CSDL thông qua **EF Core 10 Code-First Migrations**. Không viết mã SQL thô ghép chuỗi. Mọi bảng dữ liệu kế thừa `BaseEntity` đều phải hỗ trợ cờ **Soft Delete** (`IsDeleted`) và token đồng quy lạc quan **`RowVersion`** (`bytea`, `[Timestamp]`). |
| **CONS-007** | **Bảo mật Tải tệp (Proxy Upload)** | Tải tệp tin ảnh có dung lượng tối đa **5 MB**. Chỉ chấp nhận định dạng ảnh an toàn: `image/jpeg`, `image/png`, `image/webp`, `image/avif`. **BẮT BUỘC kiểm tra Magic Bytes (4 bytes đầu của file)** tại tầng Backend Proxy trước khi chuyển tiếp vào MinIO; tuyệt đối không dùng Presigned URL trực tiếp từ Browser. |
| **CONS-008** | **Kiểm tra Dữ liệu Đầu vào** | Toàn bộ dữ liệu gửi lên phải được kiểm tra tính hợp lệ bằng **FluentValidation** thực thi tại tầng `ValidationBehavior` trong MediatR Pipeline. Cấm đặt logic kiểm tra dữ liệu thủ công tại Minimal API Endpoint Handler. |
| **CONS-009** | **Đóng gói Container** | Hệ thống phải được container hóa hoàn toàn bằng Docker. Dockerfile áp dụng quy trình Multi-stage Build tối ưu dung lượng ảnh chạy. Docker Compose điều phối toàn bộ môi trường phát triển cục bộ và môi trường thử nghiệm. |
| **CONS-010** | **Ghi vết Nhật ký Có cấu trúc** | Sử dụng **Serilog** để ghi vết có cấu trúc (Structured Logging). Mỗi bản ghi nhật ký **BẮT BUỘC** đính kèm `CorrelationId` (sinh tự động hoặc lấy từ header `X-Correlation-ID`), `RequestPath` và `UserId` (nếu đã xác thực). |

---

### 2.6. Giả định và Phụ thuộc

#### 2.6.1. Giả định và Phân kỳ Lộ trình Triển khai
1. **Môi trường Phát triển:** Máy phát triển của lập trình viên có kết nối Internet liên tục để tải Docker images, thư viện NuGet và gói npm.
2. **Bộ dữ liệu Mẫu (Data Seeding):** Hệ thống có kịch bản khởi tạo tự động (thư viện Bogus) bao gồm tối thiểu 50 công thức nấu ăn chuẩn, 5 danh mục phong phú và các tài khoản tác giả thử nghiệm.
3. **Phân kỳ Lộ trình Hệ thống:**
   - **Giai đoạn 1 (Baseline - Phạm vi Môn học & MVP):** Triển khai mô hình máy chủ đơn (Single-Server Deployment) trên nền Docker Compose: 1 container .NET API, 1 container Next.js 15, 1 PostgreSQL, 1 Redis và 1 MinIO. Quy mô dữ liệu mục tiêu: $\le 10.000$ công thức, $\le 5.000$ người dùng, $\le 50$ danh mục ẩm thực.
   - **Giai đoạn 2 (Lộ trình Mở rộng Tương lai - Roadmap Scalability):** Sẵn sàng mở rộng sang mô hình phân tán không cần viết lại mã: Cụm MinIO Cluster đa node (Distributed Mode 4+ nodes), phân vùng bảng PostgreSQL (Table Partitioning) theo thời gian khi vượt 1 triệu bản ghi, và cụm Redis Sentinel/Cluster phục vụ phân tải.

#### 2.6.2. Phụ thuộc Bên ngoài và Kế hoạch Dự phòng
| Phụ thuộc Bên ngoài | Mức độ Ảnh hưởng | Mô tả Tác động Khi Gián đoạn | Kế hoạch Dự phòng Kỹ thuật |
| :--- | :---: | :--- | :--- |
| **PostgreSQL 16** | **Rất cao** | Toàn bộ hoạt động ghi nhận và truy vấn dữ liệu bị ngưng trệ. | Sao lưu định kỳ tự động (`pg_dump`) mỗi ngày. Khi DB ngưng kết nối, Readiness Probe lập tức trả mã lỗi 503 để Nginx chuyển hướng sang trang bảo trì thân thiện. |
| **Redis 7** | **Trung bình** | Mất bộ nhớ đệm phân tán và bộ đếm Rate Limiting, tải trọng dồn trực tiếp xuống DB. | Triển khai cơ chế phân rã êm dịu (Graceful Degradation): Nếu Redis gián đoạn kết nối, hệ thống tự động fallback truy vấn dữ liệu trực tiếp từ PostgreSQL, không gây gián đoạn luồng người dùng. |
| **MinIO Storage** | **Cao** | Không thể tải lên ảnh mới; ảnh hiện hữu không thể hiển thị. | Tại môi trường dev, hỗ trợ fallback sang Local Disk Storage. Đối với môi trường Production, duy trì sao lưu dữ liệu Volume Persistent hàng tuần. |
| **Google OAuth 2.0** | **Trung bình** | Người dùng không thể đăng nhập hoặc tạo tài khoản mới thông qua tài khoản Google. | Duy trì phương thức đăng nhập bằng Email và Mật khẩu truyền thống. Hiển thị thông báo trên giao diện: *"Đăng nhập Google tạm thời gián đoạn, vui lòng đăng nhập bằng mật khẩu"*. |
| **Hangfire Processing** | **Thấp** | Các tác vụ ngầm (gửi mail chào mừng, cắt ảnh, tạo sitemap) bị hoãn lại. | Hàng đợi công việc được lưu bền vững trong các bảng PostgreSQL của Hangfire. Khi tiến trình khởi động lại, các tác vụ dang dở sẽ được tự động thực thi lại theo cơ chế Retry. |

---

# CHƯƠNG 3. YÊU CẦU CHỨC NĂNG CHI TIẾT

> **Quy ước mức độ ưu tiên theo chuẩn MoSCoW:**
> - **M (Must Have):** Yêu cầu bắt buộc phải hoàn thành; thiếu tính năng này sản phẩm không thể vận hành.
> - **S (Should Have):** Yêu cầu quan trọng cần có; bổ sung giá trị lớn cho trải nghiệm người dùng.
> - **C (Could Have):** Yêu cầu mong muốn có nếu còn đủ nguồn lực và thời gian.
> - **W (Won't Have):** Yêu cầu không nằm trong phạm vi phát triển của phiên bản hiện tại.

---

### 3.1. Module Xác thực và Quản lý Người dùng (FR-AUTH)

#### FR-AUTH-001: Đăng ký Tài khoản Mới (User Registration)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-001` |
| **Tên yêu cầu** | Đăng ký Tài khoản Người dùng Mới |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Khách vãng lai (Guest / Anonymous User) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép người dùng đăng ký tài khoản tác giả bằng thông tin định danh. Sau khi tạo thành công, người dùng được cấp tự động vai trò `Author`, cấp Access Token (JSON body) và Refresh Token được lưu trong `HttpOnly Secure Cookie`. Đồng thời kích hoạt Hangfire Job gửi email chào mừng bất đồng bộ. |
| **Điều kiện tiên quyết** | 1. Người dùng chưa đăng nhập hệ thống.<br>2. Endpoint `POST /api/v1/auth/register` hoạt động bình thường.<br>3. Cơ sở dữ liệu PostgreSQL đang kết nối thành công. |
| **Luồng chính (Happy Path)** | 1. Client gửi yêu cầu HTTP `POST /api/v1/auth/register` kèm JSON body: `{ "displayName": "...", "email": "...", "userName": "...", "password": "..." }`.<br>2. `RegisterCommand` được khởi tạo và gửi vào MediatR Pipeline.<br>3. `ValidationBehavior` thực thi `RegisterCommandValidator`: Kiểm tra `displayName` (2-100 ký tự), `email` đúng định dạng email, `userName` không chứa ký tự đặc biệt, `password` tối thiểu 8 ký tự (chứa chữ hoa, chữ thường, số và ký tự đặc biệt).<br>4. `RegisterCommandHandler` kiểm tra sự tồn tại của email qua `UserManager.FindByEmailAsync`.<br>5. Tạo đối tượng `ApplicationUser` mới qua phương thức khởi tạo miền.<br>6. Gọi `UserManager.CreateAsync(user, password)` – ASP.NET Core Identity tự động băm mật khẩu với thuật toán PBKDF2-HMACSHA512.<br>7. Gán vai trò mặc định: `UserManager.AddToRoleAsync(user, "Author")`.<br>8. `JwtService.GenerateAccessToken(user, roles)` tạo Access Token (HS256, thời hạn 15 phút).<br>9. `JwtService.GenerateRefreshToken(user.Id)` tạo mã ngẫu nhiên bảo mật 128-bit, lưu bản băm SHA-256 vào bảng `refresh_tokens`.<br>10. Đính kèm Refresh Token vào HTTP Response Header dưới dạng `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800`.<br>11. Kích hoạt tác vụ nền Hangfire: `BackgroundJob.Enqueue<WelcomeEmailJob>(x => x.ExecuteAsync(user.Id))`.<br>12. Trả về mã phản hồi `HTTP 201 Created` kèm body `AuthResponseDto`: `{ "accessToken": "...", "expiresAt": "...", "user": { "id": "...", "displayName": "...", "email": "...", "userName": "...", "avatarUrl": null, "roles": ["Author"] } }`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Email đã được đăng ký:** Tại bước 4, nếu email đã tồn tại trong CSDL -> Ném lỗi `ConflictException` -> `GlobalExceptionMiddleware` bắt và trả về mã `HTTP 409 Conflict` kèm body RFC 7807 với mã lỗi `AUTH_EMAIL_EXISTS`.<br>**A2 – Dữ liệu đầu vào không hợp lệ:** Tại bước 3, FluentValidation phát hiện lỗi -> Ném `ValidationException` -> Trả về `HTTP 400 Bad Request` kèm chi tiết trường lỗi trong đối tượng `errors` (`VALIDATION_ERROR`).<br>**A3 – Mật khẩu không đạt chuẩn Identity:** Identity trả về lỗi độ phức tạp -> Trả về `HTTP 400 Bad Request` chi tiết lỗi.<br>**A4 – Lỗi kết nối CSDL:** Trả về `HTTP 500 Internal Server Error`, ẩn hoàn toàn StackTrace đối với Client. |
| **HTTP Method & Endpoint** | `POST /api/v1/auth/register` |
| **Kết quả mong đợi** | Tài khoản tác giả mới được lưu vào CSDL, role `Author` được thiết lập, Access Token trả về trong body, Refresh Token được gán vào Cookie an toàn, tác vụ gửi email được đưa vào hàng đợi Hangfire. |
| **Mã trạng thái HTTP** | `201 Created` (Thành công); `400 Bad Request` (Dữ liệu không hợp lệ); `409 Conflict` (Email đã tồn tại); `500 Internal Server Error` (Lỗi máy chủ). |

---

#### FR-AUTH-002: Đăng nhập bằng Email và Mật khẩu (Local Login)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-002` |
| **Tên yêu cầu** | Đăng nhập bằng Email và Mật khẩu (Local Login) |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Tác giả đã đăng ký (Author) hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép người dùng đăng nhập hệ thống bằng email và mật khẩu. Khi thành công, hệ thống cấp mới một cặp Access Token (JSON) và Refresh Token được bảo vệ trong `HttpOnly Secure Cookie`. Áp dụng cơ chế **Refresh Token Rotation**: Đánh dấu đã sử dụng đối với token cũ nhằm ngăn chặn tấn công Token Reuse. |
| **Điều kiện tiên quyết** | 1. Người dùng đã có tài khoản tồn tại trong hệ thống.<br>2. Tài khoản đang ở trạng thái không bị khóa (`LockoutEnabled == false` hoặc thời gian khóa đã hết). |
| **Luồng chính (Happy Path)** | 1. Client gửi `POST /api/v1/auth/login` với body: `{ "email": "...", "password": "..." }`.<br>2. `LoginCommand` được khởi tạo và điều phối qua MediatR.<br>3. `ValidationBehavior` xác thực định dạng email hợp lệ và mật khẩu không để trống.<br>4. Tìm kiếm người dùng qua `UserManager.FindByEmailAsync(email)`.<br>5. Kiểm tra mật khẩu qua `UserManager.CheckPasswordAsync(user, password)`.<br>6. Kiểm tra tài khoản không bị vô hiệu hóa (`user.IsActive == true`) và không bị khóa (`UserManager.IsLockedOutAsync`).<br>7. Tạo mới JWT Access Token có thời hạn 15 phút với các claims: `nameid`, `email`, `unique_name`, `role`.<br>8. Sinh Refresh Token ngẫu nhiên mới, lưu bản băm SHA-256 vào bảng `refresh_tokens`.<br>9. Reset bộ đếm số lần đăng nhập sai: `UserManager.ResetAccessFailedCountAsync(user)`.<br>10. Đính kèm Refresh Token vào Response Header: `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800`.<br>11. Trả về `HTTP 200 OK` kèm theo `AuthResponseDto`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Sai thông tin xác thực:** Email không tồn tại hoặc mật khẩu không chính xác -> Trả về `HTTP 401 Unauthorized` với thông điệp chung: *"Email hoặc mật khẩu không chính xác"* (mã lỗi `AUTH_INVALID_CREDENTIALS`), tuyệt đối không tiết lộ tài khoản có tồn tại hay không nhằm chống tấn công User Enumeration.<br>**A2 – Tài khoản bị vô hiệu hóa:** Nếu `IsActive == false` -> Trả về `HTTP 403 Forbidden` (`AUTH_ACCOUNT_DISABLED`).<br>**A3 – Tài khoản bị khóa tạm thời (Lockout):** Khi nhập sai quá 5 lần liên tiếp -> Trả về `HTTP 423 Locked` kèm thời gian chờ mở khóa.<br>**A4 – Vượt giới hạn tần suất yêu cầu:** Vượt quá 10 lượt gọi/phút -> Trả về `HTTP 429 Too Many Requests` (`RATE_LIMIT_EXCEEDED`). |
| **HTTP Method & Endpoint** | `POST /api/v1/auth/login` |
| **Kết quả mong đợi** | Cấp Access Token mới cho Client trong JSON body và gán Refresh Token vào `HttpOnly Secure Cookie`. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Dữ liệu sai định dạng); `401 Unauthorized` (Sai tài khoản/mật khẩu); `403 Forbidden` (Tài khoản bị cấm); `423 Locked` (Khóa tạm thời); `429 Too Many Requests` (Quá giới hạn rate limit). |

---

#### FR-AUTH-003: Đăng nhập / Đăng ký bằng Google OAuth 2.0
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-003` |
| **Tên yêu cầu** | Đăng nhập / Đăng ký nhanh qua Google OAuth 2.0 |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Khách vãng lai (Guest) hoặc Người dùng đã liên kết Google |
| **Mức ưu tiên (MoSCoW)** | **S – Should Have** |
| **Mô tả chức năng** | Hỗ trợ người dùng đăng nhập bằng tài khoản Google sử dụng Authorization Code Flow với PKCE (phối hợp Auth.js v5 phía Next.js). Nếu là lần đăng nhập đầu tiên, hệ thống tự động tạo người dùng mới với thông tin từ hồ sơ Google (`email`, `displayName`, `avatarUrl`) và gán vai trò `Author`. Cấp Access Token và thiết lập Refresh Token trong `HttpOnly Secure Cookie`. |
| **Điều kiện tiên quyết** | Cấu hình thành công Client ID & Client Secret của Google API Console trong tệp môi trường của Backend và Frontend. |
| **Luồng chính (Happy Path)** | 1. Người dùng chọn "Đăng nhập với Google" trên Next.js Frontend.<br>2. Next.js hoàn thành việc xác thực và gửi ID Token hoặc Authorization Code về API qua `POST /api/v1/auth/google`.<br>3. Backend xác thực tính hợp lệ của Token thông qua thư viện xác thực của Google.<br>4. Tìm kiếm người dùng thông qua liên kết đăng nhập ngoại (`UserManager.FindByLoginAsync("Google", providerKey)`).<br>5. Nếu chưa tồn tại: Kiểm tra theo Email. Nếu Email chưa có, tạo mới `ApplicationUser` với `displayName` lấy từ tên Google, `avatarUrl` lấy từ ảnh đại diện Google, gán vai trò `Author` và gọi `AddLoginAsync`. Nếu Email đã có sẵn, tự động liên kết tài khoản ngoại Google vào tài khoản hiện tại.<br>6. Sinh bộ Access Token và Refresh Token mới.<br>7. Đính kèm Refresh Token vào `HttpOnly Secure Cookie`.<br>8. Trả về `HTTP 200 OK` kèm `AuthResponseDto`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Token Google không hợp lệ hoặc đã hết hạn:** Trả về `HTTP 400 Bad Request` kèm mã lỗi `AUTH_GOOGLE_TOKEN_INVALID`.<br>**A2 – Dịch vụ Google gián đoạn kết nối:** Trả về `HTTP 502 Bad Gateway`. |
| **HTTP Method & Endpoint** | `POST /api/v1/auth/google` |
| **Kết quả mong đợi** | Người dùng đăng nhập thành công vào hệ thống không cần tạo mật khẩu cục bộ. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Token không hợp lệ); `502 Bad Gateway` (Lỗi kết nối IdP). |

---

#### FR-AUTH-004: Làm mới Access Token (Token Refresh)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-004` |
| **Tên yêu cầu** | Làm mới Access Token thông qua Refresh Token Cookie |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Tác giả (Author) hoặc Quản trị viên (Admin) sở hữu Cookie Refresh Token hợp lệ |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Khi Access Token hết hạn (sau 15 phút), Client gửi yêu cầu làm mới phiên làm việc. Backend tự động trích xuất Refresh Token từ `HttpOnly Cookie`. Thực thi nguyên tắc **Refresh Token Rotation**: Token cũ bị thu hồi ngay lập tức (`IsRevoked = true`), cấp một Refresh Token mới vào Cookie và trả về Access Token mới trong JSON body. Nếu phát hiện một token đã bị thu hồi trước đó được gửi lại, hệ thống kích hoạt cơ chế phòng vệ thu hồi toàn bộ các Refresh Token của tài khoản đó (Reuse Detection). |
| **Điều kiện tiên quyết** | Trình duyệt Client gửi kèm Cookie `refreshToken` còn hạn và chưa bị thu hồi. |
| **Luồng chính (Happy Path)** | 1. Client gửi `POST /api/v1/auth/refresh` (tự động kèm theo Cookie `refreshToken`).<br>2. Endpoint trích xuất giá trị `refreshToken` từ Request Cookie.<br>3. Băm SHA-256 chuỗi token nhận được và tìm kiếm bản ghi trong bảng `refresh_tokens`.<br>4. Xác minh điều kiện hợp lệ: Bản ghi tồn tại, `IsRevoked == false`, `ExpiresAt > DateTime.UtcNow`, và tài khoản người dùng vẫn đang hoạt động (`IsActive == true`).<br>5. Đánh dấu thu hồi token cũ: `IsRevoked = true`, `RevokedAt = DateTime.UtcNow`, `ReplacedByTokenHash = newHash`.<br>6. Cấp một Access Token mới (15 phút) và một Refresh Token ngẫu nhiên mới (7 ngày).<br>7. Lưu Refresh Token mới vào CSDL.<br>8. Thiết lập Cookie mới ghi đè: `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800`.<br>9. Trả về `HTTP 200 OK` kèm `{ "accessToken": "...", "expiresAt": "..." }`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không tìm thấy Cookie hoặc Token không tồn tại:** Trả về `HTTP 401 Unauthorized` (`AUTH_TOKEN_INVALID`).<br>**A2 – Refresh Token đã hết hạn:** Trả về `HTTP 401 Unauthorized` (`AUTH_REFRESH_TOKEN_EXPIRED`), yêu cầu người dùng đăng nhập lại.<br>**A3 – Phát hiện Token Reuse Attack:** Token gửi lên đã có cờ `IsRevoked == true` -> Lập tức thu hồi toàn bộ họ token của người dùng này trong CSDL, ghi log bảo mật mức `WARNING` -> Trả về `HTTP 401 Unauthorized` (`AUTH_REFRESH_TOKEN_REVOKED`). |
| **HTTP Method & Endpoint** | `POST /api/v1/auth/refresh` |
| **Kết quả mong đợi** | Cấp Access Token mới trong body và cấp Refresh Token xoay vòng an toàn trong Cookie. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `401 Unauthorized` (Token không hợp lệ, hết hạn, hoặc bị tái sử dụng trái phép). |

---

#### FR-AUTH-005: Đăng xuất và Thu hồi Token (Logout / Token Revocation)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-005` |
| **Tên yêu cầu** | Đăng xuất và Thu hồi Refresh Token |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Người dùng đang đăng nhập (Author hoặc Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Thu hồi phiên làm việc hiện tại của người dùng: Đánh dấu vô hiệu hóa bản ghi Refresh Token trong cơ sở dữ liệu và xóa bỏ Cookie `refreshToken` khỏi trình duyệt Client. Client chịu trách nhiệm dọn dẹp Access Token khỏi bộ nhớ in-memory. |
| **Điều kiện tiên quyết** | Yêu cầu gửi kèm Cookie `refreshToken` và Header `Authorization: Bearer <access_token>` hợp lệ. |
| **Luồng chính (Happy Path)** | 1. Client gửi yêu cầu `POST /api/v1/auth/logout`.<br>2. Middleware kiểm tra Access Token và lấy định danh `userId`.<br>3. Trích xuất `refreshToken` từ Cookie, băm SHA-256 và tìm kiếm trong bảng `refresh_tokens`.<br>4. Nếu tìm thấy và thuộc về `userId`: Đánh dấu `IsRevoked = true`, `RevokedAt = DateTime.UtcNow`.<br>5. Xóa Cookie ở trình duyệt bằng cách trả về Header: `Set-Cookie: refreshToken=; Path=/api/v1/auth; Max-Age=0; HttpOnly; Secure; SameSite=Strict`.<br>6. Trả về mã phản hồi `HTTP 204 No Content`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Token không tìm thấy hoặc đã bị thu hồi:** Vẫn trả về `HTTP 204 No Content` và xóa cookie (Đảm bảo tính Idempotent, không rò rỉ trạng thái hệ thống).<br>**A2 – Access Token không hợp lệ:** Trả về `HTTP 401 Unauthorized`. |
| **HTTP Method & Endpoint** | `POST /api/v1/auth/logout` |
| **Kết quả mong đợi** | Refresh Token bị vô hiệu hóa vĩnh viễn trong CSDL, Cookie bị xóa sạch trên trình duyệt. |
| **Mã trạng thái HTTP** | `204 No Content` (Đăng xuất thành công); `401 Unauthorized` (Lỗi xác thực). |

---

#### FR-AUTH-006: Xem Hồ sơ Cá nhân (View Profile)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-006` |
| **Tên yêu cầu** | Xem Thông tin Hồ sơ Cá nhân |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Người dùng đã đăng nhập (Author / Admin) |
| **Mức ưu tiên (MoSCoW)** | **S – Should Have** |
| **Mô tả chức năng** | Trả về thông tin chi tiết hồ sơ tài khoản của người dùng đang gửi yêu cầu dựa trên thông tin định danh `userId` trích xuất từ Access Token. Tuyệt đối không để lộ các thông tin nhạy cảm như `PasswordHash`, `SecurityStamp`. |
| **Điều kiện tiên quyết** | Header yêu cầu chứa JWT Access Token hợp lệ. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/auth/me`.<br>2. Middleware xác thực JWT, lấy `userId` từ claim `NameIdentifier`.<br>3. Thực thi `GetCurrentUserQuery`.<br>4. Tìm kiếm thông tin người dùng từ CSDL thông qua `UserManager.FindByIdAsync(userId)`.<br>5. Ánh xạ sang `UserProfileDto`: `{ "id": "...", "displayName": "...", "email": "...", "userName": "...", "avatarUrl": "...", "bio": "...", "roles": [...], "emailConfirmed": true, "createdAt": "..." }`.<br>6. Trả về `HTTP 200 OK` kèm `UserProfileDto`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Người dùng bị xóa hoặc không tồn tại:** Trả về `HTTP 404 Not Found` (`AUTH_USER_NOT_FOUND`).<br>**A2 – Thiếu hoặc Access Token hết hạn:** Trả về `HTTP 401 Unauthorized` (`AUTH_TOKEN_EXPIRED`). |
| **HTTP Method & Endpoint** | `GET /api/v1/auth/me` |
| **Kết quả mong đợi** | Trả về thông tin công khai và định danh của tác giả. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `401 Unauthorized` (Chưa đăng nhập); `404 Not Found` (Không tìm thấy tài khoản). |

---

#### FR-AUTH-007: Cập nhật Hồ sơ Cá nhân (Update Profile)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-AUTH-007` |
| **Tên yêu cầu** | Cập nhật Thông tin Hồ sơ Cá nhân |
| **Nhóm chức năng** | Module Xác thực và Quản lý Người dùng (`FR-AUTH`) |
| **Tác nhân (Actor)** | Người dùng đã đăng nhập (Author / Admin) |
| **Mức ưu tiên (MoSCoW)** | **S – Should Have** |
| **Mô tả chức năng** | Cho phép người dùng chỉnh sửa thông tin hiển thị cá nhân gồm: `displayName`, `avatarUrl` và tiểu sử ngắn `bio`. Sử dụng phương thức `PATCH` để cập nhật từng phần (partial update). Các trường `email` và `userName` không được phép thay đổi qua endpoint này. |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập với JWT hợp lệ. |
| **Luồng chính (Happy Path)** | 1. Client gửi `PATCH /api/v1/auth/me` với body: `{ "displayName": "...", "avatarUrl": "...", "bio": "..." }`.<br>2. `UpdateProfileCommand` được điều phối qua MediatR, lấy `userId` từ JWT claims.<br>3. `ValidationBehavior` xác thực: `displayName` (2-100 ký tự), `avatarUrl` (URL hợp lệ nếu có), `bio` (tối đa 500 ký tự nếu có).<br>4. Tìm bản ghi người dùng trong CSDL, cập nhật các giá trị mới tương ứng.<br>5. Gọi `UserManager.UpdateAsync(user)`.<br>6. Trả về `HTTP 200 OK` kèm `UserProfileDto` đã được cập nhật mới nhất. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Dữ liệu gửi lên không hợp lệ:** Trả về `HTTP 400 Bad Request` kèm chi tiết lỗi validation (`VALIDATION_ERROR`).<br>**A2 – Không có quyền:** Trả về `HTTP 401 Unauthorized`. |
| **HTTP Method & Endpoint** | `PATCH /api/v1/auth/me` |
| **Kết quả mong đợi** | Cập nhật thành công các thông tin `displayName`, `avatarUrl`, `bio` vào cơ sở dữ liệu. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Dữ liệu sai định dạng); `401 Unauthorized` (Chưa xác thực). |

---

### 3.2. Module Quản lý Danh mục (FR-CAT)

#### FR-CAT-001: Xem Danh sách Tất cả Danh mục
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-CAT-001` |
| **Tên yêu cầu** | Xem Danh sách Tất cả Danh mục Ẩm thực |
| **Nhóm chức năng** | Module Quản lý Danh mục (`FR-CAT`) |
| **Tác nhân (Actor)** | Tất cả mọi người (Guest, Author, Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Trả về toàn bộ danh sách các danh mục món ăn đang hoạt động (`IsDeleted == false`), kèm theo số lượng công thức đã xuất bản (`Published`) trong từng danh mục. Dữ liệu được đồng bộ và lưu trong **Redis Distributed Cache** (`RedisCacheService`, key `"categories:all"`, TTL 60 phút) nhằm đảm bảo Backend hoàn toàn phi trạng thái (Stateless). |
| **Điều kiện tiên quyết** | Không yêu cầu đăng nhập. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/categories`.<br>2. `GetCategoriesQuery` kích hoạt qua MediatR.<br>3. Kiểm tra khóa `"categories:all"` trong Redis Cache.<br>4. **Cache Hit:** Trả về ngay mảng dữ liệu DTO từ bộ nhớ đệm Redis.<br>5. **Cache Miss:** Truy vấn CSDL PostgreSQL lọc các danh mục có `IsDeleted == false`, tính tổng số công thức có `Status == Published && IsDeleted == false`.<br>6. Lưu mảng kết quả vào Redis Cache với TTL 60 phút.<br>7. Trả về `HTTP 200 OK` với mảng `CategoryDto[]`: `[{ "id": "...", "name": "...", "slug": "...", "description": "...", "imageUrl": "...", "recipeCount": 12 }]`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Hệ thống chưa có danh mục nào:** Trả về `HTTP 200 OK` kèm mảng rỗng `[]`. |
| **HTTP Method & Endpoint** | `GET /api/v1/categories` |
| **Kết quả mong đợi** | Nhận danh sách các danh mục kèm số lượng công thức; tốc độ phản hồi nhanh qua Redis cache. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công). |

---

#### FR-CAT-002: Xem Chi tiết Danh mục và Danh sách Công thức
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-CAT-002` |
| **Tên yêu cầu** | Xem Chi tiết Danh mục và Danh sách Công thức thuộc Danh mục |
| **Nhóm chức năng** | Module Quản lý Danh mục (`FR-CAT`) |
| **Tác nhân (Actor)** | Tất cả mọi người (Guest, Author, Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Trả về thông tin chi tiết của một danh mục dựa trên đường dẫn thân thiện SEO (`slug`), kèm theo danh sách công thức nấu ăn được phân trang. Khách vãng lai chỉ nhìn thấy công thức `Published`. Tác giả nhìn thấy thêm các công thức `Draft` do chính mình viết. |
| **Điều kiện tiên quyết** | Danh mục với `slug` tương ứng phải tồn tại và chưa bị đánh dấu Soft Delete. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/categories/{slug}?page=1&pageSize=12`.<br>2. `GetCategoryBySlugQuery` kích hoạt.<br>3. Truy vấn danh mục theo `slug` với điều kiện `IsDeleted == false`.<br>4. Áp dụng bộ lọc phân quyền: Nếu là Guest -> `Status == Published`; nếu là Author -> `Status == Published OR (Status == Draft && AuthorId == currentUserId)`; nếu là Admin -> Tất cả trạng thái.<br>5. Thực hiện phân trang dựa trên OFFSET/LIMIT (`Skip((page-1)*pageSize).Take(pageSize)`).<br>6. Trả về `HTTP 200 OK` với cấu trúc: `{ "category": CategoryDto, "recipes": PagedResult<RecipeSummaryDto> }`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không tìm thấy Slug danh mục:** Trả về `HTTP 404 Not Found` kèm RFC 7807 (`CATEGORY_NOT_FOUND`).<br>**A2 – Tham số phân trang âm hoặc không hợp lệ:** Trả về `HTTP 400 Bad Request`. |
| **HTTP Method & Endpoint** | `GET /api/v1/categories/{slug}?page={page}&pageSize={pageSize}` |
| **Kết quả mong đợi** | Hiển thị chi tiết danh mục và danh sách công thức thuộc danh mục đó một cách chính xác. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Tham số sai); `404 Not Found` (Danh mục không tồn tại). |

---

#### FR-CAT-003: Tạo Danh mục Mới [Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-CAT-003` |
| **Tên yêu cầu** | Tạo Danh mục Công thức Mới |
| **Nhóm chức năng** | Module Quản lý Danh mục (`FR-CAT`) |
| **Tác nhân (Actor)** | Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép Admin tạo danh mục công thức mới. Đường dẫn thân thiện `slug` được hệ thống tự động sinh từ `name` (chuyển sang chữ thường, loại bỏ dấu tiếng Việt, thay khoảng trắng bằng gạch nối `-`). Nếu slug bị trùng, tự động bổ sung hậu tố `-2`, `-3` đảm bảo tính duy nhất. Sau khi tạo thành công, tiến hành xóa khóa cache `"categories:all"` trên Redis. |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập với vai trò `Admin`. |
| **Luồng chính (Happy Path)** | 1. Admin gửi `POST /api/v1/categories` với Header Bearer Token và body: `{ "name": "...", "description": "...", "imageUrl": "..." }`.<br>2. Kiểm tra vai trò Admin qua chính sách ủy quyền.<br>3. `CreateCategoryCommand` thực thi qua MediatR.<br>4. `ValidationBehavior` xác thực: `name` (2-100 ký tự, không chứa thẻ HTML nguy hại), `description` (tối đa 500 ký tự).<br>5. Kiểm tra tên danh mục chưa tồn tại trong CSDL.<br>6. Tự động sinh `slug` duy nhất.<br>7. Tạo thực thể `Category` mới, lưu vào CSDL thông qua Unit of Work.<br>8. Xóa bộ nhớ đệm: `RedisCacheService.RemoveAsync("categories:all")`.<br>9. Trả về `HTTP 201 Created` kèm `CategoryDto` và Header `Location: /api/v1/categories/{newSlug}`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Tên danh mục đã tồn tại:** Trả về `HTTP 409 Conflict` (`CATEGORY_NAME_EXISTS`).<br>**A2 – Dữ liệu không hợp lệ:** Trả về `HTTP 400 Bad Request` (`VALIDATION_ERROR`).<br>**A3 – Không có quyền Admin:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `POST /api/v1/categories` |
| **Kết quả mong đợi** | Danh mục mới được lưu vào CSDL, cache danh mục toàn cục được làm mới. |
| **Mã trạng thái HTTP** | `201 Created` (Tạo thành công); `400 Bad Request` (Dữ liệu lỗi); `403 Forbidden` (Không đủ quyền); `409 Conflict` (Tên danh mục trùng). |

---

#### FR-CAT-004: Cập nhật Danh mục [Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-CAT-004` |
| **Tên yêu cầu** | Cập nhật Thông tin Danh mục |
| **Nhóm chức năng** | Module Quản lý Danh mục (`FR-CAT`) |
| **Tác nhân (Actor)** | Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép Admin cập nhật tên hiển thị, mô tả, ảnh đại diện và thứ tự hiển thị của danh mục. **Giá trị `slug` KHÔNG được phép thay đổi** khi đổi tên nhằm tránh làm gãy các liên kết SEO và bookmark của người dùng. Tự động xóa khóa cache `"categories:all"` trên Redis sau khi lưu thay đổi. |
| **Điều kiện tiên quyết** | 1. Đăng nhập với quyền Admin.<br>2. Danh mục với `id` tương ứng đang tồn tại trong hệ thống. |
| **Luồng chính (Happy Path)** | 1. Admin gửi `PUT /api/v1/categories/{id}` với body: `{ "name": "...", "description": "...", "imageUrl": "...", "orderIndex": 1 }`.<br>2. Kiểm tra vai trò Admin.<br>3. Thực thi `UpdateCategoryCommand`.<br>4. Tìm bản ghi danh mục theo ID.<br>5. Cập nhật các trường thông tin (giữ nguyên `slug`).<br>6. Lưu thay đổi vào CSDL và xóa khóa cache Redis `"categories:all"`.<br>7. Trả về `HTTP 200 OK` kèm `CategoryDto` đã cập nhật. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Danh mục không tồn tại:** Trả về `HTTP 404 Not Found` (`CATEGORY_NOT_FOUND`).<br>**A2 – Dữ liệu không hợp lệ:** Trả về `HTTP 400 Bad Request`.<br>**A3 – Thiếu quyền Admin:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `PUT /api/v1/categories/{id:guid}` |
| **Kết quả mong đợi** | Thông tin danh mục được cập nhật thành công, cache Redis được làm mới. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Dữ liệu sai); `403 Forbidden` (Không có quyền); `404 Not Found` (Không tìm thấy danh mục). |

---

#### FR-CAT-005: Xóa Danh mục (Soft Delete) [Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-CAT-005` |
| **Tên yêu cầu** | Xóa Danh mục Ẩm thực (Soft Delete) |
| **Nhóm chức năng** | Module Quản lý Danh mục (`FR-CAT`) |
| **Tác nhân (Actor)** | Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **S – Should Have** |
| **Mô tả chức năng** | Cho phép Admin thực hiện **Soft Delete** danh mục (`IsDeleted = true`). **Quy tắc nghiệp vụ bảo toàn dữ liệu:** Hệ thống **TUYỆT ĐỐI KHÔNG CHO PHÉP** xóa danh mục nếu bên trong danh mục đó vẫn còn chứa các công thức nấu ăn đang hoạt động (`IsDeleted == false`). Admin bắt buộc phải chuyển toàn bộ các công thức sang danh mục khác trước khi thực hiện xóa. Sau khi xóa, xóa khóa cache danh mục trên Redis. |
| **Điều kiện tiên quyết** | 1. Đăng nhập với quyền Admin.<br>2. Danh mục tồn tại và không còn chứa công thức nào đang hoạt động. |
| **Luồng chính (Happy Path)** | 1. Admin gửi yêu cầu `DELETE /api/v1/categories/{id}`.<br>2. Kiểm tra vai trò Admin.<br>3. `DeleteCategoryCommand` thực thi qua MediatR.<br>4. Đếm số lượng công thức còn liên kết với danh mục: `_context.Recipes.CountAsync(r => r.CategoryId == id && !r.IsDeleted)`.<br>5. Nếu số lượng $= 0$: Đánh dấu thực thể danh mục `category.IsDeleted = true`, `category.UpdatedAt = DateTime.UtcNow`.<br>6. Lưu thay đổi vào CSDL.<br>7. Xóa khóa cache Redis `"categories:all"`.<br>8. Trả về `HTTP 204 No Content`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Danh mục vẫn còn công thức:** Số lượng công thức $> 0$ -> Ném `ConflictException` -> Trả về `HTTP 409 Conflict` kèm thông báo: *"Không thể xóa danh mục đang chứa {count} công thức nấu ăn. Vui lòng di dời công thức trước khi xóa"* (`CATEGORY_DELETE_HAS_RECIPES`).<br>**A2 – Danh mục không tồn tại:** Trả về `HTTP 404 Not Found` (`CATEGORY_NOT_FOUND`).<br>**A3 – Không có quyền Admin:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `DELETE /api/v1/categories/{id:guid}` |
| **Kết quả mong đợi** | Danh mục được chuyển cờ `IsDeleted = true` an toàn, cache Redis được làm mới. |
| **Mã trạng thái HTTP** | `204 No Content` (Xóa thành công); `403 Forbidden` (Từ chối truy cập); `404 Not Found` (Không tìm thấy danh mục); `409 Conflict` (Danh mục đang chứa công thức). |

---

### 3.3. Module Quản lý Công thức Nấu ăn (FR-RCP)

#### FR-RCP-001: Xem Danh sách Công thức (Paginated + Filtered + Sorted)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-001` |
| **Tên yêu cầu** | Xem Danh sách Công thức Nấu ăn (Phân trang, Lọc và Sắp xếp) |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tất cả mọi người (Guest, Author, Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Trả về danh sách công thức nấu ăn dưới dạng tóm tắt (`RecipeSummaryDto`), có hỗ trợ phân trang (Offset-based), bộ lọc đa tiêu chí (danh mục, độ khó, thời gian nấu tối đa) và sắp xếp linh hoạt. Khách chỉ thấy bài `Published`. Tác giả thấy thêm bài `Draft` của chính mình. Phản hồi được áp dụng bộ đệm .NET Output Cache với Redis Backplane (TTL 15 phút, phân biệt theo Query String, tag `"recipes"`). |
| **Điều kiện tiên quyết** | Tham số phân trang `page >= 1`, `pageSize` nằm trong khoảng $[1, 50]$. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/recipes?page=1&pageSize=12&categoryId={guid}&difficulty=Easy&maxCookTime=30&sort=-createdAt`.<br>2. `GetRecipesQuery` kích hoạt qua MediatR.<br>3. Kiểm tra Output Cache trên Redis theo khóa `{path}?{queryString}`.<br>4. Nếu Cache Miss: Khởi tạo truy vấn `IQueryable` trên bảng `Recipes` có đính kèm điều kiện `!IsDeleted`.<br>5. Áp dụng bộ lọc phân quyền: Khách -> `Status == Published`; Tác giả -> `Status == Published OR (Status == Draft && AuthorId == currentUserId)`; Admin -> Không giới hạn trạng thái.<br>6. Áp dụng các bộ lọc nghiệp vụ: `CategoryId`, `Difficulty`, `CookTime <= maxCookTime`.<br>7. Áp dụng sắp xếp: Tiền tố `-` là sắp xếp giảm dần (ví dụ: `-createdAt` -> giảm dần theo ngày tạo; `title` -> tăng dần theo tiêu đề).<br>8. Tính tổng số bản ghi thỏa mãn (`CountAsync`).<br>9. Phân trang bằng `Skip((page-1)*pageSize).Take(pageSize)`.<br>10. Ánh xạ sang `PagedResult<RecipeSummaryDto>`.<br>11. Ghi nhận vào Output Cache Redis có gắn tag `"recipes"`.<br>12. Trả về `HTTP 200 OK`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Tham số phân trang sai:** `page < 1` hoặc `pageSize > 50` -> Trả về `HTTP 400 Bad Request` (`VALIDATION_ERROR`).<br>**A2 – Bộ lọc không tìm thấy kết quả:** Trả về `HTTP 200 OK` với mảng `items: []` và `totalCount: 0`. |
| **HTTP Method & Endpoint** | `GET /api/v1/recipes?page={n}&pageSize={n}&categoryId={guid}&difficulty={level}&maxCookTime={min}&sort={field}` |
| **Kết quả mong đợi** | Nhận danh sách công thức tóm tắt phân trang, cache tự động được lưu trên Redis. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Tham số không hợp lệ). |

---

#### FR-RCP-002: Xem Chi tiết Công thức Nấu ăn
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-002` |
| **Tên yêu cầu** | Xem Chi tiết Công thức Nấu ăn |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tất cả mọi người (Guest, Author, Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Trả về thông tin toàn diện của một công thức theo đường dẫn `slug`, bao gồm: Thông tin tổng quan, bảng nguyên liệu (`RecipeIngredient[]`), các bước hướng dẫn (`RecipeStep[]` sắp xếp theo `StepNumber`), bộ sưu tập ảnh (`RecipeImage[]`), bảng giá trị dinh dưỡng (`RecipeNutrition`), tác giả và danh mục. Bài viết nháp `Draft` chỉ cho phép chính tác giả sở hữu hoặc Admin truy cập. Tích hợp Output Cache trên Redis (TTL 60 phút, gắn tag `"recipes"` và `"recipe:{slug}"`). |
| **Điều kiện tiên quyết** | Công thức với `slug` chỉ định phải tồn tại trong CSDL và `IsDeleted == false`. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/recipes/{slug}`.<br>2. `GetRecipeBySlugQuery` kích hoạt qua MediatR.<br>3. Kiểm tra Output Cache Redis.<br>4. Nếu Cache Miss: Truy vấn CSDL kết hợp Eager Loading: `.Include(r => r.Steps).Include(r => r.Ingredients).Include(r => r.Images).Include(r => r.Category).Include(r => r.Author)`.<br>5. Kiểm tra quyền truy cập: Nếu công thức có trạng thái `Draft` hoặc `Archived`, xác thực `AuthorId == currentUserId` hoặc người yêu cầu có vai trò `Admin`.<br>6. Ánh xạ sang `RecipeDetailDto` đầy đủ.<br>7. Lưu Output Cache trên Redis gắn tag `["recipes", $"recipe:{slug}"]`.<br>8. Trả về `HTTP 200 OK`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không tìm thấy Slug hoặc công thức đã bị Soft Delete:** Trả về `HTTP 404 Not Found` (`RECIPE_NOT_FOUND`).<br>**A2 – Cố tình xem bài Draft của người khác:** Trả về `HTTP 403 Forbidden` (`RECIPE_FORBIDDEN`). |
| **HTTP Method & Endpoint** | `GET /api/v1/recipes/{slug}` |
| **Kết quả mong đợi** | Trả về đầy đủ cây dữ liệu chi tiết của công thức nấu ăn. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `403 Forbidden` (Không có quyền xem); `404 Not Found` (Công thức không tồn tại). |

---

#### FR-RCP-003: Tạo Công thức Nấu ăn Mới [Author/Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-003` |
| **Tên yêu cầu** | Tạo Công thức Nấu ăn Mới |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả (Author) hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép Author hoặc Admin soạn thảo một công thức nấu ăn mới. Trạng thái khởi tạo mặc định luôn luôn là **`Draft`** (bài viết nháp). Đường dẫn `slug` được hệ thống tự động sinh từ tiêu đề `title`. Các danh sách con (nguyên liệu, các bước, dinh dưỡng) có thể được gửi kèm ngay trong yêu cầu tạo hoặc bổ sung dần ở các bước sau. Sau khi tạo thành công, tự động xóa tag cache `"recipes"` trên Redis. |
| **Điều kiện tiên quyết** | 1. Người dùng đã đăng nhập với vai trò `Author` hoặc `Admin`.<br>2. `categoryId` tham chiếu đến một danh mục đang tồn tại và hoạt động. |
| **Luồng chính (Happy Path)** | 1. Author gửi `POST /api/v1/recipes` với body: `{ title, description, categoryId, prepTimeMinutes, cookTimeMinutes, servings, difficulty, instructions?, nutrition?, steps?, ingredients? }`.<br>2. Kiểm tra quyền qua `RequireAuthorization`.<br>3. `CreateRecipeCommand` thực thi qua MediatR.<br>4. `ValidationBehavior` xác thực: `title` (5-200 ký tự), `prepTimeMinutes > 0`, `cookTimeMinutes >= 0`, `servings > 0`, `categoryId` hợp lệ.<br>5. Kiểm tra danh mục tồn tại trong CSDL và `IsDeleted == false`.<br>6. Sinh `slug` duy nhất từ `title`.<br>7. Tạo Aggregate Root `Recipe` với `Status = RecipeStatus.Draft`, `AuthorId = currentUserId`.<br>8. Bổ sung các thực thể con (Steps, Ingredients, Nutrition) nếu có.<br>9. Lưu thực thể vào CSDL qua Unit of Work (`SaveChangesAsync`).<br>10. Invalidate cache bằng phương thức `EvictByTagAsync("recipes")`.<br>11. Trả về `HTTP 201 Created` kèm `RecipeDto` và Header `Location: /api/v1/recipes/{slug}`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Dữ liệu gửi lên sai quy cách:** Trả về `HTTP 400 Bad Request` kèm chi tiết lỗi validation (`VALIDATION_ERROR`).<br>**A2 – Danh mục không tồn tại:** Trả về `HTTP 400 Bad Request` với thông điệp: *"Danh mục không tồn tại hoặc đã bị xóa"* (`CATEGORY_NOT_FOUND`).<br>**A3 – Tiêu đề tạo slug bị xung đột không thể giải quyết:** Trả về `HTTP 409 Conflict` (`RECIPE_SLUG_EXISTS`).<br>**A4 – Chưa xác thực:** Trả về `HTTP 401 Unauthorized`. |
| **HTTP Method & Endpoint** | `POST /api/v1/recipes` |
| **Kết quả mong đợi** | Công thức nấu ăn mới được tạo ở trạng thái `Draft`, cache danh sách công thức được làm mới. |
| **Mã trạng thái HTTP** | `201 Created` (Tạo thành công); `400 Bad Request` (Dữ liệu không hợp lệ); `401 Unauthorized` (Chưa đăng nhập); `409 Conflict` (Xung đột slug). |

---

#### FR-RCP-004: Cập nhật Thông tin Công thức [Author-Owner/Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-004` |
| **Tên yêu cầu** | Cập nhật Thông tin Công thức Nấu ăn |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu công thức (Author - Owner) hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép tác giả cập nhật thông tin chung của công thức. **Áp dụng kiểm tra ủy quyền dựa trên tài nguyên (Resource-Based Authorization):** Chỉ chính tác giả sở hữu (`AuthorId == currentUserId`) hoặc Admin mới có quyền sửa. **Kiểm soát đồng quy lạc quan (Optimistic Concurrency Control):** Sử dụng trường `RowVersion` (ETag pattern), client gửi `RowVersion` hiện tại trong header `If-Match` hoặc body; nếu CSDL phát hiện bản ghi đã bị sửa đổi bởi phiên khác, trả về lỗi xung đột. Làm mới tag cache tương ứng trên Redis. |
| **Điều kiện tiên quyết** | 1. Người dùng đã xác thực.<br>2. Công thức tồn tại trong CSDL và `IsDeleted == false`.<br>3. Người dùng là chủ sở hữu hoặc Admin. |
| **Luồng chính (Happy Path)** | 1. Client gửi `PUT /api/v1/recipes/{id}` với Header `If-Match: "{rowVersion}"` và JSON body dữ liệu cập nhật.<br>2. `UpdateRecipeCommand` kích hoạt qua MediatR.<br>3. Lấy thực thể công thức từ CSDL.<br>4. Kiểm tra ủy quyền: `IAuthorizationService.AuthorizeAsync(user, recipe, "RecipeOwnerPolicy")`.<br>5. Ánh xạ các giá trị mới vào thực thể `recipe`.<br>6. Cập nhật `recipe.UpdatedAt = DateTime.UtcNow`.<br>7. Gọi `SaveChangesAsync()`. EF Core tự động so sánh giá trị `RowVersion`.<br>8. Xóa bộ nhớ đệm: `EvictByTagAsync("recipes")` và `EvictByTagAsync($"recipe:{recipe.Slug}")`.<br>9. Trả về `HTTP 200 OK` kèm `RecipeDto` mới nhất. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không phải chủ sở hữu và không phải Admin:** Trả về `HTTP 403 Forbidden` (`RECIPE_FORBIDDEN`).<br>**A2 – Xung đột đồng quy (RowVersion mismatch):** Phát hiện dữ liệu đã bị sửa bởi người khác -> Trả về `HTTP 409 Conflict` với thông điệp: *"Dữ liệu đã bị thay đổi bởi phiên làm việc khác. Vui lòng tải lại trang"* (`RECIPE_CONCURRENCY_CONFLICT`).<br>**A3 – Không tìm thấy công thức:** Trả về `HTTP 404 Not Found` (`RECIPE_NOT_FOUND`).<br>**A4 – Dữ liệu không hợp lệ:** Trả về `HTTP 400 Bad Request` (`VALIDATION_ERROR`). |
| **HTTP Method & Endpoint** | `PUT /api/v1/recipes/{id:guid}` |
| **Kết quả mong đợi** | Cập nhật thành công nội dung công thức, bảo toàn tính toàn vẹn dữ liệu tránh ghi đè dữ liệu mất kiểm soát. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Dữ liệu sai); `403 Forbidden` (Không đủ quyền); `404 Not Found` (Không tìm thấy); `409 Conflict` (Xung đột đồng quy). |

---

#### FR-RCP-005: Xuất bản / Hủy Xuất bản Công thức
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-005` |
| **Tên yêu cầu** | Xuất bản (Publish) / Hủy Xuất bản (Unpublish) Công thức |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu (Author - Owner) hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Chuyển đổi trạng thái công thức giữa `Draft` và `Published`. **Quy tắc nghiệp vụ xuất bản:** Công thức **BẮT BUỘC** phải có **ít nhất 1 nguyên liệu (`Ingredients.Count > 0`)** và **ít nhất 1 bước hướng dẫn thực hiện (`Steps.Count > 0`)** mới được phép xuất bản. Khi xuất bản, công thức chính thức hiển thị công khai và được cập nhật vào chỉ mục tìm kiếm Full-Text Search. Làm mới tag cache Redis. |
| **Điều kiện tiên quyết** | 1. Người dùng là chủ sở hữu hoặc Admin.<br>2. Công thức thỏa mãn đầy đủ nguyên liệu và các bước hướng dẫn. |
| **Luồng chính (Happy Path)** | 1. Client gửi `PATCH /api/v1/recipes/{id}/publish` (hoặc `/unpublish`).<br>2. `PublishRecipeCommand` thực thi qua MediatR.<br>3. Kiểm tra quyền sở hữu tài nguyên.<br>4. Khi Publish: Kiểm tra `recipe.Ingredients.Any()` và `recipe.Steps.Any()`.<br>5. Nếu hợp lệ: Cập nhật `recipe.Status = RecipeStatus.Published`, `recipe.PublishedAt = DateTime.UtcNow`, `recipe.UpdatedAt = DateTime.UtcNow`.<br>6. Khi Unpublish: Cập nhật `recipe.Status = RecipeStatus.Draft`, `recipe.UpdatedAt = DateTime.UtcNow`.<br>7. Lưu CSDL và xóa tag cache Redis `"recipes"` cùng `$"recipe:{recipe.Slug}"`.<br>8. Trả về `HTTP 200 OK` kèm `RecipeDto`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Chưa đủ điều kiện xuất bản (thiếu bước hoặc nguyên liệu):** Trả về `HTTP 422 Unprocessable Entity` kèm thông điệp: *"Không thể xuất bản công thức chưa có đủ nguyên liệu và bước thực hiện"* (`RECIPE_PUBLISH_INCOMPLETE`).<br>**A2 – Không có quyền thao tác:** Trả về `HTTP 403 Forbidden` (`RECIPE_FORBIDDEN`).<br>**A3 – Công thức không tồn tại:** Trả về `HTTP 404 Not Found` (`RECIPE_NOT_FOUND`). |
| **HTTP Method & Endpoint** | `PATCH /api/v1/recipes/{id:guid}/publish`<br>`PATCH /api/v1/recipes/{id:guid}/unpublish` |
| **Kết quả mong đợi** | Trạng thái công thức thay đổi sang `Published` hoặc `Draft`, cache Redis được làm mới. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `403 Forbidden` (Không có quyền); `404 Not Found` (Không tìm thấy); `422 Unprocessable Entity` (Không đủ điều kiện nghiệp vụ). |

---

#### FR-RCP-006: Lưu trữ Công thức (Archive / Unarchive)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-006` |
| **Tên yêu cầu** | Lưu trữ (Archive) / Bỏ Lưu trữ Công thức |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **S – Should Have** |
| **Mô tả chức năng** | Cho phép chuyển công thức sang trạng thái lưu trữ (`Archived`). Công thức ở trạng thái này sẽ bị ẩn khỏi toàn bộ danh sách hiển thị công khai và kết quả tìm kiếm của khách vãng lai, nhưng vẫn được bảo toàn nguyên vẹn trong hồ sơ của tác giả để tái sử dụng hoặc mở lại khi cần. |
| **Điều kiện tiên quyết** | Người dùng có quyền sở hữu bài viết hoặc là Admin. |
| **Luồng chính (Happy Path)** | 1. Client gửi `PATCH /api/v1/recipes/{id}/archive`.<br>2. Kiểm tra xác thực và quyền sở hữu.<br>3. Cập nhật `recipe.Status = RecipeStatus.Archived`, `recipe.UpdatedAt = DateTime.UtcNow`.<br>4. Lưu CSDL, làm mới cache Redis.<br>5. Trả về `HTTP 200 OK`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không tìm thấy ID:** Trả về `HTTP 404 Not Found`.<br>**A2 – Không có quyền:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `PATCH /api/v1/recipes/{id:guid}/archive` |
| **Kết quả mong đợi** | Công thức chuyển sang trạng thái `Archived` an toàn. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `403 Forbidden` (Không có quyền); `404 Not Found` (Không tìm thấy). |

---

#### FR-RCP-007: Xóa Công thức (Soft Delete) [Author-Owner/Admin]
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-007` |
| **Tên yêu cầu** | Xóa Công thức Nấu ăn (Thống nhất Áp dụng Soft Delete) |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu công thức (Author - Owner) hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép tác giả hoặc Admin xóa một công thức nấu ăn. **Cơ chế kỹ thuật chuẩn hóa (SPEC.md): BẮT BUỘC sử dụng Soft Delete (`IsDeleted = true`, `UpdatedAt = DateTime.UtcNow`)**. Tuyệt đối không xóa vật lý bản ghi khỏi CSDL (`DbContext.Recipes.Remove`). Các thực thể phụ thuộc (`RecipeStep`, `RecipeIngredient`, `RecipeImage`) giữ nguyên trong CSDL nhưng tự động bị ẩn thông qua Global Query Filter của EF Core. Các tệp tin ảnh trên MinIO **KHÔNG bị xóa ngay lập tức** nhằm phục vụ khả năng khôi phục hoặc kiểm toán (Audit), mà sẽ được dọn dẹp qua tác vụ Purge định kỳ sau 30 ngày. Làm mới bộ đệm Redis ngay lập tức. |
| **Điều kiện tiên quyết** | 1. Người dùng đã đăng nhập.<br>2. Công thức đang tồn tại và `IsDeleted == false`.<br>3. Người dùng là chủ sở hữu bài viết hoặc có vai trò Admin. |
| **Luồng chính (Happy Path)** | 1. Client gửi `DELETE /api/v1/recipes/{id}`.<br>2. Kiểm tra xác thực và Resource-Based Authorization.<br>3. `DeleteRecipeCommand` thực thi qua MediatR.<br>4. Tìm bản ghi công thức trong CSDL.<br>5. Đánh dấu xóa mềm: `recipe.IsDeleted = true`, `recipe.UpdatedAt = DateTime.UtcNow`.<br>6. Gọi `_unitOfWork.SaveChangesAsync()`.<br>7. Invalidate bộ đệm Redis: `EvictByTagAsync("recipes")` và `EvictByTagAsync($"recipe:{recipe.Slug}")`.<br>8. Trả về mã phản hồi `HTTP 204 No Content`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Không phải chủ sở hữu và không phải Admin:** Trả về `HTTP 403 Forbidden` (`RECIPE_FORBIDDEN`).<br>**A2 – Công thức không tồn tại hoặc đã bị xóa mềm trước đó:** Trả về `HTTP 404 Not Found` (`RECIPE_NOT_FOUND`). |
| **HTTP Method & Endpoint** | `DELETE /api/v1/recipes/{id:guid}` |
| **Kết quả mong đợi** | Cột `IsDeleted` của công thức chuyển thành `true`, công thức biến mất khỏi giao diện người dùng, dữ liệu gốc được bảo toàn an toàn trong CSDL. |
| **Mã trạng thái HTTP** | `204 No Content` (Xóa thành công); `403 Forbidden` (Không có quyền); `404 Not Found` (Không tìm thấy công thức). |

---

#### FR-RCP-008: Quản lý Ảnh Công thức (Proxy Upload / Set Primary / Delete)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-008` |
| **Tên yêu cầu** | Quản lý Ảnh Công thức (Tải lên An toàn qua Proxy Backend, Đặt Ảnh đại diện, Xóa Ảnh) |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu công thức hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Quản lý bộ sưu tập ảnh minh họa của công thức. **Cơ chế tải lên an toàn (SPEC.md): BẮT BUỘC sử dụng Backend Proxy Upload (tuyệt đối không cấp Presigned URL direct upload cho Browser)**. Backend nhận luồng `multipart/form-data`, thực thi xác minh chặt chẽ: Dung lượng $\le 5$ MB, MIME Type cho phép (`image/jpeg`, `image/png`, `image/webp`, `image/avif`), và **kiểm tra Magic Bytes (4 bytes đầu)** ngăn chặn tải lên mã độc giả mạo đuôi ảnh. Sau đó lưu ảnh gốc vào MinIO, kích hoạt Hangfire Job tạo ảnh thumbnail/medium. Tấm ảnh đầu tiên tải lên tự động được đánh dấu làm ảnh chính (`IsPrimary = true`). Hỗ trợ thao tác đặt ảnh chính và xóa ảnh. |
| **Điều kiện tiên quyết** | Người dùng có quyền chỉnh sửa công thức tương ứng. |
| **Luồng chính (Happy Path)** | **--- 1. TẢI ẢNH LÊN (POST) ---**<br>1. Client gửi `POST /api/v1/recipes/{id}/images` với định dạng `multipart/form-data` chứa trường `file` và tùy chọn `altText`.<br>2. Kiểm tra quyền sở hữu công thức.<br>3. Kiểm tra dung lượng: `file.Length <= 5 * 1024 * 1024` (5MB).<br>4. Kiểm tra Magic Bytes: Đọc 4 bytes đầu để xác nhận header tệp tin thực tế (JPEG: `FF D8 FF`; PNG: `89 50 4E 47`; WebP: `52 49 46 46`; AVIF: `00 00 00 ... 66 74 79 70 61 76 69 66`).<br>5. Đặt tên tệp định danh duy nhất: `recipes/{recipeId}/{Guid.NewGuid()}{ext}` ngăn chặn Path Traversal.<br>6. Gọi `IFileStorageService.UploadAsync` lưu ảnh gốc vào MinIO bucket `culinary-blog`.<br>7. Tạo bản ghi `RecipeImage` trong CSDL, nếu công thức chưa có ảnh nào thì gán `IsPrimary = true`.<br>8. Kích hoạt Hangfire Job: `BackgroundJob.Enqueue<ImageResizeJob>(x => x.ExecuteAsync(imageId))`.<br>9. Làm mới cache Redis và trả về `HTTP 201 Created` kèm `{ imageId, originalUrl, isPrimary }`.<br>**--- 2. ĐẶT ẢNH CHÍNH (PATCH) ---**<br>10. Gửi `PATCH /api/v1/recipes/{id}/images/{imageId}/primary`.<br>11. Đặt `IsPrimary = true` cho ảnh chỉ định, reset tất cả ảnh còn lại thành `false`. Trả về `HTTP 200 OK`.<br>**--- 3. XÓA ẢNH (DELETE) ---**<br>12. Gửi `DELETE /api/v1/recipes/{id}/images/{imageId}`.<br>13. Xóa bản ghi `RecipeImage` khỏi CSDL.<br>14. Đẩy tác vụ xóa tệp vật lý trên MinIO vào hàng đợi Hangfire (bất đồng bộ).<br>15. Nếu ảnh bị xóa là ảnh chính và công thức vẫn còn ảnh khác, tự động chọn ảnh kế tiếp làm ảnh chính.<br>16. Trả về `HTTP 204 No Content`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Dung lượng file vượt quá 5MB:** Trả về `HTTP 400 Bad Request` (`FILE_SIZE_EXCEEDED`).<br>**A2 – MIME Type hoặc Magic Bytes không hợp lệ:** Trả về `HTTP 400 Bad Request` kèm thông báo: *"Định dạng tệp tin không được hỗ trợ hoặc tệp tin bị lỗi"* (`FILE_MIME_INVALID`).<br>**A3 – MinIO gián đoạn kết nối:** Trả về `HTTP 503 Service Unavailable`.<br>**A4 – Không có quyền thao tác:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `POST /api/v1/recipes/{id:guid}/images`<br>`PATCH /api/v1/recipes/{id:guid}/images/{imageId:guid}/primary`<br>`DELETE /api/v1/recipes/{id:guid}/images/{imageId:guid}` |
| **Kết quả mong đợi** | Tệp tin ảnh được kiểm tra an toàn tuyệt đối trước khi lưu trữ, phân loại ảnh chính xác. |
| **Mã trạng thái HTTP** | `201 Created` (Tải lên thành công); `200 OK` (Cập nhật thành công); `204 No Content` (Xóa thành công); `400 Bad Request` (Tệp lỗi/vượt dung lượng); `403 Forbidden` (Không đủ quyền); `404 Not Found` (Không tìm thấy); `503 Service Unavailable` (Lỗi lưu trữ). |

---

#### FR-RCP-009: Quản lý Nguyên liệu Công thức (CRUD RecipeIngredient)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-009` |
| **Tên yêu cầu** | Quản lý Danh sách Nguyên liệu Công thức |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu công thức hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép thêm mới, cập nhật hoặc xóa từng nguyên liệu nấu ăn của công thức. Mỗi nguyên liệu gồm: `name` (tên nguyên liệu), `quantity` (định lượng), `unit` (đơn vị đo lường: gram, ml, muỗng...), `notes` (ghi chú tùy chọn), và `orderIndex` (thứ tự hiển thị). |
| **Điều kiện tiên quyết** | Công thức tồn tại và người dùng có quyền chỉnh sửa. |
| **Luồng chính (Happy Path)** | 1. **Thêm nguyên liệu:** Client gửi `POST /api/v1/recipes/{id}/ingredients` với body: `{ name, quantity, unit, notes, orderIndex }`. Kiểm tra tính hợp lệ, thêm vào bộ sưu tập của Recipe, lưu CSDL, trả về `HTTP 201 Created` kèm `RecipeIngredientDto`.<br>2. **Cập nhật nguyên liệu:** Client gửi `PUT /api/v1/recipes/{id}/ingredients/{ingId}` với các trường cần sửa. Tìm kiếm nguyên liệu, cập nhật, lưu CSDL, trả về `HTTP 200 OK`.<br>3. **Xóa nguyên liệu:** Client gửi `DELETE /api/v1/recipes/{id}/ingredients/{ingId}`. Xóa thực thể khỏi CSDL, trả về `HTTP 204 No Content`.<br>4. Mọi thao tác đều kích hoạt làm mới cache Redis công thức. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Dữ liệu không hợp lệ:** `name` để trống hoặc `quantity <= 0` -> Trả về `HTTP 400 Bad Request` (`VALIDATION_ERROR`).<br>**A2 – Không tìm thấy công thức hoặc nguyên liệu:** Trả về `HTTP 404 Not Found`.<br>**A3 – Không có quyền:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `POST /api/v1/recipes/{id:guid}/ingredients`<br>`PUT /api/v1/recipes/{id:guid}/ingredients/{ingId:guid}`<br>`DELETE /api/v1/recipes/{id:guid}/ingredients/{ingId:guid}` |
| **Kết quả mong đợi** | Danh sách nguyên liệu được cập nhật chính xác, đồng bộ bộ nhớ đệm. |
| **Mã trạng thái HTTP** | `201 Created` / `200 OK` / `204 No Content` (Thành công); `400 Bad Request` (Dữ liệu sai); `403 Forbidden` (Không có quyền); `404 Not Found` (Không tìm thấy). |

---

#### FR-RCP-010: Quản lý Các bước Thực hiện (CRUD RecipeStep)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-RCP-010` |
| **Tên yêu cầu** | Quản lý Các bước Hướng dẫn Nấu ăn |
| **Nhóm chức năng** | Module Quản lý Công thức Nấu ăn (`FR-RCP`) |
| **Tác nhân (Actor)** | Tác giả sở hữu công thức hoặc Quản trị viên (Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cho phép thêm, cập nhật hoặc xóa các bước thực hiện của công thức. Mỗi bước gồm: `stepNumber` (thứ tự bước, tự động tăng liên tục), `title` (tiêu đề bước ngắn), `description` (nội dung hướng dẫn chi tiết), `timerMinutes` (thời gian hẹn giờ nếu có), và `imageUrl` (ảnh minh họa bước). **Quy tắc nghiệp vụ renumbering:** Khi một bước ở giữa bị xóa, hệ thống **tự động đánh số lại** toàn bộ các bước còn lại theo dãy số tự nhiên liên tục ($1, 2, 3...$). |
| **Điều kiện tiên quyết** | Công thức tồn tại và người dùng có quyền chỉnh sửa. |
| **Luồng chính (Happy Path)** | 1. **Thêm bước:** Client gửi `POST /api/v1/recipes/{id}/steps` với body: `{ title, description, timerMinutes, imageUrl }`. Tính toán `stepNumber = max + 1`, lưu CSDL, trả về `HTTP 201 Created` kèm `RecipeStepDto`.<br>2. **Cập nhật bước:** Client gửi `PUT /api/v1/recipes/{id}/steps/{stepId}`. Tìm bước, cập nhật dữ liệu, lưu CSDL, trả về `HTTP 200 OK`.<br>3. **Xóa bước:** Client gửi `DELETE /api/v1/recipes/{id}/steps/{stepId}`. Xóa bước chỉ định, tự động cập nhật lại trường `StepNumber` của tất cả các bước phía sau để duy trì tính liên tục, lưu CSDL, trả về `HTTP 204 No Content`.<br>4. Làm mới bộ đệm Redis công thức tương ứng. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Mô tả bước để trống:** Trả về `HTTP 400 Bad Request`.<br>**A2 – Không tìm thấy bước:** Trả về `HTTP 404 Not Found`.<br>**A3 – Không có quyền:** Trả về `HTTP 403 Forbidden`. |
| **HTTP Method & Endpoint** | `POST /api/v1/recipes/{id:guid}/steps`<br>`PUT /api/v1/recipes/{id:guid}/steps/{stepId:guid}`<br>`DELETE /api/v1/recipes/{id:guid}/steps/{stepId:guid}` |
| **Kết quả mong đợi** | Các bước thực hiện được tổ chức thứ tự liên tục, chuẩn xác. |
| **Mã trạng thái HTTP** | `201 Created` / `200 OK` / `204 No Content` (Thành công); `400 Bad Request` (Dữ liệu sai); `403 Forbidden` (Không đủ quyền); `404 Not Found` (Không tìm thấy). |

---

### 3.4. Module Tìm kiếm và Phân trang (FR-SRCH)

#### FR-SRCH-001: Tìm kiếm Toàn văn bản (Full-Text Search)
| Trường thông tin | Đặc tả Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | `FR-SRCH-001` |
| **Tên yêu cầu** | Tìm kiếm Toàn văn bản Công thức Nấu ăn (Full-Text Search tiếng Việt) |
| **Nhóm chức năng** | Module Tìm kiếm và Phân trang (`FR-SRCH`) |
| **Tác nhân (Actor)** | Tất cả mọi người (Guest, Author, Admin) |
| **Mức ưu tiên (MoSCoW)** | **M – Must Have** |
| **Mô tả chức năng** | Cung cấp công cụ tìm kiếm toàn văn bản chuyên sâu tiếng Việt thông qua tính năng `tsvector`/`tsquery` của PostgreSQL kết hợp mở rộng `unaccent` (hỗ trợ tìm kiếm không dấu: gõ "pho bo" tìm được "Phở bò"). Cột `SearchVector` được đánh chỉ mục GIN tối ưu tốc độ. Kết quả trả về được xếp hạng theo mức độ liên quan thông qua hàm `ts_rank()`. **Quy tắc phân quyền tìm kiếm chuẩn hóa (SPEC.md):** Khách chỉ tìm thấy các bài viết đã xuất bản (`Published`). **Tác giả (Author) được phép tìm thấy cả các bài viết nháp (`Draft`) của chính mình** song song với các bài đã xuất bản. Admin tìm kiếm không giới hạn trạng thái. |
| **Điều kiện tiên quyết** | 1. Đã cài đặt extensions `unaccent` và `pg_trgm` trên PostgreSQL.<br>2. Từ khóa tìm kiếm `q` tối thiểu từ 2 ký tự trở lên. |
| **Luồng chính (Happy Path)** | 1. Client gửi `GET /api/v1/recipes/search?q=pho+bo&page=1&pageSize=10`.<br>2. `SearchRecipesQuery` kích hoạt qua MediatR.<br>3. Chuẩn hóa chuỗi tìm kiếm, sinh biểu thức `tsquery`: `"pho:* & bo:*"`.<br>4. Xây dựng câu truy vấn EF Core: `.Where(r => !r.IsDeleted && r.SearchVector.Matches(EF.Functions.ToTsQuery("vietnamese", query)))`.<br>5. Áp dụng bộ lọc phân quyền: Khách -> `r.Status == Published`; Tác giả -> `r.Status == Published || (r.Status == Draft && r.AuthorId == currentUserId)`; Admin -> Tất cả.<br>6. Sắp xếp kết quả giảm dần theo độ phù hợp: `.OrderByDescending(r => EF.Functions.ToTsRank(r.SearchVector, query))`.<br>7. Phân trang và ánh xạ sang `PagedResult<RecipeSummaryDto>` đính kèm điểm tương quan `relevanceScore`.<br>8. Trả về `HTTP 200 OK`. |
| **Luồng thay thế & Ngoại lệ** | **A1 – Từ khóa tìm kiếm rỗng hoặc dưới 2 ký tự:** Trả về `HTTP 400 Bad Request` (`VALIDATION_ERROR`).<br>**A2 – Không có kết quả phù hợp:** Trả về `HTTP 200 OK` với `items: []` và thông điệp gợi ý tìm kiếm.<br>**A3 – Chứa ký tự phá vỡ cú pháp:** Hệ thống tự động sanitize loại bỏ ký tự lạ trước khi gọi `tsquery`. |
| **HTTP Method & Endpoint** | `GET /api/v1/recipes/search?q={searchTerm}&page={n}&pageSize={n}` |
| **Kết quả mong đợi** | Nhận danh sách công thức phù hợp xếp hạng theo độ liên quan, tác giả tìm thấy bài nháp của mình. |
| **Mã trạng thái HTTP** | `200 OK` (Thành công); `400 Bad Request` (Từ khóa không hợp lệ). |

---

#### FR-SRCH-002/003/004: Lọc, Sắp xếp và Phân trang
Các yêu cầu lọc, sắp xếp và phân trang được tích hợp đồng bộ vào toàn bộ các endpoints danh sách (`FR-RCP-001` và `FR-SRCH-001`):

| Mã yêu cầu | Tên chức năng | Tham số Query | Cơ chế Xử lý & Đặc tả |
| :--- | :--- | :--- | :--- |
| **FR-SRCH-002** | **Bộ lọc Đa tiêu chí** | `categoryId={guid}`<br>`difficulty={Easy\|Medium\|Hard\|Expert}`<br>`maxCookTime={minutes}`<br>`minServings={n}` | Lọc kết hợp nhiều tiêu chí theo logic `AND`. Bỏ qua các tham số `null`. Mọi điều kiện lọc đều vận hành trên các cột đã được đánh chỉ mục B-Tree để tối ưu hóa hiệu năng truy vấn. |
| **FR-SRCH-003** | **Sắp xếp Kết quả** | `sort={field}`<br>Ví dụ:<br>`sort=-createdAt` (mới nhất)<br>`sort=cookTime` (nấu nhanh nhất)<br>`sort=title` (A-Z) | Tiền tố dấu trừ `-` quy ước sắp xếp giảm dần (DESC), không có tiền tố quy ước sắp xếp tăng dần (ASC). Thứ tự mặc định của toàn hệ thống là `sort=-createdAt` (ưu tiên hiển thị các bài viết mới nhất). |
| **FR-SRCH-004** | **Phân trang Linh hoạt** | `page={n}` (Mặc định: 1)<br>`pageSize={n}` (Mặc định: 12, Tối đa: 50) | Áp dụng phân trang dựa trên OFFSET/LIMIT (`Skip`/`Take`). Cấu trúc phản hồi `PagedResult<T>` bao gồm: `items: []`, `totalCount`, `page`, `pageSize`, `totalPages`, `hasNextPage`, `hasPreviousPage`. |

---

### 3.5. Module Quản lý Tệp tin (FR-FILE)

Hệ thống quản lý tệp tin nhị phân dựa trên hệ thống lưu trữ đối tượng MinIO tương thích chuẩn AWS S3 API. Tầng Application tương tác thông qua giao diện trừu tượng `IFileStorageService` cho phép dễ dàng hoán đổi nhà cung cấp lưu trữ (MinIO, AWS S3, Azure Blob) mà không làm biến động mã nguồn nghiệp vụ.

| Mã FR | Tên chức năng | Mô tả Xử lý Kỹ thuật | Ràng buộc Bảo mật & Hiệu năng |
| :--- | :--- | :--- | :--- |
| **FR-FILE-001** | **Proxy Upload File lên MinIO** | `IFileStorageService.UploadAsync(fileStream, path, contentType, ct) -> string`. Backend đóng vai trò Proxy tiếp nhận tệp, tạo đường dẫn định danh duy nhất `{folder}/{Guid.NewGuid()}{extension}` để chống Path Traversal và ghi đè tệp. Trả về URL công khai truy cập ảnh. | - Kích thước tối đa: 5 MB.<br>- MIME Types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.<br>- **Bắt buộc đọc Magic Bytes**.<br>- Bucket: `culinary-blog` (Policy `public-read`). |
| **FR-FILE-002** | **Xóa File khỏi MinIO** | `IFileStorageService.DeleteAsync(fileUrl, ct)`. Trích xuất Object Name từ URL và gọi lệnh `RemoveObjectAsync`. Thường được thực thi bất đồng bộ thông qua Hangfire Background Job sau khi xóa ảnh hoặc xóa công thức. | - Thao tác mang tính Idempotent (không ném lỗi nếu tệp không còn tồn tại trên MinIO).<br>- Tự động kích hoạt cơ chế Retry tối đa 3 lần nếu xảy ra sự cố ngắt kết nối mạng. |

---

### 3.6. Module Background Jobs (FR-JOB)

Các tác vụ nền không đồng bộ được điều phối tập trung bởi thư viện **Hangfire** chạy in-process trong ứng dụng .NET API và sử dụng PostgreSQL làm kho lưu trữ hàng đợi bền bỉ. Bảng điều khiển quản trị trực quan tại đường dẫn `/hangfire` được bảo vệ nghiêm ngặt chỉ dành cho `Admin`.

| Mã FR | Tên Job | Phân loại | Điều kiện Kích hoạt | Mô tả Chi tiết Nghiệp vụ | Chính sách Thử lại (Retry Policy) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **FR-JOB-001** | **Welcome Email Job** | Fire-and-Forget | Sau khi `FR-AUTH-001` đăng ký tài khoản thành công. | Soạn và gửi email HTML chào mừng đến địa chỉ hòm thư người dùng vừa đăng ký. Mẫu email cá nhân hóa với `displayName`, thư viện gửi mail tích hợp MailKit/SMTP. | Tự động thử lại 3 lần với thuật toán giãn cách số mũ (Exponential Backoff: 1 phút, 5 phút, 30 phút). Nếu sau 3 lần vẫn thất bại, chuyển trạng thái `Failed` và ghi log cảnh báo. |
| **FR-JOB-002** | **Image Resize & Thumbnail Job** | Fire-and-Forget | Sau khi `FR-RCP-008` tải ảnh gốc lên MinIO thành công. | Tiếp nhận ảnh gốc, sử dụng thư viện xử lý ảnh (SkiaSharp / ImageSharp) sinh ra 2 phiên bản tối ưu: **Medium (800x600px)** cho nội dung bài viết và **Thumbnail (300x300px)** cho danh thiếp xem trước. Lưu 2 bản mới lên MinIO và cập nhật URL vào CSDL. | Tự động thử lại tối đa 3 lần. Nếu tác vụ thất bại, ảnh gốc vẫn hiển thị bình thường trên giao diện nhằm đảm bảo trải nghiệm người dùng không bị đứt đoạn. |
| **FR-JOB-003** | **Sitemap Generation Job** | Recurring (Định kỳ) | Lịch định kỳ chạy hàng ngày lúc **02:00 AM UTC** (`cron: "0 2 * * *"`). | Truy vấn toàn bộ danh sách các công thức `Published`, các danh mục ẩm thực và các trang tĩnh; tự động biên soạn thành tệp `sitemap.xml` chuẩn SEO quốc tế. Lưu tệp vào `wwwroot` hoặc đẩy lên MinIO và tự động ping thông báo đến máy chủ tìm kiếm Google Search Console. | Thử lại 2 lần nếu gặp sự cố. Ghi lại kết quả tổng số URL được lập chỉ mục vào Serilog. |

---

### 3.7. Module Quan sát Hệ thống (FR-OBS)

Hệ thống thiết lập nền tảng Quan sát (Observability) toàn diện dựa trên 3 trụ cột: **Logs** (Serilog), **Metrics** (OpenTelemetry) và **Traces** (OpenTelemetry):

| Mã FR | Tên chức năng | Mô tả Xử lý Kỹ thuật | Công cụ & Cấu hình Thực thi |
| :--- | :--- | :--- | :--- |
| **FR-OBS-001** | **Health Check Endpoints** | Cung cấp 3 cổng kiểm tra sức khỏe độc lập:<br>1. `GET /health`: Báo cáo tổng thể tình trạng sống của ứng dụng và toàn bộ kết nối phụ thuộc (Database, Redis, MinIO).<br>2. `GET /health/live`: Liveness Probe chỉ kiểm tra tiến trình .NET còn hoạt động hay không.<br>3. `GET /health/ready`: Readiness Probe kiểm tra sẵn sàng tiếp nhận traffic (kết nối CSDL và Redis thông suốt). | - `Microsoft.Extensions.Diagnostics.HealthChecks`<br>- `AspNetCore.HealthChecks.NpgSql`<br>- `AspNetCore.HealthChecks.Redis`<br>- `AspNetCore.HealthChecks.Minio`<br>- Nếu Readiness fail -> Nginx/Kubernetes tự động ngắt điều phối traffic đến node lỗi. |
| **FR-OBS-002** | **Structured Logging** | Mọi yêu cầu HTTP gửi đến API đều được ghi lại nhật ký dạng JSON có cấu trúc gồm: `CorrelationId` (từ header `X-Correlation-ID` hoặc sinh mới), đường dẫn `RequestPath`, mã trạng thái HTTP, thời gian thực thi `ElapsedMilliseconds`, và định danh `UserId`. `LoggingBehavior` trong MediatR tự động log các tham số của Command/Query. Tự động bật cảnh báo hiệu năng khi thời gian xử lý vượt quá 500ms. | - Thư viện: **Serilog**.<br>- Sinks: Console (JSON), File rolling theo ngày, và đẩy trực tiếp lên Seq Server qua HTTP OTLP.<br>- Log Levels: Debug (Development), Information (Production), Warning/Error (Mọi môi trường). |
| **FR-OBS-003** | **Distributed Tracing & Metrics** | Tích hợp OpenTelemetry thu thập vết phân tán xuyên suốt các luồng xử lý: Cuộc gọi HTTP đến API, các câu lệnh truy vấn Entity Framework Core tới PostgreSQL, và các thao tác lưu trữ tệp tin. Giá trị `TraceId` được gắn kết tương quan vào bản ghi Log của Serilog. Đo lường các chỉ số hiệu năng: Số lượng yêu cầu/giây, biểu đồ thời gian phản hồi, và tỷ lệ lỗi. | - OpenTelemetry .NET SDK.<br>- OTLP Exporter đẩy dữ liệu giám sát về Seq (môi trường Dev) hoặc Grafana Tempo / Jaeger (môi trường Production). |

---

# CHƯƠNG 4. YÊU CẦU PHI CHỨC NĂNG (NFR)

Toàn bộ các thuộc tính chất lượng của hệ thống được xây dựng và chuẩn hóa định lượng theo mô hình **ISO/IEC 25010 (FURPS+)**:

| Mã Nhóm NFR | Phân loại Thuộc tính | Số lượng Yêu cầu | Mức độ Ưu tiên |
| :--- | :--- | :---: | :---: |
| **NFR-PERF** | Hiệu năng (Performance Efficiency) | 5 | **Cao** |
| **NFR-SEC** | An toàn & Bảo mật (Security) | 7 | **Rất cao** |
| **NFR-USE** | Khả năng Sử dụng & Trải nghiệm (Usability) | 4 | **Trung bình** |
| **NFR-REL** | Độ tin cậy & Ổn định (Reliability) | 3 | **Cao** |
| **NFR-MAINT** | Khả năng Bảo trì & Chất lượng Mã (Maintainability) | 4 | **Trung bình** |
| **NFR-SCALE** | Khả năng Mở rộng (Scalability) | 3 | **Cao** |
| **NFR-SEO** | Tối ưu hóa Máy tìm kiếm (Search Engine Optimization) | 4 | **Cao** |

---

### 4.1. Hiệu năng (NFR-PERF)

| Mã Yêu cầu | Tên Tiêu chí | Ngưỡng Đo lường Định lượng & Quy tắc Kỹ thuật |
| :--- | :--- | :--- |
| **NFR-PERF-001** | **Thời gian Phản hồi API (Response Time)** | Đo lường trên môi trường chịu tải thực tế với bộ nhớ đệm hoạt động hiệu quả:<br>- **Phân vị 50 (p50):** $\le 150$ ms đối với toàn bộ các truy vấn `GET` có áp dụng Cache.<br>- **Phân vị 95 (p95):** $\le 500$ ms đối với tất cả các API endpoints (bao gồm cả các thao tác ghi dữ liệu).<br>- **Phân vị 99 (p99):** $\le 1000$ ms, không vượt quá 1 giây trong mọi tình huống vận hành thông thường.<br>*Công cụ đo lường:* k6 Load Testing script kết hợp Dashboard giám sát OpenTelemetry / Grafana. |
| **NFR-PERF-002** | **Năng lực Xử lý Đồng thời (Throughput)** | Hệ thống xử lý mượt mà tối thiểu **100 người dùng đồng thời (Concurrent Users)** trên cấu hình máy chủ đơn 2 vCPU, 4GB RAM mà không xảy ra hiện tượng suy giảm hiệu năng (Degradation) hay rơi rớt kết nối. |
| **NFR-PERF-003** | **Hiệu quả Bộ nhớ đệm (Cache Effectiveness)** | Tỷ lệ trúng bộ nhớ đệm Redis (Cache Hit Rate) đạt tối thiểu **$\ge 80\%$** ở trạng thái vận hành ổn định.<br>- Danh sách danh mục: TTL = 60 phút.<br>- Chi tiết công thức: Output Cache TTL = 60 phút.<br>- Kết quả danh sách công thức: Output Cache TTL = 15 phút.<br>- Cơ chế làm mới cache: Event-Driven dựa trên Cache Tag Eviction ngay khi có thao tác Create/Update/Delete. |
| **NFR-PERF-004** | **Tối ưu Truy vấn Cơ sở Dữ liệu** | - **Triệt tiêu hoàn toàn lỗi N+1 Query:** Bắt buộc sử dụng `.Include()`/`.ThenInclude()` hoặc Projection DTO trực tiếp trong LINQ.<br>- Mọi cột tham gia vào mệnh đề `WHERE` hoặc `ORDER BY` bắt buộc phải có chỉ mục B-Tree hoặc GIN tương ứng.<br>- Tự động ghi log cảnh báo hiệu năng đối với các truy vấn chậm (Slow Queries $> 100$ ms). Toàn bộ truy vấn mới phải vượt qua phân tích `EXPLAIN ANALYZE` trước khi merge mã nguồn. |
| **NFR-PERF-005** | **Hiệu năng Frontend (Core Web Vitals)** | Next.js 15 Frontend bắt buộc vượt qua kiểm thử tự động Lighthouse CI:<br>- **LCP (Largest Contentful Paint):** $\le 2.5$ giây.<br>- **CLS (Cumulative Layout Shift):** $\le 0.1$.<br>- **INP (Interaction to Next Paint):** $\le 200$ ms.<br>- Kích thước First Load JavaScript Bundle $\le 200$ KB (đã gzipped) nhờ áp dụng kỹ thuật Code Splitting và tối ưu hóa hình ảnh thông qua component `next/image`. |

---

### 4.2. Bảo mật (NFR-SEC)

Hệ thống tuân thủ toàn diện các khuyến nghị bảo mật **OWASP Top 10:2021**:

| Mã Yêu cầu | Tên Tiêu chí | Giải pháp Hiện thực & Quy chuẩn Kỹ thuật |
| :--- | :--- | :--- |
| **NFR-SEC-001** | **Băm và Bảo vệ Mật khẩu** | Mật khẩu người dùng được băm an toàn thông qua ASP.NET Core Identity sử dụng thuật toán **PBKDF2-HMACSHA512** với số vòng lặp tối thiểu $\ge 100.000$ iterations. Tuyệt đối không lưu mật khẩu dạng bản rõ (plaintext). Yêu cầu độ phức tạp: Tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt. |
| **NFR-SEC-002** | **Bảo mật Token Xác thực (XSS Defense)** | - **Access Token:** Ký số HS256, thời hạn 15 phút, trả về trong JSON body và chỉ lưu trữ tại bộ nhớ RAM (In-Memory) của ứng dụng Frontend.<br>- **Refresh Token:** Chuỗi ngẫu nhiên bảo mật 128-bit, băm SHA-256 trước khi lưu vào CSDL, thời hạn 7 ngày.<br>- **Kênh truyền an toàn (SPEC.md): BẮT BUỘC đặt trong `HttpOnly`, `Secure`, `SameSite=Strict` Cookie** với đường dẫn giới hạn `Path=/api/v1/auth`. Trình duyệt tự động gửi cookie, JavaScript hoàn toàn không thể truy cập, vô hiệu hóa nguy cơ bị đánh cắp qua tấn công XSS.<br>- **Token Rotation & Reuse Detection:** Thu hồi token cũ ngay khi cấp mới; nếu phát hiện token đã thu hồi được sử dụng lại, lập tức vô hiệu hóa toàn bộ phiên đăng nhập của người dùng đó. |
| **NFR-SEC-003** | **Kiến trúc Giới hạn Tần suất Yêu cầu (Two-Tier Rate Limiting)** | Hệ thống phân định rõ **2 tầng Rate Limiting chuyên biệt (SPEC.md):**<br>1. **Tầng 1 - Nginx (Hạ tầng mạng / L7):** Giới hạn thô chống tấn công DDoS trên quy mô toàn cục: Tối đa 300 requests/phút/IP cho toàn bộ traffic tĩnh và động.<br>2. **Tầng 2 - ASP.NET Core Middleware + Redis (Tầng Ứng dụng):** Giới hạn tinh chi tiết theo từng Endpoint nghiệp vụ:<br>&nbsp;&nbsp;&nbsp;&nbsp;• Nhóm xác thực (`/api/v1/auth/*`): Tối đa **10 requests/phút/IP** (Sliding Window chống Brute Force).<br>&nbsp;&nbsp;&nbsp;&nbsp;• Nhóm tải tệp tin (`/images`): Tối đa **5 requests/phút/IP**.<br>&nbsp;&nbsp;&nbsp;&nbsp;• Toàn bộ API chung: Tối đa **100 requests/phút/IP**.<br>Bộ đếm lưu trên Redis đảm bảo hoạt động đồng nhất giữa nhiều instance. Khi vượt ngưỡng, trả về mã `HTTP 429 Too Many Requests` kèm Header `Retry-After`. |
| **NFR-SEC-004** | **Kiểm tra Đầu vào & An toàn Tải tệp (Magic Bytes)** | - **Chống SQL Injection:** 100% truy vấn qua EF Core tham số hóa (Parameterized Queries).<br>- **Chống XSS:** Làm sạch dữ liệu đầu vào (Input Sanitization), mã hóa HTML khi render, thiết lập HTTP Header `Content-Security-Policy`.<br>- **Bảo mật Tải tệp (SPEC.md):** Kiểm tra tệp tin chặt chẽ qua Backend Proxy. Bắt buộc kiểm tra **Magic Bytes** xác minh định dạng tệp thực tế; đặt tên tệp bằng UUID ngẫu nhiên để chống tấn công Path Traversal. |
| **NFR-SEC-005** | **Giao thức Truyền thông HTTPS & Chính sách CORS** | - Toàn bộ dữ liệu truyền tải trên môi trường Production bắt buộc qua giao thức **HTTPS (TLS 1.2 trở lên)**; thiết lập Header `Strict-Transport-Security (HSTS)` với thời hạn tối thiểu 1 năm (`max-age=31536000`).<br>- **CORS Policy nghiêm ngặt:** Chỉ cho phép các Origins được cấu hình cụ thể trong `appsettings.json` (tuyệt đối không sử dụng ký tự đại diện `*`). Hỗ trợ cờ `AllowCredentials` để truyền nhận Cookie an toàn giữa Next.js và .NET API. |
| **NFR-SEC-006** | **Kiểm soát Quyền Sở hữu Tài nguyên** | Kiểm tra quyền truy cập nghiêm ngặt tại tầng Application: `RecipeAuthorizationHandler` xác thực quyền sở hữu tài nguyên (`AuthorId == currentUserId`). Tác giả chỉ có quyền chỉnh sửa, chuyển trạng thái hoặc xóa bài viết do chính mình tạo ra. Mọi thao tác ghi nhạy cảm đều được ghi vết nhật ký kiểm toán (Audit Trail) gồm `UserId` và mốc thời gian. |
| **NFR-SEC-007** | **Quản lý Thông tin Nhạy cảm (Secrets Management)** | Tuyệt đối không lưu trữ khóa bảo mật (JWT Secret Keys, Database Passwords, S3 Keys) trong mã nguồn Git:<br>- Môi trường phát triển: Sử dụng .NET User Secrets (`dotnet user-secrets`).<br>- Môi trường triển khai: Truyền thông qua Environment Variables của Docker Compose hoặc công cụ quản lý bí mật chuyên dụng. Khuyến nghị định kỳ luân chuyển (Rotate) JWT Signing Key mỗi 90 ngày. |

---

### 4.3. Khả năng Sử dụng (NFR-USE)

| Mã Yêu cầu | Tên Tiêu chí | Đặc tả Chi tiết Trải nghiệm Người dùng |
| :--- | :--- | :--- |
| **NFR-USE-001** | **Thiết kế Đáp ứng Toàn diện (Responsive Design)** | Giao diện Next.js hiển thị chuẩn xác, tối ưu trên mọi kích thước màn hình:<br>- **Mobile:** $320\text{px} - 767\text{px}$ (Bố cục 1 cột, vùng chạm ngón tay tối thiểu $44\times 44\text{px}$).<br>- **Tablet:** $768\text{px} - 1199\text{px}$ (Lưới hiển thị 2 cột linh hoạt).<br>- **Desktop:** $\ge 1200\text{px}$ (Giao diện chuẩn đầy đủ, tối ưu không gian đọc nội dung nấu ăn).<br>Hiện thực thông qua Tailwind CSS utility-first, kiểm thử trên Chrome DevTools và BrowserStack. |
| **NFR-USE-002** | **Tiêu chuẩn Khả năng Tiếp cận (Accessibility - a11y)** | Tuân thủ các nguyên tắc cốt lõi của chuẩn **WCAG 2.1 Level AA**:<br>- Cấu trúc HTML5 ngữ nghĩa chuẩn xác (`<main>`, `<article>`, `<nav>`, `<aside>`).<br>- Đầy đủ thuộc tính `aria-label`, `aria-expanded` trên các nút tương tác.<br>- Hỗ trợ điều hướng hoàn chỉnh bằng bàn phím (phím `Tab`, `Enter`, `Escape`).<br>- Độ tương phản màu sắc văn bản đạt tỷ lệ chuẩn $\ge 4.5:1$. Kiểm thử tương thích với trình đọc màn hình NVDA và VoiceOver. |
| **NFR-USE-003** | **Thông báo Lỗi Trực quan & Hành động (Actionable Errors)** | Thông báo lỗi phía Client được thể hiện rõ ràng, chính xác vị trí phát sinh:<br>- Lỗi nhập liệu Form: Hiển thị thông báo đỏ ngay dưới chân trường dữ liệu vi phạm (sử dụng React Hook Form + Zod).<br>- Lỗi hệ thống máy chủ (5xx): Hiển thị giao diện thông báo lỗi thân thiện, cung cấp nút "Thử lại", tuyệt đối không hiển thị mã lỗi lập trình hay chi tiết nội bộ hệ thống. |
| **NFR-USE-004** | **Phản hồi Trạng thái Tải trang (Loading Feedback)** | Mọi thao tác bất đồng bộ đều có phản hồi thị giác tức thì cho người dùng:<br>- Tải dữ liệu trang: Sử dụng Skeleton Loading mô phỏng khung bài viết, loại bỏ màn hình trắng giật cục.<br>- Tải lên tệp ảnh: Hiển thị thanh tiến trình (Progress Bar) phần trăm thời gian thực.<br>- Thao tác ghi dữ liệu: Cập nhật lạc quan (Optimistic Updates) trên UI và hiển thị thông báo Toast xác nhận kết quả. |

---

### 4.4. Độ tin cậy (NFR-REL)

| Mã Yêu cầu | Tên Tiêu chí | Ngưỡng Định lượng & Giải pháp Kỹ thuật |
| :--- | :--- | :--- |
| **NFR-REL-001** | **Thời gian Vận hành Khả dụng (Uptime SLA)** | Hệ thống đạt chỉ số khả dụng tối thiểu **$\ge 99.5\%$** (tương đương tổng thời gian gián đoạn dịch vụ không quá 3.65 giờ trong cả năm, không tính bảo trì định kỳ đã thông báo trước 48 giờ). Giám sát tự động qua cổng `/health/ready` với chu kỳ 10 giây/lần. Gửi cảnh báo tức thời qua Slack/Telegram khi hệ thống mất phản hồi quá 1 phút. |
| **NFR-REL-002** | **Xử lý Sự cố & Khả năng Phục hồi (Resilience)** | Hệ thống tự động xử lý và phục hồi êm dịu khi gặp sự cố:<br>- **Global Exception Middleware:** Thu giữ mọi biệt lệ chưa được xử lý, ghi vết đầy đủ và trả về cấu trúc lỗi chuẩn RFC 7807, ngăn chặn sập tiến trình máy chủ.<br>- **Phục hồi CSDL:** Cơ chế Npgsql Connection Pool tự động thử lại kết nối khi mạng chập chờn (timeout 30s).<br>- **Phục hồi Redis:** Nếu Redis gặp sự cố, tự động phân rã êm dịu đọc trực tiếp từ PostgreSQL.<br>- **Hangfire Retry:** Tự động thử lại tác vụ thất bại tối đa 3 lần với thuật toán lùi số mũ. |
| **NFR-REL-003** | **Bảo toàn Dữ liệu & Soft Delete** | - Áp dụng cơ chế ghi nhật ký trước thao tác (WAL - Write-Ahead Logging) của PostgreSQL đảm bảo nguyên tắc toàn vẹn giao dịch ACID.<br>- Định kỳ sao lưu dữ liệu tự động (`pg_dump`) hàng ngày lúc 03:00 AM UTC, lưu trữ luân phiên trong 30 ngày.<br>- Toàn bộ tệp tin MinIO được mount vào các Docker Persistent Volumes an toàn.<br>- **Cơ chế Soft Delete chuẩn hóa:** Dữ liệu công thức và danh mục bị xóa chỉ được gắn cờ `IsDeleted = true`, cho phép phục hồi khi có yêu cầu khôi phục do thao tác nhầm lẫn. |

---

### 4.5. Khả năng Bảo trì (NFR-MAINT)

| Mã Yêu cầu | Tên Tiêu chí | Quy chuẩn Kỹ thuật Bắt buộc |
| :--- | :--- | :--- |
| **NFR-MAINT-001** | **Chất lượng Mã nguồn (Code Quality)** | Toàn bộ mã nguồn phải vượt qua công cụ phân tích tĩnh (Static Code Analysis) trên luồng CI/CD trước khi được phép sáp nhập:<br>- Backend: SonarAnalyzer, StyleCop, tuân thủ tệp cấu hình `.editorconfig`. Không cho phép tồn tại cảnh báo biên dịch (Compiler Warnings).<br>- Frontend: ESLint cấu hình theo chuẩn của Next.js và Airbnb, định dạng mã tự động bằng Prettier.<br>- Quy trình bắt buộc: Mỗi Pull Request phải có tối thiểu 1 thành viên review và phê duyệt. |
| **NFR-MAINT-002** | **Độ phủ Kiểm thử Tự động (Test Coverage)** | Mức độ bao phủ kiểm thử tự động của hệ thống:<br>- **Unit Tests:** Đạt độ phủ tối thiểu **$\ge 80\%$** đối với toàn bộ các Command, Query Handlers và Validators tại tầng Application.<br>- **Integration Tests:** 100% các API Endpoints phải có ít nhất 1 test case luồng thành công (Happy Path) và 1 test case xử lý lỗi ngoại lệ.<br>- **E2E Tests:** Kiểm thử tự động (Playwright) cho 5 luồng trải nghiệm người dùng trọng yếu: Đăng ký, Đăng nhập, Tạo công thức, Xuất bản công thức và Tìm kiếm. |
| **NFR-MAINT-003** | **Tài liệu Kỹ thuật Tự động** | - Tài liệu khởi tạo môi trường `README.md` rõ ràng, cho phép lập trình viên mới dựng toàn bộ dự án qua Docker Compose trong thời gian dưới 5 phút.<br>- Tài liệu API được biên soạn tự động từ XML Comments mã nguồn kết hợp công cụ Scalar/Swagger UI tại đường dẫn `/scalar`.<br>- Ghi nhận các quyết định kiến trúc quan trọng thông qua các bản ghi Architecture Decision Records (ADR). |
| **NFR-MAINT-004** | **Tuân thủ Clean Architecture** | Giám sát chặt chẽ nguyên tắc phụ thuộc của Clean Architecture:<br>- Tầng `Domain` tuyệt đối không phụ thuộc vào bất kỳ tầng nào khác và không chứa gói NuGet ngoài .NET BCL.<br>- Tầng `Application` chỉ phụ thuộc duy nhất vào tầng `Domain`.<br>- Tầng `Infrastructure` hiện thực các giao diện trừu tượng của `Domain`/`Application`.<br>- Đảm bảo quy tắc này thông qua các bài kiểm thử kiến trúc tự động bằng thư viện `ArchUnit.NET`. |

---

### 4.6. Khả năng Mở rộng (NFR-SCALE)

| Mã Yêu cầu | Tên Tiêu chí | Giải pháp Kiến trúc Định hướng |
| :--- | :--- | :--- |
| **NFR-SCALE-001** | **Backend Phi trạng thái (Stateless Backend)** | Tầng API Backend được thiết kế phi trạng thái 100% phục vụ khả năng mở rộng ngang (Horizontal Scaling):<br>- Xác thực người dùng hoàn toàn qua chữ ký JWT và Refresh Token trong CSDL (không lưu trữ Session tại bộ nhớ RAM máy chủ API).<br>- Toàn bộ trạng thái chia sẻ (Shared State) và bộ đệm đều lưu trữ tập trung trên **Redis**, không sử dụng bộ nhớ cục bộ `IMemoryCache`.<br>- Sử dụng khóa phân tán RedLock cho các tác vụ đơn nhất (Singleton Jobs).<br>- Tác vụ nền Hangfire hỗ trợ mở rộng nhiều Worker Servers phân tán chung hàng đợi PostgreSQL. |
| **NFR-SCALE-002** | **Mở rộng Cơ sở Dữ liệu (Phân kỳ Triển khai)** | - **Giai đoạn Hiện tại (MVP):** Tối ưu hóa Connection Pooling tích hợp sẵn của Npgsql (mặc định 100 connections/instance), đánh chỉ mục B-Tree và GIN chuẩn xác.<br>- **Lộ trình Mở rộng Tương lai (Roadmap):** Thiết lập phân tách luồng đọc/ghi (Read Replicas) sử dụng `IDbContextFactory`; áp dụng cơ chế phân vùng bảng (Table Partitioning) cho bảng `Recipes` theo khoảng thời gian `CreatedAt` khi dữ liệu vượt ngưỡng 1 triệu bản ghi. |
| **NFR-SCALE-003** | **Mở rộng Hạ tầng (Infrastructure Scalability)** | - Mỗi dịch vụ hệ thống được đóng gói trong một Docker Container riêng biệt.<br>- Nginx đóng vai trò Load Balancer điều phối tải trọng tới nhiều container API phía sau.<br>- Kho lưu trữ MinIO sẵn sàng chuyển đổi sang chế độ phân tán nhiều node (Distributed Mode 4+ nodes) hoặc đồng bộ sang AWS S3 thương mại.<br>- Toàn bộ tài nguyên tĩnh của Next.js 15 (`_next/static`) sẵn sàng phân phối qua mạng phân phối nội dung CDN (Cloudflare). |

---

### 4.7. Tối ưu SEO (NFR-SEO)

| Mã Yêu cầu | Tên Tiêu chí | Quy chuẩn Hiện thực SEO Quốc tế |
| :--- | :--- | :--- |
| **NFR-SEO-001** | **Dữ liệu có Cấu trúc Schema.org Recipe** | Mỗi trang chi tiết công thức nấu ăn **bắt buộc nhúng mã JSON-LD chuẩn `Schema.org/Recipe`** bao gồm đầy đủ các thuộc tính: `@type: "Recipe"`, `name`, `description`, `image`, `author`, `datePublished`, `prepTime`, `cookTime`, `totalTime`, `recipeYield`, `recipeIngredient[]`, `recipeInstructions[]`, và bảng dinh dưỡng `nutrition`. Bắt buộc vượt qua 100% bài kiểm tra Google Rich Results Test để hiển thị công thức trực quan (Rich Snippets) trên trang kết quả tìm kiếm Google. |
| **NFR-SEO-002** | **Thẻ Meta & Giao thức Open Graph** | Mỗi trang web công khai đều có đầy đủ các thẻ siêu dữ liệu tối ưu:<br>- Thẻ `<title>`: `"{Tên công thức} | Culinary Blog"` ($\le 60$ ký tự).<br>- Thẻ `<meta name="description">`: Mô tả ngắn hấp dẫn ($150 - 160$ ký tự).<br>- Thẻ Open Graph (`og:title`, `og:description`, `og:image` kích thước chuẩn $1200\times 630\text{px}$, `og:url`, `og:type`).<br>- Thẻ Twitter Card: `summary_large_image`.<br>- Thẻ `canonical`: Chỉ định URL chính tắc dạng slug để triệt tiêu vấn đề trùng lặp nội dung.<br>- Thẻ `robots`: Gán cờ `index, follow` cho bài viết đã xuất bản và `noindex` cho bài viết nháp/lưu trữ. |
| **NFR-SEO-003** | **Tự động Hóa Sitemap XML & Robots.txt** | - File sơ đồ trang web `sitemap.xml` được sinh tự động định kỳ hàng ngày bởi tác vụ Hangfire `FR-JOB-003`, bao gồm toàn bộ URL công thức `Published`, các trang danh mục và trang tĩnh kèm các thuộc tính `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`.<br>- Tự động ping thông báo tới Google Search Console mỗi khi sitemap được cập nhật mới.<br>- Tệp `robots.txt` khai báo đường dẫn tới sitemap và điều phối quyền thu thập dữ liệu của các bot tìm kiếm. |
| **NFR-SEO-004** | **Cấu trúc Đường dẫn Thân thiện (Slug-Based URLs)** | - Đường dẫn công thức: `/recipes/{slug}` – `slug` viết chữ thường, không dấu tiếng Việt, phân tách bằng dấu gạch nối (ví dụ: `/recipes/cach-nau-pho-bo-ha-noi`).<br>- Đường dẫn danh mục: `/categories/{slug}`.<br>- **Quy tắc bảo toàn liên kết:** `slug` được sinh tự động từ tiêu đề và giữ cố định không đổi sau khi bài viết được xuất bản lần đầu tiên nhằm tránh gãy liên kết ngoài. |

---

# CHƯƠNG 5. YÊU CẦU GIAO DIỆN NGOÀI

### 5.1. Giao diện Người dùng (UI - Next.js 15)
Hệ thống cung cấp giao diện web hiện đại xây dựng trên nền tảng **Next.js 15 App Router**, kết hợp tối ưu giữa kết xuất phía máy chủ (SSR), tái tạo tĩnh định kỳ (ISR) và tương tác máy khách (CSR):

| Màn hình / Tuyến đường (Route) | Mô tả Chức năng Giao diện | Phương thức Render | Yêu cầu Xác thực |
| :--- | :--- | :---: | :---: |
| `/` | Trang chủ: Banner chào mừng, danh sách công thức nổi bật, danh mục món ăn thịnh hành và thanh tìm kiếm nhanh. | **ISR** (`revalidate = 3600s`) | Không |
| `/recipes` | Danh sách công thức: Hiển thị lưới bài viết, tích hợp bộ lọc danh mục/độ khó, công cụ sắp xếp và phân trang. | **SSR** (Dynamic Rendering) | Không |
| `/recipes/[slug]` | Chi tiết công thức: Toàn bộ thông tin chế biến, bộ sưu tập ảnh, danh sách nguyên liệu, các bước làm, nhúng JSON-LD Recipe. | **ISR** (`revalidate = 300s`) | Không |
| `/categories` | Danh sách danh mục món ăn: Trình bày dạng thẻ trực quan kèm số lượng món ăn tương ứng. | **ISR** (`revalidate = 3600s`) | Không |
| `/categories/[slug]` | Danh sách công thức theo danh mục: Hiển thị các bài viết thuộc danh mục chỉ định kèm phân trang. | **ISR** (`revalidate = 600s`) | Không |
| `/search` | Trang kết quả tìm kiếm toàn văn bản: Hiển thị kết quả tìm kiếm với điểm tương quan độ phù hợp. | **SSR** (Dynamic Rendering) | Không |
| `/auth/login` | Biểu mẫu đăng nhập: Hỗ trợ đăng nhập Email/Mật khẩu và nút bấm xác thực nhanh Google OAuth. | **CSR** | Không (Chuyển hướng nếu đã đăng nhập) |
| `/auth/register` | Biểu mẫu đăng ký tài khoản tác giả mới. | **CSR** | Không (Chuyển hướng nếu đã đăng nhập) |
| `/dashboard` | Trang tổng quan: Thống kê số lượng bài viết của tác giả theo từng trạng thái (Published, Draft, Archived). | **CSR** | Bắt buộc (`Author` / `Admin`) |
| `/dashboard/recipes` | Danh sách bài viết của tác giả: Quản lý công thức cá nhân, chuyển đổi trạng thái Publish/Archive, nút Sửa/Xóa. | **CSR** | Bắt buộc (`Author` / `Admin`) |
| `/dashboard/recipes/new` | Biểu mẫu tạo mới công thức: Hướng dẫn nhập liệu từng bước (Multi-step Form/Wizard), định lượng nguyên liệu. | **CSR** | Bắt buộc (`Author` / `Admin`) |
| `/dashboard/recipes/[id]/edit`| Giao diện chỉnh sửa công thức: Cập nhật thông tin, tải ảnh lên an toàn, điều chỉnh các bước thực hiện. | **CSR** | Bắt buộc (Chính chủ hoặc `Admin`) |
| `/dashboard/categories` | Giao diện quản lý danh mục ẩm thực dành riêng cho quản trị viên (Thêm, Sửa, Soft Delete danh mục). | **CSR** | Bắt buộc (`Admin`) |
| `/profile` | Trang quản lý hồ sơ cá nhân: Cập nhật tên hiển thị `displayName`, ảnh đại diện `avatarUrl` và tiểu sử `bio`. | **CSR** | Bắt buộc |

---

### 5.2. Giao diện Phần mềm – REST API Specification

| Thuộc tính Quy chuẩn | Đặc tả Chi tiết |
| :--- | :--- |
| **Giao thức Truyền thông** | HTTP/1.1 và HTTP/2 chạy qua kênh mã hóa HTTPS (TLS 1.2+). Nginx đảm nhận SSL Termination. |
| **Base URL (Development)** | `http://localhost:5000/api/v1` |
| **Base URL (Production)** | `https://api.culinaryblog.com/api/v1` |
| **Định dạng Nội dung (Content-Type)** | `application/json; charset=utf-8` cho toàn bộ yêu cầu và phản hồi thông thường. `multipart/form-data` dành riêng cho endpoint tải lên tệp tin ảnh. |
| **Cơ chế Xác thực (Authentication)** | **Access Token:** Truyền qua Header `Authorization: Bearer <access_token>`.<br>**Refresh Token (SPEC.md):** Truyền và lưu trữ tự động trong `HttpOnly`, `Secure`, `SameSite=Strict` Cookie; không nhận qua body để loại trừ nguy cơ tấn công XSS. |
| **Cấu trúc Dữ liệu Thành công** | Dữ liệu trả về trực tiếp theo DTO hoặc cấu trúc phân trang chuẩn:<br>`{ "items": [...], "totalCount": 100, "page": 1, "pageSize": 10, "totalPages": 10, "hasNextPage": true, "hasPreviousPage": false }` |
| **Cấu trúc Báo lỗi (RFC 7807)** | `Content-Type: application/problem+json`<br>`{ "type": "AUTH_INVALID_CREDENTIALS", "title": "Xác thực thất bại", "status": 401, "detail": "Email hoặc mật khẩu không chính xác.", "instance": "/api/v1/auth/login", "errors": {} }` |
| **Phiên bản hóa API (Versioning)** | Phiên bản hóa cố định trên URL Path `/api/v1/`. Khi có thay đổi kiến trúc phá vỡ tương thích (Breaking Changes), phiên bản mới sẽ là `/api/v2/` và duy trì song song phiên bản cũ tối thiểu 6 tháng. |
| **Cấu hình CORS Headers** | `Access-Control-Allow-Origin: http://localhost:3000`<br>`Access-Control-Allow-Credentials: true`<br>`Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`<br>`Access-Control-Allow-Headers: Content-Type, Authorization, X-Correlation-ID, If-Match` |
| **Headers Phân phối Rate Limit** | `X-RateLimit-Limit: 100`<br>`X-RateLimit-Remaining: 87`<br>`X-RateLimit-Reset: 1700000000`<br>`Retry-After: 30` (Trả về khi gặp mã lỗi 429). |
| **Header Định danh Theo vết** | `X-Correlation-ID`: Sinh tự động mã định danh UUID v4 cho mỗi request (hoặc nhận từ Client) và trả về trong Response Header; tự động đính kèm vào mọi bản ghi nhật ký Serilog. |

---

### 5.3. Giao diện Dịch vụ Bên thứ ba

| Dịch vụ / Hệ thống | Mục đích Tích hợp | Giao thức / Thư viện SDK | Cấu hình & Quản lý Khóa Bí mật |
| :--- | :--- | :--- | :--- |
| **Google OAuth 2.0** | Đăng nhập và đăng ký nhanh qua Google | OAuth 2.0 Authorization Code Flow kết hợp PKCE. Thư viện Google Authentication API. | `Google__ClientId`, `Google__ClientSecret`. Cấu hình Redirect URI: `https://culinaryblog.com/api/auth/callback/google`. |
| **MinIO (S3-Compatible)** | Lưu trữ đối tượng tập trung cho ảnh công thức | AWS SDK for .NET (`AWSSDK.S3`). Giao tiếp qua endpoint nội bộ máy chủ. **Bắt buộc upload qua Backend Proxy, không dùng Presigned URL**. | `MinIO__Endpoint: minio:9000`<br>`MinIO__AccessKey`<br>`MinIO__SecretKey`<br>`MinIO__BucketName: culinary-blog` |
| **Hangfire Processing** | Quản lý tác vụ ngầm không đồng bộ | Thư viện `Hangfire.Core`, `Hangfire.PostgreSql`. Bảng điều khiển `/hangfire` phân quyền Admin. | Sử dụng chung chuỗi kết nối với PostgreSQL chính. Schema chuyên biệt: `hangfire`. |
| **Serilog + Seq** | Thu thập và phân tích nhật ký ghi vết | `Serilog.Sinks.Seq`, `Serilog.Formatting.Compact`. Giao tiếp qua HTTP Ingest API cổng 5341. | `Seq__ServerUrl: http://seq:5341` (Môi trường Dev). Môi trường Production hỗ trợ đẩy sang Grafana Loki / Elastic. |
| **OpenTelemetry** | Thu thập vết và giám sát chỉ số | OpenTelemetry .NET SDK, xuất dữ liệu qua giao thức chuẩn OTLP. | Biến môi trường `OTEL_EXPORTER_OTLP_ENDPOINT`. Kết nối tới Seq OTLP hoặc Jaeger. |
| **Dịch vụ Gửi Email (SMTP)**| Gửi email HTML chào mừng người dùng | Thư viện `MailKit` (`IEmailSender`). Kết nối qua SMTP có mã hóa bảo mật TLS. | `Smtp__Host`, `Smtp__Port`, `Smtp__Username`, `Smtp__Password`. Môi trường Dev sử dụng container giả lập MailHog (cổng 1025). |
| **Google Search Console** | Thông báo sơ đồ trang web được cập nhật | Gửi yêu cầu HTTP GET tự động trong tác vụ Hangfire `FR-JOB-003`. | `https://www.google.com/ping?sitemap={sitemapUrl}`. Không yêu cầu API Key. |

---

### 5.4. Giao diện Phần cứng
Hệ thống là ứng dụng phần mềm thuần túy, không giao tiếp trực tiếp với các phần cứng chuyên biệt. Cấu hình máy chủ tối thiểu và khuyến nghị:

| Thành phần Phần cứng | Môi trường Phát triển (Local Dev) | Môi trường Triển khai Production (Máy chủ Đơn - MVP) |
| :--- | :--- | :--- |
| **Bộ vi xử lý (CPU)** | Tối thiểu 2 Cores vật lý (Hỗ trợ tốt x86_64 và Apple Silicon ARM64 thông qua Docker Desktop). | 2 vCPU trở lên (Khuyến nghị 4 vCPU phục vụ xử lý ảnh và chỉ mục Full-Text Search). |
| **Bộ nhớ trong (RAM)** | Tối thiểu 8 GB RAM (Đảm bảo chạy đồng thời IDE cùng cụm Docker Compose: API, DB, Redis, MinIO, Seq). | Tối thiểu 4 GB RAM (Khuyến nghị 8 GB RAM để vận hành êm ái khi Redis cache mở rộng). |
| **Ổ đĩa Lưu trữ (Disk)** | Tối thiểu 20 GB dung lượng trống chuẩn SSD. | Tối thiểu 50 GB dung lượng chuẩn SSD / NVMe (Đảm bảo tốc độ I/O cho CSDL và lưu trữ ảnh MinIO). |
| **Băng thông Mạng** | Kết nối Internet ổn định tải package NuGet/npm. | Băng thông mạng $\ge 1$ Gbps, địa chỉ IP tĩnh công khai (Static Public IPv4). |

---

# CHƯƠNG 6. KIẾN TRÚC HỆ THỐNG

### 6.1. Tổng quan Kiến trúc
Hệ thống Culinary Blog được xây dựng dựa trên nguyên lý tách biệt mối quan tâm (Separation of Concerns), triển khai theo mô hình phân tầng Client-Server:

| Tầng Hệ thống | Công nghệ Triển khai | Vai trò và Trách nhiệm Chính | Giao tiếp Với |
| :--- | :--- | :--- | :--- |
| **Client Layer** | Trình duyệt Web (Chrome, Edge, Safari...) | Hiển thị giao diện người dùng, tiếp nhận thao tác chuột và bàn phím. | Next.js Frontend |
| **Frontend Layer** | **Next.js 15 (App Router)**, TypeScript, Tailwind CSS, TanStack Query, React Hook Form | Kết xuất giao diện (SSR/ISR/CSR), tối ưu hóa SEO, quản lý trạng thái máy khách. | Nginx / Backend API |
| **Gateway & Reverse Proxy**| **Nginx Alpine Container** | SSL Termination, bảo vệ DDoS thô (300 req/min), phục vụ tệp tĩnh, định tuyến ngược. | Frontend (:3000) & Backend (:5000) |
| **Backend API Layer** | **.NET 10 Minimal APIs** (Clean Architecture + CQRS) | Hiện thực hóa quy tắc nghiệp vụ, xác thực phân quyền, điều phối luồng dữ liệu và tác vụ nền. | PostgreSQL, Redis, MinIO, Email |
| **Distributed Cache Layer** | **Redis 7 Alpine** | Bộ nhớ đệm phân tán cho danh mục, chi tiết công thức (Output Cache) và bộ đếm Rate Limiting. | Backend API |
| **Object Storage Layer** | **MinIO S3-Compatible** | Kho lưu trữ nhị phân cho hình ảnh công thức (gốc, medium, thumbnail). | Backend API (qua AWSSDK) |
| **Relational Database** | **PostgreSQL 16.x** | Lưu trữ dữ liệu quan hệ có cấu trúc bền bỉ; xử lý Full-Text Search tiếng Việt qua `tsvector`. | Backend API (qua EF Core 10) |
| **Observability Stack** | **Serilog, Seq, OpenTelemetry** | Thu thập nhật ký ghi vết có cấu trúc, giám sát vết phân tán và theo dõi số liệu hiệu năng. | Backend API |

---

### 6.2. Kiến trúc Backend – Clean Architecture
Backend được thiết kế chặt chẽ theo mô hình **Clean Architecture (Robert C. Martin)**, phân chia thành 4 dự án độc lập tuân thủ tuyệt đối quy tắc **Dependency Rule** (Mọi phụ thuộc chỉ được hướng tâm vào trong):

```
┌────────────────────────────────────────────────────────┐
│  Presentation Layer (CulinaryBlog.API)                 │
│  - Minimal API Endpoints, Middlewares, Program.cs      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Infrastructure Layer (CulinaryBlog.Infrastructure)│  │
│  │  - EF Core, Redis, MinIO, MailKit, Hangfire      │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Application Layer (CulinaryBlog.Application)│  │
│  │  │  - CQRS Commands/Queries, Validators, DTOs │  │  │
│  │  │  ┌──────────────────────────────────────┐  │  │  │
│  │  │  │  Domain Layer (CulinaryBlog.Domain)  │  │  │  │
│  │  │  │  - Entities, Value Objects, Enums    │  │  │  │
│  │  │  │  - Repository Interfaces             │  │  │  │
│  │  │  │  - TUYỆT ĐỐI KHÔNG DEPENDENCY NGOÀI  │  │  │  │
│  │  │  └──────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

1. **Domain Layer (`CulinaryBlog.Domain`):** Nhân lõi của toàn bộ hệ thống. Chứa các thực thể miền (`Recipe`, `Category`, `ApplicationUser`, `RecipeStep`, `RecipeIngredient`, `RecipeImage`), Owned Entity (`RecipeNutrition`), các Enums (`RecipeDifficulty`, `RecipeStatus`), và các giao diện trừu tượng (`IRecipeRepository`, `ICategoryRepository`, `IUnitOfWork`). Tầng này hoàn toàn độc lập, không tham chiếu bất kỳ NuGet package nào ngoài .NET BCL.
2. **Application Layer (`CulinaryBlog.Application`):** Tầng điều phối nghiệp vụ. Chứa các `Commands` (thao tác ghi) và `Queries` (thao tác đọc) theo chuẩn CQRS; các `Handlers` xử lý nghiệp vụ; các DTOs phản hồi; các quy tắc kiểm tra dữ liệu bằng FluentValidation; và các Behaviors trong MediatR Pipeline. Tầng này chỉ phụ thuộc duy nhất vào tầng `Domain`.
3. **Infrastructure Layer (`CulinaryBlog.Infrastructure`):** Hiện thực hóa toàn bộ các giao diện trừu tượng được định nghĩa ở các tầng bên trong: Cấu hình ánh xạ CSDL `CulinaryBlogDbContext`, triển khai Repositories, dịch vụ lưu trữ tệp tin `MinioFileStorageService`, dịch vụ bộ nhớ đệm `RedisCacheService`, dịch vụ gửi email `MailKitEmailService`, cấu hình máy chủ tác vụ ngầm Hangfire và Interceptor tự động gán ngày tạo/ngày sửa (`AuditInterceptor`).
4. **Presentation Layer (`CulinaryBlog.API`):** Cổng giao tiếp HTTP với thế giới bên ngoài. Chứa các Endpoint Groups khai báo bằng .NET 10 Minimal APIs (`AuthEndpoints`, `RecipesEndpoints`, `CategoriesEndpoints`); các Middleware toàn cục (`GlobalExceptionMiddleware`, `CorrelationIdMiddleware`, `RateLimitingMiddleware`); và cấu hình Dependency Injection trung tâm (`Program.cs`).

---

### 6.3. CQRS + MediatR Pipeline Behavior Execution
Mọi yêu cầu gửi tới hệ thống thông qua MediatR đều được thực thi tuần tự qua chuỗi các Pipeline Behaviors nghiêm ngặt theo đúng thứ tự sau:

```
Request ──► [1. LoggingBehavior]
                 │
            [2. ValidationBehavior] ──(Lỗi)──► HTTP 400 Bad Request
                 │
            [3. CachingBehavior] ──(Cache Hit)──► Trả về DTO ngay
                 │ (Cache Miss)
            [4. Handler Execution (Business Logic)]
                 │
            [5. CacheInvalidationBehavior] (Xóa cache nếu Command ghi thành công)
                 │
Response ◄───────┘
```

| Thứ tự | Tên Pipeline Behavior | Trách nhiệm Thực thi Kỹ thuật | Đối tượng Áp dụng |
| :---: | :--- | :--- | :--- |
| **1** | **`LoggingBehavior`** | Ghi nhận tên Command/Query, các tham số đầu vào và đo đạc thời gian thực thi chính xác (ms). Tự động ghi log mức Cảnh báo (Warning) nếu thời gian xử lý vượt quá 500ms. | Toàn bộ mọi Command và Query. |
| **2** | **`ValidationBehavior`** | Tìm kiếm và kích hoạt các Validators đã khai báo qua FluentValidation. Nếu có bất kỳ trường nào vi phạm, lập tức ném lỗi `ValidationException` để dừng luồng và trả về mã lỗi `HTTP 400 Bad Request`. | Mọi Command/Query có Validator. |
| **3** | **`CachingBehavior`** | Kiểm tra xem Query có hiện thực giao diện `ICacheable` hay không. Nếu có, tra cứu trong Redis Cache. Nếu tìm thấy (Cache Hit), trả về dữ liệu ngay lập tức mà không cần gọi xuống Database. | Áp dụng cho các Query đọc dữ liệu có cờ `ICacheable`. |
| **4** | **`Handler (IRequestHandler)`** | Thực thi nghiệp vụ cốt lõi: Tương tác qua Repositories, áp dụng Domain Business Rules, điều phối Unit of Work và ánh xạ dữ liệu trả về DTO. | Bắt buộc đối với toàn bộ các use-case. |
| **5** | **`CacheInvalidationBehavior`** | Sau khi một Command thay đổi dữ liệu (Create/Update/Delete) được Handler xử lý thành công, tự động thực hiện xóa sạch các khóa bộ nhớ đệm hoặc các Tags liên quan trên Redis. | Mọi Command có hiện thực `ICacheInvalidator`. |

---

### 6.4. Mô hình Quan hệ Thực thể Tóm tắt
Toàn bộ các thực thể trong cơ sở dữ liệu đều kế thừa lớp trừu tượng `BaseEntity` (hỗ trợ `Id`, `CreatedAt`, `UpdatedAt`, `IsDeleted`, `RowVersion`):

| Thực thể (Entity) | Quan hệ Phân cấp & Liên kết | Bảng CSDL PostgreSQL |
| :--- | :--- | :--- |
| **`Recipe`** | - Liên kết nhiều-một với `Category` (N:1).<br>- Liên kết nhiều-một với `ApplicationUser` (N:1, tác giả sở hữu).<br>- Chứa nhiều `RecipeStep` (1:N, sắp xếp theo `StepNumber`).<br>- Chứa nhiều `RecipeIngredient` (1:N, danh sách nguyên liệu).<br>- Chứa nhiều `RecipeImage` (1:N, ảnh đại diện và ảnh gallery).<br>- Sở hữu trực tiếp Owned Entity `RecipeNutrition` (1:1, nhúng cột). | `"Recipes"` |
| **`RecipeNutrition`** | Owned Entity thuộc sở hữu của `Recipe` (không tạo bảng riêng, ánh xạ thành các cột tiền tố `Nutrition_*` trong bảng `"Recipes"`). | Cột trong bảng `"Recipes"` |
| **`RecipeStep`** | Thuộc về một `Recipe` cụ thể (Khóa ngoại `RecipeId`, ràng buộc xóa mềm/xóa liên hoàn). | `"RecipeSteps"` |
| **`RecipeIngredient`** | Thuộc về một `Recipe` cụ thể (Khóa ngoại `RecipeId`, lưu định lượng và đơn vị). | `"RecipeIngredients"` |
| **`RecipeImage`** | Thuộc về một `Recipe` cụ thể (Khóa ngoại `RecipeId`, lưu URL ảnh MinIO và cờ `IsPrimary`). | `"RecipeImages"` |
| **`Category`** | Danh mục phân loại chứa nhiều `Recipe` (1:N). Áp dụng Soft Delete. | `"Categories"` |
| **`ApplicationUser`** | Kế thừa `IdentityUser`. Là tác giả sở hữu nhiều `Recipe` (1:N) và sở hữu nhiều phiên `RefreshToken` (1:N). | `"AspNetUsers"` |
| **`RefreshToken`** | Thuộc về một `ApplicationUser` cụ thể (Khóa ngoại `UserId`). Lưu bản băm token phục vụ xoay vòng token an toàn. | `"RefreshTokens"` |

---

### 6.5. Đóng gói & Triển khai Docker Compose
Hệ thống được thiết kế container hóa 100%, sẵn sàng chạy môi trường phát triển cục bộ và thử nghiệm thông qua một câu lệnh duy nhất: `docker-compose up -d`.

| Tên Dịch vụ | Docker Image | Cổng Mở (Host:Container) | Mô tả Cấu hình & Volume Gắn kết |
| :--- | :--- | :---: | :--- |
| **`nginx`** | `nginx:alpine` | `80:80`<br>`443:443` | Cổng vào Gateway duy nhất. Reverse Proxy tới Frontend và API Backend. Mount cấu hình: `./nginx/nginx.conf`, `./ssl/`. Phụ thuộc vào `api` và `frontend`. |
| **`api`** | `culinaryblog-api` (Dockerfile) | `5000:8080` | Tiến trình .NET 10 Minimal APIs. Đọc cấu hình từ `.env`. Phụ thuộc vào `postgres`, `redis`, `minio`. |
| **`frontend`** | `culinaryblog-web` (Dockerfile) | `3000:3000` | Ứng dụng Next.js 15 Standalone Node Server. Phụ thuộc vào `api`. |
| **`postgres`** | `postgres:16-alpine` | `5432:5432` | CSDL quan hệ chính. Mount dữ liệu bền vững: `pgdata:/var/lib/postgresql/data`. Thiết lập biến môi trường `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`. |
| **`redis`** | `redis:7-alpine` | `6379:6379` | Bộ nhớ đệm phân tán. Mount volume: `redisdata:/data`. Lệnh thực thi: `redis-server --appendonly yes`. |
| **`minio`** | `minio/minio:latest` | `9000:9000`<br>`9001:9001` | Máy chủ lưu trữ ảnh S3. Cổng 9000 phục vụ API tải ảnh, cổng 9001 phục vụ giao diện Web Console. Mount volume: `miniodata:/data`. |
| **`seq`** | `datalust/seq:latest` | `5341:80` | Máy chủ thu thập nhật ký ghi vết Serilog trong môi trường Dev. Mount volume: `seqdata:/data`. |
| **`mailhog`** | `mailhog/mailhog:latest` | `8025:8025`<br>`1025:1025` | Máy chủ giả lập SMTP kiểm thử gửi email chào mừng. Cổng 1025 tiếp nhận SMTP, cổng 8025 hiển thị hộp thư Web UI. |

---

# CHƯƠNG 7. MÔ HÌNH DỮ LIỆU (DATA MODEL)

Chương này đặc tả chi tiết toàn bộ cấu trúc các bảng dữ liệu trong PostgreSQL 16 quản lý qua EF Core 10 Code-First. Toàn bộ các bảng nghiệp vụ đều kế thừa từ lớp trừu tượng `BaseEntity` và đồng nhất áp dụng quy chế **Soft Delete** (`IsDeleted`) cùng kiểm soát xung đột đồng quy (**`RowVersion`**).

---

### 7.1. BaseEntity (Abstract)
Mọi thực thể bảng đều bắt buộc kế thừa các cột chuẩn hóa của `BaseEntity`:

| Tên Cột | Kiểu Dữ liệu C# | Kiểu Dữ liệu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Khóa chính ngẫu nhiên UUID v4 (loại bỏ nguy cơ tấn công dò quét ID tuần tự). |
| **`CreatedAt`** | `DateTime` | `timestamptz` | `NOT NULL, DEFAULT NOW()` | Mốc thời gian tạo bản ghi (UTC). Tự động gán bởi `AuditInterceptor`. |
| **`UpdatedAt`** | `DateTime?` | `timestamptz` | `NULL` | Mốc thời gian cập nhật lần cuối (UTC). Tự động cập nhật bởi `AuditInterceptor`. |
| **`IsDeleted`** | `bool` | `boolean` | `NOT NULL, DEFAULT false` | Cờ xóa mềm (Soft Delete Flag). Tự động áp dụng Global Query Filter: `.Where(x => !x.IsDeleted)`. |
| **`RowVersion`** | `byte[]` | `bytea` | `NOT NULL, Concurrency Token` | Token kiểm soát đồng quy lạc quan (`[Timestamp]` annotation). Tự động đổi giá trị khi cập nhật. |

---

### 7.2. Recipe Entity
Thực thể trung tâm quản trị toàn bộ thông tin công thức nấu ăn. Bảng CSDL: `"Recipes"`.

| Tên Cột | Kiểu Dữ liệu C# | Kiểu PostgreSQL | Ràng buộc | Chỉ mục (Indexes) | Mô tả Chi tiết Nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK (kế thừa) | PK Index | Khóa chính công thức. |
| **`Title`** | `string` | `varchar(200)` | `NOT NULL` | `IDX_Recipe_Title` (trigram) | Tiêu đề món ăn (5-200 ký tự). Có thể trùng tiêu đề khác tác giả. |
| **`Slug`** | `string` | `varchar(220)` | `NOT NULL, UNIQUE` | `IDX_Recipe_Slug` (UNIQUE B-Tree) | Đường dẫn thân thiện SEO. Sinh từ `Title`, không đổi sau Publish. |
| **`Description`**| `string` | `text` | `NOT NULL` | — | Mô tả tóm tắt món ăn ($\le 2000$ ký tự), dùng cho SEO Meta Description. |
| **`Instructions`**| `string` | `text` | `NOT NULL` | — | Nội dung hướng dẫn tổng quát dạng Markdown. |
| **`PrepTime`** | `int` | `integer` | `NOT NULL, CHECK > 0`| — | Thời gian chuẩn bị sơ chế (tính theo phút). |
| **`CookTime`** | `int` | `integer` | `NOT NULL, CHECK >= 0`| — | Thời gian nấu trên bếp (phút). Bằng 0 với các món không cần nấu. |
| **`Servings`** | `int` | `integer` | `NOT NULL, CHECK > 0`| — | Định lượng số khẩu phần ăn (phần/người). |
| **`Difficulty`** | `RecipeDifficulty` | `smallint` | `NOT NULL, DEFAULT 1`| `IDX_Recipe_Difficulty` | Cấp độ khó: `1=Easy`, `2=Medium`, `3=Hard`, `4=Expert`. |
| **`Status`** | `RecipeStatus` | `smallint` | `NOT NULL, DEFAULT 0`| `IDX_Recipe_Status` | Trạng thái: `0=Draft`, `1=Published`, `2=Archived`. |
| **`CategoryId`** | `Guid` | `uuid` | `NOT NULL, FK -> Categories.Id` | `IDX_Recipe_CategoryId` (B-Tree) | Khóa ngoại danh mục. Ràng buộc `ON DELETE RESTRICT`. |
| **`AuthorId`** | `string` | `varchar(450)` | `NOT NULL, FK -> AspNetUsers.Id` | `IDX_Recipe_AuthorId` (B-Tree) | Khóa ngoại tác giả sở hữu bài viết. |
| **`SearchVector`**| `NpgsqlTsVector` | `tsvector` | `NULL` | `IDX_Recipe_Search` (GIN Index) | Cột vector tìm kiếm toàn văn bản. Tự cập nhật qua Trigger khi sửa Title/Desc. |
| **`PublishedAt`** | `DateTime?` | `timestamptz` | `NULL` | `IDX_Recipe_PublishedAt` | Mốc thời gian xuất bản công khai. Bằng `null` khi đang ở trạng thái `Draft`. |
| **`CreatedAt`** | `DateTime` | `timestamptz` | `NOT NULL` | — | Thời gian tạo công thức (kế thừa từ `BaseEntity`). |
| **`UpdatedAt`** | `DateTime?` | `timestamptz` | `NULL` | — | Thời gian chỉnh sửa cuối cùng (kế thừa từ `BaseEntity`). |
| **`IsDeleted`** | `bool` | `boolean` | `NOT NULL, DEFAULT false` | `IDX_Recipe_IsDeleted` (Partial) | Cờ Soft Delete thống nhất toàn hệ thống. |
| **`RowVersion`** | `byte[]` | `bytea` | `NOT NULL` | — | Token đồng quy phát hiện xung đột dữ liệu. |

#### 7.2.1. RecipeNutrition (Owned Entity)
Là một Owned Entity được ánh xạ nhúng trực tiếp thành các cột bên trong bảng `"Recipes"`, không tách bảng riêng:

| Tên Cột trong CSDL | Thuộc tính C# | Kiểu Dữ liệu | Ràng buộc | Ý nghĩa Dinh dưỡng (Mỗi khẩu phần) |
| :--- | :--- | :--- | :--- | :--- |
| **`Nutrition_Calories`** | `Calories` | `decimal(8,2)?` | `NULL` | Năng lượng (kcal). |
| **`Nutrition_Protein`** | `Protein` | `decimal(8,2)?` | `NULL` | Hàm lượng chất đạm (gram). |
| **`Nutrition_Carbohydrates`**| `Carbohydrates` | `decimal(8,2)?` | `NULL` | Hàm lượng tinh bột/carbs (gram). |
| **`Nutrition_Fat`** | `Fat` | `decimal(8,2)?` | `NULL` | Hàm lượng chất béo (gram). |
| **`Nutrition_Fiber`** | `Fiber` | `decimal(8,2)?` | `NULL` | Hàm lượng chất xơ (gram). |
| **`Nutrition_Sodium`** | `Sodium` | `decimal(8,2)?` | `NULL` | Hàm lượng muối Natri (mg). |

---

### 7.3. RecipeStep Entity
Các bước thực hiện chi tiết của công thức. Bảng CSDL: `"RecipeSteps"`.

| Tên Cột | Kiểu C# | Kiểu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK (kế thừa) | Khóa chính bước hướng dẫn. |
| **`RecipeId`** | `Guid` | `uuid` | `NOT NULL, FK -> Recipes.Id, ON DELETE CASCADE` | Khóa ngoại tham chiếu đến Recipe. |
| **`StepNumber`** | `int` | `integer` | `NOT NULL, CHECK > 0` | Thứ tự bước ($1, 2, 3...$). Ràng buộc duy nhất theo bộ `(RecipeId, StepNumber)`. |
| **`Title`** | `string` | `varchar(200)` | `NOT NULL` | Tiêu đề bước ngắn gọn (ví dụ: "Sơ chế thịt bò"). |
| **`Description`**| `string` | `text` | `NOT NULL` | Hướng dẫn chi tiết thao tác trong bước. |
| **`TimerMinutes`**| `int?` | `integer` | `NULL, CHECK >= 0` | Thời gian hẹn giờ đồng hồ cho bước này (nếu có). |
| **`ImageUrl`** | `string?`| `varchar(500)` | `NULL` | Đường dẫn ảnh minh họa riêng cho bước (trên MinIO). |

---

### 7.4. RecipeIngredient Entity
Danh mục các nguyên liệu cần thiết cho món ăn. Bảng CSDL: `"RecipeIngredients"`.

| Tên Cột | Kiểu C# | Kiểu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK (kế thừa) | Khóa chính nguyên liệu. |
| **`RecipeId`** | `Guid` | `uuid` | `NOT NULL, FK -> Recipes.Id, ON DELETE CASCADE` | Khóa ngoại tham chiếu đến Recipe. |
| **`Name`** | `string` | `varchar(200)` | `NOT NULL` | Tên nguyên liệu (ví dụ: "Thịt thăn bò", "Hành lá"). |
| **`Quantity`** | `decimal?`| `decimal(10,3)` | `NULL` | Định lượng số lượng (cho phép null nếu là "gia vị vừa đủ"). |
| **`Unit`** | `string?`| `varchar(50)` | `NULL` | Đơn vị tính (gram, ml, muỗng canh, quả, củ...). |
| **`Notes`** | `string?`| `varchar(500)` | `NULL` | Ghi chú sơ chế (ví dụ: "thái lát mỏng 2mm"). |
| **`OrderIndex`** | `int` | `integer` | `NOT NULL, DEFAULT 0` | Thứ tự hiển thị trong bảng nguyên liệu. |

---

### 7.5. RecipeImage Entity
Bộ sưu tập hình ảnh của công thức nấu ăn. Bảng CSDL: `"RecipeImages"`.

| Tên Cột | Kiểu C# | Kiểu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK (kế thừa) | Khóa chính bản ghi ảnh. |
| **`RecipeId`** | `Guid` | `uuid` | `NOT NULL, FK -> Recipes.Id, ON DELETE CASCADE` | Khóa ngoại tham chiếu đến Recipe. |
| **`OriginalUrl`** | `string` | `varchar(500)` | `NOT NULL` | Đường dẫn URL ảnh gốc trên MinIO. |
| **`MediumUrl`** | `string?`| `varchar(500)` | `NULL` | URL ảnh phiên bản Medium ($800\times 600\text{px}$) do Hangfire tạo. |
| **`ThumbnailUrl`**| `string?`| `varchar(500)` | `NULL` | URL ảnh phiên bản Thumbnail ($300\times 300\text{px}$) do Hangfire tạo. |
| **`AltText`** | `string?`| `varchar(200)` | `NULL` | Văn bản thay thế hỗ trợ Accessibility (a11y) và SEO. |
| **`IsPrimary`** | `bool` | `boolean` | `NOT NULL, DEFAULT false` | Cờ xác định ảnh đại diện chính (Mỗi Recipe chỉ có duy nhất 1 ảnh `true`). |
| **`OrderIndex`** | `int` | `integer` | `NOT NULL, DEFAULT 0` | Thứ tự sắp xếp trong bộ sưu tập gallery. |

---

### 7.6. Category Entity
Danh mục ẩm thực phân loại công thức. Bảng CSDL: `"Categories"`.

| Tên Cột | Kiểu C# | Kiểu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK (kế thừa) | Khóa chính danh mục. |
| **`Name`** | `string` | `varchar(100)` | `NOT NULL, UNIQUE` | Tên gọi danh mục (ví dụ: "Món Khai Vị", "Món Chay"). |
| **`Slug`** | `string` | `varchar(120)` | `NOT NULL, UNIQUE` | Đường dẫn thân thiện SEO (ví dụ: `mon-khai-vi`), có chỉ mục B-Tree. |
| **`Description`**| `string?`| `text` | `NULL` | Mô tả ngắn gọn về danh mục ẩm thực. |
| **`ImageUrl`** | `string?`| `varchar(500)` | `NULL` | Đường dẫn ảnh banner đại diện danh mục. |
| **`OrderIndex`** | `int` | `integer` | `NOT NULL, DEFAULT 0` | Thứ tự sắp xếp hiển thị trên Menu điều hướng. |
| **`IsDeleted`** | `bool` | `boolean` | `NOT NULL, DEFAULT false` | Cờ Soft Delete (Chỉ cho phép xóa khi không còn Recipe nào active). |

---

### 7.7. ApplicationUser Entity (Extends IdentityUser)
Thực thể đại diện cho người dùng trong hệ thống, kế thừa từ `IdentityUser<string>` của ASP.NET Core Identity. Bảng CSDL: `"AspNetUsers"`.

| Thuộc tính (Tên Cột) | Kiểu Dữ liệu C# | Kiểu PostgreSQL | Ràng buộc | Mô tả Nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| **`DisplayName`** | `string` | `varchar(100)` | `NOT NULL` | **Tên hiển thị công khai** của tác giả (chuẩn hóa thay cho `fullName`). |
| **`AvatarUrl`** | `string?` | `varchar(500)` | `NULL` | Đường dẫn ảnh đại diện cá nhân (lấy từ MinIO hoặc hồ sơ Google). |
| **`Bio`** | `string?` | `text` | `NULL` | **Tiểu sử ngắn gọn** giới thiệu kinh nghiệm ẩm thực của tác giả. |
| **`IsActive`** | `bool` | `boolean` | `NOT NULL, DEFAULT true` | Trạng thái hoạt động của tài khoản (Admin có quyền cấm/khóa tài khoản). |
| **`CreatedAt`** | `DateTime` | `timestamptz` | `NOT NULL, DEFAULT NOW()`| Ngày tạo tài khoản. |
| *Cột kế thừa Identity* | `string`... | `varchar`... | Theo chuẩn Identity | Gồm `Id`, `UserName`, `Email`, `PasswordHash`, `SecurityStamp`, `LockoutEnd`... |

---

### 7.8. RefreshToken Entity
Quản lý các chu kỳ cấp phép phiên đăng nhập dài hạn. Bảng CSDL: `"RefreshTokens"`.

| Tên Cột | Kiểu C# | Kiểu PostgreSQL | Ràng buộc Kỹ thuật | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| **`Id`** | `Guid` | `uuid` | PK | Khóa chính phiên refresh token. |
| **`UserId`** | `string` | `varchar(450)` | `NOT NULL, FK -> AspNetUsers.Id, CASCADE` | Khóa ngoại người dùng sở hữu token. |
| **`TokenHash`** | `string` | `varchar(64)` | `NOT NULL, UNIQUE` | **Bản băm SHA-256** của Refresh Token ngẫu nhiên (không lưu bản rõ). |
| **`ExpiresAt`** | `DateTime` | `timestamptz` | `NOT NULL` | Mốc thời gian hết hạn (mặc định 7 ngày kể từ lúc tạo). |
| **`RevokedAt`** | `DateTime?` | `timestamptz` | `NULL` | Mốc thời gian bị thu hồi. `NULL` nghĩa là token đang có hiệu lực. |
| **`ReplacedByTokenHash`**| `string?`| `varchar(64)` | `NULL` | Bản băm của token mới thay thế (phục vụ truy vết chuỗi Token Family). |
| **`CreatedByIp`**| `string?` | `varchar(45)` | `NULL` | Địa chỉ IP của máy khách khi yêu cầu tạo token (phục vụ kiểm toán). |
| **`CreatedAt`** | `DateTime` | `timestamptz` | `NOT NULL, DEFAULT NOW()` | Thời điểm khởi tạo bản ghi. |

---

# CHƯƠNG 8. ĐẶC TẢ REST API

Toàn bộ các API đều tuân thủ các quy ước chuẩn hóa:
- **Base URL:** `/api/v1`
- **Xác thực:** Header `Authorization: Bearer <access_token>`
- **Refresh Token Cookie (SPEC.md):** Truyền và nhận qua Cookie `refreshToken` (`HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth`)
- **Phân trang chuẩn:** `?page=1&pageSize=10&sort=-createdAt`
- **Mã lỗi chuẩn RFC 7807:**
  - `HTTP 400 Bad Request`: Lỗi dữ liệu đầu vào hoặc vi phạm FluentValidation (`VALIDATION_ERROR`).
  - `HTTP 401 Unauthorized`: Sai thông tin xác thực, token hết hạn hoặc bị thu hồi.
  - `HTTP 403 Forbidden`: Người dùng không có đủ quyền hoặc không phải chủ sở hữu tài nguyên (`RECIPE_FORBIDDEN`).
  - `HTTP 404 Not Found`: Không tìm thấy thực thể hoặc thực thể đã bị xóa mềm.
  - `HTTP 409 Conflict`: Xung đột đồng quy `RowVersion` (`RECIPE_CONCURRENCY_CONFLICT`), trùng email, hoặc xóa danh mục đang có công thức.
  - `HTTP 422 Unprocessable Entity`: Vi phạm quy tắc nghiệp vụ (ví dụ: Xuất bản công thức thiếu bước thực hiện `RECIPE_PUBLISH_INCOMPLETE`).
  - `HTTP 429 Too Many Requests`: Vượt quá giới hạn tần suất yêu cầu (`RATE_LIMIT_EXCEEDED`).

---

### 8.1. Module Xác thực (`/api/v1/auth`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`POST`** | `/auth/register` | Anonymous | `{ displayName, email, userName, password }` | **`201 Created`**<br>`{ accessToken, expiresAt, user }`<br>*Đính kèm Cookie `refreshToken`* | `400` (Validation), `409` (`AUTH_EMAIL_EXISTS`) |
| **`POST`** | `/auth/login` | Anonymous | `{ email, password }` | **`200 OK`**<br>`{ accessToken, expiresAt, user }`<br>*Đính kèm Cookie `refreshToken`* | `400`, `401` (`AUTH_INVALID_CREDENTIALS`), `423` (Locked), `429` |
| **`POST`** | `/auth/google` | Anonymous | `{ idToken }` | **`200 OK`**<br>`{ accessToken, expiresAt, user }`<br>*Đính kèm Cookie `refreshToken`* | `400` (`AUTH_GOOGLE_TOKEN_INVALID`), `502` |
| **`POST`** | `/auth/refresh` | Anonymous (Cookie) | *Tự động đọc từ Cookie `refreshToken`* | **`200 OK`**<br>`{ accessToken, expiresAt }`<br>*Cập nhật Cookie mới* | `401` (`AUTH_TOKEN_INVALID`, `AUTH_REFRESH_TOKEN_EXPIRED`, `AUTH_REFRESH_TOKEN_REVOKED`) |
| **`POST`** | `/auth/logout` | Bearer Token | *Đọc từ Cookie `refreshToken`* | **`204 No Content`**<br>*Xóa Cookie `refreshToken`* | `401` (Unauthorized) |
| **`GET`** | `/auth/me` | Bearer Token | — | **`200 OK`**<br>`UserProfileDto` | `401` (Unauthorized), `404` (`AUTH_USER_NOT_FOUND`) |
| **`PATCH`** | `/auth/me` | Bearer Token | `{ displayName?, avatarUrl?, bio? }` | **`200 OK`**<br>`UserProfileDto` đã cập nhật | `400` (Validation error), `401` |

---

### 8.2. Module Danh mục (`/api/v1/categories`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`GET`** | `/categories` | Anonymous | — *(Phục vụ từ Redis Cache)* | **`200 OK`**<br>`CategoryDto[]` | `500` |
| **`GET`** | `/categories/{slug}` | Anonymous | `?page=1&pageSize=12` | **`200 OK`**<br>`{ category, recipes: PagedResult }` | `400` (Params sai), `404` (`CATEGORY_NOT_FOUND`) |
| **`POST`** | `/categories` | Admin | `{ name, description?, imageUrl? }` | **`201 Created`**<br>`CategoryDto` *(Location Header)* | `400` (Validation), `403` (Forbidden), `409` (`CATEGORY_NAME_EXISTS`) |
| **`PUT`** | `/categories/{id}` | Admin | `{ name, description?, imageUrl?, orderIndex? }` | **`200 OK`**<br>`CategoryDto` đã cập nhật | `400`, `403`, `404` (`CATEGORY_NOT_FOUND`) |
| **`DELETE`**| `/categories/{id}` | Admin | — *(Soft Delete `IsDeleted = true`)* | **`204 No Content`** | `403`, `404`, `409` (`CATEGORY_DELETE_HAS_RECIPES` - còn công thức active) |

---

### 8.3. Module Công thức Nấu ăn (`/api/v1/recipes`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`GET`** | `/recipes` | Anonymous | `?page&pageSize&categoryId&difficulty&maxCookTime&sort` | **`200 OK`**<br>`PagedResult<RecipeSummaryDto>` | `400` (Params sai) |
| **`GET`** | `/recipes/{slug}` | Anonymous | — *(Draft: Chủ bài viết / Admin)* | **`200 OK`**<br>`RecipeDetailDto` (đầy đủ cây con) | `403` (`RECIPE_FORBIDDEN`), `404` (`RECIPE_NOT_FOUND`) |
| **`GET`** | `/recipes/search` | Anonymous | `?q={keyword}&page&pageSize` *(Tác giả tìm được cả Draft)* | **`200 OK`**<br>`PagedResult<RecipeSummaryDto>` | `400` (Từ khóa $< 2$ ký tự) |
| **`POST`** | `/recipes` | Author / Admin | `{ title, description, categoryId, prepTimeMinutes, cookTimeMinutes, servings, difficulty, instructions, nutrition?, steps?, ingredients? }` | **`201 Created`**<br>`RecipeDto` (Khởi tạo `Draft`) | `400` (Validation), `401`, `409` (`RECIPE_SLUG_EXISTS`) |
| **`PUT`** | `/recipes/{id}` | Owner / Admin | Header `If-Match: "{rowVersion}"`<br>Body: `{ title, description, categoryId, prepTimeMinutes, cookTimeMinutes, servings, difficulty, instructions, nutrition? }` | **`200 OK`**<br>`RecipeDto` đã cập nhật | `400`, `403` (`RECIPE_FORBIDDEN`), `404`, `409` (`RECIPE_CONCURRENCY_CONFLICT`) |
| **`PATCH`** | `/recipes/{id}/publish` | Owner / Admin | — *(Yêu cầu $\ge 1$ step và $\ge 1$ ingredient)* | **`200 OK`**<br>`RecipeDto` (`Status = Published`) | `403`, `404`, `422` (`RECIPE_PUBLISH_INCOMPLETE`) |
| **`PATCH`** | `/recipes/{id}/unpublish`| Owner / Admin | — | **`200 OK`**<br>`RecipeDto` (`Status = Draft`) | `403`, `404` |
| **`PATCH`** | `/recipes/{id}/archive` | Owner / Admin | — | **`200 OK`**<br>`RecipeDto` (`Status = Archived`) | `403`, `404` |
| **`DELETE`**| `/recipes/{id}` | Owner / Admin | — *(Soft Delete `IsDeleted = true`)* | **`204 No Content`** | `403` (`RECIPE_FORBIDDEN`), `404` (`RECIPE_NOT_FOUND`) |

---

### 8.4. Module Ảnh Công thức (`/api/v1/recipes/{id}/images`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`POST`** | `/recipes/{id}/images` | Owner / Admin | `multipart/form-data`: trường `file` (ảnh), `altText?` | **`201 Created`**<br>`{ imageId, originalUrl, isPrimary }` | `400` (`FILE_SIZE_EXCEEDED`, `FILE_MIME_INVALID`), `403`, `404`, `503` |
| **`PATCH`** | `/recipes/{id}/images/{imgId}/primary` | Owner / Admin | — | **`200 OK`**<br>`{ imageId, isPrimary: true }` | `403`, `404` |
| **`DELETE`**| `/recipes/{id}/images/{imgId}` | Owner / Admin | — *(Xóa CSDL, xóa MinIO ngầm qua Hangfire)* | **`204 No Content`** | `403`, `404` |

---

### 8.5. Module Các bước Thực hiện (`/api/v1/recipes/{id}/steps`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`POST`** | `/recipes/{id}/steps` | Owner / Admin | `{ title, description, timerMinutes?, imageUrl? }` | **`201 Created`**<br>`RecipeStepDto` | `400`, `403`, `404` |
| **`PUT`** | `/recipes/{id}/steps/{stepId}` | Owner / Admin | `{ title?, description?, timerMinutes?, imageUrl? }` | **`200 OK`**<br>`RecipeStepDto` | `400`, `403`, `404` |
| **`DELETE`**| `/recipes/{id}/steps/{stepId}` | Owner / Admin | — *(Tự động renumber các bước còn lại)* | **`204 No Content`** | `403`, `404` |

---

### 8.6. Module Nguyên liệu (`/api/v1/recipes/{id}/ingredients`)

| HTTP Method | Endpoint | Quyền hạn (Auth) | Request Body / Parameters | Phản hồi Thành công (2xx) | Các Mã Lỗi Tiêu biểu |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`POST`** | `/recipes/{id}/ingredients` | Owner / Admin | `{ name, quantity?, unit?, notes?, orderIndex? }` | **`201 Created`**<br>`RecipeIngredientDto` | `400`, `403`, `404` |
| **`PUT`** | `/recipes/{id}/ingredients/{ingId}` | Owner / Admin | `{ name?, quantity?, unit?, notes?, orderIndex? }` | **`200 OK`**<br>`RecipeIngredientDto` | `400`, `403`, `404` |
| **`DELETE`**| `/recipes/{id}/ingredients/{ingId}` | Owner / Admin | — | **`204 No Content`** | `403`, `404` |

---

### 8.7. Health Check Endpoints

| HTTP Method | Endpoint | Quyền hạn (Auth) | Mô tả Kiểm tra | Phản hồi Chuẩn |
| :--- | :--- | :---: | :--- | :--- |
| **`GET`** | `/health` | Anonymous | Tổng hợp tình trạng CSDL PostgreSQL, Redis Cache và MinIO Storage. | **`200 OK`** (Healthy) hoặc **`503 Service Unavailable`** (Unhealthy kèm chi tiết lỗi từng component). |
| **`GET`** | `/health/live` | Anonymous | Liveness Probe kiểm tra tiến trình ứng dụng .NET còn chạy. | **`200 OK`** (Healthy). |
| **`GET`** | `/health/ready` | Anonymous | Readiness Probe kiểm tra kết nối CSDL và Redis đã sẵn sàng nhận tải. | **`200 OK`** (DB & Redis Up) hoặc **`503 Service Unavailable`**. |

---

# PHỤ LỤC

### Phụ lục A – Bảng mã HTTP Status Codes

| Mã HTTP | Tên Trạng thái | Ngữ cảnh Sử dụng Kỹ thuật Cụ thể trong Dự án |
| :---: | :--- | :--- |
| **`200`** | **OK** | Yêu cầu `GET` thành công trả về dữ liệu; yêu cầu `PUT`/`PATCH` cập nhật dữ liệu thành công; `POST /auth/login` đăng nhập thành công. |
| **`201`** | **Created** | Yêu cầu `POST` tạo mới tài nguyên thành công (`Recipe`, `Category`, `Step`, `Ingredient`, `Image`). Header chứa `Location`. |
| **`204`** | **No Content** | Thao tác `DELETE` thành công; `POST /auth/logout` thành công. Phản hồi không có body. |
| **`400`** | **Bad Request** | **Lỗi dữ liệu đầu vào hoặc cú pháp:** Dữ liệu không vượt qua `FluentValidation`, JSON malformed, file vượt 5MB, MIME type hoặc Magic Bytes sai quy chuẩn. Trả về chi tiết các trường lỗi trong object `errors`. |
| **`401`** | **Unauthorized** | Thiếu Access Token; Access Token hết hạn hoặc sai chữ ký số; Refresh Token hết hạn hoặc đã bị thu hồi. |
| **`403`** | **Forbidden** | Đã xác thực danh tính nhưng không đủ quyền hạn: Tác giả cố gắng chỉnh sửa/xóa bài viết của tác giả khác; tài khoản bị khóa (`IsActive == false`). |
| **`404`** | **Not Found** | Tài nguyên theo ID/Slug không tồn tại hoặc đã bị đánh dấu Soft Delete (`IsDeleted == true`). |
| **`409`** | **Conflict** | **Xung đột trạng thái tài nguyên:**<br>1. Xung đột đồng quy `RowVersion` khi cập nhật (`RECIPE_CONCURRENCY_CONFLICT`).<br>2. Trùng lặp trường định danh duy nhất (Email đã đăng ký, Category Name/Slug đã tồn tại).<br>3. Xóa danh mục khi bên trong vẫn còn công thức đang hoạt động (`CATEGORY_DELETE_HAS_RECIPES`). |
| **`422`** | **Unprocessable Entity** | **Vi phạm quy tắc nghiệp vụ (Domain Rules):** Cú pháp hợp lệ nhưng ngữ nghĩa vi phạm (ví dụ: Xuất bản công thức khi chưa có bước thực hiện `RECIPE_PUBLISH_INCOMPLETE`). |
| **`423`** | **Locked** | Tài khoản bị tạm khóa sau 5 lần liên tiếp nhập sai mật khẩu (thời gian khóa 15 phút). |
| **`429`** | **Too Many Requests** | Vượt quá hạn mức tần suất gọi API (Rate Limiting). Phản hồi đính kèm header `Retry-After`. |
| **`500`** | **Internal Server Error** | Biệt lệ máy chủ chưa được kiểm soát (Unhandled Exception). Ghi log đầy đủ qua Serilog, trả về RFC 7807, ẩn toàn bộ StackTrace. |
| **`502`** | **Bad Gateway** | Lỗi giao tiếp khi gọi dịch vụ bên thứ ba (Google OAuth API gián đoạn). |
| **`503`** | **Service Unavailable** | Cổng kiểm tra sức khỏe thất bại (PostgreSQL hoặc Redis bị ngắt kết nối). |

---

### Phụ lục B – Bảng mã Application Error Codes (RFC 7807)

Hệ thống định nghĩa danh mục mã lỗi chuẩn hóa hiển thị tại trường `type` trong cấu trúc lỗi RFC 7807 Problem Details, hỗ trợ Frontend bắt và xử lý lỗi theo cơ chế lập trình (programmatic error handling) thay vì so sánh chuỗi văn bản:

| Application Error Code (AEC) | HTTP Status | Mô tả Chi tiết Tình huống Nghiệp vụ | Phân hệ Module |
| :--- | :---: | :--- | :---: |
| **`AUTH_EMAIL_EXISTS`** | `409` | Email đăng ký đã tồn tại trong cơ sở dữ liệu. | `FR-AUTH` |
| **`AUTH_INVALID_CREDENTIALS`** | `401` | Thông tin email hoặc mật khẩu không chính xác. | `FR-AUTH` |
| **`AUTH_TOKEN_EXPIRED`** | `401` | Access Token đã hết hạn (15 phút). | `FR-AUTH` |
| **`AUTH_TOKEN_INVALID`** | `401` | Access Token sai định dạng hoặc chữ ký số không hợp lệ. | `FR-AUTH` |
| **`AUTH_REFRESH_TOKEN_EXPIRED`**| `401` | Refresh Token trong cookie đã hết hạn hiệu lực (7 ngày). | `FR-AUTH` |
| **`AUTH_REFRESH_TOKEN_REVOKED`**| `401` | Phát hiện Refresh Token đã bị thu hồi trước đó (Tấn công tái sử dụng). | `FR-AUTH` |
| **`AUTH_GOOGLE_TOKEN_INVALID`** | `400` | ID Token từ Google Sign-In không hợp lệ hoặc đã hết hạn. | `FR-AUTH` |
| **`AUTH_ACCOUNT_DISABLED`** | `403` | Tài khoản đã bị quản trị viên vô hiệu hóa (`IsActive = false`). | `FR-AUTH` |
| **`AUTH_USER_NOT_FOUND`** | `404` | Không tìm thấy thông tin tài khoản người dùng tương ứng. | `FR-AUTH` |
| **`CATEGORY_NOT_FOUND`** | `404` | Danh mục món ăn không tồn tại hoặc đã bị xóa mềm. | `FR-CAT` |
| **`CATEGORY_NAME_EXISTS`** | `409` | Tên danh mục đã tồn tại trong hệ thống. | `FR-CAT` |
| **`CATEGORY_DELETE_HAS_RECIPES`**| `409` | Không thể xóa danh mục vì vẫn còn chứa công thức đang hoạt động. | `FR-CAT` |
| **`RECIPE_NOT_FOUND`** | `404` | Công thức nấu ăn theo ID hoặc Slug không tồn tại hoặc đã bị xóa. | `FR-RCP` |
| **`RECIPE_SLUG_EXISTS`** | `409` | Đường dẫn Slug bị trùng lặp không thể sinh tự động. | `FR-RCP` |
| **`RECIPE_FORBIDDEN`** | `403` | Người dùng không phải là tác giả sở hữu công thức và không có quyền Admin. | `FR-RCP` |
| **`RECIPE_CONCURRENCY_CONFLICT`**| `409` | Xung đột phiên bản dữ liệu `RowVersion` (Đã bị sửa bởi người khác). | `FR-RCP` |
| **`RECIPE_PUBLISH_INCOMPLETE`** | `422` | Công thức chưa đủ điều kiện xuất bản (thiếu nguyên liệu hoặc bước thực hiện). | `FR-RCP` |
| **`FILE_SIZE_EXCEEDED`** | `400` | Dung lượng tệp tin tải lên vượt quá giới hạn 5 MB. | `FR-FILE` |
| **`FILE_MIME_INVALID`** | `400` | Tệp tin không đúng định dạng ảnh cho phép hoặc sai Magic Bytes. | `FR-FILE` |
| **`VALIDATION_ERROR`** | `400` | Một hoặc nhiều trường dữ liệu gửi lên vi phạm quy tắc FluentValidation. | Toàn hệ thống |
| **`RATE_LIMIT_EXCEEDED`** | `429` | Tần suất gửi yêu cầu vượt quá hạn mức cho phép. | Toàn hệ thống |

---

### Phụ lục C – Từ điển Thuật ngữ Kỹ thuật (Glossary)

| Thuật ngữ | Viết tắt | Định nghĩa Kỹ thuật Chi tiết |
| :--- | :---: | :--- |
| **Access Token** | AT | JSON Web Token (JWT) mang thông tin ủy quyền, dùng để xác thực các cuộc gọi API. Thời hạn ngắn (15 phút), ký bằng thuật toán khóa đối xứng HMAC-SHA256. |
| **Application Error Code**| AEC | Mã lỗi nghiệp vụ đặc thù định dạng `SCREAMING_SNAKE_CASE` trả về trong trường `type` của chuẩn RFC 7807 giúp Frontend phân nhánh xử lý logic chính xác. |
| **Archived** | — | Trạng thái lưu trữ của công thức nấu ăn (`RecipeStatus.Archived`). Bị ẩn khỏi danh sách công cộng nhưng không bị xóa khỏi cơ sở dữ liệu. |
| **Clean Architecture** | CA | Mô hình kiến trúc phần mềm phân tầng đồng tâm của Robert C. Martin, phân lập mã nguồn nghiệp vụ khỏi các giao diện và công nghệ bên ngoài. |
| **Command Query Responsibility Segregation** | CQRS | Mẫu thiết kế tách biệt tuyệt đối giữa mô hình tiếp nhận lệnh ghi dữ liệu (`Commands`) và mô hình truy vấn đọc dữ liệu (`Queries`). |
| **Content Security Policy**| CSP | Cơ chế bảo mật phía trình duyệt thông qua HTTP Header ngăn chặn các cuộc tấn công tiêm mã độc Cross-Site Scripting (XSS). |
| **Core Web Vitals** | CWV | Bộ 3 chỉ số đo lường trải nghiệm người dùng thực tế của Google: Tốc độ tải nội dung lớn nhất (LCP), độ ổn định bố cục (CLS) và thời gian phản hồi tương tác (INP). |
| **Draft** | — | Trạng thái bản nháp mặc định của công thức khi mới tạo (`RecipeStatus.Draft`). Chỉ hiển thị đối với chính tác giả sở hữu hoặc Quản trị viên. |
| **Eager Loading** | — | Kỹ thuật truy vấn của ORM (EF Core) tải trước toàn bộ các bảng quan hệ liên quan thông qua `.Include()` để tránh lỗi N+1 Query. |
| **Full-Text Search** | FTS | Kỹ thuật tìm kiếm toàn văn bản nâng cao trong PostgreSQL thông qua các kiểu dữ liệu `tsvector` (chỉ mục từ khóa đã xử lý) và `tsquery` (câu truy vấn tìm kiếm). |
| **Hangfire** | — | Thư viện quản lý và điều phối các tác vụ chạy ngầm bất đồng bộ (Fire-and-forget, Delayed, Recurring) có cơ chế lưu trữ hàng đợi bền bỉ. |
| **HttpOnly Cookie** | — | Cờ bảo mật của Cookie chỉ thị trình duyệt không cho phép mã kịch bản JavaScript phía client truy cập vào giá trị cookie, ngăn ngừa đánh cắp qua lỗ hổng XSS. |
| **Incremental Static Regeneration** | ISR | Tính năng cao cấp của Next.js cho phép tự động tái tạo (re-generate) các trang HTML tĩnh trong nền theo chu kỳ thời gian định sẵn mà không cần build lại toàn bộ website. |
| **JSON-LD** | — | Chuẩn định dạng nhúng dữ liệu ngữ nghĩa vào trang web dưới dạng JSON, giúp các công cụ tìm kiếm hiểu sâu về nội dung thực thể (công thức nấu ăn). |
| **Magic Bytes** | — | Các byte định danh đầu tiên trong phần header của một tệp tin nhị phân, dùng để xác định bản chất thực tế của tệp bất kể phần mở rộng (extension) là gì. |
| **MediatR** | — | Thư viện triển khai Mediator Pattern trong .NET, phân tách người gửi yêu cầu khỏi người xử lý yêu cầu và hỗ trợ cắm các Pipeline Behaviors. |
| **MinIO** | — | Hệ thống máy chủ lưu trữ đối tượng mã nguồn mở hiệu năng cao, tương thích hoàn toàn với giao thức Amazon Web Services S3 API. |
| **Optimistic Concurrency Control** | OCC | Cơ chế kiểm soát xung đột ghi dữ liệu đồng thời bằng cách so sánh token phiên bản (`RowVersion`) mà không cần khóa chặt bản ghi trong cơ sở dữ liệu. |
| **Published** | — | Trạng thái công bố công khai của công thức nấu ăn (`RecipeStatus.Published`). Xuất hiện trong danh sách hiển thị và tìm kiếm cho mọi người dùng. |
| **Rate Limiting** | — | Cơ chế kiểm soát và hạn chế số lượng yêu cầu một địa chỉ IP có thể gửi tới máy chủ trong một khung thời gian nhằm ngăn ngừa tấn công Brute Force và DoS. |
| **Refresh Token Rotation** | RTR | Cơ chế bảo mật cao cấp: Mỗi lần sử dụng Refresh Token để lấy cặp token mới, token cũ lập tức bị thu hồi và thay thế bằng một token hoàn toàn mới. |
| **Reuse Detection** | — | Cơ chế phòng thủ: Khi phát hiện một Refresh Token đã bị thu hồi trước đó được gửi lên máy chủ, hệ thống lập tức thu hồi toàn bộ các token trong cùng gia đình phiên. |
| **Slug** | — | Chuỗi ký tự định danh thân thiện với đường dẫn URL, chuyển đổi từ tiêu đề tiếng Việt có dấu sang dạng chữ thường không dấu phân tách bằng gạch nối. |
| **Soft Delete** | — | Quy ước xóa dữ liệu logic bằng cách chuyển cờ `IsDeleted = true`, dữ liệu vật lý vẫn được bảo toàn trong cơ sở dữ liệu và tự động ẩn khỏi các truy vấn thông thường. |
| **Unit of Work** | UoW | Mẫu thiết kế phần mềm đảm bảo nhiều thao tác ghi dữ liệu của các Repository khác nhau được thực thi hoàn tất trong một Database Transaction duy nhất. |

---
*Tài liệu Đặc tả Yêu cầu Phần mềm (SRS v1.1.0) dự án Culinary Blog – Đã hoàn thành chuẩn hóa kỹ thuật.*
