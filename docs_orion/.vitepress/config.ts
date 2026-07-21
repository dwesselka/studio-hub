import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Infinity Style",
  description: "Documentação oficial do projeto Infinity Style",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/QWEN' }
    ],

    sidebar: [
      {
        text: 'Documentação',
        items: [
          { text: 'QWEN', link: '/QWEN' },
          { text: 'Clovis - Diego-Cocite', link: '/_CLOVIS - DIEGO-COCITE ' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
