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
<!-- Evidence-based rules only. Filled by leanagentkit-init-conventions + stack playbooks. -->

## 5. Never do
<!-- Secrets, generated dirs, footguns. -->

---

## 6. Memory protocol  ← READ EVERY SESSION
Memory lives in Markdown so you don't re-scan the repo.

**At task start, read ONLY:** `docs/memory/ACTIVE_CONTEXT.md`, then `docs/CODEBASE_MAP.md`.
Then use the map to open just the relevant files — do not glob the repo.
Read `docs/specs/<feature>.md` only for that feature; read `docs/adr/` only when making a decision.

**After meaningful changes:** run `leanagentkit-check` on changed files, then update
`ACTIVE_CONTEXT.md` (+ a "resume from here" note), `PROGRESS.md` (append),
`CODEBASE_MAP.md` (if structure changed), `docs/adr/` (if a decision was made).

**Daily loop:** `leanagentkit-start-session` → (`leanagentkit-grill` → `leanagentkit-new-spec` → `leanagentkit-implement-spec` for new work) → `leanagentkit-check` → `leanagentkit-end-session`

When the context window fills mid-task, run `leanagentkit-handoff` before starting a fresh chat — do not rely on `end-session` alone. At a natural stopping point, `end-session` is enough; the next `start-session` reads `ACTIVE_CONTEXT` (and `HANDOFF.md` when present).

| Tier | Files | Lifespan |
|------|-------|----------|
| Long | `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/adr/*` | months |
| Medium | `docs/specs/*`, `docs/memory/ACTIVE_CONTEXT.md`, `docs/memory/PROGRESS.md` | days–weeks |
| Short | `docs/memory/SCRATCH.md` | this task |

### Asking the user
When you need input from the user, prefer the host agent's interactive
multiple-choice / questionnaire UI (e.g. Cursor, Claude) over plain inline text.
Provide a recommended option. Fall back to inline questions only when the host
has no interactive prompt support. Skills may still require one question at a
time or a batched set — follow that cadence, but use the interactive UI for each
prompt when available.

### Host enhancements (optional)

Some kit skills include an optional **Host enhancements** section for Cursor and
similar hosts. Rules:

- The portable procedure in the skill always applies; mode switches are never required.
- Offer a host mode only when it clearly helps (e.g. Ask for read-only alignment,
  Debug for runtime investigation, Plan for spec implementation).
- Ask for user consent before switching. Use the host's interactive UI when available.
- On Cursor, `SwitchMode` currently supports only `plan`; suggest Ask or Debug
  manually (Shift+Tab or the mode picker) when those modes fit.
- Switching modes starts a fresh context — persist state in `ACTIVE_CONTEXT.md`,
  specs, or `leanagentkit-handoff` before switching.

## 7. Stack skills
<!-- Auto-populated by leanagentkit-match-stack: which external skills/MCPs to defer to and when.
     Empty until bootstrap runs.
     `.agent/` (singular) = kit files. `.agents/skills/` (plural) = external skills from `npx skills add`. -->

### Practice skills (guardrails)
<!-- Auto-populated by leanagentkit-match-stack for conditional skills (CI/CD, observability).
     Always-on guardrails (review, debug, security, etc.) ship with the kit — see .agent/skills/README.md -->

## 8. Setup / refresh
Run `.agent/skills/leanagentkit-bootstrap.md` to (re)generate memory and stack wiring.
