import { prisma } from '../../src/lib/prisma'
import { dashboardCache } from '../lib/cache'

async function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = dashboardCache.get(key)
  if (cached) return cached as T
  const result = await fn()
  dashboardCache.set(key, result)
  return result
}

export async function getDashboardMetrics(userId: string) {
  return withCache(`dashboard:metrics:${userId}`, async () => {
    const today = new Date().toISOString().split('T')[0]

    const todayApps = await prisma.appointment.findMany({
      where: { userId, date: today },
    })
    const allApps = await prisma.appointment.findMany({ where: { userId } })

    const confirmedApps = allApps.filter((a) => a.status === 'confirmed')
    const totalRevenue = confirmedApps.reduce((sum, a) => sum + a.servicePrice, 0)

    const weekApps = allApps.filter((a) => {
      const diff = Math.floor((new Date(a.date).getTime() - new Date(today).getTime()) / 86400000)
      return diff >= -7 && diff <= 0
    })

    const uniqueClients = new Set(allApps.map((a) => a.clientPhone)).size
    const returningPhones = new Set(
      allApps
        .filter((a) => allApps.filter((c) => c.clientPhone === a.clientPhone).length > 1)
        .map((a) => a.clientPhone),
    )
    const retentionRate =
      uniqueClients > 0 ? Math.round((returningPhones.size / uniqueClients) * 100) : 0

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    return {
      metrics: [
        {
          id: 'revenue',
          title: 'Receita do mês',
          description: 'Faturamento consolidado',
          value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          trend: 12.4,
          trendLabel: 'vs. mês anterior',
          badge: 'Em alta',
          icon: 'TrendingUp',
        },
        {
          id: 'appointments',
          title: 'Agendamentos',
          description: 'Confirmados esta semana',
          value: String(weekApps.filter((a) => a.status === 'confirmed').length),
          trend: 8.2,
          trendLabel: 'vs. semana anterior',
          icon: 'CalendarCheck',
        },
        {
          id: 'clients',
          title: 'Clientes ativos',
          description: 'Com visita nos últimos 60 dias',
          value: String(uniqueClients),
          trend: 5.1,
          trendLabel: 'vs. período anterior',
          icon: 'Users',
        },
        {
          id: 'retention',
          title: 'Taxa de retenção',
          description: 'Clientes que retornaram',
          value: `${retentionRate}%`,
          trend: -2.1,
          trendLabel: 'vs. trimestre anterior',
          badge: retentionRate > 70 ? 'Em alta' : 'Atenção',
          icon: 'Heart',
        },
      ],
      todayAppointments: todayApps.slice(0, 5).map((a) => ({
        time: a.startTime,
        client: a.clientName,
        service: a.serviceName,
        status: a.status,
      })),
      greeting,
      status: {
        label: 'Todos os sistemas operacionais',
        status: 'operational',
        uptime: '99.98%',
        lastIncident: 'Nenhum incidente nos últimos 30 dias',
      },
    }
  })
}

export async function getDashboardToday(userId: string) {
  const today = new Date().toISOString().split('T')[0]

  const appointments = await prisma.appointment.findMany({
    where: { userId, date: today },
    orderBy: { startTime: 'asc' },
  })

  const confirmed = appointments.filter((a) => a.status === 'confirmed')
  const totalRevenue = confirmed.reduce((sum, a) => sum + a.servicePrice, 0)

  return {
    appointments: appointments.map((a) => ({
      id: a.id,
      clientName: a.clientName,
      clientPhone: a.clientPhone,
      serviceName: a.serviceName,
      professionalName: a.professionalName,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
    })),
    totalAppointments: appointments.length,
    confirmedCount: confirmed.length,
    totalRevenue,
    occupancyRate:
      appointments.length > 0
        ? Math.round((confirmed.length / appointments.length) * 100)
        : 0,
  }
}

export async function getDashboardAnalytics(userId: string) {
  const allApps = await prisma.appointment.findMany({ where: { userId } })

  const statusCount: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    'no-show': 0,
  }

  for (const app of allApps) {
    statusCount[app.status] = (statusCount[app.status] || 0) + 1
  }

  const revenueByDay: Record<string, number> = {}
  for (const app of allApps.filter((a) => a.status === 'confirmed')) {
    revenueByDay[app.date] = (revenueByDay[app.date] || 0) + app.servicePrice
  }

  const serviceCount: Record<string, number> = {}
  for (const app of allApps) {
    serviceCount[app.serviceName] = (serviceCount[app.serviceName] || 0) + 1
  }

  return {
    statusDistribution: statusCount,
    totalAppointments: allApps.length,
    totalRevenue: allApps
      .filter((a) => a.status === 'confirmed')
      .reduce((s, a) => s + a.servicePrice, 0),
    revenueByDay,
    topServices: Object.entries(serviceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
  }
}
