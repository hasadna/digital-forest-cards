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
| 1 | Tree Card theming | Apply Ya״ד color tokens, typography tweaks, and spacing to `TreeCard`. | TODO |
| 2 | Primary info layout | Reorder data block (species link placeholder, age, trunk diameter, height, crown diameter). | TODO |
| 3 | Municipal ID-first identity | Title uses “מזהה רשות”, keep “עץ מזוהה” badge, share action. | TODO |
| 4 | Search by municipal ID | Update search input label/placeholder, helper text, and no-result CTA. | TODO |
| 5 | Spatial info section | Group municipality, street, parcel, coordinates with new hierarchy. | TODO |
| 6 | Data sources & disclaimer | Render sources list, disclaimer copy, and feedback prompt. | TODO |
| 7 | Photo block | Show photo when available, otherwise show “add photo” CTA placeholder. | TODO |

### Implementation Notes
- Introduce a centralized theme (CSS variables or Tailwind config) to reuse Ya״ד palette.
- Species link should point to catalog (URL TBD) but include placeholder anchor now.
- “Add photo” CTA should be non-functional yet (maybe disabled button) with note “TBD”.
- No new backend calls required; leverage `transformTreeData` output.

### Risks / Unknowns
1. **Species catalog URL**: waiting for exact mapping; placeholder link may be temporary.
2. **Photo upload flow**: not specified; ensure CTA communicates future availability.
3. **106/feedback integrations**: copy only for now to avoid dead actions.
4. **Geolocation add-point**: marked TBD; leave UI affordance without functionality.

### Next Steps
1. Define theme tokens (CSS vars / Tailwind) matching palette.
2. Update `TreeCard` structure + content order.
3. Refresh search UX copy and CTA line.
4. Add disclaimer + feedback blocks to page/footer.

