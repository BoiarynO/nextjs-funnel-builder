# Funnel Builder — System Design (Iteration 1)

## 1. Goal

Create a small web app that allows managers to:

* Create funnels
* Add and reorder steps (steps)
* Store funnels locally (localStorage)
* Export funnel data later as JSON (future iteration)

This is **frontend-only** in the first iteration.

---

## 2. High-Level Architecture

Client-side only:

Next.js app
↓
React components
↓
Local state (React state)
↓
Persistence in localStorage

No backend yet.

---

## 3. Pages

### 3.1 Landing Page `/`

Purpose:

* Explain what the project does
* Button: **"Go to My Funnels"**

UI:

* Title
* Short description
* Button → `/funnels`

---

### 3.2 Funnels Page `/funnels`

Layout:

```
-------------------------------------
| Sidebar | Funnel Editor           |
|         |                         |
| Funnels | Steps / Form        |
-------------------------------------
```

Sidebar:

* List of funnels
* Button: `+ Create funnel`

Main area:

* If no funnel selected → empty state
* If creating funnel → creation form
* If funnel selected → steps list

---

## 4. Data Model

### 4.1 Funnel Structure

```ts
type Funnel = {
  id: string
  name: string
  steps: Step[]
}
```

### 4.2 Step Structure

```ts
type Step = {
  id: string
  componentType: "singleSelect" | "multiselect"
  commonTitle: string
  commonSubtitle: string
  commonPoints: string[]
}
```

---

## 5. localStorage Design

Key:

```
funnels_storage_v1
```

Structure:

```json
{
  "funnels": [
    {
      "id": "funnel_1",
      "name": "Registration Funnel",
      "steps": []
    }
  ]
}
```

---

## 6. State Management Strategy (Iteration 1)

Use:

* `useState`
* `useEffect`
* simple helper functions

No Redux / Effector needed yet.

Main state on Funnels page:

```ts
const [funnels, setFunnels] = useState<Funnel[]>([])
const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null)
```

---

## 7. Components Structure

### Pages

```
/pages
  index.tsx
  funnels.tsx
```

---

### Components (Folder-Based Structure)

All components should be grouped by feature and placed in their own folders.

Rule:

* Each component must have its own folder.
* Each folder must contain:

  * Component file
  * Styles file

Example structure:

```
/components
  /layout
    Layout.tsx
    Layout.module.scss

  /sidebarFunnels
    SidebarFunnels.tsx
    SidebarFunnels.module.scss

  /funnelEditor
    FunnelEditor.tsx
    FunnelEditor.module.scss

  /funnelForm
    FunnelForm.tsx
    FunnelForm.module.scss

  /stepForm
    StepForm.tsx
    StepForm.module.scss

  /stepsList
    StepsList.tsx
    StepsList.module.scss

  /stepItem
    StepItem.tsx
    StepItem.module.scss
```

Naming conventions:

* Folder name: camelCase
* Component name: PascalCase
* Styles: `ComponentName.module.scss`

Optional improvement (later):
If a component grows, the folder may also include:

* types.ts
* constants.ts
* hooks.ts
* index.ts (barrel export)

## 8. Component Responsibilities

### SidebarFunnels

Responsibilities:

* Show list of funnels
* Select funnel
* Create funnel button

Props:

```
funnels
selectedFunnelId
onSelect
onCreate
```

---

### FunnelEditor

Responsibilities:

* Show funnel name
* Show steps
* Add step button

Props:

```
funnel
onAddStep
onReorder
```

---

### FunnelForm

Responsibilities:

* Input funnel name
* Button "Add Step"

State:

```
name
steps[]
```

Button "Add Step" disabled until name is filled.

---

### StepForm

Responsibilities:

* componentType dropdown
* step input
* points input
* submit button

Submit:
Push object into funnel.steps

---

### StepsList

Responsibilities:

* Show all steps
* Drag and drop (future iteration)

---

## 9. User Flow

### Creating Funnel

1. Open Funnels page
2. Click **Create Funnel**
3. Enter name
4. Button "Add Step" becomes active
5. Fill step form
6. Click "Add"
7. Step appears in list
8. Funnel saved to localStorage

---

### Selecting Funnel

1. Click funnel in sidebar
2. Load steps
3. Render editor

---

## 10. Persistence Logic

On app load:

```
loadFunnelsFromStorage()
setFunnels()
```

On funnels change:

```
saveFunnelsToStorage(funnels)
```

---

## 11. Utility Functions

### storage.ts

Functions:

```
loadFunnels()
saveFunnels(funnels)
createFunnel()
addStep()
```

---

## 12. Folder Structure (Recommended)

```
/pages
  index.tsx
  funnels.tsx

/components
  SidebarFunnels
  FunnelEditor
  StepForm
  StepsList

/utils
  storage.ts

/types
  funnel.ts
```

---

## 13. Validation Rules (Iteration 1)

Funnel:

* Name required
* Max 2 funnels (local constraint)

Step:

* Step required
* At least 1 answer

---

## 14. Future Iterations

Planned:

Iteration 2:

* Drag and drop reorder
* Delete step

Iteration 3:

* Export JSON button

Iteration 4:

* Templates for funnels

Iteration 5:

* Backend sync

---

## 15. Definition of Done (Iteration 1)

App allows:

* Create funnel
* Add steps
* Persist in localStorage
* Reload page without data loss
* Switch between funnels

---

## 16. Nice-to-Have Later

* Autosave indicator
* Duplicate funnel
* Preview funnel flow

---
