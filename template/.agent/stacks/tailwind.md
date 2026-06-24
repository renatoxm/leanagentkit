# Stack Playbook: Tailwind CSS v4

> Applied when Tailwind v4 is detected. The `tailwind-4-docs` skill needs a
> one-time docs-snapshot init (it doesn't bundle docs).

## REQUIRED post-install
- Initialize the local docs snapshot:
  `python skills/tailwind-4-docs/scripts/sync_tailwind_docs.py --accept-docs-license`
- Refresh if `references/docs/` is missing or older than a week.

## Defer to the skill for
- v4 config-in-CSS (`@theme`, `@import "tailwindcss"`), utility lookups, v3→v4 migration, gotchas.

## Conventions to record in AGENTS.md
- v4 is CSS-first: theme tokens live in `@theme` in CSS, not `tailwind.config.js`.
- Centralize design tokens; avoid arbitrary values where a token exists.
- Component classes: prefer composition / extracting components over `@apply` sprawl.

## CODEBASE_MAP hints to capture
- The CSS entry with `@import "tailwindcss"` and the `@theme` block → token source of truth.
- Vite/PostCSS wiring (`@tailwindcss/vite` plugin).

## AGENTS.md snippet to add
> For Tailwind v4 utilities/config/migration, use the `tailwind-4-docs` skill
> (run its sync script first if the snapshot is stale).
