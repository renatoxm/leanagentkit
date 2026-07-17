# Stack Playbook: Hono

> Applied when Hono is detected. Pairs well with the Cloudflare playbook.

## Defer to the skill / MCP for
- Routing, context, middleware, JSX, validation, RPC, streaming, helpers → `hono` skill.
- Endpoint testing → `hono request`.
- Latest docs → optional `hono-docs` MCP.

## Requirement
- Install the Hono CLI as a devDependency: `npm install -D @hono/cli`.

## Conventions to record in AGENTS.md
- Routes thin; push logic into `src/services/` (no Hono `Context` types leaking in).
- Centralize validation (zod/valibot) at the route boundary; type the RPC client.
- One app instance; mount sub-apps with `app.route()` for modularity.

## CODEBASE_MAP hints to capture
- The root `new Hono()` app and where sub-apps are mounted.
- Middleware stack order (auth, cors, logger) and where it's registered.
- The RPC type export (the `AppType`) if `hc` client is used → mark source of truth.

## AGENTS.md snippet to add
> For Hono routing/middleware/RPC, use the `hono` skill; test endpoints with `hono request`.
