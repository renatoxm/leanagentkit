# Stack Playbook: Prisma

> Applied when Prisma is detected.

## Defer to the skill / MCP for

- Schema, migrations, client API → official Prisma docs.

## Conventions to record in AGENTS.md

- `prisma/schema.prisma` is the schema source of truth.
- Migrations via `prisma migrate`; never hand-edit migration SQL without reason.
- Single `PrismaClient` instance (singleton pattern) — note where it lives.

## CODEBASE_MAP hints to capture

- `prisma/schema.prisma` and `prisma/migrations/`.
- Client import path (`@/lib/db`, `src/db`, etc.).
- Seed script if present.

## AGENTS.md snippet to add

> For Prisma schema and queries, use `prisma/schema.prisma` as source of truth; follow official Prisma docs.
