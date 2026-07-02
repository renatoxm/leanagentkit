import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Lean Agent Kit',
  description: "Keep your AI agent's context lean — memory + guardrails that navigate by a map instead of re-scanning your repo.",
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // logo: {
    //   light: '/assets/images/lean-agent-kit-logo2.png',
    //   dark: '/assets/images/lean-agent-kit-logo-dark2.png',
    //   alt: 'Lean Agent Kit',
    // },
    search: { provider: 'local' },
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Guide', link: '/guide' },
      { text: 'Stacks', link: '/stacks' },
      { text: 'Backlog.md', link: '/backlog' },
    ],
    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Full Guide', link: '/guide' },
      { text: 'Stacks', link: '/stacks' },
      { text: 'Backlog.md', link: '/backlog' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renatoxm/leanagentkit' },
    ],
  },
}))
