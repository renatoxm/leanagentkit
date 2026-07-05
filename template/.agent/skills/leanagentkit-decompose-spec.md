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

When slices are written, offer:

> "Ready to implement? Invoke `leanagentkit-implement-spec` — sequential-by-slice
> (default when slices exist), or parallel slices if architecture integration is
> active (`.leanagentkit/architecture.yml` with `enabled: true` and contracts filled)."

## Quality bar

- Dependency graph is acyclic; integration slice depends on all adapters it merges.
- Every `parallel: yes` slice has contract + disjoint FilesInPlay.
- Domain and use_case slices are `parallel: no` unless the feature is trivial.
- CA/DDD diagnostic scores recorded; failed rows inform slice boundaries.

## Host enhancements (optional — never required)

When the host is Cursor and the user agrees to Plan mode before implement:

- Suggested Plan prompt: "Implement `docs/specs/NNN-<feature>.md` using slices in
  `NNN-<feature>-slices.md`. Respect DependsOn order; parallel only where Parallel=yes."

Otherwise continue with the portable procedure above.
