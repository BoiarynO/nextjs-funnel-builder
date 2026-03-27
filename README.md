# Funnel Builder

A small Next.js web app for creating and managing funnels: add steps, reorder them, and export funnel data as JSON. All data is stored in the browser (localStorage); no backend required.

## Features

* **Landing page** (`/`) — intro and link to funnels
* **Funnels page** (`/funnels`) — sidebar with funnel list + main area for create/edit
* Create funnels (name, translation key format, component types)
* Add, edit, reorder, and delete steps
* Persist funnels in localStorage (auto-save on change)
* Export funnel as JSON file
* Limits: configurable max funnels and max steps per funnel

## Tech Stack

* **Next.js 16** (App Router)
* **React 19**
* **Zustand** — global state for funnels and selection
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

## Google Auth Setup (optional, non-blocking)

Google login is optional and does not gate access to funnels. Guests can keep creating funnels and data still persists in localStorage.

1. Copy `.env.example` to `.env.local`.
2. Create OAuth credentials in Google Cloud Console:
   - OAuth consent screen: configure app name and test users.
   - OAuth Client ID type: Web application.
   - Authorized redirect URI (dev): `http://localhost:3000/api/auth/callback/google`
3. Fill env vars in `.env.local`:
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `NEXTAUTH_URL` (for local dev: `http://localhost:3000`)

Without these variables, the app still works, but Google sign-in will not be available.

## Scripts

| Script   | Description        |
|----------|--------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build   |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint         |

## Project Structure (Overview)

| Path | Description |
|------|-------------|
| `app/` | App Router pages (landing, funnels, uitest) |
| `components/` | UI and layout components (`views/`, `layout/`, `ui/`) |
| `stores/` | Zustand store for funnels state |
| `utils/` | Storage, limits, formatting helpers |
| `types/` | Shared TypeScript types (e.g. Funnel, Step) |
| `docs/` | Documentation mirroring source structure |

See **SYSTEM-DESIGN.md** for architecture, data model, and component responsibilities.

## Documentation

* **SYSTEM-DESIGN.md** — system design, routes, data model, state, folder structure
* **docs/** — per-module docs; structure mirrors the project (e.g. `docs/stores/funnelsStore.md`)

## Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Zustand](https://github.com/pmndrs/zustand)
