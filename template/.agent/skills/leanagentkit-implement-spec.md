---
name: leanagentkit-implement-spec
description: Implement an approved feature spec from docs/specs/ — spec-driven, sequential work with optional Cursor Plan mode handoff.
---

# Skill: leanagentkit-implement-spec

**Goal:** Execute an existing feature spec without re-deriving scope. Work acceptance
criteria in order and stay within the spec's In/Out boundaries.

## When to use

- After `leanagentkit-new-spec`, or when a spec already exists in `docs/specs/`.
- The user is ready to start coding.

**Not for:** fuzzy requirements (`leanagentkit-grill`), spec authoring
(`leanagentkit-new-spec`), or routine tweaks with no active spec.

## Prerequisites

- Active spec linked in `docs/memory/ACTIVE_CONTEXT.md` or named by the user.
- Spec has testable acceptance criteria and a filled Approach section.

## Procedure

### 1. Prime

- Run `leanagentkit-start-session`, or read `ACTIVE_CONTEXT` + the active
  `docs/specs/NNN-*.md` + Approach files named in `docs/CODEBASE_MAP.md`.
- If spec `Status: draft`, confirm the user wants to proceed; set `Status: active`
  and update the date.

### 2. Order work

- List acceptance criteria in dependency order (respect Approach).
- State the first concrete action in 1–2 lines, then begin.

### 3. Implement

- Work one acceptance criterion at a time.
- Open only files named in the spec Approach or `ACTIVE_CONTEXT` "Files in play".
- Do not re-grill or broaden scope unless blocked — ask one question if blocked.
- Do not spawn subagents or parallel agents unless the user explicitly asks.
- After meaningful chunks, run `leanagentkit-check` on changed files.

### 4. Track progress

- Check off criteria in the spec as each is met (`- [x]`).
- When all criteria pass and `leanagentkit-check` is clean, set `Status: done`.

### 5. Persist

- Offer `leanagentkit-end-session` to persist state.
- If switching tools mid-implementation, run `leanagentkit-handoff` first.

## Host enhancements (optional — never required)

If the host is Cursor **and** the `SwitchMode` tool is available **and** the user
agrees to use Plan mode:

- Ask: "Switch to Plan mode now?" with options: "Switch to Plan mode now",
  "Not yet", and "Something else (I will type it)".
- On "Switch to Plan mode now": call `SwitchMode` with `target_mode_id: "plan"`.
- Suggested Plan prompt: "Implement `<spec-path>` per acceptance criteria.
  Build locally, sequentially, one criterion at a time."

If the host is Cursor but `SwitchMode` is unavailable:

- Suggest switching to Plan mode manually (Shift+Tab or the mode picker).

Otherwise (Claude, Aider, Cline, Copilot, ChatGPT, etc.):

- Continue in the current mode using the portable procedure above.

## Quality bar

- Every acceptance criterion is checked off or explicitly deferred with user approval.
- No scope creep beyond the spec's In/Out boundaries.
- `leanagentkit-check` PASS before marking the spec `done`.
