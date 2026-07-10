export { apiClient } from './client'
export {
  simulator,
  DEFAULT_NETWORK_CONFIG,
  type SimulationEvent,
  type SimulationEventType,
  type SimulationListener,
} from './simulator'
export { mockServer } from './server'
export { ApiRequestError } from './types'
export type {
  ApiRequest,
  ApiResponse,
  ApiResult,
  NetworkConfig,
  PaginatedRequest,
  PaginatedResponse,
} from './types'

export { registerAuthHandlers } from './handlers/auth'
export { registerOnboardingHandlers } from './handlers/onboarding'
export { registerAgendaHandlers } from './handlers/agenda'
export { registerDashboardHandlers } from './handlers/dashboard'
export { registerClienteHandlers } from './handlers/cliente'

import { registerAuthHandlers } from './handlers/auth'
import { registerOnboardingHandlers } from './handlers/onboarding'
import { registerAgendaHandlers } from './handlers/agenda'
import { registerDashboardHandlers } from './handlers/dashboard'
import { registerClienteHandlers } from './handlers/cliente'
import { mockServer } from './server'

export function initMockApi(): void {
  registerAuthHandlers()
  registerOnboardingHandlers()
  registerAgendaHandlers()
  registerDashboardHandlers()
  registerClienteHandlers()
  mockServer.start()

  if (import.meta.env.DEV) {
    console.info(
      '[API Mock] Servidor mock iniciado com handlers:',
      [
        'auth (signup, login, me, logout)',
        'onboarding (business, hours, services, team, complete, prepopulated)',
        'agenda (CRUD, confirm, cancel, no-show, reschedule, conflicts, suggestions)',
        'dashboard (metrics, today, analytics, status)',
        'cliente (dashboard, agendamentos, cancelar, fidelidade, perfil)',
      ].join('\n  '),
    )
  }
}
