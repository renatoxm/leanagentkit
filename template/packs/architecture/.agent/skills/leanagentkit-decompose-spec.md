---
name: leanagentkit-decompose-spec
description: Break a spec into parallel-safe work slices.
---

# Skill: leanagentkit-decompose-spec

**Goal:** Break a feature spec into ordered, contract-backed work slices so
implementation can run sequentially or in parallel (when safe).

**Output file:** `docs/specs/NNN-<kebab-feature-name>-slices.md` (from
`docs/specs/_SLICES_TEMPLATE.md`)

**References:** `.agent/skills/references/clean-architecture/` and
`.agent/skills/references/domain-driven-design/` (embedded; see
`.agent/skills/references/THIRD_PARTY.md`)

## When to use

- After `leanagentkit-new-spec`, when architecture integration is active
  (`.leanagentkit/architecture.yml` with `enabled: true`), or when the user
  explicitly asks to decompose a spec.
- Level 3+ features with multiple modules, boundaries, or contexts.

**Not for:** trivial one-file changes (Level 1–2), fuzzy requirements (`leanagentkit-grill`),
or spec authoring (`leanagentkit-new-spec`).

## Prerequisites

- Parent spec exists at `docs/specs/NNN-*.md` with filled Approach and acceptance criteria.
- Read parallel safety rules from `leanagentkit-architecture` when integration is active.

## Procedure

### 1. Prime

- Read the parent spec and `docs/CODEBASE_MAP.md`.
- Read `.leanagentkit/architecture.yml` if present (respect `require_contracts`, `max_parallel`).

### 2. Run architecture diagnostics

From embedded references, run each **Quick Diagnostic** table (7 rows):

- Clean Architecture: `.agent/skills/references/clean-architecture/SKILL.md`
- Domain-Driven Design: `.agent/skills/references/domain-driven-design/SKILL.md`

Record scores and failed rows in the slices file **Architecture diagnostics** section.
Open deep refs only when a failed row needs detail (e.g. `references/dependency-rule.md`,
`references/bounded-contexts.md`).

### 3. Identify boundaries

From the parent spec Approach and codebase map:

- **Bounded contexts** (DDD) — linguistic/model boundaries; note ACL or events between them
- **Use cases / ports** (CA) — one operation per use_case slice where practical
- **Adapters** (CA) — HTTP, persistence, messaging confined to adapter slices

### 4. Build work slices

Copy `docs/specs/_SLICES_TEMPLATE.md` → `docs/specs/NNN-<feature>-slices.md`.

Fill the **Work slices** table. For each row:

| Column | Guidance |
|--------|----------|
| **ID** | `S1`, `S2`, … |
| **Title** | Short, domain-language name |
| **Type** | `domain` · `use_case` · `adapter` · `context` · `integration` |
| **DependsOn** | Comma-separated IDs or `—` |
| **Parallel** | `yes` only when parallel safety rules pass; else `no` |
| **Contract** | Port, event, or schema ref — required for `parallel: yes` when `require_contracts: true` |
| **FilesInPlay** | Explicit paths from CODEBASE_MAP / Approach |
| **Status** | Start as `pending` |

Order: domain → use_case → parallel adapters/contexts → integration last.

### 5. Define integration contracts

Fill **Integration contracts** before offering parallel implementation:

- Port interfaces (CA): e.g. `OrderRepository`, `PlaceOrderInput`
- Domain events (DDD): e.g. `OrderPlaced { orderId, … }`
- API schemas where adapters expose HTTP/RPC

If `require_contracts: true` and contracts are empty, parallel mode must not be offered.

### 6. Link parent spec

Add to parent spec frontmatter:

```markdown
> Slices: docs/specs/NNN-<feature>-slices.md   ·   …
```

Set `docs/memory/ACTIVE_CONTEXT.md` → Current focus to include the slices file path.

### 7. Handoff

Do not implement in this skill unless the user explicitly asks.

When slices are written:

1. **Summarize** slice count and parallel-safe groups in 1–2 lines.
2. **Ask** (interactive UI when available — e.g. Cursor `AskQuestion`; see
   `AGENTS.md` §6 — Asking the user). Fall back to inline text when unsupported.

   - Recommended: "Plan implementation, then build" (Cursor Plan or portable
     Implementation order on the parent spec)
   - Also: "Implement using slices" (sequential-by-slice default; parallel where
     `Parallel=yes` when architecture integration is active)
   - Also: "Not yet — stop after slices"

3. **On choice** — if the user chose Plan or Implement and the host is in a
   read-only mode (e.g. Cursor Ask mode), ask to switch to Agent mode before
   chaining (Shift+Tab or the mode picker). Do not invoke write skills until the
   host allows edits. Persist `ACTIVE_CONTEXT` before any mode switch.

4. **Chain** — continue in this session without re-asking **this** plan /
   implement vs not-yet choice (downstream skill prompts still apply):
   - Plan implementation, then build → read
     `.agent/skills/leanagentkit-implement-spec.md` and follow it (Prime plan gate
     + optional Cursor Plan host enhancement; offer SwitchMode when available).
   - Implement → read `.agent/skills/leanagentkit-implement-spec.md` and follow it.
   - Not yet → stop; do not invoke another skill.

Choosing Plan or Implement counts as explicit consent to leave decomposition.
`leanagentkit-implement-spec` step 2 handles sequential vs parallel slice mode.

## Quality bar

- Dependency graph is acyclic; integration slice depends on all adapters it merges.
- Every `parallel: yes` slice has contract + disjoint FilesInPlay.
- Domain and use_case slices are `parallel: no` unless the feature is trivial.
- CA/DDD diagnostic scores recorded; failed rows inform slice boundaries.

## Host enhancements (optional — never required)

See also `AGENTS.md` §6 — Host enhancements and
`leanagentkit-implement-spec` § Host enhancements (same Plan prompt shape).

**When to recommend Plan mode:** after slices are written (decomposition already
implies non-trivial scope). Prefer Plan before implement unless the user asks to
code immediately.

If the host is Cursor **and** the `SwitchMode` tool is available **and** the user
agrees to use Plan mode before implement:

1. Persist first: ensure parent spec frontmatter links `> Slices: …` and
   `ACTIVE_CONTEXT` includes the slices path. Offer `leanagentkit-handoff` if
   context is heavy.
2. Ask: "Switch to Plan mode now?" with options: "Switch to Plan mode now",
   "Not yet", and "Something else (I will type it)".
3. On "Switch to Plan mode now": call `SwitchMode` with `target_mode_id: "plan"`.
4. Suggested Plan prompt:

   ```
   Create an implementation plan for `<spec-path>` using slices in
   `<slices-path>`.

   Include:
   - Decisions (locked) — from parent spec; do not re-grill
   - File-level changes per slice (FilesInPlay)
   - Implementation order respecting DependsOn
   - Test plan mapped to parent acceptance criteria
   - Todos with id/content for each slice / step

   Do not write code until I approve the plan and click Build.
   Parallel only where Parallel=yes; otherwise sequential-by-slice.
   Respect parent spec In/Out boundaries.
   ```

5. After the plan exists: suggest **Save to workspace** as
   `docs/specs/NNN-<feature>-plan.md`, and add
   `> Plan: docs/specs/NNN-<feature>-plan.md` to the parent spec frontmatter.

If the host is Cursor but `SwitchMode` is unavailable:

- Suggest switching to Plan mode manually (Shift+Tab or the mode picker) and use
  the same Plan prompt.

Otherwise (Claude, Aider, Cline, Copilot, ChatGPT, etc.):

- Continue with the portable procedure; when chaining to implement-spec, that
  skill's Prime plan gate fills Implementation order / Test plan on the parent
  spec.
