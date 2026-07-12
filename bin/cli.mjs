#!/usr/bin/env node
/**
 * create-lean-agent-kit
 * Scaffolds the Lean Agent Kit into a target project, then hands off to the
 * AI agent for interactive setup. Zero runtime dependencies.
 */
import { cp, readdir, access, readFile, writeFile, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dirname, "..", "template");
const packageJsonPath = join(__dirname, "..", "package.json");

// ---- args --------------------------------------------------------------
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("-")));
const positional = args.filter((a) => !a.startsWith("-"));
const target = resolve(positional[0] ?? ".");
const force = flags.has("--force") || flags.has("-f");
const upgrade = flags.has("--upgrade") || flags.has("-u");
const showHelp = flags.has("--help") || flags.has("-h");

const KNOWN_FLAGS = new Set([
  "--force",
  "-f",
  "--upgrade",
  "-u",
  "--help",
  "-h",
]);
const unknownFlags = [...flags].filter((f) => !KNOWN_FLAGS.has(f));
if (unknownFlags.length > 0) {
  const hint = unknownFlags.some((f) => /upgrad|updade|udpate|upate/i.test(f))
    ? "\n  Did you mean --upgrade? (npm create needs: npm create lean-agent-kit . -- --upgrade)"
    : "\n  Tip: npm create swallows flags unless you pass them after --\n" +
      "       e.g. npm create lean-agent-kit . -- --upgrade";
  console.error(`✗ Unknown flag(s): ${unknownFlags.join(", ")}${hint}`);
  process.exit(1);
}

if (upgrade && force) {
  console.error(
    "✗ --force is for scaffold mode only. Use --upgrade to refresh kit files while preserving your memory.",
  );
  process.exit(1);
}

if (showHelp) {
  console.log(`
create-lean-agent-kit — scaffold the Lean Agent Kit

Usage:
  npm create lean-agent-kit            # into the current directory
  npm create lean-agent-kit my-app     # into ./my-app
  npx create-lean-agent-kit . --force  # overwrite existing kit files
  npx create-lean-agent-kit . --upgrade  # refresh kit files, preserve user memory
  npm create lean-agent-kit . -- --upgrade  # same, when using npm create

Flags:
  -f, --force     overwrite files that already exist (scaffold mode)
  -u, --upgrade   refresh kit-owned files; preserve memory, AGENTS.md, and user data
  -h, --help      show this help
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

async function readText(p) {
  return readFile(p, "utf8");
}

async function filesEqual(a, b) {
  if (!(await exists(a)) || !(await exists(b))) return false;
  const [bufA, bufB] = await Promise.all([readFile(a), readFile(b)]);
  return bufA.equals(bufB);
}

// Files in template/ that are about the KIT itself and shouldn't overwrite a
// user's project file silently. README.md is renamed to avoid clobbering.
const RENAME_ON_COPY = {
  "README.md": "LEAN_AGENT_KIT.md",
};

// Template paths that accumulate user data — never overwrite on --upgrade.
const PRESERVE_ON_UPGRADE = new Set([
  "AGENTS.md",
  "docs/CODEBASE_MAP.md",
  "docs/memory/ACTIVE_CONTEXT.md",
  "docs/memory/PROGRESS.md",
  "docs/memory/SCRATCH.md",
  "docs/memory/REMINDERS.md",
  ".agent/stacks/registry.md",
  ".agent/scaffolders/registry.md",
  "LEAN_AGENT_KIT.md",
  "docs/adr/0001-record-architecture-decisions.md",
  ".agent/skills/generated/README.md",
]);

const PRESERVE_PREFIXES_ON_UPGRADE = ["docs/memory/"];

function shouldPreserveOnUpgrade(destRel, destExists) {
  if (!destExists) return false;
  if (PRESERVE_ON_UPGRADE.has(destRel)) return true;
  return PRESERVE_PREFIXES_ON_UPGRADE.some((prefix) => destRel.startsWith(prefix));
}

function destRelFromTemplate(templateRel) {
  const parts = templateRel.split("/");
  const base = parts[parts.length - 1];
  if (parts.length === 1 && RENAME_ON_COPY[base]) {
    return RENAME_ON_COPY[base];
  }
  if (parts.length > 1) return templateRel;
  return RENAME_ON_COPY[base] ?? base;
}

async function* walkTemplateFiles(dir, rel = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkTemplateFiles(fullPath, entryRel);
    } else if (entry.isFile()) {
      yield { from: fullPath, templateRel: entryRel, destRel: destRelFromTemplate(entryRel) };
    }
  }
}

function backupTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${process.pid}`;
}

async function readInstalledVersion(targetDir) {
  const stampPath = join(targetDir, ".agent", ".leanagentkit-version");
  if (!(await exists(stampPath))) return null;
  try {
    const data = JSON.parse(await readText(stampPath));
    return data.version ?? null;
  } catch {
    return null;
  }
}

async function writeVersionStamp(targetDir, version) {
  const stampPath = join(targetDir, ".agent", ".leanagentkit-version");
  await mkdir(dirname(stampPath), { recursive: true });
  await writeFile(
    stampPath,
    JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2) + "\n",
    "utf8",
  );
}

async function readCliVersion() {
  const pkg = JSON.parse(await readText(packageJsonPath));
  return pkg.version;
}

// ---- scaffold (top-level copy, unchanged behavior) ---------------------
async function scaffold() {
  const kitPresent =
    (await exists(join(target, ".agent", ".leanagentkit-version"))) ||
    (await exists(join(target, ".agent", "skills", "leanagentkit-bootstrap.md")));

  if (kitPresent && !force) {
    console.error(
      "✗ Lean Agent Kit is already installed here.\n" +
        "  Use --upgrade to refresh kit files while preserving your memory:\n" +
        "    npx create-lean-agent-kit . --upgrade\n" +
        "    npm create lean-agent-kit . -- --upgrade\n" +
        "  Or --force to overwrite everything (will clobber user data).",
    );
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

  const version = await readCliVersion();
  await writeVersionStamp(target, version);

  console.log(`
✓ Lean Agent Kit scaffolded into ${target}

Next step — open your AI agent in this project and say:

    Read .agent/skills/leanagentkit-bootstrap.md and follow it.

That runs the interactive setup: pick memory tiers, map the codebase,
detect your stack, and wire up matching skills. See LEAN_AGENT_KIT.md for details.
`);
}

// ---- upgrade (per-file refresh with preserve + backup) -----------------
async function runUpgrade() {
  const stampPath = join(target, ".agent", ".leanagentkit-version");
  if (!(await exists(stampPath)) && !(await exists(join(target, ".agent", "skills", "leanagentkit-bootstrap.md")))) {
    console.error("✗ No Lean Agent Kit found in this directory. Run without --upgrade to scaffold first.");
    process.exit(1);
  }

  const fromVersion = (await readInstalledVersion(target)) ?? "unknown";
  const toVersion = await readCliVersion();
  const backupRoot = join(target, ".leanagentkit-backup", backupTimestamp());
  let backupDir = null;

  const counts = { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0 };

  for await (const { from, destRel } of walkTemplateFiles(templateDir)) {
    const to = join(target, destRel);
    const display = destRel;

    if (shouldPreserveOnUpgrade(destRel, await exists(to))) {
      console.log(`  keep  ${display}`);
      counts.preserved++;
      continue;
    }

    if (await exists(to)) {
      if (await filesEqual(from, to)) {
        counts.unchanged++;
        continue;
      }

      if (!backupDir) {
        backupDir = backupRoot;
        await mkdir(backupDir, { recursive: true });
      }
      const backupDest = join(backupDir, destRel);
      await mkdir(dirname(backupDest), { recursive: true });
      await cp(to, backupDest);
      counts.backedUp++;
    } else {
      counts.added++;
    }

    await mkdir(dirname(to), { recursive: true });
    await cp(from, to);
    console.log(`  refresh  ${display}`);
    counts.refreshed++;
  }

  await writeVersionStamp(target, toVersion);

  const backupNote = backupDir
    ? `\nBacked up ${counts.backedUp} file(s) to ${relative(target, backupDir) || backupDir}`
    : "";

  console.log(`
✓ Lean Agent Kit upgraded in ${target}
  Version: ${fromVersion} → ${toVersion}
  Refreshed: ${counts.refreshed} · Preserved: ${counts.preserved} · Unchanged: ${counts.unchanged} · Added: ${counts.added}${backupNote}

Next step — if you use Cursor or Claude Code, re-run the wire-agent skill so
skill wrappers match the refreshed .agent/skills/ frontmatter:

    Read .agent/skills/leanagentkit-wire-agent.md and follow it.
`);
}

// ---- main --------------------------------------------------------------
async function main() {
  if (!(await exists(templateDir))) {
    console.error("✗ template/ not found in the package. Reinstall create-lean-agent-kit.");
    process.exit(1);
  }

  if (upgrade) {
    await runUpgrade();
  } else {
    await scaffold();
  }
}

main().catch((err) => {
  console.error(`✗ Failed to ${upgrade ? "upgrade" : "scaffold"}:`, err.message);
  process.exit(1);
});
