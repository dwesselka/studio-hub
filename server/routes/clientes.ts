import { Hono } from 'hono'
import { validateBody, validateQuery, validateParams } from '../lib/validate'
import { success, successPaginated, created, noContent } from '../lib/response'
import { authGuard, roleGuard } from '../lib/middleware'
import * as clientesService from '../services/clientes'
import { createClienteSchema, updateClienteSchema, clienteFiltersQuery } from '../schemas/clientes'
import { uuidParam } from '../schemas/common'
import { toClienteResponse } from '../dto/clientes'
import type { CreateClienteInput } from '../schemas/clientes'

const router = new Hono()

router.use('/*', authGuard, roleGuard('lojista', 'profissional'))

router.get('/', validateQuery(clienteFiltersQuery), async (c) => {
  const userId = c.get('userId')
  const filters = c.get('validQuery')
  const { items, total } = await clientesService.listClientes(userId, filters)
  return successPaginated(c, items.map(toClienteResponse), total, filters.page, filters.perPage)
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const cliente = await clientesService.getClienteById(userId, id)
  return success(c, toClienteResponse(cliente))
})

router.post('/', validateBody(createClienteSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody') as CreateClienteInput
  const cliente = await clientesService.createCliente(userId, data)
  return created(c, toClienteResponse(cliente))
})

router.put('/:id', validateParams(uuidParam), validateBody(updateClienteSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const data = c.get('validBody')
  const cliente = await clientesService.updateCliente(userId, id, data)
  return success(c, toClienteResponse(cliente))
})

router.delete('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  await clientesService.deleteCliente(userId, id)
  return noContent(c)
})

export default router
