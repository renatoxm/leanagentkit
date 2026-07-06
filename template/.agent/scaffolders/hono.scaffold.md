# Scaffolder: hono

- **Category:** backend
- **Kind:** cli
- **Stacks row:** Hono
- **Depends-on:** none
- **Chains-to:** cloudflare, prisma, drizzle
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| template | Runtime template | nodejs · cloudflare-workers · cloudflare-pages · bun | nodejs | `--template {{value}}` | |
| eslint | ESLint? | yes · no | yes | post-scaffold install | |
| prettier | Prettier? | yes · no | yes | post-scaffold install | |
| pm | Package manager | pnpm · npm · bun | pnpm | `--pm {{value}}` | |
| install | Install dependencies? | yes · no | yes | omit `--install false` / `--install false` | |
| dir | Project directory | `<name>` · `.` (TTY only) | `api` when kit-only; `.` when empty | `{{dir}}` | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if `eslint=yes` or `prettier=yes` |

## Command (cli kind only)

```bash
CI=true npm create hono@latest {{dir}} -- {{flags}}
```

**Flag compilation notes**

- Pass `--template`, `--pm`, and optionally `--install false` after `--`.
- `CI=true` suppresses remaining prompts when template is set.
- Map `--pm` value to `{{pm}}` for post-scaffold installs.
- Run `## Optional` steps after CLI when user opted in.
- **`dir=.` requires an empty directory.** After `npm create lean-agent-kit .`,
  the repo is **kit-only** (not empty): `create-hono` still prompts
  interactively — “Directory not empty. Continue?” — with **no** `--force` flag
  ([create-hono#61](https://github.com/honojs/create-hono/issues/61)). In an
  agent/non-TTY shell, **abort preflight** per `leanagentkit-scaffold` Step 5;
  default to a subdirectory (e.g. `api`) or have the user run the compiled
  command in their own terminal at `.` and answer the prompt manually.

## Optional — eslint (if eslint=yes)

```bash
cd {{dir}} && {{pm}} add -D eslint @hono/eslint-config
```

Create `eslint.config.js`:

```js
import baseConfig from "@hono/eslint-config";

export default [...baseConfig];
```

Add `"lint": "eslint ."` to `package.json` scripts.

## Optional — prettier (if prettier=yes)

```bash
cd {{dir}} && {{pm}} add -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "tabWidth": 2 }
```

Add `"format": "prettier --write ."` to `package.json` scripts.
When `eslint=yes`, append `eslint-config-prettier` to `eslint.config.js` export.

## VS Code (only when vscode=yes)

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.*` into
`{{dir}}/.vscode/`.
When `prettier=yes` and `eslint=no`: copy `prettier-only.*` into `{{dir}}/.vscode/`.

## Verify

- [ ] `package.json` with `hono`
- [ ] Entry file exists (`src/index.ts` or template-specific path)
- [ ] Dev script runs (`{{pm}} run dev` or documented equivalent)
- [ ] When `eslint=yes`: `eslint.config.js` exists
- [ ] When `prettier=yes`: `.prettierrc` exists
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/hono.md`, post-install `@hono/cli`).
- Offer `cloudflare`, `prisma`, or `drizzle` via `Chains-to`.
