# AGENTS.md

> Canonical instructions for any AI coding agent in this repo (Cursor, Claude,
> Copilot, ChatGPT, Aider, Cline…). Tool-specific files just point here.
> Run `.agent/skills/leanagentkit-bootstrap.md` to fill this out. Last updated: <!-- YYYY-MM-DD -->

## 1. What this project is

<!-- One paragraph. -->

## 2. Stack & tooling

<!-- Languages, frameworks, runtime/infra, data, package manager. -->

## 3. Commands

| Action  | Command |
| ------- | ------- |
| Install | `<...>` |
| Dev     | `<...>` |
| Test    | `<...>` |
| Lint    | `<...>` |
| Build   | `<...>` |
| Deploy  | `<...>` |

## 4. Conventions

<!-- Evidence-based rules only. Filled by leanagentkit-init-conventions (+ stack playbooks if stacks pack installed). -->

## 5. Never do

<!-- Secrets, generated dirs, footguns. -->

---

## 6. Memory protocol ← READ EVERY SESSION

Memory lives in Markdown so sessions resume without rediscovering the project.
Default path is **ambient** for core focus/resume — update `ACTIVE_CONTEXT` as
side effects of work. `leanagentkit-start-session` is optional (pack-hook prime).
**Finalize** is defined below; it is not “refresh ACTIVE_CONTEXT only.”

**Map-first, not map-only.** At task start, read `docs/memory/ACTIVE_CONTEXT.md`,
then `docs/CODEBASE_MAP.md`, then skim Open entries in `docs/memory/LEARNINGS.md`.
Open the files they name. Use **narrow search/glob** when the map is insufficient,
stale, or correctness needs usages — do **not** re-orient by dumping the whole repo.

Read `docs/specs/<feature>.md` only when the **spec** pack is installed and that
feature is in play. Read `docs/adr/` only when making a decision (spec pack).

### Ambient touch points

| Trigger                                               | Update                                                |
| ----------------------------------------------------- | ----------------------------------------------------- |
| Focus shifts                                          | `ACTIVE_CONTEXT` — Current focus + Resume from here   |
| Meaningful edit set lands                             | `ACTIVE_CONTEXT` — Files in play (+ Resume if needed) |
| Structure change (add/move/remove module)             | `CODEBASE_MAP.md` only                                |
| Avoidable failure (hook, lint, test, user correction) | Append or bump `LEARNINGS.md`                         |
| Context window full mid-task                          | `leanagentkit-handoff` (explicit; not ambient-auto)   |
| User stopping ("done", ship, PR)                      | **Finalize** (see below)                              |

Do **not** rewrite `ACTIVE_CONTEXT` every turn — only on the triggers above.

### Finalize

**Finalize** means: leave durable memory correct for the next session.

1. If code changed: run `leanagentkit-check` (or note acknowledged exceptions).
2. Refresh `ACTIVE_CONTEXT` if ambient touches left it stale.
3. **If the `spec` pack is installed** (PROGRESS/SCRATCH exist) **or**
   `installedPacks` includes `backlog`, `git-lifecycle`, or `trevor`: run
   `leanagentkit-end-session` so PROGRESS/SCRATCH and pack hooks run.
4. **Core-only** (no those packs / no PROGRESS): refreshing `ACTIVE_CONTEXT` (+
   LEARNINGS if needed) is enough; `end-session` remains optional.

Skipping `end-session` on a core-only install is fine when ACTIVE_CONTEXT is
current. Skipping it when spec/backlog/git-lifecycle/trevor are installed **is
not** — pack hooks and PROGRESS will not run on ambient ACTIVE_CONTEXT alone.

Optional `leanagentkit-start-session` at task start when you want backlog/trevor
preamble hooks; ambient §6 reads are enough for core priming.

### Workflow sizes

| Size            | When                                       | Loop                                                             |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| **Trivial**     | Typo, rename, one-liner, pure Q&A          | Just do it. Update `ACTIVE_CONTEXT` only if focus shifts.        |
| **Normal**      | Typical coding session                     | Work with ambient touches → `check` (if code changed) → finalize |
| **Substantial** | New/fuzzy feature (requires **spec** pack) | `grill` → `new-spec` → `implement-spec` → `check` → finalize     |

### Bookkeeping budget

After meaningful **normal/substantial** work: run `leanagentkit-check` on changed
files; keep `ACTIVE_CONTEXT` Resume concrete via ambient touches. Update
`CODEBASE_MAP.md` only if structure changed. Update `PROGRESS.md` / ADRs only if
those files exist (spec pack) and something material changed — via **finalize** /
`end-session`, not ambient alone.

When context fills mid-task, run `leanagentkit-handoff` before a fresh chat.

| Tier   | Files                                                               | Lifespan   |
| ------ | ------------------------------------------------------------------- | ---------- |
| Long   | `AGENTS.md`, `docs/CODEBASE_MAP.md` (+ `docs/adr/*` if spec pack)   | months     |
| Medium | `ACTIVE_CONTEXT.md`, `LEARNINGS.md` (+ specs/PROGRESS if spec pack) | days–weeks |
| Short  | `docs/memory/SCRATCH.md` (spec pack)                                | this task  |

### Self-improvement (`LEARNINGS.md`)

On avoidable failures: append or bump an Open bullet in `docs/memory/LEARNINGS.md`
(see that file for schema and capture rules). Still capture when the rule is
already in `AGENTS.md` but was violated again (salience). Cap Open at ~20; merge
duplicates by `Seen:`. When `Seen:` ≥ 3, **offer** to add or strengthen a one-liner
in `AGENTS.md` §4 or §5 — only after user confirms. Do not put secrets in
LEARNINGS. Project learnings ≠ skill `## Learned notes` (authoring pack /
generated skills).

### Packs

Optional packs are **not** in a core install. See `.agent/.leanagentkit-version`
→ `installedPacks`. Enable with:

```bash
npx create-lean-agent-kit@latest . --enable-pack <pack>
```

Or: read `.agent/skills/leanagentkit-enable-pack.md`. Catalog: `LEAN_AGENT_KIT_GUIDE.md`
and the [docs packs page](https://renatoxm.github.io/leanagentkit/packs).

### Asking the user

Prefer the host agent's interactive multiple-choice UI when available. Provide a
recommended option. Fall back to inline questions otherwise.

### Host enhancements (optional)

Some skills include optional **Host enhancements**. Portable procedure always
applies when the host cannot use a faster path. Ask consent before switching
modes. On Cursor, `SwitchMode` currently supports only `plan`; suggest Ask/Debug
manually when useful. Persist state (`ACTIVE_CONTEXT`, and a handoff when context
is heavy) before switching modes.

For substantial specs on Cursor with Plan available, `leanagentkit-implement-spec`
prefers **Plan + Build** (hand off; do not double-implement in chat). Non-Cursor
hosts, or Cursor without Plan mode, bypass to portable implement — see that skill
§2.

## 7. Installed packs & stack skills

<!-- Populated by bootstrap / enable-pack / match-stack (stacks pack).
     Empty until packs are installed.
     `.agent/` (singular) = kit files. `.agents/skills/` (plural) = external skills. -->

## 8. Setup / refresh

- First setup: `.agent/skills/leanagentkit-bootstrap.md`
- Add packs: `.agent/skills/leanagentkit-enable-pack.md` or CLI `--enable-pack`
- Migrate from 0.x: `.agent/skills/leanagentkit-migrate-1.md`
- Upgrade kit files: `npx create-lean-agent-kit@latest . --upgrade`
- Prune packs: `npx create-lean-agent-kit@latest . --prune-to-core`
