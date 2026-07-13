import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'

function getClientPhone(user: {
  cliente?: { telefone: string | null } | null
  email: string
}): string {
  return user.cliente?.telefone || user.email
}

export async function getDashboard(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, cliente: { select: { telefone: true } } },
  })
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')

  const phone = getClientPhone(user)
  const today = new Date().toISOString().split('T')[0]

  const [nextAppointment, points] = await Promise.all([
    prisma.appointment.findFirst({
      where: { clientPhone: phone, date: { gte: today }, status: { in: ['pending', 'confirmed'] } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      select: {
        id: true,
        date: true,
        startTime: true,
        serviceName: true,
        professionalName: true,
        status: true,
      },
    }),
    prisma.clientPoints.findFirst({
      where: { clientPhone: phone },
      select: { balance: true, lifetime: true },
    }),
  ])

  return { name: user.name, nextAppointment, points: points ?? { balance: 0, lifetime: 0 } }
}

export async function listAgendamentos(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, cliente: { select: { telefone: true } } },
  })
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')

  const phone = getClientPhone(user)
  return prisma.appointment.findMany({
    where: { clientPhone: phone },
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      serviceName: true,
      servicePrice: true,
      professionalName: true,
      status: true,
    },
  })
}

export async function cancelarAgendamento(userId: string, appointmentId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, cliente: { select: { telefone: true } } },
  })
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')

  const phone = getClientPhone(user)
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, clientPhone: phone },
  })
  if (!appointment) throw new AppError(404, 'NOT_FOUND', 'Agendamento não encontrado')
  if (appointment.status !== 'pending')
    throw new AppError(400, 'BAD_REQUEST', 'Só é possível cancelar agendamentos pendentes')

  return prisma.appointment.update({ where: { id: appointmentId }, data: { status: 'cancelled' } })
}

export async function getFidelidade(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, cliente: { select: { telefone: true } } },
  })
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')

  const phone = getClientPhone(user)

  const [points, history, promotions] = await Promise.all([
    prisma.clientPoints.findFirst({
      where: { clientPhone: phone },
      select: { balance: true, lifetime: true, clientName: true },
    }),
    prisma.pointsTransaction.findMany({
      where: { clientPhone: phone },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { type: true, amount: true, description: true, createdAt: true },
    }),
    prisma.loyaltyPromotion.findMany({
      where: { status: 'active' },
      take: 10,
      select: {
        id: true,
        name: true,
        requiredPoints: true,
        discountPercent: true,
        expiresAt: true,
      },
    }),
  ])

  return {
    points: points ?? { balance: 0, lifetime: 0, clientName: user.name },
    history,
    promotions,
  }
}

export async function atualizarPerfil(userId: string, data: { name?: string; telefone?: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')

  if (data.name) {
    await prisma.user.update({ where: { id: userId }, data: { name: data.name } })
  }

  if (data.telefone) {
    const clienteRec = await prisma.cliente.findFirst({ where: { userAccount: { id: userId } } })
    if (clienteRec) {
      await prisma.cliente.update({
        where: { id: clienteRec.id },
        data: { telefone: data.telefone },
      })
    }
  }

  return prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
}
