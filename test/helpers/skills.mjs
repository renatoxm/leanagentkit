import { readdir, readFile, mkdir, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";

const SKILLS_DIR = join(process.cwd(), "template", ".agent", "skills");

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

/** Top-level kit skills with leanagentkit- prefix (excludes generated/). */
export async function listKitSkills() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.startsWith("leanagentkit-") || !entry.name.endsWith(".md")) continue;
    const content = await readFile(join(SKILLS_DIR, entry.name), "utf8");
    const fm = parseFrontmatter(content);
    if (!fm?.name || !fm?.description) {
      throw new Error(`missing frontmatter in ${entry.name}`);
    }
    skills.push({ file: entry.name, ...fm });
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export function cursorWrapperContent(name, description, skillRelPath, invocation) {
  // Only `invocation: auto` skills are model-invocable. Everything else
  // (explicit orchestration skills and `invocation: conditional` practice
  // skills) ships explicit-invoke so it never auto-fires on irrelevant projects.
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

export async function generateWrappers(targetDir, agent) {
  const skills = await listKitSkills();
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
  const rulesFrom = join(process.cwd(), "template", ".agent", "install", "cursor", "rules");
  const rulesTo = join(targetDir, ".cursor", "rules");
  await cp(rulesFrom, rulesTo, { recursive: true });
  return generateWrappers(targetDir, "cursor");
}

export async function wireClaude(targetDir) {
  const claudeFrom = join(process.cwd(), "template", ".agent", "install", "claude", "CLAUDE.md");
  await cp(claudeFrom, join(targetDir, "CLAUDE.md"));
  return generateWrappers(targetDir, "claude");
}
