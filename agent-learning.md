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
