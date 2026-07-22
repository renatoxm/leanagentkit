import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SCAFFOLDERS = join(process.cwd(), "template/packs/stacks/.agent/scaffolders");
const SNIPPETS = join(SCAFFOLDERS, "snippets/vscode");

const SNIPPET_FILES = [
  "eslint-prettier.settings.json.tpl",
  "eslint-prettier.extensions.json",
  "prettier-only.settings.json.tpl",
  "prettier-only.extensions.json",
  "ruff.settings.json.tpl",
  "ruff.extensions.json",
  "go.settings.json.tpl",
  "go.extensions.json",
];

test("vscode snippet files exist and parse as JSON where applicable", () => {
  for (const file of SNIPPET_FILES) {
    const path = join(SNIPPETS, file);
    assert.ok(existsSync(path), `missing snippet: ${file}`);
    if (file.endsWith(".json") || file.endsWith(".json.tpl")) {
      JSON.parse(readFileSync(path, "utf8"));
    }
  }
});

test("recipes with vscode question define VS Code section", () => {
  const recipes = readdirSync(SCAFFOLDERS).filter((f) => f.endsWith(".scaffold.md") && !f.startsWith("_"));
  for (const file of recipes) {
    const content = readFileSync(join(SCAFFOLDERS, file), "utf8");
    const hasVscodeQuestion = /\|\s*vscode\s*\|/.test(content);
    if (!hasVscodeQuestion) continue;
    assert.match(
      content,
      /## VS Code/,
      `${file}: has vscode question but no ## VS Code section`,
    );
    assert.match(
      content,
      /\.agent\/scaffolders\/snippets\/vscode\//,
      `${file}: VS Code section should reference kit snippet path`,
    );
  }
});

test("additive scaffolds do not offer lint/format tooling", () => {
  const additive = ["prisma.scaffold.md", "drizzle.scaffold.md", "tailwind.scaffold.md", "shadcn-svelte.scaffold.md"];
  for (const file of additive) {
    const content = readFileSync(join(SCAFFOLDERS, file), "utf8");
    assert.doesNotMatch(content, /\|\s*eslint\s*\|/, `${file} should not offer eslint`);
    assert.doesNotMatch(content, /\|\s*prettier\s*\|/, `${file} should not offer prettier`);
    assert.doesNotMatch(content, /\|\s*ruff\s*\|/, `${file} should not offer ruff`);
    assert.doesNotMatch(content, /\|\s*golangci\s*\|/, `${file} should not offer golangci`);
    assert.doesNotMatch(content, /\|\s*vscode\s*\|/, `${file} should not offer vscode`);
  }
});

test("next.scaffold maps pm to pm_cmd for post-scaffold installs", () => {
  const content = readFileSync(join(SCAFFOLDERS, "next.scaffold.md"), "utf8");
  assert.match(content, /\{\{pm_cmd\}\}/, "next should use {{pm_cmd}} in install steps");
  assert.doesNotMatch(content, /cd \{\{dir\}\} && \{\{pm\}\} add/, "next should not use {{pm}} for install");
});

test("express.scaffold patches package.json scripts for lint and format", () => {
  const content = readFileSync(join(SCAFFOLDERS, "express.scaffold.md"), "utf8");
  assert.match(content, /patch — `package\.json` scripts \(if eslint=yes\)/);
  assert.match(content, /eslintConfigPrettier/);
});

test("fastapi.scaffold has separate pyproject for ruff=no", () => {
  const content = readFileSync(join(SCAFFOLDERS, "fastapi.scaffold.md"), "utf8");
  assert.match(content, /if ruff=no/);
  assert.match(content, /1b\. create-file/);
});

test("hono.scaffold documents non-empty dir limitation for kit-only workflow", () => {
  const content = readFileSync(join(SCAFFOLDERS, "hono.scaffold.md"), "utf8");
  assert.match(content, /dir=\./, "hono should document dir=. constraint");
  assert.match(content, /kit-only|non-empty|Directory not empty/i, "hono should mention non-empty prompt");
  assert.match(content, /preflight|leanagentkit-scaffold/i, "hono should reference scaffold preflight");
});

const CLI_DIR_RECIPES = [
  "next.scaffold.md",
  "astro.scaffold.md",
  "react-vite.scaffold.md",
  "hono.scaffold.md",
  "cloudflare.scaffold.md",
  "turborepo.scaffold.md",
];

test("base CLI scaffolds with dir question document kit-only / non-empty constraints", () => {
  for (const file of CLI_DIR_RECIPES) {
    const content = readFileSync(join(SCAFFOLDERS, file), "utf8");
    assert.match(content, /kit-only/i, `${file} should mention kit-only workflow`);
    assert.match(content, /preflight|leanagentkit-scaffold/i, `${file} should reference scaffold preflight`);
    assert.match(content, /TTY only|when kit-only/i, `${file} should adjust dir default for kit-only`);
  }
});

test("sveltekit.scaffold supports in-place kit-only via --no-dir-check", () => {
  const content = readFileSync(join(SCAFFOLDERS, "sveltekit.scaffold.md"), "utf8");
  assert.match(content, /--no-dir-check/, "sveltekit should document --no-dir-check");
  assert.match(content, /kit-only/i, "sveltekit should mention kit-only");
  assert.match(content, /In-place risks|may still add or overwrite/i, "sveltekit should document in-place risks");
  assert.match(content, /`\.` when kit-only/, "sveltekit should default to in-place when kit-only");
});

test("django.scaffold defaults to subdirectory when kit-only", () => {
  const content = readFileSync(join(SCAFFOLDERS, "django.scaffold.md"), "utf8");
  assert.match(content, /subdirectory when kit-only/i, "django should default layout to subdirectory for kit-only");
  assert.match(content, /empty dir/i, "django should document empty-dir requirement for current directory layout");
  assert.match(content, /preflight|leanagentkit-scaffold/i, "django should reference scaffold preflight");
});

const SCAFFOLD_SKILL = join(process.cwd(), "template/packs/stacks/.agent/skills/leanagentkit-scaffold.md");

test("leanagentkit-scaffold kit-only preflight keys off gate not leftover files", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  assert.match(content, /Gate is \*\*kit-only\*\*/i, "preflight should trigger on kit-only gate");
  assert.match(
    content,
    /only kit files remain|only kit allowlist|Do \*\*not\*\* treat/i,
    "should warn against allowlist-only false negative",
  );
  assert.match(content, /Django.*layout=current directory|layout=current directory.*kit-only/is, "django layout in preflight");
});

test("leanagentkit-scaffold kit markers include scaffolded kit docs", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  assert.match(content, /LEAN_AGENT_KIT\.md/, "kit markers should include LEAN_AGENT_KIT.md");
  assert.match(content, /LEAN_AGENT_KIT_GUIDE\.md/, "kit markers should include LEAN_AGENT_KIT_GUIDE.md");
});

test("leanagentkit-scaffold rules allow SvelteKit bypass without contradicting Step 2", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  assert.match(content, /--no-dir-check/, "skill should document SvelteKit bypass");
  assert.match(content, /unless the recipe documents a bypass flag/i, "rules should allow bypass flags");
  assert.doesNotMatch(
    content,
    /never run `create-\*` with `dir=\.` when the root contains\n\s+kit files/,
    "rules should not flatly forbid all dir=. on kit-only without bypass exception",
  );
});

test("leanagentkit-scaffold documents nested app handoff", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  assert.match(content, /Nested app dir/i, "handoff should cover nested app directories");
  assert.match(content, /CODEBASE_MAP/i, "handoff should update codebase map for nested apps");
});

test("leanagentkit-bootstrap mentions kit-only greenfield", () => {
  const bootstrap = readFileSync(
    join(process.cwd(), "template/core/.agent/skills/leanagentkit-bootstrap.md"),
    "utf8",
  );
  assert.match(bootstrap, /kit-only/i, "bootstrap should mention kit-only state");
});

const COMMIT_SNIPPETS = join(SCAFFOLDERS, "snippets/commit-helpers");

test("commit-helpers snippets exist", () => {
  assert.ok(existsSync(join(COMMIT_SNIPPETS, "commitlint.config.cjs")), "commitlint.config.cjs");
  assert.ok(existsSync(join(COMMIT_SNIPPETS, "commit-msg")), "commit-msg hook");
  assert.doesNotMatch(
    readFileSync(join(COMMIT_SNIPPETS, "commitlint.config.cjs"), "utf8"),
    /export default/,
    "commitlint config should be CJS for broad scaffold compatibility",
  );
});

test("leanagentkit-scaffold commit helpers use pm_install_dev not pm add", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  const section = content.slice(content.indexOf("#### Optional — commit helpers"));
  assert.match(section, /\{\{pm_install_dev\}\}/, "commit helpers should use {{pm_install_dev}}");
  assert.match(content, /npm install -D/, "skill should document npm install -D in pm table");
  assert.doesNotMatch(
    section,
    /\{\{pm\}\} add -D @commitlint/,
    "commit helpers should not use {{pm}} add -D",
  );
});

test("leanagentkit-scaffold commit helpers init husky before copying commit-msg hook", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  const section = content.slice(content.indexOf("#### Optional — commit helpers"));
  const initIdx = section.indexOf("husky init");
  const copyIdx = section.indexOf("commit-msg` | `{{dir}}/.husky/commit-msg`");
  assert.ok(initIdx > -1 && copyIdx > -1, "section should document husky init and commit-msg copy");
  assert.ok(initIdx < copyIdx, "husky init should run before copying commit-msg");
  assert.match(section, /\{\{pm\}\} install/, "should re-run install to activate prepare");
});

test("leanagentkit-scaffold commit helpers record AGENTS.md 100-char limits", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  const section = content.slice(content.indexOf("#### Optional — commit helpers"));
  assert.match(section, /\*\*Commits:\*\*/);
  assert.match(section, /≤ 100/);
  assert.match(section, /\{\{pm_commit\}\}/);
  assert.match(section, /@commitlint\/config-conventional/);
});

test("leanagentkit-scaffold documents commit_helpers exception to recipe-only tooling", () => {
  const content = readFileSync(SCAFFOLD_SKILL, "utf8");
  assert.match(content, /Exception.*commit_helpers.*Step 4\.6/is);
  assert.match(content, /commitlint\.config\.cjs/, "verify should reference .cjs config");
});
