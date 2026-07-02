# Scaffolder: express

- **Category:** backend
- **Kind:** template
- **Stacks row:** Node / Express
- **Depends-on:** none
- **Chains-to:** prisma, drizzle
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| ts | TypeScript? | yes · no | yes | `{{use_ts}}` |
| eslint | ESLint + Prettier? | yes · no | yes | add lint deps |
| pm | Package manager | pnpm · npm · bun | pnpm | `{{pm}}` |

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
    "build": "tsc",
    "lint": "eslint src/"
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
{{pm}} add -D eslint @eslint/js typescript-eslint prettier eslint-config-prettier
```

Create `eslint.config.js` with flat config for TypeScript.

## Verify

- [ ] `package.json` with `express`
- [ ] `src/index.ts` or `src/index.js` exists
- [ ] `{{pm}} run dev` starts without error

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/express.md`).
- Offer `prisma` or `drizzle` via `Chains-to`.
