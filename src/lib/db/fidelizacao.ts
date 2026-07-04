import { safeLocalStorage } from '@/lib/storage'
import { sendWhatsApp } from '@/lib/services/whatsapp'
import type {
  LoyaltyProgram,
  ClientPoints,
  PointsTransaction,
  LoyaltyPromotion,
} from '@/features/fidelizacao/types'
import { DEFAULT_LOYALTY_PROGRAM } from '@/features/fidelizacao/types'

const PROGRAM_KEY = 'infinity_loyalty_program'
const POINTS_KEY = 'infinity_client_points'
const TRANSACTIONS_KEY = 'infinity_points_tx'
const PROMOTIONS_KEY = 'infinity_loyalty_promotions'

function loadProgram(): LoyaltyProgram {
  const raw = safeLocalStorage.getItem(PROGRAM_KEY)
  return raw ? JSON.parse(raw) : DEFAULT_LOYALTY_PROGRAM
}

function saveProgram(p: LoyaltyProgram): void {
  safeLocalStorage.setItem(PROGRAM_KEY, JSON.stringify(p))
}

function loadPointsMap(): Record<string, ClientPoints> {
  const raw = safeLocalStorage.getItem(POINTS_KEY)
  return raw ? JSON.parse(raw) : {}
}

function savePointsMap(map: Record<string, ClientPoints>): void {
  safeLocalStorage.setItem(POINTS_KEY, JSON.stringify(map))
}

function loadTransactions(): PointsTransaction[] {
  const raw = safeLocalStorage.getItem(TRANSACTIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveTransactions(list: PointsTransaction[]): void {
  safeLocalStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list))
}

function loadPromotions(): LoyaltyPromotion[] {
  const raw = safeLocalStorage.getItem(PROMOTIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

function savePromotions(list: LoyaltyPromotion[]): void {
  safeLocalStorage.setItem(PROMOTIONS_KEY, JSON.stringify(list))
}

function generateId(): string {
  return crypto.randomUUID()
}

export function getLoyaltyProgram(): LoyaltyProgram {
  return loadProgram()
}

export function updateLoyaltyProgram(updates: Partial<LoyaltyProgram>): LoyaltyProgram {
  const program = { ...loadProgram(), ...updates }
  saveProgram(program)
  return program
}

export function getClientPoints(clientPhone: string): ClientPoints {
  const map = loadPointsMap()
  return (
    map[clientPhone] ?? {
      clientPhone,
      clientName: '',
      balance: 0,
      lifetime: 0,
      updatedAt: new Date().toISOString(),
    }
  )
}

export function getAllClientsPoints(): ClientPoints[] {
  return Object.values(loadPointsMap()).sort((a, b) => b.balance - a.balance)
}

export function getPointsTransactions(clientPhone?: string): PointsTransaction[] {
  const all = loadTransactions().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return clientPhone ? all.filter((t) => t.clientPhone === clientPhone) : all
}

export function earnPoints(clientPhone: string, clientName: string, totalValue: number): void {
  const program = loadProgram()
  if (!program.enabled) return

  const map = loadPointsMap()

  const earnedFromValue = Math.floor(totalValue / 100) * program.pointsPerCurrency
  const earnedFromVisit = program.pointsPerVisit
  const totalEarned = earnedFromValue + earnedFromVisit

  const current = map[clientPhone] ?? {
    clientPhone,
    clientName,
    balance: 0,
    lifetime: 0,
    updatedAt: new Date().toISOString(),
  }

  current.clientName = clientName
  current.balance += totalEarned
  current.lifetime += totalEarned
  current.updatedAt = new Date().toISOString()
  map[clientPhone] = current
  savePointsMap(map)

  const tx: PointsTransaction = {
    id: generateId(),
    clientPhone,
    clientName,
    type: 'earn',
    amount: totalEarned,
    balanceAfter: current.balance,
    description: `Atendimento: R$ ${(totalValue / 100).toFixed(2)} + visita`,
    createdAt: new Date().toISOString(),
  }
  const txs = loadTransactions()
  txs.push(tx)
  saveTransactions(txs)
}

export function redeemPoints(
  clientPhone: string,
  clientName: string,
  amount: number,
  description: string,
): { success: boolean; newBalance: number } {
  const map = loadPointsMap()
  const current = map[clientPhone]
  if (!current || current.balance < amount) {
    return { success: false, newBalance: current?.balance ?? 0 }
  }

  current.balance -= amount
  current.updatedAt = new Date().toISOString()
  map[clientPhone] = current
  savePointsMap(map)

  const tx: PointsTransaction = {
    id: generateId(),
    clientPhone,
    clientName,
    type: 'redeem',
    amount: -amount,
    balanceAfter: current.balance,
    description,
    createdAt: new Date().toISOString(),
  }
  const txs = loadTransactions()
  txs.push(tx)
  saveTransactions(txs)

  return { success: true, newBalance: current.balance }
}

export function getPromotions(): LoyaltyPromotion[] {
  return loadPromotions().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createPromotion(
  data: Omit<LoyaltyPromotion, 'id' | 'createdAt' | 'stats'>,
): LoyaltyPromotion {
  const list = loadPromotions()
  const promo: LoyaltyPromotion = {
    ...data,
    id: generateId(),
    stats: { sent: 0, redeemed: 0 },
    createdAt: new Date().toISOString(),
  }
  list.push(promo)
  savePromotions(list)
  return promo
}

export function updatePromotion(
  id: string,
  updates: Partial<LoyaltyPromotion>,
): LoyaltyPromotion | null {
  const list = loadPromotions()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...updates, id }
  savePromotions(list)
  return list[idx]
}

export function togglePromotion(id: string): LoyaltyPromotion | null {
  const list = loadPromotions()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  list[idx].status = list[idx].status === 'active' ? 'paused' : 'active'
  savePromotions(list)
  return list[idx]
}

export function seedPromotions(): void {
  const existing = loadPromotions()
  if (existing.length > 0) return

  const defaults: Omit<LoyaltyPromotion, 'id' | 'createdAt' | 'stats'>[] = [
    {
      name: 'Desconto para clientes inativos',
      segment: 'inactive',
      discountPercent: 20,
      requiredPoints: 0,
      expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
      status: 'active',
    },
    {
      name: 'Brinde de aniversário',
      segment: 'all',
      discountPercent: 0,
      requiredPoints: 100,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      status: 'active',
    },
    {
      name: 'Desconto fidelidade (alto valor)',
      segment: 'high-value',
      discountPercent: 15,
      requiredPoints: 0,
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      status: 'active',
    },
  ]

  for (const d of defaults) {
    createPromotion(d)
  }
}

export function sendPromotionNotification(
  clientPhone: string,
  clientName: string,
  promotion: LoyaltyPromotion,
): void {
  const body = [
    `🎉 *${promotion.name}*`,
    ``,
    `Olá ${clientName}!`,
    `Você tem uma oferta especial esperando por você:`,
    ``,
    promotion.discountPercent > 0
      ? `💰 ${promotion.discountPercent}% de desconto`
      : `⭐ Resgate com ${promotion.requiredPoints} pontos`,
    promotion.serviceName ? `💇 Serviço: ${promotion.serviceName}` : '',
    ``,
    `Aproveite! 👉 ${window.location.origin}/app/agendamentos`,
  ]
    .filter(Boolean)
    .join('\n')

  sendWhatsApp({ to: clientPhone, body }).then(() => {
    incrementPromotionStat(promotion.id, 'sent')
    console.info(`[Fidelização] Notificação de promoção enviada para ${clientName}`)
  })
}

function incrementPromotionStat(id: string, stat: 'sent' | 'redeemed'): void {
  const list = loadPromotions()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return
  list[idx] = {
    ...list[idx],
    stats: { ...list[idx].stats, [stat]: list[idx].stats[stat] + 1 },
  }
  savePromotions(list)
}

export function redeemPromotion(promotionId: string, clientPhone: string): boolean {
  const list = loadPromotions()
  const idx = list.findIndex((p) => p.id === promotionId)
  if (idx === -1) return false
  const promo = list[idx]
  if (promo.status !== 'active') return false

  if (promo.requiredPoints > 0) {
    const client = getClientPoints(clientPhone)
    if (client.balance < promo.requiredPoints) return false

    redeemPoints(clientPhone, client.clientName, promo.requiredPoints, `Resgate: ${promo.name}`)
  }

  list[idx] = {
    ...promo,
    stats: { ...promo.stats, redeemed: promo.stats.redeemed + 1 },
  }
  savePromotions(list)
  return true
}
