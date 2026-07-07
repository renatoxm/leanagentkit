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

test("decompose-spec references slices template and embedded CA/DDD paths", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-decompose-spec.md"), "utf8");
  assert.match(content, /_SLICES_TEMPLATE\.md/);
  assert.match(content, /references\/clean-architecture/);
  assert.match(content, /references\/domain-driven-design/);
});

test("implement-spec gates parallel mode on slices and user consent", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-implement-spec.md"), "utf8");
  assert.match(content, /Parallel mode/);
  assert.match(content, /user consent/i);
  assert.match(content, /slices file/i);
  assert.match(content, /sequential-by-slice/i);
  assert.match(content, /Phase C/);
  assert.match(content, /until Phase C \(integration\) completes/i);
});

test("git-lifecycle skips standard branch offer in parallel slice mode", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-git-lifecycle.md"), "utf8");
  assert.match(content, /Skip this offer.*parallel slice mode/is);
  assert.match(content, /Phase C integration/);
});

test("new-spec excludes slices files from spec numbering", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-new-spec.md"), "utf8");
  assert.match(content, /-slices\.md/);
  assert.match(content, /_SLICES_TEMPLATE\.md/);
  assert.match(content, /leanagentkit-decompose-spec/);
});

test("new-spec handoff uses interactive UI and honors offer_decompose_after_spec", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-new-spec.md"), "utf8");
  assert.match(content, /AskQuestion/);
  assert.match(content, /offer_decompose_after_spec/);
  assert.match(content, /without re-asking \*\*this\*\*/);
  assert.match(content, /read-only mode/i);
  assert.match(content, /leanagentkit-implement-spec\.md/);
});

test("decompose-spec handoff chains to implement-spec with mode gate", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-decompose-spec.md"), "utf8");
  assert.match(content, /AskQuestion/);
  assert.match(content, /without re-asking \*\*this\*\*/);
  assert.match(content, /read-only mode/i);
  assert.match(content, /leanagentkit-implement-spec\.md/);
});

test("architecture lifecycle hooks delegate new-spec handoff", () => {
  const content = readFileSync(join(SKILLS, "leanagentkit-architecture.md"), "utf8");
  assert.match(content, /leanagentkit-new-spec.*Handoff/s);
  assert.match(content, /offer_decompose_after_spec/);
  assert.doesNotMatch(content, /Invoke `leanagentkit-decompose-spec`/);
});

test("practice-skills registry includes architecture decomposition row", () => {
  const registry = readFileSync(
    join(process.cwd(), "template", ".agent", "practice-skills", "registry.md"),
    "utf8",
  );
  assert.match(registry, /Architecture decomposition/);
  assert.match(registry, /architecture\.yml/);
  assert.match(registry, /leanagentkit-decompose-spec/);
});

test("architecture and decompose-spec have routing-safe descriptions", () => {
  for (const file of ["leanagentkit-architecture.md", "leanagentkit-decompose-spec.md", "leanagentkit-implement-spec.md"]) {
    const content = readFileSync(join(SKILLS, file), "utf8");
    const m = content.match(/^description:\s*(.+)$/m);
    assert.ok(m, `${file}: description required`);
    const desc = m[1].replace(/^["']|["']$/g, "");
    assert.ok(desc.length <= 60, `${file}: description must be <=60 chars (got ${desc.length})`);
  }
});

test("vendored SKILL.md frontmatter starts with ---", () => {
  for (const sub of ["clean-architecture", "domain-driven-design"]) {
    const content = readFileSync(
      join(SKILLS, "references", sub, "SKILL.md"),
      "utf8",
    );
    assert.match(content, /^---\r?\nname:/);
    assert.match(content, /Adapted from wondelai\/skills/);
  }
});

test("architecture.yml.example exists", () => {
  const content = readFileSync(
    join(process.cwd(), "template", ".leanagentkit", "architecture.yml.example"),
    "utf8",
  );
  assert.match(content, /enabled: true/);
  assert.match(content, /parallel_work:/);
});

test("vendored reference dirs include SKILL.md", () => {
  const ca = readFileSync(
    join(SKILLS, "references", "clean-architecture", "SKILL.md"),
    "utf8",
  );
  const ddd = readFileSync(
    join(SKILLS, "references", "domain-driven-design", "SKILL.md"),
    "utf8",
  );
  assert.match(ca, /Clean Architecture/i);
  assert.match(ddd, /Domain-Driven Design/i);
});

test("slices template includes required work slices table columns", () => {
  const content = readFileSync(
    join(process.cwd(), "template", "docs", "specs", "_SLICES_TEMPLATE.md"),
    "utf8",
  );
  assert.match(content, /DependsOn/);
  assert.match(content, /Parallel/);
  assert.match(content, /FilesInPlay/);
  assert.match(content, /Integration contracts/);
});
