import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'StudioHub Guide',
  description: 'Construindo um SaaS. Evoluindo um Engenheiro.',
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
    siteTitle: 'StudioHub',

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
      {
        text: '⚗️ Lab',
        activeMatch: '/lab/',
        items: [
          { text: '🏠 Engineering Lab', link: '/lab/' },
          { text: '🗺️ Roadmap', link: '/lab/roadmap' },
          { text: '🏃 Sprints', link: '/lab/sprints/' },
          { text: '🚨 Incidents', link: '/lab/incidents/' },
          { text: '🔬 Post Mortems', link: '/lab/post-mortems/' },
          { text: '🏗️ Arch Reviews', link: '/lab/arch-reviews/' },
          { text: '📐 ADRs', link: '/lab/adrs/' },
          { text: '🧪 Experiments', link: '/lab/experiments/' },
          { text: '🏆 Challenges', link: '/lab/challenges/' },
          { text: '📖 Learnings', link: '/lab/learnings/' },
          { text: '📅 Timeline', link: '/lab/timeline' },
          { text: '🎮 Score', link: '/lab/score' },
        ],
      },
      { text: 'Arquitetura', link: '/arquitetura/stack' },
      { text: 'Telas', link: '/telas/visao-geral' },
      { text: 'Componentes', link: '/components/button' },
      { text: 'Regras de Negócio', link: '/regras-de-negocio/agendamento' },
      { text: 'Onboarding', link: '/onboarding/setup' },
      { text: '⚡ Pocket', link: '/command-pocket' },
    ],

    sidebar: {
      '/lab/': [
        {
          text: '⚗️ Engineering Lab',
          link: '/lab/',
          items: [
            { text: '🏠 Visão Geral', link: '/lab/' },
            { text: '🗺️ Roadmap', link: '/lab/roadmap' },
            { text: '📅 Timeline', link: '/lab/timeline' },
            { text: '🎮 Engineering Score', link: '/lab/score' },
          ],
        },
        {
          text: '🏃 Sprints',
          link: '/lab/sprints/',
          collapsed: false,
          items: [
            { text: 'Todas as Sprints', link: '/lab/sprints/' },
            { text: 'Sprint 04 — Geo 🔄', link: '/lab/sprints/sprint-04' },
          ],
        },
        {
          text: '🚨 Incidents',
          link: '/lab/incidents/',
          collapsed: false,
          items: [
            { text: 'Todos os Incidentes', link: '/lab/incidents/' },
            { text: 'Incident #014', link: '/lab/incidents/incident-014' },
          ],
        },
        {
          text: '🔬 Post Mortems',
          link: '/lab/post-mortems/',
          collapsed: false,
          items: [
            { text: 'Todos os Post Mortems', link: '/lab/post-mortems/' },
            { text: 'PM-001 — Índice em Prod', link: '/lab/post-mortems/pm-001' },
          ],
        },
        {
          text: '🏗️ Architecture Reviews',
          link: '/lab/arch-reviews/',
          collapsed: false,
          items: [
            { text: 'Todas as Reviews', link: '/lab/arch-reviews/' },
            { text: 'AR — Geolocalização', link: '/lab/arch-reviews/ar-geolocation' },
          ],
        },
        {
          text: '📐 ADRs',
          link: '/lab/adrs/',
          collapsed: true,
          items: [
            { text: 'Catálogo de ADRs', link: '/lab/adrs/' },
          ],
        },
        {
          text: '🧪 Experiments',
          link: '/lab/experiments/',
          collapsed: true,
          items: [
            { text: 'Log de Experimentos', link: '/lab/experiments/' },
          ],
        },
        {
          text: '🏆 Challenges',
          link: '/lab/challenges/',
          collapsed: true,
          items: [
            { text: 'Todos os Desafios', link: '/lab/challenges/' },
          ],
        },
        {
          text: '📖 Learnings',
          link: '/lab/learnings/',
          collapsed: true,
          items: [
            { text: 'Base de Conhecimento', link: '/lab/learnings/' },
          ],
        },
      ],

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
      message: 'Construindo um SaaS. Evoluindo um Engenheiro.',
      copyright: `© ${new Date().getFullYear()} StudioHub. Cada feature é uma hipótese. Cada incidente é uma lição.`,
    },
  },
})