import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PACK = (id) => join(process.cwd(), "template", "packs", id, ".agent", "skills");
const CORE = join(process.cwd(), "template", "core", ".agent", "skills");
const ARCH_SKILLS = PACK("architecture");
const SPEC_SKILLS = PACK("spec");
const AUTHORING = PACK("authoring");
const GIT = PACK("git-lifecycle");

test("create-skill defines craft pass only mode", () => {
  const content = readFileSync(join(AUTHORING, "leanagentkit-create-skill.md"), "utf8");
  assert.match(content, /Craft pass only/i);
  assert.match(content, /Stop after step 4/i);
  assert.match(content, /do \*\*not\*\* run steps 5–6/i);
});

test("distill-skill delegates craft pass without registering", () => {
  const content = readFileSync(join(AUTHORING, "leanagentkit-distill-skill.md"), "utf8");
  assert.match(content, /craft pass only/i);
  assert.match(content, /leanagentkit-create-skill\.md/);
  assert.match(content, /Do not register or wire here/i);
});

test("skill-artifact-template delegates craft pass and uses wire-agent", () => {
  const content = readFileSync(
    join(AUTHORING, "leanagentkit-skill-artifact-template.md"),
    "utf8",
  );
  assert.match(content, /craft pass only/i);
  assert.match(content, /leanagentkit-create-skill\.md/);
  assert.match(content, /Do not register or wire here/i);
  assert.match(content, /do not hand-write individual wrapper files/i);
});

test("guide documents authoring pack", () => {
  const guide = readFileSync(
    join(process.cwd(), "template", "core", "LEAN_AGENT_KIT_GUIDE.md"),
    "utf8",
  );
  assert.match(guide, /authoring/);
  assert.match(guide, /create-skill|distill/i);
});

test("decompose-spec references slices template and embedded CA/DDD paths", () => {
  const content = readFileSync(join(ARCH_SKILLS, "leanagentkit-decompose-spec.md"), "utf8");
  assert.match(content, /_SLICES_TEMPLATE\.md/);
  assert.match(content, /references\/clean-architecture/);
  assert.match(content, /references\/domain-driven-design/);
});

test("implement-spec gates parallel mode on slices and user consent", () => {
  const content = readFileSync(join(SPEC_SKILLS, "leanagentkit-implement-spec.md"), "utf8");
  assert.match(content, /Parallel mode/);
  assert.match(content, /slices file/i);
  assert.match(content, /sequential-by-slice/i);
  assert.match(content, /Phase C/);
  assert.match(content, /until Phase C \(integration\) completes/i);
  assert.match(content, /Choosing \*\*parallel\*\* once is consent/i);
});

test("implement-spec routes Cursor Plan Build with portable bypass", () => {
  const content = readFileSync(join(SPEC_SKILLS, "leanagentkit-implement-spec.md"), "utf8");
  assert.match(content, /Choose execution route/);
  assert.match(content, /Cursor Plan Build/);
  assert.match(content, /Bypass this route/);
  assert.match(content, /Host is \*\*not\*\* Cursor/);
  assert.match(content, /Plan mode is \*\*unavailable\*\*/);
  assert.match(content, /Stop the LAK implement loop/);
  assert.match(content, /click \*\*Build\*\*/);
  assert.match(content, /Portable LAK implement/);
  assert.match(content, /Keep moving/);
  assert.match(content, /immediately\*\* start the next/i);
  assert.match(content, /Save to workspace/);
  assert.match(content, /NNN-<feature>-plan\.md/);
});

test("implement-spec has portable plan gate and Cursor Plan host enhancements", () => {
  const content = readFileSync(join(SPEC_SKILLS, "leanagentkit-implement-spec.md"), "utf8");
  assert.match(content, /Portable plan gate/);
  assert.match(content, /Implementation order/);
  assert.match(content, /Test plan/);
  assert.match(content, /When implementation diverges/);
  assert.match(content, /Do not re-grill/);
});

test("git-lifecycle skips standard branch offer in parallel slice mode", () => {
  const content = readFileSync(join(GIT, "leanagentkit-git-lifecycle.md"), "utf8");
  assert.match(content, /Skip this offer.*parallel slice mode/is);
  assert.match(content, /Phase C integration/);
});

test("spec template includes plan sections", () => {
  const content = readFileSync(
    join(process.cwd(), "template", "packs", "spec", "docs", "specs", "_TEMPLATE.md"),
    "utf8",
  );
  assert.match(content, /## Decisions \(locked\)/);
  assert.match(content, /## Implementation order/);
  assert.match(content, /## Test plan/);
  assert.match(content, /## Done when/);
  assert.match(content, /Area \/ module/);
  assert.match(content, /> Plan:/);
});

test("new-spec excludes slices files from spec numbering", () => {
  const content = readFileSync(join(SPEC_SKILLS, "leanagentkit-new-spec.md"), "utf8");
  assert.match(content, /-slices\.md/);
  assert.match(content, /-plan\.md/);
  assert.match(content, /_SLICES_TEMPLATE\.md/);
  assert.match(content, /leanagentkit-decompose-spec/);
  assert.match(content, /\(\?:slices\|plan\)/);
});

test("new-spec handoff uses interactive UI and honors offer_decompose_after_spec", () => {
  const content = readFileSync(join(SPEC_SKILLS, "leanagentkit-new-spec.md"), "utf8");
  assert.match(content, /AskQuestion/);
  assert.match(content, /offer_decompose_after_spec/);
  assert.match(content, /without re-asking \*\*this\*\*/);
  assert.match(content, /read-only mode/i);
  assert.match(content, /leanagentkit-implement-spec\.md/);
  assert.match(content, /Plan implementation, then build/);
  assert.match(content, /routes to Cursor Plan \+ Build/i);
  assert.match(content, /bypasses/i);
  assert.match(content, /Decisions \(locked\)/);
  assert.match(content, /Implementation order/);
});

test("decompose-spec handoff chains to implement-spec with mode gate", () => {
  const content = readFileSync(join(ARCH_SKILLS, "leanagentkit-decompose-spec.md"), "utf8");
  assert.match(content, /AskQuestion/);
  assert.match(content, /without re-asking \*\*this\*\*/);
  assert.match(content, /read-only mode/i);
  assert.match(content, /leanagentkit-implement-spec\.md/);
  assert.match(content, /Plan implementation, then build/);
  assert.match(content, /Cursor Plan \+ Build|portable bypass/i);
  assert.doesNotMatch(content, /call `SwitchMode`/);
});

test("guide documents spec vs portable plan vs Cursor Plan", () => {
  const guide = readFileSync(
    join(process.cwd(), "template", "core", "LEAN_AGENT_KIT_GUIDE.md"),
    "utf8",
  );
  assert.match(guide, /Spec vs plan/i);
  assert.match(guide, /Implementation order/);
  assert.match(guide, /Cursor Plan \+ Build/i);
  assert.match(guide, /bypasses/i);
});

test("architecture lifecycle hooks delegate new-spec handoff", () => {
  const content = readFileSync(join(ARCH_SKILLS, "leanagentkit-architecture.md"), "utf8");
  assert.match(content, /leanagentkit-new-spec.*Handoff/s);
  assert.match(content, /offer_decompose_after_spec/);
  assert.match(content, /Plan implementation/);
  assert.match(content, /prefers Cursor Plan \+ Build/i);
  assert.doesNotMatch(content, /Invoke `leanagentkit-decompose-spec`/);
  assert.doesNotMatch(content, /Never auto-spawn parallel agents/);
});

test("practice-skills registry includes PR babysit row", () => {
  const registry = readFileSync(
    join(process.cwd(), "template", "packs", "practice", ".agent", "practice-skills", "registry.md"),
    "utf8",
  );
  assert.match(registry, /PR babysit/);
  assert.match(registry, /offer_babysit_after_pr/);
  assert.match(registry, /leanagentkit-babysit-pr/);
});

test("git-lifecycle offers babysit after PR when configured", () => {
  const content = readFileSync(join(GIT, "leanagentkit-git-lifecycle.md"), "utf8");
  assert.match(content, /offer_babysit_after_pr/);
  assert.match(content, /leanagentkit-babysit-pr/);
});

test("practice-skills registry includes architecture decomposition row", () => {
  const registry = readFileSync(
    join(process.cwd(), "template", "packs", "practice", ".agent", "practice-skills", "registry.md"),
    "utf8",
  );
  assert.match(registry, /Architecture decomposition/);
  assert.match(registry, /architecture\.yml/);
  assert.match(registry, /leanagentkit-decompose-spec/);
});

test("architecture and decompose-spec have discovery-safe descriptions", () => {
  const files = [
    [ARCH_SKILLS, "leanagentkit-architecture.md"],
    [ARCH_SKILLS, "leanagentkit-decompose-spec.md"],
    [SPEC_SKILLS, "leanagentkit-implement-spec.md"],
  ];
  for (const [dir, file] of files) {
    const content = readFileSync(join(dir, file), "utf8");
    const m = content.match(/^description:\s*(.+)$/m);
    assert.ok(m, `${file}: description required`);
    const desc = m[1].replace(/^["']|["']$/g, "");
    assert.ok(desc.length <= 1024, `${file}: description must be <=1024 chars (got ${desc.length})`);
  }
});

test("vendored SKILL.md frontmatter starts with ---", () => {
  for (const sub of ["clean-architecture", "domain-driven-design"]) {
    const content = readFileSync(join(ARCH_SKILLS, "references", sub, "SKILL.md"), "utf8");
    assert.match(content, /^---\r?\nname:/);
    assert.match(content, /Adapted from wondelai\/skills/);
  }
});

test("architecture.yml.example exists", () => {
  const content = readFileSync(
    join(
      process.cwd(),
      "template",
      "packs",
      "architecture",
      ".leanagentkit",
      "architecture.yml.example",
    ),
    "utf8",
  );
  assert.match(content, /enabled: true/);
  assert.match(content, /parallel_work:/);
});

test("vendored reference dirs include SKILL.md", () => {
  const ca = readFileSync(
    join(ARCH_SKILLS, "references", "clean-architecture", "SKILL.md"),
    "utf8",
  );
  const ddd = readFileSync(
    join(ARCH_SKILLS, "references", "domain-driven-design", "SKILL.md"),
    "utf8",
  );
  assert.match(ca, /Clean Architecture/i);
  assert.match(ddd, /Domain-Driven Design/i);
});

test("slices template includes required work slices table columns", () => {
  const content = readFileSync(
    join(process.cwd(), "template", "packs", "spec", "docs", "specs", "_SLICES_TEMPLATE.md"),
    "utf8",
  );
  assert.match(content, /DependsOn/);
  assert.match(content, /Parallel/);
  assert.match(content, /FilesInPlay/);
  assert.match(content, /Integration contracts/);
});

test("end-session gates spec done on check PASS and user confirmation", () => {
  const content = readFileSync(join(CORE, "leanagentkit-end-session.md"), "utf8");
  assert.match(content, /leanagentkit-check/);
  assert.match(content, /user confirms/i);
  assert.match(content, /Status: done|leave status/i);
  assert.match(content, /Required|PROGRESS|pack/i);
});

test("check skill references LEARNINGS capture", () => {
  const content = readFileSync(join(CORE, "leanagentkit-check.md"), "utf8");
  assert.match(content, /LEARNINGS\.md/);
  assert.match(content, /append or bump/i);
  assert.match(content, /already in `AGENTS\.md`|already in AGENTS/i);
});

test("start-session is optional ambient wrapper", () => {
  const content = readFileSync(join(CORE, "leanagentkit-start-session.md"), "utf8");
  assert.match(content, /optional/i);
  assert.match(content, /LEARNINGS\.md/);
  assert.match(content, /ambient/i);
});

test("AGENTS.md §6 defines ambient memory, LEARNINGS, and finalize", () => {
  const content = readFileSync(
    join(process.cwd(), "template", "core", "AGENTS.md"),
    "utf8",
  );
  assert.match(content, /### Ambient touch points/);
  assert.match(content, /### Finalize/);
  assert.match(content, /LEARNINGS\.md/);
  assert.match(content, /leanagentkit-end-session/);
  assert.match(content, /Self-improvement/);
});

test("LEARNINGS.md allows capture when rule already in AGENTS.md", () => {
  const content = readFileSync(
    join(process.cwd(), "template", "core", "docs", "memory", "LEARNINGS.md"),
    "utf8",
  );
  assert.match(content, /already in `AGENTS\.md`/i);
  assert.match(content, /## Schema/);
  assert.match(content, /\*\*Avoid:\*\*/);
});

test("babysit-pr honors explicit user ask without config flag", () => {
  const content = readFileSync(join(GIT, "leanagentkit-babysit-pr.md"), "utf8");
  assert.match(content, /Explicit user ask/i);
  assert.match(content, /do not\*\* require `offer_babysit_after_pr`/i);
  assert.match(content, /Auto-offer path/i);
});
