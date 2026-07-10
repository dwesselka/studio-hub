import { Hono } from 'hono'
import { success } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as relatoriosService from '../services/relatorios'

const router = new Hono()

router.use('/*', authGuard)

router.get('/kpis', async (c) => {
  const userId = c.get('userId')
  const startDate = c.req.query('startDate') || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  const endDate = c.req.query('endDate') || new Date().toISOString().split('T')[0]
  const kpis = await relatoriosService.getReportKPIs(userId, startDate, endDate)
  return success(c, kpis)
})

export default router
