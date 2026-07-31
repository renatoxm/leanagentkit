# Scaffolder: next

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Next.js
- **Depends-on:** none
- **Chains-to:** PostgreSQL + Prisma, PostgreSQL + Drizzle, Tailwind CSS v4
- **Verified:** 2026-07-06

## Questions

| id       | prompt                      | options                   | default                             | → flag / param                           | when                                   |
| -------- | --------------------------- | ------------------------- | ----------------------------------- | ---------------------------------------- | -------------------------------------- |
| ts       | TypeScript?                 | yes · no                  | yes                                 | `--ts` / `--js`                          |                                        |
| tailwind | Tailwind CSS?               | yes · no                  | yes                                 | `--tailwind` / `--no-tailwind`           |                                        |
| eslint   | ESLint?                     | yes · no                  | yes                                 | `--eslint` / `--no-eslint`               |                                        |
| prettier | Prettier?                   | yes · no                  | yes                                 | post-scaffold install                    | only if `eslint=yes`                   |
| router   | Router                      | App Router · Pages Router | App Router                          | `--app` / `--no-app`                     |                                        |
| src_dir  | Use `src/` directory?       | yes · no                  | yes                                 | `--src-dir` / `--no-src-dir`             |                                        |
| pm       | Package manager             | pnpm · npm · bun          | pnpm                                | `--use-pnpm` / `--use-npm` / `--use-bun` |                                        |
| dir      | Project directory           | `<name>` · `.` (TTY only) | `web` when kit-only; `.` when empty | `{{dir}}`                                |                                        |
| vscode   | VS Code workspace settings? | yes · no                  | yes                                 | write `.vscode/*`                        | only if `eslint=yes` or `prettier=yes` |

## Command (cli kind only)

```bash
CI=true npx create-next-app@latest {{dir}} {{flags}}
```

**Flag compilation notes**

- Concatenate flags from: `ts`, `tailwind`, `eslint`, `router`, `src_dir`, `pm`.
- Always append `--import-alias "@/*"`.
- `create-next-app` accepts `--yes` via `CI=true`; do not omit resolved flags.
- Map `pm` answer to `{{pm_cmd}}` for post-scaffold installs: `pnpm` → `pnpm`,
  `npm` → `npm`, `bun` → `bun` (do **not** pass `--use-pnpm` to install commands).
- **`dir=.` requires an empty directory.** After `npm create lean-agent-kit .`,
  the repo is kit-only: `create-next-app` exits when the folder is not empty
  (no non-interactive bypass). **Abort preflight** per `leanagentkit-scaffold`
  Step 5; default to a subdirectory (e.g. `web`) or have the user run the
  compiled command in their own terminal at `.`.

## Optional — prettier (if prettier=yes and eslint=yes)

```bash
cd {{dir}} && {{pm_cmd}} add -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Patch `eslint.config.mjs` — append flat-config entry:

```js
import eslintConfigPrettier from "eslint-config-prettier";
// add eslintConfigPrettier as the last element of the export array
```

Add to `package.json` scripts: `"format": "prettier --write ."`

## VS Code (only when vscode=yes)

Skip if `.vscode/` already exists.

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.settings.json.tpl`
→ `{{dir}}/.vscode/settings.json` and `eslint-prettier.extensions.json` →
`{{dir}}/.vscode/extensions.json`.

## Verify

- [ ] `package.json` exists with `next` dependency
- [ ] `next.config.*` exists
- [ ] `app/` (App Router) or `pages/` (Pages Router) exists
- [ ] `{{pm_cmd}} install` completes if generator used `--no-install` (re-run install)
- [ ] When `eslint=yes`: ESLint config exists
- [ ] When `prettier=yes`: `.prettierrc` exists and `{{pm_cmd}} run format` works
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/nextjs.md`, updates memory).
- Offer `Chains-to`: prisma, drizzle, tailwind if user wants data layer or styling.
