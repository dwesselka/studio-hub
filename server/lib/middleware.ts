import { Context, Next } from 'hono'
import { verifyToken, type TokenPayload } from './token'
import { prisma } from '../../src/lib/prisma'
import { unauthorized } from './response'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userEmail: string
    userRole: string
    businessOwnerId: string
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

  // Buscar role e businessOwnerId do usuário
  const user = await prisma?.user.findUnique({
    where: { id: payload.sub },
    select: { role: true, businessOwnerId: true },
  })

  c.set('userRole', user?.role ?? 'lojista')
  c.set('businessOwnerId', user?.businessOwnerId ?? payload.sub)

  await next()
}

export function roleGuard(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole') as string
    if (!allowedRoles.includes(userRole)) {
      return c.json({ error: 'FORBIDDEN', message: 'Acesso não autorizado' }, 403)
    }
    await next()
  }
}
