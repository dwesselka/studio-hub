import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = '123456'
  const hashedPassword = Buffer.from(password).toString('base64')

  const users = [
    {
      email: 'homem@teste.com',
      name: 'Carlos Silva',
      hashedPassword,
      credits: 20,
      plan: 'pro',
      businessName: 'Barbearia do Carlos',
      businessSegment: 'barbearia',
      businessAddress: 'Rua A, 123',
      businessPhone: '(11) 99999-0001',
      onboardingCompleted: true,
      businessHours: [
        { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
        { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
        { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
        { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
        { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
        { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
        { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
      ],
    },
    {
      email: 'mulher@teste.com',
      name: 'Ana Costa',
      hashedPassword,
      credits: 20,
      plan: 'pro',
      businessName: 'Salão da Ana',
      businessSegment: 'salao',
      businessAddress: 'Rua B, 456',
      businessPhone: '(11) 99999-0002',
      onboardingCompleted: true,
    },
    {
      email: 'lojista@teste.com',
      name: 'Rede Infinity',
      hashedPassword,
      credits: 999,
      plan: 'premium',
      businessName: 'Rede Infinity de Beleza',
      businessSegment: 'salao',
      businessAddress: 'Av Central, 789',
      businessPhone: '(11) 99999-0003',
      onboardingCompleted: true,
    },
  ]

  for (const userData of users) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } })
    if (existing) {
      console.log(`Usuário ${userData.email} já existe, pulando...`)
      continue
    }

    const { businessHours, ...user } = userData

    const created = await prisma.user.create({ data: user })
    console.log(`Usuário criado: ${created.email} (${created.id})`)

    if (businessHours) {
      for (const hour of businessHours) {
        await prisma.businessHour.create({
          data: { ...hour, userId: created.id },
        })
      }
      console.log(`  Horários criados para ${created.email}`)
    }

    const teamMembers = [
      { name: 'Carla Mendes', role: 'Cabeleireira', phone: '(11) 98888-0001', email: 'carla@exemplo.com', active: true, commission: 40, specialties: ['Corte', 'Coloração'] },
      { name: 'Roberto Lima', role: 'Barbeiro', phone: '(11) 98888-0002', email: 'roberto@exemplo.com', active: true, commission: 35, specialties: ['Corte Masculino', 'Barba'] },
      { name: 'Juliana Costa', role: 'Manicure', phone: '(11) 98888-0003', email: 'juliana@exemplo.com', active: true, commission: 30, specialties: ['Manicure', 'Pedicure'] },
    ]
    for (const member of teamMembers) {
      await prisma.teamMember.create({ data: { ...member, userId: created.id } })
    }
    console.log(`  Equipe criada para ${created.email}`)

    const services = [
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
    for (const service of services) {
      await prisma.service.create({ data: { ...service, userId: created.id } })
    }
    console.log(`  Serviços criados para ${created.email}`)

    await prisma.loyaltyProgram.create({
      data: { userId: created.id, pointsPerCurrency: 10, pointsPerVisit: 50, pointsExpiryDays: 180, enabled: true },
    })
    console.log(`  Programa de fidelidade criado para ${created.email}`)

    const consumables = [
      { name: 'Shampoo', unit: 'ml', currentStock: 5000, minStock: 1000, category: 'Cabelo' },
      { name: 'Condicionador', unit: 'ml', currentStock: 4000, minStock: 1000, category: 'Cabelo' },
      { name: 'Máscara Capilar', unit: 'ml', currentStock: 2000, minStock: 500, category: 'Cabelo' },
      { name: 'Tinta Cabelo', unit: 'un', currentStock: 30, minStock: 10, category: 'Cabelo' },
      { name: 'Luva Descartável', unit: 'un', currentStock: 200, minStock: 50, category: 'Higiene' },
    ]
    for (const consumable of consumables) {
      await prisma.consumable.create({ data: { ...consumable, userId: created.id } })
    }
    console.log(`  Insumos criados para ${created.email}`)
  }

  const clientes = [
    { nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 99999-0001', segmento: 'salao', ultimaVisita: '2026-07-03', totalVisitas: 18, totalGasto: 2840, status: 'ativo', aniversario: '15/03' },
    { nome: 'Juliana Mendes', email: 'juliana@email.com', telefone: '(11) 99999-0002', segmento: 'salao', ultimaVisita: '2026-07-02', totalVisitas: 12, totalGasto: 1950, status: 'ativo', aniversario: '22/07' },
    { nome: 'Carla Souza', email: 'carla@email.com', telefone: '(11) 99999-0003', segmento: 'barbearia', ultimaVisita: '2026-06-28', totalVisitas: 8, totalGasto: 720, status: 'inativo' },
    { nome: 'Mariana Lima', email: 'mariana@email.com', telefone: '(11) 99999-0004', segmento: 'salao', ultimaVisita: '2026-07-04', totalVisitas: 5, totalGasto: 620, status: 'novo', aniversario: '10/12' },
    { nome: 'Patrícia Oliveira', email: 'patricia@email.com', telefone: '(11) 99999-0005', segmento: 'clinica', ultimaVisita: '2026-07-01', totalVisitas: 25, totalGasto: 5200, status: 'ativo', aniversario: '05/09' },
    { nome: 'Roberto Alves', email: 'roberto@email.com', telefone: '(11) 99999-0006', segmento: 'barbearia', ultimaVisita: '2026-06-25', totalVisitas: 3, totalGasto: 210, status: 'novo' },
    { nome: 'Fernanda Santos', email: 'fernanda@email.com', telefone: '(11) 99999-0007', segmento: 'salao', ultimaVisita: '2026-07-03', totalVisitas: 15, totalGasto: 2100, status: 'ativo', aniversario: '30/01' },
    { nome: 'Luciana Pereira', email: 'luciana@email.com', telefone: '(11) 99999-0008', segmento: 'clinica', ultimaVisita: '2026-06-15', totalVisitas: 2, totalGasto: 350, status: 'inativo' },
  ]

  const salaUser = await prisma.user.findUnique({ where: { email: 'mulher@teste.com' } })
  if (salaUser) {
    const existing = await prisma.cliente.count({ where: { userId: salaUser.id } })
    if (existing === 0) {
      for (const c of clientes) {
        await prisma.cliente.create({
          data: { ...c, userId: salaUser.id },
        })
      }
      console.log(`Clientes criados para ${salaUser.email}`)
    } else {
      console.log(`Clientes já existem para ${salaUser.email}, pulando...`)
    }
  }

  console.log('\nSeed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
