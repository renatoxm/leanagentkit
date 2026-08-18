# Lean Agent Kit Guide

Canonical playbook for the **1.0 lean core** and optional packs. Ship this file
with every install as `LEAN_AGENT_KIT_GUIDE.md`.

## 1. Mental model

Lean Agent Kit is **context economics**:

1. **Lean context** — sessions start from `ACTIVE_CONTEXT` + `CODEBASE_MAP` +
   recent `LEARNINGS`, then open named files. Narrow search is allowed when the
   map is wrong or incomplete.
2. **Lean footprint** — default install is core only. Packs are opt-in overlays.
3. **Ambient memory** — refresh focus/resume as side effects of work; capture
   avoidable failures into `LEARNINGS.md`. Session skills are optional wrappers.

It is not a replacement for your editor agent’s tools. It is a small set of
trustworthy files so work resumes accurately.

<!-- @docs-hero-image /assets/images/TrevorHelp.png -->

## 2. Core files

| Path                              | Purpose                                           |
| --------------------------------- | ------------------------------------------------- |
| `AGENTS.md`                       | Project identity, commands, conventions, protocol |
| `docs/CODEBASE_MAP.md`            | Where things live                                 |
| `docs/memory/ACTIVE_CONTEXT.md`   | What we’re doing now                              |
| `docs/memory/LEARNINGS.md`        | Avoidable-mistake inbox → promote to AGENTS.md    |
| `.agent/skills/leanagentkit-*.md` | Portable procedures                               |
| `.agent/.leanagentkit-version`    | Version + `installedPacks`                        |

## 3. Map-first protocol

1. Read `ACTIVE_CONTEXT.md`, then `CODEBASE_MAP.md`, then skim Open `LEARNINGS.md`.
2. Open files they name.
3. If needed, **search narrowly** (symbol, path prefix, tests for one module).
4. Do **not** re-scan the whole repository to “get oriented.”

## 4. Ambient memory

Default path is **ambient** for core focus/resume. Update memory on triggers
(see `AGENTS.md` §6):

| Trigger               | Update                                                                     |
| --------------------- | -------------------------------------------------------------------------- |
| Focus shifts          | `ACTIVE_CONTEXT` focus + Resume                                            |
| Meaningful edits      | Files in play (+ Resume)                                                   |
| Structure change      | `CODEBASE_MAP`                                                             |
| Avoidable failure     | Append/bump `LEARNINGS`                                                    |
| Context full mid-task | Explicit `handoff`                                                         |
| User stopping         | **Finalize** (§6): core-only may skip `end-session`; packs/spec require it |

`leanagentkit-start-session` is optional (backlog/trevor preamble).
`leanagentkit-end-session` **is** finalize when `spec` / `backlog` /
`git-lifecycle` / `trevor` are installed — ambient ACTIVE_CONTEXT alone does not
run PROGRESS or pack hooks.

## 5. Workflow sizes

| Size        | Use when           | Loop                                                                                 |
| ----------- | ------------------ | ------------------------------------------------------------------------------------ |
| Trivial     | Tiny fix, question | Work only; update ACTIVE_CONTEXT if focus changes                                    |
| Normal      | Day-to-day coding  | Work with ambient touches → `check` → finalize                                       |
| Substantial | Fuzzy/new feature  | Requires **spec** pack: `grill` → `new-spec` → `implement-spec` → `check` → finalize |

Mid-task context full → `handoff` → new chat → ambient §6 start (optional `start-session`).

## 6. Bookkeeping budget

- Keep `ACTIVE_CONTEXT` Resume concrete via ambient touches (not only at goodbye).
- Map: only if structure changed.
- LEARNINGS: on avoidable failures (including when AGENTS.md already had the rule).
- PROGRESS / SCRATCH / ADRs / specs: via **finalize** / `end-session` when the
  **spec** pack is installed.
- Do not turn every typo fix into a session ritual.
- Core-only: skipping `end-session` is OK if ACTIVE_CONTEXT is current. With
  packs above, run `end-session` at stop.

## 7. Self-improvement (`LEARNINGS.md`)

Append-only inbox of mistakes that should not repeat. Skim Open at task start.

**Capture** when: something failed/redone; one-line **Avoid**; likely to recur.
Still capture when the same Avoid is already in `AGENTS.md` but was violated
again (salience).

**Promote** when `Seen:` ≥ 3 — offer to add or **strengthen** a one-liner in
`AGENTS.md` §4 or §5 **only after user confirms**. Cap Open at ~20; merge
duplicates by bumping `Seen:`.

Example: commitlint rejects a long subject → shorten → append `commits` learning
→ next commit reads it → after repeats, harden §4 Commits / §5 Never do.

Skill `## Learned notes` (authoring pack / generated skills) are for **skill**
gotchas. Project-wide scars live in `LEARNINGS.md`.

## 8. Core skills

| Skill                           | When                                             |
| ------------------------------- | ------------------------------------------------ |
| `leanagentkit-bootstrap`        | First setup                                      |
| `leanagentkit-map-codebase`     | Build/refresh map                                |
| `leanagentkit-init-conventions` | Fill AGENTS §1–5 (merge + backup if file exists) |
| `leanagentkit-wire-agent`       | Cursor / Claude wrappers                         |
| `leanagentkit-start-session`    | Optional prime + pack hooks                      |
| `leanagentkit-end-session`      | Finalize (+ required with packs/PROGRESS)        |
| `leanagentkit-handoff`          | Context full mid-task (explicit)                 |
| `leanagentkit-check`            | Convention check + LEARNINGS capture             |
| `leanagentkit-enable-pack`      | Add packs                                        |
| `leanagentkit-migrate-1`        | 0.x → 1.0                                        |

Invoke: `Read .agent/skills/leanagentkit-<name>.md and follow it.`

## 9. Packs

Install:

```bash
npx create-lean-agent-kit@latest . --with spec,stacks          # first scaffold
npx create-lean-agent-kit@latest . --enable-pack practice      # existing install
npx create-lean-agent-kit@latest . --prune-to-core             # drop pack overlays
npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec
```

| Pack            | Depends | Summary                                                |
| --------------- | ------- | ------------------------------------------------------ |
| `spec`          | —       | Grill, specs, implement, spike, ADRs, PROGRESS/SCRATCH |
| `stacks`        | —       | Registry, match-stack, scaffolders                     |
| `practice`      | —       | Review, debug, TDD, security, performance, …           |
| `architecture`  | `spec`  | CA/DDD decompose + slices                              |
| `backlog`       | `spec`  | Backlog.md status sync                                 |
| `git-lifecycle` | `spec`  | Branch/commit/PR offers                                |
| `trevor`        | —       | Concierge, reminders, checklists                       |
| `caveman`       | —       | Terse commits / reviews                                |
| `authoring`     | —       | Create / distill / curate skills                       |
| `imaginary`     | —       | Resize / crop / convert via h2non/imaginary            |

Docs: [Packs](https://renatoxm.github.io/leanagentkit/packs) ·
[Migration](https://renatoxm.github.io/leanagentkit/migration-1.0) ·
[Stacks](https://renatoxm.github.io/leanagentkit/stacks) ·
[Backlog](https://renatoxm.github.io/leanagentkit/backlog) ·
[Trevor](https://renatoxm.github.io/leanagentkit/trevor) ·
[Caveman](https://renatoxm.github.io/leanagentkit/caveman) ·
[Git lifecycle](https://renatoxm.github.io/leanagentkit/git-lifecycle) ·
[Architecture](https://renatoxm.github.io/leanagentkit/architecture-decomposition) ·
[Create skill](https://renatoxm.github.io/leanagentkit/create-skill) ·
[Imaginary](https://renatoxm.github.io/leanagentkit/imaginary).

### Substantial work (spec pack)

```
grill → new-spec → implement-spec → check → finalize
```

Optional: `decompose-spec` when **architecture** pack + config enabled.

**Spec vs plan:** The feature **spec** (`docs/specs/NNN-*.md`) owns intent —
Problem, Goal, Scope, acceptance criteria, and locked decisions. A portable
**implementation plan** lives in the same file (Implementation order, Test plan,
Done when) or an optional companion `NNN-*-plan.md`.

**Cursor Plan + Build:** On Cursor, when Plan mode is available,
`implement-spec` hands "Plan then build" to Cursor Plan mode and **Build** (the
IDE orchestrator — often multi-agent). It does **not** also run a sequential
LAK implement loop in the same chat. If the host is not Cursor, or Plan mode is
unavailable, or the user declines Plan, `implement-spec` **bypasses** to the
portable implement path. Non-trivial specs should still fill Implementation
order before coding on any host.

## 10. Anti-patterns

- Requiring start/end session for every one-line fix.
- Skipping `end-session` when packs need PROGRESS / backlog / git / trevor hooks.
- Forbidding all search because “the map exists.”
- Enabling every pack “just in case.”
- Letting ACTIVE_CONTEXT go stale for weeks.
- Ignoring repeated hook/lint failures without a LEARNINGS note.
- Treating optional integrations (Backlog, Trevor) as required.

## 11. Troubleshooting

| Symptom                   | Fix                                              |
| ------------------------- | ------------------------------------------------ |
| Agent ignores conventions | Fill AGENTS §4–5; run `check`; promote LEARNINGS |
| Cold start every time     | Ambient Resume note (or finalize) with real next |
| Repeat commitlint fails   | Append `commits` learning; promote after 3×      |
| Too many skills / noise   | `--prune-to-core`, enable only needed packs      |
| Stale map                 | `map-codebase` or narrow search + update map     |
| 0.x clutter after upgrade | `migrate-1` / `--prune-to-core`                  |

## 12. Cheat sheet

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
Normal:      ambient work → check → finalize
Substantial: grill → new-spec → implement-spec → check → finalize
Handoff:     handoff → new chat → ambient §6 start
Learning:    fail → LEARNINGS append/bump → retry → promote at Seen ≥ 3
```
