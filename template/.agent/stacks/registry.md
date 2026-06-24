# Stack Registry

> Single source of truth mapping a detected technology → the external agent skill
> for it, the correct install method, and the local integration playbook.
> The `bootstrap` and `match-stack` skills read this. Edit here, not in skills.
>
> Verified: 2026-06-23. Skill repos churn — re-check install commands if a year
> has passed or a command fails.

## How to read a row

- **Detect** — evidence in the repo that turns this row "on".
- **Skill** — the upstream repo.
- **Install** — preferred command. `npx skills add <repo>` (the skills.sh CLI)
  works for all copy-in skills below and is the portable default. Plugin
  marketplaces are noted as alternatives.
- **Type** — `skill` (copy-in files) vs `mcp` (running server, different setup).
- **Playbook** — the local file with stack-specific conventions to apply.
- **Post-install** — extra step required before the skill is usable.

---

## Cloudflare (Workers / Pages / Agents SDK)

- **Detect:** `wrangler.toml` / `wrangler.jsonc`, `@cloudflare/*` or `wrangler` in deps, `.dev.vars`
- **Skill:** `cloudflare/skills`
- **Type:** skill (+ optional MCP servers for docs/bindings/observability)
- **Install:** `npx skills add https://github.com/cloudflare/skills`
  - Claude Code alt: `npx skills add https://github.com/cloudflare/skills -a claude-code`
  - Claude Code alt (plugin): `/plugin marketplace add cloudflare/skills` → `/plugin install cloudflare@cloudflare`
  - Cursor alt: `npx skills add https://github.com/cloudflare/skills -a cursor --copy`
  - Cursor alt (rules): Settings → Rules → Add Rule → Remote Rule (GitHub) → `cloudflare/skills`
- **Provides:** `cloudflare`, `agents-sdk`, `durable-objects`, `wrangler`, `sandbox-sdk`, `web-perf`, MCP-server builders
- **Optional MCP:** `cloudflare-docs`, `cloudflare-bindings`, `cloudflare-observability` (see upstream `.mcp.json`)
- **Playbook:** `.agent/stacks/cloudflare.md`
- **Post-install:** none

## Hono

- **Detect:** `hono` in deps, `import { Hono } from 'hono'`, `app.get(`/`app.route(` patterns
- **Skill:** `yusukebe/hono-skill`
- **Type:** skill (+ optional `hono-docs` MCP)
- **Install:** `npx skills add yusukebe/hono-skill`
  - Claude Code alt: `npx skills add yusukebe/hono-skill -a claude-code`
  - Claude Code alt (plugin): `/plugin marketplace add yusukebe/hono-skill` → `/plugin install hono-skill@hono`
  - Cursor alt: `npx skills add yusukebe/hono-skill -a cursor --copy`
- **Provides:** `hono` (routing, context, middleware, JSX, validation, RPC, streaming) + `hono request` testing
- **Requires:** Hono CLI as devDep → `npm install -D @hono/cli`
- **Optional MCP:** `hono-docs` → `claude mcp add --transport http hono-docs https://hono-docs-mcp.yusukebe.workers.dev/mcp`
- **Playbook:** `.agent/stacks/hono.md`
- **Post-install:** install `@hono/cli` devDependency

## Svelte / SvelteKit

- **Detect:** `svelte` / `@sveltejs/kit` in deps, `svelte.config.js`, `*.svelte` files
- **Skill:** `sveltejs/ai-tools` — **this is an MCP server, not a copy-in skill**
- **Type:** mcp (hosted at `mcp.svelte.dev`)
- **Install (MCP, preferred):** add the remote MCP server to your agent config:
  ```json
  { "mcpServers": { "svelte": { "type": "http", "url": "https://mcp.svelte.dev/mcp" } } }
  ```
  - Claude Code / Cursor: install the plugin from the repo's `.claude-plugin` / `.cursor-plugin`.
  - Claude Code alt (MCP config): add to root `.mcp.json`:
    ```json
    { "mcpServers": { "svelte": { "type": "http", "url": "https://mcp.svelte.dev/mcp" } } }
    ```
  - Cursor alt (MCP config): add to `.cursor/mcp.json`:
    ```json
    { "mcpServers": { "svelte": { "type": "http", "url": "https://mcp.svelte.dev/mcp" } } }
    ```
- **Provides:** live Svelte 5 / SvelteKit docs retrieval, autofix, playground generation via MCP tools
- **Playbook:** `.agent/stacks/svelte.md`
- **Post-install:** confirm the agent lists the `svelte` MCP tools; verify `mcp.svelte.dev` reachable
- **Note:** because it's an MCP, there are no files to copy into `.agent/skills/`. The
  playbook still applies (conventions + "prefer the Svelte MCP for API questions").

## Astro

- **Detect:** `astro` in deps, `astro.config.{mjs,ts}`, `*.astro` files, `src/pages/` with `.astro` routes, `src/content/` collections
- **Skill:** `withastro/astro` — skills live in the framework monorepo under `.agents/skills/` (note: `.agents`, plural), alongside the repo's root `AGENTS.md`
- **Type:** skill (copy-in; maintained inside the official framework repo, MIT)
- **Install:** no `npx skills add` published — copy the skill folder(s) from the repo into your agent's skills dir:
  ```bash
  npx degit withastro/astro/.agents/skills .agent/skills/vendor/astro
  ```
  (or sparse-checkout `.agents/skills` and copy.) Point your agent at the copied folder.
  - Claude Code alt: copy into `.claude/skills/`:
    ```bash
    npx degit withastro/astro/.agents/skills .claude/skills/astro
    ```
  - Cursor alt: copy into `.cursor/skills/` or `.agents/skills/`:
    ```bash
    npx degit withastro/astro/.agents/skills .cursor/skills/astro
    ```
  - Pin to a tag for stability instead of `main`; re-pull to update (these track framework releases).
- **Provides:** Astro authoring conventions — content collections, `.astro` components, islands/hydration directives, routing, integrations, server/SSR vs static
- **Related (separate repos):** Starlight (`withastro/starlight`) for docs sites; Astro DB (`@astrojs/db`)
- **Pairs with:** UI-framework rows (React/Svelte/Vue) if islands are used, and the Cloudflare/Netlify/Vercel rows via the matching `@astrojs/*` adapter
- **Playbook:** `.agent/stacks/astro.md`
- **Post-install:** confirm the copied skill is listed by your agent; note the adapter in `astro.config` (it sets the deploy target)

## shadcn-svelte (UI components)

- **Detect:** `components.json` with a svelte/shadcn config, `bits-ui` / `mode-watcher` / `formsnap` in deps, `$lib/components/ui/` directory, shadcn-svelte imports
- **Skill:** `antstanley/shadcn-svelte-skill`
- **Type:** skill (copy-in; 54 component references + setup/migration guides)
- **Install:** curl-piped install script (NOT `npx skills add`):
  `curl -fsSL https://github.com/antstanley/shadcn-svelte-skill/releases/latest/download/install.sh | bash`
  - Installs to `~/.claude/skills/shadcn-svelte` (Claude Code global layout).
  - Claude Code alt (project): clone and package into `.claude/skills/shadcn-svelte/`:
    ```bash
    git clone --depth 1 https://github.com/antstanley/shadcn-svelte-skill /tmp/shadcn-svelte-skill
    cd /tmp/shadcn-svelte-skill && python scripts/package_skill.py shadcn-svelte dist
    unzip -o dist/shadcn-svelte.zip -d .claude/skills/
    ```
  - Cursor alt: clone and package into `.cursor/skills/shadcn-svelte/`:
    ```bash
    git clone --depth 1 https://github.com/antstanley/shadcn-svelte-skill /tmp/shadcn-svelte-skill
    cd /tmp/shadcn-svelte-skill && python scripts/package_skill.py shadcn-svelte dist
    unzip -o dist/shadcn-svelte.zip -d .cursor/skills/
    ```
  - Pin a version: swap `latest/download` for `download/vX.Y.Z` (latest verified: v1.0.3, 2026-02-03).
  - From source: clone, then `python scripts/package_skill.py shadcn-svelte dist` and unzip into your skills dir.
- **Provides:** component recipes (Button, Dialog, Form, Data Table…), Bits UI integration, Superforms/Formsnap forms, dark mode via mode-watcher, Svelte 5 + Tailwind v4 migration notes
- **Depends on:** Svelte 5 (see svelte row) **and** Tailwind v4 (see tailwind row) — enable those rows too
- **Playbook:** `.agent/stacks/shadcn-svelte.md`
- **Post-install:** verify the agent lists the `shadcn-svelte` skill; ensure `components.json` exists (run `npx shadcn-svelte@latest init` if not)

## Tailwind CSS v4

- **Detect:** `tailwindcss` (v4.x) in deps, `@import "tailwindcss"` in CSS, `@theme` blocks, `@tailwindcss/vite`
- **Skill:** `Lombiq/Tailwind-Agent-Skills`
- **Type:** skill (with a local docs-snapshot generator)
- **Install:** `npx skills add Lombiq/Tailwind-Agent-Skills`
  - Claude Code alt: `npx skills add Lombiq/Tailwind-Agent-Skills -a claude-code`
  - Cursor alt: `npx skills add Lombiq/Tailwind-Agent-Skills -a cursor --copy`
  - Manual: copy `skills/tailwind-4-docs/` into your agent's skills dir
- **Provides:** `tailwind-4-docs` — gotchas list, implementation playbook, local docs index
- **Playbook:** `.agent/stacks/tailwind.md`
- **Post-install (REQUIRED):** the skill does NOT bundle docs (upstream licensing).
  Initialize the snapshot:
  `python skills/tailwind-4-docs/scripts/sync_tailwind_docs.py --accept-docs-license`
  Re-run if `references/docs/` is missing or older than one week.

---

## Adding your own rows

To extend: add a section above with the same fields, then (optionally) create a
matching `.agent/stacks/<name>.md` playbook. The `match-stack` skill auto-discovers
any row whose **Detect** condition is met.
