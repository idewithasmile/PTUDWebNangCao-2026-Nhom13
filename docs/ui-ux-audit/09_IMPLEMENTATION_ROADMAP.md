# 09_IMPLEMENTATION_ROADMAP

## Phases & Milestones
| Phase | Scope | Target files / components | Backend impact | Effort (person‑days) | Duration (weeks) | Entry criteria | Exit criteria |
|-------|-------|--------------------------|----------------|----------------------|------------------|----------------|--------------|
| **0 – Audit & Planning** | Finalise audit, agree on approach C | All audit markdowns | – | 2 | 1 | Audit signed off | Roadmap approved |
| **1 – Design‑System Foundations** | Create UI library (`src/components/ui/*`), colour/spacing tokens, accessible primitives (Button, Input, Modal, Toast, Tab, Stepper, Carousel). | `ui/` components, `theme.ts` | No API change | 5 | 1‑2 | Design‑system repo created | Components reusable in existing screens |
| **2 – Refactor Recipe Wizard** | Replace current `RecipeForm` tabs with `Tab`/`Stepper` from design‑system, integrate `Carousel` for secondary images, add client‑side file‑size validation, improve focus handling. | `RecipeForm.tsx`, related CSS | No API change | 3 | 1 | Design‑system ready | E2E test passes, UI matches spec |
| **3 – Admin Features** | Implement Publish toggle, Admin KPI dashboard, owner‑based edit/delete UI restrictions. | `RecipeStudioHeader.tsx`, new `AdminDashboard.tsx`, `Sidebar.tsx` updates | Add/extend endpoints for KPI if needed (already exist) | 4 | 1‑2 | Phase 2 complete | Admin UI functional, role checks verified |
| **4 – Accessibility & polish** | Add ARIA roles to modals, focus trap, keyboard navigation for tabs/stepper/carousel, improve contrast where needed. | Updated components, CSS | – | 2 | 1 | Phase 3 complete | Accessibility audit passes (axe core) |
| **5 – Testing & CI** | Expand Playwright suite to cover new admin UI, publish flow, owner restrictions, accessibility checks. Add unit tests for design‑system components. | `frontend/tests/e2e/*`, `frontend/tests/unit/*` | – | 3 | 1 | Phase 4 complete | All tests pass on CI pipeline |
| **6 – Documentation & Handoff** | Update README, style guide, handover docs, version bump. | `README.md`, `docs/ui-ux-audit/` | – | 1 | 0.5 | All code merged to `main` | Docs published, stakeholders sign‑off |

### Overall timeline
- **Total effort:** ~20 person‑days.
- **Projected calendar:** 6‑8 weeks (including buffer for review & bug fixes).
- **Critical path:** Phases 1 → 2 → 3 must be completed before extensive testing.

### Risk mitigation
- **Design‑system regressions** – isolate library in its own folder, run component visual regression tests.
- **Backend‑frontend contract drift** – keep DTO definitions in sync; generate TypeScript types from OpenAPI spec.
- **Scope creep** – stick to SRS items; any extra feature must be captured as a future enhancement.

---
*All dates are tentative and assume a two‑person team (frontend + full‑stack). Adjust according to resource availability.*
