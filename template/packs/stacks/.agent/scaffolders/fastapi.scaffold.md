# Scaffolder: fastapi

- **Category:** backend
- **Kind:** template
- **Stacks row:** FastAPI
- **Depends-on:** none
- **Chains-to:** none
- **Verified:** 2026-07-06

> Requires a Python 3.12+ runtime. Does **not** require running the Python base
> scaffolder first — this recipe writes a standalone app at the repo root (or
> target directory).

## Questions

| id     | prompt                      | options            | default     | → flag / param           | when               |
| ------ | --------------------------- | ------------------ | ----------- | ------------------------ | ------------------ |
| name   | Project name                | `<name>`           | `api`       | `{{name}}`               |                    |
| layout | Project layout              | flat · src package | src package | `{{layout}}`             |                    |
| pm     | Python env tool             | uv · pip/venv      | uv          | `{{pm}}`                 |                    |
| ruff   | Ruff (lint + format)?       | yes · no           | yes         | add `[tool.ruff]` config |                    |
| vscode | VS Code workspace settings? | yes · no           | yes         | write `.vscode/*`        | only if `ruff=yes` |

**Parameter derivation:** `name_snake` = lowercase `{{name}}` with non-alphanumeric
characters replaced by `_` (e.g. `my-api` → `my_api`).

## If chaining after Python base

When the user ran the Python base scaffolder first (`uv init {{name}}` creates
`./{{name}}/`), run all FastAPI file steps **inside that subdirectory** (`cd
{{name}}` before install-deps and file writes). Do not write at repo root.

## Files (template kind only)

### 1a. create-file — `pyproject.toml` (if ruff=yes)

```tpl
[project]
name = "{{name}}"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.32.0",
]

[project.optional-dependencies]
dev = ["pytest", "httpx", "ruff"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.ruff.format]
quote-style = "double"
```

### 1b. create-file — `pyproject.toml` (if ruff=no)

```tpl
[project]
name = "{{name}}"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.32.0",
]

[project.optional-dependencies]
dev = ["pytest", "httpx"]
```

### 2. create-file — `src/{{name_snake}}/main.py` (src layout)

```tpl
from fastapi import FastAPI

app = FastAPI(title="{{name}}")


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}
```

> For `layout=flat`, use `main.py` at project root instead.

### 3. install-deps

```bash
uv sync
```

> Or `python -m venv .venv && pip install -e ".[dev]"` when `pm=pip/venv`.

### 4. optional — ruff scripts (if ruff=yes)

Add to `pyproject.toml` under `[project.scripts]` or document in README:

```bash
uv run ruff check .
uv run ruff format .
```

### 6. create-file — `README.md` snippet (dev command)

```tpl
uv run uvicorn {{name_snake}}.main:app --reload
```

## VS Code (only when vscode=yes)

Copy `.agent/scaffolders/snippets/vscode/ruff.settings.json.tpl` → `.vscode/settings.json`
Copy `.agent/scaffolders/snippets/vscode/ruff.extensions.json` → `.vscode/extensions.json`

## Verify

- [ ] `pyproject.toml` with `fastapi`
- [ ] App imports: `from {{name_snake}}.main import app`
- [ ] `uv run uvicorn ...` serves `/health`
- [ ] When `ruff=yes`: `uv run ruff check .` succeeds; `[tool.ruff]` present
- [ ] When `ruff=no`: no `[tool.ruff]` section and `ruff` not in dev deps
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/fastapi.md`).
