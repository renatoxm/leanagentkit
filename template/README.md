# Lean Agent Kit

A lightweight, tool-agnostic alternative to GitHub Spec Kit. It gives a project
**tiered Markdown memory** (long / medium / short) so agents navigate by reading a
map instead of re-scanning the repo — then **detects your stack and wires up the
right external agent skills** automatically.

Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that can
read files and (optionally) MCP/skills.

## Why this instead of Spec Kit
- **Smaller footprint.** No multi-command framework or boilerplate specs. A handful
  of Markdown files + skills; tiers and stacks you don't use are never scaffolded.
- **Context-frugal by design.** The whole point is *less* in context: agents read
  `CODEBASE_MAP.md` + `ACTIVE_CONTEXT.md` and open only named files.
- **Interactive setup.** `bootstrap` asks a few questions (which tiers, which agents,
  install stack skills?) instead of dumping everything.
- **Stack-aware.** After mapping the code it matches your tech to curated external
  skills and installs them the correct way.

## What's inside
```
AGENTS.md                      # conventions + memory protocol + stack-skills section
README.md
.agent/
  skills/
    bootstrap.md               # ① interactive setup — run this first
    match-stack.md             # ② detect stack → install matching skills
    skill-artifact-template.md # meta-skill: authors artifact generators
    generated/                 # authored generators (create-page, create-crud…)
      _GENERATOR_TEMPLATE.md  README.md
    map-codebase.md            # → docs/CODEBASE_MAP.md
    init-conventions.md        # → AGENTS.md §1–5
    seed-adrs.md               # → docs/adr/*
    new-spec.md                # → docs/specs/<feature>.md
    start-session.md / end-session.md   # the daily loop
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
2. Tell your agent: **"Read `.agent/skills/bootstrap.md` and follow it."**
3. Answer the questionnaire. It maps the code, detects your stack, and wires skills.

## Built-in stack support
Detected automatically and matched to curated skills (see `.agent/stacks/registry.md`):

| Stack | Skill | Install | Notes |
|-------|-------|---------|-------|
| Cloudflare | `cloudflare/skills` | `npx skills add …` / plugin | + optional docs/bindings MCP |
| Hono | `yusukebe/hono-skill` | `npx skills add …` / plugin | needs `@hono/cli` devDep |
| Astro | `withastro/astro` (`.agents/skills`) | copy-in (`npx degit …`) | skills live in the framework monorepo |
| Svelte/Kit | `sveltejs/ai-tools` | MCP (`mcp.svelte.dev`) | it's an MCP server, not copy-in files |
| shadcn-svelte | `antstanley/shadcn-svelte-skill` | curl install script | copy-in; needs Svelte 5 + Tailwind v4 |
| Tailwind v4 | `Lombiq/Tailwind-Agent-Skills` | `npx skills add …` | REQUIRED docs-snapshot sync after install |

`npx skills add <repo>` (the skills.sh CLI) is the portable default for copy-in
skills. Add your own tech by appending a row to `registry.md` (+ an optional playbook).

## Artifact generators
Turn a repeated creation chore (new page, component, CRUD…) into a one-call skill.

1. **Author once:** "use `skill-artifact-template` to generate a new page." It looks
   at an existing page, infers everything that page needed (files, route, middleware,
   role guard, i18n keys, barrel/nav edits), asks only about gaps, and freezes a
   `create-new-page` skill + a recipe.
2. **Use forever:** "Read `.agent/skills/generated/create-new-page.md` and follow it."
   It asks the name + per-instance values (e.g. which roles), shows a plan, and on
   approval creates files and makes every wiring edit — without re-reading the repo.

The recipe is the cache: the costly "where does everything go in *this* project"
work happens once, so each later generation is cheap and consistent.

## Daily loop
- Start a session → `start-session` (reads only map + active context)
- New feature → `new-spec`
- End a session → `end-session` (persists state so the next session resumes cleanly)

> Placeholders are `<...>` / `<!-- ... -->`. Skills replace them with evidence-based
> content from your actual code. Registry install commands verified 2026-06-23.
