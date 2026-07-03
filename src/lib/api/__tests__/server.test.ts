import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { apiClient } from '../client'
import { mockServer } from '../server'
import { simulator } from '../simulator'
import { db } from '../db'
import { registerAuthHandlers } from '../handlers/auth'
import { registerOnboardingHandlers } from '../handlers/onboarding'
import { registerAgendaHandlers } from '../handlers/agenda'
import { registerDashboardHandlers } from '../handlers/dashboard'

function setupApi(): void {
  db.clearAll()
  localStorage.clear()
  registerAuthHandlers()
  registerOnboardingHandlers()
  registerAgendaHandlers()
  registerDashboardHandlers()
  mockServer.start()
}

function teardownApi(): void {
  mockServer.stop()
}

async function signupAndGetToken(
  email = 'test@test.com',
  password = '123456',
  name = 'Test User',
): Promise<string> {
  const response = await apiClient.post('/api/auth/signup', { email, password, name })
  return response.data.token
}

describe('Auth API', () => {
  beforeEach(() => {
    simulator.updateConfig({ baseLatencyMs: 0, jitterMs: 0, errorRate: 0 })
    setupApi()
  })

  afterEach(teardownApi)

  it('signup cria usuário e retorna token', async () => {
    const res = await apiClient.post('/api/auth/signup', {
      email: 'new@test.com',
      password: '123456',
      name: 'New User',
    })
    expect(res.status).toBe(201)
    expect(res.data.user).toBeDefined()
    expect(res.data.user.email).toBe('new@test.com')
    expect(res.data.token).toBeTruthy()
  })

  it('signup rejeita email duplicado', async () => {
    await apiClient.post('/api/auth/signup', {
      email: 'dup@test.com',
      password: '123456',
      name: 'Dup',
    })
    await expect(
      apiClient.post('/api/auth/signup', {
        email: 'dup@test.com',
        password: '123456',
        name: 'Dup2',
      }),
    ).rejects.toThrow(/já está cadastrado/)
  })

  it('login retorna token para credenciais válidas', async () => {
    await apiClient.post('/api/auth/signup', {
      email: 'login@test.com',
      password: '123456',
      name: 'Login',
    })
    const res = await apiClient.post('/api/auth/login', {
      email: 'login@test.com',
      password: '123456',
    })
    expect(res.data.token).toBeTruthy()
  })

  it('login rejeita senha incorreta', async () => {
    await apiClient.post('/api/auth/signup', {
      email: 'wrong@test.com',
      password: '123456',
      name: 'Wrong',
    })
    await expect(
      apiClient.post('/api/auth/login', { email: 'wrong@test.com', password: 'wrongpass' }),
    ).rejects.toThrow(/inválidos/)
  })

  it('GET /auth/me retorna dados do usuário', async () => {
    const token = await signupAndGetToken()
    const unsub = apiClient.onRequest((req) => ({
      ...req,
      headers: { ...req.headers, authorization: `Bearer ${token}` },
    }))

    const res = await apiClient.get('/api/auth/me')
    expect(res.data.email).toBe('test@test.com')

    unsub()
  })

  it('GET /auth/me rejeita sem token', async () => {
    await expect(apiClient.get('/api/auth/me')).rejects.toThrow(/Não autorizado/)
  })
})

describe('Onboarding API', () => {
  let token: string

  beforeEach(async () => {
    simulator.updateConfig({ baseLatencyMs: 0, jitterMs: 0, errorRate: 0 })
    setupApi()
    token = await signupAndGetToken('onboard@test.com', '123456', 'Onboard')
  })

  afterEach(teardownApi)

  function auth(): { headers: { authorization: string } } {
    return { headers: { authorization: `Bearer ${token}` } }
  }

  it('salva dados do negócio', async () => {
    const res = await apiClient.put(
      '/api/onboarding/business',
      {
        nome: 'Studio Test',
        segmento: 'salao',
        endereco: 'Rua A, 123',
        telefone: '(11) 99999-9999',
      },
      auth(),
    )
    expect(res.data.onboardingData.business.nome).toBe('Studio Test')
    expect(res.data.onboardingData.progress.businessDataComplete).toBe(true)
  })

  it('salva horários', async () => {
    const hours = [{ dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' }]
    const res = await apiClient.put('/api/onboarding/hours', hours, auth())
    expect(res.data.onboardingData.hours).toEqual(hours)
  })

  it('obtém serviços pré-populados por segmento', async () => {
    const res = await apiClient.get('/api/onboarding/prepopulated/barbearia', auth())
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].name).toContain('Corte')
    expect(res.data[0].id).toBeTruthy()
  })

  it('completa onboarding', async () => {
    await apiClient.put(
      '/api/onboarding/business',
      { nome: 'X', segmento: 'salao', endereco: 'Rua X', telefone: '11999999999' },
      auth(),
    )
    await apiClient.put(
      '/api/onboarding/hours',
      [{ dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' }],
      auth(),
    )
    await apiClient.put(
      '/api/onboarding/services',
      [{ id: 's1', name: 'Corte', duration: 30, price: 50, category: 'Corte' }],
      auth(),
    )
    await apiClient.put(
      '/api/onboarding/team',
      [{ id: 't1', name: 'Pro', role: 'Cabelereiro', phone: '11988888888', email: 'pro@test.com' }],
      auth(),
    )

    const res = await apiClient.post('/api/onboarding/complete', {}, auth())
    expect(res.data.onboardingData.completed).toBe(true)
  })
})

describe('Agenda API', () => {
  let token: string

  beforeEach(async () => {
    simulator.updateConfig({ baseLatencyMs: 0, jitterMs: 0, errorRate: 0 })
    setupApi()
    token = await signupAndGetToken('agenda@test.com', '123456', 'Agenda User')
    const baseApp = {
      clientName: 'Ana',
      clientPhone: '11999999999',
      serviceId: 's1',
      serviceName: 'Corte',
      serviceDuration: 60,
      servicePrice: 50,
      professionalId: 'p1',
      professionalName: 'Pro',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      status: 'confirmed' as const,
    }
    await apiClient.post('/api/agenda', baseApp, auth())
  })

  afterEach(teardownApi)

  function auth(): { headers: { authorization: string } } {
    return { headers: { authorization: `Bearer ${token}` } }
  }

  it('lista agendamentos do dia', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await apiClient.get(`/api/agenda/date/${today}`, auth())
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].clientName).toBe('Ana')
  })

  it('cria novo agendamento', async () => {
    const res = await apiClient.post(
      '/api/agenda',
      {
        clientName: 'Bia',
        clientPhone: '11988888888',
        serviceId: 's2',
        serviceName: 'Escova',
        serviceDuration: 45,
        servicePrice: 60,
        professionalId: 'p1',
        professionalName: 'Pro',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '14:45',
        status: 'pending',
      },
      auth(),
    )
    expect(res.status).toBe(201)
    expect(res.data.id).toBeTruthy()
  })

  it('detecta conflito de horário', async () => {
    await expect(
      apiClient.post(
        '/api/agenda',
        {
          clientName: 'Conflito',
          clientPhone: '11977777777',
          serviceId: 's1',
          serviceName: 'Corte',
          serviceDuration: 60,
          servicePrice: 50,
          professionalId: 'p1',
          professionalName: 'Pro',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:30',
          endTime: '10:30',
          status: 'pending',
        },
        auth(),
      ),
    ).rejects.toThrow(/ocupado/)
  })

  it('cancela agendamento', async () => {
    const today = new Date().toISOString().split('T')[0]
    const list = await apiClient.get(`/api/agenda/date/${today}`, auth())
    const id = list.data[0].id
    const res = await apiClient.patch(`/api/agenda/${id}/cancel`, {}, auth())
    expect(res.data.status).toBe('cancelled')
  })
})

describe('Dashboard API', () => {
  let token: string

  beforeEach(async () => {
    simulator.updateConfig({ baseLatencyMs: 0, jitterMs: 0, errorRate: 0 })
    setupApi()
    token = await signupAndGetToken('dash@test.com', '123456', 'Dash User')
    const today = new Date().toISOString().split('T')[0]
    const apps = [
      {
        clientName: 'A',
        clientPhone: '1',
        serviceId: 's1',
        serviceName: 'Corte',
        serviceDuration: 60,
        servicePrice: 50,
        professionalId: 'p1',
        professionalName: 'P',
        date: today,
        startTime: '09:00',
        endTime: '10:00',
        status: 'confirmed' as const,
      },
      {
        clientName: 'B',
        clientPhone: '2',
        serviceId: 's2',
        serviceName: 'Escova',
        serviceDuration: 45,
        servicePrice: 60,
        professionalId: 'p1',
        professionalName: 'P',
        date: today,
        startTime: '10:00',
        endTime: '10:45',
        status: 'pending' as const,
      },
    ]
    for (const app of apps) {
      await apiClient.post('/api/agenda', app, auth())
    }
  })

  afterEach(teardownApi)

  function auth(): { headers: { authorization: string } } {
    return { headers: { authorization: `Bearer ${token}` } }
  }

  it('retorna métricas do dashboard', async () => {
    const res = await apiClient.get('/api/dashboard/metrics', auth())
    expect(res.data.metrics).toHaveLength(4)
    expect(res.data.metrics[0].id).toBe('revenue')
    expect(res.data.metrics[1].id).toBe('appointments')
  })

  it('retorna agendamentos de hoje', async () => {
    const res = await apiClient.get('/api/dashboard/today', auth())
    expect(res.data.appointments).toHaveLength(2)
    expect(res.data.totalAppointments).toBe(2)
  })

  it('retorna analytics', async () => {
    const res = await apiClient.get('/api/dashboard/analytics', auth())
    expect(res.data.statusDistribution).toBeDefined()
    expect(res.data.topServices).toBeDefined()
  })

  it('retorna status dos serviços', async () => {
    const res = await apiClient.get('/api/dashboard/status', auth())
    expect(res.data.services).toHaveLength(5)
    expect(res.data.services[0].status).toBe('operational')
  })
})
