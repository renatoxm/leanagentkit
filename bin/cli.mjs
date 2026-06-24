#!/usr/bin/env node
/**
 * create-lean-agent-kit
 * Scaffolds the Lean Agent Kit into a target project, then hands off to the
 * AI agent for interactive setup. Zero runtime dependencies.
 */
import { cp, readdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dirname, "..", "template");

// ---- args --------------------------------------------------------------
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("-")));
const positional = args.filter((a) => !a.startsWith("-"));
const target = resolve(positional[0] ?? ".");
const force = flags.has("--force") || flags.has("-f");
const showHelp = flags.has("--help") || flags.has("-h");

if (showHelp) {
  console.log(`
create-lean-agent-kit — scaffold the Lean Agent Kit

Usage:
  npm create lean-agent-kit            # into the current directory
  npm create lean-agent-kit my-app     # into ./my-app
  npx create-lean-agent-kit . --force  # overwrite existing kit files

Flags:
  -f, --force   overwrite files that already exist
  -h, --help    show this help
`);
  process.exit(0);
}

// ---- helpers -----------------------------------------------------------
async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Files in template/ that are about the KIT itself and shouldn't overwrite a
// user's project file silently. README.md is renamed to avoid clobbering.
const RENAME_ON_COPY = {
  "README.md": "LEAN_AGENT_KIT.md",
};

// ---- copy --------------------------------------------------------------
async function main() {
  if (!(await exists(templateDir))) {
    console.error("✗ template/ not found in the package. Reinstall create-lean-agent-kit.");
    process.exit(1);
  }

  const entries = await readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const from = join(templateDir, entry.name);
    const destName = RENAME_ON_COPY[entry.name] ?? entry.name;
    const to = join(target, destName);

    if ((await exists(to)) && !force) {
      console.log(`  skip  ${relative(target, to) || destName} (exists — use --force to overwrite)`);
      continue;
    }

    await cp(from, to, { recursive: true, force });
    console.log(`  add   ${relative(target, to) || destName}`);
  }

  console.log(`
✓ Lean Agent Kit scaffolded into ${target}

Next step — open your AI agent in this project and say:

    Read .agent/skills/bootstrap.md and follow it.

That runs the interactive setup: pick memory tiers, map the codebase,
detect your stack, and wire up matching skills. See LEAN_AGENT_KIT.md for details.
`);
}

main().catch((err) => {
  console.error("✗ Failed to scaffold:", err.message);
  process.exit(1);
});
