import { Hono } from 'hono'
import { validateBody, validateParams } from '../lib/validate'
import { success, created, noContent } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as servicosService from '../services/servicos'
import { createServiceSchema, updateServiceSchema } from '../schemas/servicos'
import { uuidParam } from '../schemas/common'
import { toServiceResponse, toServiceCategoryResponse } from '../dto/servicos'
import type { CreateServiceInput } from '../schemas/servicos'

const router = new Hono()

router.use('/*', authGuard)

router.get('/', async (c) => {
  const userId = c.get('userId')
  const activeOnly = c.req.query('active') === 'true'
  const services = await servicosService.listServices(userId, activeOnly)
  const grouped = c.req.query('grouped') === 'true'
  return success(c, grouped ? toServiceCategoryResponse(services.map(toServiceResponse)) : services.map(toServiceResponse))
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const service = await servicosService.getServiceById(userId, id)
  return success(c, toServiceResponse(service))
})

router.post('/', validateBody(createServiceSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.req.valid('json') as CreateServiceInput
  const service = await servicosService.createService(userId, data)
  return created(c, toServiceResponse(service))
})

router.put('/:id', validateParams(uuidParam), validateBody(updateServiceSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const data = c.req.valid('json')
  const service = await servicosService.updateService(userId, id, data)
  return success(c, toServiceResponse(service))
})

router.delete('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  await servicosService.deleteService(userId, id)
  return noContent(c)
})

export default router
