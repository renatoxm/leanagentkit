---
name: leanagentkit-implement-spec
description: Implement a spec sequentially or in parallel slices.
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
- If the parent spec links a slices file (`> Slices: docs/specs/NNN-*-slices.md`),
  read it and note the implementation mode chosen in step 2.
- If spec `Status: draft`, confirm the user wants to proceed; set `Status: active`
  and update the date.
- **Backlog.md (optional).** If Backlog integration is active and the spec has a
  `Backlog:` id, move the card to In Progress:
  ```bash
  backlog task edit <task-id> -s "In Progress" --plain
  ```
  If Backlog is not active or no card is linked, skip silently.
- **Git lifecycle (optional).** If git lifecycle integration is active (see
  `leanagentkit-git-lifecycle` detection contract), offer branch creation per
  that skill — **except** when parallel slice mode is chosen (step 2); slice
  branches are created per `leanagentkit-git-workflow` instead. Record branch
  name(s) in spec frontmatter when created.

### 2. Order work

- If a slices file exists and architecture integration is active with
  `parallel_work.enabled: true`, ask: "Implement sequentially (by slice)" vs
  "Implement parallel slices (where Parallel=yes)?"
- Default to **sequential-by-slice** when: slices file exists (even if parallel
  disabled), user declines parallel, or contracts are incomplete when
  `require_contracts: true`.
- If no slices file, use **sequential-by-AC** (acceptance criteria order).

| Mode | When | Work order |
|------|------|------------|
| **sequential-by-AC** | No slices file | Parent spec ACs in dependency order |
| **sequential-by-slice** | Slices file; parallel declined or unavailable | Slices in DependsOn order, one slice at a time |
| **parallel** | Slices file + user consent + contracts satisfied | Phases A → B → C below |

State the first concrete action in 1–2 lines, then begin.

### 3. Implement

**Sequential-by-AC** (no slices file):

- Work one acceptance criterion at a time.
- Open only files named in the spec Approach or `ACTIVE_CONTEXT` "Files in play".
- Do not re-grill or broaden scope unless blocked — ask one question if blocked.
- After meaningful chunks, run `leanagentkit-check` on changed files.

**Sequential-by-slice** (slices file, parallel not used):

- Work one slice at a time in DependsOn order (foundation slices first).
- Open only files in that slice's **FilesInPlay** column (+ contract files when
  referenced).
- Update slice **Status** → `active` while working, → `done` when complete.
- Run `leanagentkit-check` after each slice (or after integration slice if last).
- Map slice completion to parent spec ACs — check off ACs only when the work
  that satisfies them is integrated and verified.
- Do not re-grill or broaden scope unless blocked.

**Parallel mode** (slices file + user consent + contracts satisfied + architecture
integration active):

1. **Validate:** acyclic slice graph; each `parallel: yes` slice has contract +
   disjoint FilesInPlay; respect `max_parallel` from `.leanagentkit/architecture.yml`.
2. **Phase A — foundation:** complete slices with `parallel: no` and no unmet
   DependsOn (typically `domain`, `use_case`). Update slice Status → `done`.
   Do **not** check off parent spec ACs yet unless an AC is fully satisfied and
   integrated in this phase alone.
3. **Phase B — parallel adapters/contexts:** for each eligible slice (up to
   `max_parallel` at a time):
   - If `use_worktrees: true`, create worktree + branch per
     `leanagentkit-git-workflow` Parallel slices subsection.
   - Narrow scope: parent spec + slices file + slice row + contract files only.
   - Spawn subagents or parallel agents **only with explicit user consent**.
     Portable fallback: separate chat sessions per worktree.
   - Update slice Status → `done` when complete.
   Do **not** check off parent spec ACs during Phase B.
4. **Phase C — integration:** single agent completes the `integration` slice:
   - Merge slice branches per `leanagentkit-git-workflow` Merge slices subsection.
   - Run `leanagentkit-check` on all changed files.
   - **Only now** check off parent spec ACs (`- [x]`) that are verified end-to-end.
5. Track slice status in the slices file (`pending` · `active` · `done` · `blocked`).

Do not spawn subagents or parallel agents without user consent.

### 4. Track progress

- **Sequential-by-AC:** check off criteria in the spec as each is met (`- [x]`).
- **Sequential-by-slice:** check off ACs when the slice work that satisfies them
  is complete and verified; integration slice ACs last when applicable.
- **Parallel mode:** do **not** check off parent spec ACs or offer AC-scoped commits
  until Phase C (integration) completes and `leanagentkit-check` PASS. Slice
  Status updates happen per phase; Backlog AC sync waits until parent ACs are checked.
- **Backlog.md (optional).** If Backlog integration is active and the spec has a
  `Backlog:` id, check the matching Backlog AC when each **parent spec** criterion
  is met (after integration in parallel mode):
  ```bash
  backlog task edit <task-id> --check-ac <n> --plain
  ```
  (`n` is 1-based, matching creation order.) If Backlog is not active, skip silently.
- **Git lifecycle (optional).** If active and `offer_commit_on_ac: true` in
  `.leanagentkit/git-lifecycle.yml`, offer a save-point commit per
  `leanagentkit-git-lifecycle` after each criterion is checked — **not during
  parallel Phases A/B** (wait until Phase C). Never commit without user confirmation.
- When all criteria pass and `leanagentkit-check` is clean, set `Status: done`.
- **Git lifecycle (optional).** If active and spec is `Status: done`, offer push
  + PR per `leanagentkit-git-lifecycle` before persisting. Never push or open a
  PR without user confirmation.

### 5. Persist

- Offer `leanagentkit-end-session` to persist state.
- If switching tools mid-implementation, run `leanagentkit-handoff` first.

## Host enhancements (optional — never required)

See also `AGENTS.md` §6 — Host enhancements.

If the host is Cursor **and** the `SwitchMode` tool is available **and** the user
agrees to use Plan mode:

- Ask: "Switch to Plan mode now?" with options: "Switch to Plan mode now",
  "Not yet", and "Something else (I will type it)".
- On "Switch to Plan mode now": call `SwitchMode` with `target_mode_id: "plan"`.
- Suggested Plan prompt: "Implement `<spec-path>` per acceptance criteria.
  Build locally, sequentially, one criterion at a time." (Or, when a slices file
  exists: "Implement per slices; respect DependsOn; parallel only where Parallel=yes.")

If the host is Cursor but `SwitchMode` is unavailable:

- Suggest switching to Plan mode manually (Shift+Tab or the mode picker).

Otherwise (Claude, Aider, Cline, Copilot, ChatGPT, etc.):

- Continue in the current mode using the portable procedure above.

## Quality bar

- Every acceptance criterion is checked off or explicitly deferred with user approval.
- No scope creep beyond the spec's In/Out boundaries.
- `leanagentkit-check` PASS before marking the spec `done`.
- Parallel mode: no parent AC checkoffs until integration slice completes.
