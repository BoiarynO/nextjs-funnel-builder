# Agent Instructions — Next.js Funnel Builder

## 1. Project Purpose

This project is a frontend-only Funnel Builder for managers.
Main user goals:

- create and manage funnels;
- add, edit, reorder, and delete steps;
- configure translation key format and component types;
- export selected funnel as JSON.

Current architecture is local-first:

- UI: Next.js App Router + React;
- state: Zustand store (`stores/funnelsStore.ts`);
- persistence: `localStorage` via `utils/funnelsStorage.ts`;
- no backend in current stable flow.

## 2. Architecture and Technical Decisions

- Keep business state centralized in Zustand, not duplicated in many local component states.
- Keep components mostly presentational; move orchestration/data synchronization logic to data-layer components and store actions.
- Persist only domain data (`funnels`) and derive UI state (`selectedFunnelId`, `isCreatingFunnel`) in the store.
- Favor explicit types for domain entities (`types/funnel.ts`).
- Keep limits/config values in dedicated config files (`utils/config/limits.ts`), avoid magic numbers in components.
- Keep formatting logic and pure transformations in `utils` (for example key formatters).

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
- authorization start;
- backend storage for authorized users.

When these start, this document should be updated to include:

- auth flow ownership boundaries;
- API integration and error-handling rules;
- server/client separation constraints.
