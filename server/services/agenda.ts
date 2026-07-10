import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateAppointmentInput, UpdateAppointmentInput, RescheduleInput } from '../schemas/agenda'

export async function listAppointments(
  userId: string,
  filters: {
    date?: string
    view?: string
    professionalId?: string
    status?: string
    page: number
    perPage: number
  },
) {
  const where: Record<string, unknown> = { userId }

  if (filters.date) {
    if (filters.view === 'week') {
      where.date = { gte: filters.date }
    } else {
      where.date = filters.date
    }
  }

  if (filters.professionalId) {
    where.professionalId = filters.professionalId
  }

  if (filters.status && filters.status !== 'all') {
    where.status = filters.status
  }

  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
    prisma.appointment.count({ where }),
  ])

  return { items, total }
}

export async function getAppointmentById(userId: string, id: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id, userId },
  })
  if (!appointment) {
    throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  }
  return appointment
}

export async function createAppointment(userId: string, data: CreateAppointmentInput) {
  const conflict = await prisma.appointment.findFirst({
    where: {
      userId,
      professionalId: data.professionalId,
      date: data.date,
      status: { notIn: ['cancelled'] },
      startTime: { lt: data.endTime },
      endTime: { gt: data.startTime },
    },
  })

  if (conflict) {
    throw new AppError(409, 'CONFLICT', 'Este horário já está ocupado')
  }

  return prisma.appointment.create({
    data: { ...data, userId },
  })
}

export async function updateAppointment(userId: string, id: string, data: UpdateAppointmentInput) {
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  }

  return prisma.appointment.update({
    where: { id },
    data,
  })
}

export async function deleteAppointment(userId: string, id: string) {
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  }

  await prisma.appointment.delete({ where: { id } })
}

export async function changeStatus(userId: string, id: string, status: string) {
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  }

  const updates: Record<string, unknown> = { status }

  if (status === 'confirmed') {
    updates.confirmationSent = true
  }

  return prisma.appointment.update({ where: { id }, data: updates })
}

export async function rescheduleAppointment(userId: string, id: string, data: RescheduleInput) {
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  })
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  }

  const conflict = await prisma.appointment.findFirst({
    where: {
      id: { not: id },
      userId,
      professionalId: existing.professionalId,
      date: data.date,
      status: { notIn: ['cancelled'] },
      startTime: { lt: data.endTime },
      endTime: { gt: data.startTime },
    },
  })

  if (conflict) {
    throw new AppError(409, 'CONFLICT', 'Já existe um agendamento neste horário')
  }

  return prisma.appointment.update({
    where: { id },
    data: { ...data, status: 'confirmed' },
  })
}

export async function checkConflicts(
  userId: string,
  params: { professionalId: string; date: string; startTime: string; endTime: string; excludeId?: string },
) {
  const where: Record<string, unknown> = {
    userId,
    professionalId: params.professionalId,
    date: params.date,
    status: { notIn: ['cancelled'] },
    startTime: { lt: params.endTime },
    endTime: { gt: params.startTime },
  }

  if (params.excludeId) {
    where.id = { not: params.excludeId }
  }

  const conflicts = await prisma.appointment.findMany({ where })
  return { hasConflict: conflicts.length > 0, conflicts }
}

export async function getSuggestions(
  userId: string,
  params: { date: string; professionalId?: string; serviceDuration: number },
) {
  const dayOfWeek = new Date(params.date + 'T12:00:00').getDay()

  const hours = await prisma.businessHour.findFirst({
    where: { userId, dayOfWeek },
  })

  if (!hours || !hours.isOpen) return []

  const [openH, openM] = hours.openTime.split(':').map(Number)
  const [closeH, closeM] = hours.closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const professionalIds = params.professionalId
    ? [params.professionalId]
    : (await prisma.teamMember.findMany({
        where: { userId, active: true },
        select: { id: true, name: true },
      })).map((m) => m.id)

  const memberNames = params.professionalId
    ? {}
    : Object.fromEntries(
        (await prisma.teamMember.findMany({
          where: { userId, active: true },
          select: { id: true, name: true },
        })).map((m) => [m.id, m.name]),
      )

  const existingApps = await prisma.appointment.findMany({
    where: {
      userId,
      date: params.date,
      status: { notIn: ['cancelled'] },
    },
  })

  const suggestions: { time: string; professionalId: string; professionalName?: string; score: number; reason: string }[] = []

  for (const proId of professionalIds) {
    for (let m = openMinutes; m + params.serviceDuration <= closeMinutes; m += 30) {
      const startH = Math.floor(m / 60)
      const startM = m % 60
      const endM = m + params.serviceDuration
      const endH = Math.floor(endM / 60)
      const endMin = endM % 60

      const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
      const endTime = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

      const hasConflict = existingApps.some(
        (a) =>
          a.professionalId === proId &&
          startTime < a.endTime &&
          endTime > a.startTime,
      )

      if (hasConflict) continue

      const score = startH >= 9 && startH <= 11 ? 95 : startH >= 14 && startH <= 16 ? 85 : 70
      const reason =
        score >= 90
          ? 'Horário de pico — maior procura'
          : score >= 80
            ? 'Horário regular — boa disponibilidade'
            : 'Horário alternativo — menor movimento'

      suggestions.push({
        time: startTime,
        professionalId: proId,
        professionalName: memberNames[proId],
        score,
        reason,
      })
    }
  }

  suggestions.sort((a, b) => b.score - a.score)
  return suggestions.slice(0, 5)
}
