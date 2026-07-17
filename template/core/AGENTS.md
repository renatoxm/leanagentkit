# AGENTS.md

> Canonical instructions for any AI coding agent in this repo (Cursor, Claude,
> Copilot, ChatGPT, Aider, Cline…). Tool-specific files just point here.
> Run `.agent/skills/leanagentkit-bootstrap.md` to fill this out. Last updated: <!-- YYYY-MM-DD -->

## 1. What this project is
<!-- One paragraph. -->

## 2. Stack & tooling
<!-- Languages, frameworks, runtime/infra, data, package manager. -->

## 3. Commands
| Action | Command |
|--------|---------|
| Install | `<...>` |
| Dev | `<...>` |
| Test | `<...>` |
| Lint | `<...>` |
| Build | `<...>` |
| Deploy | `<...>` |

## 4. Conventions
<!-- Evidence-based rules only. Filled by leanagentkit-init-conventions (+ stack playbooks if stacks pack installed). -->

## 5. Never do
<!-- Secrets, generated dirs, footguns. -->

---

## 6. Memory protocol  ← READ EVERY SESSION

Memory lives in Markdown so sessions resume without rediscovering the project.

**Map-first, not map-only.** At task start, read `docs/memory/ACTIVE_CONTEXT.md`, then
`docs/CODEBASE_MAP.md`. Open the files they name. Use **narrow search/glob** when the
map is insufficient, stale, or correctness needs usages — do **not** re-orient by
dumping the whole repo.

Read `docs/specs/<feature>.md` only when the **spec** pack is installed and that
feature is in play. Read `docs/adr/` only when making a decision (spec pack).

### Workflow sizes

| Size | When | Loop |
|------|------|------|
| **Trivial** | Typo, rename, one-liner, pure Q&A | Just do it. Update `ACTIVE_CONTEXT` only if focus shifts. No start/end ceremony. |
| **Normal** | Typical coding session | `start-session` → work → `check` (if code changed) → `end-session` |
| **Substantial** | New/fuzzy feature (requires **spec** pack) | `grill` → `new-spec` → `implement-spec` → `check` → `end-session` |

### Bookkeeping budget

After meaningful **normal/substantial** work: run `leanagentkit-check` on changed
files, then update `ACTIVE_CONTEXT.md` (with a concrete "Resume from here"). Update
`CODEBASE_MAP.md` only if structure changed. Update `PROGRESS.md` / ADRs only if
those files exist (spec pack) and something material changed.

When context fills mid-task, run `leanagentkit-handoff` before a fresh chat.
At a natural stop, `end-session` is enough.

| Tier | Files | Lifespan |
|------|-------|----------|
| Long | `AGENTS.md`, `docs/CODEBASE_MAP.md` (+ `docs/adr/*` if spec pack) | months |
| Medium | `docs/memory/ACTIVE_CONTEXT.md` (+ specs/PROGRESS if spec pack) | days–weeks |
| Short | `docs/memory/SCRATCH.md` (spec pack) | this task |

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
applies; mode switches are never required. Ask consent before switching. On Cursor,
`SwitchMode` currently supports only `plan`; suggest Ask/Debug manually when useful.
Persist state before switching modes.

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
