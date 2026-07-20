import { prisma } from '../lib/prisma'

export async function getReportKPIs(userId: string, startDate: string, endDate: string) {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
  })

  const atendimentos = await prisma.atendimento.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
  })

  const total = appointments.length
  const confirmed = appointments.filter((a) => a.status === 'confirmed')
  const completed = atendimentos.filter((a) => a.status === 'completed')
  const cancelled = appointments.filter((a) => a.status === 'cancelled')
  const noShow = appointments.filter((a) => a.status === 'no-show')

  const totalRevenue = confirmed.reduce((s, a) => s + a.servicePrice, 0)
  const averageTicket = confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length) : 0

  const uniqueClients = new Set(appointments.map((a) => a.clientPhone))
  const recurringPhones = new Set(
    appointments
      .filter((a) => {
        const clientApps = appointments.filter((c) => c.clientPhone === a.clientPhone)
        return clientApps.length > 1
      })
      .map((a) => a.clientPhone),
  )

  const revenueByProfessional: Record<string, number> = {}
  const revenueByService: Record<string, number> = {}
  const revenueByDay: Record<string, number> = {}

  for (const a of confirmed) {
    revenueByProfessional[a.professionalName] =
      (revenueByProfessional[a.professionalName] || 0) + a.servicePrice
    revenueByService[a.serviceName] = (revenueByService[a.serviceName] || 0) + a.servicePrice
    revenueByDay[a.date] = (revenueByDay[a.date] || 0) + a.servicePrice
  }

  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  const dayCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))

  const occupancyByDay: { date: string; rate: number; appointments: number; available: number }[] =
    []
  for (let i = 0; i <= dayCount; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const dayApps = appointments.filter((a) => a.date === dateStr)
    const available = 8 * 2
    occupancyByDay.push({
      date: dateStr,
      rate: available > 0 ? Math.round((dayApps.length / available) * 100) : 0,
      appointments: dayApps.length,
      available,
    })
  }

  return {
    occupancyRate: total > 0 ? Math.round((confirmed.length / total) * 100) : 0,
    totalRevenue,
    averageTicket,
    retentionRate:
      uniqueClients.size > 0 ? Math.round((recurringPhones.size / uniqueClients.size) * 100) : 0,
    noShowRate: total > 0 ? Math.round((noShow.length / total) * 100) : 0,
    cancellationRate: total > 0 ? Math.round((cancelled.length / total) * 100) : 0,
    totalAppointments: total,
    completedAtendimentos: completed.length,
    recurringClients: recurringPhones.size,
    newClients: Math.max(0, uniqueClients.size - recurringPhones.size),
    revenueByProfessional: Object.entries(revenueByProfessional).map(([name, total]) => ({
      name,
      total,
    })),
    revenueByService: Object.entries(revenueByService).map(([name, total]) => ({ name, total })),
    occupancyByDay,
    revenueByDay: Object.entries(revenueByDay).map(([date, total]) => ({ date, total })),
  }
}
