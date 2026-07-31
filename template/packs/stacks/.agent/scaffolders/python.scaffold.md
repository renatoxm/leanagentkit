# Scaffolder: python

- **Category:** backend
- **Kind:** template
- **Stacks row:** Python
- **Depends-on:** none
- **Chains-to:** FastAPI, Django
- **Verified:** 2026-07-06

## Questions

| id     | prompt                      | options        | default | → flag / param           | when               |
| ------ | --------------------------- | -------------- | ------- | ------------------------ | ------------------ |
| tool   | Init tool                   | uv · venv only | uv      | `{{tool}}`               |                    |
| name   | Project name                | `<name>`       | `myapp` | `{{name}}`               |                    |
| ruff   | Ruff (lint + format)?       | yes · no       | yes     | add `[tool.ruff]` config |                    |
| vscode | VS Code workspace settings? | yes · no       | yes     | write `.vscode/*`        | only if `ruff=yes` |

## Files (template kind only)

### 1. init (tool=uv)

```bash
uv init {{name}}
cd {{name}}
```

### 2. init (tool=venv only)

```bash
mkdir -p {{name}} && cd {{name}}
python -m venv .venv
```

### 3a. patch — `pyproject.toml` (tool=uv, if ruff=yes)

Append to the `uv init` output:

```toml
[project.optional-dependencies]
dev = ["ruff"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.ruff.format]
quote-style = "double"
```

```bash
uv sync --extra dev
```

### 3b. create-file — `pyproject.toml` (tool=venv only)

```tpl
[project]
name = "{{name}}"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = []
```

### 4. optional — ruff (tool=venv only, if ruff=yes)

Patch `pyproject.toml`:

```toml
[project.optional-dependencies]
dev = ["ruff"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.ruff.format]
quote-style = "double"
```

```bash
.venv/bin/pip install ruff
```

### 5. create-file — `.gitignore`

```tpl
.venv/
__pycache__/
*.py[cod]
.env
dist/
.ruff_cache/
```

## VS Code (only when vscode=yes)

Copy `.agent/scaffolders/snippets/vscode/ruff.settings.json.tpl` → `.vscode/settings.json`
Copy `.agent/scaffolders/snippets/vscode/ruff.extensions.json` → `.vscode/extensions.json`

## Verify

- [ ] `pyproject.toml` exists (uv) or `.venv/` exists (venv)
- [ ] `python --version` meets `requires-python`
- [ ] When `ruff=yes`: `ruff check .` succeeds
- [ ] When `ruff=no`: no `[tool.ruff]` section
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/python.md`).
- Offer `fastapi` or `django` via `Chains-to`.
