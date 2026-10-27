# 05_ROLE_PERMISSION_AUDIT

## Roles in the system
- **Guest** – Unauthenticated visitor.
- **Author** – Authenticated user who can create, edit, delete own recipes, view categories.
- **Admin** – Full access, including category management, user management, system health dashboards.

## Permission matrix (frontend UI enforcement)
| Feature | Guest | Author | Admin |
|---------|-------|--------|-------|
| View recipe list | ✅ (read‑only) | ✅ (full) | ✅ (full) |
| Create recipe | ❌ | ✅ | ✅ |
| Edit own recipe | ❌ | ✅ | ✅ |
| Delete own recipe | ❌ | ✅ (via modal) | ✅ |
| Manage categories | ❌ | ❌ | ✅ |
| View admin console (KPIs, logs) | ❌ | ❌ | ✅ |
| Publish / Unpublish recipe | ❌ | ❌ | ✅ |
| Access profile page | ❌ | ✅ | ✅ |
| Access health checks (Seq, Hangfire) | ❌ | ❌ | ✅ |

## Frontend enforcement details
- **Sidebar**: Links are conditionally rendered based on `user.role` (see `src/components/layout/Sidebar.tsx`).
- **Buttons / actions**: Buttons are hidden/disabled if the role does not meet the required permission (e.g., Delete button hidden for Guest).
- **Route protection**: `withAuth` HOC redirects unauthenticated users to `/login`. Admin routes have additional check `user.role === "Admin"`.

## Backend enforcement (policy attributes)
- Controllers use `[Authorize(Roles = "Author,Admin")]` for recipe create/edit/delete.
- Category endpoints `[Authorize(Roles = "Admin")]`.
- Admin console endpoints `[Authorize(Roles = "Admin")]`.
- Publish endpoint exists (`[Authorize(Roles = "Admin")]`) but no UI exposes it yet (open question).

## Gaps / observations
1. **Publish/Unpublish UI** – backend policy exists, UI missing (see open questions).
2. **Admin KPI dashboard** – no frontend component, though backend provides metrics APIs.
3. **Granular permission for editing others’ recipes** – not required by SRS but currently Authors can edit any recipe (backend checks ownership, UI does not hide edit button for others). This could be a security concern; recommend adding owner check UI.

**Recommendations**
- Add UI controls for publish/unpublish (admin only).
- Implement an admin KPI dashboard component.
- Ensure edit/delete buttons are only visible for recipe owners (Author role) – add conditional rendering based on `recipe.ownerId`.
