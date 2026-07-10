import { prisma } from '../../src/lib/prisma'
import { hashPassword, verifyPassword } from '../lib/crypto'
import {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
  invalidateRefreshToken,
} from '../lib/token'
import { AppError } from '../lib/errors'

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  businessOwnerId: true,
  credits: true,
  plan: true,
  businessName: true,
  businessSegment: true,
  businessAddress: true,
  businessPhone: true,
  businessLogo: true,
  onboardingCompleted: true,
} as const

function formatUser(user: {
  id: string
  email: string
  name: string
  role: string
  businessOwnerId: string | null
  credits: number
  plan: string
  businessName: string | null
  businessSegment: string | null
  businessAddress: string | null
  businessPhone: string | null
  businessLogo: string | null
  onboardingCompleted: boolean
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    businessOwnerId: user.businessOwnerId,
    credits: user.credits,
    plan: user.plan,
    businessName: user.businessName,
    businessSegment: user.businessSegment,
    businessAddress: user.businessAddress,
    businessPhone: user.businessPhone,
    businessLogo: user.businessLogo,
    onboardingCompleted: user.onboardingCompleted,
  }
}

export async function signup(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new AppError(409, 'CONFLICT', 'Este e-mail já está cadastrado')
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword: hashPassword(password),
      businessHours: {
        create: [
          { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
          { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
          { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
          { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
          { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
          { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
          { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
        ],
      },
      loyaltyProgram: {
        create: {
          pointsPerCurrency: 10,
          pointsPerVisit: 50,
          pointsExpiryDays: 180,
          enabled: true,
        },
      },
    },
    select: userSelect,
  })

  const [accessToken, refreshToken] = await Promise.all([
    createToken(user.id, user.email, '15m'),
    createRefreshToken(user.id, user.email),
  ])

  return { user: formatUser(user), accessToken, refreshToken }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'E-mail ou senha inválidos')
  }

  if (!verifyPassword(password, user.hashedPassword)) {
    throw new AppError(401, 'UNAUTHORIZED', 'E-mail ou senha inválidos')
  }

  const [accessToken, refreshToken] = await Promise.all([
    createToken(user.id, user.email, '15m'),
    createRefreshToken(user.id, user.email),
  ])

  return { user: formatUser(user), accessToken, refreshToken }
}

export async function refreshTokens(refreshTokenStr: string) {
  const payload = await verifyRefreshToken(refreshTokenStr)
  if (!payload) {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh token inválido ou expirado')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: userSelect,
  })

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')
  }

  invalidateRefreshToken(refreshTokenStr)

  const [newAccessToken, newRefreshToken] = await Promise.all([
    createToken(user.id, user.email, '15m'),
    createRefreshToken(user.id, user.email),
  ])

  return { user: formatUser(user), accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  })

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'Usuário não encontrado')
  }

  return formatUser(user)
}
