import { Hono } from 'hono'
import { validateBody } from '../lib/validate'
import { success } from '../lib/response'
import { authGuard } from '../lib/middleware'
import * as onboardingService from '../services/onboarding'
import { businessDataSchema, hoursSchema, servicesSchema, teamSchema } from '../schemas/onboarding'

const router = new Hono()

router.use('/*', authGuard)

router.put('/business', validateBody(businessDataSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.get('validBody')
  await onboardingService.saveBusinessData(userId, data)
  return success(c, { onboardingData: { business: data } })
})

router.put('/hours', validateBody(hoursSchema), async (c) => {
  const userId = c.get('userId')
  const hours = c.get('validBody')
  await onboardingService.saveHours(userId, hours)
  return success(c, { onboardingData: { hours } })
})

router.put('/services', validateBody(servicesSchema), async (c) => {
  const userId = c.get('userId')
  const services = c.get('validBody')
  await onboardingService.saveServices(userId, services)
  return success(c, { onboardingData: { services: services.map((s: { name: string; duration: number; price: number; category: string }) => ({ id: crypto.randomUUID(), ...s })) } })
})

router.put('/team', validateBody(teamSchema), async (c) => {
  const userId = c.get('userId')
  const team = c.get('validBody')
  await onboardingService.saveTeam(userId, team)
  return success(c, { onboardingData: { team } })
})

router.post('/complete', async (c) => {
  const userId = c.get('userId')
  await onboardingService.completeOnboarding(userId)
  return success(c, { onboardingData: { completed: true } })
})

router.get('/prepopulated/:segmento', async (c) => {
  const segmento = c.req.param('segmento')
  const services = await onboardingService.getPrepopulatedServices(segmento)
  return success(c, services)
})

router.get('/progress', async (c) => {
  const userId = c.get('userId')
  const user = await onboardingService.saveBusinessData(userId, { nome: '', segmento: '', endereco: '', telefone: '' })
  return success(c, {
    progress: {
      accountCreated: true,
      businessDataComplete: !!user.businessName,
      hoursConfigured: false,
      servicesReviewed: false,
      teamAdded: false,
    },
    percent: user.businessName ? 40 : 20,
    completed: user.onboardingCompleted,
  })
})

export default router
