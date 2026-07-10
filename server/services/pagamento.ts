import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'
import type { CreatePaymentInput, UpdatePaymentInput } from '../schemas/pagamento'

export async function listPayments(userId: string, filters: { status?: string; page: number; perPage: number }) {
  const where: Record<string, unknown> = { userId }
  if (filters.status) where.status = filters.status

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
    prisma.payment.count({ where }),
  ])
  return { items, total }
}

export async function getPaymentById(userId: string, id: string) {
  const payment = await prisma.payment.findFirst({ where: { id, userId } })
  if (!payment) throw new AppError(404, 'NOT_FOUND', 'Pagamento não encontrado')
  return payment
}

export async function createPayment(userId: string, data: CreatePaymentInput) {
  return prisma.payment.create({ data: { ...data, userId } })
}

export async function updatePayment(userId: string, id: string, data: UpdatePaymentInput) {
  const existing = await prisma.payment.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Pagamento não encontrado')
  return prisma.payment.update({ where: { id }, data })
}

export async function getPaymentsByAtendimento(userId: string, atendimentoId: string) {
  return prisma.payment.findMany({
    where: { userId, atendimentoId },
    orderBy: { createdAt: 'desc' },
  })
}
