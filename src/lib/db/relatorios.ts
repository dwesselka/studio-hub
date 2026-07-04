import { getAllAppointments } from '@/lib/db/agenda'
import { getAllAtendimentos } from '@/lib/db/atendimento'
import type { Atendimento } from '@/features/atendimento/types'
import type { ReportKPIs, AIRecommendation, PeriodKey } from '@/features/relatorios/types'

function getDateRange(key: PeriodKey, customStart?: string, customEnd?: string): { start: string; end: string } {
  const today = new Date()
  const toStr = (d: Date) => d.toISOString().split('T')[0]

  switch (key) {
    case 'today': {
      const s = toStr(today)
      return { start: s, end: s }
    }
    case 'week': {
      const start = new Date(today)
      start.setDate(start.getDate() - start.getDay())
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return { start: toStr(start), end: toStr(end) }
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      return { start: toStr(start), end: toStr(end) }
    }
    case 'custom': {
      return { start: customStart ?? toStr(today), end: customEnd ?? toStr(today) }
    }
  }
}

function getDaysInRange(start: string, end: string): string[] {
  const days: string[] = []
  const current = new Date(start + 'T12:00:00')
  const endDate = new Date(end + 'T12:00:00')
  while (current <= endDate) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return days
}

export function computeKPIs(
  periodKey: PeriodKey,
  customStart?: string,
  customEnd?: string,
): ReportKPIs {
  const { start, end } = getDateRange(periodKey, customStart, customEnd)
  const allAppointments = getAllAppointments()
  const allAtendimentos = getAllAtendimentos()

  const periodAppointments = allAppointments.filter((a) => a.date >= start && a.date <= end)
  const periodAtendimentos = allAtendimentos.filter((a) => a.date >= start && a.date <= end)
  const completedAtendimentos = periodAtendimentos.filter((a) => a.status === 'completed')

  const totalAppointments = periodAppointments.length
  const totalRevenue = completedAtendimentos.reduce((sum, a) => sum + a.totalValue, 0)
  const averageTicket = completedAtendimentos.length > 0
    ? Math.round(totalRevenue / completedAtendimentos.length)
    : 0

  const cancelled = periodAppointments.filter((a) => a.status === 'cancelled').length
  const noShow = periodAppointments.filter((a) => a.status === 'no-show').length
  const confirmed = periodAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending',
  ).length

  const cancellationRate = totalAppointments > 0 ? Math.round((cancelled / totalAppointments) * 100) : 0
  const noShowRate = totalAppointments > 0 ? Math.round((noShow / totalAppointments) * 100) : 0

  const occupancyDays = getDaysInRange(start, end)
  const totalSlotsAvailable = occupancyDays.length * 8 * 3

  const occupancyRate =
    totalSlotsAvailable > 0
      ? Math.min(100, Math.round((confirmed / totalSlotsAvailable) * 100))
      : 0

  const allClientPhones = [
    ...new Set(periodAppointments.map((a) => a.clientPhone)),
  ]

  const clientVisitCount = new Map<string, number>()
  for (const phone of allClientPhones) {
    const visits = allAtendimentos.filter(
      (a) => a.clientPhone === phone && a.status === 'completed' && a.date <= end,
    ).length
    clientVisitCount.set(phone, visits)
  }

  const recurringClients = [...clientVisitCount.values()].filter((v) => v >= 2).length
  const newClients = allClientPhones.filter(
    (phone) => {
      const visits = allAtendimentos.filter(
        (a) => a.clientPhone === phone && a.status === 'completed' && a.date >= start && a.date <= end,
      ).length
      const priorVisits = allAtendimentos.filter(
        (a) => a.clientPhone === phone && a.status === 'completed' && a.date < start,
      ).length
      return visits > 0 && priorVisits === 0
    },
  ).length

  const retentionRate =
    allClientPhones.length > 0
      ? Math.round((recurringClients / allClientPhones.length) * 100)
      : 0

  const revenueByProfessional = aggregateRevenueBy(completedAtendimentos, 'professional')
  const revenueByService = aggregateRevenueBy(completedAtendimentos, 'service')

  const revenueByDay = occupancyDays.map((date) => ({
    date,
    total: completedAtendimentos
      .filter((a) => a.date === date)
      .reduce((sum, a) => sum + a.totalValue, 0),
  }))

  const occupancyByDay = occupancyDays.map((date) => {
    const dayApps = periodAppointments.filter((a) => a.date === date)
    const dayConfirmed = dayApps.filter(
      (a) => a.status === 'confirmed' || a.status === 'pending',
    ).length
    const dayAvailable = 8 * 3
    return {
      date,
      appointments: dayConfirmed,
      available: dayAvailable,
      rate: Math.min(100, Math.round((dayConfirmed / dayAvailable) * 100)),
    }
  })

  return {
    occupancyRate,
    totalRevenue,
    averageTicket,
    retentionRate,
    noShowRate,
    cancellationRate,
    totalAppointments,
    completedAtendimentos: completedAtendimentos.length,
    recurringClients,
    newClients,
    revenueByProfessional,
    revenueByService,
    occupancyByDay,
    revenueByDay,
  }
}

function aggregateRevenueBy(
  atendimentos: Atendimento[],
  by: 'professional' | 'service',
): { name: string; total: number }[] {
  const map = new Map<string, number>()

  for (const a of atendimentos) {
    if (by === 'professional') {
      const key = a.professionalName
      map.set(key, (map.get(key) ?? 0) + a.totalValue)
    } else {
      for (const s of a.services) {
        map.set(s.serviceName, (map.get(s.serviceName) ?? 0) + s.price)
      }
    }
  }

  return [...map.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
}

export function computeRecommendations(kpis: ReportKPIs): AIRecommendation[] {
  const recs: AIRecommendation[] = []

  if (kpis.occupancyRate < 40) {
    recs.push({
      id: 'low-occupancy',
      type: 'warning',
      title: 'Ocupação baixa',
      description: `A taxa de ocupação de ${kpis.occupancyRate}% está abaixo do ideal. Considere promover horários ociosos ou criar pacotes promocionais para dias mais vazios.`,
      impact: 'high',
    })
  } else if (kpis.occupancyRate > 80) {
    recs.push({
      id: 'high-occupancy',
      type: 'insight',
      title: 'Alta demanda',
      description: `Excelente ocupação de ${kpis.occupancyRate}%. Avalie se sua equipe atual suporta a demanda ou se é hora de contratar mais profissionais.`,
      impact: 'medium',
    })
  }

  if (kpis.noShowRate > 15) {
    recs.push({
      id: 'high-noshow',
      type: 'warning',
      title: 'Taxa de no-show elevada',
      description: `${kpis.noShowRate}% dos clientes não compareceram. Reforce lembretes automáticos ou considere pedir confirmação 2h antes.`,
      impact: 'high',
    })
  }

  if (kpis.retentionRate < 30 && kpis.totalAppointments > 10) {
    recs.push({
      id: 'low-retention',
      type: 'warning',
      title: 'Retenção baixa',
      description: `Apenas ${kpis.retentionRate}% dos clientes retornaram. Invista em campanhas de pós-atendimento e programa de fidelidade.`,
      impact: 'high',
    })
  }

  if (kpis.revenueByService.length > 0) {
    const topService = kpis.revenueByService[0]
    const total = kpis.revenueByService.reduce((s, r) => s + r.total, 0)
    const pct = Math.round((topService.total / total) * 100)
    recs.push({
      id: 'top-service',
      type: 'insight',
      title: 'Serviço mais rentável',
      description: `"${topService.name}" representa ${pct}% da receita. Considere treinar mais profissionais neste serviço ou criar combos para aumentar o ticket médio.`,
      impact: 'medium',
    })
  }

  const highOccupancyDays = kpis.occupancyByDay.filter((d) => d.rate >= 70)
  const lowOccupancyDays = kpis.occupancyByDay.filter((d) => d.rate < 30)

  if (lowOccupancyDays.length > 0 && highOccupancyDays.length > 0) {
    recs.push({
      id: 'day-pattern',
      type: 'opportunity',
      title: 'Padrão de ocupação',
      description: `Dias de maior procura: ${highOccupancyDays.map((d) => new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })).join(', ')}. Dias ociosos: ${lowOccupancyDays.map((d) => new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })).join(', ')}. Crie promoções específicas para horários vagos.`,
      impact: 'medium',
    })
  }

  if (kpis.averageTicket > 0 && kpis.totalRevenue > 0) {
    recs.push({
      id: 'ticket-insight',
      type: 'insight',
      title: 'Ticket médio',
      description: `Ticket médio de R$ ${(kpis.averageTicket / 100).toFixed(2)}. Para aumentar, considere oferecer serviços complementares no pós-atendimento.`,
      impact: 'low',
    })
  }

  if (kpis.cancellationRate > 10) {
    recs.push({
      id: 'cancellation-rate',
      type: 'warning',
      title: 'Cancelamentos frequentes',
      description: `${kpis.cancellationRate}% dos agendamentos são cancelados. Avalie sua política de cancelamento e considere flexibilizar o reagendamento.`,
      impact: 'medium',
    })
  }

  return recs.slice(0, 6)
}

export function exportToCSV(kpis: ReportKPIs, periodLabel: string): void {
  const rows: string[][] = []
  const push = (cells: string[]) => rows.push(cells)

  push(['Relatório de Desempenho', periodLabel, new Date().toLocaleDateString('pt-BR')])
  push([])
  push(['Métrica', 'Valor'])
  push(['Receita Total', `R$ ${(kpis.totalRevenue / 100).toFixed(2)}`])
  push(['Ticket Médio', `R$ ${(kpis.averageTicket / 100).toFixed(2)}`])
  push(['Taxa de Ocupação', `${kpis.occupancyRate}%`])
  push(['Taxa de Retenção', `${kpis.retentionRate}%`])
  push(['No-show', `${kpis.noShowRate}%`])
  push(['Cancelamentos', `${kpis.cancellationRate}%`])
  push(['Total de Agendamentos', String(kpis.totalAppointments)])
  push(['Atendimentos Concluídos', String(kpis.completedAtendimentos)])
  push(['Clientes Recorrentes', String(kpis.recurringClients)])
  push(['Novos Clientes', String(kpis.newClients)])
  push([])

  push(['Receita por Profissional'])
  push(['Profissional', 'Receita'])
  for (const r of kpis.revenueByProfessional) {
    push([r.name, `R$ ${(r.total / 100).toFixed(2)}`])
  }
  push([])

  push(['Receita por Serviço'])
  push(['Serviço', 'Receita'])
  for (const r of kpis.revenueByService) {
    push([r.name, `R$ ${(r.total / 100).toFixed(2)}`])
  }
  push([])

  push(['Receita por Dia'])
  push(['Data', 'Receita'])
  for (const d of kpis.revenueByDay) {
    push([d.date, `R$ ${(d.total / 100).toFixed(2)}`])
  }
  push([])

  push(['Ocupação por Dia'])
  push(['Data', 'Agendamentos', 'Vagas', 'Taxa'])
  for (const d of kpis.occupancyByDay) {
    push([d.date, String(d.appointments), String(d.available), `${d.rate}%`])
  }

  const csvContent = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-${periodLabel.replace(/\s+/g, '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
