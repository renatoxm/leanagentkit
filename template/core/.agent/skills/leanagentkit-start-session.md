---
name: leanagentkit-start-session
description: Start a coding session — read memory files and prime context without dumping the repo.
---

# Skill: leanagentkit-start-session

**Goal:** Prime context cheaply at the start of a **normal** or **substantial** session.
Skip this skill for **trivial** work (see `AGENTS.md` §6).

## Procedure

1. If `docs/memory/HANDOFF.md` exists and describes in-flight work, read it first.
2. Read **first**: `docs/memory/ACTIVE_CONTEXT.md`, then `docs/CODEBASE_MAP.md`.
3. If ACTIVE_CONTEXT names a feature and `docs/specs/<feature>.md` exists (spec pack),
   read that spec.
4. From "Files in play" and "Resume from here", open those source files.
5. If the map is insufficient or stale for the task, use **narrow** search — do not
   glob the whole repo "to get oriented."
6. State back in 2–3 lines: focus, what was left open, concrete next action — then begin.

7. **Pack hooks (skip if pack not installed).** Detect via skill file presence or
   `installedPacks` in `.agent/.leanagentkit-version`:
   - **backlog** — if active (`backlog` on PATH and backlog project files exist), list
     In Progress / To Do and cross-reference ACTIVE_CONTEXT.
   - **trevor** — if `.leanagentkit/trevor.yml` has `enabled: true` and
     `session_preamble: true`, surface pending reminders per `leanagentkit-ask-trevor`
     (max `max_reminders_per_session`); do not block the session.

## Do not

- Do not read `docs/adr/*` unless about to make/change a decision.
- Do not read `PROGRESS.md` for routine work.
- Do not dump the repository to re-orient — that's what the map is for.
