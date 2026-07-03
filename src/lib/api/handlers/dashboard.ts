import { mockServer } from '../server'
import { db } from '../db'
import { ApiRequestError } from '../types'
import type { ApiRequest } from '../types'
import type { Appointment } from './agenda'

const appointmentsTable = db.getOrCreate<Appointment>('agenda_appointments')

function requireUserId(req: ApiRequest): string {
  const token = req.headers?.authorization?.replace('Bearer ', '')
  if (!token) throw ApiRequestError.unauthorized()

  const sessionsTable = db.getOrCreate<{ id: string; userId: string; token: string }>(
    'auth_sessions',
  )
  const session = sessionsTable.findOne((s) => s.token === token)
  if (!session) throw ApiRequestError.unauthorized()

  return session.userId
}

export function registerDashboardHandlers(): void {
  mockServer.get('/dashboard/metrics', async (req) => {
    const userId = requireUserId(req)

    const today = new Date().toISOString().split('T')[0]
    const todayApps = appointmentsTable.find((a) => a.userId === userId && a.date === today)
    const allApps = appointmentsTable.find((a) => a.userId === userId)
    const confirmedApps = allApps.filter((a) => a.status === 'confirmed')

    const totalRevenue = confirmedApps.reduce((sum, a) => sum + a.servicePrice, 0)
    const weekApps = allApps.filter((a) => {
      const diff = Math.floor((new Date(a.date).getTime() - new Date(today).getTime()) / 86400000)
      return diff >= -7 && diff <= 0
    })

    const uniqueClients = new Set(allApps.map((a) => a.clientPhone)).size
    const returningClients = allApps.filter((a) => {
      const clientApps = allApps.filter((c) => c.clientPhone === a.clientPhone)
      return clientApps.length > 1
    })
    const retentionRate =
      uniqueClients > 0 ? Math.round((returningClients.length / allApps.length) * 100) : 0

    return mockServer['jsonResponse']({
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
      greeting: (() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
      })(),
      status: {
        label: 'Todos os sistemas operacionais',
        status: 'operational' as const,
        uptime: '99.98%',
        lastIncident: 'Nenhum incidente nos últimos 30 dias',
      },
    })
  })

  mockServer.get('/dashboard/today', async (req) => {
    const userId = requireUserId(req)
    const today = new Date().toISOString().split('T')[0]

    const appointments = appointmentsTable
      .find((a) => a.userId === userId && a.date === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    const confirmed = appointments.filter((a) => a.status === 'confirmed')
    const totalRevenue = confirmed.reduce((sum, a) => sum + a.servicePrice, 0)

    return mockServer['jsonResponse']({
      appointments,
      totalAppointments: appointments.length,
      confirmedCount: confirmed.length,
      totalRevenue,
      occupancyRate:
        appointments.length > 0 ? Math.round((confirmed.length / appointments.length) * 100) : 0,
    })
  })

  mockServer.get('/dashboard/analytics', async (req) => {
    const userId = requireUserId(req)
    const allApps = appointmentsTable.find((a) => a.userId === userId)

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

    return mockServer['jsonResponse']({
      statusDistribution: statusCount,
      totalAppointments: allApps.length,
      totalRevenue: allApps
        .filter((a) => a.status === 'confirmed')
        .reduce((s, a) => s + a.servicePrice, 0),
      revenueByDay,
      topServices: Object.entries(
        allApps.reduce<Record<string, number>>((acc, a) => {
          acc[a.serviceName] = (acc[a.serviceName] || 0) + 1
          return acc
        }, {}),
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
    })
  })

  mockServer.get('/dashboard/status', async () => {
    return mockServer['jsonResponse']({
      label: 'Todos os sistemas operacionais',
      status: 'operational',
      uptime: '99.98%',
      lastIncident: 'Nenhum incidente nos últimos 30 dias',
      services: [
        { name: 'API', status: 'operational', latency: '45ms' },
        { name: 'Banco de dados', status: 'operational', latency: '12ms' },
        { name: 'Autenticação', status: 'operational', latency: '30ms' },
        { name: 'Agendamento IA', status: 'operational', latency: '120ms' },
        { name: 'Pagamentos', status: 'operational', latency: '80ms' },
      ],
    })
  })
}
