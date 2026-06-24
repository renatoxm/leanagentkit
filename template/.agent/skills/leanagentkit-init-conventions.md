# Skill: leanagentkit-init-conventions

**Goal:** Populate the factual sections of `AGENTS.md` from the actual repo so the
conventions reflect reality, not aspiration.

**Output file:** `AGENTS.md` (sections 1–5)

## Procedure

1. Detect stack & tooling from manifests:
   - `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `composer.json`
     → languages, frameworks, package manager.
   - Config files (`wrangler.toml`, `vite.config`, `tsconfig`, CI yaml, Dockerfile)
     → runtime/infra.
2. Extract **commands** from `scripts` (package.json), `Makefile`, `Taskfile`,
   or CI config. Fill the Commands table; mark `UNKNOWN` if not found — do not invent.
3. Infer **conventions** by reading 3–5 representative source files:
   - layering rules, naming patterns, error-handling style, import boundaries.
   Only state a convention you can see evidence for.
4. Derive the **Never do** list from linters/configs, `.gitignore` (secrets,
   generated dirs), and obvious footguns spotted in code.
5. Write sections 1–5 of `AGENTS.md`. Leave the Memory protocol (section 6)
   untouched. Update the `Last updated` date.

## Quality bar

- Every command is copy-pasteable and real.
- Every convention has a basis in the code, not a generic best practice.
