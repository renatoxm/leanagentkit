import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsDir = resolve(__dirname, '..')
const repoRoot = resolve(docsDir, '..')

const HTML_TAGS = new Set([
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'b',
  'blockquote',
  'br',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'dd',
  'del',
  'details',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'li',
  'main',
  'mark',
  'nav',
  'ol',
  'p',
  'pre',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'section',
  'small',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
  'video',
])

const GENERATED_BANNER = `<!--
  GENERATED FILE — do not edit by hand.
  Source is synced by docs/.vitepress/sync.mjs before dev/build.
-->
`

/** @param {Record<string, string>} rewrites */
function rewriteLinks(text, rewrites) {
  let out = text
  for (const [from, to] of Object.entries(rewrites)) {
    out = out.replaceAll(from, to)
  }
  return out
}

function sanitizeProse(text) {
  const inlineCodeParts = text.split(/(`[^`\n]+`)/g)
  return inlineCodeParts
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) return part
      return part
        .replace(/\{\{/g, '&#123;&#123;')
        .replace(/\}\}/g, '&#125;&#125;')
        .replace(/<([a-zA-Z][\w-]*)>/g, (match, tag) => {
          if (HTML_TAGS.has(tag.toLowerCase())) return match
          return `&lt;${tag}&gt;`
        })
    })
    .join('')
}

/** @param {string} content @param {Record<string, string>} [linkRewrites] */
function transformMarkdown(content, linkRewrites = {}) {
  const fencedParts = content.split(/(```[\s\S]*?```)/g)
  return fencedParts
    .map((part) => {
      if (part.startsWith('```')) return part
      return sanitizeProse(rewriteLinks(part, linkRewrites))
    })
    .join('')
}

function syncGuide() {
  const sourcePath = join(repoRoot, 'template/LEAN_AGENT_KIT_GUIDE.md')
  const raw = readFileSync(sourcePath, 'utf8')
  const transformed = transformMarkdown(raw, {
    './README.md': '/getting-started',
    'LEAN_AGENT_KIT_GUIDE.md': '/guide',
  })
  writeFileSync(join(docsDir, 'guide.md'), `${GENERATED_BANNER}${transformed}`)
  console.log('sync: wrote docs/guide.md')
}

function extractStacksSection(readme) {
  const startMarker = '## 🧰 Built-in stack support'
  const start = readme.indexOf(startMarker)
  if (start === -1) {
    throw new Error('Could not find stack support section in README.md')
  }

  const afterStart = readme.slice(start)
  const nextHeading = afterStart.indexOf('\n## ', startMarker.length)
  const section =
    nextHeading === -1 ? afterStart : afterStart.slice(0, nextHeading)

  return section.trim()
}

function syncStacks() {
  const readme = readFileSync(join(repoRoot, 'README.md'), 'utf8')
  const section = extractStacksSection(readme)
  const body = transformMarkdown(
    `${section}\n\nFor the full registry and playbooks, see [\`.agent/stacks/registry.md\`](https://github.com/renatoxm/leanagentkit/blob/main/template/.agent/stacks/registry.md) in the template.`,
  )
  writeFileSync(
    join(docsDir, 'stacks.md'),
    `${GENERATED_BANNER}# Built-in stack support\n\n${body.replace(/^## 🧰 Built-in stack support\n*/m, '')}`,
  )
  console.log('sync: wrote docs/stacks.md')
}

syncGuide()
syncStacks()
