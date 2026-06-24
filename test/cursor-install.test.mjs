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

const TEMPLATE_CURSOR = join(process.cwd(), "template", ".agent", "install", "cursor");

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

async function wireCursor(targetDir) {
  const rulesFrom = join(TEMPLATE_CURSOR, "rules");
  const skillsFrom = join(TEMPLATE_CURSOR, "skills");
  const rulesTo = join(targetDir, ".cursor", "rules");
  const skillsTo = join(targetDir, ".cursor", "skills");
  await cp(rulesFrom, rulesTo, { recursive: true });
  await cp(skillsFrom, skillsTo, { recursive: true });
}

test("cursor install templates exist after scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-cursor-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const installDir = join(dir, ".agent", "install", "cursor");
    assert.ok(existsSync(join(installDir, "rules", "memory.mdc")));
    assert.ok(existsSync(join(installDir, "skills", "bootstrap", "SKILL.md")));
    assert.ok(existsSync(join(installDir, "README.md")));
    assert.ok(!existsSync(join(dir, ".cursor")), "scaffold does not ship .cursor/");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("memory.mdc has valid frontmatter", async () => {
  const content = await readFile(join(TEMPLATE_CURSOR, "rules", "memory.mdc"), "utf8");
  const fm = parseFrontmatter(content);
  assert.equal(fm.alwaysApply, "true");
  assert.ok(fm.description, "description required");
  assert.match(content, /AGENTS\.md/);
});

test("all nine skill wrappers have name and description", async () => {
  for (const name of SKILL_NAMES) {
    const path = join(TEMPLATE_CURSOR, "skills", name, "SKILL.md");
    assert.ok(existsSync(path), `${name}/SKILL.md exists`);
    const content = await readFile(path, "utf8");
    const fm = parseFrontmatter(content);
    assert.equal(fm.name, name, `${name}: name frontmatter`);
    assert.ok(fm.description, `${name}: description frontmatter`);
    assert.equal(fm["disable-model-invocation"], "true");
    assert.match(content, new RegExp(`\\.agent/skills/${name}\\.md`));
  }
});

test("wire-cursor copy lands files under .cursor/", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    await wireCursor(dir);

    const rulePath = join(dir, ".cursor", "rules", "memory.mdc");
    const skillPath = join(dir, ".cursor", "skills", "bootstrap", "SKILL.md");
    assert.ok(existsSync(rulePath), "memory.mdc copied");
    assert.ok(existsSync(skillPath), "bootstrap SKILL.md copied");

    const skillDirs = await readdir(join(dir, ".cursor", "skills"), { withFileTypes: true });
    const dirs = skillDirs.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.equal(dirs.length, SKILL_NAMES.length, "all skill wrappers copied");
    for (const name of SKILL_NAMES) {
      assert.ok(dirs.includes(name), `copied ${name}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
