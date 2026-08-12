import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "..");
const repoRoot = resolve(docsDir, "..");

const HTML_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "img",
  "ins",
  "kbd",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "video",
]);

const GENERATED_BANNER = `<!--
  GENERATED FILE — do not edit by hand.
  Source is synced by docs/.vitepress/sync.mjs before dev/build.
-->
`;

/** @param {Record<string, string>} rewrites */
function rewriteLinks(text, rewrites) {
  let out = text;
  for (const [from, to] of Object.entries(rewrites)) {
    out = out.replaceAll(from, to);
  }
  return out;
}

function sanitizeProse(text) {
  const inlineCodeParts = text.split(/(`[^`\n]+`)/g);
  return inlineCodeParts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) return part;
      return part
        .replace(/\{\{/g, "&#123;&#123;")
        .replace(/\}\}/g, "&#125;&#125;")
        .replace(/<([a-zA-Z][\w-]*)>/g, (match, tag) => {
          if (HTML_TAGS.has(tag.toLowerCase())) return match;
          return `&lt;${tag}&gt;`;
        });
    })
    .join("");
}

/** @param {string} content @param {Record<string, string>} [linkRewrites] */
function transformMarkdown(content, linkRewrites = {}) {
  const fencedParts = content.split(/(```[\s\S]*?```)/g);
  return fencedParts
    .map((part) => {
      if (part.startsWith("```")) return part;
      return sanitizeProse(rewriteLinks(part, linkRewrites));
    })
    .join("");
}

/**
 * Docs-only: wrap content after the H1 up to `<!-- @docs-hero-image … -->`
 * in the page-hero layout used on about/trevor. Marker position is the end of
 * the hero text column (so intro + §1 can sit beside the image).
 */
function injectGuideHeroImage(text) {
  const match = text.match(
    /^(# .+)\n+([\s\S]*?)\n*<!-- @docs-hero-image ([^\s]+) -->\n*/,
  );
  if (!match) return text;

  const [, title, body, imageSrc] = match;
  const rest = text.slice(match[0].length);
  return `${title}\n\n<div class="page-hero">\n<div class="page-hero-text">\n\n${body.trim()}\n\n</div>\n<div class="page-hero-image">\n<img src="${imageSrc}" alt="Trevor — Lean Agent Kit concierge" />\n</div>\n</div>\n\n${rest}`;
}

function syncGuide() {
  const sourcePath = join(repoRoot, "template/core/LEAN_AGENT_KIT_GUIDE.md");
  const raw = readFileSync(sourcePath, "utf8");
  const transformed = injectGuideHeroImage(
    transformMarkdown(raw, {
      "./README.md": "/getting-started",
      "LEAN_AGENT_KIT_GUIDE.md": "/guide",
    }),
  );
  writeFileSync(join(docsDir, "guide.md"), `${GENERATED_BANNER}${transformed}`);
  console.log("sync: wrote docs/guide.md");
}

function syncStacks() {
  const introPath = join(docsDir, ".partials/stacks-intro.md");
  const registryPath = join(
    repoRoot,
    "template/packs/stacks/.agent/stacks/registry.md",
  );
  const intro = readFileSync(introPath, "utf8").trimEnd();
  const registry = readFileSync(registryPath, "utf8");
  const body = transformMarkdown(
    [
      intro,
      "",
      "---",
      "",
      registry,
      "",
      "Source: [`template/packs/stacks/.agent/stacks/registry.md`](https://github.com/renatoxm/leanagentkit/blob/main/template/packs/stacks/.agent/stacks/registry.md).",
      "",
      "Intro: [`docs/.partials/stacks-intro.md`](https://github.com/renatoxm/leanagentkit/blob/main/docs/.partials/stacks-intro.md).",
    ].join("\n"),
  );
  writeFileSync(
    join(docsDir, "stacks.md"),
    `${GENERATED_BANNER}# Built-in stack support\n\n${body}\n`,
  );
  console.log("sync: wrote docs/stacks.md");
}

syncGuide();
syncStacks();
