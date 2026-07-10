import { z } from 'zod'

export const pointsTransactionTypeEnum = z.enum(['earn', 'redeem', 'expire'])
export const promotionStatusEnum = z.enum(['active', 'paused'])
export const clientSegmentEnum = z.enum(['all', 'active', 'inactive', 'high-value', 'at-risk'])

export const loyaltyProgramSchema = z.object({
  pointsPerCurrency: z.number().int().nonnegative().default(10),
  pointsPerVisit: z.number().int().nonnegative().default(50),
  pointsExpiryDays: z.number().int().nonnegative().default(180),
  enabled: z.boolean().default(true),
})

export const createPromotionSchema = z.object({
  name: z.string().min(1),
  segment: clientSegmentEnum,
  discountPercent: z.number().int().min(0).max(100),
  requiredPoints: z.number().int().nonnegative(),
  serviceId: z.string().uuid().optional(),
  serviceName: z.string().optional(),
  expiresAt: z.string(),
  status: promotionStatusEnum.default('active'),
})

export const updatePromotionSchema = createPromotionSchema.partial()

export type LoyaltyProgramInput = z.infer<typeof loyaltyProgramSchema>
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>
