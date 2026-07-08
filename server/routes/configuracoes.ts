import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as configService from '../services/configuracoes'
import { updateConfigSchema } from '../schemas/configuracoes'

const router = new Hono()

router.use('/*', authGuard)

router.get('/', async (c) => {
  const userId = c.get('userId')
  const config = await configService.getConfig(userId)
  return success(c, config)
})

router.put('/', validateBody(updateConfigSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody')
  const config = await configService.updateConfig(userId, data)
  return success(c, config)
})

export default router
