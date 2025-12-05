## Progress Log

### 2025-11-30

1. **Initialized MVP planning**
   - Created `plan.md` capturing goals, palette, feature breakdown, and risks.
   - Extracted Ya״ד color tokens from production site for reuse.

2. **Tracking setup**
   - Established `progress.md` to chronicle implementation steps and decisions.
   - Logged current status before beginning UI/theme work.

3. **Tree card theming + layout refresh**
   - Applied Ya״ד palette to the global design tokens (`src/index.css`) so Tailwind tokens match primary purple, mint accent, and dark surfaces.
   - Rebuilt `TreeCard` structure: municipal-ID-first header, share action, species block with catalog placeholder link, measurement tiles (diameter/height/crown), spatial info, photo state, source list, and disclaimer copy.
   - Added disabled “add photo” CTA placeholder to signal the upcoming contribution flow.

> Next up: switch the search experience to municipal-ID terminology and polish the “העץ לא נמצא?” CTA.

