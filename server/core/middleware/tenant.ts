import type { Context, Next } from 'hono'
import { prisma } from '../../lib/prisma'

export class TenantError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TenantError'
  }
}

export async function tenantMiddleware(c: Context, next: Next) {
  const userId = c.get('userId')

  if (!userId) {
    return c.json({ error: 'UNAUTHORIZED', message: 'Usuário não autenticado' }, 401)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        businessOwner: true
      }
    })

    if (!user) {
      return c.json({ error: 'FORBIDDEN', message: 'Usuário não encontrado' }, 403)
    }

    // Se o usuário tem um businessOwnerId, ele é membro da equipe de alguém.
    // O workspace será o usuário dono (businessOwner), caso contrário, será ele mesmo.
    const workspaceUser = user.businessOwnerId && user.businessOwner ? user.businessOwner : user

    c.set('workspaceId', workspaceUser.id)
    c.set('workspace', {
      id: workspaceUser.id,
      slug: workspaceUser.id, // ou outro campo único se você tiver
      name: workspaceUser.businessName || workspaceUser.name,
      plan: workspaceUser.plan,
      modules: [],
    })
    c.set('memberRole', {
      id: user.role,
      name: user.role,
      permissions: [],
    })

    await next()
  } catch (error) {
    console.error('[TenantMiddleware] Error resolving tenant context:', error)
    return c.json({ error: 'INTERNAL_SERVER_ERROR', message: 'Erro ao resolver contexto do workspace' }, 500)
  }
}
