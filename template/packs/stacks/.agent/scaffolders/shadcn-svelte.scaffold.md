# Scaffolder: shadcn-svelte

- **Category:** ui
- **Kind:** cli
- **Stacks row:** shadcn-svelte (UI components)
- **Depends-on:** SvelteKit + Tailwind v4
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id         | prompt          | options                               | default | → flag / param                           |
| ---------- | --------------- | ------------------------------------- | ------- | ---------------------------------------- |
| base_color | Base color      | slate · zinc · stone · gray · neutral | slate   | `--base-color {{value}}`                 |
| css        | CSS variables   | yes · no                              | yes     | `--css-variables` / `--no-css-variables` |
| pm         | Package manager | pnpm · npm · bun                      | pnpm    | for install                              |

## Command (cli kind only)

```bash
CI=true npx shadcn-svelte@latest init --base-color {{base_color}} {{css_flag}} --no-deps
```

**Flag compilation notes**

- `css=yes` → `--css-variables`; `css=no` → `--no-css-variables`.
- Run only when SvelteKit and Tailwind v4 are already present (`Depends-on`).
- After init, run `{{pm}} install` to install declared dependencies.

## Verify

- [ ] `components.json` exists (shadcn-svelte config)
- [ ] `$lib/components/ui/` or configured components path exists
- [ ] `bits-ui` or related deps in `package.json` after install

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/shadcn-svelte.md`, installs shadcn skill).
