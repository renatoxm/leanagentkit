# AGENTS.md

> Canonical instructions for any AI coding agent in this repo (Cursor, Claude,
> Copilot, ChatGPT, Aider, Cline…). Tool-specific files just point here.
> Run `.agent/skills/bootstrap.md` to fill this out. Last updated: <!-- YYYY-MM-DD -->

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
<!-- Evidence-based rules only. Filled by init-conventions + stack playbooks. -->

## 5. Never do
<!-- Secrets, generated dirs, footguns. -->

---

## 6. Memory protocol  ← READ EVERY SESSION
Memory lives in Markdown so you don't re-scan the repo.

**At task start, read ONLY:** `docs/memory/ACTIVE_CONTEXT.md`, then `docs/CODEBASE_MAP.md`.
Then use the map to open just the relevant files — do not glob the repo.
Read `docs/specs/<feature>.md` only for that feature; read `docs/adr/` only when making a decision.

**After meaningful changes, update:** `ACTIVE_CONTEXT.md` (+ a "resume from here" note),
`PROGRESS.md` (append), `CODEBASE_MAP.md` (if structure changed), `docs/adr/` (if a decision was made).

| Tier | Files | Lifespan |
|------|-------|----------|
| Long | `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/adr/*` | months |
| Medium | `docs/specs/*`, `docs/memory/ACTIVE_CONTEXT.md`, `docs/memory/PROGRESS.md` | days–weeks |
| Short | `docs/memory/SCRATCH.md` | this task |

## 7. Stack skills
<!-- Auto-populated by match-stack: which external skills/MCPs to defer to and when.
     Empty until bootstrap runs. -->

## 8. Setup / refresh
Run `.agent/skills/bootstrap.md` to (re)generate memory and stack wiring.
