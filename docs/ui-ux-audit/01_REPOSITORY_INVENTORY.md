# 01_REPOSITORY_INVENTORY

## Repository tree (excerpt)
```
PTUDWebNangCao_2026_Nhom13/
├─ backend/
│  ├─ src/
│  │  ├─ Presentation/
│  │  │  └─ CulinaryBlog.API.csproj
│  │  └─ Application/
│  │      └─ Features/Recipes/...
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ recipes/RecipeForm.tsx
│  │  │  ├─ dashboard/views/DashboardRecipeCreateView.tsx
│  │  │  ├─ dashboard/views/DashboardRecipeEditView.tsx
│  │  │  └─ dashboard/studio/RecipeStudioHeader.tsx
│  │  ├─ lib/services/file-service.ts
│  │  ├─ lib/services/recipe-service.ts
│  │  └─ app/login/page.tsx
│  ├─ pages/ (or app/ for Next.js 15)
│  ├─ public/
│  ├─ tests/e2e/test_recipe_tabs_and_option1.mjs
│  └─ package.json
├─ infrastructure/docker-compose.yml
├─ docs/
│  └─ ui-ux-audit/   (this folder)
└─ README.md
```

## Key technologies
- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS, react‑hook‑form, react‑query, axios wrapper (`apiClient`).
- **Backend**: .NET 10 Minimal APIs, C# 12, Entity Framework Core, PostgreSQL 16, MinIO for file storage, Redis, Hangfire, Serilog, OpenTelemetry.
- **State management**: Local component state + react‑hook‑form; data fetching via custom hooks (`useRecipes`, `useCategories`).
- **Styling**: Tailwind utility classes, custom theme (dark sidebar, orange primary, blue navigation). 
- **Testing**: Playwright E2E, Jest unit tests (few), lint via ESLint + Prettier, type‑checking via `tsc --noEmit`.

## Routing overview (frontend)
| Route | Component | Role(s) | Description |
|-------|-----------|---------|-------------|
| `/login` | `LoginPage` | Guest | Authentication form.
| `/dashboard` | `DashboardLayout` | Author/Admin | Main container with sidebar.
| `/dashboard?tab=recipes` | `RecipeList` | Author/Admin | List of recipes.
| `/dashboard?tab=recipes-create` | `DashboardRecipeCreateView` (uses `RecipeForm`) | Author | Create new recipe (4‑step UI).
| `/dashboard?tab=recipes-edit&slug=...` | `DashboardRecipeEditView` | Author | Edit existing recipe.
| `/dashboard?tab=categories` | `CategoryManagement` | Admin | Manage recipe categories.
| `/profile` | `UserProfile` | Author/Admin | View / edit personal info.
| `/admin` | `AdminConsole` | Admin | System health, logs, user admin.

## Backend endpoints (selected)
| Method | URL | Handler | Role required |
|--------|-----|---------|---------------|
| `POST /api/v1/auth/login` | AuthController.Login | Guest → JWT |
| `GET /api/v1/recipes` | RecipesController.GetAll | Author/Admin |
| `POST /api/v1/recipes` | RecipesController.Create | Author |
| `PATCH /api/v1/recipes/{id}` | RecipesController.Update | Author |
| `POST /api/v1/files/upload?folder=recipes` | FileController.Upload | Author |
| `POST /api/v1/recipes/{id}/images` | RecipeImagesController.UploadSecondary | Author |
| `PATCH /api/v1/recipes/{id}/images/{imageId}/primary` | RecipeImagesController.SetPrimary | Author |
| `DELETE /api/v1/recipes/{id}` | RecipesController.Delete | Author |
| `GET /api/v1/categories` | CategoriesController.GetAll | Author/Admin |

## Build & run commands
- Frontend dev server: `npm run dev` (localhost:3000)
- Backend API: `dotnet run --project backend/src/Presentation/CulinaryBlog.API.csproj` (localhost:5001)
- Docker compose: `docker compose up -d` (starts minio, postgres, redis, seq, mailhog).

*All information above is extracted from the current repository; no code modifications were performed.*
