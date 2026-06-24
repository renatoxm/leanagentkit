# Stack Playbook: Svelte / SvelteKit

> Applied when Svelte is detected. NOTE: the official tooling is an **MCP server**
> (`mcp.svelte.dev`), not a copy-in skill — there are no files in `.agent/skills/`
> for it. Make sure the MCP is connected.

## Defer to the MCP for
- Svelte 5 runes (`$state`, `$derived`, `$effect`), SvelteKit routing/load/actions.
- API questions, autofix, and playground generation → Svelte MCP tools.
- Always prefer the MCP over memory for Svelte 5 syntax (it changed a lot from v4).

## Conventions to record in AGENTS.md
- Svelte 5 runes mode; avoid legacy `export let` / stores-as-state where runes fit.
- Keep `+page.server.ts` load/actions thin; share logic via `src/lib/`.
- Co-locate component + test; use `$lib` alias for imports.

## CODEBASE_MAP hints to capture
- Route tree under `src/routes/` → note dynamic segments and layout groups.
- `src/lib/` shared modules; `hooks.server.ts` for auth/middleware.
- `svelte.config.js` adapter (tells you the deploy target).

## AGENTS.md snippet to add
> For Svelte 5 / SvelteKit, use the Svelte MCP (`mcp.svelte.dev`) before answering
> from memory — runes syntax differs from older Svelte.
