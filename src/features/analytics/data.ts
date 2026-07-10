import type { AnalyticsData } from './types'

export function getAnalyticsData(): AnalyticsData {
  return {
    pageViews: [
      { label: 'Seg', value: 120 },
      { label: 'Ter', value: 85 },
      { label: 'Qua', value: 150 },
      { label: 'Qui', value: 200 },
      { label: 'Sex', value: 175 },
      { label: 'Sáb', value: 90 },
      { label: 'Dom', value: 45 },
    ],
    trafficSource: [
      { source: 'Instagram', percentage: 45, color: 'bg-pink-500' },
      { source: 'Google', percentage: 30, color: 'bg-blue-500' },
      { source: 'Indicação', percentage: 15, color: 'bg-green-500' },
      { source: 'Facebook', percentage: 10, color: 'bg-indigo-500' },
    ],
    metrics: [
      { id: 'visits', label: 'Visitas no mês', value: '2.847', change: 12.5, icon: 'Eye' },
      { id: 'leads', label: 'Leads gerados', value: '186', change: 8.3, icon: 'UserPlus' },
      { id: 'conv', label: 'Taxa de conversão', value: '6,5%', change: -1.2, icon: 'TrendingUp' },
      {
        id: 'bounce',
        label: 'Taxa de rejeição',
        value: '32%',
        change: -4.1,
        icon: 'ArrowRightLeft',
      },
    ],
  }
}
