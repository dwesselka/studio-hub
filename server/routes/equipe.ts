import { Hono } from 'hono'
import { validateBody, validateParams } from '../lib/validate'
import { success, created, noContent } from '../lib/response'
import { authGuard, roleGuard } from '../lib/middleware'
import * as equipeService from '../services/equipe'
import { createTeamMemberSchema, updateTeamMemberSchema } from '../schemas/equipe'
import { uuidParam } from '../schemas/common'
import { toTeamMemberResponse } from '../dto/equipe'
import type { CreateTeamMemberInput } from '../schemas/equipe'

const router = new Hono()

router.use('/*', authGuard, roleGuard('lojista'))

router.get('/', async (c) => {
  const userId = c.get('userId')
  const members = await equipeService.listTeam(userId)
  return success(c, members.map(toTeamMemberResponse))
})

router.get('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const member = await equipeService.getTeamMemberById(userId, id)
  return success(c, toTeamMemberResponse(member))
})

router.post('/', validateBody(createTeamMemberSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody') as CreateTeamMemberInput
  const member = await equipeService.createTeamMember(userId, data)
  return created(c, toTeamMemberResponse(member))
})

router.put('/:id', validateParams(uuidParam), validateBody(updateTeamMemberSchema), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  const data = c.get('validBody')
  const member = await equipeService.updateTeamMember(userId, id, data)
  return success(c, toTeamMemberResponse(member))
})

router.delete('/:id', validateParams(uuidParam), async (c) => {
  const userId = c.get('userId')
  const { id } = c.get('validParams')
  await equipeService.deleteTeamMember(userId, id)
  return noContent(c)
})

export default router
