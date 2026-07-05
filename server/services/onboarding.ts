import { prisma } from '../../src/lib/prisma'
import { AppError } from '../lib/errors'

const SEGMENT_SERVICES: Record<string, { name: string; duration: number; price: number; category: string }[]> = {
  salao: [
    { name: 'Corte Feminino', duration: 60, price: 8000, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 6000, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 15000, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
    { name: 'Pedicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
    { name: 'Hidratação', duration: 50, price: 7000, category: 'Tratamento' },
    { name: 'Luzes', duration: 150, price: 20000, category: 'Coloração' },
    { name: 'Design de Sobrancelhas', duration: 20, price: 3000, category: 'Sobrancelha' },
  ],
  barbearia: [
    { name: 'Corte Masculino', duration: 40, price: 5000, category: 'Corte' },
    { name: 'Barba', duration: 30, price: 3500, category: 'Barba' },
    { name: 'Corte + Barba', duration: 60, price: 7500, category: 'Combo' },
    { name: 'Sobrancelha', duration: 15, price: 2500, category: 'Sobrancelha' },
    { name: 'Hidratação Capilar', duration: 30, price: 4000, category: 'Tratamento' },
    { name: 'Pigmentação Capilar', duration: 90, price: 12000, category: 'Estética' },
  ],
  autonomo: [
    { name: 'Corte Feminino', duration: 60, price: 7000, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 5000, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 13000, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 4000, category: 'Mãos & Pés' },
    { name: 'Design de Sobrancelhas', duration: 30, price: 3500, category: 'Sobrancelha' },
  ],
  clinica: [
    { name: 'Limpeza de Pele', duration: 60, price: 12000, category: 'Estética Facial' },
    { name: 'Peeling Químico', duration: 45, price: 15000, category: 'Estética Facial' },
    { name: 'Laser', duration: 30, price: 20000, category: 'Equipamentos' },
    { name: 'Massagem Modeladora', duration: 50, price: 10000, category: 'Massagens' },
    { name: 'Drenagem Linfática', duration: 60, price: 9000, category: 'Massagens' },
    { name: 'Microagulhamento', duration: 60, price: 18000, category: 'Estética Facial' },
  ],
}

export async function getPrepopulatedServices(segmento: string) {
  const templates = SEGMENT_SERVICES[segmento] ?? []
  return templates.map((t) => ({
    ...t,
    id: crypto.randomUUID(),
  }))
}

export async function saveBusinessData(userId: string, data: {
  nome: string
  segmento: string
  endereco: string
  telefone: string
  logo?: string
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      businessName: data.nome,
      businessSegment: data.segmento,
      businessAddress: data.endereco,
      businessPhone: data.telefone,
      businessLogo: data.logo,
    },
    select: {
      id: true,
      email: true,
      name: true,
      businessName: true,
      businessSegment: true,
      businessAddress: true,
      businessPhone: true,
      businessLogo: true,
      onboardingCompleted: true,
    },
  })
}

export async function saveHours(userId: string, hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]) {
  await prisma.businessHour.deleteMany({ where: { userId } })
  await prisma.businessHour.createMany({
    data: hours.map((h) => ({ ...h, userId })),
  })
}

export async function saveServices(userId: string, services: { name: string; duration: number; price: number; category: string }[]) {
  await prisma.service.deleteMany({ where: { userId } })
  await prisma.service.createMany({
    data: services.map((s) => ({ ...s, userId, active: true })),
  })
}

export async function saveTeam(userId: string, team: { name: string; role: string; phone: string; email: string }[]) {
  await prisma.teamMember.deleteMany({ where: { userId } })
  if (team.length > 0) {
    await prisma.teamMember.createMany({
      data: team.map((m) => ({ ...m, userId, active: true })),
    })
  }
}

export async function completeOnboarding(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
    select: {
      id: true,
      email: true,
      name: true,
      businessName: true,
      businessSegment: true,
      onboardingCompleted: true,
    },
  })
}
