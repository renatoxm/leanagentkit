# Scaffolder: fastapi

- **Category:** backend
- **Kind:** template
- **Stacks row:** FastAPI
- **Depends-on:** python
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| layout | Project layout | flat · src package | src package | `{{layout}}` |
| pm | Python env tool | uv · pip/venv | uv | `{{pm}}` |

## Files (template kind only)

### 1. create-file — `pyproject.toml`

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

### 4. create-file — `README.md` snippet (dev command)

```tpl
uv run uvicorn {{name_snake}}.main:app --reload
```

## Verify

- [ ] `pyproject.toml` with `fastapi`
- [ ] App imports: `from {{name_snake}}.main import app`
- [ ] `uv run uvicorn ...` serves `/health`

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/fastapi.md`).
