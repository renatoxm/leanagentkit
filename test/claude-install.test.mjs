import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  listKitSkills,
  parseFrontmatter,
  wireClaude,
} from "./helpers/skills.mjs";

const TEMPLATE_CLAUDE = join(process.cwd(), "template", ".agent", "install", "claude");

test("claude install templates exist after scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-claude-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const installDir = join(dir, ".agent", "install", "claude");
    assert.ok(existsSync(join(installDir, "CLAUDE.md")));
    assert.ok(existsSync(join(installDir, "README.md")));
    assert.ok(!existsSync(join(installDir, "skills")), "no pre-shipped claude skill wrappers");
    assert.ok(!existsSync(join(dir, "CLAUDE.md")), "scaffold does not ship CLAUDE.md");
    assert.ok(!existsSync(join(dir, ".claude")), "scaffold does not ship .claude/");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLAUDE.md template references AGENTS.md", async () => {
  const content = await readFile(join(TEMPLATE_CLAUDE, "CLAUDE.md"), "utf8");
  assert.match(content, /AGENTS\.md/);
  assert.match(content, /ACTIVE_CONTEXT\.md/);
  assert.match(content, /CODEBASE_MAP\.md/);
});

test("wire-agent generates claude wrappers under .claude/skills/", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-claude-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const skills = await wireClaude(dir);

    const claudePath = join(dir, "CLAUDE.md");
    assert.ok(existsSync(claudePath), "CLAUDE.md copied to root");

    const skillDirs = await readdir(join(dir, ".claude", "skills"), { withFileTypes: true });
    const dirs = skillDirs.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.equal(dirs.length, skills.length, "all skill wrappers generated");

    for (const skill of skills) {
      assert.ok(dirs.includes(skill.name), `generated ${skill.name}`);
      const content = await readFile(
        join(dir, ".claude", "skills", skill.name, "SKILL.md"),
        "utf8",
      );
      const fm = parseFrontmatter(content);
      assert.equal(fm.name, skill.name);
      assert.equal(fm.description, skill.description);
      assert.equal(fm["disable-model-invocation"], undefined, `${skill.name}: no disable-model-invocation`);
      assert.match(content, new RegExp(`\\.agent/skills/${skill.file}`));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
