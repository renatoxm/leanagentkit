# Scaffolder: django

- **Category:** backend
- **Kind:** cli
- **Stacks row:** Django
- **Depends-on:** none
- **Chains-to:** none
- **Verified:** 2026-07-06

## Questions

| id | prompt | options | default | → flag / param | when |
|----|--------|---------|---------|----------------|------|
| name | Project name | `<project_name>` | `config` | `{{name}}` | |
| layout | Layout | subdirectory · current directory (TTY only) | subdirectory when kit-only; current directory when empty | `.` / `{{name}}/` | |
| ruff | Ruff (lint + format)? | yes · no | yes | post-scaffold install | |
| vscode | VS Code workspace settings? | yes · no | yes | write `.vscode/*` | only if `ruff=yes` |

## Command (cli kind only)

```bash
django-admin startproject {{name}} {{layout}}
```

**Flag compilation notes**

- Requires Python with Django installed (`pip install django` or active venv).
- `layout=current directory` → `django-admin startproject {{name}} .` (**empty dir
  only** — fails when kit files or other content exist). **Abort preflight** per
  `leanagentkit-scaffold` Step 5 when gate is kit-only.
- `layout=subdirectory` → `django-admin startproject {{name}}` creates
  `./{{name}}/` (recommended after `npm create lean-agent-kit .`).
- Non-interactive when project name and path are provided.
- Run `## Optional — ruff` after project creation when user opted in.

## Optional — ruff (if ruff=yes)

Create `pyproject.toml` at project root (if not present):

```toml
[project]
name = "{{name}}"
requires-python = ">=3.12"

[project.optional-dependencies]
dev = ["ruff"]

[tool.ruff]
line-length = 100
target-version = "py312"
extend-exclude = ["*/migrations/*"]

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.ruff.format]
quote-style = "double"
```

Install into the project venv (never system-wide):

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install ruff
# or: uv venv && uv pip install ruff
```

Add to `Makefile` or document:

```bash
.venv/bin/ruff check .
.venv/bin/ruff format .
```

## VS Code (only when vscode=yes)

Copy `.agent/scaffolders/snippets/vscode/ruff.settings.json.tpl` → `.vscode/settings.json`
Copy `.agent/scaffolders/snippets/vscode/ruff.extensions.json` → `.vscode/extensions.json`

## Verify

- [ ] `manage.py` exists
- [ ] `{{name}}/settings.py` exists
- [ ] `python manage.py check` succeeds
- [ ] When `ruff=yes`: `pyproject.toml` has `[tool.ruff]` and `.venv/bin/ruff check .` succeeds
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/django.md`).
- Offer `leanagentkit-bootstrap` if kit memory not yet initialized.
