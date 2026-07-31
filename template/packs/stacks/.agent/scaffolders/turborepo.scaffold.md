# Scaffolder: turborepo

- **Category:** monorepo
- **Kind:** cli
- **Stacks row:** Turborepo
- **Depends-on:** none
- **Chains-to:** Next.js, React (Vite), Hono
- **Verified:** 2026-07-06

## Questions

| id      | prompt                      | options                   | default                                  | → flag / param                | when |
| ------- | --------------------------- | ------------------------- | ---------------------------------------- | ----------------------------- | ---- |
| example | Starter example             | basic · kitchen-sink      | basic                                    | `--example {{value}}`         |      |
| pm      | Package manager             | pnpm · npm · bun          | pnpm                                     | auto-detected by create-turbo |
| dir     | Project directory           | `<name>` · `.` (TTY only) | `monorepo` when kit-only; `.` when empty | `{{dir}}`                     |      |
| vscode  | VS Code workspace settings? | yes · no                  | yes                                      | write `.vscode/*`             |      |

> **Note:** Both `basic` and `kitchen-sink` examples ship ESLint + Prettier
> (`packages/eslint-config`, root Prettier). No separate lint questions.

## Command (cli kind only)

```bash
CI=true npx create-turbo@latest {{dir}} --example {{example}}
```

**Flag compilation notes**

- `create-turbo` is non-interactive when `--example` is provided.
- Prefer `basic` for minimal footprint.
- ESLint and Prettier are included in the starter — do not add duplicate configs.
- **`dir=.` requires an empty directory.** After `npm create lean-agent-kit .`,
  the repo is kit-only: `create-turbo` exits when conflicting files exist (no
  non-interactive bypass). **Abort preflight** per `leanagentkit-scaffold`
  Step 5; default to a subdirectory (e.g. `monorepo`) or have the user run the
  compiled command in their own terminal at `.`.

## VS Code (only when vscode=yes)

Copy `.agent/scaffolders/snippets/vscode/eslint-prettier.settings.json.tpl` →
`{{dir}}/.vscode/settings.json` and `eslint-prettier.extensions.json` →
`{{dir}}/.vscode/extensions.json`.

## Verify

- [ ] `turbo.json` or `turbo.jsonc` exists
- [ ] `apps/` and `packages/` directories exist
- [ ] Root `package.json` with `turbo` devDependency
- [ ] `packages/eslint-config` or equivalent ESLint package exists
- [ ] Root or workspace `lint` script runs (`{{pm}} run lint` or `turbo run lint`)
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/turbo.md`, vendors turborepo skill).
- Scaffold apps inside monorepo via `Chains-to` recipes per package.
