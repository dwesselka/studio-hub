import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateAtendimentoInput, UpdateAtendimentoInput } from '../schemas/atendimento'

export async function listAtendimentos(
  userId: string,
  filters: { status?: string; page: number; perPage: number },
) {
  const where: Record<string, unknown> = { userId }
  if (filters.status) where.status = filters.status

  const [items, total] = await Promise.all([
    prisma.atendimento.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
    prisma.atendimento.count({ where }),
  ])
  return { items, total }
}

export async function getAtendimentoById(userId: string, id: string) {
  const item = await prisma.atendimento.findFirst({ where: { id, userId } })
  if (!item) throw new AppError(404, 'NOT_FOUND', 'Atendimento não encontrado')
  return item
}

export async function createAtendimento(userId: string, data: CreateAtendimentoInput) {
  return prisma.atendimento.create({ data: { ...data, userId } })
}

export async function updateAtendimento(userId: string, id: string, data: UpdateAtendimentoInput) {
  const existing = await prisma.atendimento.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Atendimento não encontrado')
  return prisma.atendimento.update({ where: { id }, data })
}
