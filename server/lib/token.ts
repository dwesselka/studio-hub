import { sign, verify, decode, type AlgorithmTypes } from 'hono/jwt'

const ALGORITHM = 'HS256' as AlgorithmTypes
const REFRESH_SECRET_SUFFIX = '_refresh'
const usedRefreshTokens = new Set<string>()

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

export interface TokenPayload {
  sub: string
  email: string
  iat: number
  exp: number
  jti: string
  type?: 'access' | 'refresh'
}

export async function createToken(
  userId: string,
  email: string,
  expiresIn: string = '15m',
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const ms = parseDuration(expiresIn)
  const payload = {
    sub: userId,
    email,
    iat: now,
    exp: now + Math.floor(ms / 1000),
    jti: crypto.randomUUID(),
    type: 'access' as const,
  }
  return await sign(payload, getSecret(), ALGORITHM)
}

export async function createRefreshToken(userId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: userId,
    email,
    iat: now,
    exp: now + 7 * 24 * 60 * 60,
    jti: crypto.randomUUID(),
    type: 'refresh' as const,
  }
  return await sign(payload, getSecret() + REFRESH_SECRET_SUFFIX, ALGORITHM)
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  return (await verify(token, getSecret(), ALGORITHM)) as TokenPayload
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    if (usedRefreshTokens.has(token)) return null
    const payload = (await verify(
      token,
      getSecret() + REFRESH_SECRET_SUFFIX,
      ALGORITHM,
    )) as TokenPayload
    return payload
  } catch {
    return null
  }
}

export function invalidateRefreshToken(token: string): void {
  usedRefreshTokens.add(token)
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const { payload } = decode(token)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

function parseDuration(str: string): number {
  const match = str.match(/^(\d+)(s|m|h|d)$/)
  if (!match) return 15 * 60 * 1000
  const value = parseInt(match[1])
  const unit = match[2]
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return value * (multipliers[unit] || 60000)
}
