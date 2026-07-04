export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash'
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'partially-paid'

export interface Payment {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  professionalName: string
  serviceNames: string[]
  date: string
  totalValue: number
  method: PaymentMethod
  status: PaymentStatus
  paidValue: number
  feeValue: number
  netValue: number
  pixQrCode?: string
  pixCopyPaste?: string
  receiptNumber?: string
  paidAt?: string
  createdAt: string
  updatedAt?: string
}

export interface PixPaymentResponse {
  success: boolean
  qrCode: string
  copyPaste: string
  transactionId: string
  expiresAt: string
}

export interface CardPaymentResponse {
  success: boolean
  transactionId: string
  authorizationCode: string
  fee: number
}

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  cash: 'Dinheiro',
}

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  refunded: 'Estornado',
  'partially-paid': 'Pago Parcial',
}

export const STATUS_VARIANTS: Record<PaymentStatus, string> = {
  paid: 'success',
  pending: 'warning',
  refunded: 'destructive',
  'partially-paid': 'info',
}
