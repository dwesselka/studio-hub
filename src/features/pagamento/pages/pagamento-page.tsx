import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  QrCode,
  CreditCard,
  Printer,
  RotateCcw,
  Search,
  AlertCircle,
} from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import {
  usePayments,
  useConfirmPayment,
  useRefundPayment,
  useDailySummary,
  useRevenueByProfessional,
  useRevenueByService,
} from '@/features/pagamento/hooks/use-pagamento-data'
import { getPaymentReceiptHtml } from '@/lib/pagamento-db'
import { getDateString, formatDate } from '@/features/agenda/types'
import type { Payment } from '@/features/pagamento/types'
import { METHOD_LABELS, STATUS_LABELS } from '@/features/pagamento/types'

export function PagamentoPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const [currentDate, setCurrentDate] = useState(getDateString())
  const [search, setSearch] = useState('')
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null)

  const { data: payments = [], refetch: refetchPayments } = usePayments()
  const { data: summary, refetch: refetchSummary } = useDailySummary(currentDate)
  const { data: revenueByPro = [], refetch: refetchPro } = useRevenueByProfessional(currentDate)
  const { data: revenueBySvc = [], refetch: refetchSvc } = useRevenueByService(currentDate)
  const confirmMut = useConfirmPayment()
  const refundMut = useRefundPayment()

  const filteredPayments = (payments as unknown as Payment[]).filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      if (!p.clientName.toLowerCase().includes(q) && !p.receiptNumber?.toLowerCase().includes(q))
        return false
    }
    return true
  })

  const isError = false
  const refetch = () => {
    refetchPayments()
    refetchSummary()
    refetchPro()
    refetchSvc()
  }

  async function handleConfirm(id: string) {
    await confirmMut.mutateAsync(id)
    refetch()
  }

  async function handleRefund(id: string) {
    await refundMut.mutateAsync(id)
    refetch()
  }

  function handlePrintReceipt(p: Payment) {
    const html = getPaymentReceiptHtml(p)
    const w = window.open('', '_blank')
    w?.document.write(html)
    w?.document.close()
    w?.print()
  }

  if (!online) return <OfflineState />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pagamentos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Receba e gerencie pagamentos dos atendimentos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            setCurrentDate((d) => {
              const dt = new Date(d + 'T12:00:00')
              dt.setDate(dt.getDate() - 1)
              return dt.toISOString().split('T')[0]
            })
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          ←
        </button>
        <span className="text-sm font-medium text-foreground min-w-[180px] text-center">
          {formatDate(currentDate)}
        </span>
        <button
          onClick={() =>
            setCurrentDate((d) => {
              const dt = new Date(d + 'T12:00:00')
              dt.setDate(dt.getDate() + 1)
              return dt.toISOString().split('T')[0]
            })
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          →
        </button>
        {currentDate !== getDateString() && (
          <button
            onClick={() => setCurrentDate(getDateString())}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            Hoje
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard
          icon={DollarSign}
          label="Receita bruta"
          value={`R$ ${((summary?.totalRevenue ?? 0) / 100).toFixed(2)}`}
          color="success"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Receita líquida"
          value={`R$ ${((summary?.totalNetRevenue ?? 0) / 100).toFixed(2)}`}
          color="primary"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Ticket médio"
          value={`R$ ${((summary?.averageTicket ?? 0) / 100).toFixed(2)}`}
          color="info"
        />
        <SummaryCard
          icon={AlertCircle}
          label="Pendentes"
          value={String(summary?.pendingCount ?? 0)}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              Transações
            </h3>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por cliente ou recibo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <DollarSign className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Nenhum pagamento</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete um atendimento para registrar um pagamento.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredPayments.map((p) => (
                  <PaymentRow
                    key={p.id}
                    payment={p}
                    expanded={expandedPayment === p.id}
                    onToggle={() => setExpandedPayment(expandedPayment === p.id ? null : p.id)}
                    onConfirm={() => handleConfirm(p.id)}
                    onRefund={() => handleRefund(p.id)}
                    onPrint={() => handlePrintReceipt(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Receita por Profissional
            </h3>
            {(revenueByPro as { name: string; total: number }[]).length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">Sem dados</div>
            ) : (
              <div className="space-y-2">
                {(revenueByPro as { name: string; total: number }[]).map((r) => {
                  const data = revenueByPro as { name: string; total: number }[]
                  const max = Math.max(...data.map((x) => x.total), 1)
                  return (
                    <div key={r.name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-foreground truncate">{r.name}</span>
                        <span className="text-muted-foreground font-medium">
                          R$ {(r.total / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 rounded bg-muted overflow-hidden">
                        <div
                          className="h-full rounded bg-primary/70 transition-all"
                          style={{ width: `${Math.round((r.total / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Receita por Serviço
            </h3>
            {(revenueBySvc as { name: string; total: number }[]).length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">Sem dados</div>
            ) : (
              <div className="space-y-2">
                {(revenueBySvc as { name: string; total: number }[]).map((r) => {
                  const data = revenueBySvc as { name: string; total: number }[]
                  const max = Math.max(...data.map((x) => x.total), 1)
                  return (
                    <div key={r.name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-foreground truncate">{r.name}</span>
                        <span className="text-muted-foreground font-medium">
                          R$ {(r.total / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 rounded bg-muted overflow-hidden">
                        <div
                          className="h-full rounded bg-success/70 transition-all"
                          style={{ width: `${Math.round((r.total / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  const colors: Record<string, string> = {
    success: 'bg-success/10 text-success',
    primary: 'bg-primary/10 text-primary',
    info: 'bg-sky-500/10 text-sky-500',
    warning: 'bg-warning/10 text-warning-foreground',
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{value}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

function PaymentRow({
  payment,
  expanded,
  onToggle,
  onConfirm,
  onRefund,
  onPrint,
}: {
  payment: Payment
  expanded: boolean
  onToggle: () => void
  onConfirm: () => void
  onRefund: () => void
  onPrint: () => void
}) {
  const statusColor =
    payment.status === 'paid'
      ? 'text-success'
      : payment.status === 'pending'
        ? 'text-warning'
        : 'text-destructive'

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          {payment.method === 'pix' ? (
            <QrCode className="h-4 w-4" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground block truncate">
            {payment.clientName}
          </span>
          <span className="text-xs text-muted-foreground">
            {METHOD_LABELS[payment.method]} · {payment.date}
            {payment.receiptNumber && ` · ${payment.receiptNumber}`}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold text-foreground block">
            R$ {(payment.totalValue / 100).toFixed(2)}
          </span>
          <span className={`text-[10px] font-medium ${statusColor}`}>
            {STATUS_LABELS[payment.status]}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-3 py-3 space-y-3 bg-muted/20">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Cliente: </span>
              <span className="text-foreground">{payment.clientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Profissional: </span>
              <span className="text-foreground">{payment.professionalName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Serviço(s): </span>
              <span className="text-foreground">{payment.serviceNames.join(', ')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Recibo: </span>
              <span className="text-foreground">{payment.receiptNumber ?? '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Valor bruto: </span>
              <span className="text-foreground">R$ {(payment.totalValue / 100).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Taxa: </span>
              <span className="text-foreground">R$ {(payment.feeValue / 100).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Valor líquido: </span>
              <span className="text-foreground font-semibold">
                R$ {(payment.netValue / 100).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Data: </span>
              <span className="text-foreground">
                {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {payment.method === 'pix' && payment.status === 'pending' && (
            <button
              onClick={onConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-success px-3 py-2 text-xs font-medium text-success-foreground hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Confirmar Pagamento Pix
            </button>
          )}

          {payment.status === 'paid' && (
            <div className="flex gap-2">
              <button
                onClick={onPrint}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                Recibo
              </button>
              <button
                onClick={onRefund}
                className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Estornar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
