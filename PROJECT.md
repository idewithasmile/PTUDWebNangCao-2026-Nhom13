# Project: Authentic Vietnamese Culinary Dataset & Step-Matched Imagery Seeding

## Architecture
- **Backend**: ASP.NET Core 9 Clean Architecture (Domain, Application, Infrastructure, WebAPI).
  - Domain: `Recipe`, `RecipeStep` (`ImageUrl`), `RecipeIngredient`, `RecipeImage`, `Category`.
  - Persistence: Entity Framework Core 9 on PostgreSQL (`culinary_postgres` / `localhost:5433`).
  - Storage: MinIO S3 Object Storage (`localhost:9000`, bucket `culinary-blog`).
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS v4.
  - Media resolution: `resolveMediaUrl` handles relative paths `/culinary-blog/...` via reverse proxy rewrite or MinIO direct origin.
  - UI Components: `RecipeDetailView`, `RecipeStepsList` (step-by-step cooking instructions with action illustrations), `CookingModeModal` (hands-free cooking).
- **Automation & Verification**:
  - Python scripts (`scripts/verify_system_integrity.py`, `scripts/validate_dataset.py`, image ingestion pipelines).
  - Playwright E2E browser test suites (`frontend/tests/e2e/`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Master Dataset Synthesis | Construct `recipes_master_dataset.json` with >=10 categories, >=50 authentic recipes, >=5 quantified ingredients, >=3-5 steps with step image URLs | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Unique Recipe Cover Images | Ensure 100% of recipe primary cover images are distinct and match actual dishes | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Step-Matched Action Imagery | Map real cooking action images (prep, season, cook, plate) to each step from Điện Máy XANH Vào Bếp / Cookpad | M1 | ORIGINAL_REQUEST §R2 |
| 4 | MinIO Clean Slate Purge | Purge old sample, random, or placeholder images in `culinary-blog` bucket | M2 | ORIGINAL_REQUEST §R3 |
| 5 | MinIO Media Ingestion & Public Policy | Download authentic images from CDN, optimize, upload to MinIO, enforce anonymous public read, verify HTTP 200 | M2 | ORIGINAL_REQUEST §R2 |
| 6 | PostgreSQL Clean Slate Purge | Cascade truncate legacy tables (`RecipeImages`, `RecipeIngredients`, `RecipeSteps`, `Recipes`) to purge old data | M3 | ORIGINAL_REQUEST §R3 |
| 7 | Relational Seeding via Domain Model | Execute `CulinaryBlogSeeder` to ingest master dataset into PostgreSQL with FK integrity, authors, published status | M3 | ORIGINAL_REQUEST §R3 |
| 8 | Frontend Step Image Display | Enhance `RecipeStepsList.tsx` and `CookingModeModal.tsx` with `resolveMediaUrl`, responsive aspect ratio, fallback | M4 | ORIGINAL_REQUEST §R4 |
| 9 | Media URL Normalization | Fix `resolveMediaUrl` in `frontend/src/lib/utils.ts` to handle paths without leading slash | M4 | ORIGINAL_REQUEST §R4 |
| 10 | System Integrity Verification Suite | Update `verify_system_integrity.py` to audit all Phase 2 criteria (DB, MinIO HTTP 200, no duplicate covers, clean slate) | M4 | ORIGINAL_REQUEST §AC |
| 11 | Playwright E2E Browser Testing | Verify recipe detail page rendering with step images and zero broken images via Playwright | M4 | ORIGINAL_REQUEST §AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Master Dataset & Step Imagery Construction | Sourcing, structuring, and validating `recipes_master_dataset.json` (>=10 categories, >=50 authentic recipes, unique covers, real step image URLs) | none | DONE |
| M2 | MinIO Clean Slate & Authentic Media Upload | Purging legacy MinIO bucket, downloading genuine images from CDN, uploading to MinIO, validating HTTP 200 & JPEG magic bytes | M1 | DONE |
| M3 | Database Clean Slate & Seeder Execution | Cascade truncating PostgreSQL tables, executing `CulinaryBlogSeeder`, verifying relational integrity, FKs, and counts | M1, M2 | DONE |
| M4 | Frontend UX Polish & Full Integrity Verification | Updating Frontend `RecipeStepsList.tsx`, `CookingModeModal.tsx`, `utils.ts`, updating `verify_system_integrity.py`, executing E2E tests | M2, M3 | IN_PROGRESS |

## Interface Contracts
### Dataset ↔ Seeder Contract (`recipes_master_dataset.json` ↔ `CulinaryBlogSeeder.cs`)
- Root structure: `{"categories": [...], "recipes": [...]}`
- Category object: `{"id": UUID, "name": string, "slug": string, "description": string, "imageUrl": string, "displayOrder": int}`
- Recipe object:
  - `id`: UUID string
  - `title`: string
  - `slug`: string (unique)
  - `description`: string
  - `categorySlug`: string (must match a category slug)
  - `prepTimeMinutes`: int > 0
  - `cookTimeMinutes`: int > 0
  - `servings`: int > 0
  - `difficulty`: string ("Easy" | "Medium" | "Hard")
  - `status`: "Published"
  - `ingredients`: array of `{"name": string, "quantity": decimal > 0, "unit": string, "notes": string}`
  - `steps`: array of `{"stepNumber": int >= 1, "title": string, "description": string, "timerMinutes": int?, "imageUrl": string}`
  - `images`: array of `{"url": string, "isPrimary": bool, "displayOrder": int}` (exactly 1 `isPrimary: true`, unique URL across recipes)
  - `nutrition`: `{"calories": int > 0, "protein": decimal, "carbohydrates": decimal, "fat": decimal, "fiber": decimal, "sodium": decimal}`

### API ↔ Frontend Contract
- `RecipeDetailDto.Steps`: array of `RecipeStepDto`
- `RecipeStepDto`: `{"id": UUID, "stepNumber": int, "title": string, "description": string, "timerMinutes": int?, "imageUrl": string?}`
- MinIO URL convention:
  - Category banner: `/culinary-blog/categories/{slug}.jpg`
  - Recipe Primary/Gallery: `/culinary-blog/recipes/{recipeId}/{guid}.jpg`
  - Recipe Step illustration: `/culinary-blog/recipes/{recipeId}/steps/{stepNumber}.jpg`

## Code Layout
- `backend/src/Domain/Entities/RecipeStep.cs`: Domain entity for steps with `ImageUrl`.
- `backend/src/Infrastructure/Data/Datasets/recipes_master_dataset.json`: Master JSON dataset.
- `backend/src/Infrastructure/Data/Seeders/CulinaryBlogSeeder.cs`: Database seeder.
- `frontend/src/lib/utils.ts`: `resolveMediaUrl` helper.
- `frontend/src/components/recipes/RecipeStepsList.tsx`: Recipe step list UI.
- `frontend/src/components/recipes/CookingModeModal.tsx`: Full-screen cooking mode.
- `scripts/verify_system_integrity.py`: Automated integrity verification test suite.
- `scripts/`: Image downloading and MinIO ingestion automation scripts.
- `frontend/tests/e2e/`: Playwright E2E browser tests.
