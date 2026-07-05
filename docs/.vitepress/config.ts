import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Lean Agent Kit',
  description: "Keep your AI agent's context lean — memory + guardrails that navigate by a map instead of re-scanning your repo.",
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/assets/images/HeroLeanRobot.png', type: 'image/png' }]],
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
      { text: 'Trevor', link: '/trevor' },
      { text: 'Caveman', link: '/caveman' },
      { text: 'Create skill', link: '/create-skill' },
      { text: 'Git lifecycle', link: '/git-lifecycle' },
      { text: 'Architecture', link: '/architecture-decomposition' },
    ],
    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Full Guide', link: '/guide' },
      { text: 'Stacks', link: '/stacks' },
      { text: 'Backlog.md', link: '/backlog' },
      { text: 'Trevor', link: '/trevor' },
      { text: 'Caveman', link: '/caveman' },
      { text: 'Create skill', link: '/create-skill' },
      { text: 'Git lifecycle', link: '/git-lifecycle' },
      { text: 'Architecture', link: '/architecture-decomposition' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renatoxm/leanagentkit' },
    ],
    notFound: {
      title: 'PAGE NOT FOUND',
      quote:
        "This path isn't on the map — the agent couldn't find it. Head back home and try another route.",
      linkText: 'Take me home',
    },
  },
}))
