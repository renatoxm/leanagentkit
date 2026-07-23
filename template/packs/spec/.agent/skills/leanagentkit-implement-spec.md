---
name: leanagentkit-implement-spec
description: Implement a spec via Cursor Plan Build when available, else portable sequential or parallel slices.
---

# Skill: leanagentkit-implement-spec

**Goal:** Execute an existing feature spec without re-deriving scope. Prefer the
host's fastest executor when available; otherwise run a portable implement loop
that stays within the spec's In/Out boundaries.

## When to use

- After `leanagentkit-new-spec`, or when a spec already exists in `docs/specs/`.
- The user is ready to start coding (including "Plan implementation, then build").

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
  read it.
- If the parent spec links a plan (`> Plan: docs/specs/NNN-*-plan.md`), read it
  and treat it as the execution blueprint (alongside Implementation order in the
  parent spec).
- If spec `Status: draft`, confirm the user wants to proceed; set `Status: active`
  and update the date.
- **Portable plan gate (non-trivial specs).** A spec is **non-trivial** when it
  has 3+ acceptance criteria or Approach touches 3+ modules (or a slices file is
  linked). Before any coding route starts, ensure these sections are filled:
  - **Decisions (locked)**
  - **Implementation order** (dependency-safe steps)
  - **Test plan** (maps verification to ACs)
  - **Done when** (or equivalent quality gate)
  If any are empty, fill them from the Approach / slices / CODEBASE_MAP and show
  the user a short summary for approval. Do **not** start coding until the user
  accepts the plan (or explicitly says to skip planning). Trivial specs may skip
  this gate.
- Update `ACTIVE_CONTEXT` with the spec path and a resume note (e.g. "Resume:
  implementing `<spec>` — route pending") before any host mode switch.
- **Backlog.md (optional).** If Backlog integration is active and the spec has a
  `Backlog:` id, move the card to In Progress:
  ```bash
  backlog task edit <task-id> -s "In Progress" --plain
  ```
  If Backlog is not active or no card is linked, skip silently.

### 2. Choose execution route

Decide **once**, then follow only that branch. Do not start the portable
implement loop if the Cursor Plan Build route succeeds.

#### Cursor Plan Build — preferred when available

Use this route when **all** of the following are true:

1. Host is **Cursor**.
2. Plan mode is **available** — either `SwitchMode` accepts `target_mode_id:
   "plan"`, **or** the user can open Plan via Shift+Tab / the mode picker.
3. The user wants Plan/Build — they chose "Plan implementation, then build", the
   spec is **non-trivial**, or they explicitly ask for Plan mode.

**Bypass this route** (go to §3 Portable LAK implement) when **any** of these
hold — do **not** wait on Plan, invent Plan tools, or stall:

- Host is **not** Cursor (Claude Code, Aider, Cline, Copilot, ChatGPT, …).
- Plan mode is **unavailable** (`SwitchMode` missing/fails for `plan`, and the
  user confirms Plan is not in the mode picker / not offered).
- User chose **"Implement end-to-end"**, **"Implement using slices"**, or
  otherwise asks to implement **in this chat**.
- User declines the Plan handoff ("Not yet", "Implement here", …).
- Spec is **trivial** and the user did not ask for Plan.

When bypassing, say one short line (e.g. "Plan mode unavailable here — continuing
with portable implement") and proceed to §3. Never block on Cursor-only tools.

#### Cursor Plan Build steps

When the preferred route applies:

1. Persist: `Status: active`; `ACTIVE_CONTEXT` resume note like "Resume: Cursor
   Plan Build for `<spec>`". Offer `leanagentkit-handoff` if context is heavy.
2. Ask: "Hand off to Cursor Plan + Build now?" with options: "Switch to Plan mode
   now", "Implement in this chat instead", "Something else (I will type it)".
3. On "Implement in this chat instead" → §3 Portable LAK implement.
4. On "Switch to Plan mode now":
   - If `SwitchMode` is available: call it with `target_mode_id: "plan"`.
   - If not: tell the user to switch via Shift+Tab / mode picker, then paste the
     prompt below.
5. Use this Plan prompt (adapt paths; include slices only when present):

   ```
   Spec (source of truth): `<spec-path>`
   Slices (if any): `<slices-path>`

   Create a Cursor implementation plan from the spec's Decisions, Approach,
   Implementation order, and Test plan. Do not re-grill requirements.

   Include:
   - Todos with id/content for each Implementation order step (or each
     Parallel=yes slice after foundation slices)
   - File-level changes grouped by module
   - Test plan mapped to each acceptance criterion

   Respect spec In/Out. Parallel only where slices say Parallel=yes.

   After I approve, I will click Build — use Cursor's Build orchestrator to
   execute todos (parallel workers when safe). Do not ask me to re-implement
   sequentially in chat.
   ```

6. After the plan exists: suggest **Save to workspace** as
   `docs/specs/NNN-<feature>-plan.md` and add
   `> Plan: docs/specs/NNN-<feature>-plan.md` to the parent spec. If portable
   Implementation order / Test plan are still empty, copy approved plan content
   into them for non-Cursor resume.
7. **Stop the LAK implement loop in this chat.** Tell the user to review the
   plan and click **Build**. Cursor's Build orchestrator is the executor — do
   **not** start §3 sequential/parallel coding here after a successful handoff.
8. **After Build** (user returns, new message, or asks to wrap up): sync the
   spec — check off completed ACs / Test plan items from what Build changed,
   run `leanagentkit-check`, set `Status: done` when complete, offer
   `leanagentkit-end-session`. If Build drifted, follow **When implementation
   diverges**.

### 3. Portable LAK implement (non-Cursor / no Plan / user declined Plan)

Git lifecycle branch offer (if active) runs here — **except** when parallel
slice mode is chosen below; then slice branches use `leanagentkit-git-workflow`.
Record branch name(s) in spec frontmatter when created.

#### 3a. Order work

- If a slices file exists and architecture integration is active with
  `parallel_work.enabled: true`, ask: "Implement sequentially (by slice)" vs
  "Implement parallel slices (where Parallel=yes)?"
- Prefer **parallel** when: slices file exists, ≥2 slices have `Parallel=yes`,
  contracts are satisfied when `require_contracts: true`, and the user does not
  decline. Otherwise default to **sequential-by-slice** when a slices file
  exists, or **sequential-by-AC** when not.
- Choosing **parallel** once is consent to spawn up to `max_parallel` workers for
  eligible slices — **do not** re-ask per slice.

| Mode | When | Work order |
|------|------|------------|
| **sequential-by-AC** | No slices file | Parent spec ACs / Implementation order |
| **sequential-by-slice** | Slices file; parallel declined or unavailable | Slices in DependsOn order, one slice at a time |
| **parallel** | Slices + consent (or preferred default above) + contracts OK | Phases A → B → C below |

State the first concrete action in 1–2 lines, then begin **without waiting** for
another confirmation.

#### 3b. Keep moving (critical)

- After marking a step / slice / AC done, **immediately** start the next
  unfinished item in the same turn when possible.
- Do **not** stop after a status update, checkbox, or "done" note unless blocked,
  asking one clarifying question, or waiting on a user-required approval
  (commit / push / PR).
- Narrate progress briefly; prefer tool calls that advance the next unit.

#### 3c. Implement

**Sequential-by-AC** (no slices file):

- Work Implementation order steps (or ACs) in order.
- Open only files named in the spec Approach / Implementation order or
  `ACTIVE_CONTEXT` "Files in play".
- Do not re-grill or broaden scope unless blocked — ask one question if blocked.
- After meaningful chunks, run `leanagentkit-check` on changed files, then
  continue to the next unfinished item.

**Sequential-by-slice** (slices file, parallel not used):

- Work one slice at a time in DependsOn order (foundation slices first).
- Open only files in that slice's **FilesInPlay** column (+ contract files when
  referenced).
- Update slice **Status** → `active` while working, → `done` when complete.
- Run `leanagentkit-check` after each slice (or after integration slice if last),
  then continue to the next unfinished slice.
- Map slice completion to parent spec ACs — check off ACs only when the work
  that satisfies them is integrated and verified.
- Do not re-grill or broaden scope unless blocked.

**Parallel mode** (slices + mode consent + contracts satisfied + architecture
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
   - **Spawn subagents / parallel agents now** (mode choice already consented).
     Prefer host Task/subagent tools when available. Portable fallback: open
     separate chat sessions per worktree and paste the slice row + contract.
   - Update slice Status → `done` when each finishes; do not wait to start the
     next eligible slot while under `max_parallel`.
   Do **not** check off parent spec ACs during Phase B.
4. **Phase C — integration:** single agent completes the `integration` slice:
   - Merge slice branches per `leanagentkit-git-workflow` Merge slices subsection.
   - Run `leanagentkit-check` on all changed files.
   - **Only now** check off parent spec ACs (`- [x]`) that are verified end-to-end.
5. Track slice status in the slices file (`pending` · `active` · `done` · `blocked`).

If the host cannot spawn workers, say so once and run Phase B sequentially
without re-asking — still finish all eligible slices before Phase C.

#### 3d. Track progress

- **Sequential-by-AC:** check off criteria as each is met (`- [x]`).
- **Sequential-by-slice:** check off ACs when the slice work that satisfies them
  is complete and verified; integration slice ACs last when applicable.
- **Parallel mode:** do **not** check off parent spec ACs or offer AC-scoped
  commits until Phase C (integration) completes and `leanagentkit-check` PASS.
- Check off **Test plan** items as verification runs succeed.
- **Backlog.md (optional).** If active and the spec has a `Backlog:` id, check
  the matching Backlog AC when each **parent spec** criterion is met (after
  integration in parallel mode):
  ```bash
  backlog task edit <task-id> --check-ac <n> --plain
  ```
  (`n` is 1-based.) If Backlog is not active, skip silently.
- **Git lifecycle (optional).** If active and `offer_commit_on_ac: true`, offer a
  save-point commit after each criterion is checked — **not during parallel
  Phases A/B**. Never commit without user confirmation.
- When all criteria pass and `leanagentkit-check` is clean, set `Status: done`
  and check **Done when** items.
- **Git lifecycle (optional).** If active and spec is `Status: done`, offer push
  + PR before persisting. Never push or open a PR without user confirmation.

#### 3e. Persist

- Offer `leanagentkit-end-session` to persist state.
- If switching tools mid-implementation, run `leanagentkit-handoff` first.

### When implementation diverges

If Build / coding drifts from the approved spec or plan:

1. Stop patching forward.
2. Revert to the last good checkpoint or git state the user approves.
3. Refine **Approach**, **Implementation order**, slices, or the linked plan file.
4. Re-run this skill from Prime — do not invent new scope outside In/Out.
5. On Cursor, prefer re-entering §2 Cursor Plan Build after refining the plan.

## Host enhancements (optional — never required)

See also `AGENTS.md` §6 — Host enhancements.

Cursor Plan Build is defined in §2 — it is the preferred host path when Plan is
available, **not** an afterthought on top of portable sequential implement.

Non-Cursor hosts always use §3. Cursor without Plan mode always uses §3.

## Quality bar

- Every acceptance criterion is checked off or explicitly deferred with user approval.
- No scope creep beyond the spec's In/Out boundaries.
- Non-trivial specs have filled Decisions, Implementation order, and Test plan
  before coding (or an explicit user skip).
- On Cursor with Plan available, "Plan then build" hands off to Plan + **Build**
  and does not fall through into a duplicate sequential implement in the same chat.
- When Plan is unavailable or bypassed, portable implement continues without stalling.
- Portable path: unfinished units continue in the same turn after a unit is marked done.
- `leanagentkit-check` PASS before marking the spec `done`.
- Parallel mode: no parent AC checkoffs until integration slice completes.
