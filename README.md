# Lean Agent Kit

Scaffold the **Lean Agent Kit** into any project — a lightweight, tool-agnostic
memory + stack-skill system for AI coding agents (Cursor, Claude Code, Copilot,
ChatGPT, Aider, Cline). A leaner alternative to GitHub Spec Kit. Cursor and Claude
Code support are bootstrap-activated (not pre-shipped on scaffold).

**Lean Agent Kit** operates in a similar domain to Spec Kit, but it is intentionally designed to remain lean, pragmatic, and maintainable. The fundamental difference is that its not intended to bootstrap a project from scratch. Instead, it is designed to operate after the core application stack has already been established. It analyzes the existing architecture, codebase, workflows, and conventions, then acts as a guardrail system that enforces best practices, maintains consistency, reduces architectural drift, and helps generate higher-quality outputs while remaining aligned with the project's stack, standards, and development guidelines.

## Usage

```bash
# into the current directory
npm create lean-agent-kit

# into a new/!named folder
npm create lean-agent-kit my-app

# equivalently
npx create-lean-agent-kit .
```

Then open your AI agent in the project and say:

> Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

That runs the interactive setup: choose memory tiers, map the codebase, detect
your stack, and wire up matching framework skills.

Flags: `--force` overwrite existing kit files · `--help`.

## What it scaffolds

Tiered Markdown memory (long/medium/short), the `.agent/` skills and stack
registry, and `docs/` for the codebase map, ADRs, specs, and session memory.
Full details land in `LEAN_AGENT_KIT.md` in the target project (a copy of the
kit's own README, renamed so it never clobbers your project README).

## Alternative: no-npm install

The kit is just files, so you can also pull the template directly:

```bash
npx degit YOUR_USER/create-lean-agent-kit/template
```

## Repo layout

```
bin/cli.mjs            # the npx entry point (zero deps)
template/              # the payload copied into user projects
  AGENTS.md  .agent/  docs/  README.md
.husky/                # commit hooks (contributors only; not shipped)
commitlint.config.js
package.json           # "files" ships only bin/ + template/
```

## Developing

```bash
npm install            # sets up husky hooks via "prepare"
# test the CLI locally without publishing:
node bin/cli.mjs /tmp/test-target
npm test
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by commitlint on `commit-msg`).

## Publishing

```bash
npm login
npm publish --access public
```

Only `bin/` and `template/` ship (see the `files` whitelist in `package.json`);
husky, configs, and tests stay in the repo.

## Credits

The engineering-practice skills (code review, simplification, git workflow,
documentation, debugging, security, performance, deprecation, API design, CI/CD,
and observability) were adapted from
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — thanks to
Addy Osmani and contributors for the inspiration.

## License

MIT
