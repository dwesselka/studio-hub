import { mockServer } from '../server'
import { db } from '../db'
import { ApiRequestError } from '../types'
import type { ApiRequest } from '../types'

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  serviceId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show'
  notes?: string
  createdAt: string
  updatedAt?: string
  reminderSent: boolean
  confirmationSent: boolean
  userId: string
}

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

export function registerAgendaHandlers(): void {
  mockServer.get('/agenda', async (req) => {
    const userId = requireUserId(req)
    const { date, view, professionalId, status } = req.params ?? {}
    const page = parseInt(req.params?.page || '1')
    const perPage = parseInt(req.params?.perPage || '50')

    let appointments = appointmentsTable.find((a) => a.userId === userId)

    if (date) {
      if (view === 'week') {
        appointments = appointments.filter((a) => a.date >= date)
      } else {
        appointments = appointments.filter((a) => a.date === date)
      }
    }

    if (professionalId) {
      appointments = appointments.filter((a) => a.professionalId === professionalId)
    }

    if (status && status !== 'all') {
      appointments = appointments.filter((a) => a.status === status)
    }

    appointments.sort((a, b) => a.startTime.localeCompare(b.startTime))

    const total = appointments.length
    const start = (page - 1) * perPage
    const items = appointments.slice(start, start + perPage)

    return mockServer['jsonResponse']({
      items,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    })
  })

  mockServer.get('/agenda/date/:date', async (req) => {
    const userId = requireUserId(req)
    const { date } = req.params ?? {}

    if (!date) throw ApiRequestError.validation({ date: ['Data é obrigatória'] })

    const appointments = appointmentsTable
      .find((a) => a.userId === userId && a.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    return mockServer['jsonResponse'](appointments)
  })

  mockServer.get('/agenda/range', async (req) => {
    const userId = requireUserId(req)
    const { startDate, endDate } = req.params ?? {}

    if (!startDate || !endDate) {
      throw ApiRequestError.validation({
        startDate: ['Data início é obrigatória'],
        endDate: ['Data fim é obrigatória'],
      })
    }

    const appointments = appointmentsTable
      .find((a) => a.userId === userId && a.date >= startDate && a.date <= endDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    return mockServer['jsonResponse'](appointments)
  })

  mockServer.post('/agenda', async (req) => {
    const userId = requireUserId(req)
    const data = req.body as Omit<
      Appointment,
      'id' | 'createdAt' | 'reminderSent' | 'confirmationSent' | 'userId'
    >

    if (!data.clientName || !data.clientPhone || !data.serviceId || !data.startTime || !data.date) {
      const errors: Record<string, string[]> = {}
      if (!data.clientName) errors.clientName = ['Nome do cliente é obrigatório']
      if (!data.clientPhone) errors.clientPhone = ['Telefone é obrigatório']
      if (!data.serviceId) errors.serviceId = ['Serviço é obrigatório']
      if (!data.startTime) errors.startTime = ['Horário é obrigatório']
      if (!data.date) errors.date = ['Data é obrigatória']
      throw ApiRequestError.validation(errors)
    }

    const existing = appointmentsTable.find(
      (a) =>
        a.userId === userId &&
        a.professionalId === data.professionalId &&
        a.date === data.date &&
        a.status !== 'cancelled' &&
        data.startTime < a.endTime &&
        data.endTime > a.startTime,
    )

    if (existing.length > 0) {
      throw ApiRequestError.conflict('Este horário já está ocupado')
    }

    const appointment: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      reminderSent: false,
      confirmationSent: false,
    }

    appointmentsTable.insert(appointment)

    return mockServer['jsonResponse'](appointment, 201)
  })

  mockServer.get('/agenda/:id', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}

    const appointment = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!appointment) throw ApiRequestError.notFound('Agendamento não encontrado')

    return mockServer['jsonResponse'](appointment)
  })

  mockServer.put('/agenda/:id', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}
    const updates = req.body as Partial<Appointment>

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound('Agendamento não encontrado')

    const updated = appointmentsTable.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })

    return mockServer['jsonResponse'](updated)
  })

  mockServer.patch('/agenda/:id/confirm', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound()

    const updated = appointmentsTable.update(id, {
      status: 'confirmed',
      confirmationSent: true,
      updatedAt: new Date().toISOString(),
    })

    return mockServer['jsonResponse'](updated)
  })

  mockServer.patch('/agenda/:id/cancel', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound()

    const updated = appointmentsTable.update(id, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    })

    return mockServer['jsonResponse'](updated)
  })

  mockServer.patch('/agenda/:id/no-show', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound()

    const updated = appointmentsTable.update(id, {
      status: 'no-show',
      updatedAt: new Date().toISOString(),
    })

    return mockServer['jsonResponse'](updated)
  })

  mockServer.post('/agenda/:id/reschedule', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}
    const { date, startTime, endTime } = req.body as {
      date: string
      startTime: string
      endTime: string
    }

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound()

    const conflict = appointmentsTable.findOne(
      (a) =>
        a.id !== id &&
        a.userId === userId &&
        a.professionalId === existing.professionalId &&
        a.date === date &&
        a.status !== 'cancelled' &&
        startTime < a.endTime &&
        endTime > a.startTime,
    )

    if (conflict) {
      throw ApiRequestError.conflict('Já existe um agendamento neste horário')
    }

    const updated = appointmentsTable.update(id, {
      date,
      startTime,
      endTime,
      status: 'confirmed',
      updatedAt: new Date().toISOString(),
    })

    return mockServer['jsonResponse'](updated)
  })

  mockServer.delete('/agenda/:id', async (req) => {
    const userId = requireUserId(req)
    const { id } = req.params ?? {}

    const existing = appointmentsTable.findOne((a) => a.id === id && a.userId === userId)
    if (!existing) throw ApiRequestError.notFound()

    appointmentsTable.delete(id)
    return mockServer['jsonResponse']({ message: 'Agendamento removido' })
  })

  mockServer.get('/agenda/conflicts', async (req) => {
    const userId = requireUserId(req)
    const { professionalId, date, startTime, endTime, excludeId } = req.params ?? {}

    if (!professionalId || !date || !startTime || !endTime) {
      throw ApiRequestError.validation({
        professionalId: professionalId ? [] : ['Profissional é obrigatório'],
        date: date ? [] : ['Data é obrigatória'],
        startTime: startTime ? [] : ['Horário início é obrigatório'],
        endTime: endTime ? [] : ['Horário fim é obrigatório'],
      })
    }

    const conflicts = appointmentsTable.find(
      (a) =>
        a.userId === userId &&
        a.professionalId === professionalId &&
        a.date === date &&
        a.status !== 'cancelled' &&
        a.id !== excludeId &&
        startTime < a.endTime &&
        endTime > a.startTime,
    )

    return mockServer['jsonResponse']({ hasConflict: conflicts.length > 0, conflicts })
  })

  mockServer.get('/agenda/suggestions', async (req) => {
    const userId = requireUserId(req)
    const { date, professionalId, serviceDuration: durationStr } = req.params ?? {}
    const serviceDuration = parseInt(durationStr || '60')

    const dayOfWeek = new Date(date + 'T12:00:00').getDay()
    const hours = [
      { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
    ]

    const dayHours = hours.find((h) => h.dayOfWeek === dayOfWeek)
    if (!dayHours || !dayHours.isOpen) {
      return mockServer['jsonResponse']([])
    }

    const [openH, openM] = dayHours.openTime.split(':').map(Number)
    const [closeH, closeM] = dayHours.closeTime.split(':').map(Number)
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM

    const pros = professionalId
      ? [professionalId]
      : [
          ...new Set(
            appointmentsTable.find((a) => a.userId === userId).map((a) => a.professionalId),
          ),
        ]

    const suggestions: { time: string; professionalId: string; score: number; reason: string }[] =
      []

    for (const proId of pros.length > 0 ? pros : ['default']) {
      for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += 30) {
        const startH = Math.floor(m / 60)
        const startM = m % 60
        const endM = m + serviceDuration
        const endH = Math.floor(endM / 60)
        const endMin = endM % 60

        const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
        const endTime = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

        const hasConflict =
          appointmentsTable.find(
            (a) =>
              a.userId === userId &&
              a.professionalId === proId &&
              a.date === date &&
              a.status !== 'cancelled' &&
              startTime < a.endTime &&
              endTime > a.startTime,
          ).length > 0

        if (hasConflict) continue

        const score = startH >= 9 && startH <= 11 ? 95 : startH >= 14 && startH <= 16 ? 85 : 70
        const reason =
          score >= 90
            ? 'Horário de pico — maior procura'
            : score >= 80
              ? 'Horário regular — boa disponibilidade'
              : 'Horário alternativo — menor movimento'

        suggestions.push({ time: startTime, professionalId: proId, score, reason })
      }
    }

    suggestions.sort((a, b) => b.score - a.score)

    return mockServer['jsonResponse'](suggestions.slice(0, 5))
  })
}
