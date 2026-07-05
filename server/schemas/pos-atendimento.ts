import { z } from 'zod'

export const feedbackScoreSchema = z.number().int().min(0).max(10)
export const campaignTypeEnum = z.enum(['return', 'upsell', 'birthday'])
export const campaignStatusEnum = z.enum(['active', 'paused'])
export const clientSegmentEnum = z.enum(['all', 'active', 'inactive', 'high-value', 'at-risk'])

export const createFeedbackSchema = z.object({
  atendimentoId: z.string().uuid(),
  clientName: z.string().min(1),
  clientPhone: z.string().min(1),
  score: feedbackScoreSchema,
  comment: z.string().optional(),
})

export const createCampaignSchema = z.object({
  name: z.string().min(1),
  type: campaignTypeEnum,
  status: campaignStatusEnum.default('active'),
  segment: clientSegmentEnum,
  triggerDays: z.number().int().nonnegative(),
  messageTemplate: z.string().min(1),
  serviceSuggestion: z.string().optional(),
})

export const updateCampaignSchema = createCampaignSchema.partial()

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
