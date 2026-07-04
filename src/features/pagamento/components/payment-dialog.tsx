import { useState } from 'react'
import { X, QrCode, CreditCard, DollarSign, Copy, CheckCircle, Printer } from 'lucide-react'
import type { PaymentMethod } from '@/features/pagamento/types'
import { METHOD_LABELS } from '@/features/pagamento/types'
import { useCreatePayment } from '@/features/pagamento/hooks/use-pagamento-data'
import { getPaymentReceiptHtml } from '@/lib/pagamento-db'

interface PaymentDialogProps {
  atendimentoId: string
  clientName: string
  clientPhone: string
  professionalName: string
  serviceNames: string[]
  date: string
  totalValue: number
  isOpen: boolean
  onClose: () => void
}

const METHODS: PaymentMethod[] = ['pix', 'credit', 'debit', 'cash']

export function PaymentDialog({
  atendimentoId,
  clientName,
  clientPhone,
  professionalName,
  serviceNames,
  date,
  totalValue,
  isOpen,
  onClose,
}: PaymentDialogProps) {
  const createMut = useCreatePayment()
  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [paymentResult, setPaymentResult] = useState<{
    pixQrCode?: string
    pixCopyPaste?: string
    receiptNumber?: string
    paymentId?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handlePay() {
    setError(null)
    try {
      const p = await createMut.mutateAsync({
        atendimentoId,
        clientName,
        clientPhone,
        professionalName,
        serviceNames,
        date,
        totalValue,
        method,
      })
      setPaymentResult({
        pixQrCode: p.pixQrCode,
        pixCopyPaste: p.pixCopyPaste,
        receiptNumber: p.receiptNumber,
        paymentId: p.id,
      })
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.')
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrintReceipt() {
    if (!paymentResult?.receiptNumber && !paymentResult?.paymentId) return
    const payments = JSON.parse(localStorage.getItem('infinity_pagamentos') || '[]')
    interface PaymentRecord {
      id: string
      receiptNumber: string
      [key: string]: unknown
    }
    const payment = (payments as PaymentRecord[]).find(
      (p) => p.id === paymentResult?.paymentId || p.receiptNumber === paymentResult?.receiptNumber,
    )
    if (!payment) return
    const html = getPaymentReceiptHtml(payment)
    const w = window.open('', '_blank')
    w?.document.write(html)
    w?.document.close()
    w?.print()
  }

  const isPending = createMut.isPending

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Cobrança</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{clientName}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {paymentResult ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="h-12 w-12 text-success" />
              <p className="text-sm font-semibold text-foreground">Pagamento Registrado</p>
            </div>

            {paymentResult.pixQrCode && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={paymentResult.pixQrCode}
                  alt="QR Code Pix"
                  className="h-40 w-40 rounded-lg border border-border"
                />
                {paymentResult.pixCopyPaste && (
                  <div className="w-full">
                    <p className="text-[11px] text-muted-foreground mb-1">Copia-e-cola:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 text-[10px] text-foreground">
                        {paymentResult.pixCopyPaste}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentResult.pixCopyPaste!)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-semibold text-foreground">
                  R$ {(totalValue / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forma</span>
                <span className="font-medium text-foreground">{METHOD_LABELS[method]}</span>
              </div>
              {paymentResult.receiptNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recibo</span>
                  <span className="font-medium text-foreground">{paymentResult.receiptNumber}</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePrintReceipt}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Printer className="h-4 w-4" />
              Imprimir Recibo
            </button>

            <button
              onClick={onClose}
              className="btn btn--primary btn--lg btn--block w-full justify-center"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-muted/50 p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor total</span>
              <span className="text-xl font-bold text-foreground">
                R$ {(totalValue / 100).toFixed(2)}
              </span>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Forma de pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-colors ${
                      method === m
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                    }`}
                  >
                    {m === 'pix' ? (
                      <QrCode className="h-4 w-4" />
                    ) : m === 'credit' || m === 'debit' ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                    {METHOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {method === 'pix' && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
                O QR Code será gerado na confirmação. O pagamento ficará como pendente até a
                confirmação.
              </div>
            )}

            {(method === 'credit' || method === 'debit') && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
                Taxa de {method === 'credit' ? '3,99%' : '2,49%'} aplicada sobre o valor total.
                Simulação de pagamento via gateway.
              </div>
            )}

            {method === 'cash' && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
                Registro manual de pagamento em dinheiro. Nenhuma taxa é aplicada.
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={isPending}
              className="btn btn--primary btn--lg btn--block w-full justify-center"
            >
              {isPending
                ? 'Processando...'
                : method === 'pix'
                  ? 'Gerar QR Code Pix'
                  : method === 'cash'
                    ? 'Registrar Pagamento'
                    : `Pagar ${method === 'credit' ? 'no Crédito' : 'no Débito'}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
