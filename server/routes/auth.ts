import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success, created } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as authService from '../services/auth'
import { loginSchema, signupSchema, refreshSchema } from '../schemas/auth'
import { toAuthUserResponse } from '../dto/auth'

const router = new Hono()

router.post('/signup', validateBody(signupSchema), async (c) => {
  const { email, password, name } = c.req.valid('json')
  const result = await authService.signup(email, password, name)
  return created(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.post('/login', validateBody(loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  const result = await authService.login(email, password)
  return success(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.post('/refresh', validateBody(refreshSchema), async (c) => {
  const { refreshToken } = c.req.valid('json')
  const result = await authService.refreshTokens(refreshToken)
  return success(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.get('/me', authGuard, async (c) => {
  const userId = c.get('userId')
  const user = await authService.getMe(userId)
  return success(c, toAuthUserResponse(user))
})

router.post('/logout', authGuard, async (c) => {
  return success(c, { message: 'Sessão encerrada' })
})

export default router
