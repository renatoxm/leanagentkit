# Third-party reference material

Embedded reference skills used by `leanagentkit-architecture` and
`leanagentkit-decompose-spec`. Kit skills point here; do not install separately.

| Path                           | Upstream                                                                                                              | Version | License                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------- |
| `clean-architecture/`          | [wondelai/skills](https://github.com/wondelai/skills)                                                                 | 1.4.0   | MIT                        |
| `domain-driven-design/`        | [wondelai/skills](https://github.com/wondelai/skills)                                                                 | 1.4.0   | MIT                        |
| `frontend-design-checklist.md` | [anthropics/skills `frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | main    | See upstream `LICENSE.txt` |

Patterns adapted from Cursor built-in skills (not vendored): PR babysit loop
(`leanagentkit-babysit-pr`), split-to-PRs procedure (`leanagentkit-git-workflow`),
skill discovery/authoring (`skill-authoring-standards`), optional Cursor session
hooks (`template/.agent/install/cursor/hooks.json`).

Vendored CA/DDD files are prefixed with an attribution comment. Content is
adapted for Lean Agent Kit paths only — no substantive edits to the frameworks
themselves. `frontend-design-checklist.md` and `leanagentkit-frontend-design`
adapt Anthropic's design process into kit procedure + memory/stack hooks.
