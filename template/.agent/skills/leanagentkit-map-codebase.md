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

## Host enhancements (optional — never required)

`map-codebase` must write `docs/CODEBASE_MAP.md` — Ask mode cannot complete the
skill alone. On Cursor, use a two-phase handoff when the repo is large or unfamiliar:

1. **Explore in Ask mode** (procedure steps 1–2): list structure, read entry
   points, identify key modules — no writes.
2. **Write in Agent mode** (steps 3–4): switch back, then generate the map from
   what was learned.

Offer this when mapping a large or unfamiliar repo:

- Ask: "Explore in Ask mode first, then write the map in Agent mode?" with options:
  "Yes, start in Ask mode", "No, map in current mode", and "Something else".
- On "Yes": suggest Ask mode manually; after exploration, suggest switching back
  to Agent before step 3.
- Suggested Ask prompt: "Map this repo for `leanagentkit-map-codebase` steps 1–2
  only. Read entry points and key dirs; do not write files."

On other hosts or small familiar repos: continue the portable procedure in one pass.

## Quality bar

- A new agent reading only this file should know which file to open for any
  common task without grepping.
- If you couldn't determine something, write `UNKNOWN — <what to check>` rather
  than guessing.
