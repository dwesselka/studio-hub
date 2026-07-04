export type FeedbackScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface Feedback {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  score: FeedbackScore
  comment: string
  createdAt: string
}

export type CampaignType = 'return' | 'upsell' | 'birthday'
export type CampaignStatus = 'active' | 'paused'
export type ClientSegment = 'all' | 'active' | 'inactive' | 'high-value' | 'at-risk'

export interface CampaignStats {
  sent: number
  responded: number
  converted: number
}

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  segment: ClientSegment
  triggerDays: number
  messageTemplate: string
  serviceSuggestion?: string
  stats: CampaignStats
  createdAt: string
  updatedAt?: string
}

export const SEGMENT_LABELS: Record<ClientSegment, string> = {
  all: 'Todos os clientes',
  active: 'Ativos (visita nos últimos 30 dias)',
  inactive: 'Inativos (30+ dias sem visita)',
  'high-value': 'Alto valor (gasto total > R$ 500)',
  'at-risk': 'Em risco (45+ dias sem visita)',
}

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  return: 'Retorno',
  upsell: 'Upsell',
  birthday: 'Aniversário',
}
