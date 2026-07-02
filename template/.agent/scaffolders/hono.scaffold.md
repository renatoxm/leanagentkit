# Scaffolder: hono

- **Category:** backend
- **Kind:** cli
- **Stacks row:** Hono
- **Depends-on:** none
- **Chains-to:** cloudflare, prisma, drizzle
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| template | Runtime template | nodejs · cloudflare-workers · cloudflare-pages · bun | nodejs | `--template {{value}}` |
| pm | Package manager | pnpm · npm · bun | pnpm | `--pm {{value}}` |
| install | Install dependencies? | yes · no | yes | omit `--install false` / `--install false` |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npm create hono@latest {{dir}} -- {{flags}}
```

**Flag compilation notes**

- Pass `--template`, `--pm`, and optionally `--install false` after `--`.
- `CI=true` suppresses remaining prompts when template is set.

## Verify

- [ ] `package.json` with `hono`
- [ ] Entry file exists (`src/index.ts` or template-specific path)
- [ ] Dev script runs (`{{pm}} run dev` or documented equivalent)

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/hono.md`, post-install `@hono/cli`).
- Offer `cloudflare`, `prisma`, or `drizzle` via `Chains-to`.
