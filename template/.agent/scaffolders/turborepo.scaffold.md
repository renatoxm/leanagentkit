# Scaffolder: turborepo

- **Category:** monorepo
- **Kind:** cli
- **Stacks row:** Turborepo
- **Depends-on:** none
- **Chains-to:** next, react-vite, hono
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| example | Starter example | basic · kitchen-sink | basic | `--example {{value}}` |
| pm | Package manager | pnpm · npm · bun | pnpm | auto-detected by create-turbo |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npx create-turbo@latest {{dir}} --example {{example}}
```

**Flag compilation notes**

- `create-turbo` is non-interactive when `--example` is provided.
- Prefer `basic` for minimal footprint.

## Verify

- [ ] `turbo.json` or `turbo.jsonc` exists
- [ ] `apps/` and `packages/` directories exist
- [ ] Root `package.json` with `turbo` devDependency

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/turbo.md`, vendors turborepo skill).
- Scaffold apps inside monorepo via `Chains-to` recipes per package.
