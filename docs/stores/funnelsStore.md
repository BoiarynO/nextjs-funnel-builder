# funnelsStore

**Source:** `stores/funnelsStore.ts`

Global Zustand store for funnel list, selected funnel, and create-mode flag. All funnel mutations go through this store; a subscriber persists the list to storage(server or localStorage depends on auth state) whenever it changes.

---

## Store shape

The store is typed as `FunnelsStore = FunnelsState & FunnelsActions`.

### State (`FunnelsState`)

| Field               | Type                 | Description |
|---------------------|----------------------|-------------|
| `funnels`           | `Funnel[]`           | All funnels (source of truth). |
| `selectedFunnelId`  | `string \| null`     | ID of the funnel currently selected in the UI. |
| `isCreatingFunnel`  | `boolean`            | When `true`, the main area shows the create-funnel form instead of the editor. |

### Actions (`FunnelsActions`)

| Action              | Signature                         | Description |
|---------------------|-----------------------------------|-------------|
| `initialize`        | `() => void`                      | Loads funnels from localStorage via `loadFunnels()`. If the result is non-empty, sets `funnels` and selects the first funnel             (`selectedFunnelId = stored[0].id`). Call once when the Funnels page mounts. |
| `selectFunnel`      | `(funnel: Funnel) => void`        | Sets `selectedFunnelId` to `funnel.id` and sets `isCreatingFunnel` to `false`. |
| `startCreateFunnel` | `() => void`                      | Sets `isCreatingFunnel` to `true` only if `funnels.length < MAX_FUNNELS`; otherwise no-op. |
| `createFunnel`      | `(newFunnel: Funnel) => void`     | Appends `newFunnel` to `funnels`, sets `selectedFunnelId` to `newFunnel.id`, and sets `isCreatingFunnel` to `false`. |
| `deleteFunnel`      | `(id: string) => void`            | Removes the funnel with the given `id`. If that funnel was selected, selects the first remaining funnel (or `null` if none). Sets `isCreatingFunnel` to `false`. |
| `updateFunnel`      | `(updatedFunnel: Funnel) => void` | Replaces the funnel whose `id` matches `updatedFunnel.id` with `updatedFunnel`; other funnels unchanged. |

---

## Usage

**Hook (in components):**

```ts
import { useFunnelsStore } from "@/stores/funnelsStore";

// Subscribe to specific fields (recommended)
const funnels = useFunnelsStore((s) => s.funnels);
const selectedFunnelId = useFunnelsStore((s) => s.selectedFunnelId);
const isCreatingFunnel = useFunnelsStore((s) => s.isCreatingFunnel);
const createFunnel = useFunnelsStore((s) => s.createFunnel);
const updateFunnel = useFunnelsStore((s) => s.updateFunnel);
```

**Imperative (e.g. in `useEffect`):**

```ts
useFunnelsStore.getState().initialize();
useFunnelsStore.getState().startCreateFunnel();
```

---

## Persistence

A global subscriber is registered in the same file:

```ts
useFunnelsStore.subscribe((state, prevState) => {
  if (state.funnels !== prevState.funnels) {
    saveFunnels(state.funnels);
  }
});
```

Any update that changes `state.funnels` (create, delete, update) triggers `saveFunnels(state.funnels)` in `utils/funnelsStorage`, which writes to localStorage under the key `funnels_storage_v1`. There is no separate “save” action; persistence is automatic.

---

## Dependencies

* **Types:** `Funnel` from `@/types/funnel`
* **Config:** `MAX_FUNNELS` from `@/utils/config/limits`
* **Storage:** `loadFunnels`, `saveFunnels` from `@/utils/funnelsStorage`

---

## Where it is used

* **Funnels view** (`components/views/funnels/Funnels.tsx`) — calls `initialize()` on mount; reads `isCreatingFunnel` to switch between `CreateFunnelForm` and `FunnelContent`.
* **SidebarFunnels** — reads `funnels`, `selectedFunnelId`; calls `selectFunnel`, `startCreateFunnel`, `deleteFunnel`.
* **CreateFunnelForm** — reads `funnels`, `createFunnel`.
* **FunnelContent** — reads `funnels`, `selectedFunnelId` to resolve the selected funnel and render `FunnelEditor`.
* **FunnelEditor** — reads `funnels`, `selectedFunnelId`, `updateFunnel` for editing and reordering steps.
