# 04_FORM_FIELD_AUDIT

## Overview
This audit examines every input field across the **Recipe creation / edit** screens, maps them to SRS definitions, validates UI behavior, and notes any gaps.

| Screen (Tab) | Field | SRS ID | Label / Placeholder | Type | Required | Validation (client) | Validation (API) | UI behavior | Recommendations |
|--------------|-------|--------|---------------------|------|----------|----------------------|------------------|-------------|-----------------|
| **Tab 1 – General & Nutrition** | **Title** | R-02.1 | "Tên công thức" | text | ✅ | non‑empty, max 120 chars | `Title` required, max 120 (backend) | Inline error if empty, red border | None – passes.
| | **Description** | R-02.2 | "Mô tả ngắn" | textarea | ✅ | min 10 chars | `Description` required, min 10 | Shows helper text, auto‑grow |
| | **Category** | R-02.3 | dropdown | select | ✅ | must select one | `CategoryId` required, exists | Disabled placeholder "Chọn danh mục" |
| | **Prep time (min)** | R-02.4 | "Thời gian chuẩn bị" | number | ✅ | positive integer | `PrepTimeMinutes` >=0 | Spinner input, error on negative |
| | **Cook time (min)** | R-02.5 | "Thời gian nấu" | number | ✅ | positive integer | `CookTimeMinutes` >=0 | Same as above |
| | **Servings** | R-02.6 | "Số khẩu phần" | number | ✅ | >0 | `Servings` >0 | Inline validation |
| | **Difficulty** | R-02.7 | "Độ khó" (Easy/Medium/Hard) | radio | ✅ | one selected | `Difficulty` enum | Visual radio group, default none |
| | **Nutrition – Calories** | R-02.8 | "Calo" | number | ❌ | >=0 | optional field | `Calories` >=0 if present |
| | **Nutrition – Protein** | R-02.9 | "Protein (g)" | number | ❌ | >=0 | optional | same |
| | **Nutrition – Carbs** | R-02.10 | "Carbohydrate (g)" | number | ❌ | >=0 | optional |
| | **Nutrition – Fat** | R-02.11 | "Chất béo (g)" | number | ❌ | >=0 | optional |
| **Tab 2 – Image Gallery** | **Primary Image** | R-05 | "Ảnh chính" | file (png/jpg) | ✅ | file type, <5 MB | backend validates MIME & size | Thumbnail preview, replace button, error toast on failure |
| | **Secondary Images** | R-06 | "Ảnh phụ" (multiple) | file[] | ❌ | file type, <5 MB each | same validation per image | Strip of thumbnails appears after upload, can remove |
| **Tab 3 – Ingredients** | **Ingredient name** | R-09.1 | "Tên nguyên liệu" | text | ✅ | non‑empty | `Name` required | Inline error per row |
| | **Quantity** | R-09.2 | "Số lượng" | text | ✅ | non‑empty | `Quantity` required |
| | **Unit** | R-09.3 | dropdown (g, ml, pcs…) | select | ✅ | must select | `Unit` required |
| **Tab 4 – Steps** | **Step description** | R-10.1 | "Mô tả bước" | textarea | ✅ | non‑empty | `Description` required |
| | **Step image (optional)** | R-10.2 | file | file | ❌ | file type, <5 MB | optional image per step | Thumbnail preview inside step card |

### General observations
- All required fields have client‑side validation via `react‑hook‑form` and server‑side validation enforced by DTOs.
- Optional nutrition fields are nullable; UI leaves them empty by default.
- The secondary‑image UI currently shows a plain list of thumbnails; a more expressive carousel would improve UX (see improvement proposal).
- No validation messages for exceeding file size – backend returns 400, UI currently shows generic error toast; consider specific size feedback.

**Action items**
1. Add explicit file‑size validation on the client (max 5 MB).
2. Introduce a visual carousel for secondary images.
3. Ensure focus moves to the first invalid field on submit for better accessibility.
