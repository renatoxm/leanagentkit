# Scaffolder: drizzle

- **Category:** orm
- **Kind:** template
- **Stacks row:** PostgreSQL + Drizzle
- **Depends-on:** Node/TS app (package.json with TypeScript)
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| provider | Database provider | postgresql · mysql · sqlite | postgresql | `{{provider}}` |
| schema_dir | Schema location | `src/db/schema.ts` · `db/schema.ts` | `src/db/schema.ts` | `{{schema_path}}` |
| pm | Package manager | pnpm · npm · bun | pnpm | `{{pm}}` |

## Files (template kind only)

### 1. install-deps

```bash
{{pm}} add drizzle-orm
{{pm}} add -D drizzle-kit
{{pm}} add -D @types/node
{{pm}} add postgres
```

> For `mysql` use `mysql2`; for `sqlite` use `better-sqlite3` instead of `postgres`.

### 2. create-file — `drizzle.config.ts`

```tpl
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./{{schema_path}}",
  out: "./drizzle",
  dialect: "{{provider}}",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 3. create-file — `{{schema_path}}`

```tpl
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

> Adjust imports for `mysql` (`drizzle-orm/mysql-core`) or `sqlite` (`drizzle-orm/sqlite-core`).

### 4. create-file — `src/db/index.ts` (or `db/index.ts` matching schema dir)

```tpl
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### 5. create-file — `.env.example`

```tpl
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

### 6. patch — edit `package.json` scripts

```patch
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

## Verify

- [ ] `drizzle.config.ts` exists
- [ ] `{{schema_path}}` exists with at least one table
- [ ] `drizzle-orm` and `drizzle-kit` in `package.json`
- [ ] `{{pm}} run db:generate` succeeds (or reports no pending changes)

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/drizzle.md`, updates memory).
- Remind user to set `DATABASE_URL` in `.env` before migrating.
