import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const SNIPPETS = join(process.cwd(), "template/.agent/scaffolders/snippets/commit-helpers");

test("commit-helpers flow works in a fresh npm project", { timeout: 120_000 }, () => {
  const dir = mkdtempSync(join(tmpdir(), "lak-commit-helpers-"));
  try {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "commit-helpers-smoke", version: "0.0.0", private: true }, null, 2),
    );
    execSync("git init", { cwd: dir, stdio: "pipe" });
    execSync(
      "npm install -D @commitlint/cli @commitlint/config-conventional commit-and-tag-version commitizen cz-conventional-changelog husky",
      { cwd: dir, stdio: "pipe" },
    );
    execSync("npx husky init", { cwd: dir, stdio: "pipe" });

    const pkgPath = join(dir, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    pkg.scripts = { ...pkg.scripts, commit: "cz", release: "commit-and-tag-version" };
    pkg.config = { commitizen: { path: "cz-conventional-changelog" } };
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    cpSync(join(SNIPPETS, "commitlint.config.cjs"), join(dir, "commitlint.config.cjs"));
    mkdirSync(join(dir, ".husky"), { recursive: true });
    cpSync(join(SNIPPETS, "commit-msg"), join(dir, ".husky/commit-msg"));
    if (existsSync(join(dir, ".husky/pre-commit"))) {
      rmSync(join(dir, ".husky/pre-commit"));
    }

    execSync("npm install", { cwd: dir, stdio: "pipe" });
    execSync("npx commitlint --help", { cwd: dir, stdio: "pipe" });

    assert.ok(existsSync(join(dir, "commitlint.config.cjs")));
    assert.ok(existsSync(join(dir, ".husky/commit-msg")));
    assert.match(readFileSync(join(dir, ".husky/commit-msg"), "utf8"), /commitlint/);
    const finalPkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    assert.equal(finalPkg.scripts.commit, "cz");
    assert.equal(finalPkg.scripts.release, "commit-and-tag-version");
    assert.equal(finalPkg.config.commitizen.path, "cz-conventional-changelog");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
