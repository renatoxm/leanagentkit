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

Note: package manager preference if stated; detected frameworks; gate state (empty,
kit-only, or occupied).

### 2. Gate — empty vs kit-only vs occupied

Classify the repo **before** offering base scaffolds:

| State | Detect | Base scaffolds |
|-------|--------|----------------|
| **Empty** | No kit markers, no app manifest, no meaningful `src/`/`app/`/`manage.py`/`go.mod` | Offer base + additive |
| **Kit-only** | Kit markers present (`.agent/` + `AGENTS.md` or `docs/`), but **no app manifest** and no app code tree | Offer base + additive (see kit-only rules below) |
| **Occupied** | Existing app detected (`package.json` with app deps, `src/`/`app/` with code, etc.) | **Additive-only** |

**Kit markers:** `.agent/`, `AGENTS.md`, `docs/`, `README.md`, `LEAN_AGENT_KIT.md`,
`LEAN_AGENT_KIT_GUIDE.md`, `.leanagentkit/`, `.vscode/` (when kit-owned), `.git/`.

**App markers:** root `package.json` / `pyproject.toml` / `go.mod` with project
code; `src/`, `app/`, `pages/`, `manage.py`, etc.

**Kit-only rules** (common after `npm create lean-agent-kit .`):

- The root is **not empty** even though there is no app yet. Most `create-*` CLIs
  block on a non-empty `dir=.` — either an interactive prompt (Hono, Astro, Vite)
  or a hard exit (Next.js, Turborepo, Cloudflare C3).
- **`Kind: template` recipes** (Express, FastAPI, Go, Python, …) write files in
  place and are safe for kit-only + root scaffold (no `dir` question).
- **`Kind: cli` recipes** with `dir=.` when gate is kit-only: do **not** run the
  CLI unless the recipe documents a bypass flag (currently SvelteKit
  `--no-dir-check` only). Otherwise recommend a **named subdirectory**,
  **app-first** (scaffold in an empty folder, then drop the kit), or **TTY
  manual run** at `.`.
- **Exception — SvelteKit:** when gate is kit-only and the user chooses
  `dir=.`, compile `--no-dir-check` per `sveltekit.scaffold.md`. Skips the
  empty-dir prompt without deleting kit files; may still add/overwrite app files
  (`package.json`, `README.md`, etc.) alongside kit paths — see recipe notes.
- **Never** pass Vite `--overwrite` on kit-only roots (destroys kit files).
- If the user insists on `dir=.` for other CLI recipes, **abort the agent run**
  and output the compiled command for them to run in a **TTY terminal**.
- Record gate state as `kit-only` in `docs/memory/SCRATCH.md` under "Scaffold
  choices".

**Occupied repo:** suppress base frameworks that would conflict with the current
stack (e.g. do not offer `create-next-app` on an existing Django project). Still
offer ORM, UI, platform, and compatible add-ons.

Record the gate result (`empty`, `kit-only`, or `occupied`) in
`docs/memory/SCRATCH.md` under "Scaffold choices".

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
   `## Questions` table **in row order**. Before asking each row, evaluate its
   **`when` column** against answers already collected; **skip the question**
   when the condition is false (do not ask and do not apply defaults for skipped
   rows). Examples:
   - `prettier` with `when: only if eslint=yes` → skip when `eslint=no`
   - `eslint` with `when: only if lang=TypeScript` → skip when `lang=JavaScript`
   - `vscode` with `when: only if ruff=yes` → skip when `ruff=no`
   Skip questions already answered by memory (e.g. if `AGENTS.md` §2 already
   says pnpm, default package manager to pnpm). **Never inject recipe tooling
   questions globally** — only ask ids that appear in the recipe's
   `## Questions` table. **Exception:** skill-level `commit_helpers` (Step 4.6).
4. **Target directory / name** — ask only when the recipe needs it (greenfield
   base apps usually need a project name or `.` for current dir). When gate is
   **kit-only** and the recipe is **`Kind: cli`**:
   - **Default:** a **subdirectory** (per recipe default column) for most stacks.
   - **SvelteKit only:** also offer **in-place at `.`** with `--no-dir-check` as
     a co-equal recommended option (kit-first friendly).
   - **Other CLI stacks:** offer “run compiled CLI yourself in TTY at `.`” instead
     of silently picking `.`.
   - **Django:** default **subdirectory** layout when kit-only (see
     `django.scaffold.md`).
5. **Chain prompts** — if the recipe lists `Chains-to`, offer to run follow-on
   scaffolders after the base (e.g. base framework → ORM → Tailwind). Respect
   `Depends-on`: refuse or prompt to run prerequisites first.
6. **Commit helpers (skill-level, Node only)** — after Step 4.4 (target dir) is
   resolved, evaluate eligibility **before** compile/generate:
   - **Eligible** when the recipe produces or updates a Node `package.json` at
     `{{dir}}` (frameworks, Node backends, monorepos, etc.).
   - **Skip** for Python/Go-only recipes (Django, FastAPI with uv/pip, Go) that
     do not scaffold a Node manifest.
   - **Skip the question** (note “commit helpers already configured”) when any
     of: `{{dir}}/commitlint.config.*`, `{{dir}}/.husky/commit-msg`, or
     `{{dir}}/package.json` already has both `scripts.commit` and
     `config.commitizen.path`.
   - **Additive scaffolds** (ORM, UI): ask only when `{{dir}}/package.json`
     exists or will be created by this run.
   - Ask: **“Add commit helpers (Conventional Commits, commitizen, husky, release
     versioning)?”** — options **yes · no**, default **yes**.
   - Record `commit_helpers` in `docs/memory/SCRATCH.md` under “Scaffold choices”.

**Package manager for commit helpers (`{{pm}}`):**

1. Use the recipe questionnaire `pm` answer when present (pnpm · npm · bun).
2. Else read `AGENTS.md` §2 if it states a Node package manager.
3. Else default **`npm`**.

Map install commands — substitute `{{pm_install_dev}}` in Step 5:

| `pm` | `{{pm_install_dev}}` |
|------|----------------------|
| `pnpm` | `pnpm add -D` |
| `npm` | `npm install -D` |
| `bun` | `bun add -D` |

#### Optional lint/format and VS Code (recipe-driven)

Tooling questions are **recipe-local**. Supported question ids:

| id | Stack | Meaning |
|----|-------|---------|
| `eslint` | JS/TS | ESLint config + lint script |
| `prettier` | JS/TS | Prettier config + format script |
| `ruff` | Python | Ruff lint + format in `pyproject.toml` |
| `golangci` | Go | golangci-lint config + lint script |
| `vscode` | any | Write `.vscode/settings.json` + `extensions.json` |
| `commit_helpers` | Node | Conventional Commits, commitizen, husky, release versioning |

**Rules:**

- Ask `vscode` **only** when the recipe defines a `## VS Code` section **and**
  the id `vscode` is in `## Questions`.
- Skip `vscode` if the generator already created `.vscode/` (e.g. SvelteKit
  `sv create --add eslint` writes `extensions.json`).
- Respect **when** notes on question rows — evaluated **before** asking (see
  Step 4.3). Skip `vscode` when no lint/format tool was selected.
- **VS Code snippet pick:** use `eslint-prettier` when `eslint=yes`; use
  `prettier-only` when `prettier=yes` without eslint; use `ruff` or `go`
  snippets for Python/Go stacks.
- **Additive scaffolds** (ORM, UI, platform adapters) do not offer lint/format —
  tooling belongs to the base app.
- **Precedence:** if a CLI flag already installs a tool (Next `--eslint`,
  Turborepo starter), do not duplicate. Run post-scaffold steps only for tools
  the generator did not cover (e.g. Prettier on Next.js).
- **`commit_helpers` is skill-level** — not in recipe `## Questions` tables.
  See Step 4.6. Run post-scaffold steps in Step 5 after recipe optional tools
  and VS Code.

### 5. Compile and generate

Open `.agent/scaffolders/<recipe>.scaffold.md`.

#### Preflight — kit-only in-place (`Kind: cli` and Django layout)

Run this check **before** any compiled `create-*` command or Django
`startproject … .` when the target is the repo root.

**Trigger** when **either**:

- Gate is **kit-only** and `{{dir}}` is `.` (or equivalent root path), **or**
- Django `layout=current directory` (compiles to `startproject {{name}} .`) and
  gate is **kit-only**.

**Skip preflight** when the compiled command includes a recipe-documented bypass
for kit-only in-place scaffold (currently SvelteKit `--no-dir-check` only).

**Otherwise abort** — do not run in the agent shell:

1. **Stop.** The CLI will block on an interactive prompt or exit with a conflict
   error (`create-hono`, Astro, Vite, Next.js, Turborepo, Cloudflare C3, Django
   `startproject .`, etc.).
2. Tell the user why (see recipe `## Flag compilation notes`).
3. Offer a recovery path:
   - **Re-run questionnaire** with a subdirectory (recommended), or
   - **User runs the compiled command in their own terminal** at `.` and answers
     the prompt, then asks the agent to continue from post-scaffold steps
     (including optional eslint/prettier/vscode and **commit helpers** when
     `commit_helpers=yes` in `SCRATCH.md`), or
   - **App-first workflow** — scaffold in an empty folder, then install the kit.

Record the compiled command in `SCRATCH.md` when aborting so the user can copy it.

> **Note:** Kit-only roots are non-empty for `create-*` even when every path is
> on the kit allowlist. Do **not** treat “only kit files remain” as safe to run
> without a bypass flag.

**`Kind: template`** recipes skip this preflight — they write files in place and
do not invoke `create-*`.

**`Kind: cli`**

- Substitute `{{dir}}`, `{{flags}}`, and other placeholders from answers.
- Build flags from the Questions table (`→ flag` column).
- Run the compiled command with `CI=true` (and `--yes` when the recipe specifies).
- Example shape: `CI=true npx create-next-app@latest {{dir}} {{flags}} --yes`
- **Post-scaffold:** after the CLI succeeds, run recipe steps under
  `## Optional — <tool>` (install-deps, create-file) for each opted-in tool.
  Then run `## VS Code` steps when `vscode=yes` and `.vscode/` was not already
  created by the generator. Copy from `.agent/scaffolders/snippets/vscode/`
  (kit root, not the generated app dir) when the recipe references a snippet.
  Then run **Optional — commit helpers** when `commit_helpers=yes` (Step 5).

**`Kind: template`**

- Execute each step under `## Files` in order (create-file, patch, install-deps).
- Substitute parameters from answers (`{{name}}`, `{{provider}}`, etc.).
- Run conditional steps (`if eslint=yes`, `if ruff=yes`, etc.) and `## VS Code`
  steps after core files when the user opted in.
- Then run **Optional — commit helpers** when `commit_helpers=yes` (Step 5).

**Dependency ordering:** if `Depends-on` lists other recipes, run those first (or
confirm they already exist in the repo).

#### Optional — commit helpers (if commit_helpers=yes)

Run **after** recipe `## Optional — <tool>` steps and `## VS Code` steps.

**1. Install devDependencies**

Resolve `{{pm_install_dev}}` from the table in Step 4.6, then:

```bash
cd {{dir}} && {{pm_install_dev}} @commitlint/cli @commitlint/config-conventional commit-and-tag-version commitizen cz-conventional-changelog husky
```

**2. Initialize husky**

From `{{dir}}` (requires `.git` for hooks to register; skip hook wiring when
no repo — still finish steps 3–5):

```bash
cd {{dir}} && npx husky init
```

Remove the sample `.husky/pre-commit` if created (kit only needs `commit-msg`).

**3. Patch `{{dir}}/package.json`**

Merge — do not clobber unrelated scripts:

```json
{
  "version": "0.1.0",
  "scripts": {
    "prepare": "husky",
    "commit": "cz",
    "release": "commit-and-tag-version"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

- **`version`:** set to `"0.1.0"` only if the field is missing; leave an existing
  version untouched.
- **`prepare`:** when absent, set to `"husky"`. When another `prepare` script
  exists, **chain**: `"<existing> && husky"` (ask before replacing if chaining
  is unsafe for that script).
- **`commit` / `release`:** add; do not overwrite unrelated script keys.

**4. Create config files**

Copy from `.agent/scaffolders/snippets/commit-helpers/` (kit root):

| Snippet | Target |
|---------|--------|
| `commitlint.config.cjs` | `{{dir}}/commitlint.config.cjs` |
| `commit-msg` | `{{dir}}/.husky/commit-msg` |

**5. Activate hooks**

Re-run install so `prepare` runs husky (creates/updates `.husky/_`):

```bash
cd {{dir}} && {{pm}} install
```

**Git edge cases:**

- **No `.git`** at repo root or `{{dir}}`: still install deps and config; note
  that hooks activate after `git init` and step 5 (`{{pm}} install`).
- **Nested app dir** (`web/`, etc.): run all steps from `{{dir}}` (where
  `package.json` lives). Hooks bind to that package's `prepare` on install.

### 6. Verify

Run through the recipe's `## Verify` checklist. If verification fails, report
what is missing; do not proceed to handoff until the tree matches expectations
or the user accepts partial success.

When lint/format or VS Code was opted in, also confirm:

- Lint/format config exists (`eslint.config.*`, `.prettierrc*`, `[tool.ruff]`,
  `.golangci.yml`, etc.) and the lint script runs (`npm run lint`, `ruff check`,
  `golangci-lint run`, etc.).
- `.vscode/settings.json` and `extensions.json` exist when `vscode=yes`.

When `commit_helpers=yes`, also confirm:

- [ ] `commitlint.config.cjs` exists at `{{dir}}`
- [ ] `.husky/commit-msg` exists and references commitlint
- [ ] `package.json` has `version`, `scripts.commit`, `scripts.release`,
  `scripts.prepare`, and `config.commitizen.path`
- [ ] Dev deps installed (lockfile updated when present)
- [ ] Optional smoke: `cd {{dir}} && npx cz --help` (non-interactive only)

### 7. Handoff (delegate — do not re-implement)

Do **not** manually duplicate `match-stack` logic. Instead:

1. Run `leanagentkit-match-stack` — detects the new stack, installs external
   skills (if user approves), applies `.agent/stacks/<name>.md` playbooks,
   updates `AGENTS.md` §2/§4/§7 and `docs/CODEBASE_MAP.md`.
   - **Nested app dir** (`web/`, `api/`, etc.): note the app root in
     `ACTIVE_CONTEXT.md` and map it in `CODEBASE_MAP.md` (e.g. “App lives in
     `web/`”). Run `match-stack` with awareness of that path; set `AGENTS.md` §3
     commands relative to the app directory. Offer to re-run
     `leanagentkit-map-codebase` if the map still describes only kit files.
   - **Chains-to** (Prisma, Tailwind, …): run from the **app root**
     (`cd {{dir}}` when `{{dir}}` is not `.`).
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

List which optional tooling was installed vs skipped (eslint, prettier, ruff,
golangci, vscode, commit_helpers).

## Rules

- **Registry parity:** every offered item must exist in both `scaffolders/registry.md`
  and `stacks/registry.md`.
- **Occupied-repo protection:** never run a conflicting base-framework generator
  on an occupied repo.
- **Kit-only + CLI:** when gate is **kit-only** and target is repo root (`.`),
  abort preflight unless the recipe documents a bypass flag (SvelteKit
  `--no-dir-check`). Otherwise user runs in TTY or picks a subdirectory. Never
  pass Vite `--overwrite` on kit-only roots.
- **Non-interactive-or-abort:** no bare `npx create-*` without full flags; never
  pipe keystrokes to unblock a prompt.
- **Idempotent handoff:** memory and skill wiring always go through
  `leanagentkit-match-stack`.
- If you cannot run shell commands, output the exact compiled command(s) and
  template file contents for the user to apply.

## Re-running

Safe to run multiple times for additive items (ORM after framework, Tailwind after
base). Base-framework recipes should refuse on occupied repos unless the user
explicitly confirms replacing the project (out of scope — warn instead).
