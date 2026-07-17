# Stack Playbook: Cloudflare

> Applied when Cloudflare is detected. Thin layer: conventions + when to defer to
> the `cloudflare/skills` skill. Do not duplicate Cloudflare docs here.

## Defer to the skill / MCP for
- Workers, Pages, Durable Objects, KV, D1, R2, Queues, Workflows, Agents SDK APIs.
- `wrangler` commands and binding config → use the `wrangler` skill / `cloudflare-bindings` MCP.
- Live docs → `cloudflare-docs` MCP rather than guessing from memory.

## Conventions to record in AGENTS.md
- Bindings are the source of truth for resources; never hardcode resource IDs.
- Secrets via `wrangler secret` / `.dev.vars` (gitignored) — never in `wrangler.toml`.
- Prefer Durable Objects for coordination/state over external stores when at the edge.
- Keep handlers thin; business logic stays runtime-agnostic so it's testable off-Worker.

## CODEBASE_MAP hints to capture
- `wrangler.toml`/`.jsonc` → the binding manifest (mark as source of truth).
- Entry: the `export default { fetch }` (or Hono app) Worker entrypoint.
- DO classes, queue consumers, scheduled handlers — list each with its trigger.

## AGENTS.md snippet to add
> For Cloudflare APIs/bindings/wrangler, use the `cloudflare` skill and
> `cloudflare-docs` MCP before answering from memory.
