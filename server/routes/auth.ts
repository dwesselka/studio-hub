import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success, created } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as authService from '../services/auth'
import { loginSchema, signupSchema, refreshSchema, ativarConviteSchema } from '../schemas/auth'
import { toAuthUserResponse } from '../dto/auth'

const router = new Hono()

router.post('/signup', validateBody(signupSchema), async (c) => {
  const { email, password, name } = c.get('validBody') as {
    email: string
    password: string
    name: string
  }
  const result = await authService.signup(email, password, name)
  return created(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.post('/login', validateBody(loginSchema), async (c) => {
  const { email, password } = c.get('validBody') as { email: string; password: string }
  const result = await authService.login(email, password)
  return success(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.post('/refresh', validateBody(refreshSchema), async (c) => {
  const { refreshToken } = c.get('validBody') as { refreshToken: string }
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

router.post('/ativar-convite', validateBody(ativarConviteSchema), async (c) => {
  const { token, name, password } = c.get('validBody') as {
    token: string
    name: string
    password: string
  }
  const result = await authService.ativarConvite(token, name, password)
  return created(c, {
    user: toAuthUserResponse(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })
})

router.get('/convite/:token', async (c) => {
  const token = c.req.param('token')
  const result = await authService.validarConvite(token)
  return success(c, result)
})

export default router
