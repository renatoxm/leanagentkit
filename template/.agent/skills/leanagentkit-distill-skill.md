---
name: leanagentkit-distill-skill
description: "Distill a session workflow into a reusable skill."
---

# Skill: leanagentkit-distill-skill

**Goal:** Turn what you just did in this session (or a named source) into a
reusable project skill — the file-based equivalent of Hermes `/learn`. Complements
`leanagentkit-skill-artifact-template` (which learns from one existing example) by
learning from the **session itself**.

**Run when:** "distill what we just did into a skill", "learn this workflow",
"save this procedure for next time", or after repeating the same workflow 2+ times.

**Inputs:** free-text description — session steps, dir paths, URLs, pasted notes,
or "what we just did in this conversation".
**Outputs:**
- `.agent/skills/generated/leanagentkit-<name>.md` — the reusable skill.
- `.agent/recipes/<name>.recipe.md` — when the procedure needs parameterization.
- A registry row in `.agent/skills/generated/README.md`.
- Optional Cursor/Claude wrappers if those agents are wired.

---

## Procedure

### 1. Read authoring standards
Read `.agent/skills/references/skill-authoring-standards.md` and
`.agent/skills/references/skill-craft-glossary.md`. Every output must comply:
`description` <=60 chars, agentskills.io frontmatter, fixed section order,
`## Learned notes` at the end.

To **refactor an existing generated skill** (not distill from a session), use
`leanagentkit-create-skill` directly instead of this skill.

### 2. Parse the request
The request may mix **sources** (dirs, paths, URLs, "what we just did", pasted
notes) and **requirements** (focus, scope, naming, what to skip). Treat every
part as load-bearing. Prose after a path is a requirement, not incidental.

If the request is empty, default to: *the workflow we just went through in this
conversation — review the steps taken and distill them into a reusable skill.*

### 3. Gather sources
Using the host agent's tools:
- **Local files/dirs** — read and trace the pattern.
- **URLs** — fetch and extract relevant procedure.
- **This conversation** — review steps taken, commands run, decisions made.
- **Pasted notes** — use as-is.

Apply every requirement and constraint from the request to what the skill covers.

### 4. Choose a skill name
Pick a lowercase-hyphenated name (<=64 chars) that describes the capability, not
the implementation. Confirm with the user if ambiguous.

### 5. Author the skill
Write `.agent/skills/generated/leanagentkit-<name>.md` following the authoring
standards. Include:
- Frontmatter: `name`, `description` (<=60 chars — count them), `version: 0.1.0`,
  `related` (kit skills this pairs with, e.g. `leanagentkit-debug`), `metadata.tags`,
  `source` (what this was learned from), `status: active`.
- Body: When to Use, Prerequisites, How to Run, Quick Reference, Procedure,
  Pitfalls, Verification, Learned notes (empty placeholder).

If the workflow needs parameterized steps (name, roles, paths), also write
`.agent/recipes/<name>.recipe.md` using `.agent/recipes/_TEMPLATE.recipe.md`.

### 5b. Craft pass
Run `.agent/skills/leanagentkit-create-skill.md` — **craft pass only** — on the
draft file. Do not register or wire here; step 6 handles that.

### 6. Register & wire
Append a row to `.agent/skills/generated/README.md` with Tags, Related, Status
(`active`), and Last used (today). If `.cursor/skills/` or `.claude/skills/` exist,
offer to run `leanagentkit-wire-agent` to generate wrappers (do not hand-write
individual wrapper files).

### 7. Report
Tell the user: skill name, what it captured, invocation string, and whether a
recipe was created.

## Rules

- **Never invent** flags, paths, or APIs not seen in the source.
- **Infer, then confirm** — show a summary before writing; let the user correct.
- **User-owned files only** — write to `generated/` and `recipes/`, never modify
  kit-owned skills under `.agent/skills/leanagentkit-*.md`.
- When a gotcha is discovered later, append under `## Learned notes` in the
  generated skill.

## When NOT to use

- One-off tasks unlikely to repeat — use `end-session` instead.
- Learning scaffolding from a single existing example — use
  `leanagentkit-skill-artifact-template` instead.
