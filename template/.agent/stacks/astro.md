# Stack Playbook: Astro

> Applied when Astro is detected. Thin layer: conventions + when to defer to the
> Astro skill (vendored from `withastro/astro/.agents/skills`). Don't duplicate docs.

## Install note
Astro's skills live inside the framework monorepo under `.agents/skills/` (plural)
next to a root `AGENTS.md`. There's no published `npx skills add` — copy the folder
in (e.g. `npx degit withastro/astro/.agents/skills .agent/skills/vendor/astro`) and
point your agent at it. Pin to a release tag; these track framework versions.

## Defer to the skill for
- `.astro` component syntax, content collections (`src/content/`), routing in `src/pages/`.
- Islands architecture + hydration directives (`client:load`, `client:visible`, …).
- Integrations and the right `@astrojs/*` adapter; static vs SSR/server output.

## Conventions to record in AGENTS.md
- Default to zero-JS static; add interactivity only via islands with explicit
  `client:` directives — don't hydrate whole pages.
- Content lives in typed collections under `src/content/`; define schemas in
  `src/content/config.ts` (source of truth for content shape).
- Keep UI-framework components (React/Svelte/Vue) as islands; co-locate with the
  matching framework's conventions (see its playbook).

## CODEBASE_MAP hints to capture
- `astro.config.{mjs,ts}` → integrations + adapter (the adapter = deploy target). Mark as source of truth.
- `src/pages/` → file-based routes (note dynamic `[param]` and endpoints `.ts`).
- `src/content/` + `config.ts` → content collections and their schemas.
- `src/layouts/`, `src/components/` → shared shells and components (flag which are islands).

## AGENTS.md snippet to add
> For Astro (`.astro` syntax, content collections, islands/hydration, adapters),
> use the vendored Astro skill. Prefer static output; hydrate only via `client:` islands.
