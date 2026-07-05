import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SKILLS = join(process.cwd(), "template", ".agent", "skills");

test("create-skill defines craft pass only mode", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-create-skill.md"), "utf8");
  assert.match(content, /Craft pass only/i);
  assert.match(content, /Stop after step 4/i);
  assert.match(content, /do \*\*not\*\* run steps 5–6/i);
});

test("distill-skill delegates craft pass without registering", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-distill-skill.md"), "utf8");
  assert.match(content, /craft pass only/i);
  assert.match(content, /leanagentkit-create-skill\.md/);
  assert.match(content, /Do not register or wire here/i);
});

test("skill-artifact-template delegates craft pass and uses wire-agent", () => {
  const content = readFileSync(
    join(SKILLS, "leanagentkit-skill-artifact-template.md"),
    "utf8",
  );
  assert.match(content, /craft pass only/i);
  assert.match(content, /leanagentkit-create-skill\.md/);
  assert.match(content, /Do not register or wire here/i);
  assert.match(content, /do not hand-write individual wrapper files/i);
});

test("guide ships stable anchor for skill craft section", () => {
  const guide = readFileSync(join(process.cwd(), "template", "LEAN_AGENT_KIT_GUIDE.md"), "utf8");
  assert.match(guide, /<a id="skill-craft-create-refactor"><\/a>/);
});
