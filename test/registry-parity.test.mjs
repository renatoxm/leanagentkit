import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SCAFFOLDERS_REGISTRY = join(
  process.cwd(),
  "template",
  ".agent",
  "scaffolders",
  "registry.md",
);
const STACKS_REGISTRY = join(process.cwd(), "template", ".agent", "stacks", "registry.md");
const SCAFFOLDERS_DIR = join(process.cwd(), "template", ".agent", "scaffolders");

function parseScaffolderRows(registryText) {
  const rows = [];
  for (const line of registryText.split("\n")) {
    if (!line.startsWith("|") || line.includes("---") || line.includes("Item |")) continue;
    const cols = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 6) continue;
    const [item, , stacksRow, recipe, dependsOn] = cols;
    if (item === "Item") continue;
    rows.push({ item, stacksRow, recipe, dependsOn });
  }
  return rows;
}

function parseStackHeadings(registryText) {
  const headings = [];
  for (const line of registryText.split("\n")) {
    const m = line.match(/^## (.+)$/);
    if (m && !m[1].startsWith("How to read") && !m[1].startsWith("Adding your own")) {
      headings.push(m[1]);
    }
  }
  return headings;
}

function questionsTableIncludesName(recipePath) {
  const content = readFileSync(recipePath, "utf8");
  const questions = content.match(/## Questions[\s\S]*?(?=\n## |\n---|\Z)/);
  assert.ok(questions, `${recipePath}: Questions section required`);
  assert.match(questions[0], /\|\s*name\s*\|/, `${recipePath}: name question required`);
}

test("every scaffolder registry row has a recipe file and matching stacks heading", () => {
  const scaffolders = readFileSync(SCAFFOLDERS_REGISTRY, "utf8");
  const stacks = readFileSync(STACKS_REGISTRY, "utf8");
  const rows = parseScaffolderRows(scaffolders);
  const headings = new Set(parseStackHeadings(stacks));

  assert.ok(rows.length >= 10, "expected scaffolder registry rows");
  for (const row of rows) {
    const recipeFile = row.recipe.replace(/`/g, "");
    const recipePath = join(SCAFFOLDERS_DIR, recipeFile);
    assert.ok(existsSync(recipePath), `${row.item}: recipe ${recipeFile} exists`);
    assert.ok(
      headings.has(row.stacksRow),
      `${row.item}: stacks row "${row.stacksRow}" must match a ## heading`,
    );
  }
});

test("Express and FastAPI recipes define a name question", () => {
  questionsTableIncludesName(join(SCAFFOLDERS_DIR, "express.scaffold.md"));
  questionsTableIncludesName(join(SCAFFOLDERS_DIR, "fastapi.scaffold.md"));
});

test("FastAPI has no python Depends-on in registry or recipe header", () => {
  const registry = readFileSync(SCAFFOLDERS_REGISTRY, "utf8");
  assert.match(registry, /\| FastAPI \| template \| FastAPI \| `fastapi\.scaffold\.md` \| none \|/);
  const recipe = readFileSync(join(SCAFFOLDERS_DIR, "fastapi.scaffold.md"), "utf8");
  assert.match(recipe, /\*\*Depends-on:\*\* none/);
});

test("turborepo Chains-to uses registry Item names", () => {
  const recipe = readFileSync(join(SCAFFOLDERS_DIR, "turborepo.scaffold.md"), "utf8");
  assert.match(recipe, /\*\*Chains-to:\*\* Next\.js, React \(Vite\), Hono/);
});
