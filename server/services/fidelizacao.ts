import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type {
  LoyaltyProgramInput,
  CreatePromotionInput,
  UpdatePromotionInput,
} from '../schemas/fidelizacao'

export async function getLoyaltyProgram(userId: string) {
  const program = await prisma.loyaltyProgram.findUnique({ where: { userId } })
  if (!program) throw new AppError(404, 'NOT_FOUND', 'Programa de fidelidade não configurado')
  return program
}

export async function updateLoyaltyProgram(userId: string, data: Partial<LoyaltyProgramInput>) {
  const existing = await prisma.loyaltyProgram.findUnique({ where: { userId } })
  if (!existing) {
    return prisma.loyaltyProgram.create({ data: { ...data, userId } })
  }
  return prisma.loyaltyProgram.update({ where: { userId }, data })
}

export async function listPromotions(userId: string) {
  return prisma.loyaltyPromotion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createPromotion(userId: string, data: CreatePromotionInput) {
  return prisma.loyaltyPromotion.create({
    data: {
      ...data,
      userId,
      statsSent: 0,
      statsRedeemed: 0,
    },
  })
}

export async function updatePromotion(userId: string, id: string, data: UpdatePromotionInput) {
  const existing = await prisma.loyaltyPromotion.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Promoção não encontrada')
  return prisma.loyaltyPromotion.update({ where: { id }, data })
}

export async function getClientPoints(userId: string, clientPhone: string) {
  const points = await prisma.clientPoints.findUnique({
    where: { userId_clientPhone: { userId, clientPhone } },
  })
  return points ?? { clientPhone, clientName: '', balance: 0, lifetime: 0, updatedAt: new Date() }
}

export async function listPointsTransactions(userId: string, clientPhone?: string) {
  const where: Record<string, unknown> = { userId }
  if (clientPhone) where.clientPhone = clientPhone
  return prisma.pointsTransaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}
