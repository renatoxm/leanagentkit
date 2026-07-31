# Scaffolder: tailwind

- **Category:** ui
- **Kind:** template
- **Stacks row:** Tailwind CSS v4
- **Depends-on:** JS/TS app (Vite, Next, SvelteKit, Astro, etc.)
- **Chains-to:** shadcn-svelte
- **Verified:** 2026-07-02

## Questions

| id      | prompt              | options                          | default | → flag / param |
| ------- | ------------------- | -------------------------------- | ------- | -------------- |
| bundler | Bundler integration | vite · postcss · none (css only) | vite    | `{{bundler}}`  |
| pm      | Package manager     | pnpm · npm · bun                 | pnpm    | `{{pm}}`       |

## Files (template kind only)

### 1. install-deps (vite bundler)

```bash
{{pm}} add tailwindcss @tailwindcss/vite
```

### 2. patch — `vite.config.ts` (if bundler=vite)

```patch
import tailwindcss from "@tailwindcss/vite";
// add to plugins: [tailwindcss()]
```

### 3. create-file or patch — main CSS entry (e.g. `src/app.css`)

```tpl
@import "tailwindcss";
```

### 4. install-deps (postcss bundler)

```bash
{{pm}} add tailwindcss @tailwindcss/postcss
```

Create `postcss.config.mjs`:

```tpl
export default { plugins: { "@tailwindcss/postcss": {} } };
```

## Verify

- [ ] `tailwindcss` v4.x in `package.json`
- [ ] `@import "tailwindcss"` in a CSS file imported by the app
- [ ] Build or dev server runs without Tailwind errors

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/tailwind.md`, REQUIRED docs-snapshot sync post-install).
- Offer `shadcn-svelte` if SvelteKit is detected.
