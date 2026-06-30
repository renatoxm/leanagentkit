import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CLI = "bin/cli.mjs";
const PKG_VERSION = JSON.parse(readFileSync("package.json", "utf8")).version;

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
    assert.ok(stamp.updatedAt);
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

test("scaffold writes version stamp", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-stamp-"));
  try {
    runCli(dir);
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.equal(stamp.version, PKG_VERSION);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
