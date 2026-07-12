import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CLI = "bin/cli.mjs";

function runCli(dir, ...args) {
  return execFileSync("node", [CLI, dir, ...args], { stdio: "pipe" }).toString();
}

function runCliCapture(dir, ...args) {
  const result = spawnSync("node", [CLI, dir, ...args], { encoding: "utf8" });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status,
  };
}

test("scaffolds kit files into a target dir", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    assert.ok(existsSync(join(dir, "AGENTS.md")), "AGENTS.md copied");
    assert.ok(existsSync(join(dir, ".agent/scaffolders/registry.md")), "scaffolders registry copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-scaffold.md")), "scaffold skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")), "bootstrap skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-ask-trevor.md")), "trevor skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-caveman.md")), "caveman skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-caveman-commit.md")), "caveman-commit skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-caveman-review.md")), "caveman-review skill copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-create-skill.md")), "create-skill copied");
    assert.ok(
      existsSync(join(dir, ".agent/skills/references/skill-craft-glossary.md")),
      "skill-craft-glossary copied",
    );
    assert.ok(existsSync(join(dir, "docs/memory/REMINDERS.md")), "reminders template copied");
    assert.ok(existsSync(join(dir, ".leanagentkit/trevor.yml.example")), "trevor config example copied");
    assert.ok(existsSync(join(dir, ".leanagentkit/caveman.yml.example")), "caveman config example copied");
    assert.ok(existsSync(join(dir, "docs/CODEBASE_MAP.md")), "codebase map copied");
    assert.ok(existsSync(join(dir, "LEAN_AGENT_KIT.md")), "README renamed on copy");
    assert.ok(!existsSync(join(dir, "README.md")), "did not write README.md");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("skips existing non-kit files without --force", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-"));
  try {
    writeFileSync(join(dir, "AGENTS.md"), "# pre-existing\n");
    const out = execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" }).toString();
    assert.match(out, /skip/, "reports skipped files when target has collisions");
    assert.match(out, /scaffolded/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("exits when re-scaffolding an existing kit without --force or --upgrade", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-warn-"));
  try {
    runCli(dir);
    const { stderr, stdout, status } = runCliCapture(dir);
    const combined = `${stdout}\n${stderr}`;
    assert.equal(status, 1);
    assert.match(combined, /already installed/i);
    assert.match(combined, /--upgrade/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects unknown flags and hints at --upgrade typos", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-unknown-flag-"));
  try {
    const result = runCliCapture(dir, "--updade");
    assert.equal(result.status, 1);
    assert.match(`${result.stdout}\n${result.stderr}`, /Unknown flag/i);
    assert.match(`${result.stdout}\n${result.stderr}`, /--upgrade/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--force overwrites existing kit files on scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-force-"));
  try {
    runCli(dir);
    const custom = "# MY CUSTOM AGENTS";
    writeFileSync(join(dir, "AGENTS.md"), custom);
    runCli(dir, "--force");
    assert.doesNotMatch(readFileSync(join(dir, "AGENTS.md"), "utf8"), /MY CUSTOM AGENTS/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--upgrade --force is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upgrade-force-"));
  try {
    runCli(dir);
    const result = runCliCapture(dir, "--upgrade", "--force");
    assert.equal(result.status, 1);
    assert.match(`${result.stdout}\n${result.stderr}`, /scaffold mode only/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
