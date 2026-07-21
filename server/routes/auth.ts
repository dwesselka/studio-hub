import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success, created } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as authService from '../services/auth'
import {
  loginSchema,
  signupSchema,
  refreshSchema,
  ativarConviteSchema,
  passwordResetRequestSchema,
} from '../schemas/auth'
import { rateLimit } from '../lib/rate-limit'
import { toAuthUserResponse } from '../dto/auth'
import type { PrismaClient } from '@prisma/client'

// Import Prisma for dev endpoints
let prisma: PrismaClient | null = null
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    prisma = new PrismaClient({ adapter })
  } catch {
    // Prisma not available
  }
}

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

// Dev endpoint to list all users
router.get('/dev/users', async (c) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'dev') {
    return c.json({ error: 'Not found' }, 404)
  }

  try {
    if (!prisma) {
      return c.json({ error: 'Prisma not available' }, 500)
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(c, users)
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Error fetching users' }, 500)
  }
})

router.post(
  '/password-reset/request',
  rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }),
  validateBody(passwordResetRequestSchema),
  async (c) => {
    const { email } = c.get('validBody') as { email: string }
    const result = await authService.requestPasswordReset(email)
    return success(c, result)
  },
)

export default router
