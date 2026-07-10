import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateClienteInput, UpdateClienteInput } from '../schemas/clientes'

export async function listClientes(
  userId: string,
  filters: { status?: string; search?: string; page: number; perPage: number },
) {
  const where: Record<string, unknown> = { userId }

  if (filters.status && filters.status !== 'todos') {
    where.status = filters.status
  }

  if (filters.search) {
    where.OR = [
      { nome: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { telefone: { contains: filters.search } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      orderBy: { nome: 'asc' },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
    prisma.cliente.count({ where }),
  ])

  return { items, total }
}

export async function getClienteById(userId: string, id: string) {
  const cliente = await prisma.cliente.findFirst({ where: { id, userId } })
  if (!cliente) throw new AppError(404, 'NOT_FOUND', 'Cliente não encontrado')
  return cliente
}

export async function createCliente(userId: string, data: CreateClienteInput) {
  return prisma.cliente.create({ data: { ...data, userId } })
}

export async function updateCliente(userId: string, id: string, data: UpdateClienteInput) {
  const existing = await prisma.cliente.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Cliente não encontrado')
  return prisma.cliente.update({ where: { id }, data })
}

export async function deleteCliente(userId: string, id: string) {
  const existing = await prisma.cliente.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Cliente não encontrado')
  await prisma.cliente.delete({ where: { id } })
}
