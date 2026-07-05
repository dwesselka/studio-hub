import { Hono } from 'hono'
import { validateBody, validateQuery, validateParams } from '../lib/validate'
import { success, successPaginated, created, noContent } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as agendaService from '../services/agenda'
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  agendaFiltersQuery,
  dateRangeQuery,
  rescheduleSchema,
  conflictCheckQuery,
  suggestionsQuery,
} from '../schemas/agenda'
import { uuidParam } from '../schemas/common'
import { toAppointmentResponse } from '../dto/agenda'
import type { CreateAppointmentInput, RescheduleInput } from '../schemas/agenda'

const router = new Hono()

router.use('/*', authGuard)

router.get('/', validateQuery(agendaFiltersQuery), async (c) => {
  const userId = c.get('userId')
  const filters = c.req.valid('query')
  const { items, total } = await agendaService.listAppointments(userId, filters)
  return successPaginated(c, items.map(toAppointmentResponse), total, filters.page, filters.perPage)
})

router.get('/date/:date', async (c) => {
  const userId = c.get('userId')
  const date = c.req.param('date')
  const { items } = await agendaService.listAppointments(userId, { date, page: 1, perPage: 100 })
  return success(c, items.map(toAppointmentResponse))
})

router.get('/range', validateQuery(dateRangeQuery), async (c) => {
  const userId = c.get('userId')
  const { startDate } = c.req.valid('query')
  const appointments = await agendaService.listAppointments(userId, {
    date: startDate,
    view: 'week',
    page: 1,
    perPage: 1000,
  })
  return success(c, appointments.items.map(toAppointmentResponse))
})

router.post('/', validateBody(createAppointmentSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.req.valid('json') as CreateAppointmentInput
  const appointment = await agendaService.createAppointment(userId, data)
  return created(c, toAppointmentResponse(appointment))
})

router.get('/conflicts', validateQuery(conflictCheckQuery), async (c) => {
  const userId = c.get('userId')
  const params = c.req.valid('query')
  const result = await agendaService.checkConflicts(userId, params)
  return success(c, result)
})

router.get('/suggestions', validateQuery(suggestionsQuery), async (c) => {
  const userId = c.get('userId')
  const params = c.req.valid('query')
  const suggestions = await agendaService.getSuggestions(userId, params)
  return success(c, suggestions)
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const appointment = await agendaService.getAppointmentById(userId, id)
  return success(c, toAppointmentResponse(appointment))
})

router.put('/:id', validateParams(uuidParam), validateBody(updateAppointmentSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const data = c.req.valid('json')
  const appointment = await agendaService.updateAppointment(userId, id, data)
  return success(c, toAppointmentResponse(appointment))
})

router.patch('/:id/confirm', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const appointment = await agendaService.changeStatus(userId, id, 'confirmed')
  return success(c, toAppointmentResponse(appointment))
})

router.patch('/:id/cancel', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const appointment = await agendaService.changeStatus(userId, id, 'cancelled')
  return success(c, toAppointmentResponse(appointment))
})

router.patch('/:id/no-show', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const appointment = await agendaService.changeStatus(userId, id, 'no-show')
  return success(c, toAppointmentResponse(appointment))
})

router.post('/:id/reschedule', validateParams(uuidParam), validateBody(rescheduleSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  const data = c.req.valid('json') as RescheduleInput
  const appointment = await agendaService.rescheduleAppointment(userId, id, data)
  return success(c, toAppointmentResponse(appointment))
})

router.delete('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.req.valid('param')
  await agendaService.deleteAppointment(userId, id)
  return noContent(c)
})

export default router
