# Skill authoring standards

> Shared reference for `leanagentkit-create-skill`, `leanagentkit-skill-artifact-template`,
> `leanagentkit-distill-skill`, and any agent authoring a project skill. Aligned with the
> [agentskills.io](https://agentskills.io) open standard. Adapted from Hermes Agent
> skill-authoring HARDLINE rules and Cursor `create-skill` discovery patterns. For
> predictability, pruning, and refactor diagnosis, see `leanagentkit-create-skill` +
> `skill-craft-glossary.md`.

## Frontmatter (required)

```yaml
---
name: lowercase-hyphenated          # <=64 chars, no spaces
description: "WHAT it does. WHEN to use it — include trigger terms."
version: 0.1.0
related: [other-skill-name]         # optional — skills this one pairs with
metadata:
  tags: [Capitalized, Relevant, Tags]
source: path/to/reference/example   # optional — what this skill was learned from
status: active                      # active | pinned | archived
---
```

### `description` (most-violated rule)

Write in **third person**. Include both **WHAT** (capability) and **WHEN** (trigger
scenarios). Add concrete trigger terms the user might say.

| Limit | Rule |
|-------|------|
| Hard max | **1024 characters** (Cursor / agentskills discovery) |
| Soft target | **≤200 characters** for kit and generated skills |
| Form | One primary sentence preferred; ends with a period |

Additional rules:

- State the **capability**, not the implementation.
- No marketing words: powerful, comprehensive, seamless, advanced, robust.
- Do NOT repeat the skill name.
- If the description contains a colon, wrap the whole value in double quotes.
- **COUNT characters** before saving.

Good (WHAT + WHEN, ≤200):

`Keep a PR merge-ready by triaging comments and CI. Use after opening a PR or when the user asks to babysit or fix PR checks.`

Bad (vague):

`Helps with pull requests.`

### Verbatim user text

If the user supplies exact wording for a skill, use it **verbatim** in the skill body
(same words, same order). Do not paraphrase or add unrequested headings around it.

### `status` lifecycle

| Status | Meaning |
|--------|---------|
| `active` | Default. Skill is in use. |
| `pinned` | User-protected. Curator must not suggest archive or consolidation. |
| `archived` | Moved to `generated/archived/`. No wrappers generated. Recoverable. |

**Never delete a skill file.** Archive only.

## Body section order

Omit a section only if it genuinely has no content:

1. **Title + intro** — 2–3 sentences: what it does, what it does NOT do, key dependency stance.
2. **## When to Use** — bullet list of concrete trigger phrases.
3. **## Prerequisites** — env vars, install steps, credentials.
4. **## How to Run** — canonical invocation, framed through the host agent's tools.
5. **## Quick Reference** — flat command/endpoint list, no narration.
6. **## Procedure** — numbered steps with copy-paste-exact commands.
7. **## Pitfalls** — known limits, rate limits, things that look broken but aren't.
8. **## Verification** — a single command/check that proves the skill worked.
9. **## Learned notes** — *(generated/project skills only)* append-only gotchas discovered in practice.

## Progressive disclosure

- Keep `SKILL.md` concise: ~100 lines for simple skills, ~200 for complex, **≤500** when possible.
- Put detailed reference in sibling files (`reference.md`, checklists under `references/`).
- Link **one level deep** from `SKILL.md` — avoid nested reference chains.
- For fragile or repetitive operations, add a `scripts/` file beside the skill and reference it by path.

## Degrees of freedom

Match specificity to task fragility:

| Freedom | When | Example |
|---------|------|---------|
| **High** (text instructions) | Multiple valid approaches | Code review guidelines |
| **Medium** (templates/pseudocode) | Preferred pattern with variation | Report structure |
| **Low** (exact scripts) | Fragile ops, consistency critical | Database migrations |

## Tool-agnostic framing

- Frame running scripts as "invoke through the host agent's shell/terminal tool."
- Reference host tools by name when the agent has them: `read_file`, `search_files`, `patch`, etc.
- Third-party CLIs (ffmpeg, gh, an SDK) are fine inside a script file; prose still frames them
  as "invoke through the terminal tool."
- Larger scripts belong in a `scripts/` file referenced by relative path — not inlined for the
  agent to re-type every run.

## Quality bar

- Prefer exact commands, endpoint URLs, function signatures, and config keys that appear
  **verbatim** in the source. **NEVER invent** flags, paths, or APIs.
- Keep it tight: ~100 lines for a simple skill, ~200 for a complex one.
- Don't write a router/index skill that only points at other skills.
- Templates use `<placeholders>`; instance values come from name + per-generation prompts.

## Generated skill output path

Project-specific skills authored by the kit land at:

```
.agent/skills/generated/leanagentkit-<name>.md
.agent/recipes/<name>.recipe.md          # when a parameterized procedure is needed
```

Register every new skill in `.agent/skills/generated/README.md` with Tags, Related, Status,
and Last used columns.

## Self-improvement (`## Learned notes`)

**User-owned generated skills and recipes only** — never append to kit-owned skills
(they are overwritten on `--upgrade`).

When a gotcha is discovered during use:

1. Append a dated bullet under `## Learned notes` in the skill file.
2. If the gotcha affects the recipe, add a matching note in the recipe's Pitfalls section.
3. Do not rewrite the procedure — append only.
