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

