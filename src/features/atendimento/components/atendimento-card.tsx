import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Scissors, FileText, AlertTriangle } from 'lucide-react'
import { getAtendimentosByClientPhone } from '@/lib/atendimento-db'
import type { Atendimento, AtendimentoStatus } from '@/features/atendimento/types'
import { STATUS_LABELS, STATUS_VARIANTS } from '@/features/atendimento/types'

interface AtendimentoCardProps {
  atendimento: Atendimento
  index: number
  onComplete?: (a: Atendimento) => void
  onCancel?: (a: Atendimento) => void
}

export function AtendimentoCard({
  atendimento,
  index,
  onComplete,
  onCancel,
}: AtendimentoCardProps) {
  const [showHistory, setShowHistory] = useState(false)
  const history = getAtendimentosByClientPhone(atendimento.clientPhone)

  const variant = STATUS_VARIANTS[atendimento.status]

  const statusColors: Record<AtendimentoStatus, string> = {
    'in-progress': 'border-l-warning',
    completed: 'border-l-success',
    cancelled: 'border-l-destructive',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-lg border border-border bg-card shadow-sm border-l-4 ${statusColors[atendimento.status]}`}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate">
                {atendimento.clientName}
              </span>
              <span
                className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                  variant === 'success'
                    ? 'bg-success/10 text-success'
                    : variant === 'warning'
                      ? 'bg-warning/10 text-warning-foreground'
                      : 'bg-destructive/10 text-destructive'
                }`}
              >
                {STATUS_LABELS[atendimento.status]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {atendimento.startTime} — {atendimento.endTime}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {atendimento.professionalName}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {atendimento.services.map((s) => (
            <span
              key={s.serviceId}
              className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary"
            >
              <Scissors className="h-3 w-3" />
              {s.serviceName}
            </span>
          ))}
        </div>

        {atendimento.notes && (
          <div className="flex items-start gap-1.5 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{atendimento.notes}</span>
          </div>
        )}

        {atendimento.supplies.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-warning" />
            <span>
              Insumos: {atendimento.supplies.map((s) => `${s.consumableName} (${s.quantity}${s.unit})`).join(', ')}
            </span>
          </div>
        )}

        {atendimento.status === 'completed' && (
          <div className="text-sm font-semibold text-foreground">
            Total: R$ {(atendimento.totalValue / 100).toFixed(2)}
          </div>
        )}

        {atendimento.status === 'in-progress' && (
          <div className="flex gap-2 mt-2">
            {onComplete && (
              <button
                onClick={() => onComplete(atendimento)}
                className="flex-1 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-success-foreground hover:opacity-90 transition-opacity"
              >
                Concluir
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(atendimento)}
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {atendimento.status === 'completed' && history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-primary hover:underline mt-1"
          >
            {showHistory ? 'Ocultar histórico' : `Ver histórico (${history.length})`}
          </button>
        )}

        {showHistory && history.length > 0 && (
          <div className="space-y-1.5 mt-2 border-t border-border pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Histórico de {atendimento.clientName}
            </p>
            {history.slice(0, 5).map((h) => (
              <div key={h.id} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {new Date(h.date + 'T12:00:00').toLocaleDateString('pt-BR')} — {h.services.map((s) => s.serviceName).join(', ')}
                </span>
                <span className="font-medium">R$ {(h.totalValue / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
