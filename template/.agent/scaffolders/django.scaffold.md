# Scaffolder: django

- **Category:** backend
- **Kind:** cli
- **Stacks row:** Django
- **Depends-on:** none
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| name | Project name | `<project_name>` | `config` | `{{name}}` |
| layout | Layout | current directory · subdirectory | current directory | `.` / `{{name}}/` |

## Command (cli kind only)

```bash
django-admin startproject {{name}} {{layout}}
```

**Flag compilation notes**

- Requires Python with Django installed (`pip install django` or active venv).
- `layout=current directory` → `django-admin startproject {{name}} .` (only on empty dir).
- `layout=subdirectory` → `django-admin startproject {{name}}` creates `./{{name}}/`.
- Non-interactive when project name and path are provided.

## Verify

- [ ] `manage.py` exists
- [ ] `{{name}}/settings.py` exists
- [ ] `python manage.py check` succeeds

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/django.md`).
- Offer `leanagentkit-bootstrap` if kit memory not yet initialized.
