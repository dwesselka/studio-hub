import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateTeamMemberInput, UpdateTeamMemberInput } from '../schemas/equipe'

export async function listTeam(userId: string) {
  return prisma.teamMember.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })
}

export async function getTeamMemberById(userId: string, id: string) {
  const member = await prisma.teamMember.findFirst({ where: { id, userId } })
  if (!member) throw new AppError(404, 'NOT_FOUND', 'Membro não encontrado')
  return member
}

export async function createTeamMember(userId: string, data: CreateTeamMemberInput) {
  return prisma.teamMember.create({ data: { ...data, userId } })
}

export async function updateTeamMember(userId: string, id: string, data: UpdateTeamMemberInput) {
  const existing = await prisma.teamMember.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Membro não encontrado')
  return prisma.teamMember.update({ where: { id }, data })
}

export async function deleteTeamMember(userId: string, id: string) {
  const existing = await prisma.teamMember.findFirst({ where: { id, userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Membro não encontrado')
  await prisma.teamMember.delete({ where: { id } })
}
