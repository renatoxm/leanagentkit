#!/usr/bin/env node
/**
 * create-lean-agent-kit
 * Scaffolds the Lean Agent Kit lean core into a target project, with opt-in
 * packs. Zero runtime dependencies. TTY runs a guided installer by default.
 */
import {
  cp,
  readdir,
  access,
  readFile,
  writeFile,
  mkdir,
  rename,
  rm,
  lstat,
} from "node:fs/promises";
import { constants } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";
import { emitKeypressEvents } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const templateDir = join(packageRoot, "template");
const coreDir = join(templateDir, "core");
const packsDir = join(templateDir, "packs");
const manifestPath = join(packsDir, "manifest.json");
const packageJsonPath = join(packageRoot, "package.json");

/** Paths removed (or backed up) during delete + clean install. */
export const CLEAN_INSTALL_PATHS = [
  ".agent",
  ".leanagentkit",
  "docs/memory",
  "docs/specs",
  "docs/adr",
  "docs/CODEBASE_MAP.md",
  "AGENTS.md",
  "LEAN_AGENT_KIT.md",
  "LEAN_AGENT_KIT_GUIDE.md",
];

/** Base frameworks offered when the target is empty / freshly cleaned. */
export const FRAMEWORK_OPTIONS = [
  { id: "astro", label: "Astro" },
  { id: "next", label: "Next.js" },
  { id: "react-vite", label: "React (Vite)" },
  { id: "sveltekit", label: "SvelteKit" },
  { id: "django", label: "Django" },
  { id: "express", label: "Express" },
  { id: "fastapi", label: "FastAPI" },
  { id: "hono", label: "Hono" },
  { id: "python", label: "Python (base)" },
  { id: "go", label: "Go" },
  { id: "turborepo", label: "Turborepo" },
];

const IGNORE_WHEN_EMPTY = new Set([".git", ".leanagentkit-backup"]);

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
  "docs/memory/LEARNINGS.md",
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

function emptyCounts() {
  return { refreshed: 0, preserved: 0, backedUp: 0, unchanged: 0, added: 0, skipped: 0 };
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
export async function resolvePackDeps(requestedIds) {
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

export async function kitPresent(targetDir) {
  return (
    (await exists(join(targetDir, ".agent", ".leanagentkit-version"))) ||
    (await exists(join(targetDir, ".agent", "skills", "leanagentkit-bootstrap.md")))
  );
}

/**
 * Copy files from a source root (core or pack overlay) into target.
 * @param {'scaffold'|'upgrade'|'enable'} mode
 * @param {{ force?: boolean }} [opts]
 */
async function copyOverlay(sourceRoot, targetDir, mode, counts, backupRootRef, opts = {}) {
  const useForce = opts.force === true;
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

    if (mode === "scaffold" && (await exists(to)) && !useForce) {
      console.log(`  skip  ${display} (exists — use --force to overwrite)`);
      counts.skipped++;
      continue;
    }

    if (mode === "enable" && (await exists(to)) && !useForce) {
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
      if (mode === "upgrade" || (mode === "enable" && useForce) || (mode === "scaffold" && useForce)) {
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

async function installPacks(packIds, targetDir, mode, counts, backupRootRef, opts = {}) {
  const resolved = await resolvePackDeps(packIds);
  for (const id of resolved) {
    const packRoot = join(packsDir, id);
    console.log(`\nPack: ${id}`);
    await copyOverlay(packRoot, targetDir, mode, counts, backupRootRef, opts);
  }
  return resolved;
}

/**
 * Classify target directory for the guided installer.
 * @returns {Promise<{ kind: 'empty'|'occupied'|'existing-kit', stamp?: object|null }>}
 */
export async function classifyTarget(targetDir) {
  if (await kitPresent(targetDir)) {
    return { kind: "existing-kit", stamp: await readStamp(targetDir) };
  }
  if (!(await exists(targetDir))) {
    return { kind: "empty" };
  }
  const entries = await readdir(targetDir);
  const meaningful = entries.filter((name) => !IGNORE_WHEN_EMPTY.has(name));
  if (meaningful.length === 0) {
    return { kind: "empty" };
  }
  return { kind: "occupied" };
}

/**
 * Infer installed packs from on-disk skills (0.x upgrades with no installedPacks).
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

/**
 * Refresh core + installed packs. When backup=false, overwrite without archiving.
 */
export async function performUpgrade(targetDir, { backup = true, quiet = false } = {}) {
  if (!(await kitPresent(targetDir))) {
    throw new Error("No Lean Agent Kit found in this directory.");
  }

  const stamp = (await readStamp(targetDir)) ?? {};
  const fromVersion = stamp.version ?? "unknown";
  const toVersion = await readCliVersion();
  let installedPacks = [...(stamp.installedPacks ?? [])];

  if (!stamp.installedPacks) {
    installedPacks = await inferPacksFromDisk(targetDir);
  }

  const counts = emptyCounts();
  const backupRootRef = {
    root: backup ? join(targetDir, ".leanagentkit-backup", backupTimestamp()) : null,
    dir: null,
  };

  console.log("\nCore");
  await copyOverlay(coreDir, targetDir, "upgrade", counts, backupRootRef);

  if (installedPacks.length) {
    const resolved = await resolvePackDeps(installedPacks);
    await installPacks(resolved, targetDir, "upgrade", counts, backupRootRef);
    installedPacks = resolved;
  }

  await writeVersionStamp(targetDir, toVersion, installedPacks);

  if (!quiet) {
    const backupNote = backupRootRef.dir
      ? `\nBacked up ${counts.backedUp} file(s) to ${relative(targetDir, backupRootRef.dir) || backupRootRef.dir}`
      : backup
        ? ""
        : "\nNo backup created (overwrite without archive).";

    console.log(`
✓ Lean Agent Kit upgraded in ${targetDir}
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

  return {
    fromVersion,
    toVersion,
    installedPacks,
    counts,
    backupDir: backupRootRef.dir,
  };
}

/**
 * Remove or archive the kit footprint, then install a fresh core (+ packs).
 */
export async function performCleanInstall(
  targetDir,
  { backup = true, packIds = [], forceOverwrite = true } = {},
) {
  const existing = [];
  for (const rel of CLEAN_INSTALL_PATHS) {
    const full = join(targetDir, rel);
    if (await exists(full)) existing.push(rel);
  }

  let backupDir = null;
  if (existing.length) {
    if (backup) {
      backupDir = join(targetDir, ".leanagentkit-backup", `${backupTimestamp()}-clean-install`);
      await mkdir(backupDir, { recursive: true });
      for (const rel of existing) {
        const from = join(targetDir, rel);
        const to = join(backupDir, rel);
        await mkdir(dirname(to), { recursive: true });
        await rename(from, to);
        console.log(`  backup ${rel}`);
      }
      console.log(`\n✓ Kit files moved to ${relative(targetDir, backupDir) || backupDir}`);
    } else {
      for (const rel of existing) {
        const full = join(targetDir, rel);
        const st = await lstat(full);
        await rm(full, { recursive: st.isDirectory(), force: true });
        console.log(`  delete ${rel}`);
      }
      console.log("\n✓ Kit files permanently deleted");
    }
  }

  // Drop empty docs/ if nothing remains under it
  const docsDir = join(targetDir, "docs");
  if (await exists(docsDir)) {
    const left = await readdir(docsDir);
    if (left.length === 0) {
      await rm(docsDir, { recursive: true, force: true });
    }
  }

  const result = await performScaffold(targetDir, packIds, {
    forceOverwrite,
    allowExistingKit: true,
    quiet: true,
  });
  return { ...result, backupDir, cleaned: existing };
}

/**
 * Scaffold core + packs into targetDir.
 */
export async function performScaffold(
  targetDir,
  packIds = [],
  { forceOverwrite = false, allowExistingKit = false, quiet = false } = {},
) {
  if ((await kitPresent(targetDir)) && !forceOverwrite && !allowExistingKit) {
    const err = new Error("Lean Agent Kit is already installed here.");
    err.code = "KIT_PRESENT";
    throw err;
  }

  if (!(await exists(coreDir))) {
    throw new Error("template/core/ not found. Reinstall create-lean-agent-kit.");
  }

  await mkdir(targetDir, { recursive: true });

  let resolvedPacks = [];
  if (packIds.length) {
    resolvedPacks = await resolvePackDeps(packIds);
  }

  const counts = emptyCounts();
  const backupRootRef = { root: null, dir: null };
  const opts = { force: forceOverwrite };

  console.log("\nCore");
  await copyOverlay(coreDir, targetDir, "scaffold", counts, backupRootRef, opts);

  if (resolvedPacks.length) {
    await installPacks(resolvedPacks, targetDir, "scaffold", counts, backupRootRef, opts);
  }

  const version = await readCliVersion();
  await writeVersionStamp(targetDir, version, resolvedPacks);

  if (!quiet) {
    const packNote = resolvedPacks.length
      ? `\nInstalled packs: ${resolvedPacks.join(", ")}`
      : "\nInstalled packs: (none — core only)";
    console.log(`\n✓ Lean Agent Kit scaffolded into ${targetDir}${packNote}`);
  }

  return { version, installedPacks: resolvedPacks, counts };
}

/**
 * Enable packs on an existing install (merge stamp).
 */
export async function performEnablePacks(
  targetDir,
  packIds,
  { forceOverwrite = false, quiet = false } = {},
) {
  if (!(await kitPresent(targetDir))) {
    throw new Error("No Lean Agent Kit found. Scaffold first.");
  }
  if (!packIds.length) {
    throw new Error("At least one pack id is required");
  }

  const resolved = await resolvePackDeps(packIds);
  const stamp = (await readStamp(targetDir)) ?? {};
  const already = new Set(stamp.installedPacks ?? []);
  const counts = emptyCounts();
  const backupRootRef = {
    root: forceOverwrite ? join(targetDir, ".leanagentkit-backup", backupTimestamp()) : null,
    dir: null,
  };

  await installPacks(resolved, targetDir, "enable", counts, backupRootRef, {
    force: forceOverwrite,
  });

  const merged = [...new Set([...already, ...resolved])].sort();
  const version = await readCliVersion();
  await writeVersionStamp(targetDir, version, merged);

  if (!quiet) {
    const autoDeps = resolved.filter((id) => !packIds.includes(id));
    const depNote = autoDeps.length
      ? `\n  Also installed (dependencies): ${autoDeps.join(", ")}`
      : "";
    const backupNote = backupRootRef.dir
      ? `\n  Backed up ${counts.backedUp} file(s) to ${relative(targetDir, backupRootRef.dir) || backupRootRef.dir}`
      : "";
    console.log(`
✓ Packs enabled in ${targetDir}
  Packs: ${merged.join(", ") || "(none)"}${depNote}
  Added/refreshed: ${counts.refreshed} · Skipped: ${counts.skipped} · Unchanged: ${counts.unchanged}${backupNote}
`);
  }

  return { installedPacks: merged, resolved, counts, backupDir: backupRootRef.dir };
}

const NEXT_STEPS_ACTION_LINES = {
  scaffolded: "scaffolded into",
  updated: "updated in",
  reinstalled: "reinstalled (clean install) in",
  ready: "ready in",
};

/**
 * Build the final "what to tell your agent" block from wizard choices.
 * @param {{ framework?: string|null, installedPacks?: string[], targetDir?: string,
 *           action?: 'scaffolded'|'updated'|'reinstalled'|'ready' }} [choices]
 */
export function formatNextSteps({
  framework = null,
  installedPacks = [],
  targetDir = ".",
  action = "scaffolded",
} = {}) {
  const packs = [...installedPacks];
  const hasStacks = packs.includes("stacks");
  const frameworkLabel =
    FRAMEWORK_OPTIONS.find((f) => f.id === framework)?.label ?? framework;

  let agentPrompt;
  if (framework && hasStacks) {
    agentPrompt =
      `Read .agent/skills/leanagentkit-scaffold.md and scaffold ${frameworkLabel}, ` +
      `then read .agent/skills/leanagentkit-bootstrap.md and follow it ` +
      `(including leanagentkit-match-stack).`;
  } else if (hasStacks) {
    agentPrompt =
      `Read .agent/skills/leanagentkit-bootstrap.md and follow it ` +
      `(run leanagentkit-match-stack when offered).`;
  } else {
    agentPrompt = `Read .agent/skills/leanagentkit-bootstrap.md and follow it.`;
  }

  const packNote = packs.length
    ? `Installed packs: ${packs.join(", ")}`
    : "Installed packs: (none — core only)";

  return `
✓ Lean Agent Kit ${NEXT_STEPS_ACTION_LINES[action] ?? "scaffolded into"} ${targetDir}
${packNote}${framework ? `\nFramework intent: ${frameworkLabel}` : ""}

Next step — open your AI agent in this project and say:

    ${agentPrompt}

Add packs later with:
    npx create-lean-agent-kit@latest . --enable-pack spec,stacks
`.trimEnd();
}

// ---- prompts (zero-deps TTY UI) ----------------------------------------

class PromptCancelError extends Error {
  constructor(message = "Cancelled") {
    super(message);
    this.name = "PromptCancelError";
    this.code = "PROMPT_CANCEL";
  }
}

function isInteractiveTty() {
  return Boolean(input.isTTY && output.isTTY);
}

/**
 * Create real TTY prompts. Injectable fakes can mirror this interface for tests.
 *
 * The readline interface and the raw-mode multi-select must never listen on
 * stdin at the same time: the interface is created lazily and closed before
 * entering raw mode, then recreated on the next line-based question.
 */
export function createTtyPrompts() {
  let rl = null;

  function ensureRl() {
    if (!rl) rl = createInterface({ input, output, terminal: true });
    return rl;
  }

  function releaseRl() {
    if (rl) {
      rl.close();
      rl = null;
    }
  }

  async function askLine(question) {
    try {
      return await ensureRl().question(question);
    } catch {
      throw new PromptCancelError();
    }
  }

  async function confirm(question, { defaultYes = true } = {}) {
    const hint = defaultYes ? "Y/n" : "y/N";
    while (true) {
      const answer = (await askLine(`${question} (${hint}) `)).trim().toLowerCase();
      if (!answer) return defaultYes;
      if (answer === "y" || answer === "yes") return true;
      if (answer === "n" || answer === "no") return false;
      console.log("  Please answer y or n.");
    }
  }

  async function choose(question, choices, { defaultIndex = 0 } = {}) {
    console.log(`\n${question}`);
    choices.forEach((c, i) => {
      const label = typeof c === "string" ? c : c.label;
      console.log(`  ${i + 1}) ${label}`);
    });
    const def = defaultIndex + 1;
    while (true) {
      const raw = (await askLine(`Choose [1-${choices.length}] (default ${def}): `)).trim();
      if (!raw) return typeof choices[defaultIndex] === "string"
        ? choices[defaultIndex]
        : choices[defaultIndex];
      const n = Number.parseInt(raw, 10);
      if (Number.isInteger(n) && n >= 1 && n <= choices.length) {
        return typeof choices[n - 1] === "string" ? choices[n - 1] : choices[n - 1];
      }
      console.log("  Invalid choice — try again.");
    }
  }

  async function confirmDestructive(warningLines) {
    console.log("\n⚠ DESTRUCTIVE ACTION");
    for (const line of warningLines) console.log(`  ${line}`);
    const answer = (await askLine('\nType "delete" to confirm (or anything else to cancel): ')).trim();
    return answer.toLowerCase() === "delete";
  }

  /**
   * Checkbox multi-select with ↑/↓, Space, Enter.
   * Falls back to numbered toggle list when raw mode is unavailable.
   * @param {string} question
   * @param {{ id: string, label: string, description?: string, selected?: boolean }[]} items
   */
  async function multiSelect(question, items) {
    if (!input.isTTY || typeof input.setRawMode !== "function") {
      return multiSelectFallback(question, items, askLine);
    }
    // Hand exclusive stdin ownership to the raw-mode widget.
    releaseRl();
    return multiSelectRaw(question, items);
  }

  function close() {
    releaseRl();
  }

  return { confirm, choose, confirmDestructive, multiSelect, askLine, close };
}

async function multiSelectFallback(question, items, askLine) {
  const selected = new Set(items.filter((i) => i.selected).map((i) => i.id));
  console.log(`\n${question}`);
  console.log("  Enter a number to toggle, or press Enter when done.");
  console.log("  (TTY multi-select: ↑/↓ move · Space select/unselect · Enter confirm)\n");

  while (true) {
    items.forEach((item, i) => {
      const mark = selected.has(item.id) ? "✓" : " ";
      const desc = item.description ? ` — ${item.description}` : "";
      console.log(`  ${i + 1}) [${mark}] ${item.label}${desc}`);
    });
    const raw = (await askLine("Toggle # (Enter = done): ")).trim();
    if (!raw) break;
    const n = Number.parseInt(raw, 10);
    if (!Number.isInteger(n) || n < 1 || n > items.length) {
      console.log("  Invalid — try again.");
      continue;
    }
    const id = items[n - 1].id;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    console.log("");
  }
  return items.filter((i) => selected.has(i.id)).map((i) => i.id);
}

function multiSelectRaw(question, items) {
  return new Promise((resolvePromise, rejectPromise) => {
    const selected = new Set(items.filter((i) => i.selected).map((i) => i.id));
    let cursor = 0;
    let closed = false;

    emitKeypressEvents(input);
    const wasRaw = input.isRaw;
    input.setRawMode(true);
    input.resume();

    const cleanup = () => {
      if (closed) return;
      closed = true;
      input.setRawMode(wasRaw);
      input.removeListener("keypress", onKey);
      // Release stdin so the process can exit if no readline follows.
      input.pause();
    };

    // Truncate to the terminal width so the fixed-height redraw never wraps.
    const fitWidth = (line) => {
      const width = output.columns || 80;
      return line.length >= width ? `${line.slice(0, width - 2)}…` : line;
    };

    const render = () => {
      // Move cursor up to redraw (after first paint)
      const lines = items.length + 3;
      if (render.painted) {
        output.write(`\x1b[${lines}A`);
      }
      render.painted = true;
      output.write(`\x1b[0J`);
      output.write(`${fitWidth(question)}\n`);
      output.write(
        `${fitWidth("  ↑/↓ move · Space select/unselect · Enter confirm · Ctrl+C cancel")}\n\n`,
      );
      items.forEach((item, i) => {
        const mark = selected.has(item.id) ? "✓" : " ";
        const pointer = i === cursor ? "›" : " ";
        const desc = item.description ? ` — ${item.description}` : "";
        const line = fitWidth(` ${pointer} [${mark}] ${item.label}${desc}`);
        output.write(i === cursor ? `\x1b[36m${line}\x1b[0m\n` : `${line}\n`);
      });
    };
    render.painted = false;

    const onKey = (_str, key) => {
      if (!key) return;
      if (key.ctrl && key.name === "c") {
        cleanup();
        rejectPromise(new PromptCancelError());
        return;
      }
      if (key.name === "up") {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
        return;
      }
      if (key.name === "down") {
        cursor = (cursor + 1) % items.length;
        render();
        return;
      }
      if (key.name === "space") {
        const id = items[cursor].id;
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
        render();
        return;
      }
      if (key.name === "return" || key.name === "enter") {
        cleanup();
        output.write("\n");
        resolvePromise(items.filter((i) => selected.has(i.id)).map((i) => i.id));
      }
    };

    input.on("keypress", onKey);
    render();
  });
}

/** Scripted answer that simulates the user cancelling (Ctrl+C / EOF). */
export const PROMPT_CANCELLED = Symbol("prompt-cancelled");

/**
 * Fake prompts for tests — scripted answers in order.
 * Any answer equal to PROMPT_CANCELLED throws the same cancellation error the
 * real TTY prompts produce.
 * @param {object} script
 */
export function createFakePrompts(script) {
  const confirms = [...(script.confirm ?? [])];
  const chooses = [...(script.choose ?? [])];
  const destructives = [...(script.confirmDestructive ?? [])];
  const multiSelects = [...(script.multiSelect ?? [])];
  const lines = [...(script.askLine ?? [])];

  const take = (queue, kind) => {
    if (!queue.length) throw new Error(`fake ${kind}: no more answers`);
    const ans = queue.shift();
    if (ans === PROMPT_CANCELLED) throw new PromptCancelError();
    return ans;
  };

  return {
    async confirm() {
      return take(confirms, "confirm");
    },
    async choose(_q, choices) {
      const ans = take(chooses, "choose");
      if (typeof ans === "number") return choices[ans];
      if (typeof ans === "string") {
        const found = choices.find((c) => (typeof c === "string" ? c : c.id ?? c.value) === ans);
        if (found) return found;
        const byLabel = choices.find((c) => (typeof c === "string" ? c : c.label) === ans);
        if (byLabel) return byLabel;
      }
      return ans;
    },
    async confirmDestructive() {
      return take(destructives, "confirmDestructive");
    },
    async multiSelect() {
      return take(multiSelects, "multiSelect");
    },
    async askLine() {
      return take(lines, "askLine");
    },
    close() {},
  };
}

// ---- guided wizard -----------------------------------------------------

/**
 * Guided installer. Uses injectable `prompts` (TTY or fake).
 *
 * Two phases: collect every choice first (no writes), then apply. Cancelling
 * (Ctrl+C / EOF) during any prompt therefore leaves the target untouched.
 * @returns {Promise<{ cancelled?: boolean, mutated?: boolean, framework?: string|null, installedPacks?: string[] }>}
 */
export async function runWizard({ targetDir, prompts }) {
  const classification = await classifyTarget(targetDir);
  let framework = null;
  let mutated = false;

  console.log("\n── Guided installer ──");

  try {
    // ---- Phase 1: collect choices (no filesystem writes) ----
    let action = classification.kind === "existing-kit" ? "skip" : "install";
    let updateBackup = true;
    let cleanBackup = true;
    let existingPacks = [];

    if (classification.kind === "existing-kit") {
      const stamp = classification.stamp ?? {};
      const ver = stamp.version ?? "unknown";
      existingPacks = stamp.installedPacks
        ? [...stamp.installedPacks]
        : await inferPacksFromDisk(targetDir);
      console.log(`\nLean Agent Kit is already installed (v${ver}).`);
      console.log(`  Packs: ${existingPacks.join(", ") || "(none)"}`);

      const chosen = await prompts.choose(
        "What would you like to do with the existing install?",
        [
          { id: "skip", label: "Skip update — keep files, continue to pack / next steps" },
          { id: "update", label: "Update — refresh core + installed packs (preserve memory)" },
          {
            id: "clean",
            label: "Delete and clean install — remove ALL kit files and memories, then reinstall",
          },
        ],
        { defaultIndex: 0 },
      );
      action = chosen.id;

      if (action === "update") {
        const backupChoice = await prompts.choose(
          "Update backup preference:",
          [
            { id: "backup", label: "Create backup of overwritten kit files" },
            { id: "no-backup", label: "Update without backup" },
          ],
          { defaultIndex: 0 },
        );
        updateBackup = backupChoice.id === "backup";
      } else if (action === "clean") {
        const ok = await prompts.confirmDestructive([
          "This deletes ALL Lean Agent Kit files and memories, then reinstalls from scratch.",
          "Includes: .agent/, .leanagentkit/, docs/memory/, docs/CODEBASE_MAP.md,",
          "AGENTS.md, LEAN_AGENT_KIT.md, LEAN_AGENT_KIT_GUIDE.md — plus docs/specs/ and",
          "docs/adr/ INCLUDING any specs and ADRs you authored yourself.",
          "Customized kit skills and session memory will be lost unless you back up.",
          ".leanagentkit-backup/ is not deleted.",
        ]);
        if (!ok) {
          console.log("\nCancelled — no changes made.");
          return { cancelled: true, mutated: false };
        }
        const backupChoice = await prompts.choose(
          "Clean install backup preference:",
          [
            { id: "backup", label: "Create backup, then delete and reinstall" },
            { id: "delete", label: "Permanently delete kit files (no backup)" },
          ],
          { defaultIndex: 0 },
        );
        cleanBackup = backupChoice.id === "backup";
      }
    }

    // Framework intent — empty target or clean reinstall only
    const preselected = new Set();
    if (classification.kind === "empty" || action === "clean") {
      const wantFramework = await prompts.confirm(
        "Scaffold a framework later via the agent (installs the stacks pack)?",
        { defaultYes: false },
      );
      if (wantFramework) {
        const fw = await prompts.choose(
          "Which base framework should the agent scaffold?",
          FRAMEWORK_OPTIONS.map((f) => ({ id: f.id, label: f.label })),
          { defaultIndex: 0 },
        );
        framework = fw.id;
        preselected.add("stacks");
        console.log(`\n  → stacks pack pre-selected; agent prompt will target ${fw.label}.`);
      }
    } else {
      // Occupied / existing kit: offer stacks (match-stack, additive scaffolders)
      const wantStacks = await prompts.confirm(
        "Install the stacks pack (stack detection / match-stack / additive scaffolders)?",
        { defaultYes: false },
      );
      if (wantStacks) preselected.add("stacks");
    }

    // Optional packs multi-select — the result is the authoritative selection
    const already = new Set(action === "clean" ? [] : existingPacks);
    const manifest = await loadManifest();
    const packItems = manifest.packs.map((p) => ({
      id: p.id,
      label: `${p.id} — ${p.name}`,
      description: p.description,
      selected: preselected.has(p.id) || already.has(p.id),
    }));

    console.log("\nOptional packs (dependencies like spec are added automatically):");
    if (already.size) {
      console.log(
        "  Already-installed packs are pre-selected. Unchecking one does NOT remove\n" +
          "  its files (use --prune-to-core --keep-pack <packs> for that).",
      );
    }
    const selection = [
      ...(await prompts.multiSelect(
        "Select packs to install (Space toggles, Enter confirms):",
        packItems,
      )),
    ];

    if (framework && !selection.includes("stacks")) {
      selection.push("stacks");
      console.log("\n  → stacks re-added: it is required for the chosen framework scaffold.");
    }

    const uncheckedInstalled = [...already].filter((id) => !selection.includes(id));
    if (uncheckedInstalled.length) {
      console.log(
        `\n  Note: unchecked installed pack(s) stay on disk: ${uncheckedInstalled.join(", ")}\n` +
          "  Remove them with: npx create-lean-agent-kit@latest . --prune-to-core --keep-pack <packs>",
      );
    }

    const resolved = selection.length ? await resolvePackDeps(selection) : [];
    const autoDeps = resolved.filter((id) => !selection.includes(id));
    if (autoDeps.length) {
      console.log(`\n  Also including dependencies: ${autoDeps.join(", ")}`);
    }

    // ---- Phase 2: apply ----
    mutated = true;
    let actionWord = "scaffolded";

    if (classification.kind !== "existing-kit") {
      await performScaffold(targetDir, resolved, { forceOverwrite: false, quiet: true });
    } else if (action === "clean") {
      await performCleanInstall(targetDir, {
        backup: cleanBackup,
        packIds: resolved,
        forceOverwrite: true,
      });
      actionWord = "reinstalled";
    } else {
      if (action === "update") {
        await performUpgrade(targetDir, { backup: updateBackup, quiet: true });
        console.log("\n✓ Update complete");
        actionWord = "updated";
      } else {
        actionWord = "ready";
      }
      const toEnable = resolved.filter((id) => !already.has(id));
      if (toEnable.length) {
        await performEnablePacks(targetDir, toEnable, { forceOverwrite: false, quiet: true });
        console.log(`\n✓ Enabled packs: ${toEnable.join(", ")}`);
      }
    }

    const stamp = (await readStamp(targetDir)) ?? {};
    const finalPacks = stamp.installedPacks ?? resolved;

    console.log(
      formatNextSteps({ framework, installedPacks: finalPacks, targetDir, action: actionWord }),
    );
    return { cancelled: false, mutated, framework, installedPacks: finalPacks };
  } catch (e) {
    if (e?.code === "PROMPT_CANCEL" || e?.name === "PromptCancelError") {
      console.log(
        mutated
          ? "\nCancelled — note: some changes were already applied (see log above)."
          : "\nCancelled — no changes made.",
      );
      return { cancelled: true, mutated };
    }
    throw e;
  } finally {
    prompts.close?.();
  }
}

// ---- flag-driven modes + CLI entry -------------------------------------

function printHelp(version) {
  console.log(`
create-lean-agent-kit v${version} — lean core memory kit + optional packs

Usage:
  npm create lean-agent-kit@latest              # guided installer (TTY) or core-only (non-TTY)
  npm create lean-agent-kit@latest my-app       # into ./my-app
  npx create-lean-agent-kit@latest . --with spec,stacks
  npx create-lean-agent-kit@latest . --upgrade
  npx create-lean-agent-kit@latest . --enable-pack practice
  npx create-lean-agent-kit@latest . --prune-to-core
  npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec,stacks

Guided installer (default when stdin/stdout are a TTY and no mode flags):
  Step-by-step: existing install handling, optional framework intent,
  multi-select packs. Keyboard: ↑/↓ move · Space select/unselect · Enter confirm.

Flags (non-interactive / CI):
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
}

/**
 * Parse CLI argv into structured options. Throws on invalid combinations.
 */
export function parseArgs(argv) {
  const flags = new Set();
  const flagValues = new Map();
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("-")) {
      if (a === "--with" || a === "--enable-pack" || a === "--keep-pack") {
        const val = argv[i + 1];
        if (!val || val.startsWith("-")) {
          const err = new Error(`${a} requires a value (comma-separated pack ids)`);
          err.code = "USAGE";
          throw err;
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

  const unknownFlags = [...flags].filter((f) => !KNOWN_FLAGS.has(f));
  if (unknownFlags.length > 0) {
    const hint = unknownFlags.some((f) => /upgrad|updade|udpate|upate/i.test(f))
      ? "\n  Did you mean --upgrade? (pin latest: npx create-lean-agent-kit@latest . --upgrade)"
      : "\n  Tip: npm create swallows flags unless you pass them after --\n" +
        "       e.g. npm create lean-agent-kit@latest . -- --upgrade";
    const err = new Error(`Unknown flag(s): ${unknownFlags.join(", ")}${hint}`);
    err.code = "USAGE";
    throw err;
  }

  const force = flags.has("--force") || flags.has("-f");
  const upgrade = flags.has("--upgrade") || flags.has("-u");
  const pruneToCore = flags.has("--prune-to-core");
  const showHelp = flags.has("--help") || flags.has("-h");
  const withPacksRaw = flagValues.get("--with") ?? "";
  const enablePackRaw = flagValues.get("--enable-pack") ?? "";
  const keepPackRaw = flagValues.get("--keep-pack") ?? "";

  const modeCount = [upgrade, pruneToCore, Boolean(enablePackRaw)].filter(Boolean).length;
  if (modeCount > 1) {
    const err = new Error("Use only one of: --upgrade, --prune-to-core, --enable-pack");
    err.code = "USAGE";
    throw err;
  }
  if (force && (upgrade || pruneToCore)) {
    const err = new Error(
      "--force is for scaffold / enable-pack overwrite only. Use --upgrade or --prune-to-core without --force.",
    );
    err.code = "USAGE";
    throw err;
  }
  if (withPacksRaw && (upgrade || pruneToCore || enablePackRaw)) {
    const err = new Error("--with is for initial scaffold only");
    err.code = "USAGE";
    throw err;
  }
  if (keepPackRaw && !pruneToCore) {
    const err = new Error("--keep-pack only applies with --prune-to-core");
    err.code = "USAGE";
    throw err;
  }

  return {
    target: resolve(positional[0] ?? "."),
    force,
    upgrade,
    pruneToCore,
    showHelp,
    withPacksRaw,
    enablePackRaw,
    keepPackRaw,
  };
}

async function scaffoldNonInteractive(targetDir, withPacksRaw, forceFlag) {
  if ((await kitPresent(targetDir)) && !forceFlag) {
    console.error(
      "✗ Lean Agent Kit is already installed here.\n" +
        "  Use --upgrade to refresh kit files while preserving your memory:\n" +
        "    npx create-lean-agent-kit@latest . --upgrade\n" +
        "  Or --enable-pack <packs> to add packs.\n" +
        "  Or --force to overwrite everything (will clobber user data).\n" +
        "  Or re-run in a TTY for the guided installer (skip / update / clean install).",
    );
    process.exit(1);
  }

  const requested = parsePackList(withPacksRaw);
  let result;
  try {
    result = await performScaffold(targetDir, requested, {
      forceOverwrite: forceFlag,
      quiet: true,
    });
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }

  console.log(formatNextSteps({ installedPacks: result.installedPacks, targetDir }));
}

async function runEnablePack(targetDir, enablePackRaw, forceFlag) {
  if (!(await kitPresent(targetDir))) {
    console.error("✗ No Lean Agent Kit found. Scaffold first (without --enable-pack).");
    process.exit(1);
  }

  const requested = parsePackList(enablePackRaw);
  if (!requested.length) {
    console.error("✗ --enable-pack requires at least one pack id");
    process.exit(1);
  }

  try {
    await performEnablePacks(targetDir, requested, { forceOverwrite: forceFlag });
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }

  console.log(`Update AGENTS.md §7 to list installed packs. Re-run wire-agent if you use Cursor or Claude Code:

    Read .agent/skills/leanagentkit-wire-agent.md and follow it.
`);
}

async function runUpgradeFlag(targetDir) {
  try {
    await performUpgrade(targetDir, { backup: true });
  } catch (e) {
    console.error(
      `✗ ${e.message}` +
        (e.message.includes("No Lean Agent Kit")
          ? " Run without --upgrade to scaffold first."
          : ""),
    );
    process.exit(1);
  }
}

async function runPrune(targetDir, keepPackRaw) {
  if (!(await kitPresent(targetDir))) {
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
  const stamp = (await readStamp(targetDir)) ?? {};
  const onDiskPacks = stamp.installedPacks?.length
    ? stamp.installedPacks
    : await inferPacksFromDisk(targetDir);

  const toRemove = manifest.packs.map((p) => p.id).filter((id) => !keepSet.has(id));

  const backupRoot = join(targetDir, ".leanagentkit-backup", `${backupTimestamp()}-prune`);
  let moved = 0;
  const userMemoryMoved = [];

  for (const id of toRemove) {
    const pack = await loadPack(id);
    for (const fileRel of pack.files ?? []) {
      if (fileRel === "pack.json") continue;
      const destRel = destRelFromTemplate(fileRel);
      const to = join(targetDir, destRel);
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

  const counts = emptyCounts();
  const backupRootRef = {
    root: join(targetDir, ".leanagentkit-backup", backupTimestamp()),
    dir: null,
  };
  console.log("\nRefreshing core");
  await copyOverlay(coreDir, targetDir, "upgrade", counts, backupRootRef);

  if (keepResolved.length) {
    await installPacks(keepResolved, targetDir, "upgrade", counts, backupRootRef);
  }

  const version = await readCliVersion();
  await writeVersionStamp(targetDir, version, keepResolved);

  const memoryNote = userMemoryMoved.length
    ? `\n  Note: ${userMemoryMoved.length} pack memory file(s) moved to backup (e.g. PROGRESS/SCRATCH/reminders).\n` +
      `  User-authored specs under docs/specs/ (if any) were left in place.\n` +
      `  Memory files: ${userMemoryMoved.join(", ")}`
    : "";

  console.log(`
✓ Pruned to core${keepResolved.length ? ` + packs: ${keepResolved.join(", ")}` : ""}
  Moved ${moved} pack file(s) to ${relative(targetDir, backupRoot) || backupRoot}
  Previous stamp packs: ${onDiskPacks.join(", ") || "(none)"}${memoryNote}

Important — AGENTS.md is preserved and may still list removed packs in §7.
Review AGENTS.md §7 and clear stale pack/skill lines. Core ACTIVE_CONTEXT and LEARNINGS were kept.

Re-enable packs with:
    npx create-lean-agent-kit@latest . --enable-pack <packs>

Re-run wire-agent if you use Cursor or Claude Code.
`);
}

/**
 * CLI entry used by bin/cli.mjs. Safe to call from tests with a custom argv.
 * @param {string[]} [argv]
 * @param {{ interactive?: boolean, prompts?: object }} [opts]
 */
export async function runCli(argv = process.argv.slice(2), opts = {}) {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }

  const {
    target: targetDir,
    force: forceFlag,
    upgrade,
    pruneToCore,
    showHelp,
    withPacksRaw,
    enablePackRaw,
    keepPackRaw,
  } = parsed;

  if (!(await exists(templateDir)) || !(await exists(coreDir))) {
    console.error("✗ template/core/ not found in the package. Reinstall create-lean-agent-kit.");
    process.exit(1);
  }

  const version = await readCliVersion();
  if (showHelp) {
    printHelp(version);
    return;
  }

  console.log(`create-lean-agent-kit v${version}`);

  if (pruneToCore) {
    await runPrune(targetDir, keepPackRaw);
  } else if (enablePackRaw) {
    await runEnablePack(targetDir, enablePackRaw, forceFlag);
  } else if (upgrade) {
    await runUpgradeFlag(targetDir);
  } else {
    const wantInteractive =
      opts.interactive === true ||
      (opts.interactive !== false &&
        !withPacksRaw &&
        !forceFlag &&
        isInteractiveTty());
    if (wantInteractive) {
      const prompts = opts.prompts ?? createTtyPrompts();
      try {
        await runWizard({ targetDir, prompts });
      } catch (e) {
        prompts.close?.();
        throw e;
      }
    } else {
      await scaffoldNonInteractive(targetDir, withPacksRaw, forceFlag);
    }
  }
}

