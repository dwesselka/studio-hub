import { serverModuleRegistry } from '../../core/registry/module-registry.ts'
import agendaRoutes from '../../routes/agenda.ts'

serverModuleRegistry.register({
  id: 'agenda',
  name: 'StudioHub Agenda',
  version: '1.0.0',
  router: agendaRoutes,
  permissions: ['agenda:read', 'agenda:write', 'agenda:delete'],
})
