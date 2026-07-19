import { Hono } from 'hono'
import { authGuard } from '../../core/middleware/auth.ts'
import { tenantMiddleware } from '../../core/middleware/tenant.ts'
import { requirePermission } from '../../core/middleware/rbac.ts'

// Podemos usar o service existente importando-o:
// import * as agendaService from '../../services/agenda.ts'

export function createAgendaRouter() {
  const router = new Hono()

  // Middleware globais do módulo
  router.use('/*', authGuard)
  router.use('/*', tenantMiddleware)

  // Rota de listagem
  router.get(
    '/',
    requirePermission('agenda:read'),
    async (c) => {
      // Isso seria substituído pela chamada real ao service,
      // filtrando sempre pelo c.get('workspaceId')
      const workspaceId = c.get('workspaceId')
      return c.json({ data: [], workspaceId })
    }
  )

  return router
}
