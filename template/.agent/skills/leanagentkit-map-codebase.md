---
name: leanagentkit-map-codebase
description: Build docs/CODEBASE_MAP.md from the repository structure and entry points.
---

# Skill: leanagentkit-map-codebase

**Goal:** Inspect the repository and (re)generate `docs/CODEBASE_MAP.md` so future
sessions can navigate by reading one file instead of scanning everything.

**Output file:** `docs/CODEBASE_MAP.md`

## Procedure

1. List the project tree, ignoring noise:
   - skip: `node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`,
     vendored/generated dirs, lockfiles.
   - Prefer a fast listing (e.g. `git ls-files` or a depth-limited tree) over
     reading file contents.
2. Identify, by reading only entry points and a sample of each top-level dir:
   - the **entry point(s)** (how the app boots),
   - what each top-level directory is responsible for (one line each),
   - the **20% of modules touched most often** (routes/handlers, core services,
     domain logic) → fill the "Key modules" table,
   - the **schema source of truth**, migrations, and model/type locations,
   - **external integrations** and the env var / secret each uses,
   - **cross-cutting concerns**: auth, config, error handling, logging,
   - dirs to **ignore** (generated / vendored).
3. Write `docs/CODEBASE_MAP.md` following its existing template. Keep every entry
   to a single line. Do NOT paste code. Favor "where to look" over detail.
4. Update the `Last updated` date.

## Quality bar

- A new agent reading only this file should know which file to open for any
  common task without grepping.
- If you couldn't determine something, write `UNKNOWN — <what to check>` rather
  than guessing.
