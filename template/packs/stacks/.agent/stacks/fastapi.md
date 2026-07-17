# Stack Playbook: FastAPI

> Applied when FastAPI is detected.

## Defer to the skill / MCP for

- Routing, dependencies, Pydantic models, OpenAPI → official FastAPI docs.

## Conventions to record in AGENTS.md

- Routes thin; business logic in `services/` or `domain/` (no `Request` leaking into services).
- Validate with Pydantic models at route boundaries.
- Mount routers with `APIRouter`; group by domain.

## CODEBASE_MAP hints to capture

- App factory / `FastAPI()` instance and where routers are included.
- Dependency injection modules (`deps.py`, `dependencies/`).
- OpenAPI / schema source of truth.

## AGENTS.md snippet to add

> For FastAPI routing, dependencies, and validation, follow official FastAPI patterns; keep routes thin.
