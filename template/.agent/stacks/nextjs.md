# Stack Playbook: Next.js

> Applied when Next.js is detected.

## Defer to the skill / MCP for

- App Router, server components, caching, metadata → official Next.js docs.

## Conventions to record in AGENTS.md

- Prefer App Router conventions if `app/` exists; else Pages Router patterns.
- Server Components by default; `'use client'` only when needed.
- Data fetching in server components or route handlers — match project style.

## CODEBASE_MAP hints to capture

- `app/` or `pages/` route tree and layout groups.
- `next.config` and adapter/deploy target.
- API routes / route handlers location.

## AGENTS.md snippet to add

> For Next.js routing, server components, and data fetching, follow official Next.js docs and the existing route layout.
