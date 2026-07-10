import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success, created } from '../lib/response'
import { authGuard, roleGuard } from '../lib/middleware'
import * as fidelizacaoService from '../services/fidelizacao'
import {
  loyaltyProgramSchema,
  createPromotionSchema,
  updatePromotionSchema,
} from '../schemas/fidelizacao'
import {
  toLoyaltyProgramResponse,
  toPromotionResponse,
  toClientPointsResponse,
  toPointsTransactionResponse,
} from '../dto/fidelizacao'

const router = new Hono()

router.use('/*', authGuard, roleGuard('lojista'))

router.get('/program', async (c) => {
  const userId = c.get('userId')
  const program = await fidelizacaoService.getLoyaltyProgram(userId)
  return success(c, toLoyaltyProgramResponse(program))
})

router.put('/program', validateBody(loyaltyProgramSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody')
  const program = await fidelizacaoService.updateLoyaltyProgram(userId, data)
  return success(c, toLoyaltyProgramResponse(program))
})

router.get('/promotions', async (c) => {
  const userId = c.get('userId')
  const promotions = await fidelizacaoService.listPromotions(userId)
  return success(c, promotions.map(toPromotionResponse))
})

router.post('/promotions', validateBody(createPromotionSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody')
  const promotion = await fidelizacaoService.createPromotion(userId, data)
  return created(c, toPromotionResponse(promotion))
})

router.put('/promotions/:id', validateBody(updatePromotionSchema), async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const data = c.get('validBody')
  const promotion = await fidelizacaoService.updatePromotion(userId, id, data)
  return success(c, toPromotionResponse(promotion))
})

router.get('/points/:clientPhone', async (c) => {
  const userId = c.get('userId')
  const clientPhone = c.req.param('clientPhone')
  const points = await fidelizacaoService.getClientPoints(userId, clientPhone)
  return success(c, toClientPointsResponse(points))
})

router.get('/transactions', async (c) => {
  const userId = c.get('userId')
  const clientPhone = c.req.query('clientPhone')
  const transactions = await fidelizacaoService.listPointsTransactions(userId, clientPhone)
  return success(c, transactions.map(toPointsTransactionResponse))
})

export default router
