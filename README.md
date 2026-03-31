# Funnel Builder

A small Next.js web app for creating and managing funnels: add steps, reorder them, and export funnel data as JSON.

**Persistence:** guests keep data in **localStorage**; signed-in users (Google) sync the same funnel JSON to a **Postgres** database (Prisma + API routes). A database and auth env vars are only required for that server sync.

## Features

* **Landing page** (`/`) — intro and link to funnels
* **Funnels page** (`/funnels`) — sidebar with funnel list + main area for create/edit
* Create funnels (name, translation key format, component types)
* Add, edit, reorder, and delete steps
* Auto-save: **localStorage** (guests) or **`/api/funnels`** (signed-in)
* Optional **Google sign-in** (Auth.js)
* Export funnel as JSON file
* Limits: configurable max funnels and max steps per funnel

## Tech Stack

* **Next.js 16** (App Router)
* **React 19**
* **Zustand** — global state for funnels and selection
* **Auth.js** (`next-auth`) — Google provider
* **Prisma** + **PostgreSQL** (e.g. **Neon**) — server-side funnel document per user
* **TypeScript**
* **CSS Modules** / **Sass** / **Tailwind** for styling

## Getting Started

Install dependencies:

```bash
npm install
# or yarn / pnpm / bun
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use "Go to My Funnels" to open the funnels view.

## Environment variables

### Local (`.env` or `.env.local`)

| Variable | Required for | Notes |
|----------|----------------|-------|
| `DATABASE_URL` | Server funnel sync | Neon Postgres connection string (pooled URL recommended for serverless). |
| `AUTH_SECRET` | Google sign-in | Random secret for session signing. |
| `AUTH_GOOGLE_ID` | Google sign-in | OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | Google sign-in | OAuth client secret. |
| `AUTH_URL` | Google sign-in (Auth.js v5) | Public app URL, e.g. `http://localhost:3000` locally. |
| `NEXTAUTH_URL` | Legacy / some setups | Often same as `AUTH_URL` for local dev. |

Without `DATABASE_URL`, API routes that use Prisma will fail; guests can still use localStorage-only flows where applicable.

### Google Auth Setup (optional)

Google login does not gate the funnels UI. Guests use localStorage only.

1. Create OAuth credentials in Google Cloud Console:
   - OAuth consent screen: app name and test users (for testing).
   - OAuth Client ID type: Web application.
   - Authorized redirect URIs: add every origin you use, e.g. `http://localhost:3000/api/auth/callback/google` and your production URL (see Vercel section below).
2. Set `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_URL` (and optionally `NEXTAUTH_URL` for local: `http://localhost:3000`).

Without auth env vars, Google sign-in is disabled; the rest of the app still runs.

## Deploy on Vercel (one Neon for Production and Preview)

This matches a typical pet-project setup: **one** Neon database and the **same** `DATABASE_URL` for both **Production** and **Preview** on Vercel.

**Implications:** Preview deployments read/write the same data as Production. That is simple but not isolated; do not use this pattern if you need strict separation.

### Steps

1. **Vercel → Project → Settings → Environment Variables**  
   Add the same values for **Production** and **Preview** (and **Development** if you use Vercel env for local cloud tools):

   - `DATABASE_URL` — Neon connection string (prefer the **pooled** host when Neon offers it).
   - `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
   - `AUTH_URL` — canonical site URL, e.g. `https://your-app.vercel.app` for Production. For **Preview**, either set it to each deployment URL when testing auth (see Google below) or use Production-only login tests.

2. **Google Cloud Console → OAuth client → Authorized redirect URIs**  
   Add:

   - `https://your-app.vercel.app/api/auth/callback/google`

   For **Google login on Preview URLs**, each `https://*.vercel.app` host normally needs its own redirect URI entry (wildcards are not supported). Many teams only verify sign-in on the **production** domain.

3. **Apply Prisma migrations to the Neon database** used by that `DATABASE_URL` (once, and after any new migration):

   ```bash
   DATABASE_URL="postgresql://..." npm run db:migrate:deploy
   ```

   Run from your machine with the **same** URL as on Vercel, or from any trusted CI step. Migrations live in `prisma/migrations/`.

4. **Deploy.** `npm install` on Vercel runs **`postinstall`** → `prisma generate`, so the client is built without committing generated files.

5. **Smoke test:** open the live site, sign in with Google, open `/funnels`, confirm `GET`/`PUT` `/api/funnels` succeed in the browser network tab.

## Scripts

| Script   | Description        |
|----------|--------------------|
| `npm install` | Also runs **`postinstall`** → `prisma generate` (needed on Vercel). |
| `npm run dev`   | Start development server |
| `npm run build` | Production build   |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint         |
| `npm run db:migrate:deploy` | Apply pending migrations to the DB pointed to by `DATABASE_URL` (use for prod/Neon). |

## Project Structure (Overview)

| Path | Description |
|------|-------------|
| `app/` | App Router pages (landing, funnels, uitest) |
| `components/` | UI and layout components (`views/`, `layout/`, `ui/`) |
| `stores/` | Zustand store for funnels state |
| `utils/` | Storage, API client, limits, formatting helpers |
| `lib/` | Shared server utilities (e.g. Prisma client) |
| `prisma/` | Schema and SQL migrations |
| `app/api/` | Route Handlers (auth, funnels) |
| `types/` | Shared TypeScript types (e.g. Funnel, Step) |
| `docs/` | Documentation mirroring source structure |

See **SYSTEM-DESIGN.md** for architecture, data model, and component responsibilities.

## Documentation

* **SYSTEM-DESIGN.md** — system design, routes, data model, state, folder structure
* **docs/** — per-module docs; structure mirrors the project (e.g. `docs/stores/funnelsStore.md`)

## Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Zustand](https://github.com/pmndrs/zustand)
