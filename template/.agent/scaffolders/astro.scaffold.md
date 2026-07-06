# Scaffolder: astro

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Astro
- **Depends-on:** none
- **Chains-to:** tailwind, cloudflare
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| template | Starter template | minimal · basics · blog | minimal | `--template {{value}}` | |
| ts | TypeScript strictness | strict · relaxed · none | strict | `--typescript strict` / `relaxed` / `false` | |
| eslint | ESLint? | yes · no | yes | post-scaffold install | |
| prettier | Prettier? | yes · no | yes | post-scaffold install | |
| install | Install dependencies now? | yes · no | yes | omit `--install none` / `--install none` | |
| git | Initialize git? | yes · no | no | omit `--git false` / `--git false` | |
| pm | Package manager | pnpm · npm · bun | pnpm | `{{pm}}` | |
| dir | Project directory | `<name>` · `.` (TTY only) | `web` when kit-only; `.` when empty | `{{dir}}` | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if `eslint=yes` or `prettier=yes` |

## Command (cli kind only)

```bash
CI=true npm create astro@latest {{dir}} -- {{flags}} --yes
```

**Flag compilation notes**

- Pass flags after `--` to the Astro CLI.
- For non-interactive: always include `--yes`.
- Template: `--template minimal|basics|blog`.
- TypeScript: `--typescript strict|relaxed|false`.
- Run `## Optional` steps after CLI when user opted in.
- **`dir=.` requires an empty directory** (aside from a small allowlist like
  `.git`). After `npm create lean-agent-kit .`, the repo is kit-only:
  `create-astro` re-prompts for a new directory when the target is not empty —
  it will **block** in a non-TTY agent shell. **Abort preflight** per
  `leanagentkit-scaffold` Step 5; default to a subdirectory (e.g. `web`) or
  have the user run the compiled command in their own terminal at `.`.

## Optional — eslint (if eslint=yes, ts≠none)

```bash
cd {{dir}} && {{pm}} add -D eslint @eslint/js typescript-eslint eslint-plugin-astro globals
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  { ignores: ["dist/**"] },
];
```

## Optional — eslint (if eslint=yes, ts=none)

```bash
cd {{dir}} && {{pm}} add -D eslint @eslint/js eslint-plugin-astro globals
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  { ignores: ["dist/**"] },
];
```

Add `"lint": "eslint ."` to `package.json` scripts (both variants).

## Optional — prettier (if prettier=yes)

```bash
cd {{dir}} && {{pm}} add -D prettier eslint-config-prettier prettier-plugin-astro
```

Create `.prettierrc`:

```json
{ "plugins": ["prettier-plugin-astro"] }
```

Add `"format": "prettier --write ."` to `package.json` scripts.
When `eslint=yes`, append `eslint-config-prettier` to `eslint.config.js`.

## VS Code (only when vscode=yes)

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.*` into
`{{dir}}/.vscode/`.
When `prettier=yes` and `eslint=no`: copy `prettier-only.*` into `{{dir}}/.vscode/`.

## Verify

- [ ] `astro.config.mjs` or `astro.config.ts` exists
- [ ] `package.json` includes `astro`
- [ ] `src/pages/` or `src/` with at least one route
- [ ] When `eslint=yes`: `eslint.config.js` exists
- [ ] When `prettier=yes`: `.prettierrc` exists
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/astro.md`, may copy Astro skills via degit).
- Offer `tailwind` or `cloudflare` adapter via `Chains-to`.
