# Stack Playbook: shadcn-svelte

> Applied when shadcn-svelte is detected. Pairs with the Svelte and Tailwind v4
> playbooks — make sure both are also active. Thin layer: conventions + when to
> defer to the `shadcn-svelte` skill. Don't duplicate component docs here.

## Install note
The skill installs via a curl script into `~/.claude/skills/shadcn-svelte` (Claude
Code layout), not `npx skills add`. For other agents, install from source (package
with `scripts/package_skill.py`) and point the agent at the resulting skill folder.

## Defer to the skill for
- Adding/configuring any of the 54 components (Button, Dialog, Data Table, etc.).
- Forms with Superforms + Formsnap; validation patterns.
- Dark mode via mode-watcher; theme tokens.
- Bits UI integration and Svelte 5 / Tailwind v4 migration specifics.

## Conventions to record in AGENTS.md
- Components live in `$lib/components/ui/<name>/` (shadcn-svelte convention); treat
  these as owned, editable source — not a black-box dependency.
- Add components via the CLI (`npx shadcn-svelte@latest add <name>`) rather than
  hand-creating, so the registry/config stays consistent.
- Theme tokens are defined in the Tailwind v4 `@theme` block (see tailwind playbook),
  not a JS config.

## CODEBASE_MAP hints to capture
- `components.json` → shadcn-svelte config (style, aliases) — mark as source of truth.
- `$lib/components/ui/` → installed components index.
- The CSS file with theme tokens + `mode-watcher` setup location.

## AGENTS.md snippet to add
> For shadcn-svelte components/forms/dark-mode, use the `shadcn-svelte` skill and
> add components with `npx shadcn-svelte@latest add`. Requires Svelte 5 + Tailwind v4
> (use those skills/MCP for their respective concerns).
