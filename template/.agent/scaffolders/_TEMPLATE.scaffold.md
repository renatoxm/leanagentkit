# Scaffolder: <name>

> Frozen recipe for scaffolding one stack item. Consumed by `leanagentkit-scaffold`.
> Must have a matching row in `.agent/stacks/registry.md` (parity check).

- **Category:** framework | backend | orm | ui | platform | monorepo
- **Kind:** cli | template
- **Stacks row:** <exact heading in stacks/registry.md>
- **Depends-on:** <items that must exist first, or `none`>
- **Chains-to:** <optional follow-on recipes, or `none`>
- **Verified:** <!-- YYYY-MM-DD -->

## Questions

> One at a time; each with a recommended default. Use host multiple-choice UI.
> **Do not add tooling questions unless this recipe can install them
> non-interactively.** Additive scaffolds (ORM, UI) inherit base-app tooling.

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| `<id>` | `<question>` | `<opt-a>` · `<opt-b>` | `<default>` | `<flag or {{param}}>` | |
| `eslint` | ESLint? | yes · no | yes | post-scaffold install | JS/TS only |
| `prettier` | Prettier? | yes · no | yes | post-scaffold install | optional: only if `eslint=yes` |
| `ruff` | Ruff (lint + format)? | yes · no | yes | post-scaffold install | Python only |
| `golangci` | golangci-lint? | yes · no | yes | post-scaffold install | Go only |
| `vscode` | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if recipe has `## VS Code` |

## Command (cli kind only)

> Every answer must map to a flag. Never run without resolving all prompts.

```bash
CI=true <package-manager> create <generator> {{dir}} {{flags}} --yes
```

**Flag compilation notes**

- `<how answers map to flags>`
- If the recipe uses `dir=.`, document whether the generator supports non-empty
  targets. After `npm create lean-agent-kit .`, prefer subdirectory default or
  TTY-only for `dir=.` — see `leanagentkit-scaffold` Step 2 (kit-only) and Step 5
  (preflight).
- Run `## Optional — <tool>` steps after CLI when user opted in.
- Run `## VS Code` when `vscode=yes` and generator did not create `.vscode/`.

## Files (template kind only)

> Ordered steps. Parameterize with `{{name}}`, `{{provider}}`, etc.

### 1. create-file — `<path>`

```tpl
<file contents>
```

### 2. install-deps

```bash
<non-interactive install command>
```

### 3. patch — edit `<file>` at `<anchor>`

```patch
<lines to insert>
```

## Optional — eslint (if eslint=yes)

```bash
{{pm}} add -D eslint @eslint/js typescript-eslint
```

Create `eslint.config.js` (flat config). Add `"lint": "eslint ."` to `package.json`.

## Optional — prettier (if prettier=yes)

```bash
{{pm}} add -D prettier eslint-config-prettier
```

Create `.prettierrc` and add `"format": "prettier --write ."` to `package.json`.
Extend `eslint.config.js` with `eslint-config-prettier` when `eslint=yes`.

## Optional — ruff (if ruff=yes)

Add `ruff` to dev dependencies and `[tool.ruff]` to `pyproject.toml`.
Add scripts: `"lint": "ruff check ."`, `"format": "ruff format ."`.

## Optional — golangci-lint (if golangci=yes)

Create `.golangci.yml` and add `"lint": "golangci-lint run ./..."` to Makefile or scripts.

## VS Code (only when vscode=yes)

> Copy from `.agent/scaffolders/snippets/vscode/` (kit root). Skip if the
> generator already wrote `.vscode/` (e.g. SvelteKit eslint add-on).

### create-file — `.vscode/settings.json`

- `eslint=yes` → `eslint-prettier.settings.json.tpl`
- `prettier=yes` without eslint → `prettier-only.settings.json.tpl`
- Python → `ruff.settings.json.tpl`
- Go → `go.settings.json.tpl`

### create-file — `.vscode/extensions.json`

Matching `*.extensions.json` for the snippet set above. When merging with an
existing file, union `recommendations` and dedupe by extension id.

## Verify

- [ ] `<expected file or dir exists>`
- [ ] `<install / typecheck / import succeeds>`
- [ ] When lint opted in: config file exists and lint command succeeds
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/<name>.md`, updates memory).
- Optional: offer `leanagentkit-bootstrap` on greenfield if memory not yet set up.
