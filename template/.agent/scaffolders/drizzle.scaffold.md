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

### 1. install-deps (if provider=postgresql)

```bash
{{pm}} add drizzle-orm postgres
{{pm}} add -D drizzle-kit @types/node
```

### 1b. install-deps (if provider=mysql)

```bash
{{pm}} add drizzle-orm mysql2
{{pm}} add -D drizzle-kit @types/node
```

### 1c. install-deps (if provider=sqlite)

```bash
{{pm}} add drizzle-orm better-sqlite3
{{pm}} add -D drizzle-kit @types/node @types/better-sqlite3
```

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

### 3a. create-file — `{{schema_path}}` (if provider=postgresql)

```tpl
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3b. create-file — `{{schema_path}}` (if provider=mysql)

```tpl
import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3c. create-file — `{{schema_path}}` (if provider=sqlite)

```tpl
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

### 4a. create-file — `src/db/index.ts` (if provider=postgresql)

```tpl
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

> Use `db/index.ts` when `schema_path` is `db/schema.ts`.

### 4b. create-file — `src/db/index.ts` (if provider=mysql)

```tpl
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool(process.env.DATABASE_URL!);
export const db = drizzle(pool, { schema });
```

### 4c. create-file — `src/db/index.ts` (if provider=sqlite)

```tpl
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL!);
export const db = drizzle(sqlite, { schema });
```

### 5a. create-file — `.env.example` (if provider=postgresql)

```tpl
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

### 5b. create-file — `.env.example` (if provider=mysql)

```tpl
DATABASE_URL=mysql://user:password@localhost:3306/mydb
```

### 5c. create-file — `.env.example` (if provider=sqlite)

```tpl
DATABASE_URL=./local.db
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
- [ ] Driver package matches provider (`postgres`, `mysql2`, or `better-sqlite3`)
- [ ] `{{pm}} run db:generate` succeeds (or reports no pending changes)

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/drizzle.md`, updates memory).
- Remind user to set `DATABASE_URL` in `.env` before migrating.
