# Scaffolder: next

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Next.js
- **Depends-on:** none
- **Chains-to:** prisma, drizzle, tailwind
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| ts | TypeScript? | yes · no | yes | `--ts` / `--js` |
| tailwind | Tailwind CSS? | yes · no | yes | `--tailwind` / `--no-tailwind` |
| eslint | ESLint? | yes · no | yes | `--eslint` / `--no-eslint` |
| router | Router | App Router · Pages Router | App Router | `--app` / `--no-app` |
| src_dir | Use `src/` directory? | yes · no | yes | `--src-dir` / `--no-src-dir` |
| pm | Package manager | pnpm · npm · bun | pnpm | `--use-pnpm` / `--use-npm` / `--use-bun` |
| dir | Project directory | `.` (current) · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npx create-next-app@latest {{dir}} {{flags}}
```

**Flag compilation notes**

- Concatenate flags from: `ts`, `tailwind`, `eslint`, `router`, `src_dir`, `pm`.
- Always append `--import-alias "@/*"`.
- `create-next-app` accepts `--yes` via `CI=true`; do not omit resolved flags.

## Verify

- [ ] `package.json` exists with `next` dependency
- [ ] `next.config.*` exists
- [ ] `app/` (App Router) or `pages/` (Pages Router) exists
- [ ] `npm install` / `pnpm install` completes if generator used `--no-install` (re-run install)

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/nextjs.md`, updates memory).
- Offer `Chains-to`: prisma, drizzle, tailwind if user wants data layer or styling.
