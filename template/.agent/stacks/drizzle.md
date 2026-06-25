# Stack Playbook: Drizzle

> Applied when Drizzle ORM is detected.

## Defer to the skill / MCP for

- Schema, migrations, queries → official Drizzle docs.

## Conventions to record in AGENTS.md

- Schema module is source of truth (`db/schema.ts`, `drizzle/schema`, etc.).
- Migrations via `drizzle-kit`; match project's migrate command in §3.
- Single db connection module — note path.

## CODEBASE_MAP hints to capture

- Schema file(s) and `drizzle.config.ts`.
- Migration output directory.
- DB client export path.

## AGENTS.md snippet to add

> For Drizzle schema and queries, follow official Drizzle docs; schema file is source of truth.
