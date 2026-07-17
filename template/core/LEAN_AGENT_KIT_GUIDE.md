# Lean Agent Kit Guide

Canonical playbook for the **1.0 lean core** and optional packs. Ship this file
with every install as `LEAN_AGENT_KIT_GUIDE.md`.

## 1. Mental model

Lean Agent Kit is **context economics**:

1. **Lean context** — sessions start from `ACTIVE_CONTEXT` + `CODEBASE_MAP`, then
   open named files. Narrow search is allowed when the map is wrong or incomplete.
2. **Lean footprint** — default install is core only. Packs are opt-in overlays.

It is not a replacement for your editor agent’s tools. It is a small set of
trustworthy files so work resumes accurately.

## 2. Core files

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Project identity, commands, conventions, protocol |
| `docs/CODEBASE_MAP.md` | Where things live |
| `docs/memory/ACTIVE_CONTEXT.md` | What we’re doing now |
| `.agent/skills/leanagentkit-*.md` | Portable procedures |
| `.agent/.leanagentkit-version` | Version + `installedPacks` |

## 3. Map-first protocol

1. Read `ACTIVE_CONTEXT.md`, then `CODEBASE_MAP.md`.
2. Open files they name.
3. If needed, **search narrowly** (symbol, path prefix, tests for one module).
4. Do **not** re-scan the whole repository to “get oriented.”

## 4. Workflow sizes

| Size | Use when | Loop |
|------|----------|------|
| Trivial | Tiny fix, question | Work only; update ACTIVE_CONTEXT if focus changes |
| Normal | Day-to-day coding | `start-session` → work → `check` → `end-session` |
| Substantial | Fuzzy/new feature | Requires **spec** pack: `grill` → `new-spec` → `implement-spec` → `check` → `end-session` |

Mid-task context full → `handoff` → new chat → `start-session`.

## 5. Bookkeeping budget

- Always (normal/substantial end): refresh `ACTIVE_CONTEXT` with a concrete resume note.
- Map: only if structure changed.
- PROGRESS / SCRATCH / ADRs / specs: only if the **spec** pack is installed and
  something material changed.
- Do not turn every typo fix into a session ritual.

## 6. Core skills

| Skill | When |
|-------|------|
| `leanagentkit-bootstrap` | First setup |
| `leanagentkit-map-codebase` | Build/refresh map |
| `leanagentkit-init-conventions` | Fill AGENTS §1–5 |
| `leanagentkit-wire-agent` | Cursor / Claude wrappers |
| `leanagentkit-start-session` | Normal/substantial start |
| `leanagentkit-end-session` | Persist context |
| `leanagentkit-handoff` | Context full mid-task |
| `leanagentkit-check` | Convention check |
| `leanagentkit-enable-pack` | Add packs |
| `leanagentkit-migrate-1` | 0.x → 1.0 |

Invoke: `Read .agent/skills/leanagentkit-<name>.md and follow it.`

## 7. Packs

Install:

```bash
npx create-lean-agent-kit@latest . --with spec,stacks          # first scaffold
npx create-lean-agent-kit@latest . --enable-pack practice      # existing install
npx create-lean-agent-kit@latest . --prune-to-core             # drop pack overlays
npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec
```

| Pack | Depends | Summary |
|------|---------|---------|
| `spec` | — | Grill, specs, implement, spike, ADRs, PROGRESS/SCRATCH |
| `stacks` | — | Registry, match-stack, scaffolders |
| `practice` | — | Review, debug, TDD, security, performance, … |
| `architecture` | `spec` | CA/DDD decompose + slices |
| `backlog` | `spec` | Backlog.md status sync |
| `git-lifecycle` | `spec` | Branch/commit/PR offers |
| `trevor` | — | Concierge, reminders, checklists |
| `caveman` | — | Terse commits / reviews |
| `authoring` | — | Create / distill / curate skills |

Docs: [Packs](https://renatoxm.github.io/leanagentkit/packs) ·
[Migration](https://renatoxm.github.io/leanagentkit/migration-1.0) ·
[Stacks](https://renatoxm.github.io/leanagentkit/stacks) ·
[Backlog](https://renatoxm.github.io/leanagentkit/backlog) ·
[Trevor](https://renatoxm.github.io/leanagentkit/trevor) ·
[Caveman](https://renatoxm.github.io/leanagentkit/caveman) ·
[Git lifecycle](https://renatoxm.github.io/leanagentkit/git-lifecycle) ·
[Architecture](https://renatoxm.github.io/leanagentkit/architecture-decomposition) ·
[Create skill](https://renatoxm.github.io/leanagentkit/create-skill).

### Substantial work (spec pack)

```
grill → new-spec → implement-spec → check → end-session
```

Optional: `decompose-spec` when **architecture** pack + config enabled.

## 8. Anti-patterns

- Requiring start/end session for every one-line fix.
- Forbidding all search because “the map exists.”
- Enabling every pack “just in case.”
- Letting ACTIVE_CONTEXT go stale for weeks.
- Treating optional integrations (Backlog, Trevor) as required.

## 9. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Agent ignores conventions | Fill AGENTS §4–5; run `check` |
| Cold start every time | `end-session` with a real resume note |
| Too many skills / noise | `--prune-to-core`, enable only needed packs |
| Stale map | `map-codebase` or narrow search + update map |
| 0.x clutter after upgrade | `migrate-1` / `--prune-to-core` |

## 10. Cheat sheet

```bash
# Install core
npx create-lean-agent-kit@latest .

# Packs
npx create-lean-agent-kit@latest . --enable-pack spec,stacks

# Upgrade / prune
npx create-lean-agent-kit@latest . --upgrade
npx create-lean-agent-kit@latest . --prune-to-core
```

```
Trivial:     just work
Normal:      start-session → work → check → end-session
Substantial: grill → new-spec → implement-spec → check → end-session
Handoff:     handoff → new chat → start-session
```
