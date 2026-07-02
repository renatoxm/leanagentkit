# Skill authoring standards

> Shared reference for `leanagentkit-skill-artifact-template`, `leanagentkit-distill-skill`,
> and any agent authoring a project skill. Aligned with the [agentskills.io](https://agentskills.io)
> open standard. Adapted from Hermes Agent skill-authoring HARDLINE rules.

## Frontmatter (required)

```yaml
---
name: lowercase-hyphenated          # <=64 chars, no spaces
description: "One sentence, <=60 chars, ends with a period."
version: 0.1.0
related: [other-skill-name]         # optional — skills this one pairs with
metadata:
  tags: [Capitalized, Relevant, Tags]
source: path/to/reference/example   # optional — what this skill was learned from
status: active                      # active | pinned | archived
---
```

### `description` (most-violated rule)

- **ONE sentence, <=60 characters**, ends with a period.
- State the **capability**, not the implementation.
- No marketing words: powerful, comprehensive, seamless, advanced, robust.
- Do NOT repeat the skill name.
- If the description contains a colon, wrap the whole value in double quotes.
- **COUNT the characters** before saving. Anything past char 60 is silently truncated
  by skill indexes and never routes.

Good (<=60): `Search arXiv papers by keyword, author, or ID.`

Bad (123): `A comprehensive skill that lets the agent search arXiv for academic papers using keywords, authors, and categories.`

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
