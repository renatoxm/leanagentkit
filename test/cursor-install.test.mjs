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
  wireCursor,
} from "./helpers/skills.mjs";

const TEMPLATE_CURSOR = join(process.cwd(), "template", ".agent", "install", "cursor");

test("cursor install templates exist after scaffold", () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-cursor-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const installDir = join(dir, ".agent", "install", "cursor");
    assert.ok(existsSync(join(installDir, "rules", "memory.mdc")));
    assert.ok(existsSync(join(installDir, "README.md")));
    assert.ok(!existsSync(join(installDir, "skills")), "no pre-shipped cursor skill wrappers");
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

test("all kit skills have name and description frontmatter", async () => {
  const skills = await listKitSkills();
  assert.ok(skills.length >= 11, "expected at least 11 kit skills");
  for (const skill of skills) {
    assert.equal(skill.name, skill.file.replace(/\.md$/, ""), `${skill.file}: name matches filename`);
    assert.ok(skill.description, `${skill.name}: description required`);
  }
});

test("wire-agent generates cursor wrappers under .cursor/skills/", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const skills = await wireCursor(dir);

    const rulePath = join(dir, ".cursor", "rules", "memory.mdc");
    assert.ok(existsSync(rulePath), "memory.mdc copied");

    const skillDirs = await readdir(join(dir, ".cursor", "skills"), { withFileTypes: true });
    const dirs = skillDirs.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.equal(dirs.length, skills.length, "all skill wrappers generated");

    for (const skill of skills) {
      assert.ok(dirs.includes(skill.name), `generated ${skill.name}`);
      const content = await readFile(
        join(dir, ".cursor", "skills", skill.name, "SKILL.md"),
        "utf8",
      );
      const fm = parseFrontmatter(content);
      assert.equal(fm.name, skill.name);
      assert.equal(fm.description, skill.description);
      assert.equal(fm["disable-model-invocation"], "true");
      assert.match(content, new RegExp(`\\.agent/skills/${skill.file}`));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
