import { mockServer } from '../server'
import { db } from '../db'
import { ApiRequestError } from '../types'
import type { ApiRequest } from '../types'

export interface AuthUser {
  id: string
  email: string
  name: string
  hashedPassword: string
  onboardingData: {
    account: { email: string; password: string; nome: string } | null
    business: {
      nome: string
      segmento: string
      endereco: string
      telefone: string
      logo?: string
    } | null
    hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]
    services: { id: string; name: string; duration: number; price: number; category: string }[]
    team: { id: string; name: string; role: string; phone: string; email: string }[]
    progress: {
      accountCreated: boolean
      businessDataComplete: boolean
      hoursConfigured: boolean
      servicesReviewed: boolean
      teamAdded: boolean
    }
    completed: boolean
  }
  createdAt: string
  [key: string]: unknown
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  [key: string]: unknown
}

const usersTable = db.getOrCreate<AuthUser>('auth_users')
const sessionsTable = db.getOrCreate<Session>('auth_sessions')

function generateToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({ sub: crypto.randomUUID(), iat: Date.now(), exp: Date.now() + 86400000 }),
  )
  const signature = btoa(crypto.randomUUID())
  return `${header}.${payload}.${signature}`
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return `sha256_mock_${Math.abs(hash).toString(16)}`
}

export function registerAuthHandlers(): void {
  mockServer.post('/auth/signup', async (req: ApiRequest) => {
    const { email, password, name } = req.body as { email: string; password: string; name: string }

    if (!email || !password || !name) {
      throw ApiRequestError.validation({
        email: email ? [] : ['E-mail é obrigatório'],
        password: password ? [] : ['Senha é obrigatória'],
        name: name ? [] : ['Nome é obrigatório'],
      })
    }

    if (password.length < 6) {
      throw ApiRequestError.validation({ password: ['Mínimo de 6 caracteres'] })
    }

    const existing = usersTable.findOne((u) => u.email === email)
    if (existing) {
      throw ApiRequestError.conflict('Este e-mail já está cadastrado')
    }

    const user: AuthUser = {
      id: crypto.randomUUID(),
      email,
      name,
      hashedPassword: hashPassword(password),
      onboardingData: {
        account: { email, password, nome: name },
        business: null,
        hours: [],
        services: [],
        team: [],
        progress: {
          accountCreated: true,
          businessDataComplete: false,
          hoursConfigured: false,
          servicesReviewed: false,
          teamAdded: false,
        },
        completed: false,
      },
      createdAt: new Date().toISOString(),
    }

    usersTable.insert(user)

    const token = generateToken()
    const session: Session = {
      id: crypto.randomUUID(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    sessionsTable.insert(session)

    return mockServer['jsonResponse'](
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          onboardingData: user.onboardingData,
        },
        accessToken: token,
        refreshToken: token,
      },
      201,
    )
  })

  mockServer.post('/auth/login', async (req: ApiRequest) => {
    const { email, password } = req.body as { email: string; password: string }

    if (!email || !password) {
      throw ApiRequestError.validation({
        email: email ? [] : ['E-mail é obrigatório'],
        password: password ? [] : ['Senha é obrigatória'],
      })
    }

    const user = usersTable.findOne((u) => u.email === email)
    if (!user || user.hashedPassword !== hashPassword(password)) {
      throw ApiRequestError.unauthorized('E-mail ou senha inválidos')
    }

    const token = generateToken()
    const session: Session = {
      id: crypto.randomUUID(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    sessionsTable.insert(session)

    return mockServer['jsonResponse']({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingData: user.onboardingData,
      },
      accessToken: token,
      refreshToken: token,
    })
  })

  mockServer.get('/auth/me', async (req: ApiRequest) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')
    if (!token) throw ApiRequestError.unauthorized()

    const session = sessionsTable.findOne((s) => s.token === token)
    if (!session) throw ApiRequestError.unauthorized('Sessão expirada')

    const user = usersTable.getById(session.userId)
    if (!user) throw ApiRequestError.unauthorized('Usuário não encontrado')

    const business = user.onboardingData?.business

    return mockServer['jsonResponse']({
      id: user.id,
      email: user.email,
      name: user.name,
      credits: 0,
      plan: 'starter',
      businessName: business?.nome ?? null,
      businessSegment: business?.segmento ?? null,
      businessAddress: business?.endereco ?? null,
      businessPhone: business?.telefone ?? null,
      businessLogo: business?.logo ?? null,
      onboardingCompleted: user.onboardingData?.completed ?? false,
      onboardingData: user.onboardingData,
    })
  })

  mockServer.post('/auth/refresh', async (req: ApiRequest) => {
    const { refreshToken } = req.body as { refreshToken: string }
    const session = sessionsTable.findOne((s) => s.token === refreshToken)
    if (!session) throw ApiRequestError.unauthorized('Refresh token inválido')

    const user = usersTable.getById(session.userId)
    if (!user) throw ApiRequestError.unauthorized('Usuário não encontrado')

    const newToken = generateToken()
    sessionsTable.delete(session.id)
    const newSession: Session = {
      id: crypto.randomUUID(),
      userId: user.id,
      token: newToken,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    sessionsTable.insert(newSession)

    return mockServer['jsonResponse']({
      accessToken: newToken,
      refreshToken: newToken,
    })
  })

  mockServer.post('/auth/logout', async (req: ApiRequest) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')
    if (token) {
      sessionsTable.find((s) => s.token === token).forEach((s) => sessionsTable.delete(s.id))
    }
    return mockServer['jsonResponse']({ message: 'Sessão encerrada' })
  })
}
