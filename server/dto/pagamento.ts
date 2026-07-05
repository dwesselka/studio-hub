export interface PaymentResponse {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  professionalName: string
  serviceNames: string[]
  date: string
  totalValue: number
  method: string
  status: string
  paidValue: number
  feeValue: number
  netValue: number
  pixQrCode: string | null
  pixCopyPaste: string | null
  receiptNumber: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string | null
}

export function toPaymentResponse(payment: {
  id: string
  atendimentoId: string
  clientName: string
  clientPhone: string
  professionalName: string
  serviceNames: string[]
  date: string
  totalValue: number
  method: string
  status: string
  paidValue: number
  feeValue: number
  netValue: number
  pixQrCode: string | null
  pixCopyPaste: string | null
  receiptNumber: string | null
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}): PaymentResponse {
  return {
    id: payment.id,
    atendimentoId: payment.atendimentoId,
    clientName: payment.clientName,
    clientPhone: payment.clientPhone,
    professionalName: payment.professionalName,
    serviceNames: payment.serviceNames,
    date: payment.date,
    totalValue: payment.totalValue,
    method: payment.method,
    status: payment.status,
    paidValue: payment.paidValue,
    feeValue: payment.feeValue,
    netValue: payment.netValue,
    pixQrCode: payment.pixQrCode,
    pixCopyPaste: payment.pixCopyPaste,
    receiptNumber: payment.receiptNumber,
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt?.toISOString() ?? null,
  }
}
