import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateServiceInput, UpdateServiceInput } from '../schemas/servicos'

export async function listServices(userId: string, activeOnly = false) {
  const where: Record<string, unknown> = { userId }
  if (activeOnly) where.active = true
  return prisma.service.findMany({ where, orderBy: { name: 'asc' } })
}

export async function getServiceById(userId: string, id: string) {
  const service = await prisma.service.findFirst({ where: { id, userId } })
  if (!service) throw new AppError(404, 'NOT_FOUND', 'Serviço não encontrado')
  return service
}

export async function createService(userId: string, data: CreateServiceInput) {
  return prisma.service.create({ data: { ...data, userId } })
}

export async function updateService(userId: string, id: string, data: UpdateServiceInput) {
  const existing = await prisma.service.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Serviço não encontrado')
  return prisma.service.update({ where: { id }, data })
}

export async function deleteService(userId: string, id: string) {
  const existing = await prisma.service.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Serviço não encontrado')
  await prisma.service.delete({ where: { id } })
}
