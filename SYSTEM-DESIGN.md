# Funnel Builder — System Design

## 1. Goal

A small web app that allows managers to:

* Create funnels (with name, translation key format, component types)
* Add, edit, reorder, and delete steps
* Store funnels locally (localStorage)
* Export funnel data as JSON

The app is **frontend-only** (no backend).

---

## 2. High-Level Architecture

Client-side only:

```
Next.js App (App Router)
    ↓
React components
    ↓
Zustand store (funnelsStore)
    ↓
Persistence in localStorage (utils/funnelsStorage)
```

---

## 3. Routes (App Router)

### 3.1 Landing Page `/`

* **File:** `app/page.tsx`
* **Purpose:** Explain the project; link to funnels.
* **UI:** Title, short description, button "Go to My Funnels" → `/funnels`.
* **Component:** `components/views/landing/Landing.tsx`

### 3.2 Funnels Page `/funnels`

* **File:** `app/funnels/page.tsx`
* **Layout:**

```
-----------------------------------------
| Sidebar           | Main content      |
| - Funnels list    | CreateFunnelForm  |
| - Create funnel   |   OR              |
|                   | FunnelContent     |
|                   |   (FunnelEditor)  |
-----------------------------------------
```

* **Sidebar:** List of funnels, selection, "Create funnel" button.
* **Main area:** If `isCreatingFunnel` → `CreateFunnelForm`; else → `FunnelContent` (empty state or `FunnelEditor` with steps).
* **Component:** `components/views/funnels/Funnels.tsx`

---

## 4. Data Model

### 4.1 Funnel

**File:** `types/funnel.ts`

```ts
type TranslationKeyFormat = "camelCase" | "snake_case" | "kebab-case";

type Funnel = {
  id: string;
  name: string;
  translationKeyFormat?: TranslationKeyFormat;
  componentTypes?: string[];
  steps: Step[];
};
```

### 4.2 Step

```ts
type Step = {
  id: string;
  componentType: string | null;
  translationKeyFormat?: TranslationKeyFormat;
  commonTitle: string;
  commonSubtitle: string;
  titleTranslationKey: string;
  subtitleTranslationKey: string;
  commonPoints: string[];
  pointsTranslationKeys: string[];
};
```

---

## 5. localStorage

* **Key:** `funnels_storage_v1`
* **Value:** JSON array of `Funnel[]` (not wrapped in `{ funnels: [...] }`).
* **API:** `utils/funnelsStorage.ts` — `loadFunnels()`, `saveFunnels(funnels)`.

---

## 6. State Management (Zustand)

**Store:** `stores/funnelsStore.ts`

**State:**

* `funnels: Funnel[]`
* `selectedFunnelId: string | null`
* `isCreatingFunnel: boolean`

**Actions:**

* `initialize()` — load from localStorage, optionally select first funnel
* `selectFunnel(funnel)` — set selected funnel, clear create mode
* `startCreateFunnel()` — set create mode (respects `MAX_FUNNELS`)
* `createFunnel(newFunnel)` — add funnel, select it, clear create mode
* `deleteFunnel(id)` — remove funnel, adjust selection
* `updateFunnel(updatedFunnel)` — replace funnel by id

**Persistence:** A store subscriber calls `saveFunnels(state.funnels)` whenever `funnels` changes.

---

## 7. Folder Structure (Current)

```
/app
  layout.tsx
  page.tsx                    # Landing
  funnels/
    page.tsx                  # Funnels view
  uitest/
    page.tsx                  # UI component tests

/components
  /views
    landing/Landing.tsx
    funnels/Funnels.tsx
  /layout
    sidebarFunnels/           # Sidebar + FunnelsList, FunnelsListItem
    createFunnelForm/CreateFunnelForm.tsx
    funnelContent/FunnelContent.tsx
    funnelContent/funnelEditor/
      FunnelEditor.tsx
      funnelTitleRow/
      stepsReorderSection/
      stepsContent/
        stepsList/
        stepsComponents/
          stepsForm/
          stepItem/
            details/
        addStepBlock/
      buttonDownloadFunnelJson/
    header/
  /ui
    button/Button.tsx
    input/Input.tsx
    heading/Heading.tsx
    linkButton/LinkButton.tsx
    dropdown/Dropdown.tsx
    radioButton/RadioButton.tsx
    reorderList/ReorderList.tsx

/stores
  funnelsStore.ts

/utils
  funnelsStorage.ts
  config/limits.ts            # MAX_FUNNELS, MAX_QUESTIONS_PER_FUNNEL
  variables.ts                # DEFAULT_COMPONENT_TYPES
  formatting/formatTranslationKey.ts

/types
  funnel.ts
```

Naming: folder camelCase; component PascalCase; styles `ComponentName.module.css` or `.module.scss`.

---

## 8. Component Responsibilities (Summary)

| Component | Role |
|-----------|------|
| **SidebarFunnels** | Funnels list, selection, "Create funnel" (uses store) |
| **CreateFunnelForm** | Name input, validation, create funnel via store (max funnels from limits) |
| **FunnelContent** | Resolve selected funnel; render empty state or `FunnelEditor` |
| **FunnelEditor** | Funnel name/edit, reorder steps, steps list, add step, download JSON; uses drafts for edit mode |
| **StepsContent** | Steps list + add-step block + step form |
| **StepsForm** | Step fields (type, title, subtitle, points, translation keys); add/update step |
| **StepItem** | Single step display/edit; details in `Details` |
| **StepsList** | List of step items (e.g. with reorder) |
| **ReorderList** | Generic drag-and-drop reorder (used for steps) |
| **ButtonDownloadFunnelJson** | Export selected funnel as JSON file |

---

## 9. User Flows

### Create funnel

1. Open `/funnels`.
2. Click "Create funnel" (if under `MAX_FUNNELS`).
3. Enter name in `CreateFunnelForm`, submit.
4. New funnel is created and selected; main area shows `FunnelEditor`.
5. Add steps in editor; changes are persisted via store → localStorage.

### Select funnel

1. Click a funnel in the sidebar.
2. Store updates `selectedFunnelId`; `FunnelContent` renders `FunnelEditor` for that funnel.

### Edit funnel / steps

1. In `FunnelEditor`, edit name/settings or steps (draft state).
2. Save updates via `updateFunnel`; subscriber persists to localStorage.
3. Steps can be reordered via `ReorderList`; order is part of `funnel.steps`.

### Export

1. With a funnel selected, use "Download JSON" in `FunnelEditor`.
2. Funnel data is exported as a JSON file.

---

## 10. Persistence

* **On load:** Funnels page calls `useFunnelsStore.getState().initialize()` in `useEffect`; `initialize()` uses `loadFunnels()` and optionally sets first funnel as selected.
* **On change:** `useFunnelsStore.subscribe` writes `state.funnels` to localStorage via `saveFunnels(state.funnels)` whenever `funnels` changes.

---

## 11. Limits and Config

* **File:** `utils/config/limits.ts`
* `MAX_FUNNELS` — max number of funnels (e.g. 3).
* `MAX_QUESTIONS_PER_FUNNEL` — max steps per funnel (e.g. 10).

---

## 12. Validation (Current)

* **Funnel:** Name required; total funnels ≤ `MAX_FUNNELS`.
* **Step:** Required fields per `Step` type; step count ≤ `MAX_QUESTIONS_PER_FUNNEL` where enforced.

---

## 13. Future / Nice-to-Have

* Backend sync
* Funnel templates
* Autosave indicator
* Duplicate funnel
* Preview funnel flow

---
