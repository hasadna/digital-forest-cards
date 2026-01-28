---
name: image-review-dashboard
overview: Add an internal review dashboard for uploaded images with status filtering and municipality lookups, using a dedicated git worktree/branch and new backend support for pending/skipped statuses and reviewer-only updates.
todos:
  - id: worktree-setup
    content: Create worktree + branch and add plan.md
    status: pending
  - id: db-migration
    content: Add pending/skipped enum + RLS updates
    status: pending
  - id: edge-function
    content: Build review-media edge function with secret
    status: pending
  - id: frontend-dashboard
    content: Add review page, filters, and status update UI
    status: pending
  - id: upload-defaults
    content: Ensure uploads default to pending
    status: pending
isProject: false
---

# Image Review Dashboard Plan

## Context

- `tree_media` status enum and defaults are defined in the initial migration ([`supabase/migrations/20260102222027_tree_media.sql`](/Users/jhalperin/digital-forest-cards/supabase/migrations/20260102222027_tree_media.sql)), currently `approved | flagged | deleted | test` with default `approved`.
- Frontend types use `TreeMediaStatus` in [`src/types/tree.ts`](/Users/jhalperin/digital-forest-cards/src/types/tree.ts) and the main router is in [`src/App.tsx`](/Users/jhalperin/digital-forest-cards/src/App.tsx).
- Tree municipality data comes from the public API in [`src/services/treeApi.ts`](/Users/jhalperin/digital-forest-cards/src/services/treeApi.ts).
- Supabase client uses anon key only ([`src/lib/supabaseClient.ts`](/Users/jhalperin/digital-forest-cards/src/lib/supabaseClient.ts)), so reviewer actions will go through a new Edge Function protected by a shared secret.

## Plan

1. **Create dedicated worktree and branch**

- Create a new git worktree (repo parent directory) and a new branch (e.g. `review-dashboard`).
- Open the worktree as the active workspace.
- Create `plan.md` inside that worktree and copy this plan into it.

2. **Database + RLS updates (Supabase migration)**

- Add a new migration to extend `tree_media_status` with `pending` and `skipped`, and change the column default to `pending`.
- Update RLS policies so public insert allows `pending` (uploads) but public select remains `approved` (optionally `test` if you want existing behavior).
- Keep reviewer access for all statuses via a service-role Edge Function (no change to public RLS for review access).

3. **Backend review endpoints (Edge Function)**

- Add a new Supabase Edge Function (e.g. `review-media`) that uses the service role key.
- Support:
 - **List**: filter by `status` (default `pending`) and optionally by `municipality` by accepting a list of `tree_id`s and returning media rows (pagination support if needed).
 - **Update**: set `status` for a given media `id`.
- Protect the function with a shared secret header (configured via environment variable) and validate input.

4. **Frontend types + data services**

- Extend `TreeMediaStatus` in [`src/types/tree.ts`](/Users/jhalperin/digital-forest-cards/src/types/tree.ts) to include `pending` and `skipped`.
- Add a new client service for the review API (calls the Edge Function with the shared secret header).
- Add a municipality lookup helper that batches `tree_id` lookups via [`src/services/treeApi.ts`](/Users/jhalperin/digital-forest-cards/src/services/treeApi.ts) and caches results to avoid repeated calls.

5. **Dashboard UI + routing**

- Create a new page (e.g. `src/pages/ReviewDashboard.tsx`) with:
 - Status filter (default `pending`) and municipality filter.
 - List of images with `id`, image preview, municipality, current status.
 - Status update control per row (select + update action or inline update).
- Add a route for the dashboard in [`src/App.tsx`](/Users/jhalperin/digital-forest-cards/src/App.tsx).
- Provide minimal empty/loading/error states and paging if the list can be large.

6. **Upload default behavior**

- Ensure `record-upload` and any upload paths rely on the DB default (`pending`) unless explicitly set, and update any explicit status defaults in edge functions.

7. **Basic verification**

- Manual sanity check: upload image → status `pending`; dashboard filters work; status update reflects in DB and UI.
## Digital Forest Cards MVP Plan

### Goal
Deliver a mobile-first “תעודת זהות לעץ” interface that mirrors Ya״ד branding, highlights municipal tree IDs, and lets residents view trustworthy public data while hinting at future civic contributions.

### Key Assumptions
- Users look up a specific physical tree in the field using the municipal tag (“מזהה רשות”), not the plus-code (“מזעץ”).
- Trust comes from recognizable information (photo, street, municipality) even if already known.
- Design should closely follow Ya״ד colors/logo to feel official.

### Dependencies & References
- **API/Data**: `src/services/treeApi.ts` & `API_FIELDS.md`
- **Palette** (from https://app.digital-forest.org.il/trees):
  - Primary: `#7B1FA2`
  - Accent: `#69F0AE`
  - Success track: `#43A047`, handles `#81C784`
  - Warn: `#F44336`
  - Surfaces: Toolbar `#212121`, panels `#424242`, background `#303030`
  - Text: primary `#FFFFFF`, secondary `rgba(255,255,255,0.7)`
- **Components to touch**: `TreeCard`, search UI (likely `SearchBar`/landing components), layout wrappers, copy sections.

### MVP Feature Work Breakdown

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | Tree Card theming | Apply Ya״ד color tokens, typography tweaks, and spacing to `TreeCard`. | DONE |
| 2 | Primary info layout | Reorder data block (Species, Age, Trunk Diameter, Height, Canopy Diameter). Note: Canopy Diameter, not Area. | DONE |
| 3 | Municipal ID-first identity | Title: "מזעץ <MunicipalID>" (Keep "Maza'at" label). Tag: "עץ מזוהה". Share action. | DONE |
| 4 | Search by municipal ID | Search by Municipal ID. Label: "מזהה רשות". Helper: "מספר העץ שמחובר לעץ". No result: "העץ לא נמצא? להוספת העץ?" (TBD). | DONE |
| 5 | Spatial info section | Municipality, Street, Block/Parcel (Gush/Helka), Coordinates. | DONE |
| 6 | Data sources & disclaimer | Render sources list. Disclaimer: "האתר מציג מידע ציבורי...". Feedback: "גרסת פיילוט...". | DONE |
| 7 | Photo block | Show photo if available. If not, "Add Photo" CTA (TBD). | DONE |
| 8 | Header | Logo, Site Name: "יער עירוני דיגיטלי", Slogan: "לראות מידע ציבורי - להוסיף מידע אזרחי". | DONE |

### Future Work (TBD / Out of Scope for MVP)
- **About Page (אודות):** Explanation about the site.
- **Add Tree Functionality:** "להוספת העץ" flow.
- **Add Photo Functionality:** Uploading a new photo.
- **Add Coordinates (User Location):** "הוספת נ.צ ע"י משתמש באמצעות מיקם".
- **Feedback/Contact Form (106):** Connection to 106/Whatsapp or a free text form.
- **Mapping/Creating Municipal ID:** "שימוש באתר למיפוי ויצירת מזהה רשות".

### Implementation Notes
- “Add photo” CTA should be non-functional yet (maybe disabled button) with note “TBD”.
- No new backend calls required; leverage `transformTreeData` output.

### Risks / Unknowns
- **Photo upload flow**: not specified; ensure CTA communicates future availability.
- **106/feedback integrations**: copy only for now to avoid dead actions.
- **Geolocation add-point**: marked TBD; leave UI affordance without functionality.

