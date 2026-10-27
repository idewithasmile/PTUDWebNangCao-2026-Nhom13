# 06_API_FRONTEND_GAP_ANALYSIS

## Overview
This section identifies mismatches between the UI and backend APIs, missing endpoints, and security concerns.

| Gap ID | Description | Affected UI component / route | Backend endpoint (existing / missing) | Impact | Recommendation |
|--------|-------------|------------------------------|--------------------------------------|--------|----------------|
| G‑01 | **Publish / Unpublish** feature defined in SRS (R‑11) but no UI button or flow. | Admin dashboard (not present) / potential modal in Recipe Studio | `PATCH /api/v1/recipes/{id}/publish` exists | Admin cannot change publish state → incomplete business rule. | Add publish toggle in `RecipeStudioHeader` for admins, call the endpoint, update UI state. |
| G‑02 | **Admin KPI dashboard** required by SRS (R‑12) but no frontend pages. | `/admin` route missing | Multiple metrics APIs (`GET /api/v1/metrics/visits`, `GET /api/v1/metrics/recipe-count`) exist | Stakeholders cannot view operational metrics. | Create `AdminDashboard` component, fetch metrics, display charts. |
| G‑03 | **Owner‑based edit/delete** – backend checks ownership, but UI shows edit/delete for any recipe to authors. | `RecipeList` edit/delete buttons | Endpoint `PATCH /api/v1/recipes/{id}` checks owner; no UI restriction. | Potential security UI confusion. | Hide edit/delete buttons unless `recipe.ownerId === currentUser.id`. |
| G‑04 | **File size validation** – backend rejects files >5 MB with 400 error, UI shows generic toast. | Primary & secondary image upload in `RecipeForm` | `POST /api/v1/files/upload` validates size | Poor UX, user unaware of size limit. | Add client‑side file size check before upload, show specific error. |
| G‑05 | **Missing ARIA attributes** on modal dialogs (e.g., `DeleteRecipeModal`). | `DeleteRecipeModal` | No specific backend, but accessibility gap. | Users of assistive tech cannot navigate modal reliably. | Add `role="dialog"`, `aria-modal="true"`, focus trap. |
| G‑06 | **Incomplete error handling** – some API error responses are not mapped to user‑friendly messages (e.g., 401 on image upload). | Image upload flow in `RecipeForm` | `POST /api/v1/files/upload` returns 401 if auth expired. | Users see generic error, may think upload failed. | Detect 401, trigger re‑login flow, show clear message. |

### Summary
- **Critical gaps**: G‑01 (publish), G‑03 (owner UI), G‑06 (auth error handling). These should be addressed before release.
- **Low‑to‑medium gaps**: G‑02, G‑04, G‑05 – improve UX and accessibility.

All gaps are traceable to SRS items and have evidence in the codebase and E2E tests.
