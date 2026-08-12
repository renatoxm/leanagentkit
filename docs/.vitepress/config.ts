import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Lean Agent Kit',
  description:
    'Give AI coding agents persistent project context, conventions, and learnings. Free, open source, and tool-agnostic.',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/assets/images/HeroLeanRobot.png', type: 'image/png' }]],
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'About', link: '/about' },
      { text: 'Guide', link: '/guide' },
      { text: 'Packs', link: '/packs' },
      { text: 'Migration 1.0', link: '/migration-1.0' },
      {
        text: 'Pack docs',
        items: [
          { text: 'Spec', link: '/spec' },
          { text: 'Stacks', link: '/stacks' },
          { text: 'Practice', link: '/practice' },
          { text: 'Backlog.md', link: '/backlog' },
          { text: 'Trevor', link: '/trevor' },
          { text: 'Caveman', link: '/caveman' },
          { text: 'Create skill', link: '/create-skill' },
          { text: 'Git lifecycle', link: '/git-lifecycle' },
          { text: 'Architecture', link: '/architecture-decomposition' },
          { text: 'Imaginary', link: '/imaginary' },
        ],
      },
    ],
    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'About', link: '/about' },
      { text: 'Full Guide', link: '/guide' },
      { text: 'Packs', link: '/packs' },
      { text: 'Migration 1.0', link: '/migration-1.0' },
      {
        text: 'Optional packs',
        items: [
          { text: 'Spec', link: '/spec' },
          { text: 'Stacks', link: '/stacks' },
          { text: 'Practice', link: '/practice' },
          { text: 'Backlog.md', link: '/backlog' },
          { text: 'Trevor', link: '/trevor' },
          { text: 'Caveman', link: '/caveman' },
          { text: 'Create skill', link: '/create-skill' },
          { text: 'Git lifecycle', link: '/git-lifecycle' },
          { text: 'Architecture', link: '/architecture-decomposition' },
          { text: 'Imaginary', link: '/imaginary' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renatoxm/leanagentkit' },
    ],
    footer: {
      message: '❤️ Free and open source forever under the MIT License.',
    },
    notFound: {
      title: 'PAGE NOT FOUND',
      quote:
        "This path isn't on the map — the agent couldn't find it. Head back home and try another route.",
      linkText: 'Take me home',
    },
  },
}))
