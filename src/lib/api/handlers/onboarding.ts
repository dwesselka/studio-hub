import { mockServer } from '../server'
import { db } from '../db'
import { ApiRequestError } from '../types'
import type { ApiRequest } from '../types'
import type { AuthUser } from './auth'

const usersTable = db.getOrCreate<AuthUser>('auth_users')

function requireUser(req: ApiRequest): AuthUser {
  const token = req.headers?.authorization?.replace('Bearer ', '')
  if (!token) throw ApiRequestError.unauthorized()

  const sessionsTable = db.getOrCreate<{
    id: string
    userId: string
    token: string
    expiresAt: string
  }>('auth_sessions')
  const session = sessionsTable.findOne((s) => s.token === token)
  if (!session) throw ApiRequestError.unauthorized('Sessão expirada')

  const user = usersTable.getById(session.userId)
  if (!user) throw ApiRequestError.unauthorized('Usuário não encontrado')

  return user
}

const SEGMENT_SERVICES: Record<
  string,
  { name: string; duration: number; price: number; category: string }[]
> = {
  salao: [
    { name: 'Corte Feminino', duration: 60, price: 80, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 60, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 150, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 45, category: 'Mãos & Pés' },
    { name: 'Pedicure', duration: 40, price: 45, category: 'Mãos & Pés' },
    { name: 'Hidratação', duration: 50, price: 70, category: 'Tratamento' },
    { name: 'Luzes', duration: 150, price: 200, category: 'Coloração' },
    { name: 'Design de Sobrancelhas', duration: 20, price: 30, category: 'Sobrancelha' },
  ],
  barbearia: [
    { name: 'Corte Masculino', duration: 40, price: 50, category: 'Corte' },
    { name: 'Barba', duration: 30, price: 35, category: 'Barba' },
    { name: 'Corte + Barba', duration: 60, price: 75, category: 'Combo' },
    { name: 'Sobrancelha', duration: 15, price: 25, category: 'Sobrancelha' },
    { name: 'Hidratação Capilar', duration: 30, price: 40, category: 'Tratamento' },
    { name: 'Pigmentação Capilar', duration: 90, price: 120, category: 'Estética' },
  ],
  autonomo: [
    { name: 'Corte Feminino', duration: 60, price: 70, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 50, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 130, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 40, category: 'Mãos & Pés' },
    { name: 'Design de Sobrancelhas', duration: 30, price: 35, category: 'Sobrancelha' },
  ],
  clinica: [
    { name: 'Limpeza de Pele', duration: 60, price: 120, category: 'Estética Facial' },
    { name: 'Peeling Químico', duration: 45, price: 150, category: 'Estética Facial' },
    { name: 'Laser', duration: 30, price: 200, category: 'Equipamentos' },
    { name: 'Massagem Modeladora', duration: 50, price: 100, category: 'Massagens' },
    { name: 'Drenagem Linfática', duration: 60, price: 90, category: 'Massagens' },
    { name: 'Microagulhamento', duration: 60, price: 180, category: 'Estética Facial' },
  ],
}

export function registerOnboardingHandlers(): void {
  mockServer.put('/onboarding/business', async (req) => {
    const user = requireUser(req)
    const data = req.body as {
      nome: string
      segmento: string
      endereco: string
      telefone: string
      logo?: string
    }

    const updated = usersTable.update(user.id, {
      onboardingData: {
        ...user.onboardingData,
        business: data,
        progress: { ...user.onboardingData.progress, businessDataComplete: true },
      },
    })

    return mockServer['jsonResponse']({ onboardingData: updated.onboardingData })
  })

  mockServer.put('/onboarding/hours', async (req) => {
    const user = requireUser(req)
    const hours = req.body as {
      dayOfWeek: number
      isOpen: boolean
      openTime: string
      closeTime: string
    }[]

    const updated = usersTable.update(user.id, {
      onboardingData: {
        ...user.onboardingData,
        hours,
        progress: { ...user.onboardingData.progress, hoursConfigured: true },
      },
    })

    return mockServer['jsonResponse']({ onboardingData: updated.onboardingData })
  })

  mockServer.put('/onboarding/services', async (req) => {
    const user = requireUser(req)
    const services = req.body as {
      id: string
      name: string
      duration: number
      price: number
      category: string
    }[]

    const updated = usersTable.update(user.id, {
      onboardingData: {
        ...user.onboardingData,
        services,
        progress: { ...user.onboardingData.progress, servicesReviewed: true },
      },
    })

    return mockServer['jsonResponse']({ onboardingData: updated.onboardingData })
  })

  mockServer.put('/onboarding/team', async (req) => {
    const user = requireUser(req)
    const team = req.body as {
      id: string
      name: string
      role: string
      phone: string
      email: string
    }[]

    const updated = usersTable.update(user.id, {
      onboardingData: {
        ...user.onboardingData,
        team,
        progress: { ...user.onboardingData.progress, teamAdded: true },
      },
    })

    return mockServer['jsonResponse']({ onboardingData: updated.onboardingData })
  })

  mockServer.post('/onboarding/complete', async (req) => {
    const user = requireUser(req)

    const updated = usersTable.update(user.id, {
      onboardingData: {
        ...user.onboardingData,
        completed: true,
      },
    })

    return mockServer['jsonResponse']({ onboardingData: updated.onboardingData })
  })

  mockServer.get('/onboarding/prepopulated/:segmento', async (req) => {
    const segmento = req.params?.segmento || ''
    const templates = SEGMENT_SERVICES[segmento]

    if (!templates) {
      return mockServer['jsonResponse']([])
    }

    const services = templates.map((t) => ({
      ...t,
      id: crypto.randomUUID(),
    }))

    return mockServer['jsonResponse'](services)
  })

  mockServer.get('/onboarding/progress', async (req) => {
    const user = requireUser(req)
    const progress = user.onboardingData.progress
    const steps = [
      progress.accountCreated,
      progress.businessDataComplete,
      progress.hoursConfigured,
      progress.servicesReviewed,
      progress.teamAdded,
    ]
    const completed = steps.filter(Boolean).length
    const percent = Math.round((completed / steps.length) * 100)

    return mockServer['jsonResponse']({
      progress,
      percent,
      completed: user.onboardingData.completed,
    })
  })
}
