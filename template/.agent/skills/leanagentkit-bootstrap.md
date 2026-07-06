---
name: leanagentkit-bootstrap
description: One-shot interactive Lean Agent Kit setup — map codebase, detect stack, wire skills. Run this first.
---

# Skill: leanagentkit-bootstrap

**Goal:** One-shot, interactive setup. Drives the whole kit: asks a few questions,
maps the codebase, detects the stack, and wires up matching external skills —
keeping the footprint minimal (no content added that the project doesn't use).

**Run this first.** It calls the other skills in order.

## Principle: lean by default
Only create/keep files the project actually needs. If a tier or stack doesn't
apply, say so and skip it — don't scaffold dead files.

## Step 0 — Interactive questionnaire (ASK, don't assume)
Ask these as a short interactive set. If the host agent supports interactive
multiple-choice prompts (e.g. Cursor, Claude), use them; otherwise ask inline and
wait. Keep to one screen. Skip any question already answered by the repo.

**Greenfield offer:** If the repo has no app yet — **empty** (no kit) or
**kit-only** (kit installed via `npm create lean-agent-kit .` but no app manifest
or code tree) — ask before mapping:

> Scaffold a base app first? (framework, backend, monorepo — via `leanagentkit-scaffold`)

- **Yes** → run `leanagentkit-scaffold` (it detects kit-only and applies preflight
  / subdirectory defaults), then continue bootstrap from Step 1.
- **No / already scaffolded** → continue below.

1. **Memory tiers** — which to enable?
   - [x] Long (map + conventions + ADRs)  ← recommended always on
   - [ ] Medium (specs + active context + progress)
   - [ ] Short (scratchpad)
   *(Default: all three. Let the user turn off medium/short for tiny projects.)*
2. **Agent targets** — which tools will use this? (multi-select)
   - Cursor · Claude Code · Copilot · ChatGPT · Aider · Cline · Other
   *(Determines which thin pointer files to generate in Step 4.)*
3. **External stack skills** — auto-install matched ones?
   - Yes, install · Just list commands, I'll run them · Skip
4. **Detail level for the codebase map**
   - Minimal (dirs + entry points) · Standard (+ key modules table) · Deep (+ integrations & cross-cutting)

Record answers into `docs/memory/SCRATCH.md` under "Bootstrap choices" so later
steps and re-runs can read them.

## Step 1 — Map the codebase
Run `leanagentkit-map-codebase` at the chosen detail level → `docs/CODEBASE_MAP.md`.

## Step 2 — Fill conventions
Run `leanagentkit-init-conventions` → `AGENTS.md` sections 1–5.

## Step 3 — Detect & match the stack
Run `leanagentkit-match-stack`. It reads `.agent/stacks/registry.md`, detects technologies,
presents matches for confirmation, installs the ones approved in Step 0, and
appends each stack's AGENTS.md snippet + applies its playbook to CODEBASE_MAP.
It also detects conditional **practice skills** from `.agent/practice-skills/registry.md`
(e.g. CI/CD when workflow files exist; Backlog.md when `backlog` is installed and
initialized; git lifecycle when `.leanagentkit/git-lifecycle.yml` exists) and notes
them in the summary.

**Practice skills (guardrails):** Eleven cross-cutting skills ship in
`.agent/skills/`. Nine are always-on with `invocation: auto` (review, simplify,
git-workflow, docs, debug, security, performance, deprecation, api-design) —
agents load them when relevant, not on every prompt. Five are `invocation:
conditional` (ci-cd, observability, backlog, git-lifecycle, architecture): they ship dormant and are
advertised in `AGENTS.md §7` only when `leanagentkit-match-stack` detects
matching evidence. See `.agent/skills/README.md` § Engineering practice.

## Step 3b — Optional visual board (Backlog.md)

If the user wants a Kanban/web UI for tasks, offer (do not assume):

> Use Backlog.md for a visual task board? (requires installing `backlog` globally)

- **Yes** → guide install (`npm i -g backlog.md` or `brew install backlog-md`),
  then `backlog init "<project-name>"` (or `--no-git` when no Git repo). During
  init, choose **Skip** for AI instructions — the kit owns `AGENTS.md`. **Never**
  run `backlog agents --update-instructions`. Step 3f wires `leanagentkit-backlog`
  into `AGENTS.md §7` when evidence matches.
- **No** → skip. The kit works fully without Backlog.md.

Full integration details: `.agent/skills/leanagentkit-backlog.md`.

## Step 3c — Optional git lifecycle

If the repo has a `.git` directory and the user wants branch/commit/PR prompts
synced to the spec workflow, offer (do not assume):

> Enable git lifecycle prompts? (branch at implement-spec, commit/PR offers)

- **Yes** → copy `.leanagentkit/git-lifecycle.yml.example` to
  `.leanagentkit/git-lifecycle.yml` (adjust settings if the user wants). Step 3f
  wires `leanagentkit-git-lifecycle` into `AGENTS.md §7`. For PR offers, ensure GitHub CLI is installed
  (`gh auth login`).
- **No** → skip. The kit works fully without git lifecycle integration.

Full integration details: `.agent/skills/leanagentkit-git-lifecycle.md`.

## Step 3d — Optional Trevor assistant

Offer (do not assume):

> Enable Trevor — the kit concierge for teaching, reminders, checklists, and
> Backlog UX? (requires copying `.leanagentkit/trevor.yml`)

- **Yes** → copy `.leanagentkit/trevor.yml.example` to
  `.leanagentkit/trevor.yml`. Confirm or adjust: `enabled: true`,
  `session_preamble`, `max_reminders_per_session`, `end_session_capture`,
  `checklist_default_mode`. Ensure `docs/memory/REMINDERS.md` exists (kit
  template). Mention: invoke anytime with `leanagentkit-ask-trevor` or "Ask
  Trevor".
- **No** → skip. The kit works fully without Trevor; explicit invoke of
  `leanagentkit-ask-trevor` still works if the user enables later.

Full details: [docs site — Trevor](https://renatoxm.github.io/leanagentkit/trevor) and
`.agent/skills/leanagentkit-ask-trevor.md`.

## Step 3e — Optional Caveman token efficiency

Offer (do not assume):

> Enable Caveman token-efficiency skills? (terse commit messages and PR review comments;
> terse agent replies are off by default — they add skill overhead each turn)

- **Yes** → copy `.leanagentkit/caveman.yml.example` to
  `.leanagentkit/caveman.yml`. Defaults: `terse_commits: true`, `terse_reviews: true`,
  `terse_communication: false`. Adjust toggles with the user if they want terse replies.
  Step 3f wires enabled Caveman skills into `AGENTS.md §7`.
- **No** → skip. The kit works fully without Caveman; skills remain in `.agent/skills/`
  for explicit invoke later.

Full details: `LEAN_AGENT_KIT_GUIDE.md` (§8 optional token efficiency),
[docs site — Caveman](https://renatoxm.github.io/leanagentkit/caveman), and
`.agent/skills/leanagentkit-caveman*.md`.

## Step 3g — Optional architecture decomposition

Offer (do not assume):

> Enable architecture-guided decomposition? (embedded Clean Architecture + DDD
> references, parallel-safe work slices when possible)

- **Yes** → copy `.leanagentkit/architecture.yml.example` to
  `.leanagentkit/architecture.yml` (adjust settings if the user wants). Step 3f
  wires `leanagentkit-architecture` and `leanagentkit-decompose-spec` into
  `AGENTS.md §7`.
- **No** → skip. The kit works fully without architecture decomposition.

Full integration details: `.agent/skills/leanagentkit-architecture.md` and
`.agent/skills/leanagentkit-decompose-spec.md`.

## Step 3f — Refresh AGENTS.md §7 (optional integrations)

Step 3 runs `leanagentkit-match-stack` **before** optional configs in 3b–3g exist.
After Steps 3b–3g (whether the user opted in or skipped each), run **only** steps
7 and 8 of `leanagentkit-match-stack`:

1. Rebuild **Practice skills (guardrails)** — CI/CD, observability, backlog,
   git-lifecycle, architecture (per registry Detect conditions).
2. Rebuild **Token efficiency (optional)** — Caveman toggles from
   `.leanagentkit/caveman.yml` (step 8 only; never under Practice skills).

Replace each subsection body idempotently — remove stale lines when configs are
absent or disabled.

## Step 4 — Wire agent pointer files (only for chosen targets)
For each tool selected in Step 0, create a ONE-LINE pointer to AGENTS.md (don't
duplicate rules):
- **Cursor and/or Claude Code** → run `leanagentkit-wire-agent` with the selected
  target(s). Copies static templates (`.cursor/rules/memory.mdc`, `CLAUDE.md`) and
  **generates** skill wrappers from `.agent/skills/*.md` frontmatter. On re-run,
  refreshes only kit-managed files.
- Copilot → `.github/copilot-instructions.md`: "Follow AGENTS.md."
- Aider → `CONVENTIONS.md`: "Follow AGENTS.md."
- ChatGPT/Other → note in README how to paste AGENTS.md.
Skip files for tools not selected.

## Step 5 — Seed decisions (optional, ask)
If the codebase already encodes notable decisions, offer to run `leanagentkit-seed-adrs`.

## Step 5b — Offer artifact generators (optional, ask)
Ask whether the user wants to author any artifact generators now (page, component,
crud, endpoint…). For each chosen type, run `leanagentkit-skill-artifact-template`. These are
optional and add zero footprint until authored.

Mention the **learning loop**: `leanagentkit-distill-skill` freezes session workflows;
`leanagentkit-curate-skills` reviews generated skills periodically (archive, never delete).
Standards live in `.agent/skills/references/skill-authoring-standards.md`.

## Step 6 — Document stack skills in LEAN_AGENT_KIT.md
`LEAN_AGENT_KIT.md` is copied from the kit template at install time (`README.md` →
`LEAN_AGENT_KIT.md` via `create-lean-agent-kit`). After Step 3, replace the
placeholder under `### Stack skills (external, auto-installed)` with the skills
actually installed for this project.

1. Open `LEAN_AGENT_KIT.md` → `### Stack skills (external, auto-installed)`.
2. Replace the placeholder table (`_(none yet)_` row) with one row per stack
   **detected and approved** in Step 3. Omit declined stacks and anything skipped
   in Step 0.
3. For each row, pull from `.agent/stacks/registry.md` (**Provides**) and the
   matching `.agent/stacks/<name>.md` playbook (**Defer to the skill / MCP for**):
   - **Skill** — primary skill or MCP name (e.g. `hono`, `tailwind-4-docs`,
     `cloudflare`, `Svelte MCP`).
   - **Use when** — one line: what to defer to it for, how to invoke, and any
     REQUIRED post-install (e.g. Tailwind docs sync, `@hono/cli`).
4. **Copy-in skills** (`Type: skill`) — note they live under `.agents/skills/`
   (and may be mirrored in `.cursor/skills/` when Cursor was wired). Agents
   auto-discover them for matching tech; or say explicitly: "use the `hono`
   skill when …".
5. **MCP rows** (`Type: mcp`, e.g. Svelte) — note there is no skills folder;
   the agent must use the configured MCP server (`.cursor/mcp.json` or
   `.mcp.json`). Say "use Svelte MCP tools before answering from memory."
6. If **no** stack skills were installed, replace the table body with a single
   line: _No external stack skills installed. Re-run `leanagentkit-match-stack` after adding
   dependencies._
7. **Idempotent:** on re-run, replace the entire table under that heading — do
   not append duplicate rows.

Keep the intro paragraph above the table; only replace the table (and optional
post-install bullets immediately below it).

## Step 7 — Summarize
Print: tiers enabled, files created, stacks detected + install status (with any
REQUIRED post-install steps, e.g. Tailwind snapshot sync), `LEAN_AGENT_KIT.md`
stack-skills section updated, Trevor status if Step 3d enabled, Caveman status if
Step 3e enabled (list which toggles are on), architecture decomposition status if
Step 3g enabled, the daily loop (`leanagentkit-start-session` →
`leanagentkit-check` → `leanagentkit-end-session`), and the learning loop
(`leanagentkit-distill-skill`, `leanagentkit-curate-skills`). Clear bootstrap notes from SCRATCH.

## Step 8 — Stamp dates
Set today's date anywhere still showing `<!-- YYYY-MM-DD -->` or unfilled placeholders:
- `AGENTS.md` header `Last updated`
- `docs/CODEBASE_MAP.md` `Last updated`
- `docs/adr/0001-record-architecture-decisions.md` `Date` (if still a placeholder)

## Re-running
Safe to re-run. Re-detect stack, refresh the map, never clobber human-written ADRs
or PROGRESS history.
