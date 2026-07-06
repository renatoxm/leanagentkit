# Scaffolder: cloudflare

- **Category:** platform
- **Kind:** cli
- **Stacks row:** Cloudflare (Workers / Pages / Agents SDK)
- **Depends-on:** framework optional (can scaffold standalone Worker)
- **Chains-to:** none
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| platform | Platform | Workers · Pages | Workers | `--platform={{value}}` | |
| framework | Framework preset | hono · next · astro · svelte · none (plain worker) | hono | `--framework={{value}}` | |
| lang | Language | TypeScript · JavaScript | TypeScript | `--lang=ts` / `--lang=js` | |
| eslint | ESLint? | yes · no | yes | post-scaffold install | only if `lang=TypeScript` |
| prettier | Prettier? | yes · no | yes | post-scaffold install | only if `lang=TypeScript` |
| pm | Package manager | pnpm · npm · bun | pnpm | `{{pm}}` | |
| dir | Project directory | `<name>` · `.` (TTY only) | `worker` when kit-only; `.` when empty | `{{dir}}` | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if `eslint=yes` or `prettier=yes` |

## Command (cli kind only)

```bash
CI=true npm create cloudflare@latest {{dir}} -- --platform={{platform}} --framework={{framework}} --lang={{lang}} --yes
```

**Flag compilation notes**

- For plain Worker without framework preset, use `--framework=none` or documented equivalent.
- Always pass `--yes` after `--` for C3 non-interactive mode.
- Run `## Optional` steps only when `lang=TypeScript` and user opted in.
- Framework presets (next, astro, svelte) may ship their own lint — skip duplicate
  eslint/prettier post-steps when `eslint.config.*` already exists.
- **`dir=.` requires an empty directory** for greenfield C3 scaffolds. After
  `npm create lean-agent-kit .`, the repo is kit-only: C3 errors when the
  target is not empty. **Abort preflight** per `leanagentkit-scaffold` Step 5;
  default to a subdirectory (e.g. `worker`) or have the user run the compiled
  command in their own terminal at `.`. For adding Workers to an **existing app**,
  use `--template pre-existing` instead of this greenfield recipe.

## Optional — eslint (if eslint=yes and lang=TypeScript)

Skip if `eslint.config.*` already exists (framework preset).

```bash
cd {{dir}} && {{pm}} add -D eslint @eslint/js typescript-eslint
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ["dist", ".wrangler"],
});
```

Add `"lint": "eslint ."` to `package.json` scripts.

## Optional — prettier (if prettier=yes and lang=TypeScript)

```bash
cd {{dir}} && {{pm}} add -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "tabWidth": 2 }
```

Add `"format": "prettier --write ."` to `package.json` scripts.
When `eslint=yes`, append `eslint-config-prettier` to `eslint.config.js`.

## VS Code (only when vscode=yes)

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.*` into
`{{dir}}/.vscode/`.
When `prettier=yes` and `eslint=no`: copy `prettier-only.*` into `{{dir}}/.vscode/`.

## Verify

- [ ] `wrangler.toml` or `wrangler.jsonc` exists
- [ ] `package.json` includes `wrangler` or `@cloudflare/workers-types`
- [ ] `{{pm}} run dev` or `wrangler dev` documented in README/package scripts
- [ ] When `eslint=yes`: `eslint.config.js` exists
- [ ] When `prettier=yes`: `.prettierrc` exists
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/cloudflare.md`, installs Cloudflare skills).
