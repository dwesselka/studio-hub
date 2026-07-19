import type { Context, Next } from 'hono'

export function requirePermission(...permissions: string[]) {
  return async (c: Context, next: Next) => {
    const memberRole = c.get('memberRole') as { permissions: string[] } | undefined
    
    if (!memberRole) {
      return c.json({ 
        error: 'FORBIDDEN', 
        message: 'Contexto de role não encontrado' 
      }, 403)
    }

    const userPerms = memberRole.permissions

    // Admin global tem acesso a tudo
    if (userPerms.includes('*')) {
      return next()
    }

    // Verifica se possui TODAS as permissões requeridas (ou wildcard do módulo)
    const hasAll = permissions.every(p => {
      const [mod] = p.split(':')
      return userPerms.includes(p) || userPerms.includes(`${mod}:*`)
    })

    if (!hasAll) {
      return c.json({ 
        error: 'FORBIDDEN', 
        message: 'Permissão insuficiente',
        required: permissions 
      }, 403)
    }

    await next()
  }
}

/**
 * Permite acesso se o usuário tiver ALGUMA das permissões listadas.
 */
export function requireAnyPermission(...permissions: string[]) {
  return async (c: Context, next: Next) => {
    const memberRole = c.get('memberRole') as { permissions: string[] } | undefined
    
    if (!memberRole) {
      return c.json({ 
        error: 'FORBIDDEN', 
        message: 'Contexto de role não encontrado' 
      }, 403)
    }

    const userPerms = memberRole.permissions

    if (userPerms.includes('*')) {
      return next()
    }

    const hasAny = permissions.some(p => {
      const [mod] = p.split(':')
      return userPerms.includes(p) || userPerms.includes(`${mod}:*`)
    })

    if (!hasAny) {
      return c.json({ 
        error: 'FORBIDDEN', 
        message: 'Nenhuma permissão compatível encontrada',
        requiredOneOf: permissions 
      }, 403)
    }

    await next()
  }
}
