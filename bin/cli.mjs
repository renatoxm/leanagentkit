#!/usr/bin/env node
/**
 * create-lean-agent-kit
 * Scaffolds the Lean Agent Kit lean core into a target project, with opt-in
 * packs. Zero runtime dependencies.
 */
import { cp, readdir, access, readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const templateDir = join(packageRoot, "template");
const coreDir = join(templateDir, "core");
const packsDir = join(templateDir, "packs");
const manifestPath = join(packsDir, "manifest.json");
const packageJsonPath = join(packageRoot, "package.json");

// ---- args --------------------------------------------------------------
const args = process.argv.slice(2);
const flags = new Set();
const flagValues = new Map();
const positional = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("-")) {
    if (a === "--with" || a === "--enable-pack" || a === "--keep-pack") {
      const val = args[i + 1];
      if (!val || val.startsWith("-")) {
        console.error(`✗ ${a} requires a value (comma-separated pack ids)`);
        process.exit(1);
      }
      flagValues.set(a, val);
      flags.add(a);
      i++;
    } else {
      flags.add(a);
    }
  } else {
    positional.push(a);
  }
}

const target = resolve(positional[0] ?? ".");
const force = flags.has("--force") || flags.has("-f");
const upgrade = flags.has("--upgrade") || flags.has("-u");
const pruneToCore = flags.has("--prune-to-core");
const showHelp = flags.has("--help") || flags.has("-h");
const withPacksRaw = flagValues.get("--with") ?? "";
const enablePackRaw = flagValues.get("--enable-pack") ?? "";
const keepPackRaw = flagValues.get("--keep-pack") ?? "";

const KNOWN_FLAGS = new Set([
  "--force",
  "-f",
  "--upgrade",
  "-u",
  "--help",
  "-h",
  "--with",
  "--enable-pack",
  "--prune-to-core",
  "--keep-pack",
]);
const unknownFlags = [...flags].filter((f) => !KNOWN_FLAGS.has(f));
if (unknownFlags.length > 0) {
  const hint = unknownFlags.some((f) => /upgrad|updade|udpate|upate/i.test(f))
    ? "\n  Did you mean --upgrade? (pin latest: npx create-lean-agent-kit@latest . --upgrade)"
    : "\n  Tip: npm create swallows flags unless you pass them after --\n" +
      "       e.g. npm create lean-agent-kit@latest . -- --upgrade";
  console.error(`✗ Unknown flag(s): ${unknownFlags.join(", ")}${hint}`);
  process.exit(1);
}

const modeCount = [upgrade, pruneToCore, Boolean(enablePackRaw)].filter(Boolean).length;
if (modeCount > 1) {
  console.error("✗ Use only one of: --upgrade, --prune-to-core, --enable-pack");
  process.exit(1);
}
if (force && (upgrade || pruneToCore)) {
  console.error(
    "✗ --force is for scaffold / enable-pack overwrite only. Use --upgrade or --prune-to-core without --force.",
  );
  process.exit(1);
}
if (withPacksRaw && (upgrade || pruneToCore || enablePackRaw)) {
  console.error("✗ --with is for initial scaffold only");
  process.exit(1);
}
if (keepPackRaw && !pruneToCore) {
  console.error("✗ --keep-pack only applies with --prune-to-core");
  process.exit(1);
}

if (showHelp) {
  const version = JSON.parse(await readFile(packageJsonPath, "utf8")).version;
  console.log(`
create-lean-agent-kit v${version} — lean core memory kit + optional packs

Usage:
  npm create lean-agent-kit@latest              # core only into current directory
  npm create lean-agent-kit@latest my-app       # into ./my-app
  npx create-lean-agent-kit@latest . --with spec,stacks
  npx create-lean-agent-kit@latest . --upgrade
  npx create-lean-agent-kit@latest . --enable-pack practice
  npx create-lean-agent-kit@latest . --prune-to-core
  npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec,stacks

Flags:
  -f, --force           overwrite on scaffold / enable-pack
  -u, --upgrade         refresh core + installed packs; preserve user memory
  --with <packs>        scaffold core plus comma-separated packs
  --enable-pack <packs> add packs to an existing install
  --prune-to-core       archive pack overlays (backup); keep only core (+ --keep-pack)
  --keep-pack <packs>   with --prune-to-core, retain these packs
  -h, --help            show this help

Packs: spec, stacks, practice, architecture, backlog, git-lifecycle, trevor, caveman, authoring, imaginary
  Missing dependencies are installed automatically (architecture, backlog, and
  git-lifecycle pull in spec).
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

const RENAME_ON_COPY = {
  "README.md": "LEAN_AGENT_KIT.md",
};

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

const PRESERVE_PREFIXES_ON_UPGRADE = ["docs/memory/", ".leanagentkit/"];

function shouldPreserveOnUpgrade(destRel, destExists) {
  if (!destExists) return false;
  if (PRESERVE_ON_UPGRADE.has(destRel)) return true;
  // Preserve user configs under .leanagentkit/*.yml but refresh *.yml.example
  if (destRel.startsWith(".leanagentkit/") && destRel.endsWith(".yml")) return true;
  return PRESERVE_PREFIXES_ON_UPGRADE.some(
    (prefix) => destRel.startsWith(prefix) && !destRel.endsWith(".yml.example"),
  );
}

function destRelFromTemplate(templateRel) {
  const parts = templateRel.split("/");
  const base = parts[parts.length - 1];
  // Only rename the kit's top-level README → LEAN_AGENT_KIT.md
  if (parts.length === 1 && RENAME_ON_COPY[base]) {
    return RENAME_ON_COPY[base];
  }
  return templateRel;
}

async function* walkFiles(dir, rel = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath, entryRel);
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

async function readCliVersion() {
  const pkg = JSON.parse(await readText(packageJsonPath));
  return pkg.version;
}

async function loadManifest() {
  return JSON.parse(await readText(manifestPath));
}

async function loadPack(id) {
  const packPath = join(packsDir, id, "pack.json");
  if (!(await exists(packPath))) {
    throw new Error(`Unknown pack: ${id}`);
  }
  return JSON.parse(await readText(packPath));
}

function parsePackList(raw) {
  if (!raw || !raw.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * Resolve pack ids including dependencies (auto-adds deps; does not reject).
 * e.g. `--enable-pack architecture` also installs `spec`.
 */
async function resolvePackDeps(requestedIds) {
  const manifest = await loadManifest();
  const known = new Set(manifest.packs.map((p) => p.id));
  for (const id of requestedIds) {
    if (!known.has(id)) {
      throw new Error(`Unknown pack: ${id}. Known: ${[...known].join(", ")}`);
    }
  }
  const byId = Object.fromEntries(manifest.packs.map((p) => [p.id, p]));
  const resolved = new Set();
  const visiting = new Set();
  const visit = (id, stack = []) => {
    if (resolved.has(id)) return;
    if (visiting.has(id)) {
      throw new Error(`Pack dependency cycle: ${[...stack, id].join(" → ")}`);
    }
    visiting.add(id);
    for (const dep of byId[id].dependsOn ?? []) visit(dep, [...stack, id]);
    visiting.delete(id);
    resolved.add(id);
  };
  for (const id of requestedIds) visit(id);
  return [...resolved];
}

async function readStamp(targetDir) {
  const stampPath = join(targetDir, ".agent", ".leanagentkit-version");
  if (!(await exists(stampPath))) return null;
  try {
    return JSON.parse(await readText(stampPath));
  } catch {
    return null;
  }
}

async function writeVersionStamp(targetDir, version, installedPacks = []) {
  const stampPath = join(targetDir, ".agent", ".leanagentkit-version");
  await mkdir(dirname(stampPath), { recursive: true });
  const unique = [...new Set(installedPacks)].sort();
  await writeFile(
    stampPath,
    JSON.stringify(
      { version, updatedAt: new Date().toISOString(), installedPacks: unique },
      null,
      2,
    ) + "\n",
    "utf8",
  );
}

async function kitPresent(targetDir) {
  return (
    (await exists(join(targetDir, ".agent", ".leanagentkit-version"))) ||
    (await exists(join(targetDir, ".agent", "skills", "leanagentkit-bootstrap.md")))
  );
}

/**
 * Copy files from a source root (core or pack overlay) into target.
 * @param {'scaffold'|'upgrade'|'enable'} mode
 */
async function copyOverlay(sourceRoot, targetDir, mode, counts, backupRootRef) {
  for await (const { from, destRel } of walkFiles(sourceRoot)) {
    // Skip pack.json inside pack overlays
    if (destRel === "pack.json" || destRel.endsWith("/pack.json")) continue;

    const to = join(targetDir, destRel);
    const display = destRel;

    if (mode === "upgrade" && shouldPreserveOnUpgrade(destRel, await exists(to))) {
      console.log(`  keep  ${display}`);
      counts.preserved++;
      continue;
    }

    if (mode === "scaffold" && (await exists(to)) && !force) {
      console.log(`  skip  ${display} (exists — use --force to overwrite)`);
      counts.skipped++;
      continue;
    }

    if (mode === "enable" && (await exists(to)) && !force) {
      if (await filesEqual(from, to)) {
        counts.unchanged++;
        continue;
      }
      console.log(`  skip  ${display} (exists — use --force to overwrite)`);
      counts.skipped++;
      continue;
    }

    if (await exists(to)) {
      if (await filesEqual(from, to)) {
        counts.unchanged++;
        continue;
      }
      if (mode === "upgrade" || (mode === "enable" && force) || (mode === "scaffold" && force)) {
        // Create backup dir on first overwrite for upgrade or enable --force
        if (!backupRootRef.dir && backupRootRef.root) {
          backupRootRef.dir = backupRootRef.root;
          await mkdir(backupRootRef.dir, { recursive: true });
        }
        if (backupRootRef.dir) {
          const backupDest = join(backupRootRef.dir, destRel);
          await mkdir(dirname(backupDest), { recursive: true });
          await cp(to, backupDest);
          counts.backedUp++;
        }
      }
    } else {
      counts.added++;
    }

    await mkdir(dirname(to), { recursive: true });
    await cp(from, to);
    const label = mode === "upgrade" ? "refresh" : "add";
    console.log(`  ${label}   ${display}`);
    counts.refreshed++;
  }
}

async function installPacks(packIds, targetDir, mode, counts, backupRootRef) {
  const resolved = await resolvePackDeps(packIds);
  for (const id of resolved) {
    const packRoot = join(packsDir, id);
    console.log(`\nPack: ${id}`);
    await copyOverlay(packRoot, targetDir, mode, counts, backupRootRef);
  }
  return resolved;
}

// ---- scaffold ----------------------------------------------------------
async function scaffold() {
  if ((await kitPresent(target)) && !force) {
    console.error(
      "✗ Lean Agent Kit is already installed here.\n" +
        "  Use --upgrade to refresh kit files while preserving your memory:\n" +
        "    npx create-lean-agent-kit@latest . --upgrade\n" +
        "  Or --enable-pack <packs> to add packs.\n" +
        "  Or --force to overwrite everything (will clobber user data).",
    );
    process.exit(1);
  }

  if (!(await exists(coreDir))) {
    console.error("✗ template/core/ not found. Reinstall create-lean-agent-kit.");
    process.exit(1);
  }

  const requested = parsePackList(withPacksRaw);
  let resolvedPacks = [];
  try {
    resolvedPacks = requested.length ? await resolvePackDeps(requested) : [];
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }

  const counts = { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0, skipped: 0 };
  const backupRootRef = { root: null, dir: null };

  console.log("\nCore");
  await copyOverlay(coreDir, target, "scaffold", counts, backupRootRef);

  if (resolvedPacks.length) {
    await installPacks(resolvedPacks, target, "scaffold", counts, backupRootRef);
  }

  const version = await readCliVersion();
  await writeVersionStamp(target, version, resolvedPacks);

  const packNote = resolvedPacks.length
    ? `\nInstalled packs: ${resolvedPacks.join(", ")}`
    : "\nInstalled packs: (none — core only)";

  console.log(`
✓ Lean Agent Kit scaffolded into ${target}${packNote}

Next step — open your AI agent in this project and say:

    Read .agent/skills/leanagentkit-bootstrap.md and follow it.

Add packs later with:
    npx create-lean-agent-kit@latest . --enable-pack spec,stacks
`);
}

// ---- enable-pack -------------------------------------------------------
async function runEnablePack() {
  if (!(await kitPresent(target))) {
    console.error("✗ No Lean Agent Kit found. Scaffold first (without --enable-pack).");
    process.exit(1);
  }

  const requested = parsePackList(enablePackRaw);
  if (!requested.length) {
    console.error("✗ --enable-pack requires at least one pack id");
    process.exit(1);
  }

  let resolved;
  try {
    resolved = await resolvePackDeps(requested);
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }

  const stamp = (await readStamp(target)) ?? {};
  const already = new Set(stamp.installedPacks ?? []);
  const counts = { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0, skipped: 0 };
  // Backup root used when --force overwrites differing pack files
  const backupRootRef = {
    root: force ? join(target, ".leanagentkit-backup", backupTimestamp()) : null,
    dir: null,
  };

  await installPacks(resolved, target, "enable", counts, backupRootRef);

  const merged = [...new Set([...already, ...resolved])].sort();
  const version = await readCliVersion();
  await writeVersionStamp(target, version, merged);

  const autoDeps = resolved.filter((id) => !requested.includes(id));
  const depNote = autoDeps.length
    ? `\n  Also installed (dependencies): ${autoDeps.join(", ")}`
    : "";
  const backupNote = backupRootRef.dir
    ? `\n  Backed up ${counts.backedUp} file(s) to ${relative(target, backupRootRef.dir) || backupRootRef.dir}`
    : "";

  console.log(`
✓ Packs enabled in ${target}
  Packs: ${merged.join(", ") || "(none)"}${depNote}
  Added/refreshed: ${counts.refreshed} · Skipped: ${counts.skipped} · Unchanged: ${counts.unchanged}${backupNote}

Update AGENTS.md §7 to list installed packs. Re-run wire-agent if you use Cursor or Claude Code:

    Read .agent/skills/leanagentkit-wire-agent.md and follow it.
`);
}

// ---- upgrade -----------------------------------------------------------
async function runUpgrade() {
  if (!(await kitPresent(target))) {
    console.error("✗ No Lean Agent Kit found in this directory. Run without --upgrade to scaffold first.");
    process.exit(1);
  }

  const stamp = (await readStamp(target)) ?? {};
  const fromVersion = stamp.version ?? "unknown";
  const toVersion = await readCliVersion();
  let installedPacks = [...(stamp.installedPacks ?? [])];

  // 0.x upgrades: stamp may lack installedPacks. Infer from on-disk skills so
  // refresh stays additive without claiming packs are "installed" for prune.
  if (!stamp.installedPacks) {
    installedPacks = await inferPacksFromDisk(target);
  }

  const counts = { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0, skipped: 0 };
  const backupRootRef = {
    root: join(target, ".leanagentkit-backup", backupTimestamp()),
    dir: null,
  };

  console.log("\nCore");
  await copyOverlay(coreDir, target, "upgrade", counts, backupRootRef);

  if (installedPacks.length) {
    try {
      const resolved = await resolvePackDeps(installedPacks);
      await installPacks(resolved, target, "upgrade", counts, backupRootRef);
      installedPacks = resolved;
    } catch (e) {
      console.error(`✗ ${e.message}`);
      process.exit(1);
    }
  }

  // Preserve inferred packs in stamp only if they were already recorded, or
  // if 0.x had no stamp field — record inferred so user can prune intentionally.
  await writeVersionStamp(target, toVersion, installedPacks);

  const backupNote = backupRootRef.dir
    ? `\nBacked up ${counts.backedUp} file(s) to ${relative(target, backupRootRef.dir) || backupRootRef.dir}`
    : "";

  console.log(`
✓ Lean Agent Kit upgraded in ${target}
  Version: ${fromVersion} → ${toVersion}
  Packs: ${installedPacks.join(", ") || "(none / inferred empty)"}
  Refreshed: ${counts.refreshed} · Preserved: ${counts.preserved} · Unchanged: ${counts.unchanged} · Added: ${counts.added}${backupNote}

Upgrade is additive — pack files from older installs are not deleted.
To reclaim a lean footprint:
    npx create-lean-agent-kit@latest . --prune-to-core
    npx create-lean-agent-kit@latest . --enable-pack <packs-you-want>

Re-run wire-agent if you use Cursor or Claude Code:

    Read .agent/skills/leanagentkit-wire-agent.md and follow it.
`);
}

/**
 * Infer installed packs from on-disk skills (0.x upgrades with no installedPacks).
 * Presence of a pack's first skill file adopts that pack into the stamp so a later
 * --upgrade refreshes it. Heuristic only — prefer an explicit stamp when available.
 */
async function inferPacksFromDisk(targetDir) {
  const manifest = await loadManifest();
  const found = [];
  for (const p of manifest.packs) {
    const skill = p.skills?.[0];
    if (!skill) continue;
    const skillPath = join(targetDir, ".agent", "skills", `${skill}.md`);
    if (await exists(skillPath)) found.push(p.id);
  }
  return found;
}

// ---- prune-to-core -----------------------------------------------------
async function runPrune() {
  if (!(await kitPresent(target))) {
    console.error("✗ No Lean Agent Kit found. Nothing to prune.");
    process.exit(1);
  }

  const keepRequested = parsePackList(keepPackRaw);
  let keepResolved = [];
  try {
    keepResolved = keepRequested.length ? await resolvePackDeps(keepRequested) : [];
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }
  const keepSet = new Set(keepResolved);

  const manifest = await loadManifest();
  const stamp = (await readStamp(target)) ?? {};
  const onDiskPacks = stamp.installedPacks?.length
    ? stamp.installedPacks
    : await inferPacksFromDisk(target);

  const toRemove = manifest.packs.map((p) => p.id).filter((id) => !keepSet.has(id));

  const backupRoot = join(target, ".leanagentkit-backup", `${backupTimestamp()}-prune`);
  let moved = 0;
  const userMemoryMoved = [];

  for (const id of toRemove) {
    const pack = await loadPack(id);
    for (const fileRel of pack.files ?? []) {
      if (fileRel === "pack.json") continue;
      const destRel = destRelFromTemplate(fileRel);
      const to = join(target, destRel);
      if (!(await exists(to))) continue;
      const backupDest = join(backupRoot, destRel);
      await mkdir(dirname(backupDest), { recursive: true });
      await rename(to, backupDest);
      console.log(`  prune  ${destRel}`);
      moved++;
      if (
        destRel === "docs/memory/PROGRESS.md" ||
        destRel === "docs/memory/SCRATCH.md" ||
        destRel.startsWith("docs/memory/REMINDERS") ||
        destRel.startsWith("docs/memory/CHECKLISTS/") ||
        destRel.startsWith("docs/memory/WORKFLOWS/")
      ) {
        userMemoryMoved.push(destRel);
      }
    }
  }

  // Refresh core so protocol files match 1.0 after prune
  const counts = { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0, skipped: 0 };
  const backupRootRef = { root: join(target, ".leanagentkit-backup", backupTimestamp()), dir: null };
  console.log("\nRefreshing core");
  await copyOverlay(coreDir, target, "upgrade", counts, backupRootRef);

  if (keepResolved.length) {
    await installPacks(keepResolved, target, "upgrade", counts, backupRootRef);
  }

  const version = await readCliVersion();
  await writeVersionStamp(target, version, keepResolved);

  const memoryNote = userMemoryMoved.length
    ? `\n  Note: ${userMemoryMoved.length} pack memory file(s) moved to backup (e.g. PROGRESS/SCRATCH/reminders).\n` +
      `  User-authored specs under docs/specs/ (if any) were left in place.\n` +
      `  Memory files: ${userMemoryMoved.join(", ")}`
    : "";

  console.log(`
✓ Pruned to core${keepResolved.length ? ` + packs: ${keepResolved.join(", ")}` : ""}
  Moved ${moved} pack file(s) to ${relative(target, backupRoot) || backupRoot}
  Previous stamp packs: ${onDiskPacks.join(", ") || "(none)"}${memoryNote}

Important — AGENTS.md is preserved and may still list removed packs in §7.
Review AGENTS.md §7 and clear stale pack/skill lines. Core ACTIVE_CONTEXT was kept.

Re-enable packs with:
    npx create-lean-agent-kit@latest . --enable-pack <packs>

Re-run wire-agent if you use Cursor or Claude Code.
`);
}

// ---- main --------------------------------------------------------------
async function main() {
  if (!(await exists(templateDir)) || !(await exists(coreDir))) {
    console.error("✗ template/core/ not found in the package. Reinstall create-lean-agent-kit.");
    process.exit(1);
  }

  const version = await readCliVersion();
  console.log(`create-lean-agent-kit v${version}`);

  if (pruneToCore) {
    await runPrune();
  } else if (enablePackRaw) {
    await runEnablePack();
  } else if (upgrade) {
    await runUpgrade();
  } else {
    await scaffold();
  }
}

main().catch((err) => {
  console.error(`✗ Failed:`, err.message);
  process.exit(1);
});
