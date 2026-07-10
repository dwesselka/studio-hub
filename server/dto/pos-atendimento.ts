export interface FeedbackResponse {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  score: number
  comment: string | null
  createdAt: string
}

export interface CampaignResponse {
  id: string
  name: string
  type: string
  status: string
  segment: string
  triggerDays: number
  messageTemplate: string
  serviceSuggestion: string | null
  stats: { sent: number; responded: number; converted: number }
  createdAt: string
  updatedAt: string | null
}

export function toFeedbackResponse(feedback: {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  score: number
  comment: string | null
  createdAt: Date
}): FeedbackResponse {
  return {
    id: feedback.id,
    atendimentoId: feedback.atendimentoId,
    clientName: feedback.clientName,
    clientPhone: feedback.clientPhone,
    score: feedback.score,
    comment: feedback.comment,
    createdAt: feedback.createdAt.toISOString(),
  }
}

export function toCampaignResponse(campaign: {
  id: string
  name: string
  type: string
  status: string
  segment: string
  triggerDays: number
  messageTemplate: string
  serviceSuggestion: string | null
  statsSent: number
  statsResponded: number
  statsConverted: number
  createdAt: Date
  updatedAt: Date | null
}): CampaignResponse {
  return {
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    status: campaign.status,
    segment: campaign.segment,
    triggerDays: campaign.triggerDays,
    messageTemplate: campaign.messageTemplate,
    serviceSuggestion: campaign.serviceSuggestion,
    stats: {
      sent: campaign.statsSent,
      responded: campaign.statsResponded,
      converted: campaign.statsConverted,
    },
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt?.toISOString() ?? null,
  }
}
