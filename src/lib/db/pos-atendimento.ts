import { safeLocalStorage } from '@/lib/storage'
import { sendWhatsApp } from '@/lib/services/whatsapp'
import { getAllAtendimentos } from '@/lib/db/atendimento'
import type {
  Feedback,
  Campaign,
  ClientSegment,
  CampaignStats,
} from '@/features/pos-atendimento/types'

const FEEDBACK_KEY = 'infinity_feedback'
const CAMPAIGN_KEY = 'infinity_campaigns'

function loadFeedback(): Feedback[] {
  const raw = safeLocalStorage.getItem(FEEDBACK_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveFeedback(list: Feedback[]): void {
  safeLocalStorage.setItem(FEEDBACK_KEY, JSON.stringify(list))
}

function loadCampaigns(): Campaign[] {
  const raw = safeLocalStorage.getItem(CAMPAIGN_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveCampaigns(list: Campaign[]): void {
  safeLocalStorage.setItem(CAMPAIGN_KEY, JSON.stringify(list))
}

function generateId(): string {
  return crypto.randomUUID()
}

export function seedCampaigns(): void {
  const existing = loadCampaigns()
  if (existing.length > 0) return

  const defaults: Campaign[] = [
    {
      id: generateId(),
      name: 'Retorno 30 dias',
      type: 'return',
      status: 'active',
      segment: 'inactive',
      triggerDays: 30,
      messageTemplate:
        '🖐️ Olá {{nome}}! Faz tempo que não aparecemos por aqui. Que tal agendar um horário conosco? Estamos com vagas disponíveis! 👉 {{link}}',
      stats: { sent: 0, responded: 0, converted: 0 },
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Sugestão de serviço',
      type: 'upsell',
      status: 'active',
      segment: 'active',
      triggerDays: 7,
      messageTemplate:
        '🖐️ {{nome}}, que tal complementar seu próximo atendimento com {{servico}}? É o momento ideal para cuidar de você! 👉 {{link}}',
      serviceSuggestion: 'Hidratação',
      stats: { sent: 0, responded: 0, converted: 0 },
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Aniversário do cliente',
      type: 'birthday',
      status: 'active',
      segment: 'all',
      triggerDays: 0,
      messageTemplate:
        '🎂 Feliz aniversário, {{nome}}! Para celebrar esta data especial, separei um brinde para você na sua próxima visita. Agende já! 👉 {{link}}',
      stats: { sent: 0, responded: 0, converted: 0 },
      createdAt: new Date().toISOString(),
    },
  ]

  saveCampaigns(defaults)
}

export function getCampaigns(): Campaign[] {
  seedCampaigns()
  return loadCampaigns()
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const list = loadCampaigns()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) return null

  list[idx] = { ...list[idx], ...updates, id, updatedAt: new Date().toISOString() }
  saveCampaigns(list)
  return list[idx]
}

export function toggleCampaign(id: string): Campaign | null {
  const list = loadCampaigns()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) return null
  list[idx] = {
    ...list[idx],
    status: list[idx].status === 'active' ? 'paused' : 'active',
    updatedAt: new Date().toISOString(),
  }
  saveCampaigns(list)
  return list[idx]
}

export function incrementCampaignStat(id: string, stat: keyof CampaignStats): Campaign | null {
  const list = loadCampaigns()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) return null

  list[idx] = {
    ...list[idx],
    stats: { ...list[idx].stats, [stat]: list[idx].stats[stat] + 1 },
  }
  saveCampaigns(list)
  return list[idx]
}

export function getFeedbackList(): Feedback[] {
  return loadFeedback().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getFeedbackByAtendimento(atendimentoId: string): Feedback | undefined {
  return loadFeedback().find((f) => f.atendimentoId === atendimentoId)
}

export function createFeedback(data: Omit<Feedback, 'id' | 'createdAt'>): Feedback {
  const list = loadFeedback()
  const feedback: Feedback = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  list.push(feedback)
  saveFeedback(list)
  return feedback
}

export function getNPS(): {
  score: number
  total: number
  promoters: number
  detractors: number
  passive: number
} {
  const all = loadFeedback()
  if (all.length === 0) return { score: 0, total: 0, promoters: 0, detractors: 0, passive: 0 }

  const promoters = all.filter((f) => f.score >= 9).length
  const detractors = all.filter((f) => f.score <= 6).length
  const passive = all.length - promoters - detractors

  return {
    score: Math.round(((promoters - detractors) / all.length) * 100),
    total: all.length,
    promoters,
    detractors,
    passive,
  }
}

function getDaysSinceLastVisit(clientPhone: string): number {
  const atendimentos = getAllAtendimentos()
    .filter((a) => a.clientPhone === clientPhone)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (atendimentos.length === 0) return Infinity

  const lastDate = new Date(atendimentos[0].createdAt)
  const now = new Date()
  return Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
}

function getTotalSpent(clientPhone: string): number {
  return getAllAtendimentos()
    .filter((a) => a.clientPhone === clientPhone && a.status === 'completed')
    .reduce((sum, a) => sum + a.totalValue, 0)
}

export function getClientPhoneList(): string[] {
  const atendimentos = getAllAtendimentos()
  return [...new Set(atendimentos.map((a) => a.clientPhone))]
}

export function getClientSegment(clientPhone: string): ClientSegment {
  const daysSince = getDaysSinceLastVisit(clientPhone)
  const totalSpent = getTotalSpent(clientPhone)

  if (daysSince <= 30) return totalSpent >= 50000 ? 'high-value' : 'active'
  if (daysSince <= 45) return 'inactive'
  return 'at-risk'
}

export function getClientsBySegment(segment: ClientSegment): string[] {
  if (segment === 'all') return getClientPhoneList()
  return getClientPhoneList().filter((phone) => getClientSegment(phone) === segment)
}

export function scheduleFeedbackRequest(
  atendimentoId: string,
  clientName: string,
  clientPhone: string,
): void {
  const existing = getFeedbackByAtendimento(atendimentoId)
  if (existing) return

  const message = [
    `🖐️ *Olá ${clientName}!*`,
    ``,
    `Seu atendimento foi concluído 🎉`,
    `Gostaríamos de saber como foi sua experiência.`,
    ``,
    `De 0 a 10, o quanto você recomendaria nosso serviço?`,
    `(0 = Não recomendaria · 10 = Recomendaria com certeza)`,
    ``,
    `Responda com uma nota e, se quiser, deixe um comentário 💬`,
  ].join('\n')

  sendWhatsApp({ to: clientPhone, body: message }).then(() => {
    console.info('[Pos-atendimento] Solicitação de feedback enviada para', clientName)
  })
}

export function executeCampaigns(): void {
  const campaigns = loadCampaigns().filter((c) => c.status === 'active')
  const today = new Date()

  for (const campaign of campaigns) {
    const clientPhones = getClientsBySegment(campaign.segment)
    let sent = 0

    for (const phone of clientPhones) {
      const atendimentos = getAllAtendimentos()
        .filter((a) => a.clientPhone === phone)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

      if (atendimentos.length === 0) continue

      const lastAtendimento = atendimentos[0]

      if (campaign.type === 'return') {
        const daysSince = getDaysSinceLastVisit(phone)
        if (daysSince === campaign.triggerDays) {
          const msg = campaign.messageTemplate
            .replace('{{nome}}', lastAtendimento.clientName)
            .replace('{{link}}', `${window.location.origin}/app/agendamentos`)
          sendWhatsApp({ to: phone, body: msg })
          sent++
        }
      }

      if (campaign.type === 'upsell') {
        const daysSince = getDaysSinceLastVisit(phone)
        if (daysSince === campaign.triggerDays) {
          const msg = campaign.messageTemplate
            .replace('{{nome}}', lastAtendimento.clientName)
            .replace('{{servico}}', campaign.serviceSuggestion || 'um serviço especial')
            .replace('{{link}}', `${window.location.origin}/app/agendamentos`)
          sendWhatsApp({ to: phone, body: msg })
          sent++
        }
      }

      if (campaign.type === 'birthday') {
        const birthKey = 'infinity_client_birthdays'
        const birthdays: Record<string, string> = JSON.parse(
          safeLocalStorage.getItem(birthKey) || '{}',
        )
        const birthDate = birthdays[phone]
        if (birthDate) {
          const birthDay = new Date(birthDate)
          if (today.getDate() === birthDay.getDate() && today.getMonth() === birthDay.getMonth()) {
            const msg = campaign.messageTemplate
              .replace('{{nome}}', lastAtendimento.clientName)
              .replace('{{link}}', `${window.location.origin}/app/agendamentos`)
            sendWhatsApp({ to: phone, body: msg })
            sent++
          }
        }
      }
    }

    if (sent > 0) {
      incrementCampaignStat(campaign.id, 'sent')
      console.info(`[Campanha] "${campaign.name}" enviada para ${sent} cliente(s)`)
    }
  }
}
