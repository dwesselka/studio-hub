import { Hono } from 'hono'
import { success } from '../lib/response'
import { authGuard, roleGuard } from '../lib/middleware'
import * as dashboardService from '../services/dashboard'

const router = new Hono()

router.use('/*', authGuard)

router.get('/metrics', roleGuard('lojista'), async (c) => {
  const userId = c.get('userId')
  const data = await dashboardService.getDashboardMetrics(userId)
  return success(c, data)
})

router.get('/today', roleGuard('lojista'), async (c) => {
  const userId = c.get('userId')
  const data = await dashboardService.getDashboardToday(userId)
  return success(c, data)
})

router.get('/analytics', roleGuard('lojista'), async (c) => {
  const userId = c.get('userId')
  const data = await dashboardService.getDashboardAnalytics(userId)
  return success(c, data)
})

router.get('/status', async (c) => {
  return success(c, {
    label: 'Todos os sistemas operacionais',
    status: 'operational',
    uptime: '99.98%',
    lastIncident: 'Nenhum incidente nos últimos 30 dias',
    services: [
      { name: 'API', status: 'operational', latency: '45ms' },
      { name: 'Banco de dados', status: 'operational', latency: '12ms' },
      { name: 'Autenticação', status: 'operational', latency: '30ms' },
      { name: 'Agendamento IA', status: 'operational', latency: '120ms' },
      { name: 'Pagamentos', status: 'operational', latency: '80ms' },
    ],
  })
})

export default router
