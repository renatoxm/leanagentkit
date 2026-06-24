# Lean Agent Kit

A lightweight, tool-agnostic alternative to GitHub Spec Kit. It gives a project
**tiered Markdown memory** (long / medium / short) so agents navigate by reading a
map instead of re-scanning the repo — then **detects your stack and wires up the
right external agent skills** automatically.

Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that can
read files and (optionally) MCP/skills. **Cursor:** select Cursor during bootstrap
to install `.cursor/rules/` and `.cursor/skills/` from kit templates; stack skills
use `npx skills add -a cursor --copy`. **Claude Code:** select Claude during
bootstrap to install `CLAUDE.md` + `.claude/skills/`; stack skills use
`npx skills add -a claude-code`.

## Why this instead of Spec Kit

- **Smaller footprint.** No multi-command framework or boilerplate specs. A handful
  of Markdown files + skills; tiers and stacks you don't use are never scaffolded.
- **Context-frugal by design.** The whole point is _less_ in context: agents read
  `CODEBASE_MAP.md` + `ACTIVE_CONTEXT.md` and open only named files.
- **Interactive setup.** `leanagentkit-bootstrap` asks a few questions (which tiers, which agents,
  install stack skills?) instead of dumping everything.
- **Stack-aware.** After mapping the code it matches your tech to curated external
  skills and installs them the correct way.

## What's inside

```
AGENTS.md                      # conventions + memory protocol + stack-skills section
README.md
.agent/
  skills/
    leanagentkit-bootstrap.md               # ① interactive setup — run this first
    leanagentkit-match-stack.md             # ② detect stack → install matching skills
    leanagentkit-skill-artifact-template.md # meta-skill: authors artifact generators
    generated/                 # authored generators (leanagentkit-create-page, …)
      _GENERATOR_TEMPLATE.md  README.md
    leanagentkit-map-codebase.md            # → docs/CODEBASE_MAP.md
    leanagentkit-init-conventions.md        # → AGENTS.md §1–5
    leanagentkit-seed-adrs.md               # → docs/adr/*
    leanagentkit-new-spec.md                # → docs/specs/<feature>.md
    leanagentkit-start-session.md / leanagentkit-end-session.md   # the daily loop
    README.md
  stacks/
    registry.md                # tech → external skill + install method (source of truth)
    cloudflare.md  hono.md  astro.md  svelte.md  shadcn-svelte.md  tailwind.md   # thin per-stack playbooks
  recipes/
    _TEMPLATE.recipe.md        # frozen artifact recipes (data for generators)
docs/
  CODEBASE_MAP.md              # LONG · where everything lives
  adr/ (0001 + _TEMPLATE)      # LONG · decisions
  specs/_TEMPLATE.md           # MEDIUM · per-feature
  memory/
    ACTIVE_CONTEXT.md          # MEDIUM · where the code is now
    PROGRESS.md                # MEDIUM · append-only history
    SCRATCH.md                 # SHORT · current task, disposable
```

## Quick start

1. Copy `AGENTS.md`, `.agent/`, and `docs/` into your repo root.
2. Tell your agent: **"Read `.agent/skills/leanagentkit-bootstrap.md` and follow it."**
3. Answer the questionnaire. It maps the code, detects your stack, and wires skills.

## Built-in stack support

Detected automatically and matched to curated skills (see `.agent/stacks/registry.md`):

| Stack         | Skill                                | Install                     | Notes                                     |
| ------------- | ------------------------------------ | --------------------------- | ----------------------------------------- |
| Cloudflare    | `cloudflare/skills`                  | `npx skills add …` / plugin | + optional docs/bindings MCP              |
| Hono          | `yusukebe/hono-skill`                | `npx skills add …` / plugin | needs `@hono/cli` devDep                  |
| Astro         | `withastro/astro` (`.agents/skills`) | copy-in (`npx degit …`)     | skills live in the framework monorepo     |
| Svelte/Kit    | `sveltejs/ai-tools`                  | MCP (`mcp.svelte.dev`)      | it's an MCP server, not copy-in files     |
| shadcn-svelte | `antstanley/shadcn-svelte-skill`     | curl install script         | copy-in; needs Svelte 5 + Tailwind v4     |
| Tailwind v4   | `Lombiq/Tailwind-Agent-Skills`       | `npx skills add …`          | REQUIRED docs-snapshot sync after install |

`npx skills add <repo>` (the skills.sh CLI) is the portable default for copy-in
skills. Add your own tech by appending a row to `registry.md` (+ an optional playbook).

## Artifact generators

Turn a repeated creation chore (new page, component, CRUD…) into a one-call skill.

1. **Author once:** "use `leanagentkit-skill-artifact-template` to generate a new page." It looks
   at an existing page, infers everything that page needed (files, route, middleware,
   role guard, i18n keys, barrel/nav edits), asks only about gaps, and freezes a
   `leanagentkit-create-new-page` skill + a recipe.
2. **Use forever:** "Read `.agent/skills/generated/leanagentkit-create-new-page.md` and follow it."
   It asks the name + per-instance values (e.g. which roles), shows a plan, and on
   approval creates files and makes every wiring edit — without re-reading the repo.

The recipe is the cache: the costly "where does everything go in _this_ project"
work happens once, so each later generation is cheap and consistent.

## Daily loop

- Start a session → `leanagentkit-start-session` (reads only map + active context)
- New feature → `leanagentkit-new-spec`
- End a session → `leanagentkit-end-session` (persists state so the next session resumes cleanly)

> Placeholders are `<...>` / `<!-- ... -->`. Skills replace them with evidence-based
> content from your actual code. Registry install commands verified 2026-06-23.

## How to use Lean Agent Kit

[Lean Agent Kit](LEAN_AGENT_KIT.md) wires AI coding agents into this repo with durable
memory, stack-specific skills, and repeatable workflows. **`AGENTS.md` is the canonical
rulebook** — tool-specific files (`.cursor/rules/`, `.cursor/skills/`) point to it.

### First-time setup

If the kit has not been bootstrapped yet, tell your agent:

```
Read .agent/skills/leanagentkit-bootstrap.md and follow it.
```

Bootstrap maps the codebase, fills `AGENTS.md`, detects the stack, installs external
skills, and wires Cursor. Safe to re-run when the repo structure changes.

### Memory tiers

| Tier       | Files                                                                      | When to read / update                       |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| **Long**   | `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/adr/*`                          | Months — conventions, navigation, decisions |
| **Medium** | `docs/specs/*`, `docs/memory/ACTIVE_CONTEXT.md`, `docs/memory/PROGRESS.md` | Days–weeks — current focus and history      |
| **Short**  | `docs/memory/SCRATCH.md`                                                   | Current task only — clear when done         |

### Daily loop

**Start every session** (cheap context, no repo globbing):

```
Read .agent/skills/leanagentkit-start-session.md and follow it.
```

Or manually: read `docs/memory/ACTIVE_CONTEXT.md` → `docs/CODEBASE_MAP.md` → open only the files listed in "Files in play".

**End every session** (persist state for the next one):

```
Read .agent/skills/leanagentkit-end-session.md and follow it.
```

Updates `ACTIVE_CONTEXT.md`, prepends `PROGRESS.md`, refreshes the map if structure changed, and clears `SCRATCH.md`.

### How to invoke any skill

In Cursor (or any agent that reads project files), use a direct instruction:

```
Read <path-to-skill> and follow it.
```

Cursor also auto-discovers skills under `.cursor/skills/` — you can pick them from the
skills menu or @-mention by name (e.g. `leanagentkit-start-session`, `leanagentkit-create-page`).

Kit skills live in `.agent/skills/`; Cursor wrappers in `.cursor/skills/` delegate to them.
Stack skills live in `.agents/skills/`. Spec Kit skills live in `.cursor/skills/speckit-*`.

---

### Kit skills (orchestration & memory)

Run these from `.agent/skills/` (or use the matching Cursor wrapper in `.cursor/skills/`).

| Skill                       | Invoke                                                         | What it does                                                                                  |
| --------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **leanagentkit-bootstrap**               | `Read .agent/skills/leanagentkit-bootstrap.md and follow it.`               | One-shot interactive setup — map, conventions, stack detection, Cursor wiring. **Run first.** |
| **leanagentkit-start-session**           | `Read .agent/skills/leanagentkit-start-session.md and follow it.`           | Prime context: read memory files, state focus, begin work.                                    |
| **leanagentkit-end-session**             | `Read .agent/skills/leanagentkit-end-session.md and follow it.`             | Persist active context, progress, map updates; clear scratchpad.                              |
| **leanagentkit-map-codebase**            | `Read .agent/skills/leanagentkit-map-codebase.md and follow it.`            | Regenerate `docs/CODEBASE_MAP.md` from the repo.                                              |
| **leanagentkit-init-conventions**        | `Read .agent/skills/leanagentkit-init-conventions.md and follow it.`        | Fill `AGENTS.md` §1–5 from manifests and source evidence.                                     |
| **leanagentkit-match-stack**             | `Read .agent/skills/leanagentkit-match-stack.md and follow it.`             | Detect technologies, install matching external skills, apply stack playbooks.                 |
| **leanagentkit-seed-adrs**               | `Read .agent/skills/leanagentkit-seed-adrs.md and follow it.`               | Reverse-engineer architectural decisions into `docs/adr/`.                                    |
| **leanagentkit-new-spec**                | `Read .agent/skills/leanagentkit-new-spec.md and follow it.`                | Create a feature spec in `docs/specs/<feature>.md`.                                           |
| **leanagentkit-wire-cursor**             | `Read .agent/skills/leanagentkit-wire-cursor.md and follow it.`             | Copy kit templates into `.cursor/rules/` and `.cursor/skills/`.                               |
| **leanagentkit-wire-claude**             | `Read .agent/skills/leanagentkit-wire-claude.md and follow it.`             | Copy kit templates for Claude Code (`CLAUDE.md`, `.claude/skills/`).                          |
| **leanagentkit-skill-artifact-template** | `Read .agent/skills/leanagentkit-skill-artifact-template.md and follow it.` | Author a new project-specific generator from an existing code example.                        |

---

### Artifact generators (project-specific)

These create wired artifacts (pages, routes, components) from frozen recipes — no full-repo scan.

| Generator            | Invoke                                                            | Creates                                                                 |
| -------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **leanagentkit-create-page**      | `Read .agent/skills/generated/leanagentkit-create-page.md and follow it.`      | Authenticated SvelteKit page under `(app)/` + i18n + optional nav entry |
| **leanagentkit-create-component** | `Read .agent/skills/generated/leanagentkit-create-component.md and follow it.` | Svelte 5 component in `$lib/components/`                                |
| **leanagentkit-create-endpoint**  | `Read .agent/skills/generated/leanagentkit-create-endpoint.md and follow it.`  | Hono API route module + router registration                             |
| **leanagentkit-create-crud**      | `Read .agent/skills/generated/leanagentkit-create-crud.md and follow it.`      | API list route + web list page + shared types                           |

Recipes (the wiring data) live in `.agent/recipes/`. To add a new generator type, run `leanagentkit-skill-artifact-template`.

**Example:**

```
Read .agent/skills/generated/leanagentkit-create-page.md and follow it.
Create a new page called reports.
```

---

### Stack skills (external, auto-installed)

Installed under `.agents/skills/` (and some mirrored in `.cursor/skills/`). The agent
loads these when working on matching technologies — or mention the topic explicitly.

| Skill             | Use when                    |
| ----------------- | --------------------------- |
| **example-skill** | Add short usage explanation |

---

### Key files reference

```
AGENTS.md                    ← canonical agent instructions (read every session)
docs/CODEBASE_MAP.md         ← where to find code (don't glob the repo)
docs/memory/ACTIVE_CONTEXT.md ← current focus + "resume from here"
docs/memory/PROGRESS.md      ← append-only session history
docs/memory/SCRATCH.md       ← ephemeral working notes (current task)
docs/adr/                    ← architecture decision records
.agent/skills/               ← kit skill definitions (source of truth)
.agent/recipes/              ← frozen wiring for artifact generators
.agent/stacks/registry.md    ← detected stack → external skill mapping
.cursor/skills/              ← Cursor skill wrappers (kit + generators)
.agents/skills/              ← installed stack skills
.cursor/mcp.json             ← MCP servers
```

### Refresh the kit

Re-run bootstrap or individual skills when the repo structure or stack changes:

```
Read .agent/skills/leanagentkit-bootstrap.md and follow it.
```

Or refresh only what you need: `leanagentkit-map-codebase`, `leanagentkit-init-conventions`, `leanagentkit-match-stack`.

---
