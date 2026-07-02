# Scaffolder: sveltekit

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Svelte / SvelteKit
- **Depends-on:** none
- **Chains-to:** tailwind, shadcn-svelte
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| template | Template | minimal · demo | minimal | `--template {{value}}` |
| types | TypeScript | yes · no | yes | `--types ts` / `--types jsdoc` |
| pm | Package manager | pnpm · npm · bun | pnpm | `--install {{pm}}` |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npx sv create {{dir}} --template {{template}} --types {{types_flag}} --install {{pm}} --no-add-ons
```

**Flag compilation notes**

- `types=yes` → `--types ts`; `types=no` → `--types jsdoc`.
- `--no-add-ons` skips interactive add-on prompts (Tailwind via separate recipe).
- If `sv` version differs, prefer `CI=true` and pass all flags; abort if prompts appear.

## Verify

- [ ] `package.json` with `@sveltejs/kit` and `svelte`
- [ ] `svelte.config.js` or `svelte.config.ts` exists
- [ ] `src/routes/` exists

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/svelte.md`, wires Svelte MCP).
- Offer `tailwind` then `shadcn-svelte` via `Chains-to`.
