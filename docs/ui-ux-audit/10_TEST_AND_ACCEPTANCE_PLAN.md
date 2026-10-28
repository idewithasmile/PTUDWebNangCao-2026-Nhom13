# 10_TEST_AND_ACCEPTANCE_PLAN

## Objectives
- Verify that the UI satisfies all SRS requirements.
- Ensure role‑based access control works correctly.
- Confirm accessibility compliance (WCAG AA).
- Validate performance of image uploads and recipe wizard.
- Detect regressions introduced by the design‑system upgrade.

## Test suites
| Suite | Scope | Tools | Key test cases |
|-------|-------|-------|----------------|
| **E2E Functional** | Full recipe creation/edit flow, publish toggle, admin KPI dashboard, owner‑based edit/delete restrictions. | Playwright (Chromium) | 1. Guest can view recipe list but cannot see create button. 2. Author completes 4‑step wizard, uploads primary & secondary images, sees recipe in studio. 3. Admin toggles publish state and sees badge update. 4. Admin navigates to KPI dashboard and sees charts with data. |
| **Component Unit** | UI library components (Button, Input, Modal, Tab, Stepper, Carousel). | Jest + React Testing Library | Render each component with variants, verify ARIA attributes, focus handling, error states. |
| **API Contract** | Verify frontend DTOs match backend OpenAPI spec. | Dredd or openapi‑generator test harness | All CRUD endpoints return expected status codes, validation errors, and data shapes. |
| **Accessibility** | Keyboard navigation, screen‑reader friendliness, colour contrast. | axe‑core (Playwright integration) | No violations > AA level; focus order matches logical flow; modals have `role="dialog"`. |
| **Performance** | Image upload size limits, page load time, API response latency. | Lighthouse CI, custom script measuring upload time | Primary image upload ≤ 1 s for ≤5 MB; page FCP < 1.5 s on a typical dev machine. |
| **Security** | Authentication handling, CSRF, XSS protection. | OWASP ZAP automated scan | No insecure cookies, no reflected XSS on form fields, 401 triggers re‑login flow. |
| **Regression** | Ensure existing functionality remains after design‑system integration. | Playwright baseline snapshots comparison | Screenshots of recipe list, dashboard, and login match previous baseline (within 2 % pixel diff). |

## Acceptance criteria
1. **Functional completeness** – 100 % of SRS items marked ✅ in the traceability matrix have passing automated tests.
2. **Accessibility** – axe score ≥ 95 % for all major pages (recipe wizard, admin dashboard, login).
3. **Performance** – Lighthouse performance > 0.85 for the recipe creation page.
4. **Security** – No high‑severity findings from ZAP scan.
5. **Documentation** – Test reports are stored under `docs/ui-ux-audit/test-reports/` and linked in the audit summary.

## Test artefacts location
- Playwright scripts: `frontend/tests/e2e/`
- Jest tests: `frontend/tests/unit/`
- Test reports: `docs/ui-ux-audit/test-reports/`
- Accessibility snapshots: `docs/ui-ux-audit/accessibility/`

## Execution plan
1. Run unit tests (`npm test`).
2. Run E2E suite (`npx playwright test`).
3. Run accessibility checks (`npx playwright test --project=chromium --grep @accessibility`).
4. Run performance audit (`npm run lighthouse`).
5. Run security scan (`zap-baseline.py -t http://localhost:3000`).
6. Collect all reports and attach to audit artifact.
