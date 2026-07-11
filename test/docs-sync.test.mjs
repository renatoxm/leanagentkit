import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const SYNC_SCRIPT = join(REPO_ROOT, "docs", ".vitepress", "sync.mjs");
const GUIDE_PATH = join(REPO_ROOT, "docs", "guide.md");
const README_PATH = join(REPO_ROOT, "README.md");

const GUIDE_ANCHOR_TARGETS = [
  "#🧠-1-the-mental-model-read-this-first",
  "#🚀-2-install-bootstrap-—-your-first-10-minutes",
  "#🧠-3-memory-tiers-—-how-the-kit-remembers",
  "#🔄-4-the-daily-loop-—-your-everyday-rhythm",
  "#🔀-5-workflows-from-simple-to-complex",
  "#🧰-6-stacks-external-skills",
  "#🏭-7-artifact-generators-—-teach-the-kit-to-scaffold",
  "#🛡️-8-engineering‐practice-guardrails",
  "#🤝-9-working-across-sessions-tools-teammates",
  "#💡-10-pro-tips-anti‐patterns",
  "#🧯-11-troubleshooting-faq",
  "#📋-12-the-one‐page-cheat-sheet",
];

test("docs sync runs and writes guide.md with VitePress TOC anchors", () => {
  execFileSync("node", [SYNC_SCRIPT], { stdio: "pipe" });
  assert.ok(existsSync(GUIDE_PATH), "docs/guide.md generated");

  const guide = readFileSync(GUIDE_PATH, "utf8");
  for (const anchor of GUIDE_ANCHOR_TARGETS) {
    assert.match(guide, new RegExp(anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), {
      message: `guide.md should reference TOC anchor ${anchor}`,
    });
  }
});

test("README still contains stacks section marker for syncStacks", () => {
  const readme = readFileSync(README_PATH, "utf8");
  assert.ok(
    readme.includes("## 🧰 Built-in stack support"),
    "README must keep ## 🧰 Built-in stack support for docs sync",
  );
});
