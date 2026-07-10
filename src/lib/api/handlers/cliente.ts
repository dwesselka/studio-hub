import { mockServer } from '../server'
import { db } from '../db'
import { ApiRequestError } from '../types'
import type { ApiRequest } from '../types'

interface LoyaltyRow {
  id: string
  userId: string
  points: number
  totalVisits: number
  lastVisit: string
  tier: 'bronze' | 'prata' | 'ouro'
}

function requireUserId(req: ApiRequest) {
  const token = req.headers?.authorization?.replace('Bearer ', '')
  if (!token) throw ApiRequestError.unauthorized()

  const sessionsTable = db.getOrCreate<{ id: string; userId: string; token: string }>(
    'auth_sessions',
  )
  const session = sessionsTable.findOne((s) => s.token === token)
  if (!session) throw ApiRequestError.unauthorized()
  return session.userId
}

function requireUser(req: ApiRequest) {
  const userId = requireUserId(req)
  const usersTable = db.getOrCreate<{
    id: string
    email: string
    name: string
    [key: string]: unknown
  }>('auth_users')
  const user = usersTable.getById(userId)
  if (!user) throw ApiRequestError.unauthorized('Usuário não encontrado')
  return user
}

export function registerClienteHandlers(): void {
  mockServer.get('/v1/cliente/dashboard', async (req) => {
    const user = requireUser(req)
    const appointmentsTable = db.getOrCreate<{
      id: string
      date: string
      startTime: string
      endTime: string
      serviceName: string
      servicePrice: number
      professionalName: string
      status: string
      clientEmail?: string
      userId: string
    }>('agenda_appointments')

    const apps = appointmentsTable.find((a) => a.clientEmail === user.email)
    const confirmed = apps.filter((a) => a.status === 'confirmed')
    const next = apps
      .filter((a) => a.date >= new Date().toISOString().split('T')[0] && a.status === 'confirmed')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))[0]

    return mockServer['jsonResponse']({
      nextAppointment: next
        ? {
            id: next.id,
            date: next.date,
            time: next.startTime,
            service: next.serviceName,
            professional: next.professionalName,
          }
        : null,
      totalAppointments: apps.length,
      confirmedCount: confirmed.length,
      totalSpent: confirmed.reduce((s, a) => s + a.servicePrice, 0),
      loyaltyPoints: 0,
    })
  })

  mockServer.get('/v1/cliente/agendamentos', async (req) => {
    const user = requireUser(req)
    const appointmentsTable = db.getOrCreate<{
      id: string
      date: string
      startTime: string
      endTime: string
      serviceName: string
      servicePrice: number
      professionalName: string
      status: string
      clientEmail?: string
      userId: string
    }>('agenda_appointments')

    const apps = appointmentsTable
      .find((a) => a.clientEmail === user.email)
      .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))

    return mockServer['jsonResponse'](
      apps.map((a) => ({
        id: a.id,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
        serviceName: a.serviceName,
        servicePrice: a.servicePrice,
        professionalName: a.professionalName,
        status: a.status,
      })),
    )
  })

  mockServer.patch('/v1/cliente/agendamentos/:id/cancelar', async (req) => {
    const user = requireUser(req)
    const { id } = req.params ?? {}
    if (!id) throw ApiRequestError.validation({ id: ['ID é obrigatório'] })

    const appointmentsTable = db.getOrCreate<{
      id: string
      status: string
      clientEmail?: string
      [key: string]: unknown
    }>('agenda_appointments')

    const app = appointmentsTable.findOne((a) => a.id === id && a.clientEmail === user.email)
    if (!app) throw ApiRequestError.notFound('Agendamento não encontrado')
    if (app.status === 'cancelled') throw ApiRequestError.conflict('Agendamento já cancelado')

    appointmentsTable.update(id, { status: 'cancelled' })
    return mockServer['jsonResponse']({ message: 'Agendamento cancelado com sucesso' })
  })

  mockServer.get('/v1/cliente/fidelidade', async (req) => {
    const user = requireUser(req)
    const loyaltyTable = db.getOrCreate<LoyaltyRow>('cliente_loyalty')
    let row = loyaltyTable.findOne((r) => r.userId === user.id)

    if (!row) {
      row = {
        id: crypto.randomUUID(),
        userId: user.id,
        points: 0,
        totalVisits: 0,
        lastVisit: new Date().toISOString(),
        tier: 'bronze',
      }
      loyaltyTable.insert(row)
    }

    const appointmentsTable = db.getOrCreate<{
      id: string
      date: string
      status: string
      clientEmail?: string
    }>('agenda_appointments')
    const visits = appointmentsTable.find(
      (a) => a.clientEmail === user.email && a.status === 'confirmed',
    ).length

    const tier = visits >= 20 ? 'ouro' : visits >= 10 ? 'prata' : 'bronze'

    return mockServer['jsonResponse']({
      points: row.points,
      totalVisits: visits,
      tier,
      nextTier: tier === 'ouro' ? null : tier === 'prata' ? 'ouro' : 'prata',
      pointsToNextTier: tier === 'ouro' ? 0 : tier === 'prata' ? 20 - visits : 10 - visits,
      benefits: {
        bronze: '5% de desconto em serviços',
        prata: '10% de desconto + prioridade',
        ouro: '15% de desconto + prioridade + cortesia mensal',
      },
    })
  })

  mockServer.patch('/v1/cliente/perfil', async (req) => {
    const user = requireUser(req)
    const { name, telefone } = req.body as { name?: string; telefone?: string }

    const usersTable = db.getOrCreate<{ id: string; name: string; [key: string]: unknown }>(
      'auth_users',
    )

    const updates: Record<string, unknown> = {}
    if (name) updates.name = name
    if (telefone) {
      const onboarding = (user.onboardingData as Record<string, unknown>) ?? {}
      onboarding.business = {
        ...((onboarding.business as Record<string, unknown>) ?? {}),
        telefone,
      }
      updates.onboardingData = onboarding
    }

    usersTable.update(user.id, updates)
    return mockServer['jsonResponse']({ message: 'Perfil atualizado com sucesso' })
  })
}
