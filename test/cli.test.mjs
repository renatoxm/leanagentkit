import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("scaffolds kit files into a target dir", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    assert.ok(existsSync(join(dir, "AGENTS.md")), "AGENTS.md copied");
    assert.ok(existsSync(join(dir, ".agent/skills/leanagentkit-bootstrap.md")), "bootstrap skill copied");
    assert.ok(existsSync(join(dir, "docs/CODEBASE_MAP.md")), "codebase map copied");
    assert.ok(existsSync(join(dir, "LEAN_AGENT_KIT.md")), "README renamed on copy");
    assert.ok(!existsSync(join(dir, "README.md")), "did not write README.md");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("skips existing files without --force", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const out = execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" }).toString();
    assert.match(out, /skip/, "reports skipped files on second run");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
