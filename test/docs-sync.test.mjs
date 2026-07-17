import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const SYNC_SCRIPT = join(REPO_ROOT, "docs", ".vitepress", "sync.mjs");
const GUIDE_PATH = join(REPO_ROOT, "docs", "guide.md");
const STACKS_PATH = join(REPO_ROOT, "docs", "stacks.md");
const GUIDE_SOURCE = join(REPO_ROOT, "template", "core", "LEAN_AGENT_KIT_GUIDE.md");
const STACKS_REGISTRY = join(
  REPO_ROOT,
  "template",
  "packs",
  "stacks",
  ".agent",
  "stacks",
  "registry.md",
);

test("docs sync runs and writes guide.md from core guide", () => {
  execFileSync("node", [SYNC_SCRIPT], { stdio: "pipe" });
  assert.ok(existsSync(GUIDE_PATH), "docs/guide.md generated");
  assert.ok(existsSync(STACKS_PATH), "docs/stacks.md generated");

  const guide = readFileSync(GUIDE_PATH, "utf8");
  assert.match(guide, /GENERATED FILE/);
  assert.match(guide, /Map-first/);
  assert.match(guide, /Workflow sizes/);
  assert.match(guide, /## 7\. Packs/);

  const source = readFileSync(GUIDE_SOURCE, "utf8");
  assert.match(source, /## 1\. Mental model/);
});

test("stacks sync includes registry content and packs pack note", () => {
  execFileSync("node", [SYNC_SCRIPT], { stdio: "pipe" });
  const stacks = readFileSync(STACKS_PATH, "utf8");
  assert.match(stacks, /enable-pack stacks/);
  assert.ok(existsSync(STACKS_REGISTRY));
  const registry = readFileSync(STACKS_REGISTRY, "utf8");
  // At least one heading from registry should appear in generated page
  const heading = registry.match(/^## (.+)$/m);
  assert.ok(heading, "registry has headings");
  assert.match(stacks, new RegExp(heading[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
