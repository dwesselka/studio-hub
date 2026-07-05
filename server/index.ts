import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prisma } from '../src/lib/prisma'

const app = new Hono()

app.use('/*', cors())

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return c.json({ error: 'Credenciais inválidas' }, 401)

  const hashedPassword = Buffer.from(password).toString('base64')
  if (user.hashedPassword !== hashedPassword) {
    return c.json({ error: 'Credenciais inválidas' }, 401)
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      plan: user.plan,
      businessName: user.businessName,
      businessSegment: user.businessSegment,
      onboardingCompleted: user.onboardingCompleted,
    },
    token: `session_${user.id}`,
  })
})

app.get('/auth/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Não autorizado' }, 401)

  const userId = auth.replace('Bearer ', '').replace('session_', '')
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404)

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    credits: user.credits,
    plan: user.plan,
    businessName: user.businessName,
    businessSegment: user.businessSegment,
    onboardingCompleted: user.onboardingCompleted,
  })
})

app.get('/users/:id/services', async (c) => {
  const services = await prisma.service.findMany({
    where: { userId: c.req.param('id'), active: true },
  })
  return c.json(services)
})

app.get('/users/:id/team', async (c) => {
  const team = await prisma.teamMember.findMany({
    where: { userId: c.req.param('id') },
  })
  return c.json(team)
})

app.get('/users/:id/appointments', async (c) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId: c.req.param('id') },
    orderBy: { date: 'desc' },
  })
  return c.json(appointments)
})

app.get('/users/:id/clients', async (c) => {
  const clients = await prisma.cliente.findMany({
    where: { userId: c.req.param('id') },
  })
  return c.json(clients)
})

const port = process.env.PORT ? Number(process.env.PORT) : 3001

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 Servidor rodando em http://localhost:${info.port}`)
  console.log(`📋 Health check: http://localhost:${info.port}/health`)
})
