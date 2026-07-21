import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword, verifyPassword } from '../lib/crypto'
import {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
  invalidateRefreshToken,
} from '../lib/token'
import { AppError } from '../lib/errors'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

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

export async function ativarConvite(token: string, name: string, password: string) {
  const invite = await prisma.inviteToken.findUnique({ where: { token } })

  if (!invite) throw new AppError(404, 'NOT_FOUND', 'Convite não encontrado')
  if (invite.usedAt) throw new AppError(409, 'CONFLICT', 'Convite já utilizado')
  if (invite.expiresAt < new Date()) throw new AppError(410, 'EXPIRED', 'Convite expirado')

  const [user] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: invite.email,
        name,
        hashedPassword: hashPassword(password),
        role: 'profissional',
        businessOwnerId: invite.userId,
        teamMemberId: invite.teamMemberId,
      },
      select: userSelect,
    }),
    prisma.inviteToken.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    }),
  ])

  const [accessToken, refreshToken] = await Promise.all([
    createToken(user.id, user.email, '15m'),
    createRefreshToken(user.id, user.email),
  ])

  return { user: formatUser(user), accessToken, refreshToken }
}

export async function validarConvite(token: string) {
  const invite = await prisma.inviteToken.findUnique({ where: { token } })

  if (!invite) throw new AppError(404, 'NOT_FOUND', 'Convite não encontrado')
  if (invite.usedAt) throw new AppError(409, 'CONFLICT', 'Convite já utilizado')
  if (invite.expiresAt < new Date()) throw new AppError(410, 'EXPIRED', 'Convite expirado')

  const owner = await prisma.user.findUnique({
    where: { id: invite.userId },
    select: { businessName: true },
  })

  return { email: invite.email, businessName: owner?.businessName ?? null }
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({ where: { email } })

  // Resposta genérica para não revelar se o e-mail existe (segurança)
  const genericMessage = 'Se este e-mail estiver cadastrado, você receberá um código em breve.'

  if (!user) {
    return { message: genericMessage }
  }

  // Gera código numérico de 6 dígitos
  const { randomInt } = await import('node:crypto')
  const code = String(randomInt(100000, 999999))

  // Expira em 15 minutos
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  // Persiste o token (invalida tokens anteriores do mesmo usuário)
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      email: user.email,
      code,
      expiresAt,
    },
  })

  // TODO: enviar o código por e-mail (integração de e-mail pendente)
  // Por ora, apenas loga em desenvolvimento
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    console.log(`[DEV] Password reset code for ${email}: ${code}`)
  }

  return { message: genericMessage }
}
