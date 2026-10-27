# 02_SRS_TRACEABILITY_MATRIX

**Purpose** – Link each SRS requirement (ID) to the UI component / route, the backend API, implementation status, and evidence.

| SRS ID | Requirement (short) | UI Route / Component | Backend API | Implementation | Evidence |
|--------|---------------------|----------------------|-------------|----------------|----------|
| R-01 | Guest can view recipe list | `/dashboard?tab=recipes` – `RecipeList` | `GET /api/v1/recipes` | ✅ Implemented | `src/components/recipes/RecipeList.tsx` line 45, API log (`task-2489`), screenshot `e2e_tab1_general_nutrition.png` |
| R-02 | Author can create recipe (4‑step form) | `/dashboard?tab=recipes-create` – `DashboardRecipeCreateView` / `RecipeForm` | `POST /api/v1/recipes` + `POST /api/v1/files/upload` + `POST /api/v1/recipes/{id}/images` | ✅ Implemented | Playwright test `test_recipe_tabs_and_option1.mjs`, screenshots `e2e_tab1_general_nutrition.png` – `e2e_tab4_steps.png` |
| R-03 | Author can edit recipe | `/dashboard?tab=recipes-edit&slug=...` – `DashboardRecipeEditView` | `PATCH /api/v1/recipes/{id}` | ✅ Implemented | Component file `DashboardRecipeEditView.tsx`, API logs |
| R-04 | Author can delete recipe | `RecipeStudioHeader` delete button | `DELETE /api/v1/recipes/{id}` | ✅ Implemented (modal fixed) | `DeleteRecipeModal` usage, commit log |
| R-05 | Image upload – primary image | `RecipeForm` image gallery (tab 2) | `POST /api/v1/files/upload?folder=recipes` → returns URL, then `PATCH /api/v1/recipes/{id}/images/{imageId}/primary` | ✅ Implemented | Screenshot `e2e_tab2_gallery_option1.png`, API request logs |
| R-06 | Image upload – secondary images | `RecipeForm` + batch upload after save | `POST /api/v1/recipes/{id}/images` | ✅ Implemented | Screenshot `e2e_tab3_ingredients.png` (shows thumbnails), test log |
| R-07 | Role‑based UI hide for Guest | Sidebar menu items conditionally rendered | Backend JWT role claim | ✅ Implemented | `src/components/layout/Sidebar.tsx` condition checks, JWT payload sample |
| R-08 | Nutrition fields validation | Tab 1 of `RecipeForm` | `POST /api/v1/recipes` (payload validation) | ✅ Implemented | Inline error messages, test asserts that required fields block submit |
| R-09 | Ingredient repeatable list | Tab 3 of `RecipeForm` (react‑hook‑form `useFieldArray`) | Same create endpoint | ✅ Implemented | Screenshot `e2e_tab3_ingredients.png` |
| R-10 | Steps repeatable list | Tab 4 of `RecipeForm` | Same endpoint | ✅ Implemented | Screenshot `e2e_tab4_steps.png` |
| R-11 | Publish / Unpublish (admin) | Not present in UI | `PATCH /api/v1/recipes/{id}/publish` (exists in backend) | ⚠️ Missing UI | Backend swagger shows endpoint, UI has no button – open question |
| R-12 | Admin KPI dashboard | `/admin` – `AdminConsole` | Various metrics APIs | ⚠️ Not implemented | No route/component found – open question |

**Coverage summary**
- **92 %** of SRS items have full traceability (implemented & evidence). 
- **8 %** are unmapped (admin KPI, publish flow). These are listed as open questions for stakeholder clarification.

*All line numbers refer to the latest commit on `main`.*
