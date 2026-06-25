# Stack Playbook: Python

> Applied when Python is detected. Conventions for layout and tooling.

## Defer to the skill / MCP for

- Language/stdlib questions → official Python docs.
- Framework-specific rules → see FastAPI/Django playbook if detected.

## Conventions to record in AGENTS.md

- Use a virtual environment; record the activate command in §3 Commands.
- Prefer `pyproject.toml` as the manifest source of truth.
- Tests in `tests/` mirroring package structure; use `pytest` if present.

## CODEBASE_MAP hints to capture

- Package root and entry point (`__main__.py`, `app.py`, `manage.py`).
- Config files (`pyproject.toml`, `.env`, settings modules).
- Test directory and runner command.

## AGENTS.md snippet to add

> For Python project layout and tooling, follow conventions in `AGENTS.md` §4; defer framework specifics to the matching stack playbook.
