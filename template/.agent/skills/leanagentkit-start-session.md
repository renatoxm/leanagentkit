---
name: leanagentkit-start-session
description: Start a coding session — read memory files and prime context without globbing the repo.
---

# Skill: leanagentkit-start-session

**Goal:** Prime context cheaply at the start of a work session.

## Procedure

1. If `docs/memory/HANDOFF.md` exists and describes in-flight work, read it
   first — it is the cross-session baton from a context reset or tool switch.
2. Read **only**: `docs/memory/ACTIVE_CONTEXT.md`, then `docs/CODEBASE_MAP.md`.
3. Read the active feature's `docs/specs/<feature>.md` if one is named in
   ACTIVE_CONTEXT.
4. From the "Files in play" and "Resume from here" sections, open just those
   source files. Do not scan the repo.
5. State back, in 2–3 lines: what the current focus is, what was left open, and
   the concrete next action — then begin.

## Do not

- Do not read `docs/adr/*` unless about to make/change a decision.
- Do not read `PROGRESS.md` for routine work (it's history).
- Do not glob the whole codebase "to get oriented" — that's what the map is for.
