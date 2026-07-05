export interface LoyaltyProgramResponse {
  pointsPerCurrency: number
  pointsPerVisit: number
  pointsExpiryDays: number
  enabled: boolean
}

export interface ClientPointsResponse {
  clientPhone: string
  clientName: string
  balance: number
  lifetime: number
  updatedAt: string
}

export interface PointsTransactionResponse {
  id: string
  clientPhone: string
  clientName: string
  type: string
  amount: number
  balanceAfter: number
  description: string
  createdAt: string
}

export interface PromotionResponse {
  id: string
  name: string
  segment: string
  discountPercent: number
  requiredPoints: number
  serviceId: string | null
  serviceName: string | null
  expiresAt: string
  status: string
  stats: { sent: number; redeemed: number }
  createdAt: string
}

export function toLoyaltyProgramResponse(program: {
  pointsPerCurrency: number
  pointsPerVisit: number
  pointsExpiryDays: number
  enabled: boolean
}): LoyaltyProgramResponse {
  return {
    pointsPerCurrency: program.pointsPerCurrency,
    pointsPerVisit: program.pointsPerVisit,
    pointsExpiryDays: program.pointsExpiryDays,
    enabled: program.enabled,
  }
}

export function toClientPointsResponse(points: {
  clientPhone: string
  clientName: string
  balance: number
  lifetime: number
  updatedAt: Date
}): ClientPointsResponse {
  return {
    clientPhone: points.clientPhone,
    clientName: points.clientName,
    balance: points.balance,
    lifetime: points.lifetime,
    updatedAt: points.updatedAt.toISOString(),
  }
}

export function toPointsTransactionResponse(tx: {
  id: string
  clientPhone: string
  clientName: string
  type: string
  amount: number
  balanceAfter: number
  description: string
  createdAt: Date
}): PointsTransactionResponse {
  return {
    id: tx.id,
    clientPhone: tx.clientPhone,
    clientName: tx.clientName,
    type: tx.type,
    amount: tx.amount,
    balanceAfter: tx.balanceAfter,
    description: tx.description,
    createdAt: tx.createdAt.toISOString(),
  }
}

export function toPromotionResponse(promo: {
  id: string
  name: string
  segment: string
  discountPercent: number
  requiredPoints: number
  serviceId: string | null
  serviceName: string | null
  expiresAt: string
  status: string
  statsSent: number
  statsRedeemed: number
  createdAt: Date
}): PromotionResponse {
  return {
    id: promo.id,
    name: promo.name,
    segment: promo.segment,
    discountPercent: promo.discountPercent,
    requiredPoints: promo.requiredPoints,
    serviceId: promo.serviceId,
    serviceName: promo.serviceName,
    expiresAt: promo.expiresAt,
    status: promo.status,
    stats: { sent: promo.statsSent, redeemed: promo.statsRedeemed },
    createdAt: promo.createdAt.toISOString(),
  }
}
