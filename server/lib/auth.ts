import { Context } from 'hono'
import { UnauthorizedError } from './errors'

const SESSION_PREFIX = 'session_'
const BEARER_PREFIX = 'Bearer '

export function extractToken(c: Context): string | null {
  const auth = c.req.header('Authorization')
  if (!auth) return null
  if (!auth.startsWith(BEARER_PREFIX)) return null
  return auth.slice(BEARER_PREFIX.length)
}

export function extractUserIdFromToken(token: string): string | null {
  if (!token.startsWith(SESSION_PREFIX)) return null
  return token.slice(SESSION_PREFIX.length)
}

export function requireUserId(c: Context): string {
  const token = extractToken(c)
  if (!token) throw new UnauthorizedError()

  const userId = extractUserIdFromToken(token)
  if (!userId) throw new UnauthorizedError()

  return userId
}
