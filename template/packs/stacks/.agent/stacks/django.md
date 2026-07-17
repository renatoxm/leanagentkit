# Stack Playbook: Django

> Applied when Django is detected.

## Defer to the skill / MCP for

- Models, views, admin, migrations → official Django docs.

## Conventions to record in AGENTS.md

- One app per bounded context under `apps/` or project root.
- Fat models / thin views, or service layer if the project uses one — match existing style.
- Migrations committed; never edit applied migrations by hand.

## CODEBASE_MAP hints to capture

- `settings.py` (or split settings package) and `urls.py` root.
- Installed apps and their responsibilities.
- Custom user model location if non-default.

## AGENTS.md snippet to add

> For Django models, views, and migrations, follow official Django docs and existing app structure.
