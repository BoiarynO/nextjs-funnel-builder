# Agent Learning Log

This file stores practical learnings gathered while implementing features or after completing a feature-focused chat.

## Entry Naming Rule

Each entry title must follow this format:

`## YYYY-MM-DD — <Feature essence>`

Examples:

- `## 2026-03-27 — Delete each point in funnel`
- `## 2026-03-27 — Save previous selected component type`

## What to Record in Every Entry

- context: what was being built/fixed and why;
- decisions: key technical decisions and trade-offs;
- implementation notes: critical files and architectural touch points;
- pitfalls: what caused issues or regressions;
- verification: what was manually/automatically checked;
- follow-ups: remaining tasks, risks, and ideas.

## Entry Template

Copy this block for each new feature:

```md
## YYYY-MM-DD — <Feature essence>

### Context
- 

### Decisions
- 

### Implementation Notes
- Files touched:
  - `path/to/file`
- Important behavior changes:
  - 

### Pitfalls / Gotchas
- 

### Verification
- 

### Follow-ups
- 
```

## Current Session Notes

## 2026-03-27 — Add agent documentation baseline

### Context
- Added dedicated agent docs to replace reliance on potentially outdated system design notes.

### Decisions
- Separated stable guidance (`agent-instructions.md`) from iterative learnings (`agent-learning.md`).
- Introduced strict entry naming format based on date and feature essence.

### Implementation Notes
- Files touched:
  - `agent-instructions.md`
  - `agent-learning.md`
- Important behavior changes:
  - No runtime behavior change; documentation/process improvement only.

### Pitfalls / Gotchas
- `SYSTEM-DESIGN.md` remains useful for structure but should not be treated as the only source of agent execution standards.

### Verification
- Verified both files are created in project root and use consistent Markdown structure.

### Follow-ups
- On each feature/commit, append one new entry using the template above.
- Keep architecture section in `agent-instructions.md` in sync when auth/backend work begins.

## 2026-03-27 — Add Google auth foundation and extract auth controls

### Context
- Implemented Google authorization via Auth.js as an independent feature that does not change funnel access behavior.
- Kept guest and logged-in users on the same localStorage persistence flow for funnels.

### Decisions
- Chose Auth.js route handlers in App Router (`app/api/auth/[...nextauth]/route.ts`) with centralized config in `auth.ts`.
- Wrapped app tree with client `SessionProvider` through a dedicated provider component to keep server layout clean.
- Extracted header auth UI/logic into a reusable layout-level component (`AuthControls`) to avoid duplicating `useSession/signIn/signOut`.
- Kept/used `useIsLogged` as an example of a minimal derived auth-state hook for simple conditional rendering.

### Implementation Notes
- Files touched:
  - `auth.ts`
  - `app/api/auth/[...nextauth]/route.ts`
  - `components/providers/AuthSessionProvider.tsx`
  - `app/layout.tsx`
  - `components/layout/authControls/AuthControls.tsx`
  - `components/layout/authControls/AuthControls.module.css`
  - `components/layout/header/navBar/NavBar.tsx`
  - `README.md`
  - `SYSTEM-DESIGN.md`
- Important behavior changes:
  - Google sign-in/sign-out is available in header.
  - No route guards were added; funnel CRUD and persistence behavior remains unchanged.

### Pitfalls / Gotchas
- Missing or mismatched Google OAuth env values causes `ClientFetchError` / `invalid_client`.
- Redirect URI in Google Console must exactly match the dev origin and callback path (`/api/auth/callback/google`).
- During refactors, auth blocks can be duplicated accidentally; keep auth UI in one reusable component and import it where needed.

### Verification
- `npm run lint` and `npm run build` passed for auth integration changes.
- Confirmed no auth checks were added inside `stores/funnelsStore.ts` and no middleware-based gating was introduced.

### Follow-ups
- If auth controls are needed in additional layout zones (sidebar/topbar/mobile), reuse `components/layout/authControls/AuthControls.tsx`.
- If only boolean auth state is needed, prefer `hooks/useIsLogged.ts` over duplicating `useSession` parsing in multiple components.

### Update (2026-03-31)
- Funnel persistence for **signed-in** users was later moved to the server (`/api/funnels` + Prisma/Postgres). Guests still use **localStorage** only. See entry below.

## 2026-03-31 — Server-side funnel persistence (auth vs guest)

### Context
- Needed cross-device continuity for logged-in users while keeping guest UX unchanged (local-first in the browser).

### Decisions
- Single JSON document per user (`UserFunnelState.funnels` as `Funnel[]`) for minimal backend surface area on a pet project.
- Identity key: `session.user.email` (unique in DB). Accept trade-off vs stable provider-agnostic user ids for now.
- Orchestration in `FunnelsDataLayer` instead of a Zustand `subscribe` auto-save, so one code path can branch on `useSession`.
- Debounced `PUT` (~350ms) after funnel list changes for signed-in users; immediate writes to `localStorage` for guests.
- Prisma 7: use `@prisma/adapter-pg` + `pg` `Pool` because the generated client expects a driver adapter in this setup.

### Implementation Notes
- Files touched (core):
  - `prisma/schema.prisma`, `prisma/migrations/` (UserFunnelState)
  - `lib/prisma.ts`
  - `app/api/funnels/route.ts` (`GET`, `PUT`)
  - `utils/funnelsApi.ts`
  - `utils/funnelsStorage.ts` (explicit `*FromLocalStorage` names + legacy aliases)
  - `stores/funnelsStore.ts` (`initialize(initialFunnels)`, removed persistence subscribe)
  - `components/views/funnels/dataLayer/FunnelsDataLayer.tsx`
  - `package.json` / `package-lock.json` (`@prisma/adapter-pg`, `pg`)
- Important behavior changes:
  - Signed-in: hydrate from server; if server empty, seed from `localStorage` and upload once.
  - On server load failure while signed in, fallback to `localStorage` for UX; be aware this can theoretically overwrite server state on later successful save (known pet-project risk).

### Pitfalls / Gotchas
- `DATABASE_URL` must be set wherever the API runs (local + hosting secrets).
- Neon: prefer pooled connection string for serverless-style deployments when applicable.
- Concurrent edits: last write wins; no version column or merge strategy yet.
- Do not re-add store-level `subscribe` persistence without revisiting the guest/server split.

### Verification
- `npm run lint` (no new errors in touched files).
- `npm run build` succeeded after Prisma adapter wiring.
- `npx prisma migrate dev` applied against Neon for the new table (environment-specific).

### Follow-ups
- User-visible sync state and error/retry handling.
- Optional: `updatedAt`/version for conflict detection; Zod validation on `PUT` body.
- Consider `userId` from Auth.js adapter instead of email if multi-provider accounts matter.
