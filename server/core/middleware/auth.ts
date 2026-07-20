import type { Context, Next } from 'hono'
import { verifyToken } from '../../lib/token'
import { prisma } from '../../lib/prisma'

export async function authGuard(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Token não fornecido ou formato inválido' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyToken(token)

    if (!payload.sub || !payload.email) {
      return c.json({ error: 'UNAUTHORIZED', message: 'Token inválido' }, 401)
    }

    // Apenas validamos se o usuário ainda existe
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true }
    })

    if (!user) {
      return c.json({ error: 'UNAUTHORIZED', message: 'Usuário não encontrado' }, 401)
    }

    c.set('userId', payload.sub)
    c.set('userEmail', payload.email)

    await next()
  } catch {
    return c.json({ error: 'UNAUTHORIZED', message: 'Token inválido ou expirado' }, 401)
  }
}
