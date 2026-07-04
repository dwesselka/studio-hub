import { useState, useMemo } from 'react'
import { X, Plus, Trash2, AlertCircle, CheckCircle, DollarSign } from 'lucide-react'
import type { Appointment } from '@/features/agenda/types'
import type { ServicePerformed, ConsumedSupply, Atendimento } from '@/features/atendimento/types'
import { useConsumables, useCreateAtendimento, useCompleteAtendimento, useCancelAtendimento } from '@/features/atendimento/hooks/use-atendimento-data'
import { scheduleFeedbackRequest } from '@/lib/pos-atendimento-db'
import { PaymentDialog } from '@/features/pagamento/components/payment-dialog'

interface AtendimentoFlowProps {
  appointment: Appointment
  onClose: () => void
  onSuccess: () => void
  existingAtendimento?: Atendimento | null
}

type FlowStep = 'services' | 'supplies' | 'notes' | 'review'

const STEP_LABELS: Record<FlowStep, string> = {
  services: 'Serviços',
  supplies: 'Insumos',
  notes: 'Observações',
  review: 'Revisão',
}

export function AtendimentoFlow({
  appointment,
  onClose,
  onSuccess,
  existingAtendimento,
}: AtendimentoFlowProps) {
  const { data: consumables = [] } = useConsumables()
  const createMut = useCreateAtendimento()
  const completeMut = useCompleteAtendimento()
  const cancelMut = useCancelAtendimento()

  const [step, setStep] = useState<FlowStep>('services')
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<Atendimento | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const [selectedServices, setSelectedServices] = useState<ServicePerformed[]>([
    {
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      duration: appointment.serviceDuration,
      price: appointment.servicePrice,
    },
  ])

  const [supplies, setSupplies] = useState<ConsumedSupply[]>([])
  const [notes, setNotes] = useState('')

  const lowStock = useMemo(() => {
    return consumables.filter((c) => c.currentStock <= c.minStock)
  }, [consumables])

  const totalValue = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices],
  )

  function addSupply(consumableId: string) {
    const c = consumables.find((x) => x.id === consumableId)
    if (!c) return
    if (supplies.some((s) => s.consumableId === consumableId)) return

    const qty = c.unit === 'un' ? 1 : 20
    setSupplies((prev) => [
      ...prev,
      { consumableId: c.id, consumableName: c.name, quantity: qty, unit: c.unit },
    ])
  }

  function removeSupply(consumableId: string) {
    setSupplies((prev) => prev.filter((s) => s.consumableId !== consumableId))
  }

  function updateSupplyQty(consumableId: string, qty: number) {
    setSupplies((prev) =>
      prev.map((s) => (s.consumableId === consumableId ? { ...s, quantity: Math.max(1, qty) } : s)),
    )
  }

  async function handleFinish() {
    setError(null)

    if (selectedServices.length === 0) {
      setError('Selecione ao menos um serviço')
      return
    }

    const existing = existingAtendimento

    if (existing) {
      await completeMut.mutateAsync({
        id: existing.id,
        supplies,
      })
      scheduleFeedbackRequest(existing.id, existing.clientName, existing.clientPhone)
      setSummary(existing)
      onSuccess()
      return
    }

    const created = await createMut.mutateAsync({
      appointmentId: appointment.id,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      professionalId: appointment.professionalId,
      professionalName: appointment.professionalName,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      services: selectedServices,
      supplies: [],
      notes,
      status: 'in-progress',
      totalValue,
    })

    await completeMut.mutateAsync({
      id: created.id,
      supplies,
    })

    scheduleFeedbackRequest(created.id, created.clientName, created.clientPhone)
    setSummary(created)
    onSuccess()
  }

  async function handleCancel() {
    setError(null)
    if (existingAtendimento) {
      await cancelMut.mutateAsync({
        id: existingAtendimento.id,
      })
    }
    onClose()
  }

  const isPending = createMut.isPending || completeMut.isPending || cancelMut.isPending

  if (summary) {
    return (
      <>
        <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Atendimento Concluído</h3>
          <p className="text-sm text-muted-foreground">
            {appointment.clientName} — {selectedServices.map((s) => s.serviceName).join(', ')}
          </p>
          <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor total</span>
              <span className="font-semibold text-foreground">R$ {(totalValue / 100).toFixed(2)}</span>
            </div>
            {supplies.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Insumos utilizados</span>
                <span className="font-medium text-foreground">{supplies.length} itens</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profissional</span>
              <span className="font-medium text-foreground">{appointment.professionalName}</span>
            </div>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            className="btn btn--primary btn--lg btn--block w-full justify-center gap-2 mt-2"
          >
            <DollarSign className="h-4 w-4" />
            Cobrar Agora
          </button>
          <button onClick={onClose} className="btn btn--secondary btn--lg btn--block w-full justify-center">
            Fechar
          </button>
        </div>

        {showPayment && summary && (
          <PaymentDialog
            atendimentoId={summary.id}
            clientName={summary.clientName}
            clientPhone={summary.clientPhone}
            professionalName={summary.professionalName}
            serviceNames={summary.services.map((s) => s.serviceName)}
            date={summary.date}
            totalValue={summary.totalValue}
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Atendimento</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {appointment.clientName} · {appointment.startTime} — {appointment.endTime}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-0 border-b border-border">
        {(Object.keys(STEP_LABELS) as FlowStep[]).map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            disabled={isPending}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              step === s
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'services' && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Serviços realizados</label>
            <div className="space-y-1.5">
              {[appointment].map((apt) => {
                const isSelected = selectedServices.some((s) => s.serviceId === apt.serviceId)
                return (
                  <label
                    key={apt.serviceId}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setSelectedServices((prev) =>
                            prev.filter((s) => s.serviceId !== apt.serviceId),
                          )
                        } else {
                          setSelectedServices((prev) => [
                            ...prev,
                            {
                              serviceId: apt.serviceId,
                              serviceName: apt.serviceName,
                              duration: apt.serviceDuration,
                              price: apt.servicePrice,
                            },
                          ])
                        }
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">
                        {apt.serviceName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {apt.serviceDuration}min · R$ {(apt.servicePrice / 100).toFixed(2)}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Total: <strong>R$ {(totalValue / 100).toFixed(2)}</strong>
            </p>
          </div>
        )}

        {step === 'supplies' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Insumos utilizados</label>
            </div>

            {lowStock.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 p-3 text-xs text-warning-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{lowStock.length} insumo(s) com estoque baixo</span>
              </div>
            )}

            <div className="max-h-40 overflow-y-auto space-y-1.5">
              {consumables.map((c) => {
                const used = supplies.find((s) => s.consumableId === c.id)
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                      used ? 'border-primary/30 bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-foreground block">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Estoque: {c.currentStock}{c.unit}
                        {c.currentStock <= c.minStock && (
                          <span className="text-destructive ml-1">(baixo)</span>
                        )}
                      </span>
                    </div>
                    {used ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateSupplyQty(c.id, used.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium hover:bg-muted/80"
                          disabled={used.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{used.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateSupplyQty(c.id, used.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium hover:bg-muted/80"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSupply(c.id)}
                          className="flex h-6 w-6 items-center justify-center rounded text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addSupply(c.id)}
                        disabled={c.currentStock <= 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/5 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 'notes' && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações sobre o atendimento, reações do cliente, recomendações..."
              rows={5}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Resumo do Atendimento</h3>

            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cliente</span>
                <span className="font-medium text-foreground">{appointment.clientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profissional</span>
                <span className="font-medium text-foreground">{appointment.professionalName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Horário</span>
                <span className="font-medium text-foreground">
                  {appointment.startTime} — {appointment.endTime}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Serviços</p>
                {selectedServices.map((s) => (
                  <div key={s.serviceId} className="flex justify-between text-sm">
                    <span className="text-foreground">{s.serviceName}</span>
                    <span className="font-medium text-foreground">
                      R$ {(s.price / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {supplies.length > 0 && (
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Insumos</p>
                  {supplies.map((s) => (
                    <div key={s.consumableId} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{s.consumableName}</span>
                      <span className="text-foreground">
                        {s.quantity}{s.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {notes && (
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Observações</p>
                  <p className="text-xs text-muted-foreground">{notes}</p>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">R$ {(totalValue / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {step !== 'services' && (
            <button
              onClick={() => {
                const steps: FlowStep[] = ['services', 'supplies', 'notes', 'review']
                const idx = steps.indexOf(step)
                setStep(steps[idx - 1])
              }}
              disabled={isPending}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              Voltar
            </button>
          )}
          {step !== 'review' ? (
            <button
              onClick={() => {
                if (step === 'services' && selectedServices.length === 0) {
                  setError('Selecione ao menos um serviço')
                  return
                }
                setError(null)
                const steps: FlowStep[] = ['services', 'supplies', 'notes', 'review']
                const idx = steps.indexOf(step)
                setStep(steps[idx + 1])
              }}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Avançar
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isPending}
              className="flex-1 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-success-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {isPending ? 'Finalizando...' : 'Finalizar Atendimento'}
            </button>
          )}
        </div>

        {step !== 'services' && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors pt-1"
          >
            Cancelar atendimento
          </button>
        )}
      </div>
    </div>
  )
}
