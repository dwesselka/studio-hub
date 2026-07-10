import { z } from 'zod'
import { nonEmptyString } from './common'

export const createServiceSchema = z.object({
  name: nonEmptyString,
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.number().int().nonnegative('Preço deve ser não negativo'),
  category: nonEmptyString,
  active: z.boolean().default(true),
})

export const updateServiceSchema = createServiceSchema.partial()

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
