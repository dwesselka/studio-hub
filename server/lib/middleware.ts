import { Context, Next } from 'hono'
import { verifyToken, type TokenPayload } from './token'
import { unauthorized } from './response'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userEmail: string
    validBody: Record<string, unknown>
    validParams: Record<string, string>
    validQuery: Record<string, string>
  }
}

export async function requestId(c: Context, next: Next): Promise<void> {
  c.header('X-Request-Id', crypto.randomUUID())
  await next()
}

export async function authGuard(c: Context, next: Next): Promise<void> {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized(c)
  }

  const token = authHeader.slice(7)
  let payload: TokenPayload

  try {
    payload = await verifyToken(token)
  } catch {
    return unauthorized(c, 'Token inválido ou expirado')
  }

  if (!payload.sub || !payload.email) {
    return unauthorized(c)
  }

  c.set('userId', payload.sub)
  c.set('userEmail', payload.email)
  await next()
}
