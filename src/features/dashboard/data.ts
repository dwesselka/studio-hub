import type { MetricCardData, NavGroup, PlatformStatus } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { getTodayAppointments } from '@/lib/agenda-db'

export type TodayAppointment = {
  time: string
  client: string
  service: string
  status: string
}

export function todayAppointments(): TodayAppointment[] {
  try {
    return getTodayAppointments().map((a) => ({
      time: a.startTime,
      client: a.clientName,
      service: a.serviceName,
      status: a.status,
    }))
  } catch {
    return [
      { time: '09:00', client: 'Ana Costa', service: 'Corte + Escova', status: 'confirmed' },
      { time: '10:30', client: 'Juliana Mendes', service: 'Coloração', status: 'confirmed' },
      { time: '14:00', client: 'Carla Souza', service: 'Manicure', status: 'pending' },
    ]
  }
}

export const navigationGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Visão Geral',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/app',
        icon: 'LayoutDashboard',
        shortcut: '⌘D',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/app/analytics',
        icon: 'BarChart3',
        shortcut: '⌘A',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operações',
    items: [
      {
        id: 'appointments',
        label: 'Agendamentos',
        href: '/app/agendamentos',
        icon: 'Calendar',
        badge: '12',
      },
      { id: 'attendance', label: 'Atendimento', href: '/app/atendimento', icon: 'ClipboardCheck' },
      { id: 'clients', label: 'Clientes', href: '/app/clientes', icon: 'Users' },
      { id: 'services', label: 'Serviços', href: '/app/servicos', icon: 'Scissors' },
    ],
  },
  {
    id: 'business',
    label: 'Negócio',
    items: [
      { id: 'payments', label: 'Pagamentos', href: '/app/pagamentos', icon: 'CreditCard' },
      {
        id: 'pos-atendimento',
        label: 'Pós-Atendimento',
        href: '/app/pos-atendimento',
        icon: 'Heart',
      },
      { id: 'loyalty', label: 'Fidelização', href: '/app/fidelizacao', icon: 'Gift' },
      { id: 'reports', label: 'Relatórios', href: '/app/relatorios', icon: 'FileText' },
    ],
  },
  {
    id: 'settings',
    label: 'Configurações',
    items: [
      { id: 'team', label: 'Equipe', href: '/app/equipe', icon: 'UserCog' },
      { id: 'settings', label: 'Preferências', href: '/app/configuracoes', icon: 'Settings' },
    ],
  },
]

export const platformStatus: PlatformStatus = {
  label: 'Todos os sistemas operacionais',
  status: 'operational',
  uptime: '99.98%',
  lastIncident: 'Nenhum incidente nos últimos 30 dias',
}

export const dashboardMetrics: MetricCardData[] = [
  {
    id: 'revenue',
    title: 'Receita do mês',
    description: 'Faturamento consolidado',
    value: formatCurrency(42850),
    trend: 12.4,
    trendLabel: 'vs. mês anterior',
    badge: 'Em alta',
    icon: 'TrendingUp',
  },
  {
    id: 'appointments',
    title: 'Agendamentos',
    description: 'Confirmados esta semana',
    value: formatNumber(186),
    trend: 8.2,
    trendLabel: 'vs. semana anterior',
    icon: 'CalendarCheck',
  },
  {
    id: 'clients',
    title: 'Clientes ativos',
    description: 'Com visita nos últimos 60 dias',
    value: formatNumber(1247),
    trend: 5.1,
    trendLabel: 'vs. período anterior',
    icon: 'Users',
  },
  {
    id: 'retention',
    title: 'Taxa de retenção',
    description: 'Clientes que retornaram',
    value: '78,3%',
    trend: -2.1,
    trendLabel: 'vs. trimestre anterior',
    badge: 'Atenção',
    icon: 'Heart',
  },
]

export const quickActions = [
  {
    id: 'new-appointment',
    label: 'Novo agendamento',
    icon: 'CalendarPlus',
    variant: 'default' as const,
  },
  { id: 'add-client', label: 'Adicionar cliente', icon: 'UserPlus', variant: 'outline' as const },
  {
    id: 'view-reports',
    label: 'Ver relatórios',
    icon: 'FileBarChart',
    variant: 'outline' as const,
  },
]
