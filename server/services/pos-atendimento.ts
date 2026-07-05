import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateFeedbackInput, CreateCampaignInput, UpdateCampaignInput } from '../schemas/pos-atendimento'

export async function listFeedback(userId: string, filters: { page: number; perPage: number }) {
  const [items, total] = await Promise.all([
    prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
    prisma.feedback.count({ where: { userId } }),
  ])
  return { items, total }
}

export async function createFeedback(userId: string, data: CreateFeedbackInput) {
  return prisma.feedback.create({ data: { ...data, userId } })
}

export async function listCampaigns(userId: string) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createCampaign(userId: string, data: CreateCampaignInput) {
  return prisma.campaign.create({
    data: {
      ...data,
      userId,
      statsSent: 0,
      statsResponded: 0,
      statsConverted: 0,
    },
  })
}

export async function updateCampaign(userId: string, id: string, data: UpdateCampaignInput) {
  const existing = await prisma.campaign.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Campanha não encontrada')
  return prisma.campaign.update({ where: { id }, data })
}

export async function deleteCampaign(userId: string, id: string) {
  const existing = await prisma.campaign.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Campanha não encontrada')
  await prisma.campaign.delete({ where: { id } })
}
