import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  classifyTarget,
  createFakePrompts,
  formatNextSteps,
  formatWireAgentNextStep,
  WIRE_AGENT_PROMPT,
  performCleanInstall,
  performScaffold,
  performUpgrade,
  runCli,
  runWizard,
  PROMPT_CANCELLED,
} from "../bin/lak.mjs";

const CLI = "bin/cli.mjs";

function runCliCapture(dir, ...args) {
  const result = spawnSync("node", [CLI, dir, ...args], { encoding: "utf8" });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status,
  };
}

test("classifyTarget: empty, occupied, existing-kit", async () => {
  const empty = mkdtempSync(join(tmpdir(), "lak-class-empty-"));
  const occupied = mkdtempSync(join(tmpdir(), "lak-class-occ-"));
  const kit = mkdtempSync(join(tmpdir(), "lak-class-kit-"));
  try {
    writeFileSync(join(occupied, "package.json"), "{}\n");
    await performScaffold(kit, [], { quiet: true });

    assert.equal((await classifyTarget(empty)).kind, "empty");
    assert.equal((await classifyTarget(occupied)).kind, "occupied");
    assert.equal((await classifyTarget(kit)).kind, "existing-kit");
  } finally {
    rmSync(empty, { recursive: true, force: true });
    rmSync(occupied, { recursive: true, force: true });
    rmSync(kit, { recursive: true, force: true });
  }
});

test("formatNextSteps reflects framework / stacks / core-only", () => {
  const withFw = formatNextSteps({
    framework: "next",
    installedPacks: ["stacks"],
    targetDir: "/tmp/x",
  });
  assert.match(withFw, /leanagentkit-scaffold/);
  assert.match(withFw, /Next\.js/);
  assert.match(withFw, /bootstrap/);

  const stacksOnly = formatNextSteps({
    installedPacks: ["stacks", "practice"],
    targetDir: "/tmp/x",
  });
  assert.match(stacksOnly, /match-stack/);
  assert.doesNotMatch(stacksOnly, /leanagentkit-scaffold\.md and scaffold/);

  const core = formatNextSteps({ installedPacks: [], targetDir: "/tmp/x" });
  assert.match(core, /leanagentkit-bootstrap/);
  assert.doesNotMatch(core, /match-stack/);
});

test("formatWireAgentNextStep includes the full pasteable prompt", () => {
  const block = formatWireAgentNextStep();
  assert.match(block, /open your AI agent in this project and say/i);
  assert.match(block, /Cursor or Claude Code/);
  assert.ok(block.includes(`    ${WIRE_AGENT_PROMPT}`));
});

test("wizard empty: framework intent installs stacks and prints scaffold prompt", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-empty-"));
  try {
    const prompts = createFakePrompts({
      confirm: [true], // want framework
      choose: ["next"], // framework
      multiSelect: [["stacks", "practice"]],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.equal(result.cancelled, false);
    assert.equal(result.framework, "next");
    assert.ok(result.installedPacks.includes("stacks"));
    assert.ok(result.installedPacks.includes("practice"));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-scaffold.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-review.md")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard empty: architecture selection auto-includes spec", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-deps-"));
  try {
    const prompts = createFakePrompts({
      confirm: [false], // no framework
      multiSelect: [["architecture"]],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.ok(result.installedPacks.includes("architecture"));
    assert.ok(result.installedPacks.includes("spec"));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard empty: unchecking stacks with framework intent re-adds it", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-readd-"));
  try {
    const prompts = createFakePrompts({
      confirm: [true], // want framework
      choose: ["sveltekit"],
      multiSelect: [[]], // user unchecks everything, including stacks
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.equal(result.framework, "sveltekit");
    assert.ok(result.installedPacks.includes("stacks"), "stacks forced back for framework");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-scaffold.md")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard occupied (non-kit) folder: packs install alongside existing files", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-occ-"));
  try {
    writeFileSync(join(dir, "package.json"), '{ "name": "my-app" }\n');
    const prompts = createFakePrompts({
      confirm: [true], // stacks for occupied repo (match-stack)
      multiSelect: [["stacks", "practice"]],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.equal(result.framework, null, "no base framework offered on occupied folder");
    assert.ok(result.installedPacks.includes("stacks"));
    assert.ok(result.installedPacks.includes("practice"));
    assert.equal(
      readFileSync(join(dir, "package.json"), "utf8"),
      '{ "name": "my-app" }\n',
      "existing files untouched",
    );
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-match-stack.md")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard existing: skip update then enable stacks", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-skip-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    const prompts = createFakePrompts({
      choose: ["skip"],
      confirm: [true], // want stacks
      multiSelect: [["stacks"]],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.ok(result.installedPacks.includes("stacks"));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-match-stack.md")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard existing: update with backup", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-upd-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    writeFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "# STALE\n");
    const prompts = createFakePrompts({
      choose: ["update", "backup"],
      confirm: [false], // no stacks
      multiSelect: [[]],
    });
    await runWizard({ targetDir: dir, prompts });
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "utf8"),
      /STALE/,
    );
    assert.ok(existsSync(join(dir, ".leanagentkit-backup")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard existing: update without backup", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-upd-nb-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    writeFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "# STALE\n");
    const prompts = createFakePrompts({
      choose: ["update", "no-backup"],
      confirm: [false],
      multiSelect: [[]],
    });
    await runWizard({ targetDir: dir, prompts });
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "utf8"),
      /STALE/,
    );
    assert.ok(!existsSync(join(dir, ".leanagentkit-backup")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard existing: clean install with backup then packs", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-clean-"));
  try {
    await performScaffold(dir, ["spec"], { quiet: true });
    writeFileSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md"), "# MY MEMORY\n");
    writeFileSync(join(dir, "AGENTS.md"), "# MY AGENTS\n");

    const prompts = createFakePrompts({
      choose: ["clean", "backup"],
      confirmDestructive: [true],
      confirm: [false], // no framework after clean
      multiSelect: [["practice"]],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.ok(result.installedPacks.includes("practice"));
    assert.ok(!result.installedPacks.includes("spec"));
    assert.doesNotMatch(readFileSync(join(dir, "AGENTS.md"), "utf8"), /MY AGENTS/);
    assert.ok(existsSync(join(dir, ".leanagentkit-backup")));
    const backups = readdirSync(join(dir, ".leanagentkit-backup"));
    assert.ok(backups.some((n) => n.includes("clean-install")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard existing: clean install permanently deletes when confirmed", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-clean-del-"));
  try {
    await performScaffold(dir, ["trevor"], { quiet: true });
    writeFileSync(join(dir, "docs/memory/REMINDERS.md"), "# keep?\n");

    const prompts = createFakePrompts({
      choose: ["clean", "delete"],
      confirmDestructive: [true],
      confirm: [false],
      multiSelect: [[]],
    });
    await runWizard({ targetDir: dir, prompts });
    assert.ok(!existsSync(join(dir, "docs/memory/REMINDERS.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")));
    assert.ok(!existsSync(join(dir, ".leanagentkit-backup")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard clean install cancelled at destructive confirm makes no changes", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-cancel-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    writeFileSync(join(dir, "AGENTS.md"), "# CUSTOM KEEP\n");

    const prompts = createFakePrompts({
      choose: ["clean"],
      confirmDestructive: [false],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.equal(result.cancelled, true);
    assert.equal(readFileSync(join(dir, "AGENTS.md"), "utf8"), "# CUSTOM KEEP\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard cancel at pack multi-select after choosing update makes no changes", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-cancel-late-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    writeFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "# STALE KEEP\n");

    const prompts = createFakePrompts({
      choose: ["update", "backup"],
      confirm: [false],
      multiSelect: [PROMPT_CANCELLED],
    });
    const result = await runWizard({ targetDir: dir, prompts });
    assert.equal(result.cancelled, true);
    assert.equal(result.mutated, false, "no writes before the apply phase");
    assert.equal(
      readFileSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md"), "utf8"),
      "# STALE KEEP\n",
      "update was not applied",
    );
    assert.ok(!existsSync(join(dir, ".leanagentkit-backup")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wizard clean install removes user-authored specs (documented data loss)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wiz-clean-specs-"));
  try {
    await performScaffold(dir, ["spec"], { quiet: true });
    writeFileSync(join(dir, "docs/specs/my-feature.md"), "# user authored spec\n");

    const prompts = createFakePrompts({
      choose: ["clean", "delete"],
      confirmDestructive: [true],
      confirm: [false],
      multiSelect: [[]],
    });
    await runWizard({ targetDir: dir, prompts });
    assert.ok(
      !existsSync(join(dir, "docs/specs/my-feature.md")),
      "clean install removes docs/specs entirely (unlike --prune-to-core)",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("performCleanInstall removes pack overlays then reinstalls core", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-footprint-"));
  try {
    await performScaffold(dir, ["spec"], { quiet: true });
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
    await performCleanInstall(dir, { backup: false, packIds: [], forceOverwrite: true });
    assert.ok(existsSync(join(dir, "AGENTS.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")));
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.deepEqual(stamp.installedPacks, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("performUpgrade backup=false does not create backup dir", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-upg-nb-"));
  try {
    await performScaffold(dir, [], { quiet: true });
    writeFileSync(join(dir, ".agent/skills/leanagentkit-check.md"), "# STALE CHECK\n");
    await performUpgrade(dir, { backup: false, quiet: true });
    assert.ok(!existsSync(join(dir, ".leanagentkit-backup")));
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/skills/leanagentkit-check.md"), "utf8"),
      /STALE CHECK/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("non-TTY / flag path: runCli with interactive:false does not prompt", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-nontty-"));
  try {
    await runCli([dir], { interactive: false });
    assert.ok(existsSync(join(dir, ".agent/.leanagentkit-version")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("subprocess without TTY stays non-interactive (no hang)", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-subproc-"));
  try {
    const result = runCliCapture(dir);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /scaffolded/i);
    assert.doesNotMatch(result.stdout, /Guided installer/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("subprocess --upgrade does not enter wizard", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-sub-up-"));
  try {
    assert.equal(runCliCapture(dir).status, 0);
    const result = runCliCapture(dir, "--upgrade");
    assert.equal(result.status, 0);
    assert.match(result.stdout, /upgraded/i);
    assert.doesNotMatch(result.stdout, /Guided installer/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
