import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Lean Agent Kit',
  description: 'Memory + stack-skill system for AI coding agents',
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
    ],
    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Full Guide', link: '/guide' },
      { text: 'Stacks', link: '/stacks' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renatoxm/leanagentkit' },
    ],
  },
})
