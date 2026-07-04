import type { ClientSegment } from '@/features/pos-atendimento/types'

export interface LoyaltyProgram {
  pointsPerCurrency: number
  pointsPerVisit: number
  pointsExpiryDays: number
  enabled: boolean
}

export interface ClientPoints {
  clientPhone: string
  clientName: string
  balance: number
  lifetime: number
  updatedAt: string
}

export interface PointsTransaction {
  id: string
  clientPhone: string
  clientName: string
  type: 'earn' | 'redeem' | 'expire'
  amount: number
  balanceAfter: number
  description: string
  createdAt: string
}

export interface LoyaltyPromotion {
  id: string
  name: string
  segment: ClientSegment
  discountPercent: number
  requiredPoints: number
  serviceId?: string
  serviceName?: string
  expiresAt: string
  status: 'active' | 'paused'
  stats: { sent: number; redeemed: number }
  createdAt: string
}

export const DEFAULT_LOYALTY_PROGRAM: LoyaltyProgram = {
  pointsPerCurrency: 10,
  pointsPerVisit: 50,
  pointsExpiryDays: 180,
  enabled: true,
}
