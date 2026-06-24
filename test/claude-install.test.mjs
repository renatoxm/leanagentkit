import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, readFile, readdir } from "node:fs/promises";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SKILL_NAMES = [
  "bootstrap",
  "match-stack",
  "map-codebase",
  "init-conventions",
  "seed-adrs",
  "new-spec",
  "start-session",
  "end-session",
  "skill-artifact-template",
];

const TEMPLATE_CLAUDE = join(process.cwd(), "template", ".agent", "install", "claude");

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, "expected YAML frontmatter");
  const fields = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

async function wireClaude(targetDir) {
  const claudeFrom = join(TEMPLATE_CLAUDE, "CLAUDE.md");
  const skillsFrom = join(TEMPLATE_CLAUDE, "skills");
  await cp(claudeFrom, join(targetDir, "CLAUDE.md"));
  await cp(skillsFrom, join(targetDir, ".claude", "skills"), { recursive: true });
}

test("claude install templates exist after scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-claude-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const installDir = join(dir, ".agent", "install", "claude");
    assert.ok(existsSync(join(installDir, "CLAUDE.md")));
    assert.ok(existsSync(join(installDir, "skills", "bootstrap", "SKILL.md")));
    assert.ok(existsSync(join(installDir, "README.md")));
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

test("all nine claude skill wrappers have name and description", async () => {
  for (const name of SKILL_NAMES) {
    const path = join(TEMPLATE_CLAUDE, "skills", name, "SKILL.md");
    assert.ok(existsSync(path), `${name}/SKILL.md exists`);
    const content = await readFile(path, "utf8");
    const fm = parseFrontmatter(content);
    assert.equal(fm.name, name, `${name}: name frontmatter`);
    assert.ok(fm.description, `${name}: description frontmatter`);
    assert.equal(fm["disable-model-invocation"], undefined, `${name}: no disable-model-invocation`);
    assert.match(content, new RegExp(`\\.agent/skills/${name}\\.md`));
  }
});

test("wire-claude copy lands CLAUDE.md and .claude/skills/", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-claude-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    await wireClaude(dir);

    const claudePath = join(dir, "CLAUDE.md");
    const skillPath = join(dir, ".claude", "skills", "bootstrap", "SKILL.md");
    assert.ok(existsSync(claudePath), "CLAUDE.md copied to root");
    assert.ok(existsSync(skillPath), "bootstrap SKILL.md copied");

    const skillDirs = await readdir(join(dir, ".claude", "skills"), { withFileTypes: true });
    const dirs = skillDirs.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.equal(dirs.length, SKILL_NAMES.length, "all skill wrappers copied");
    for (const name of SKILL_NAMES) {
      assert.ok(dirs.includes(name), `copied ${name}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
