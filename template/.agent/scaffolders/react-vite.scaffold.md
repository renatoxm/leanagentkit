# Scaffolder: react-vite

- **Category:** framework
- **Kind:** cli
- **Stacks row:** React
- **Depends-on:** none
- **Chains-to:** Tailwind CSS v4
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| variant | Language | TypeScript · JavaScript | TypeScript | `--template react-ts` / `react` | |
| eslint | ESLint? | yes · no | yes | post-scaffold install | |
| prettier | Prettier? | yes · no | yes | post-scaffold install | |
| pm | Package manager | pnpm · npm · bun | pnpm | `{{pm}}` | |
| dir | Project directory | `<name>` · `.` (TTY only) | `web` when kit-only; `.` when empty | `{{dir}}` | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if `eslint=yes` or `prettier=yes` |

## Command (cli kind only)

```bash
CI=true npm create vite@latest {{dir}} -- --template {{variant_template}} --no-interactive
```

**Flag compilation notes**

- `variant` maps to Vite template: `react-ts` or `react`.
- Always pass `--no-interactive` so the CLI does not prompt in agent shells.
- Vite create is non-interactive when template and `--no-interactive` are set.
- After generation, run `{{pm}} install` in `{{dir}}`.
- Run `## Optional` steps when user opted in.
- **`dir=.` on a non-empty directory** prompts to remove existing files. After
  `npm create lean-agent-kit .`, the repo is kit-only — **never** pass
  `--overwrite` (it would delete kit files). **Abort preflight** per
  `leanagentkit-scaffold` Step 5; default to a subdirectory (e.g. `web`) or
  have the user run the compiled command in their own terminal at `.`.

## Optional — eslint (if eslint=yes, variant=TypeScript)

```bash
cd {{dir}} && {{pm}} add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  }
);
```

## Optional — eslint (if eslint=yes, variant=JavaScript)

```bash
cd {{dir}} && {{pm}} add -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    ...js.configs.recommended,
    files: ["**/*.{js,jsx}"],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
```

Add `"lint": "eslint ."` to `package.json` scripts (both variants).

## Optional — prettier (if prettier=yes)

```bash
cd {{dir}} && {{pm}} add -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "tabWidth": 2 }
```

Add `"format": "prettier --write ."` to `package.json` scripts.
When `eslint=yes`, append `eslintConfigPrettier` to `eslint.config.js` export.

## VS Code (only when vscode=yes)

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.*` into
`{{dir}}/.vscode/`.
When `prettier=yes` and `eslint=no`: copy `prettier-only.*` into `{{dir}}/.vscode/`.

## Verify

- [ ] `package.json` with `react` and `vite`
- [ ] `vite.config.ts` or `vite.config.js` exists
- [ ] `src/main.tsx` or `src/main.jsx` exists
- [ ] When `eslint=yes`: `eslint.config.js` exists and `{{pm}} run lint` succeeds
- [ ] When `prettier=yes`: `.prettierrc` exists
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/react.md`).
- Offer `tailwind` via `Chains-to`.
