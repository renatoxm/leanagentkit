---
name: leanagentkit-scaffold
description: Greenfield and additive project scaffolding — memory-aware questionnaire, non-interactive generators, handoff to match-stack.
---

# Skill: leanagentkit-scaffold

**Goal:** Scaffold a new app or add a stack component (framework, ORM, UI, platform)
using only registry-backed generators. Reads kit memory first, asks the user what
to create, compiles every choice into a **non-interactive** command or template
writes, verifies the result, then delegates skill/memory wiring to
`leanagentkit-match-stack`.

**Reads:** `docs/memory/ACTIVE_CONTEXT.md`, `docs/CODEBASE_MAP.md`, `AGENTS.md` §2,
`.agent/scaffolders/registry.md`, `.agent/scaffolders/<name>.scaffold.md`
**Writes:** generated project files (via CLI or template steps); does **not**
duplicate `match-stack` memory updates — hand off there.

**When to use**

- Empty or near-empty repo → create a base framework app.
- Existing repo → add ORM, UI layer, platform adapter, or other additive stack.
- Before `leanagentkit-bootstrap` on a greenfield project (bootstrap may offer this).

**Not for:** Brownfield memory setup — use `leanagentkit-bootstrap`. In-repo artifact
generators (pages, CRUD) — use `leanagentkit-skill-artifact-template`.

## Principle: non-interactive-or-abort

Scaffolder CLIs block on interactive prompts when stdin is not a TTY. **Never**
feed keystrokes to a live menu. Every question must resolve to a CLI flag or a
template write **before** running the command. If a recipe cannot fully resolve
prompts, stop and report a missing flag — do not run a bare generator.

Set `CI=true` (and recipe-specific `--yes` flags) on all CLI commands.

## Procedure

### 1. Prime cheaply

Read **only** (no repo glob):

1. `docs/memory/ACTIVE_CONTEXT.md`
2. `docs/CODEBASE_MAP.md`
3. `AGENTS.md` §2 (Stack & tooling)

Note: package manager preference if stated; detected frameworks; whether the repo
looks empty vs occupied.

### 2. Gate — greenfield vs occupied

**Empty repo** (no app manifest, no `src/`/`app/`/`manage.py`/`go.mod` with code):
offer **base** categories (framework, backend, monorepo) **and** additive ones.

**Occupied repo** (existing app detected): **additive-only**. Suppress base
frameworks that would conflict with the current stack (e.g. do not offer
`create-next-app` on an existing Django project). Still offer ORM, UI, platform,
and compatible add-ons.

Record the gate result in `docs/memory/SCRATCH.md` under "Scaffold choices".

### 3. Load the allowlist

Open `.agent/scaffolders/registry.md`. Offer **only** rows that:

- have a matching `.agent/scaffolders/<recipe>.scaffold.md` file, **and**
- have a valid **Stacks row** in `.agent/stacks/registry.md` (parity check).

If a registry row lacks a recipe (or vice versa), omit it and note the gap.

### 4. Interactive questionnaire (one question at a time)

Use the host's interactive multiple-choice UI when available (see `AGENTS.md` §6).
Give a **recommended** default on each question. Wait for the answer before
continuing (same cadence as `leanagentkit-grill`).

1. **Category** — list only categories that have at least one eligible item after
   the Step 2 gate (framework · backend · orm · ui · platform · monorepo).
2. **Item** — list eligible items in that category from the registry.
3. **Per-item + modifier questions** — read them from the chosen recipe's
   `## Questions` table. Skip questions already answered by memory (e.g. if
   `AGENTS.md` §2 already says pnpm, default package manager to pnpm).
4. **Target directory / name** — ask only when the recipe needs it (greenfield
   base apps usually need a project name or `.` for current dir).
5. **Chain prompts** — if the recipe lists `Chains-to`, offer to run follow-on
   scaffolders after the base (e.g. base framework → ORM → Tailwind). Respect
   `Depends-on`: refuse or prompt to run prerequisites first.

### 5. Compile and generate

Open `.agent/scaffolders/<recipe>.scaffold.md`.

**`Kind: cli`**

- Substitute `{{dir}}`, `{{flags}}`, and other placeholders from answers.
- Build flags from the Questions table (`→ flag` column).
- Run the compiled command with `CI=true` (and `--yes` when the recipe specifies).
- Example shape: `CI=true npx create-next-app@latest {{dir}} {{flags}} --yes`

**`Kind: template`**

- Execute each step under `## Files` in order (create-file, patch, install-deps).
- Substitute parameters from answers (`{{name}}`, `{{provider}}`, etc.).

**Dependency ordering:** if `Depends-on` lists other recipes, run those first (or
confirm they already exist in the repo).

### 6. Verify

Run through the recipe's `## Verify` checklist. If verification fails, report
what is missing; do not proceed to handoff until the tree matches expectations
or the user accepts partial success.

### 7. Handoff (delegate — do not re-implement)

Do **not** manually duplicate `match-stack` logic. Instead:

1. Run `leanagentkit-match-stack` — detects the new stack, installs external
   skills (if user approves), applies `.agent/stacks/<name>.md` playbooks,
   updates `AGENTS.md` §2/§4/§7 and `docs/CODEBASE_MAP.md`.
2. If this was a greenfield base app and memory tiers are not set up yet, offer
   `leanagentkit-bootstrap` (or at minimum `leanagentkit-map-codebase` +
   `leanagentkit-init-conventions`).
3. Update `docs/memory/ACTIVE_CONTEXT.md` with what was scaffolded and the next
   step (e.g. "run install, then start-session").
4. Clear scaffold notes from `SCRATCH.md` when done.

### 8. Report

Print: category + item scaffolded, compiled command(s) or files written, verify
status, `match-stack` results, any `Chains-to` still pending, and suggested next
step (`bootstrap`, `install`, `start-session`).

## Rules

- **Registry parity:** every offered item must exist in both `scaffolders/registry.md`
  and `stacks/registry.md`.
- **Occupied-repo protection:** never run a conflicting base-framework generator
  on an occupied repo.
- **Non-interactive-or-abort:** no bare `npx create-*` without full flags.
- **Idempotent handoff:** memory and skill wiring always go through
  `leanagentkit-match-stack`.
- If you cannot run shell commands, output the exact compiled command(s) and
  template file contents for the user to apply.

## Re-running

Safe to run multiple times for additive items (ORM after framework, Tailwind after
base). Base-framework recipes should refuse on occupied repos unless the user
explicitly confirms replacing the project (out of scope — warn instead).
