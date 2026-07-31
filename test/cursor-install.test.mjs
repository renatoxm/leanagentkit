import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir, mkdir, cp } from "node:fs/promises";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  listKitSkills,
  listCoreSkills,
  parseFrontmatter,
  wireCursor,
  generateWrappers,
} from "./helpers/skills.mjs";

const TEMPLATE_CURSOR = join(process.cwd(), "template", "core", ".agent", "install", "cursor");

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

test("cursor hooks template has sessionStart and sessionEnd", async () => {
  const content = await readFile(join(TEMPLATE_CURSOR, "hooks.json"), "utf8");
  const hooks = JSON.parse(content);
  assert.equal(hooks.version, 1);
  assert.ok(Array.isArray(hooks.hooks.sessionStart));
  assert.ok(Array.isArray(hooks.hooks.sessionEnd));
  assert.match(hooks.hooks.sessionStart[0].prompt, /Lean Agent Kit session/);
  assert.match(hooks.hooks.sessionStart[0].prompt, /LEARNINGS\.md|ambient/i);
  assert.match(hooks.hooks.sessionEnd[0].prompt, /ACTIVE_CONTEXT|LEARNINGS/i);
  assert.match(hooks.hooks.sessionEnd[0].prompt, /end-session/i);
  assert.doesNotMatch(hooks.hooks.sessionEnd[0].prompt, /prefer leanagentkit-check first/i);
});

test("cursor hooks template uses 30s timeout", async () => {
  const content = await readFile(join(TEMPLATE_CURSOR, "hooks.json"), "utf8");
  const hooks = JSON.parse(content);
  assert.equal(hooks.hooks.sessionStart[0].timeout, 30);
  assert.equal(hooks.hooks.sessionEnd[0].timeout, 30);
});

test("all kit skills have name and description frontmatter", async () => {
  const skills = await listKitSkills();
  assert.ok(skills.length >= 22, "expected at least 22 kit skills");
  for (const skill of skills) {
    assert.equal(skill.name, skill.file.replace(/\.md$/, ""), `${skill.file}: name matches filename`);
    assert.ok(skill.description, `${skill.name}: description required`);
  }
});

test("caveman skills have discovery-safe descriptions (<=1024 chars)", async () => {
  const skills = await listKitSkills();
  const caveman = skills.filter((s) => s.name.startsWith("leanagentkit-caveman"));
  assert.equal(caveman.length, 3, "expected three caveman skills");
  for (const skill of caveman) {
    assert.ok(
      skill.description.length <= 1024,
      `${skill.name}: description must be <=1024 chars (got ${skill.description.length})`,
    );
  }
});

test("create-skill has discovery-safe description (<=1024 chars)", async () => {
  const skills = await listKitSkills();
  const createSkill = skills.find((s) => s.name === "leanagentkit-create-skill");
  assert.ok(createSkill, "leanagentkit-create-skill must exist");
  const desc = createSkill.description.replace(/^"|"$/g, "");
  assert.ok(
    desc.length <= 1024,
    `leanagentkit-create-skill: description must be <=1024 chars (got ${desc.length})`,
  );
});

test("default wire generates core-only cursor wrappers", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-core-"));
  try {
    execFileSync("node", ["bin/cli.mjs", dir], { stdio: "pipe" });
    const skills = await wireCursor(dir);
    const core = await listCoreSkills();
    assert.equal(skills.length, core.length);
    assert.ok(skills.every((s) => !s.name.includes("grill")));
    assert.ok(existsSync(join(dir, ".cursor", "rules", "memory.mdc")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("wrapper generation honors invocation auto vs conditional across packs", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-wire-"));
  try {
    await mkdir(join(dir, ".cursor", "rules"), { recursive: true });
    await cp(join(TEMPLATE_CURSOR, "rules"), join(dir, ".cursor", "rules"), {
      recursive: true,
    });
    const skills = await generateWrappers(dir, "cursor"); // all packs in package

    const skillDirs = await readdir(join(dir, ".cursor", "skills"), { withFileTypes: true });
    const dirs = skillDirs.filter((e) => e.isDirectory()).map((e) => e.name);
    assert.equal(dirs.length, skills.length, "all skill wrappers generated");

    assert.ok(
      skills.some((s) => s.invocation === "auto"),
      "at least one skill ships with invocation: auto",
    );

    const conditionalSkills = skills.filter((s) => s.invocation === "conditional");
    assert.ok(conditionalSkills.length >= 1, "expected at least one conditional skill");

    for (const skill of skills) {
      assert.ok(dirs.includes(skill.name), `generated ${skill.name}`);
      const content = await readFile(
        join(dir, ".cursor", "skills", skill.name, "SKILL.md"),
        "utf8",
      );
      const fm = parseFrontmatter(content);
      assert.equal(fm.name, skill.name);
      assert.equal(fm.description, skill.description);
      if (skill.invocation === "auto") {
        assert.equal(
          fm["disable-model-invocation"],
          undefined,
          `${skill.name}: auto-invocation skills omit disable-model-invocation`,
        );
      } else if (skill.invocation === "conditional") {
        assert.equal(
          fm["disable-model-invocation"],
          "true",
          `${skill.name}: conditional skills require disable-model-invocation`,
        );
      } else {
        assert.equal(fm["disable-model-invocation"], "true");
      }
      assert.match(content, new RegExp(`\\.agent/skills/${skill.file}`));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
