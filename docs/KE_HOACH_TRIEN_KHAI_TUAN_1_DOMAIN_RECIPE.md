# KẾ HOẠCH TRIỂN KHAI CHI TIẾT TUẦN 1
**Chức năng:** Domain Entities & EF Core Configurations cho Module Recipe  
**Phương án lựa chọn:** Cách 1 — Rich Domain Model + DDD Aggregate Root Pattern + Separate EF Configurations  
**Người thực hiện (Người C):** NguyenThanhMinh (MSSV: 2312691)  
**Tên nhánh Git:** `2312691/NguyenThanhMinh/domain-recipe-entities`  

---

## 1. MỤC TIÊU TRIỂN KHAI

Xây dựng toàn bộ mô hình dữ liệu Domain Layer và cấu hình ánh xạ Database tại tầng Infrastructure cho các thực thể thuộc Module Recipe (`Recipe`, `RecipeNutrition`, `RecipeStep`, `RecipeIngredient`, `RecipeImage`).

Đảm bảo:
- **Tuân thủ Clean Architecture (CONS-001):** Domain Layer không chứa bất kỳ thư viện ngoài BCL nào (không dính EF Core, Data Annotations hay FluentValidation).
- **Đóng gói thuộc tính (Encapsulation):** Không cho phép gán trực tiếp property từ bên ngoài (`private set`).
- **Bảo vệ toàn vẹn nghiệp vụ (Business Invariant Protection):** Đưa các logic thay đổi trạng thái, cập nhật thông tin và quản lý các entity con vào trực tiếp các Domain Methods (`Create`, `Update`, `Publish`, `Unpublish`, `Archive`, `AddStep`, `RemoveStep`,...).
- **Cấu hình EF Core chuyên nghiệp:** Tách riêng biệt từng class `IEntityTypeConfiguration<T>` tại tầng Infrastructure.

---

## 2. DANH SÁCH FILE CẦN TẠO MỚI VÀ CHỈNH SỬA

### A. Tầng Domain (`backend/src/Domain`)
1. **`backend/src/Domain/Exceptions/DomainException.cs` [TẠO MỚI]**
   - Định nghĩa Exception tùy chỉnh cho Domain để ném ra khi vi phạm quy tắc nghiệp vụ.
2. **`backend/src/Domain/Entities/Recipe.cs` [CHỈNH SỬA]**
   - Refactor thành Rich Domain Aggregate Root.
   - Private setters + Read-only collections (`IReadOnlyCollection<T>`).
   - Phương thức khởi tạo `Recipe.Create(...)`.
   - Phương thức nghiệp vụ `Update(...)`, `Publish()`, `Unpublish()`, `Archive()`, `SetNutrition(...)`, `AddStep()`, `RemoveStep()`, `AddIngredient()`, `RemoveIngredient()`, `AddImage()`, `RemoveImage()`.
3. **`backend/src/Domain/Entities/RecipeChildren.cs` [CHỈNH SỬA]**
   - Refactor `RecipeStep`, `RecipeIngredient`, `RecipeImage` thành Rich Entities với Private Setters và Factory Methods `Create(...)`.
4. **`backend/src/Domain/ValueObjects/RecipeNutrition.cs` [CHỈNH SỬA]**
   - Refactor thành Immutability Value Object với Constructor và Private Setters.

### B. Tầng Infrastructure (`backend/src/Infrastructure`)
1. **`backend/src/Infrastructure/Data/Configurations/RecipeConfiguration.cs` [TẠO MỚI]**
   - Cấu hình Fluent API cho `Recipe`: Bảng `Recipes`, MaxLength, IsRequired, Unique Index cho `Slug`, Foreign Keys, RowVersion, Owned Entity `Nutrition` (mapping thành `Nutrition_Calories`, `Nutrition_Protein`,...).
2. **`backend/src/Infrastructure/Data/Configurations/RecipeStepConfiguration.cs` [TẠO MỚI]**
   - Cấu hình Fluent API cho `RecipeStep`.
3. **`backend/src/Infrastructure/Data/Configurations/RecipeIngredientConfiguration.cs` [TẠO MỚI]**
   - Cấu hình Fluent API cho `RecipeIngredient`.
4. **`backend/src/Infrastructure/Data/Configurations/RecipeImageConfiguration.cs` [TẠO MỚI]**
   - Cấu hình Fluent API cho `RecipeImage`.
5. **`backend/src/Infrastructure/Data/CulinaryBlogDbContext.cs` [CHỈNH SỬA]**
   - Gọi `builder.ApplyConfigurationsFromAssembly(typeof(CulinaryBlogDbContext).Assembly)` trong `OnModelCreating`.

### C. Tầng Testing (`backend/tests`)
1. **`backend/tests/CulinaryBlog.Domain.Tests/Entities/RecipeDomainTests.cs` [TẠO MỚI]**
   - Viết Unit Tests kiểm tra tính đúng đắn của các Domain Methods (`Recipe.Create`, `Publish` thành công / ném lỗi khi rỗng step, `Update`, `Archive`).

---

## 3. LỘ TRÌNH THỰC HIỆN VÀ KIỂM THỬ

1. **Bước 1:** Tạo nhánh Git `2312691/NguyenThanhMinh/domain-recipe-entities`.
2. **Bước 2:** Triển khai `DomainException.cs` và refactor các Domain Entities trong `Domain/Entities/` & `Domain/ValueObjects/`.
3. **Bước 3:** Tạo các class `IEntityTypeConfiguration<T>` trong `Infrastructure/Data/Configurations/` và cập nhật `CulinaryBlogDbContext.cs`.
4. **Bước 4:** Viết Unit Tests trong `CulinaryBlog.Domain.Tests`.
5. **Bước 5:** Thực thi lệnh kiểm thử:
   - `dotnet build` (Đảm bảo không lỗi, không warning).
   - `dotnet test` (Đảm bảo tất cả Unit Tests đều pass xanh).
