---
name: leanagentkit-handoff
description: Compact the current conversation into an in-repo handoff document so a fresh agent or another tool can continue the work.
---

# Skill: leanagentkit-handoff

**Goal:** Write a handoff document summarizing the current conversation so a
fresh agent — in a new context window or a different tool — can continue the work
without re-deriving state.

**Output file:** `docs/memory/HANDOFF.md`

## When to use

- The context window is filling up and you need a fresh session.
- You are branching off (e.g. into a prototype or spike) and want the current
  thread preserved.
- You are switching tools (Cursor ↔ Claude ↔ Codex ↔ …) mid-task.

**Relationship to `leanagentkit-end-session`:** end-session persists *durable
project memory* (`ACTIVE_CONTEXT`, `PROGRESS`, map) at a natural stopping point.
Handoff is the *cross-window / cross-tool baton* for an in-flight task — use it
when you are not done but the conversation can't continue in place.

## Procedure

1. If the user passed an argument, treat it as a description of what the next
   session will focus on and tailor the document to that.
2. Write `docs/memory/HANDOFF.md` covering: the goal, what's been done, what's
   left, current state / where you are, and any open questions or gotchas.
3. Add a **Suggested skills** section naming the kit skills the next agent should
   invoke (e.g. `leanagentkit-start-session` to prime, the active
   `docs/specs/<feature>.md`, then `leanagentkit-check` before wrapping up).
4. **Do not duplicate** content already captured in other artifacts (specs,
   ADRs, `PROGRESS.md`, commits, diffs) — reference them by path instead.
5. **Redact** any sensitive information — API keys, passwords, tokens, or PII.

## Quality bar

- A fresh agent could resume from `HANDOFF.md` alone plus the referenced files.
- No secrets or PII in the document.
- Nothing restated that already lives in a spec, ADR, or `PROGRESS.md`.
