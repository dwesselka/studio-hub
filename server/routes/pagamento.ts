import { Hono } from 'hono'
import { validateBody, validateParams } from '../lib/validate'
import { success, successPaginated, created } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as pagamentoService from '../services/pagamento'
import { createPaymentSchema, updatePaymentSchema } from '../schemas/pagamento'
import { uuidParam } from '../schemas/common'
import { toPaymentResponse } from '../dto/pagamento'
import type { CreatePaymentInput } from '../schemas/pagamento'

const router = new Hono()

router.use('/*', authGuard)

router.get('/', async (c) => {
  const userId = c.get('userId')
  const page = Number(c.req.query('page') || '1')
  const perPage = Number(c.req.query('perPage') || '50')
  const status = c.req.query('status')
  const { items, total } = await pagamentoService.listPayments(userId, { status, page, perPage })
  return successPaginated(c, items.map(toPaymentResponse), total, page, perPage)
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const payment = await pagamentoService.getPaymentById(userId, id)
  return success(c, toPaymentResponse(payment))
})

router.post('/', validateBody(createPaymentSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody') as CreatePaymentInput
  const payment = await pagamentoService.createPayment(userId, data)
  return created(c, toPaymentResponse(payment))
})

router.put('/:id', validateParams(uuidParam), validateBody(updatePaymentSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const data = c.get('validBody')
  const payment = await pagamentoService.updatePayment(userId, id, data)
  return success(c, toPaymentResponse(payment))
})

export default router
