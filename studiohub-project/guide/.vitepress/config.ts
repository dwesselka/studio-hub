import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'StudioHub Guide',
  description: 'Guia completo de arquitetura, componentes e regras de negócio do StudioHub',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap',
    }],
    ['link', { rel: 'icon', href: '/getstyllo-logo.png' }],
  ],

  themeConfig: {
    logo: {
      light: '/getstyllo-logo.png',
      dark: '/getstyllo-logo.png',
    },
    siteTitle: 'StudioHub Guide',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Buscar...', buttonAriaLabel: 'Buscar na documentação' },
              modal: { noResultsText: 'Nenhum resultado para', displayDetails: 'Exibir detalhes' },
            },
          },
        },
      },
    },

    nav: [
      { text: 'Início', link: '/' },
      { text: 'Arquitetura', link: '/arquitetura/stack' },
      { text: 'Telas', link: '/telas/visao-geral' },
      { text: 'Componentes', link: '/components/button' },
      { text: 'Regras de Negócio', link: '/regras-de-negocio/agendamento' },
      { text: 'Onboarding', link: '/onboarding/setup' },
      { text: '⚡ Pocket', link: '/command-pocket' },
    ],

    sidebar: {
      '/telas/': [
        {
          text: 'Telas do Sistema',
          items: [
            { text: 'Visão Geral', link: '/telas/visao-geral' },
            { text: 'Landing Page', link: '/telas/landing' },
            { text: 'Dashboard', link: '/telas/dashboard' },
            { text: 'Agenda', link: '/telas/agenda' },
            { text: 'Atendimento', link: '/telas/atendimento' },
            { text: 'Clientes', link: '/telas/clientes' },
            { text: 'Pagamentos', link: '/telas/pagamentos' },
          ],
        },
      ],
      '/arquitetura/': [
        {
          text: 'Arquitetura',
          items: [
            { text: 'Stack', link: '/arquitetura/stack' },
            { text: 'API', link: '/arquitetura/api' },
            { text: 'Fluxos', link: '/arquitetura/fluxos' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Componentes UI',
          collapsed: false,
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Input', link: '/components/input' },
            { text: 'Card', link: '/components/card' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Separator', link: '/components/separator' },
            { text: 'ScrollArea', link: '/components/scroll-area' },
            { text: 'Tooltip', link: '/components/tooltip' },
            { text: 'DropdownMenu', link: '/components/dropdown-menu' },
            { text: 'Loading', link: '/components/loading' },
            { text: 'PageLoader', link: '/components/page-loader' },
            { text: 'StatePanel', link: '/components/state-panel' },
          ],
        },
      ],
      '/regras-de-negocio/': [
        {
          text: 'Regras de Negócio',
          items: [
            { text: 'Agendamento', link: '/regras-de-negocio/agendamento' },
            { text: 'Fidelização', link: '/regras-de-negocio/fidelizacao' },
            { text: 'Pagamentos', link: '/regras-de-negocio/pagamentos' },
          ],
        },
      ],
      '/onboarding/': [
        {
          text: 'Onboarding',
          items: [
            { text: 'Setup', link: '/onboarding/setup' },
            { text: 'Contribuindo', link: '/onboarding/contributing' },
          ],
        },
      ],
      '/command-pocket': [
        {
          text: '⚡ Command Pocket',
          items: [
            { text: 'Visão Geral', link: '/command-pocket' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/anomalyco/studiohub' },
    ],

    footer: {
      message: 'StudioHub — Onde a beleza encontra a gestão',
      copyright: `© ${new Date().getFullYear()} StudioHub. Todos os direitos reservados.`,
    },
  },
})