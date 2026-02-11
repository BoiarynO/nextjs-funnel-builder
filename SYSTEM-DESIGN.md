# Funnel Builder — System Design (Iteration 1)

## 1. Goal

Create a small web app that allows managers to:

* Create funnels
* Add and reorder questions (steps)
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
| Funnels | Questions / Form        |
-------------------------------------
```

Sidebar:

* List of funnels
* Button: `+ Create funnel`

Main area:

* If no funnel selected → empty state
* If creating funnel → creation form
* If funnel selected → questions list

---

## 4. Data Model

### 4.1 Funnel Structure

```ts
type Funnel = {
  id: string
  name: string
  questions: Question[]
}
```

### 4.2 Question Structure

```ts
type Question = {
  id: string
  componentType: "singleSelect" | "multiselect"
  commonTitle: string
  commonSubtitle: string
  commonAnswers: string[]
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
      "questions": []
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

  /questionForm
    QuestionForm.tsx
    QuestionForm.module.scss

  /questionsList
    QuestionsList.tsx
    QuestionsList.module.scss

  /questionItem
    QuestionItem.tsx
    QuestionItem.module.scss
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
* Show questions
* Add question button

Props:

```
funnel
onAddQuestion
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
questions[]
```

Button "Add Step" disabled until name is filled.

---

### QuestionForm

Responsibilities:

* componentType dropdown
* question input
* answers input
* submit button

Submit:
Push object into funnel.questions

---

### QuestionsList

Responsibilities:

* Show all questions
* Drag and drop (future iteration)

---

## 9. User Flow

### Creating Funnel

1. Open Funnels page
2. Click **Create Funnel**
3. Enter name
4. Button "Add Step" becomes active
5. Fill question form
6. Click "Add"
7. Question appears in list
8. Funnel saved to localStorage

---

### Selecting Funnel

1. Click funnel in sidebar
2. Load questions
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
addQuestion()
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
  QuestionForm
  QuestionsList

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

Question:

* Question required
* At least 1 answer

---

## 14. Future Iterations

Planned:

Iteration 2:

* Drag and drop reorder
* Delete question

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
* Add questions
* Persist in localStorage
* Reload page without data loss
* Switch between funnels

---

## 16. Nice-to-Have Later

* Autosave indicator
* Duplicate funnel
* Preview funnel flow

---
