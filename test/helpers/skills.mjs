import { readdir, readFile, mkdir, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const CORE_SKILLS = join(process.cwd(), "template", "core", ".agent", "skills");
const PACKS_DIR = join(process.cwd(), "template", "packs");

export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

async function collectSkillsFromDir(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.startsWith("leanagentkit-") || !entry.name.endsWith(".md")) continue;
    const content = await readFile(join(dir, entry.name), "utf8");
    const fm = parseFrontmatter(content);
    if (!fm?.name || !fm?.description) {
      throw new Error(`missing frontmatter in ${entry.name}`);
    }
    skills.push({ file: entry.name, ...fm });
  }
  return skills;
}

/** All kit skills across core + packs (for wrapper generation tests). */
export async function listKitSkills() {
  const skills = await collectSkillsFromDir(CORE_SKILLS);
  const packIds = await readdir(PACKS_DIR, { withFileTypes: true });
  for (const entry of packIds) {
    if (!entry.isDirectory()) continue;
    const packSkills = join(PACKS_DIR, entry.name, ".agent", "skills");
    skills.push(...(await collectSkillsFromDir(packSkills)));
  }
  const byName = new Map();
  for (const s of skills) byName.set(s.name, s);
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Core skills only (default install surface). */
export async function listCoreSkills() {
  const skills = await collectSkillsFromDir(CORE_SKILLS);
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export function cursorWrapperContent(name, description, skillRelPath, invocation) {
  const disableLine =
    invocation === "auto" ? "" : "disable-model-invocation: true\n";
  return `---
name: ${name}
description: ${description}
${disableLine}---

Read \`${skillRelPath}\` and follow it.
`;
}

export function claudeWrapperContent(name, description, skillRelPath) {
  return `---
name: ${name}
description: ${description}
---

Read \`${skillRelPath}\` and follow it.
`;
}

export async function generateWrappers(targetDir, agent, { coreOnly = false } = {}) {
  const skills = coreOnly ? await listCoreSkills() : await listKitSkills();
  const skillsRoot =
    agent === "cursor"
      ? join(targetDir, ".cursor", "skills")
      : join(targetDir, ".claude", "skills");

  await mkdir(skillsRoot, { recursive: true });

  for (const skill of skills) {
    const skillRelPath = `.agent/skills/${skill.file}`;
    const wrapperDir = join(skillsRoot, skill.name);
    await mkdir(wrapperDir, { recursive: true });
    const content =
      agent === "cursor"
        ? cursorWrapperContent(
            skill.name,
            skill.description,
            skillRelPath,
            skill.invocation,
          )
        : claudeWrapperContent(skill.name, skill.description, skillRelPath);
    await writeFile(join(wrapperDir, "SKILL.md"), content, "utf8");
  }

  return skills;
}

export async function wireCursor(targetDir) {
  const rulesFrom = join(
    process.cwd(),
    "template",
    "core",
    ".agent",
    "install",
    "cursor",
    "rules",
  );
  const rulesTo = join(targetDir, ".cursor", "rules");
  await cp(rulesFrom, rulesTo, { recursive: true });
  return generateWrappers(targetDir, "cursor", { coreOnly: true });
}

export async function wireClaude(targetDir) {
  const claudeFrom = join(
    process.cwd(),
    "template",
    "core",
    ".agent",
    "install",
    "claude",
    "CLAUDE.md",
  );
  await cp(claudeFrom, join(targetDir, "CLAUDE.md"));
  return generateWrappers(targetDir, "claude", { coreOnly: true });
}
