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

test("prints package version before scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-version-banner-"));
  try {
    const out = runCli(dir);
    const pkgVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
    assert.match(out, new RegExp(`create-lean-agent-kit v${pkgVersion.replace(/\./g, "\\.")}`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("scaffolds core only by default", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    assert.ok(existsSync(join(dir, "AGENTS.md")), "AGENTS.md copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")), "bootstrap");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-enable-pack.md")), "enable-pack");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-migrate-1.md")), "migrate-1");
    assert.ok(existsSync(join(dir, "docs/CODEBASE_MAP.md")), "codebase map");
    assert.ok(existsSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md")), "active context");
    assert.ok(existsSync(join(dir, "docs/memory/LEARNINGS.md")), "learnings");
    assert.ok(existsSync(join(dir, "LEAN_AGENT_KIT.md")), "README renamed");
    assert.ok(!existsSync(join(dir, "README.md")), "did not write README.md");

    // Packs must NOT be present
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")), "no grill");
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-scaffold.md")), "no scaffold");
    assert.ok(!existsSync(join(dir, ".agent/scaffolders/registry.md")), "no scaffolders");
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-ask-trevor.md")), "no trevor");
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-caveman.md")), "no caveman");
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-imaginary.md")), "no imaginary");
    assert.ok(
      !existsSync(join(dir, ".agent/skills/scripts/check_imaginary.sh")),
      "no imaginary script",
    );
    assert.ok(!existsSync(join(dir, "docs/memory/REMINDERS.md")), "no reminders");
    assert.ok(!existsSync(join(dir, ".leanagentkit/trevor.yml.example")), "no trevor example");
    assert.ok(!existsSync(join(dir, ".leanagentkit/imaginary.yml.example")), "no imaginary example");

    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.deepEqual(stamp.installedPacks, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--with installs packs and resolves dependencies", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-with-"));
  try {
    runCli(dir, "--with", "architecture");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-architecture.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")), "spec dep");
    assert.ok(existsSync(join(dir, "docs/specs/_TEMPLATE.md")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(stamp.installedPacks.includes("architecture"));
    assert.ok(stamp.installedPacks.includes("spec"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--enable-pack adds packs to existing install", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-enable-"));
  try {
    runCli(dir);
    runCli(dir, "--enable-pack", "stacks,practice");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-match-stack.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-review.md")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(stamp.installedPacks.includes("stacks"));
    assert.ok(stamp.installedPacks.includes("practice"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--enable-pack rejects unknown pack", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-bad-pack-"));
  try {
    runCli(dir);
    const result = runCliCapture(dir, "--enable-pack", "not-a-pack");
    assert.equal(result.status, 1);
    assert.match(`${result.stdout}\n${result.stderr}`, /Unknown pack/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--prune-to-core archives pack files", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-prune-"));
  try {
    runCli(dir, "--with", "spec,stacks");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
    runCli(dir, "--prune-to-core");
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
    assert.ok(!existsSync(join(dir, ".agent/scaffolders/registry.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.deepEqual(stamp.installedPacks, []);
    assert.ok(existsSync(join(dir, ".leanagentkit-backup")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--prune-to-core --keep-pack retains listed packs", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-keep-"));
  try {
    runCli(dir, "--with", "spec,stacks,practice");
    runCli(dir, "--prune-to-core", "--keep-pack", "spec");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")));
    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-review.md")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.deepEqual(stamp.installedPacks, ["spec"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--prune-to-core preserves core ACTIVE_CONTEXT and LEARNINGS and warns about AGENTS.md §7", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-prune-memory-"));
  try {
    runCli(dir, "--with", "spec");
    const userContext = "# MY ACTIVE CONTEXT — do not lose\n";
    const userLearnings = "# MY LEARNINGS — do not lose\n";
    writeFileSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md"), userContext);
    writeFileSync(join(dir, "docs/memory/LEARNINGS.md"), userLearnings);
    writeFileSync(join(dir, "docs/memory/PROGRESS.md"), "# my progress history\n");
    writeFileSync(join(dir, "docs/specs/my-feature.md"), "# user authored spec\n");

    const out = runCli(dir, "--prune-to-core");
    assert.equal(
      readFileSync(join(dir, "docs/memory/ACTIVE_CONTEXT.md"), "utf8"),
      userContext,
      "ACTIVE_CONTEXT preserved through prune",
    );
    assert.equal(
      readFileSync(join(dir, "docs/memory/LEARNINGS.md"), "utf8"),
      userLearnings,
      "LEARNINGS preserved through prune",
    );
    assert.ok(existsSync(join(dir, "docs/specs/my-feature.md")), "user specs left in place");
    assert.ok(!existsSync(join(dir, "docs/memory/PROGRESS.md")), "PROGRESS archived with pack");
    assert.match(out, /AGENTS\.md/i);
    assert.match(out, /§7|section 7/i);
    assert.match(out, /PROGRESS|memory file/i);
    assert.match(out, /LEARNINGS/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("--enable-pack imaginary copies skill, script, reference, and config example", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-imaginary-"));
  try {
    runCli(dir);
    runCli(dir, "--enable-pack", "imaginary");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-imaginary.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/scripts/check_imaginary.sh")));
    assert.ok(
      existsSync(join(dir, ".agent/skills/references/imaginary/api-reference.md")),
    );
    assert.ok(existsSync(join(dir, ".leanagentkit/imaginary.yml.example")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(stamp.installedPacks.includes("imaginary"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--prune-to-core removes imaginary pack files including scripts/", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-prune-imaginary-"));
  try {
    runCli(dir, "--with", "imaginary");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-imaginary.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/scripts/check_imaginary.sh")));
    assert.ok(
      existsSync(join(dir, ".agent/skills/references/imaginary/api-reference.md")),
    );
    assert.ok(existsSync(join(dir, ".leanagentkit/imaginary.yml.example")));

    runCli(dir, "--prune-to-core");

    assert.ok(!existsSync(join(dir, ".agent/skills/leanagentkit-imaginary.md")));
    assert.ok(!existsSync(join(dir, ".agent/skills/scripts/check_imaginary.sh")));
    assert.ok(
      !existsSync(join(dir, ".agent/skills/references/imaginary/api-reference.md")),
    );
    assert.ok(!existsSync(join(dir, ".leanagentkit/imaginary.yml.example")));
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(!stamp.installedPacks.includes("imaginary"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--enable-pack backlog auto-installs spec dependency", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-dep-backlog-"));
  try {
    runCli(dir);
    const out = runCli(dir, "--enable-pack", "backlog");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-backlog.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")), "spec dep");
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(stamp.installedPacks.includes("backlog"));
    assert.ok(stamp.installedPacks.includes("spec"));
    assert.match(out, /dependencies/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--enable-pack git-lifecycle auto-installs spec dependency", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-dep-git-"));
  try {
    runCli(dir);
    runCli(dir, "--enable-pack", "git-lifecycle");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-git-lifecycle.md")));
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-grill.md")), "spec dep");
    const stamp = JSON.parse(readFileSync(join(dir, ".agent/.leanagentkit-version"), "utf8"));
    assert.ok(stamp.installedPacks.includes("git-lifecycle"));
    assert.ok(stamp.installedPacks.includes("spec"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--enable-pack --force backs up overwritten pack files", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-enable-force-"));
  try {
    runCli(dir, "--with", "practice");
    const custom = "# MY CUSTOM REVIEW SKILL\n";
    writeFileSync(join(dir, ".agent/skills/leanagentkit-review.md"), custom);
    const out = runCli(dir, "--enable-pack", "practice", "--force");
    assert.doesNotMatch(
      readFileSync(join(dir, ".agent/skills/leanagentkit-review.md"), "utf8"),
      /MY CUSTOM REVIEW/,
    );
    assert.ok(existsSync(join(dir, ".leanagentkit-backup")), "backup created");
    assert.match(out, /Backed up/i);
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
    assert.match(`${result.stdout}\n${result.stderr}`, /scaffold|enable-pack/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
