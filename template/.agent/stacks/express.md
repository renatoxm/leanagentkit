# Stack Playbook: Express

> Applied when Express is detected.

## Defer to the skill / MCP for

- Middleware, routing, error handling → Express docs and existing project patterns.

## Conventions to record in AGENTS.md

- Routes thin; handlers delegate to services/controllers.
- Centralized error middleware; async errors forwarded with `next(err)`.
- One router per resource; mount in app entry.

## CODEBASE_MAP hints to capture

- App entry (`app.js`, `server.ts`, `index.ts`) and middleware order.
- Router modules and mount paths.
- Auth middleware location.

## AGENTS.md snippet to add

> For Express routing and middleware, keep handlers thin and match existing router layout.
