import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Payment, PaymentMethod, PaymentStatus } from '@/features/pagamento/types'
import {
  getPayments,
  getPendingPayments,
  getDailySummary,
  getRevenueByProfessional,
  getRevenueByService,
  createPayment,
  confirmPayment,
  refundPayment,
  simulatePixPayment,
  simulateCardPayment,
} from '@/lib/pagamento-db'

function fetchPayments(): Promise<Payment[]> {
  return new Promise((r) => setTimeout(() => r(getPayments()), 150))
}

function fetchPendingPayments(): Promise<Payment[]> {
  return new Promise((r) => setTimeout(() => r(getPendingPayments()), 100))
}

export function usePayments() {
  return useQuery({ queryKey: ['pagamentos'], queryFn: fetchPayments })
}

export function usePendingPayments() {
  return useQuery({ queryKey: ['pagamentos-pendentes'], queryFn: fetchPendingPayments })
}

export function useDailySummary(date: string) {
  return useQuery({
    queryKey: ['pagamentos-resumo', date],
    queryFn: () => new Promise<ReturnType<typeof getDailySummary>>((r) => {
      setTimeout(() => r(getDailySummary(date)), 100)
    }),
  })
}

export function useRevenueByProfessional(date?: string) {
  return useQuery({
    queryKey: ['pagamentos-profissional', date],
    queryFn: () => new Promise<{ name: string; total: number }[]>((r) =>
      setTimeout(() => r(getRevenueByProfessional(date)), 100),
    ),
  })
}

export function useRevenueByService(date?: string) {
  return useQuery({
    queryKey: ['pagamentos-servico', date],
    queryFn: () => new Promise<{ name: string; total: number }[]>((r) =>
      setTimeout(() => r(getRevenueByService(date)), 100),
    ),
  })
}

export function useCreatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      atendimentoId: string
      clientName: string
      clientPhone: string
      professionalName: string
      serviceNames: string[]
      date: string
      totalValue: number
      method: PaymentMethod
    }) => {
      await new Promise((r) => setTimeout(r, 300))

      let pixQrCode: string | undefined
      let pixCopyPaste: string | undefined
      let status: PaymentStatus = 'paid'

      if (data.method === 'pix') {
        const pix = simulatePixPayment(data.totalValue)
        pixQrCode = pix.qrCode
        pixCopyPaste = pix.copyPaste
        status = 'pending'
      } else if (data.method === 'credit' || data.method === 'debit') {
        simulateCardPayment(data.totalValue)
        status = 'paid'
      }

      return createPayment(
        data.atendimentoId,
        data.clientName,
        data.clientPhone,
        data.professionalName,
        data.serviceNames,
        data.date,
        data.totalValue,
        data.method,
        status,
        pixQrCode,
        pixCopyPaste,
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pagamentos'] })
      qc.invalidateQueries({ queryKey: ['pagamentos-pendentes'] })
      qc.invalidateQueries({ queryKey: ['pagamentos-resumo'] })
      qc.invalidateQueries({ queryKey: ['pagamentos-profissional'] })
      qc.invalidateQueries({ queryKey: ['pagamentos-servico'] })
    },
  })
}

export function useConfirmPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return confirmPayment(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pagamentos'] }),
  })
}

export function useRefundPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return refundPayment(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pagamentos'] }),
  })
}
