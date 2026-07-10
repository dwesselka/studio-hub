import { Hono } from 'hono'
import { validateBody, validateParams } from '../lib/validate'
import { success } from '../lib/response'
import { authGuard, roleGuard } from '../lib/middleware'
import * as clienteService from '../services/cliente'
import { uuidParam } from '../schemas/common'
import { z } from 'zod'

const router = new Hono()

router.use('/*', authGuard, roleGuard('cliente'))

router.get('/dashboard', async (c) => {
  const userId = c.get('userId')
  const data = await clienteService.getDashboard(userId)
  return success(c, data)
})

router.get('/agendamentos', async (c) => {
  const userId = c.get('userId')
  const data = await clienteService.listAgendamentos(userId)
  return success(c, data)
})

router.patch('/agendamentos/:id/cancelar', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const data = await clienteService.cancelarAgendamento(userId, id)
  return success(c, data)
})

router.get('/fidelidade', async (c) => {
  const userId = c.get('userId')
  const data = await clienteService.getFidelidade(userId)
  return success(c, data)
})

const perfilSchema = z.object({
  name: z.string().min(1).trim().optional(),
  telefone: z.string().optional(),
})

router.patch('/perfil', validateBody(perfilSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody') as { name?: string; telefone?: string }
  const result = await clienteService.atualizarPerfil(userId, data)
  return success(c, result)
})

export default router
