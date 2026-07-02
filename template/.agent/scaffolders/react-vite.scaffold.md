# Scaffolder: react-vite

- **Category:** framework
- **Kind:** cli
- **Stacks row:** React
- **Depends-on:** none
- **Chains-to:** tailwind
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| variant | Language | TypeScript · JavaScript | TypeScript | `--template react-ts` / `react` |
| pm | Package manager | pnpm · npm · bun | pnpm | used for follow-up install |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npm create vite@latest {{dir}} -- --template {{variant_template}}
```

**Flag compilation notes**

- `variant` maps to Vite template: `react-ts` or `react`.
- Vite create is non-interactive when template is passed.
- After generation, run `{{pm}} install` in `{{dir}}`.

## Verify

- [ ] `package.json` with `react` and `vite`
- [ ] `vite.config.ts` or `vite.config.js` exists
- [ ] `src/main.tsx` or `src/main.jsx` exists

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/react.md`).
- Offer `tailwind` via `Chains-to`.
