---
name: leanagentkit-init-conventions
description: Fill AGENTS.md sections 1–5 with evidence-based project conventions; merge existing AGENTS.md instead of erasing it.
---

# Skill: leanagentkit-init-conventions

**Goal:** Populate the factual sections of `AGENTS.md` from the actual repo so the
conventions reflect reality, not aspiration. If `AGENTS.md` already exists, **merge**
— do not erase project-specific instructions that remain compatible with Lean Agent
Kit.

**Output file:** `AGENTS.md` (sections 1–5; ensure §6–§8 protocol exists)

## Existing AGENTS.md — backup, warn, merge

If `AGENTS.md` is already present and is **not** an untouched kit stub (blank
placeholders / HTML comments only):

1. **Warn the user** before changing it. Say clearly that the file will be updated
   (merged into the LAK section shape), not blindly overwritten, and that a backup
   will be created.
2. **Back up first.** Copy the current file to:

   ```text
   .leanagentkit-backup/<YYYYMMDD-HHMMSS>/AGENTS.md
   ```

   Create the directory if needed. Tell the user the backup path.

3. **Read the full existing file.** Inventory every rule, convention, command, and
   project fact.
4. **Classify each item** before writing:

   | Keep                                                                     | Drop or rewrite                                                                                                                                                                          |
   | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Project identity, stack, commands, evidence-based conventions, never-dos | Instructions that conflict with the LAK memory protocol (§6) — e.g. “always rescan the whole repo,” “ignore AGENTS.md,” competing session rituals that replace map-first / start-session |
   | Tool pointers that defer to `AGENTS.md`                                  | Duplicate or contradictory rules that make agent behavior ambiguous                                                                                                                      |
   | Host-specific notes that do not fight §6                                 | Generic best-practice dumps with no evidence in this repo                                                                                                                                |
   | Unique project footguns and domain rules                                 | Outdated pack/skill ads for packs not installed                                                                                                                                          |

5. **Write a merged `AGENTS.md`** in the kit section shape (§1–§8 from
   `template` / current core `AGENTS.md` if present as reference):
   - Fold kept content into §1–§5 (and §5 Never do).
   - Ensure §6 is the current **Memory protocol** (map-first, workflow sizes,
     bookkeeping). Replace conflicting older protocol text; do not leave two
     competing “how to start a session” sections.
   - Keep or clear §7 to match installed packs (do not invent pack ads).
   - Keep §8 Setup / refresh pointers.
6. In the summary to the user, list **what was kept**, **what was removed/rewritten**
   (and why), and the **backup path**.

If `AGENTS.md` is missing, create it from the kit shape and fill §1–§5.

If it is only the blank kit stub, fill §1–§5 in place — no backup required.

## Procedure (evidence)

1. Detect stack & tooling from manifests:
   - `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `composer.json`
     → languages, frameworks, package manager.
   - Config files (`wrangler.toml`, `vite.config`, `tsconfig`, CI yaml, Dockerfile)
     → runtime/infra.
2. Extract **commands** from `scripts` (package.json), `Makefile`, `Taskfile`,
   or CI config. Fill the Commands table; mark `UNKNOWN` if not found — do not invent.
3. Infer **conventions** by reading 3–5 representative source files:
   - layering rules, naming patterns, error-handling style, import boundaries.
     Only state a convention you can see evidence for. Prefer keeping an existing
     AGENTS.md convention when it matches evidence; drop it only if wrong or
     conflicting with LAK.
4. **Commitlint / Conventional Commits** (when evidence exists): if the repo has
   `commitlint.config.*`, `.commitlintrc*`, `@commitlint/config-conventional` in
   deps, and/or a husky `.husky/commit-msg` that runs commitlint, add under §4:

   ```markdown
   - **Commits:** Conventional Commits; subject (header) ≤ 100 chars; wrap body/footer lines at ≤ 100 (`@commitlint/config-conventional` via husky). Prefer `<pm> commit`.
   ```

   Resolve `<pm> commit` from the detected package manager and `scripts.commit`:
   `pnpm commit` · `yarn commit` · `bun run commit` · `npm run commit`. If there
   is no `commit` script, omit the Prefer clause. If `header-max-length` /
   `body-max-line-length` are overridden in commitlint config, use those numbers
   instead of 100.

5. Derive the **Never do** list from linters/configs, `.gitignore` (secrets,
   generated dirs), obvious footguns spotted in code, and kept items from any
   pre-existing AGENTS.md.
6. Apply the merge rules above. Update the `Last updated` date.

## Quality bar

- Every command is copy-pasteable and real.
- Every convention has a basis in the code (or was kept from a prior AGENTS.md
  that still matches the code), not a generic best practice.
- Commit message length limits match commitlint config when present (default 100).
- Pre-existing compatible instructions survive; only incompatible or ambiguous
  material is removed.
- Never overwrite an existing non-stub `AGENTS.md` without a backup and a user
  warning.

## Do not

- Do not replace a non-stub `AGENTS.md` with a blank kit template and then refill
  from scratch while discarding prior rules.
- Do not delete the backup after writing.
- Do not invent pack or stack skill lines in §7.
