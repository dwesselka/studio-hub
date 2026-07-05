import { Context, Next } from 'hono'
import { prisma } from '../../src/lib/prisma'
import { forbidden, unauthorized } from './response'

const PLAN_HIERARCHY: Record<string, number> = {
  starter: 0,
  pro: 1,
  premium: 2,
}

export function requirePlan(minPlan: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId')
    if (!userId) return unauthorized(c)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })

    if (!user) return unauthorized(c)

    const userLevel = PLAN_HIERARCHY[user.plan] ?? -1
    const requiredLevel = PLAN_HIERARCHY[minPlan] ?? 0

    if (userLevel < requiredLevel) {
      return forbidden(c, `Plano ${user.plan} não tem permissão. Necessário: ${minPlan}`)
    }

    await next()
  }
}
