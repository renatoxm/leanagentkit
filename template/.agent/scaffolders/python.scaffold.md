# Scaffolder: python

- **Category:** backend
- **Kind:** template
- **Stacks row:** Python
- **Depends-on:** none
- **Chains-to:** fastapi, django
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| tool | Init tool | uv · venv only | uv | `{{tool}}` |
| name | Project name | `<name>` | `myapp` | `{{name}}` |

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

### 3. create-file — `pyproject.toml` (venv only)

```tpl
[project]
name = "{{name}}"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = []
```

### 4. create-file — `.gitignore`

```tpl
.venv/
__pycache__/
*.py[cod]
.env
dist/
```

## Verify

- [ ] `pyproject.toml` exists (uv) or `.venv/` exists (venv)
- [ ] `python --version` meets `requires-python`

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/python.md`).
- Offer `fastapi` or `django` via `Chains-to`.
