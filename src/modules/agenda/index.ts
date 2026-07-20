import { lazy } from 'react'
import { moduleRegistry } from '@/core/module/registry.ts'

moduleRegistry.register({
  id: 'agenda',
  name: 'StudioHub Agenda',
  description: 'Gestão completa de agendamentos e horários',
  version: '1.0.0',
  icon: 'Calendar',
  requiredPlan: 'STARTER',

  permissions: [
    { id: 'agenda:read', name: 'Visualizar agenda' },
    { id: 'agenda:write', name: 'Criar e editar agendamentos' },
    { id: 'agenda:delete', name: 'Cancelar agendamentos' },
  ],

  navigation: [
    {
      id: 'agenda',
      label: 'StudioHub Agenda',
      path: '/agendamentos',
      icon: 'Calendar',
      shortcut: '⌘G',
      group: 'core',
      order: 10,
    },
  ],

  // Exemplo de como registrar os widgets no futuro:
  // widgets: [{
  //   id: 'agenda-today',
  //   name: 'Agenda de Hoje',
  //   component: lazy(() => import('@/features/agenda/widgets/TodayWidget')),
  //   defaultSize: { w: 2, h: 1 },
  //   permission: 'agenda:read',
  // }],

  routes: [
    {
      path: '/agendamentos',
      component: lazy(() =>
        import('@/features/agenda/pages/agenda-page.tsx').then((m) => ({ default: m.AgendaPage })),
      ),
    },
  ],
})
