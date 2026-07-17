# Stack Playbook: React

> Applied when React is detected (without Next.js — see nextjs playbook if both).

## Defer to the skill / MCP for

- Hooks, components, state libraries → official React docs and detected state solution.

## Conventions to record in AGENTS.md

- Functional components; match existing state approach (hooks, context, external store).
- Co-locate component + test when tests exist.
- Shared UI in `components/`; feature code in `features/` if that pattern exists.

## CODEBASE_MAP hints to capture

- App entry (`main.tsx`, `App.tsx`) and router setup.
- Component library / design system location.
- State management modules.

## AGENTS.md snippet to add

> For React components and hooks, follow official React docs and existing component patterns.
