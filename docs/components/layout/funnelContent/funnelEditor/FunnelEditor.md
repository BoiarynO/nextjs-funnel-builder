# FunnelEditor

**Source:** `components/layout/funnelContent/funnelEditor/FunnelEditor.tsx`

Main editor for a single funnel. Displays the funnel name, settings, and steps; supports editing funnel metadata and reordering steps in a two-phase flow (edit mode vs view mode). Persists changes via the global store.

---

## Conceptual Overview

FunnelEditor uses a **dual-mode pattern** with a **draft-based edit mode**: edits are held in local draft state until the user explicitly saves or cancels. This guarantees either a final commit of all changes to the store or a full discard—no accidental or partial persistence.

1. **View mode** — funnel name and settings are read-only; steps are shown in a list with inline edit. Changes to individual steps are saved directly to the store.
2. **Edit mode** — funnel name, translation format, component types, and step order are editable in a draft. Reordering applies to the draft only; "Save" commits all draft changes, "Cancel" discards them.

This avoids frequent store updates while reordering (e.g. on each drag) and lets the user confirm or cancel batch edits.

**Mutual exclusion:** Funnel metadata editing is disabled while a step is being edited (`editingStepId !== null`). This keeps the flow focused and avoids overlapping edit UIs.

---

## Component Structure

```
FunnelEditor
├── Header
│   ├── FunnelTitleRow (name, translation format, component types; edit/view modes)
│   └── ButtonDownloadFunnelJson
└── Body (conditional)
    ├── StepsReorderSection (edit mode — reorder steps)
    └── StepsContent (view mode — list, add step, inline step edit)
```

---

## Props

No props. Component uses `useFunnelsStore` directly. Draft state and handlers live in `stores/funnelsStore.ts`. Child components read from the store via selectors—no prop drilling.

| State / derived       | Type                   | Purpose                                                  |
|-----------------------|------------------------|----------------------------------------------------------|
| `draft`               | `DraftState \| null`   | Single draft object (name, translationKeyFormat, componentTypes, steps). Null = view mode. |
| `editingStepId`       | `string \| null`       | ID of the step currently being edited (inline).          |
| `isEditMode`          | `boolean`              | Derived from `draft !== null`.                           |

---

## Store Usage (funnelsStore)

| State / selector / action      | Purpose                                                  |
|--------------------------------|----------------------------------------------------------|
| `draft`, `editingStepId`       | Draft state for funnel settings edit mode.               |
| `selectSelectedFunnel`         | Resolve selected funnel from `funnels` + `selectedFunnelId`. |
| `selectIsEditMode`             | Derived from `draft !== null`.                           |
| `selectDisplayName`, `selectReorderItems`, etc. | Derived values for UI.                          |
| `onDraftStartEdit`, `onSettingsSave`, `onSettingsCancel`, `setEditingStepId` | Draft/settings actions.            |
| `updateFunnel`                 | Persist funnel changes (inline step edits).              |

---

## Key Logic

### Reset on funnel switch

When the user selects another funnel via `selectFunnel`, the store sets `draft: null` and `editingStepId: null`.

### Edit funnel metadata

- **Start edit:** `onDraftStartEdit` copies current funnel data into draft state. Disabled if a step is being edited (`editingStepId !== null`).
- **Save:** `onSettingsSave` builds an updated `Funnel` from draft and updates the list; then sets draft to null.
- **Cancel:** `onSettingsCancel` sets draft to null; changes are discarded.

### Reorder steps (edit mode only)

- `onDraftReorder` uses `reorderSteps()` helper to map `ReorderItem[]` back to `Step[]` and updates `draft.steps`. Order is committed only on "Save"; "Cancel" discards it.

### Display source

- In edit mode: `displayName`, `reorderItems` come from draft state.
- In view mode: they come from `selectedFunnel` in the store.

---

## Child Components

| Component                    | Role                                                                                                                             |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **FunnelHeader**             | Shows `FunnelHeaderTitle` (view) or `FunnelHeaderSettings` (edit). Both read from `useFunnelsStore`—no props. Uses `steps` to know which component types are in use (cannot delete used types). |
| **ButtonDownloadFunnelJson** | Exports the selected funnel as a JSON file.                                                                                      |
| **StepsReorderSection**      | Drag-and-drop reorder when `isEditMode`; reads `selectReorderItems` and `onDraftReorder` from `useFunnelsStore`.                 |
| **StepsContent**             | Steps list + add step when not in edit mode. Reads `editingStepId` and `setEditingStepId` from store; edits steps via `updateFunnel`. |

---

## Data Flow

```
Store (funnels, selectedFunnelId)
    ↓
FunnelEditor (selectedFunnel)
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Edit mode: draft state → handleSave → updateFunnel          │
│ View mode: StepsContent → updateFunnel (inline step edits)  │
└─────────────────────────────────────────────────────────────┘
    ↓
Store (updateFunnel) → subscriber → saveFunnels → persistence
```

---

## Dependencies

- **Store:** `useFunnelsStore` (draft, editingStepId, selectors: selectSelectedFunnel, selectIsEditMode, selectDisplayName, selectReorderItems, etc.)
- **Types:** `Funnel`, `Step`, `TranslationKeyFormat` from `@/types/funnel`
- **Store:** `useFunnelsStore`
- **Utils:** `DEFAULT_COMPONENT_TYPES` from `@/utils/variables`
- **UI:** `ReorderList` (type `ReorderItem`), `FunnelTitleRow`, `StepsReorderSection`, `StepsContent`, `ButtonDownloadFunnelJson`

---

## Where it is used

- **FunnelContent** — renders `FunnelEditor` when a funnel is selected. `FunnelEditor` returns `null` if `selectedFunnel` is missing (fallback handled by parent).
