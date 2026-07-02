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

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| `<id>` | `<question>` | `<opt-a>` · `<opt-b>` | `<default>` | `<flag or {{param}}>` |

## Command (cli kind only)

> Every answer must map to a flag. Never run without resolving all prompts.

```bash
CI=true <package-manager> create <generator> {{dir}} {{flags}} --yes
```

**Flag compilation notes**

- `<how answers map to flags>`

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

## Verify

- [ ] `<expected file or dir exists>`
- [ ] `<install / typecheck / import succeeds>`

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/<name>.md`, updates memory).
- Optional: offer `leanagentkit-bootstrap` on greenfield if memory not yet set up.
