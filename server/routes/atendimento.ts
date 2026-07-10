import { Hono } from 'hono'
import { validateBody, validateParams } from '../lib/validate'
import { success, successPaginated, created } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as atendimentoService from '../services/atendimento'
import { createAtendimentoSchema, updateAtendimentoSchema } from '../schemas/atendimento'
import { uuidParam } from '../schemas/common'
import { toAtendimentoResponse } from '../dto/atendimento'
import type { CreateAtendimentoInput } from '../schemas/atendimento'

const router = new Hono()

router.use('/*', authGuard)

router.get('/', async (c) => {
  const userId = c.get('userId')
  const page = Number(c.req.query('page') || '1')
  const perPage = Number(c.req.query('perPage') || '50')
  const status = c.req.query('status')
  const { items, total } = await atendimentoService.listAtendimentos(userId, { status, page, perPage })
  return successPaginated(c, items.map(toAtendimentoResponse), total, page, perPage)
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const atendimento = await atendimentoService.getAtendimentoById(userId, id)
  return success(c, toAtendimentoResponse(atendimento))
})

router.post('/', validateBody(createAtendimentoSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody') as CreateAtendimentoInput
  const atendimento = await atendimentoService.createAtendimento(userId, data)
  return created(c, toAtendimentoResponse(atendimento))
})

router.put('/:id', validateParams(uuidParam), validateBody(updateAtendimentoSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const data = c.get('validBody')
  const atendimento = await atendimentoService.updateAtendimento(userId, id, data)
  return success(c, toAtendimentoResponse(atendimento))
})

export default router
