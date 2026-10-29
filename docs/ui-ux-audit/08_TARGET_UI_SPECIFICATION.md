# 08_TARGET_UI_SPECIFICATION

## Design‑system tokens
| Token | Value | Usage |
|-------|-------|-------|
| **Color Primary** | `#F97316` (orange‑500) | Primary buttons, call‑to‑action links |
| **Color Accent** | `#3B82F6` (blue‑500) | Navigation active state, secondary buttons |
| **Color Background** | `#1F2937` (gray‑800) | Sidebar background |
| **Color Surface** | `#FFFFFF` (white) | Main content area |
| **Text Primary** | `#111827` (gray‑900) | Body text |
| **Text on Primary** | `#FFFFFF` | Button label on primary |
| **Border Radius** | `0.5rem` (8px) | Buttons, inputs, cards |
| **Spacing Unit** | `0.25rem` (4px) | Margin/padding scale (Tailwind `space-x-1` etc.) |
| **Font Family** | `"Inter", system-ui, sans-serif` | Headings & body |
| **Font Sizes** | `text-sm` (0.875rem), `text-base` (1rem), `text-lg` (1.125rem), `text-xl` (1.25rem), `text-2xl` (1.5rem) | Hierarchy |
| **Focus Outline** | `2px solid #3B82F6` | Keyboard focus visible state |

## Component library (to be placed in `src/components/ui/`)
1. **Button** – variants: `primary`, `secondary`, `danger`, `link`. Handles loading state.
2. **Input** – text, number, textarea, with built‑in error display.
3. **Select** – custom styled dropdown, supports placeholder.
4. **RadioGroup** – for difficulty selection.
5. **Modal** – accessible dialog with ARIA roles, focus trap.
6. **Toast** – auto‑dismiss notifications, success/error variants.
7. **Tab** – keyboard‑navigable tabs (arrow keys, Home/End).
8. **Stepper** – vertical stepper for mobile (used instead of tabs on <640px).
9. **Carousel** – scrollable thumbnail strip for secondary images.
10. **Badge** – status badge (e.g., `Published`, `Draft`).
11. **Table** – reusable data table with sortable columns.

## Screen specifications
### 1. Dashboard (main layout)
- **Sidebar** (fixed, dark) with icons + labels. Active link highlighted in blue, hover in lighter blue.
- **Header** – user avatar, logout button, optional breadcrumb.
- **Content area** – white surface, max‑width `4xl`.
- **Responsiveness** – sidebar collapses into hamburger at `lg` breakpoint.

### 2. Recipe List
- Table columns: Title, Category, Author, Status badge, Created‑at, Actions (Edit, Delete).
- Pagination control bottom, 10 items per page.
- Search bar with debounce (300 ms).

### 3. Recipe Create / Edit (Wizard)
- **Desktop** – 4 tabs (General, Images, Ingredients, Steps) visible at top.
- **Mobile** – vertical **Stepper** component, each step expands full width.
- Form fields use `Input`, `Select`, `RadioGroup` from design system.
- Image upload area: primary image preview with replace button; secondary images displayed in a **Carousel** with remove icons.
- Validation messages appear below inputs, red border on error.
- Save button disabled until form valid; shows spinner on submit.

### 4. Recipe Studio (post‑create view)
- Header with recipe title, **Publish toggle** (admin only), Edit and Delete buttons.
- Tabs for Overview, Ingredients, Steps, Nutrition – reuse `Tab` component.
- Breadcrumb back to Dashboard.

### 5. Category Management (Admin)
- Simple list with Add/Edit modal, color picker for category colour.
- Delete confirmation modal.

### 6. Admin Dashboard / KPI
- Cards for: Total Recipes, Active Users, Daily Visits, Error Rate.
- Charts: Line chart for visits over last 30 days, bar chart for recipes per category.
- Uses `Chart.js` wrapped in a `Chart` component.

### 7. Authentication (Login)
- Centered card, email & password fields, submit button.
- Error toast on auth failure.
- Links for “Forgot password” (future).

## Accessibility notes
- All interactive elements have focus outlines (`focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`).
- Buttons have `aria-label` where icon‑only.
- Modals include `role="dialog"`, `aria-modal="true"`, and focus trap.
- Color contrast ratios meet WCAG AA (≥4.5:1 for normal text).
- Keyboard navigation supported for tabs, stepper, carousel (arrow keys).

## Asset placeholders
- Icons from Heroicons – placed in `public/icons/`.
- Logo `public/logo.svg`.
- Sample screenshots linked from existing artifacts (e.g., `e2e_tab1_general_nutrition.png`).

*All specifications reference the existing codebase; implementation will replace current UI components with the new design‑system primitives.*
