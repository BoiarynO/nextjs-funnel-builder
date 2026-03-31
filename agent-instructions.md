# Agent Instructions — Next.js Funnel Builder

## 1. Project Purpose

This project is a Funnel Builder for managers (Next.js App Router).
Main user goals:

- create and manage funnels;
- add, edit, reorder, and delete steps;
- configure translation key format and component types;
- export selected funnel as JSON.

Persistence is **hybrid** (guest vs signed-in):

- **Guests (no session):** `localStorage` only (`utils/funnelsStorage.ts`).
- **Signed-in users (Google via Auth.js):** funnels load/save through **`GET` / `PUT` `/api/funnels`**, stored in Postgres via Prisma (`UserFunnelState`, JSON column for the `Funnel[]` payload).

Stack touchpoints:

- UI: Next.js App Router + React;
- state: Zustand (`stores/funnelsStore.ts`) — domain list + selection + draft editing; **no** `subscribe`-based persistence inside the store;
- hydration and persistence orchestration: `components/views/funnels/dataLayer/FunnelsDataLayer.tsx` (session-aware);
- server: `app/api/funnels/route.ts`, `lib/prisma.ts`, `prisma/schema.prisma`.

## 2. Architecture and Technical Decisions

- Keep business state centralized in Zustand, not duplicated in many local component states.
- Keep components mostly presentational; move orchestration/data synchronization logic to data-layer components and store actions.
- Persist only domain data (`funnels`) and derive UI state (`selectedFunnelId`, `isCreatingFunnel`) in the store.
- **Do not** reintroduce automatic persistence inside `funnelsStore` unless deliberately redesigning; the data layer owns when to write to `localStorage` vs server.
- Favor explicit types for domain entities (`types/funnel.ts`).
- Keep limits/config values in dedicated config files (`utils/config/limits.ts`), avoid magic numbers in components.
- Keep formatting logic and pure transformations in `utils` (for example key formatters).

### Auth and API boundaries

- Use `auth()` from `auth.ts` in Route Handlers to resolve the current user; unauthenticated requests to `/api/funnels` return **401**.
- Client fetches for funnels: `utils/funnelsApi.ts` (`loadFunnelsFromServer`, `saveFunnelsToServer`).
- Prisma 7 in this repo uses `@prisma/adapter-pg` + `pg` (`lib/prisma.ts`); **`DATABASE_URL` is required** for server routes that touch the DB.
- First successful server load with an **empty** server document: guest `localStorage` data is migrated up (then saved via `PUT`).

### Known intentional limitations (pet-project scope)

- Last-write-wins across tabs/devices; no optimistic locking or conflict UI.
- Server validates payload shape lightly (array check only); full `Funnel` schema validation is not enforced on the API yet.
- Silent failure risk on `PUT` from the client (no user-visible sync status); improve if reliability becomes a priority.

## 3. Code Style and Conventions

### TypeScript and React

- Prefer strict typing, avoid `any`.
- Use function components and hooks.
- Keep components small and composable.
- If UI block contains auth/session behavior (`useSession`, `signIn`, `signOut`) and can appear in multiple places, extract it into a reusable layout component (for example `components/layout/authControls/AuthControls.tsx`), not inline in page/header files.
- If component only needs boolean auth state, use a small derived hook pattern (for example `hooks/useIsLogged.ts`) instead of duplicating session parsing in many components.
- Keep side effects in `useEffect` or dedicated data-layer components.
- Prefer clear variable names over short abbreviations.
- Write early-return logic for readability.

### Zustand Usage

- Use selectors (`useFunnelsStore((s) => s.someValue)`) to avoid unnecessary rerenders.
- Put state transitions into store actions, not inline in deeply nested components.
- Keep action names verb-based: `createFunnel`, `updateFunnel`, `deleteFunnel`, `startCreateFunnel`, `initialize`.

### Validation and UX

- Validate as close to user input as possible.
- Reuse config limits/constants in validation.
- Use clear and actionable error texts.

## 4. File and Naming Rules

- Components: PascalCase file names (example: `FunnelEditor.tsx`).
- Component folders: camelCase (example: `funnelContent`, `stepsReorderSection`).
- Hooks/util files: camelCase (example: `formatTranslationKey.ts`).
- Types: place shared domain types in `types/`.
- CSS modules: `ComponentName.module.css` (or `.module.scss` only if really needed).
- One primary exported component per component file.

Recommended placement:

- route-level views: `components/views/...`;
- layout/feature blocks: `components/layout/...`;
- reusable primitives: `components/ui/...`;
- app routing files: `app/**/page.tsx`.

## 5. Styling Rules

- Use CSS Modules by default.
- Prefer design-token-like constants (spacing, colors) when they are introduced.
- Keep styles co-located with the component.
- Avoid global style leakage; scope styles to module classes.
- Keep class names semantic (`container`, `sidebar`, `content`, `errorText`).
- Prefer composition and predictable layout patterns over one-off overrides.

## 6. Working Rules for Agents

- Before implementation, quickly inspect related files and existing patterns.
- Do not introduce new architectural patterns without clear need.
- Keep edits minimal and consistent with current codebase style.
- Update documentation when behavior, structure, or naming conventions change.
- If a feature changes domain behavior, ensure data model and persistence impact are considered.
- If adding a new limit/config option, place it in config and reference it from UI/store.

## 7. Definition of Done for a Change

- Feature works for the main flow and edge cases relevant to the change.
- Code matches naming and folder rules from this document.
- No obvious lint/type issues in touched files.
- State updates and persistence remain consistent.
- If behavior changed, add a note to `agent-learning.md`.

## 8. Near-Term Roadmap Context

Likely next steps already visible in project notes:

- style/details refactor with UI library;
- optional: sync UX (saving indicator, retries, conflict/version handling);
- optional: stricter API validation (e.g. Zod) and stable user id beyond email.

This document should stay updated when:

- auth or persistence behavior changes;
- new API routes or env vars are introduced;
- server/client boundaries shift (middleware, RSC data loading, etc.).
