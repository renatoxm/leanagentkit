---
name: leanagentkit-architecture
description: Optional CA/DDD decomposition and parallel slice rules.
invocation: conditional
---

# Skill: leanagentkit-architecture

**Goal:** Wire architecture-guided decomposition into the kit as an optional layer.
The **spec** (`docs/specs/NNN-*.md`) owns intent; the **slices file**
(`docs/specs/NNN-<feature>-slices.md`) owns work packages and parallel eligibility.

**When active:** `leanagentkit-decompose-spec`, `leanagentkit-implement-spec`, and
`leanagentkit-check` call into this skill's procedures. When inactive, they are
silent no-ops.

## Detection contract

Architecture integration is **active** only when **both** are true:

1. `.leanagentkit/architecture.yml` exists (copied from
   `.leanagentkit/architecture.yml.example` during bootstrap or manually).
2. `enabled: true` in that file.

If either check fails, skip every architecture step — do not error, do not prompt.

Read config from `.leanagentkit/architecture.yml`. If `enabled: false`, skip silently.

## Embedded references

Kit-owned reference material (no external install). See
`.agent/skills/references/THIRD_PARTY.md` for attribution.

| Reference | Path | Use for |
|-----------|------|---------|
| Clean Architecture | `.agent/skills/references/clean-architecture/SKILL.md` | Dependency Rule, layers, boundaries, component cycles |
| CA deep refs | `.agent/skills/references/clean-architecture/references/` | dependency-rule, entities-use-cases, boundaries, etc. |
| Domain-Driven Design | `.agent/skills/references/domain-driven-design/SKILL.md` | Bounded contexts, aggregates, events, strategic design |
| DDD deep refs | `.agent/skills/references/domain-driven-design/references/` | bounded-contexts, building-blocks, domain-events, etc. |

Read the SKILL.md Quick Diagnostic tables when decomposing or checking boundaries.

## Config

See `.leanagentkit/architecture.yml.example` for the schema. Key fields:

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Master switch |
| `offer_decompose_after_spec` | `true` | Offer `leanagentkit-decompose-spec` after `new-spec` |
| `parallel_work.enabled` | `true` | Allow parallel slice mode in `implement-spec` |
| `parallel_work.max_parallel` | `3` | Cap concurrent parallel slices |
| `parallel_work.require_contracts` | `true` | Block parallel until Integration contracts filled |
| `parallel_work.use_worktrees` | `true` | One git worktree per parallel slice |

## Parallel safety rules

Single source of truth for `leanagentkit-decompose-spec` and parallel mode in
`leanagentkit-implement-spec`.

### Parallel OK when ALL hold

- Slice dependency graph is **acyclic**
- Each parallel slice has a **written contract** (port, event, or API schema ref)
- **Disjoint file sets** — no two parallel slices edit the same file
- **No shared aggregate mutation** across parallel slices (DDD: one aggregate root per consistency boundary)
- Integration/wiring slice is marked `parallel: no` and runs **last**

### Sequential required

- Core **domain** and **use_case** slices before adapters (CA: inner circles first)
- **Shared-kernel** or **partnership** context pairs (DDD context mapping)
- Same aggregate or strong-consistency boundary
- **Integration** slice — merge worktrees, composition root, end-to-end check

## Optional boundary checks (for leanagentkit-check)

When architecture integration is active and domain-layer paths exist in the
codebase map, report (do not auto-fix):

- Framework/ORM imports inside paths named `domain/`, `entities/`, or equivalent
- Source dependencies pointing outward from inner layers (CA Dependency Rule)
- Technical-only names (`Manager`, `Helper`, `Processor`) in domain modules (DDD ubiquitous language)

Cite `.agent/skills/references/clean-architecture/` or
`.agent/skills/references/domain-driven-design/` and `AGENTS.md §4`.

## Lifecycle hooks

### After new-spec

Delegated to `leanagentkit-new-spec` § Handoff. When architecture integration is
active, that skill offers an interactive questionnaire (or inline fallback):

- **Both paths** — `offer_decompose_after_spec: true` in
  `.leanagentkit/architecture.yml` and the spec is non-trivial (3+ acceptance
  criteria or Approach touches 3+ modules): Decompose, Implement, or Not yet.
- **Implement only** — architecture inactive, `offer_decompose_after_spec: false`,
  or trivial spec.

On user choice, `new-spec` chains into `leanagentkit-decompose-spec` or
`leanagentkit-implement-spec` (after Agent-mode gate when the host is read-only).
Skip decomposition for trivial specs (Level 1–2 work).

### During implement-spec

If a slices file is linked from the parent spec and `parallel_work.enabled: true`,
offer sequential vs parallel implementation per `leanagentkit-implement-spec`.

## Rules

- Capability-gate every step — silent no-op when architecture is not active.
- Spec owns intent; slices file owns work packages and parallel eligibility.
- Never auto-spawn parallel agents — user consent required.
- Embedded references are read-only kit content — do not overwrite on upgrade except via kit refresh.
