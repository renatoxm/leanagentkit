# Scaffolder: sveltekit

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Svelte / SvelteKit
- **Depends-on:** none
- **Chains-to:** Tailwind CSS v4, shadcn-svelte
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| template | Template | minimal · demo | minimal | `--template {{value}}` | |
| types | TypeScript | yes · no | yes | `--types ts` / `--types jsdoc` | |
| eslint | ESLint? | yes · no | yes | `--add eslint` | |
| prettier | Prettier? | yes · no | yes | `--add prettier` | |
| pm | Package manager | pnpm · npm · bun | pnpm | `--install {{pm}}` | |
| dir | Project directory | `.` (in-place) · `<name>` | `.` when kit-only; `web` when empty | `{{dir}}` | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if eslint=yes or prettier=yes |

## Command (cli kind only)

```bash
CI=true npx sv create {{dir}} --template {{template}} --types {{types_flag}} --install {{pm}} {{add_flags}} {{dir_check_flag}}
```

**Flag compilation notes**

- `types=yes` → `--types ts`; `types=no` → `--types jsdoc`.
- Build `{{add_flags}}`: if `eslint=yes` and/or `prettier=yes`, use
  `--add eslint prettier` (space-separated, only selected tools). If neither,
  use `--no-add-ons`.
- **`{{dir_check_flag}}`:** omit when `dir` is a new subdirectory or the repo is
  empty. When gate is **kit-only** and `dir=.`, append `--no-dir-check` so
  `sv create` scaffolds alongside kit files without an interactive empty-dir
  prompt (does not delete existing kit paths).
- **In-place risks:** `sv create` may still add or overwrite app files at the
  repo root (`package.json`, `README.md`, `svelte.config.*`, etc.). It does not
  remove `.agent/` or `docs/`, but review the tree after scaffold. Prefer
  subdirectory when you want kit and app trees fully separated.
- `sv create --add eslint` writes `.vscode/extensions.json` — handle in `## VS Code`.
- If `sv` version differs, prefer `CI=true` and pass all flags; abort if prompts appear.

## VS Code (only when vscode=yes)

1. Always copy `.agent/scaffolders/snippets/vscode/eslint-prettier.settings.json.tpl`
   → `{{dir}}/.vscode/settings.json` (or `prettier-only.settings.json.tpl` when
   `prettier=yes` and `eslint=no`).

2. For `extensions.json`:
   - If `{{dir}}/.vscode/extensions.json` **does not exist**: copy the matching
     snippet (`eslint-prettier.extensions.json` or `prettier-only.extensions.json`).
   - If it **exists** (from `sv add eslint`): **merge** — parse both JSON files,
     union `recommendations` arrays, dedupe by extension id, write back. Never
     remove ids that `sv` added.

## Verify

- [ ] `package.json` with `@sveltejs/kit` and `svelte`
- [ ] `svelte.config.js` or `svelte.config.ts` exists
- [ ] `src/routes/` exists
- [ ] When `eslint=yes`: `eslint.config.js` exists
- [ ] When `prettier=yes`: `.prettierrc` exists
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/svelte.md`, wires Svelte MCP).
- Offer `tailwind` then `shadcn-svelte` via `Chains-to`.
