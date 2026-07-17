import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CLI = "bin/cli.mjs";
const PKG_VERSION = JSON.parse(readFileSync("package.json", "utf8")).version;
const CORE_BOOTSTRAP = join(
  process.cwd(),
  "template",
  "core",
  ".agent",
  "skills",
  "leanagentkit-bootstrap.md",
);

function runCli(dir, ...args) {
  return execFileSync("node", [CLI, dir, ...args], { stdio: "pipe" }).toString();
}

test("upgrade preserves user-owned files and refreshes kit-owned files", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-"));
  try {
    runCli(dir);
    const userAgents = "# MY CUSTOM AGENTS CONTENT";
    const userContext = "# MY ACTIVE CONTEXT";
    const staleSkill = "# STALE SKILL CONTENT";
    writeFileSync(join(dir, "AGENTS.md"), userAgents);
    writeFileSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md"), userContext);
    writeFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), staleSkill);

    const out = runCli(dir, "--upgrade");
    assert.match(out, /upgraded/i);
    assert.match(out, new RegExp(`${PKG_VERSION}`));

    assert.equal(readFileSync(join(dir, "AGENTS.md"), "utf8"), userAgents, "AGENTS.md preserved");
    assert.equal(
      readFileSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md"), "utf8"),
      userContext,
      "ACTIVE_CONTEXT preserved",
    );
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "utf8"),
      /STALE SKILL/,
      "kit skill refreshed from template",
    );

    const backupRoot = join(dir, ".leanagentkit-backup");
    assert.ok(existsSync(backupRoot), "backup dir created");
    const stampDirs = readdirSync(backupRoot);
    assert.ok(stampDirs.length >= 1, "timestamped backup subdir exists");
    const backupSkill = join(backupRoot, stampDirs[0], ".agent/skills/leanagentkit-bootstrap.md");
    assert.ok(existsSync(backupSkill), "overwritten skill backed up");
    assert.equal(readFileSync(backupSkill, "utf8"), staleSkill);

    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.equal(stamp.version, PKG_VERSION);
    assert.ok(Array.isArray(stamp.installedPacks));
    assert.ok(stamp.updatedAt);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade preserves pack user memory when packs installed", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-packs-"));
  try {
    runCli(dir, "--with", "trevor,authoring");
    const userReminders = "# MY CUSTOM REMINDERS";
    const userRegistry = "# MY GENERATED REGISTRY";
    writeFileSync(join(dir, "docs/memory/REMINDERS.md"), userReminders);
    writeFileSync(join(dir, ".agent/skills/generated/README.md"), userRegistry);

    runCli(dir, "--upgrade");

    assert.equal(readFileSync(join(dir, "docs/memory/REMINDERS.md"), "utf8"), userReminders);
    assert.equal(
      readFileSync(join(dir, ".agent/skills/generated/README.md"), "utf8"),
      userRegistry,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade on clean install creates no backup dir when files match template", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-clean-"));
  try {
    runCli(dir);
    runCli(dir, "--upgrade");
    assert.ok(!existsSync(join(dir, ".leanagentkit-backup")), "no backup when nothing changed");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade fails when kit is not installed", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-missing-"));
  try {
    assert.throws(
      () => runCli(dir, "--upgrade"),
      (err) => err.status === 1,
      "exits with code 1",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("scaffold writes version stamp with installedPacks", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-stamp-"));
  try {
    runCli(dir);
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.equal(stamp.version, PKG_VERSION);
    assert.deepEqual(stamp.installedPacks, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("bootstrap offers packs and enable-pack flow", () => {
  const bootstrap = readFileSync(CORE_BOOTSTRAP, "utf8");
  assert.match(bootstrap, /Optional packs/i);
  assert.match(bootstrap, /enable-pack/);
  assert.match(bootstrap, /trevor/);
  assert.match(bootstrap, /caveman/);
  assert.match(bootstrap, /architecture/);
});

test("upgrade preserves scaffolder registry and refreshes recipes when stacks pack installed", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-preserve-"));
  try {
    runCli(dir, "--with", "stacks,trevor");
    const userChecklist = "# MY CUSTOM CHECKLIST";
    const userWorkflow = "# MY CUSTOM WORKFLOW";
    const userScaffolderRegistry = "# MY CUSTOM SCAFFOLDER REGISTRY";
    const userKitReadme = "# MY CUSTOM LEAN_AGENT_KIT";
    const staleExpress = "# STALE EXPRESS RECIPE";
    mkdirSync(join(dir, "docs/memory/CHECKLISTS"), { recursive: true });
    mkdirSync(join(dir, "docs/memory/WORKFLOWS"), { recursive: true });
    writeFileSync(join(dir, "docs/memory/CHECKLISTS/weekly-review.md"), userChecklist);
    writeFileSync(join(dir, "docs/memory/WORKFLOWS/weekly-review.md"), userWorkflow);
    writeFileSync(join(dir, ".agent/scaffolders/registry.md"), userScaffolderRegistry);
    writeFileSync(join(dir, "LEAN_AGENT_KIT.md"), userKitReadme);
    writeFileSync(join(dir, ".agent/scaffolders/express.scaffold.md"), staleExpress);

    runCli(dir, "--upgrade");

    assert.equal(
      readFileSync(join(dir, "docs/memory/CHECKLISTS/weekly-review.md"), "utf8"),
      userChecklist,
    );
    assert.equal(
      readFileSync(join(dir, "docs/memory/WORKFLOWS/weekly-review.md"), "utf8"),
      userWorkflow,
    );
    assert.equal(
      readFileSync(join(dir, ".agent/scaffolders/registry.md"), "utf8"),
      userScaffolderRegistry,
    );
    assert.equal(readFileSync(join(dir, "LEAN_AGENT_KIT.md"), "utf8"), userKitReadme);
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/scaffolders/express.scaffold.md"), "utf8"),
      /STALE EXPRESS/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade leaves user-created .leanagentkit/caveman.yml untouched", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-caveman-"));
  try {
    runCli(dir, "--with", "caveman");
    const userCaveman = "enabled: true\nterse_commits: false\nterse_reviews: true\n";
    const cavemanPath = join(dir, ".leanagentkit", "caveman.yml");
    writeFileSync(cavemanPath, userCaveman);

    runCli(dir, "--upgrade");

    assert.equal(readFileSync(cavemanPath, "utf8"), userCaveman, "caveman.yml preserved");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade refreshes authoring pack skills when installed", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-create-skill-"));
  try {
    runCli(dir, "--with", "authoring");
    const createSkillPath = join(dir, ".agent", "skills", "leanagentkit-create-skill.md");
    const glossaryPath = join(
      dir,
      ".agent",
      "skills",
      "references",
      "skill-craft-glossary.md",
    );
    assert.ok(existsSync(createSkillPath));
    assert.ok(existsSync(glossaryPath));

    writeFileSync(createSkillPath, "# STALE CREATE SKILL");
    writeFileSync(glossaryPath, "# STALE GLOSSARY");

    runCli(dir, "--upgrade");

    assert.match(readFileSync(createSkillPath, "utf8"), /craft pass only/i);
    assert.match(readFileSync(glossaryPath, "utf8"), /LAK overrides/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("upgrade does not delete orphan pack files from 0.x-style installs", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-orphan-"));
  try {
    runCli(dir);
    // Simulate leftover pack skill without stamp listing
    const orphan = join(dir, ".agent/skills/leanagentkit-grill.md");
    writeFileSync(orphan, "# orphan grill from 0.x\n");
    const stampPath = join(dir, ".agent/.leanagentkit-version");
    writeFileSync(
      stampPath,
      JSON.stringify({ version: "0.4.21", updatedAt: new Date().toISOString() }, null, 2) + "\n",
    );

    runCli(dir, "--upgrade");
    assert.ok(existsSync(orphan), "orphan file not deleted on additive upgrade");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
