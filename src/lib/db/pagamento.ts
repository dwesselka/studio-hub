import { safeLocalStorage } from '@/lib/storage'
import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
  PixPaymentResponse,
  CardPaymentResponse,
} from '@/features/pagamento/types'

const PAYMENT_KEY = 'infinity_pagamentos'

function load(): Payment[] {
  const raw = safeLocalStorage.getItem(PAYMENT_KEY)
  return raw ? JSON.parse(raw) : []
}

function save(list: Payment[]): void {
  safeLocalStorage.setItem(PAYMENT_KEY, JSON.stringify(list))
}

function generateId(): string {
  return crypto.randomUUID()
}

function generateReceiptNumber(): string {
  const n = String(Date.now()).slice(-8)
  return `REC-${n}`
}

const PIX_FEE_PERCENT = 0.99
const CARD_FEE_PERCENT = 3.99

export function getPayments(): Payment[] {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getPaymentByAtendimento(atendimentoId: string): Payment | undefined {
  return load().find((p) => p.atendimentoId === atendimentoId)
}

export function getPaymentsByDate(date: string): Payment[] {
  return load().filter((p) => p.date === date)
}

export function getPendingPayments(): Payment[] {
  return load().filter((p) => p.status === 'pending')
}

function getFeePercent(method: PaymentMethod): number {
  switch (method) {
    case 'pix': return PIX_FEE_PERCENT
    case 'credit': return CARD_FEE_PERCENT
    case 'debit': return 2.49
    case 'cash': return 0
  }
}

export function simulatePixPayment(totalValue: number): PixPaymentResponse {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let tx = ''
  for (let i = 0; i < 32; i++) tx += chars[Math.floor(Math.random() * chars.length)]

  return {
    success: true,
    qrCode: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="white"/>
        <g fill="black" font-family="monospace" font-size="10">
          ${Array.from({ length: 20 }, (_, y) =>
            Array.from({ length: 20 }, (_, x) =>
              Math.random() > 0.5
                ? `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="black"/>`
                : '',
            ).join(''),
          ).join('')}
        </g>
      </svg>`,
    )}`,
    copyPaste: `00020126580014BR.GOV.BCB.PIX0136${tx}@pix.infinity.com.br5204000053039865406${totalValue.toFixed(2).replace('.', '')}5802BR5925Infinity Partner${generateId().slice(0, 10)}`,
    transactionId: tx,
    expiresAt: new Date(Date.now() + 300_000).toISOString(),
  }
}

export function simulateCardPayment(_totalValue: number): CardPaymentResponse {
  const chars = '0123456789ABCDEF'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]

  return {
    success: true,
    transactionId: generateId(),
    authorizationCode: code,
    fee: CARD_FEE_PERCENT,
  }
}

export function createPayment(
  atendimentoId: string,
  clientName: string,
  clientPhone: string,
  professionalName: string,
  serviceNames: string[],
  date: string,
  totalValue: number,
  method: PaymentMethod,
  status: PaymentStatus = 'pending',
  pixQrCode?: string,
  pixCopyPaste?: string,
): Payment {
  const list = load()
  const feePercent = getFeePercent(method)
  const feeValue = Math.round(totalValue * (feePercent / 100))
  const netValue = totalValue - feeValue
  const paidValue = status === 'paid' ? totalValue : 0

  const payment: Payment = {
    id: generateId(),
    atendimentoId,
    clientName,
    clientPhone,
    professionalName,
    serviceNames,
    date,
    totalValue,
    method,
    status,
    paidValue,
    feeValue,
    netValue,
    pixQrCode,
    pixCopyPaste,
    receiptNumber: status === 'paid' ? generateReceiptNumber() : undefined,
    paidAt: status === 'paid' ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
  }

  list.push(payment)
  save(list)
  return payment
}

export function confirmPayment(id: string): Payment | null {
  const list = load()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null

  const feePercent = getFeePercent(list[idx].method)
  list[idx] = {
    ...list[idx],
    status: 'paid',
    paidValue: list[idx].totalValue,
    feeValue: Math.round(list[idx].totalValue * (feePercent / 100)),
    netValue: list[idx].totalValue - Math.round(list[idx].totalValue * (feePercent / 100)),
    receiptNumber: generateReceiptNumber(),
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  save(list)
  return list[idx]
}

export function refundPayment(id: string): Payment | null {
  const list = load()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null

  list[idx] = {
    ...list[idx],
    status: 'refunded',
    paidValue: 0,
    updatedAt: new Date().toISOString(),
  }

  save(list)
  return list[idx]
}

export function getDailySummary(date: string): {
  totalRevenue: number
  totalNetRevenue: number
  totalFees: number
  paidCount: number
  pendingCount: number
  refundedCount: number
  averageTicket: number
  byMethod: Record<string, number>
} {
  const payments = load().filter((p) => p.date === date)
  const paid = payments.filter((p) => p.status === 'paid')
  const totalRevenue = paid.reduce((s, p) => s + p.paidValue, 0)
  const totalFees = paid.reduce((s, p) => s + p.feeValue, 0)
  const paidCount = paid.length
  const pendingCount = payments.filter((p) => p.status === 'pending').length
  const refundedCount = payments.filter((p) => p.status === 'refunded').length
  const averageTicket = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0

  const byMethod: Record<string, number> = {}
  for (const p of paid) {
    byMethod[p.method] = (byMethod[p.method] ?? 0) + p.paidValue
  }

  return {
    totalRevenue,
    totalNetRevenue: totalRevenue - totalFees,
    totalFees,
    paidCount,
    pendingCount,
    refundedCount,
    averageTicket,
    byMethod,
  }
}

export function getRevenueByProfessional(date?: string): { name: string; total: number }[] {
  const all = date ? load().filter((p) => p.date === date && p.status === 'paid') : load().filter((p) => p.status === 'paid')
  const map = new Map<string, number>()
  for (const p of all) {
    map.set(p.professionalName, (map.get(p.professionalName) ?? 0) + p.paidValue)
  }
  return [...map.entries()].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total)
}

export function getRevenueByService(date?: string): { name: string; total: number }[] {
  const all = date ? load().filter((p) => p.date === date && p.status === 'paid') : load().filter((p) => p.status === 'paid')
  const map = new Map<string, number>()
  for (const p of all) {
    for (const s of p.serviceNames) {
      const perService = Math.round(p.paidValue / p.serviceNames.length)
      map.set(s, (map.get(s) ?? 0) + perService)
    }
  }
  return [...map.entries()].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total)
}

export function getPaymentReceiptHtml(payment: Payment): string {
  const date = new Date(payment.paidAt ?? payment.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Recibo - ${payment.receiptNumber}</title>
<style>
  body { font-family: 'Courier New', monospace; font-size: 14px; color: #000; margin: 40px; }
  .header { text-align: center; margin-bottom: 30px; }
  .header h1 { font-size: 20px; margin: 0; }
  .header p { font-size: 12px; color: #666; margin: 4px 0; }
  .divider { border-top: 1px dashed #999; margin: 16px 0; }
  .row { display: flex; justify-content: space-between; margin: 4px 0; }
  .label { color: #666; }
  .total { font-size: 18px; font-weight: bold; margin-top: 12px; }
  .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #999; }
</style></head>
<body>
  <div class="header">
    <h1>Infinity Partner</h1>
    <p>Recibo de Pagamento</p>
    <p>Nº ${payment.receiptNumber}</p>
  </div>
  <div class="divider"></div>
  <div class="row"><span class="label">Cliente</span><span>${payment.clientName}</span></div>
  <div class="row"><span class="label">Profissional</span><span>${payment.professionalName}</span></div>
  <div class="row"><span class="label">Serviço(s)</span><span>${payment.serviceNames.join(', ')}</span></div>
  <div class="row"><span class="label">Forma de pagamento</span><span>${payment.method === 'pix' ? 'Pix' : payment.method === 'credit' ? 'Cartão de Crédito' : payment.method === 'debit' ? 'Cartão de Débito' : 'Dinheiro'}</span></div>
  <div class="row"><span class="label">Data</span><span>${date}</span></div>
  <div class="divider"></div>
  <div class="row total"><span>Valor</span><span>R$ ${(payment.totalValue / 100).toFixed(2)}</span></div>
  <div class="row"><span class="label">Taxa</span><span>R$ ${(payment.feeValue / 100).toFixed(2)}</span></div>
  <div class="row"><span class="label">Líquido</span><span>R$ ${(payment.netValue / 100).toFixed(2)}</span></div>
  <div class="divider"></div>
  <div class="footer">Obrigado pela preferência!</div>
</body></html>`
}
