import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success, successPaginated, created, noContent } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as posAtendimentoService from '../services/pos-atendimento'
import { createFeedbackSchema, createCampaignSchema, updateCampaignSchema } from '../schemas/pos-atendimento'
import { toFeedbackResponse, toCampaignResponse } from '../dto/pos-atendimento'

const router = new Hono()

router.use('/*', authGuard)

router.get('/feedback', async (c) => {
  const userId = c.get('userId')
  const page = Number(c.req.query('page') || '1')
  const perPage = Number(c.req.query('perPage') || '50')
  const { items, total } = await posAtendimentoService.listFeedback(userId, { page, perPage })
  return successPaginated(c, items.map(toFeedbackResponse), total, page, perPage)
})

router.post('/feedback', validateBody(createFeedbackSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.req.valid('json')
  const feedback = await posAtendimentoService.createFeedback(userId, data)
  return created(c, toFeedbackResponse(feedback))
})

router.get('/campaigns', async (c) => {
  const userId = c.get('userId')
  const campaigns = await posAtendimentoService.listCampaigns(userId)
  return success(c, campaigns.map(toCampaignResponse))
})

router.post('/campaigns', validateBody(createCampaignSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.req.valid('json')
  const campaign = await posAtendimentoService.createCampaign(userId, data)
  return created(c, toCampaignResponse(campaign))
})

router.put('/campaigns/:id', validateBody(updateCampaignSchema), async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const data = c.req.valid('json')
  const campaign = await posAtendimentoService.updateCampaign(userId, id, data)
  return success(c, toCampaignResponse(campaign))
})

router.delete('/campaigns/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  await posAtendimentoService.deleteCampaign(userId, id)
  return noContent(c)
})

export default router
