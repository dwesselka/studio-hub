import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { scryptSync, randomBytes } from 'node:crypto'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

function hashPassword(password: string): string {
  const salt = randomBytes(32)
  const hash = scryptSync(password, salt, 64)
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`
}

function today(daysOffset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().split('T')[0]
}

const TEAM_MEMBERS = [
  { name: 'Carla Mendes', role: 'Cabeleireira', phone: '(11) 98888-0001', email: 'carla@exemplo.com', commission: 40, specialties: ['Corte', 'Coloração'] },
  { name: 'Roberto Lima', role: 'Barbeiro', phone: '(11) 98888-0002', email: 'roberto@exemplo.com', commission: 35, specialties: ['Corte Masculino', 'Barba'] },
  { name: 'Juliana Costa', role: 'Manicure', phone: '(11) 98888-0003', email: 'juliana@exemplo.com', commission: 30, specialties: ['Manicure', 'Pedicure'] },
]

const SERVICES = [
  { name: 'Corte Feminino', duration: 60, price: 8000, category: 'Corte' },
  { name: 'Escova', duration: 45, price: 6000, category: 'Finalização' },
  { name: 'Coloração', duration: 120, price: 15000, category: 'Coloração' },
  { name: 'Manicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
  { name: 'Pedicure', duration: 40, price: 4500, category: 'Mãos & Pés' },
  { name: 'Hidratação', duration: 50, price: 7000, category: 'Tratamento' },
  { name: 'Corte Masculino', duration: 40, price: 5000, category: 'Corte' },
  { name: 'Barba', duration: 30, price: 3500, category: 'Barba' },
  { name: 'Limpeza de Pele', duration: 60, price: 12000, category: 'Estética Facial' },
  { name: 'Design de Sobrancelhas', duration: 20, price: 3000, category: 'Sobrancelha' },
]

const CONSUMABLES = [
  { name: 'Shampoo', unit: 'ml', currentStock: 5000, minStock: 1000, category: 'Cabelo' },
  { name: 'Condicionador', unit: 'ml', currentStock: 4000, minStock: 1000, category: 'Cabelo' },
  { name: 'Máscara Capilar', unit: 'ml', currentStock: 2000, minStock: 500, category: 'Cabelo' },
  { name: 'Tinta Cabelo', unit: 'un', currentStock: 30, minStock: 10, category: 'Cabelo' },
  { name: 'Luva Descartável', unit: 'un', currentStock: 200, minStock: 50, category: 'Higiene' },
]

const DEFAULT_HOURS = [
  { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
  { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
]

const CLIENTES = [
  { nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 99999-0001', segmento: 'salao', ultimaVisita: today(-1), totalVisitas: 18, totalGasto: 28400, status: 'ativo', aniversario: '15/03' },
  { nome: 'Juliana Mendes', email: 'juliana@email.com', telefone: '(11) 99999-0002', segmento: 'salao', ultimaVisita: today(-2), totalVisitas: 12, totalGasto: 19500, status: 'ativo', aniversario: '22/07' },
  { nome: 'Carla Souza', email: 'carla@email.com', telefone: '(11) 99999-0003', segmento: 'barbearia', ultimaVisita: today(-7), totalVisitas: 8, totalGasto: 7200, status: 'inativo' },
  { nome: 'Mariana Lima', email: 'mariana@email.com', telefone: '(11) 99999-0004', segmento: 'salao', ultimaVisita: today(0), totalVisitas: 5, totalGasto: 6200, status: 'novo', aniversario: '10/12' },
  { nome: 'Patrícia Oliveira', email: 'patricia@email.com', telefone: '(11) 99999-0005', segmento: 'clinica', ultimaVisita: today(-3), totalVisitas: 25, totalGasto: 52000, status: 'ativo', aniversario: '05/09' },
  { nome: 'Roberto Alves', email: 'roberto@email.com', telefone: '(11) 99999-0006', segmento: 'barbearia', ultimaVisita: today(-10), totalVisitas: 3, totalGasto: 2100, status: 'novo' },
  { nome: 'Fernanda Santos', email: 'fernanda@email.com', telefone: '(11) 99999-0007', segmento: 'salao', ultimaVisita: today(-1), totalVisitas: 15, totalGasto: 21000, status: 'ativo', aniversario: '30/01' },
  { nome: 'Luciana Pereira', email: 'luciana@email.com', telefone: '(11) 99999-0008', segmento: 'clinica', ultimaVisita: today(-20), totalVisitas: 2, totalGasto: 3500, status: 'inativo' },
]

const STATUSES = ['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled', 'confirmed', 'confirmed', 'no-show', 'confirmed', 'pending'] as const

async function seedUser(userData: {
  email: string; name: string; hashedPassword: string; credits: number; plan: string;
  businessName: string; businessSegment: string; businessAddress: string; businessPhone: string;
  onboardingCompleted: boolean;
}) {
  const existing = await prisma.user.findUnique({ where: { email: userData.email } })
  if (existing) {
    console.log(`  Usuário ${userData.email} já existe, pulando...`)
    return existing
  }

  const user = await prisma.user.create({ data: userData })
  console.log(`  Usuário criado: ${user.email} (${user.id})`)

  for (const hour of DEFAULT_HOURS) {
    await prisma.businessHour.create({ data: { ...hour, userId: user.id } })
  }
  console.log(`    Horários criados`)

  for (const member of TEAM_MEMBERS) {
    await prisma.teamMember.create({ data: { ...member, active: true, userId: user.id } })
  }
  console.log(`    Equipe criada (${TEAM_MEMBERS.length} membros)`)

  for (const service of SERVICES) {
    await prisma.service.create({ data: { ...service, active: true, userId: user.id } })
  }
  console.log(`    Serviços criados (${SERVICES.length} serviços)`)

  await prisma.loyaltyProgram.create({
    data: { userId: user.id, pointsPerCurrency: 10, pointsPerVisit: 50, pointsExpiryDays: 180, enabled: true },
  })
  console.log(`    Programa de fidelidade criado`)

  for (const consumable of CONSUMABLES) {
    await prisma.consumable.create({ data: { ...consumable, userId: user.id } })
  }
  console.log(`    Insumos criados (${CONSUMABLES.length} itens)`)

  return user
}

async function seedClientes(userId: string) {
  const existing = await prisma.cliente.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Clientes já existem, pulando...`)
    return
  }

  for (const c of CLIENTES) {
    await prisma.cliente.create({ data: { ...c, userId } })
  }
  console.log(`    Clientes criados (${CLIENTES.length} clientes)`)
}

async function seedAppointments(userId: string, teamMembers: { id: string; name: string }[], services: { id: string; name: string; duration: number; price: number }[]) {
  const existing = await prisma.appointment.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Agendamentos já existem, pulando...`)
    return
  }

  const appointments: {
    clientName: string; clientPhone: string; serviceId: string; serviceName: string;
    serviceDuration: number; servicePrice: number; professionalId: string; professionalName: string;
    date: string; startTime: string; endTime: string; status: string; userId: string;
    notes?: string
  }[] = []

  const clientRotations = [
    { name: 'Ana Costa', phone: '(11) 99999-0001' },
    { name: 'Juliana Mendes', phone: '(11) 99999-0002' },
    { name: 'Mariana Lima', phone: '(11) 99999-0004' },
    { name: 'Fernanda Santos', phone: '(11) 99999-0007' },
    { name: 'Roberto Alves', phone: '(11) 99999-0006' },
  ]

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  for (let dayOffset = -14; dayOffset <= 7; dayOffset++) {
    const date = today(dayOffset)
    const dayOfWeek = new Date(date + 'T12:00:00').getDay()
    if (dayOfWeek === 0) continue

    const slotsToUse = dayOffset >= 0 ? timeSlots.slice(0, 4) : timeSlots.slice(0, 6)

    for (let i = 0; i < slotsToUse.length; i++) {
      const clientIdx = Math.abs(dayOffset + i) % clientRotations.length
      const client = clientRotations[clientIdx]
      const svcIdx = Math.abs(dayOffset + i) % services.length
      const service = services[svcIdx]
      const memberIdx = Math.abs(dayOffset + i) % teamMembers.length
      const member = teamMembers[memberIdx]
      const statusIdx = Math.abs(dayOffset + i) % STATUSES.length
      const status = STATUSES[statusIdx]

      const startTime = slotsToUse[i]
      const [h, m] = startTime.split(':').map(Number)
      const endMinutes = h * 60 + m + service.duration
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`

      appointments.push({
        clientName: client.name,
        clientPhone: client.phone,
        serviceId: service.id,
        serviceName: service.name,
        serviceDuration: service.duration,
        servicePrice: service.price,
        professionalId: member.id,
        professionalName: member.name,
        date,
        startTime,
        endTime,
        status,
        userId,
        notes: status === 'cancelled' ? 'Cliente cancelou por imprevisto' : undefined,
      })
    }
  }

  await prisma.appointment.createMany({ data: appointments })
  console.log(`    Agendamentos criados (${appointments.length} registros)`)

  return prisma.appointment.findMany({
    where: { userId },
    select: { id: true, clientName: true, clientPhone: true, professionalId: true, professionalName: true, date: true, startTime: true, endTime: true, serviceName: true, servicePrice: true, serviceDuration: true, status: true },
    orderBy: { date: 'asc' },
  })
}

async function seedAtendimentos(userId: string, appointments: { id: string; clientName: string; clientPhone: string; professionalId: string; professionalName: string; date: string; startTime: string; endTime: string; serviceName: string; servicePrice: number; serviceDuration: number; status: string }[], services: { id: string; name: string; duration: number; price: number }[]) {
  const existing = await prisma.atendimento.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Atendimentos já existem, pulando...`)
    return
  }

  const completedAppointments = appointments.filter((a) => a.status === 'confirmed')

  for (const app of completedAppointments) {
    const svc = services.find((s) => s.name === app.serviceName) ?? services[0]
    await prisma.atendimento.create({
      data: {
        appointmentId: app.id,
        clientName: app.clientName,
        clientPhone: app.clientPhone,
        professionalId: app.professionalId,
        professionalName: app.professionalName,
        date: app.date,
        startTime: app.startTime,
        endTime: app.endTime,
        services: JSON.parse(JSON.stringify([{ serviceId: svc.id, serviceName: svc.name, duration: svc.duration, price: svc.price }])),
        supplies: [],
        notes: '',
        status: 'completed',
        totalValue: app.servicePrice,
        userId,
      },
    })
  }
  console.log(`    Atendimentos criados (${completedAppointments.length} registros)`)
}

async function seedPayments(userId: string) {
  const existing = await prisma.payment.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Pagamentos já existem, pulando...`)
    return
  }

  const atendimentos = await prisma.atendimento.findMany({ where: { userId, status: 'completed' } })

  for (const atd of atendimentos) {
    const methods = ['pix', 'credit', 'debit', 'cash'] as const
    const method = methods[Math.floor(Math.random() * methods.length)]
    const fee = method === 'credit' ? Math.round(atd.totalValue * 0.03) : method === 'debit' ? Math.round(atd.totalValue * 0.02) : 0

    await prisma.payment.create({
      data: {
        atendimentoId: atd.id,
        clientName: atd.clientName,
        clientPhone: atd.clientPhone,
        professionalName: atd.professionalName,
        serviceNames: (atd.services as { serviceName: string }[]).map((s) => s.serviceName),
        date: atd.date,
        totalValue: atd.totalValue,
        method,
        status: 'paid',
        paidValue: atd.totalValue,
        feeValue: fee,
        netValue: atd.totalValue - fee,
        userId,
        paidAt: new Date(atd.date + 'T' + atd.endTime),
      },
    })
  }
  console.log(`    Pagamentos criados (${atendimentos.length} registros)`)
}

async function seedFeedback(userId: string) {
  const existing = await prisma.feedback.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Feedbacks já existem, pulando...`)
    return
  }

  const atendimentos = await prisma.atendimento.findMany({ where: { userId, status: 'completed' }, take: 10 })

  const scores = [10, 9, 8, 10, 7, 9, 10, 8, 9, 6]
  const comments = [
    'Excelente atendimento!',
    'Muito bom, recomendo!',
    'Ótimo profissional, volto mais vezes.',
    'Adorei o resultado, ficou perfeito!',
    'Bom atendimento, mas demorou um pouco.',
    'Profissional muito atenciosa.',
    'Sempre uma experiência incrível.',
    'Gostei muito do serviço.',
    'Atendimento nota 10!',
    'Poderia melhorar o tempo de espera.',
  ]

  for (let i = 0; i < atendimentos.length; i++) {
    const atd = atendimentos[i]
    await prisma.feedback.create({
      data: {
        atendimentoId: atd.id,
        clientName: atd.clientName,
        clientPhone: atd.clientPhone,
        score: scores[i % scores.length],
        comment: comments[i % comments.length],
        userId,
      },
    })
  }
  console.log(`    Feedbacks criados (${atendimentos.length} registros)`)
}

async function seedCampaigns(userId: string) {
  const existing = await prisma.campaign.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Campanhas já existem, pulando...`)
    return
  }

  const campaigns = [
    { name: 'Volte sempre!', type: 'return', status: 'active' as const, segment: 'inactive', triggerDays: 30, messageTemplate: 'Oi {{nome}}, sentimos sua falta! Agende seu horário e ganhe 10% de desconto.', statsSent: 45, statsResponded: 12, statsConverted: 8 },
    { name: 'Aniversariante do mês', type: 'birthday' as const, status: 'active' as const, segment: 'all', triggerDays: 7, messageTemplate: 'Feliz aniversário, {{nome}}! Ganhe um brinde especial na sua próxima visita.', statsSent: 8, statsResponded: 5, statsConverted: 5 },
    { name: 'Nova hidratação', type: 'upsell' as const, status: 'active' as const, segment: 'high-value', triggerDays: 60, messageTemplate: '{{nome}}, queremos apresentar nossa nova hidratação capilar. 20% off para clientes especiais!', serviceSuggestion: 'Hidratação', statsSent: 20, statsResponded: 7, statsConverted: 4 },
    { name: 'Recuperação de clientes', type: 'return' as const, status: 'paused' as const, segment: 'at-risk', triggerDays: 45, messageTemplate: 'Oi {{nome}}, está com saudades? Agende agora e ganhe um cortesia.', statsSent: 15, statsResponded: 3, statsConverted: 1 },
  ]

  for (const campaign of campaigns) {
    await prisma.campaign.create({ data: { ...campaign, userId } })
  }
  console.log(`    Campanhas criadas (${campaigns.length} registros)`)
}

async function seedPromotions(userId: string) {
  const existing = await prisma.loyaltyPromotion.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Promoções já existem, pulando...`)
    return
  }

  const promotions = [
    { name: 'Corte Grátis', segment: 'all', discountPercent: 100, requiredPoints: 500, serviceName: 'Corte Feminino', expiresAt: '2026-12-31', status: 'active' as const, statsSent: 30, statsRedeemed: 5 },
    { name: 'Desconto Hidratação', segment: 'all', discountPercent: 50, requiredPoints: 200, serviceName: 'Hidratação', expiresAt: '2026-12-31', status: 'active' as const, statsSent: 50, statsRedeemed: 12 },
    { name: 'Escova VIP', segment: 'high-value', discountPercent: 30, requiredPoints: 150, serviceName: 'Escova', expiresAt: '2026-09-30', status: 'active' as const, statsSent: 15, statsRedeemed: 3 },
  ]

  for (const promo of promotions) {
    await prisma.loyaltyPromotion.create({ data: { ...promo, userId } })
  }
  console.log(`    Promoções criadas (${promotions.length} registros)`)
}

async function seedPoints(userId: string) {
  const existing = await prisma.clientPoints.count({ where: { userId } })
  if (existing > 0) {
    console.log(`    Pontos já existem, pulando...`)
    return
  }

  const payments = await prisma.payment.findMany({ where: { userId, status: 'paid' } })
  const clientTotals = new Map<string, { name: string; totalValue: number; count: number }>()

  for (const p of payments) {
    const existing = clientTotals.get(p.clientPhone) ?? { name: p.clientName, totalValue: 0, count: 0 }
    existing.totalValue += p.netValue
    existing.count++
    clientTotals.set(p.clientPhone, existing)
  }

  for (const [phone, data] of clientTotals) {
    const balance = Math.floor(data.totalValue / 100) * 10 + data.count * 50
    const lifetime = balance

    await prisma.clientPoints.create({
      data: {
        userId,
        clientPhone: phone,
        clientName: data.name,
        balance,
        lifetime,
      },
    })

    await prisma.pointsTransaction.create({
      data: {
        userId,
        clientPhone: phone,
        clientName: data.name,
        type: 'earn',
        amount: balance,
        balanceAfter: balance,
        description: 'Pontos acumulados por visitas e consumos',
      },
    })
  }
  console.log(`    Pontos criados para ${clientTotals.size} clientes`)
}

async function seedProfessionalUsers(businessOwnerId: string) {
  const existing = await prisma.user.count({ where: { role: 'profissional', businessOwnerId } })
  if (existing > 0) {
    console.log('  Profissionais já existem, pulando...')
    return
  }

  const TEAM_FOR_PROFESSIONAL = [
    { name: 'Carla Mendes', role: 'Cabeleireira', phone: '(11) 98888-0001', email: 'carla@exemplo.com', commission: 40, specialties: ['Corte', 'Coloração'] },
    { name: 'Roberto Lima', role: 'Barbeiro', phone: '(11) 98888-0002', email: 'roberto@exemplo.com', commission: 35, specialties: ['Corte Masculino', 'Barba'] },
  ]

  for (const member of TEAM_FOR_PROFESSIONAL) {
    const teamMember = await prisma.teamMember.create({
      data: { ...member, active: true, userId: businessOwnerId },
    })

    await prisma.user.create({
      data: {
        email: `${member.name.toLowerCase().replace(/\s+/g, '.')}@profissional.com`,
        name: member.name,
        hashedPassword: hashPassword('123456'),
        role: 'profissional',
        businessOwnerId,
        teamMemberId: teamMember.id,
        credits: 5,
        plan: 'pro',
        onboardingCompleted: true,
        businessName: 'Rede Infinity de Beleza',
        businessSegment: 'salao',
        businessAddress: 'Av Central, 789',
        businessPhone: '(11) 99999-0003',
      },
    })
    console.log(`  Profissional criado: ${member.name} (${member.role})`)
  }
}

async function seedClientUsers(businessOwnerId: string) {
  const existing = await prisma.user.count({ where: { role: 'cliente', businessOwnerId } })
  if (existing > 0) {
    console.log('  Clientes já existem, pulando...')
    return
  }

  const CLIENTS_FOR_USER = [
    { nome: 'Ana Costa', email: 'ana.cliente@email.com', telefone: '(11) 99999-0001' },
    { nome: 'Juliana Mendes', email: 'juliana.cliente@email.com', telefone: '(11) 99999-0002' },
    { nome: 'Mariana Lima', email: 'mariana.cliente@email.com', telefone: '(11) 99999-0004' },
  ]

  for (const c of CLIENTS_FOR_USER) {
    const cliente = await prisma.cliente.create({
      data: {
        nome: c.nome,
        email: c.email,
        telefone: c.telefone,
        segmento: 'salao',
        ultimaVisita: today(-1),
        totalVisitas: 5,
        totalGasto: 8000,
        status: 'ativo',
        userId: businessOwnerId,
      },
    })

    await prisma.user.create({
      data: {
        email: c.email,
        name: c.nome,
        hashedPassword: hashPassword('123456'),
        role: 'cliente',
        businessOwnerId,
        clienteId: cliente.id,
        credits: 0,
        plan: 'free',
        onboardingCompleted: true,
        businessName: null,
        businessSegment: null,
        businessAddress: null,
        businessPhone: c.telefone,
      },
    })
    console.log(`  Cliente criado: ${c.nome} (${c.email})`)
  }
}

async function main() {
  console.log('🌱 Iniciando seed...\n')
  const hashedPassword = hashPassword('123456')

  const userConfigs = [
    {
      email: 'homem@teste.com', name: 'Carlos Silva', hashedPassword, credits: 20, plan: 'pro',
      businessName: 'Barbearia do Carlos', businessSegment: 'barbearia', businessAddress: 'Rua A, 123',
      businessPhone: '(11) 99999-0001', onboardingCompleted: true,
    },
    {
      email: 'mulher@teste.com', name: 'Ana Costa', hashedPassword, credits: 20, plan: 'pro',
      businessName: 'Salão da Ana', businessSegment: 'salao', businessAddress: 'Rua B, 456',
      businessPhone: '(11) 99999-0002', onboardingCompleted: true,
    },
    {
      email: 'lojista@teste.com', name: 'Rede Infinity', hashedPassword, credits: 999, plan: 'premium',
      businessName: 'Rede Infinity de Beleza', businessSegment: 'salao', businessAddress: 'Av Central, 789',
      businessPhone: '(11) 99999-0003', onboardingCompleted: true,
    },
  ]

  for (const cfg of userConfigs) {
    const user = await seedUser(cfg)
    await seedClientes(user.id)

    const team = await prisma.teamMember.findMany({ where: { userId: user.id }, select: { id: true, name: true } })
    const services = await prisma.service.findMany({ where: { userId: user.id }, select: { id: true, name: true, duration: true, price: true } })
    const appointments = await seedAppointments(user.id, team, services)
    if (appointments) {
      await seedAtendimentos(user.id, appointments, services)
      await seedPayments(user.id)
      await seedFeedback(user.id)
      await seedPoints(user.id)
    }

    await seedCampaigns(user.id)
    await seedPromotions(user.id)
    console.log()
  }

  const businessOwner = await prisma.user.findUnique({ where: { email: 'lojista@teste.com' } })
  if (!businessOwner) throw new Error('Business owner not found')

  await seedProfessionalUsers(businessOwner.id)
  await seedClientUsers(businessOwner.id)

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
