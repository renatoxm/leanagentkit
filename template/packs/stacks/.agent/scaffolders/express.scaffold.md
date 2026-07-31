# Scaffolder: express

- **Category:** backend
- **Kind:** template
- **Stacks row:** Node / Express
- **Depends-on:** none
- **Chains-to:** PostgreSQL + Prisma, PostgreSQL + Drizzle
- **Verified:** 2026-07-06

## Questions

| id       | prompt                      | options          | default | → flag / param    | when                                   |
| -------- | --------------------------- | ---------------- | ------- | ----------------- | -------------------------------------- |
| name     | Package name                | `<name>`         | `api`   | `{{name}}`        |                                        |
| ts       | TypeScript?                 | yes · no         | yes     | `{{use_ts}}`      |                                        |
| eslint   | ESLint?                     | yes · no         | yes     | add lint deps     |                                        |
| prettier | Prettier?                   | yes · no         | yes     | add format deps   |                                        |
| pm       | Package manager             | pnpm · npm · bun | pnpm    | `{{pm}}`          |                                        |
| vscode   | VS Code workspace settings? | yes · no         | yes     | write `.vscode/*` | only if `eslint=yes` or `prettier=yes` |

## Files (template kind only)

### 1. create-file — `package.json`

```tpl
{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

> For `ts=no`, use `.js` entry, remove TypeScript devDeps, set `"dev": "node --watch src/index.js"`.

### 2. create-file — `src/index.ts`

```tpl
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
```

### 3. create-file — `tsconfig.json` (if ts=yes)

```tpl
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### 4. install-deps

```bash
{{pm}} install
```

### 5. optional — eslint (if eslint=yes)

```bash
{{pm}} add -D eslint @eslint/js typescript-eslint
```

> For `ts=no`: `{{pm}} add -D eslint @eslint/js` only.

Create `eslint.config.js` (if ts=yes):

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ["dist/**"] },
);
```

Create `eslint.config.js` (if ts=no):

```js
import js from "@eslint/js";

export default [js.configs.recommended, { ignores: ["dist/**"] }];
```

### 6. patch — `package.json` scripts (if eslint=yes)

```patch
"lint": "eslint src/"
```

### 7. optional — prettier (if prettier=yes)

```bash
{{pm}} add -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "tabWidth": 2 }
```

### 8. patch — `package.json` scripts (if prettier=yes)

```patch
"format": "prettier --write ."
```

When `eslint=yes`, replace `eslint.config.js` with prettier disabled (if ts=yes):

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  { ignores: ["dist/**"] },
);
```

When `eslint=yes` and `ts=no`:

```js
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  { ignores: ["dist/**"] },
];
```

## VS Code (only when vscode=yes)

When `eslint=yes`: copy `.agent/scaffolders/snippets/vscode/eslint-prettier.settings.json.tpl`
and `eslint-prettier.extensions.json` into `.vscode/`.
When `prettier=yes` and `eslint=no`: copy `prettier-only.settings.json.tpl` and
`prettier-only.extensions.json` into `.vscode/`.

## Verify

- [ ] `package.json` with `express`
- [ ] `src/index.ts` or `src/index.js` exists
- [ ] `{{pm}} run dev` starts without error
- [ ] When `eslint=yes`: `eslint.config.js` exists and `{{pm}} run lint` succeeds
- [ ] When `prettier=yes`: `.prettierrc` exists and `{{pm}} run format` works
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/express.md`).
- Offer `prisma` or `drizzle` via `Chains-to`.
