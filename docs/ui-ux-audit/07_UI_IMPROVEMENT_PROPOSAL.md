# 07_UI_IMPROVEMENT_PROPOSAL

## Three possible approaches

| Approach | Description | SRS Fit | UX Quality | Development Risk | Effort (person‑days) | Timeline (weeks) | Recommended? |
|----------|-------------|---------|------------|------------------|----------------------|-------------------|--------------|
| **A – Incremental tweaks** | Minor UI polish: fix contrast, improve focus outlines, add client‑side file‑size validation, replace thumbnail list with simple carousel component. | ✅ Covers all missing UI gaps (G‑01, G‑04, G‑05, G‑06) without adding new screens. | Medium – solves immediate pain points but does not address missing admin features. | Low – low risk, limited code changes. | 3 | 1 | ❌ |
| **B – Full redesign** | Redesign the entire recipe flow using a stepper component, adopt a new design system (e.g., Radix UI + Tailwind UI), rebuild admin console from scratch. | ✅ All SRS items satisfied, including KPI dashboard and publish flow. | High – modern, consistent UI/UX, improved accessibility. | High – large refactor, risk of regression, requires extensive testing. | 15 | 4 | ❌ |
| **C – Modular design‑system upgrade** *(recommended)* | Introduce a reusable design‑system library (`components/ui/*`) that defines colour tokens, typography, button variants, modal/dialog primitives, and a **recipe wizard** component that can be configured for create/edit. Add the missing admin KPI dashboard and publish toggle as separate modules that consume the same design‑system. | ✅ Meets 100 % of SRS (including currently unmapped items) while keeping existing functionality intact. | High – consistent look‑and‑feel, easier future extensions, improves accessibility with built‑in ARIA. | Medium – moderate refactor, but isolated to UI library; lower regression risk. | 8 | 2‑3 | ✅ |

## Why Approach C?
- **Scalability**: A design system provides a single source of truth for colours, spacing, and components, reducing duplication across the app.
- **Maintainability**: New features (e.g., admin KPI dashboard) can be built by reusing existing UI primitives.
- **Risk mitigation**: Most of the existing code (form logic, API integration) stays unchanged; only presentation layer is swapped.
- **Stakeholder value**: Addresses all identified gaps (publish, admin dashboard, accessibility) within a reasonable timeframe.

## High‑level plan for Approach C
1. Scaffold `frontend/src/components/ui/` with base components (Button, Input, Select, Modal, Toast, Tab, Stepper, Carousel).
2. Refactor `RecipeForm` to use the new UI primitives.
3. Implement **PublishToggle** component in `RecipeStudioHeader` for Admins.
4. Build **AdminDashboard** under `/admin` using chart components (e.g., Chart.js).
5. Add client‑side file validation and ARIA enhancements.
6. Run the existing E2E suite plus new tests (see Section 10).

---
*All recommendations are based on the evidence collected in earlier audit artifacts.*
