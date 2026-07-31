# Scaffolder: prisma

- **Category:** orm
- **Kind:** cli
- **Stacks row:** PostgreSQL + Prisma
- **Depends-on:** Node/TS app (package.json)
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id       | prompt            | options                     | default    | → flag / param                    |
| -------- | ----------------- | --------------------------- | ---------- | --------------------------------- |
| provider | Database provider | postgresql · mysql · sqlite | postgresql | `--datasource-provider {{value}}` |
| pm       | Package manager   | pnpm · npm · bun            | pnpm       | for install step                  |

## Command (cli kind only)

```bash
{{pm}} add -D prisma
{{pm}} add @prisma/client
CI=true npx prisma init --datasource-provider {{provider}}
```

**Flag compilation notes**

- Run in project root (occupied repo). `prisma init` is non-interactive with `--datasource-provider`.
- Do not run on empty dir without a `package.json` — satisfy `Depends-on` first.

## Verify

- [ ] `prisma/schema.prisma` exists
- [ ] `.env` or `.env.example` with `DATABASE_URL`
- [ ] `@prisma/client` and `prisma` in `package.json`

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/prisma.md`).
- Remind user to set `DATABASE_URL` and run `npx prisma migrate dev`.
