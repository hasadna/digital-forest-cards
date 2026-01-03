# Digital Forest Cards

Digital Forest Cards is a mobile-first web app that lets residents look up municipal trees by their physical tag (Municipal ID) and view the available data. The experience mirrors the Ya'ad Digital Urban Forest branding and is intended as a public-facing pilot, with room for future civic contributions such as photos and data updates.

## Tech stack

- React + TypeScript + Vite
- shadcn/ui and Tailwind CSS
- Supabase (backend and db)
- AWS-compatible S3 for static hosting


## Getting started

1. Install Node.js 20+ and npm.
2. Clone the repo and install dependencies:
   ```sh
   git clone <REPO_URL>
   cd digital-forest-cards
   npm install
   ```
3. Configure environment variables for Vite:
   ```sh
   cp env.example .env.local
   ```
   Set values for:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run the dev server: `npm run dev`
5. Lint: `npm run lint`
6. Build: `npm run build`
7. Preview the production build locally: `npm run preview`

## Useful scripts

- `npm run query` – run `scripts/run-query.ts`
- `npm run export-municipalities` – export example municipality data
- `npm run export-municipalities-no-canopy` – export municipality data without canopy info
- `npm run test:functions:unit` – unit tests for Supabase functions (Deno; uses dummy env vars)
- `npm run test:functions:integration` – integration tests for Supabase functions (expects env in `supabase/.env.test` or the shell)

## Deployment

The GitHub Actions workflow `.github/workflows/deploy.yml` builds on pushes to `main` and syncs `dist` to the Hasadna S3 bucket `digital-forest-cards-site`. Required secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `DEPLOY_S3_ACCESS_KEY_ID`
- `DEPLOY_S3_SECRET_ACCESS_KEY`
- `DEPLOY_S3_ENDPOINT`

To deploy manually, run `npm run build` with the same env vars and upload the `dist/` directory to your static host of choice.
