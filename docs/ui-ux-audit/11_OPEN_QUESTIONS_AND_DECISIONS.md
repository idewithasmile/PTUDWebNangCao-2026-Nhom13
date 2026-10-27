# 11_OPEN_QUESTIONS_AND_DECISIONS

## Outstanding questions requiring stakeholder clarification
| ID | Question | Related SRS ID(s) | Impact if not addressed | Proposed decision path |
|----|----------|--------------------|--------------------------|-----------------------|
| Q‑01 | Should the **Publish / Unpublish** feature be exposed as a toggle on the recipe studio header, a separate modal, or a dedicated publish page? | R‑11 | Without UI, admins cannot change recipe visibility, breaking the publishing workflow defined in SRS. | Recommend a toggle button in `RecipeStudioHeader` for admins; confirm with product owner. |
| Q‑02 | What specific **KPI metrics** are required on the admin dashboard (e.g., daily visits, recipe count, error rate, average upload size)? | R‑12 | Missing metrics could lead to incomplete monitoring; risk of unknown performance issues. | Request list of KPI cards and data sources; proceed to implement based on that list. |
| Q‑03 | Are there any **role‑based restrictions** on authors editing recipes created by other authors, or is cross‑author editing allowed? | (Implicit) | Current UI allows any author to edit any recipe, which may violate data ownership policies. | Clarify policy; if ownership matters, add UI check `recipe.ownerId === currentUser.id`. |
| Q‑04 | What is the maximum number of **secondary images** a recipe can have? | (Implicit) | UI currently allows unlimited uploads; backend may have limits causing 400 errors. | Define a limit (e.g., 10 images) and enforce client‑side validation. |
| Q‑05 | Should the **recipe wizard** switch to a vertical stepper on screens <640 px, or keep the tab layout with horizontal scrolling? | UI/UX improvement | Mobile usability may suffer if tabs remain cramped. | Preference for vertical stepper on small screens; confirm with design lead. |
| Q‑06 | Is there a requirement for **image ordering** (drag‑and‑drop to set primary image) beyond the current replace‑button method? | (Implicit) | Users may want to reorder secondary images; lacking this could affect UX. | Ask if drag‑and‑drop reorder is needed; if so, plan component. |
| Q‑07 | Are there any **internationalisation** (i18n) needs beyond Vietnamese (e.g., English fallback) for the UI strings? | (Implicit) | Future expansion may require i18n; current strings are hard‑coded. | Confirm current scope; if future i18n is planned, factor in localisation framework. |
| Q‑08 | Do we need **audit logging** UI for recipe changes (who edited what and when)? | (Implicit) | May be required for compliance; not currently visible. | Clarify with compliance team; if needed, add a history tab. |
| Q‑09 | What is the expected **error handling** for authentication expiry during image upload (401)? Should the UI automatically redirect to login or show a modal? | (Implicit) | Current generic toast is ambiguous for users. | Decide on auto‑redirect to login with preserved workflow state. |

## Decision log (to be updated after stakeholder response)
- **Publish toggle** – pending confirmation (Q‑01).
- **KPI list** – pending (Q‑02).
- **Author edit ownership** – pending (Q‑03).
- **Secondary image limit** – pending (Q‑04).
- **Mobile wizard layout** – pending (Q‑05).
- **Image ordering** – pending (Q‑06).
- **Internationalisation** – pending (Q‑07).
- **Audit logging UI** – pending (Q‑08).
- **Auth expiry handling** – pending (Q‑09).

*All open questions are tracked here and will be revisited after stakeholder review of the audit report.*
