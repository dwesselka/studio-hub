import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'StudioHub Guide',
  description: 'Construindo um SaaS. Evoluindo um Engenheiro.',
  ignoreDeadLinks: false,

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
        activeMatch: '/engineering/lab/',
        items: [
          { text: '🏠 Engineering Lab', link: '/engineering/lab/' },
          { text: '🗺️ Roadmap', link: '/engineering/lab/roadmap' },
          { text: '🏃 Sprints', link: '/engineering/lab/sprints/' },
          { text: '🚨 Incidents', link: '/engineering/lab/incidents/' },
          { text: '🔬 Post Mortems', link: '/engineering/lab/post-mortems/pm-001' },
          { text: '🏗️ Arch Reviews', link: '/engineering/lab/arch-reviews/' },
          { text: '📐 ADRs / Decisões', link: '/engineering/decisions/' },
          { text: '🧪 Experimentos', link: '/engineering/lab/experiments/' },
          { text: '📚 Módulos de Aprendizado', link: '/engineering/lab/learning-modules/' },
          { text: '📅 Timeline', link: '/engineering/lab/timeline' },
          { text: '🎮 Score', link: '/engineering/lab/score' },
        ],
      },
      { text: 'Arquitetura', link: '/architecture/overview' },
      { text: 'Telas', link: '/product/screens/visao-geral' },
      { text: 'Componentes', link: '/ui-components/button' },
      { text: 'Regras de Negócio', link: '/product/business-rules/agendamento' },
      { text: 'Onboarding', link: '/engineering/onboarding/setup' },
      { text: '⚡ Pocket', link: '/engineering/guidelines/command-pocket' },
    ],

    sidebar: {
      '/engineering/lab/': [
        {
          text: '⚗️ Engineering Lab',
          link: '/engineering/lab/',
          items: [
            { text: '🏠 Visão Geral', link: '/engineering/lab/' },
            { text: '🗺️ Roadmap', link: '/engineering/lab/roadmap' },
            { text: '📅 Timeline', link: '/engineering/lab/timeline' },
            { text: '🎮 Engineering Score', link: '/engineering/lab/score' },
          ],
        },
        {
          text: '📚 Aprendizado & Exercícios',
          link: '/engineering/lab/learning-modules/',
          collapsed: false,
          items: [
            { text: 'Visão Geral', link: '/engineering/lab/learning-modules/' },
            { text: '02 — Estado & UI', link: '/engineering/lab/learning-modules/02_estado' },
            { text: '03 — Comunicação API', link: '/engineering/lab/learning-modules/03_comunicacao' },
            { text: '04 — Backend & Prisma', link: '/engineering/lab/learning-modules/04_backend' },
          ],
        },
        {
          text: '🏃 Sprints',
          link: '/engineering/lab/sprints/',
          collapsed: false,
          items: [
            { text: 'Todas as Sprints', link: '/engineering/lab/sprints/' },
            { text: 'Sprint 04 — Geo 🔄', link: '/engineering/lab/sprints/sprint-04' },
          ],
        },
        {
          text: '🚨 Incidents',
          link: '/engineering/lab/incidents/',
          collapsed: false,
          items: [
            { text: 'Todos os Incidentes', link: '/engineering/lab/incidents/' },
            { text: 'Incident #014', link: '/engineering/lab/incidents/incident-014' },
          ],
        },
        {
          text: '🔬 Post Mortems',
          link: '/engineering/lab/post-mortems/pm-001',
          collapsed: false,
          items: [
            { text: 'PM-001 — Índice em Prod', link: '/engineering/lab/post-mortems/pm-001' },
          ],
        },
        {
          text: '🏗️ Architecture Reviews',
          link: '/engineering/lab/arch-reviews/',
          collapsed: false,
          items: [
            { text: 'Todas as Reviews', link: '/engineering/lab/arch-reviews/' },
            { text: 'AR — Geolocalização', link: '/engineering/lab/arch-reviews/ar-geolocation' },
          ],
        },
        {
          text: '📐 ADRs & Decisões',
          link: '/engineering/decisions/',
          collapsed: true,
          items: [
            { text: 'Catálogo de ADRs', link: '/engineering/decisions/' },
            { text: 'Fase 0 — Fundação', link: '/engineering/decisions/fase-0-fundacao' },
            { text: 'Fase 1 — Autorização', link: '/engineering/decisions/fase-1-autorizacao' },
            { text: 'Fase 2 — Convite', link: '/engineering/decisions/fase-2-convite' },
            { text: 'Fase 3 — Frontend Guards', link: '/engineering/decisions/fase-3-frontend-guards' },
            { text: 'Fase 4 — Portal Cliente', link: '/engineering/decisions/fase-4-portal-cliente' },
            { text: 'Fase 5 — Seed Testes', link: '/engineering/decisions/fase-5-seed-testes' },
          ],
        },
        {
          text: '🧪 Experiments',
          link: '/engineering/lab/experiments/',
          collapsed: true,
          items: [
            { text: 'Log de Experimentos', link: '/engineering/lab/experiments/' },
          ],
        },
      ],

      '/product/screens/': [
        {
          text: 'Telas do Sistema',
          items: [
            { text: 'Visão Geral', link: '/product/screens/visao-geral' },
            { text: 'Landing Page', link: '/product/screens/landing' },
            { text: 'Dashboard', link: '/product/screens/dashboard' },
            { text: 'Agenda', link: '/product/screens/agenda' },
            { text: 'Atendimento', link: '/product/screens/atendimento' },
            { text: 'Clientes', link: '/product/screens/clientes' },
            { text: 'Pagamentos', link: '/product/screens/pagamentos' },
          ],
        },
      ],

      '/architecture/': [
        {
          text: 'Arquitetura',
          items: [
            { text: 'Visão Geral', link: '/architecture/overview' },
            { text: 'Diagramas Mermaid', link: '/architecture/diagrams' },
            { text: 'Backend API', link: '/architecture/backend' },
            { text: 'Frontend SPA', link: '/architecture/frontend' },
            { text: 'Banco de Dados', link: '/architecture/database' },
            { text: 'Migração Neon', link: '/architecture/neon-migration' },
            { text: 'Segurança & Auth', link: '/architecture/security' },
            { text: 'Perfis de Acesso', link: '/architecture/perfis-acesso' },
            { text: 'Fluxos do Sistema', link: '/architecture/flows' },
          ],
        },
      ],

      '/ui-components/': [
        {
          text: 'Componentes UI',
          collapsed: false,
          items: [
            { text: 'Visão Geral', link: '/ui-components/' },
            { text: 'Button', link: '/ui-components/button' },
            { text: 'Input', link: '/ui-components/input' },
            { text: 'Card', link: '/ui-components/card' },
            { text: 'Badge', link: '/ui-components/badge' },
            { text: 'Avatar', link: '/ui-components/avatar' },
            { text: 'Skeleton', link: '/ui-components/skeleton' },
            { text: 'Separator', link: '/ui-components/separator' },
            { text: 'ScrollArea', link: '/ui-components/scroll-area' },
            { text: 'Tooltip', link: '/ui-components/tooltip' },
            { text: 'DropdownMenu', link: '/ui-components/dropdown-menu' },
            { text: 'Loading', link: '/ui-components/loading' },
            { text: 'PageLoader', link: '/ui-components/page-loader' },
            { text: 'StatePanel', link: '/ui-components/state-panel' },
          ],
        },
      ],

      '/product/business-rules/': [
        {
          text: 'Regras de Negócio',
          items: [
            { text: 'Visão Geral', link: '/product/business-rules/' },
            { text: 'Agendamento', link: '/product/business-rules/agendamento' },
            { text: 'Fidelização', link: '/product/business-rules/fidelizacao' },
            { text: 'Pagamentos', link: '/product/business-rules/pagamentos' },
            { text: 'Branding & Personalização', link: '/product/business-rules/branding-personalizacao' },
          ],
        },
      ],

      '/engineering/onboarding/': [
        {
          text: 'Onboarding & Engenharia',
          items: [
            { text: 'Visão & Missão', link: '/engineering/onboarding/vision-and-mission' },
            { text: 'Setup do Ambiente', link: '/engineering/onboarding/setup' },
            { text: 'Guia de Contribuição', link: '/engineering/onboarding/contributing' },
            { text: 'Git Workflow', link: '/engineering/guidelines/git-feature-discipline' },
            { text: 'Definitions of Done', link: '/engineering/guidelines/definitions-of-done' },
            { text: 'Princípios Orion AI', link: '/engineering/guidelines/orion-ai-guidelines' },
            { text: '⚡ Command Pocket', link: '/engineering/guidelines/command-pocket' },
          ],
        },
      ],

      '/engineering/guidelines/': [
        {
          text: 'Diretrizes de Engenharia',
          items: [
            { text: '⚡ Command Pocket', link: '/engineering/guidelines/command-pocket' },
            { text: 'Git Workflow', link: '/engineering/guidelines/git-feature-discipline' },
            { text: 'Definitions of Done', link: '/engineering/guidelines/definitions-of-done' },
            { text: 'Princípios Orion AI', link: '/engineering/guidelines/orion-ai-guidelines' },
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