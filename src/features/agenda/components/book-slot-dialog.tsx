import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, CreditCard, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { useCreateAppointment } from '@/features/agenda/hooks/use-agenda-data'
import { deductCredit } from '@/features/auth/db'
import { hasConflict } from '@/lib/agenda-db'
import type { ServiceItem } from '@/features/onboarding/types'

interface BookSlotDialogProps {
  isOpen: boolean
  onClose: () => void
  slotTime: string
  slotProfessionalId: string
  slotProfessionalName: string
  selectedDate: string
  onSuccess?: () => void
}

export function BookSlotDialog({
  isOpen,
  onClose,
  slotTime,
  slotProfessionalId,
  slotProfessionalName,
  selectedDate,
  onSuccess,
}: BookSlotDialogProps) {
  const { user, refreshUser } = useAuth()
  const createAppointment = useCreateAppointment()

  const services: ServiceItem[] = user?.onboardingData?.services ?? []
  const [serviceId, setServiceId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'confirm' | 'success' | 'error'>('confirm')

  const selectedService = services.find((s) => s.id === serviceId)
  const totalMinutes = selectedService
    ? (() => {
        const [h, m] = slotTime.split(':').map(Number)
        return h * 60 + m + selectedService.duration
      })()
    : 0
  const endHour = Math.floor(totalMinutes / 60)
  const endMin = totalMinutes % 60
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

  const credits = user?.credits ?? 0

  function reset() {
    setServiceId('')
    setClientName('')
    setClientPhone('')
    setError(null)
    setStep('confirm')
  }

  async function handleConfirm() {
    setError(null)

    if (!serviceId) {
      setError('Selecione um serviço')
      return
    }

    if (!selectedService) return

    if (credits <= 0) {
      setError('Você não tem créditos disponíveis. Adquira mais créditos.')
      return
    }

    if (hasConflict(slotProfessionalId, selectedDate, slotTime, endTime)) {
      setError('Este horário já foi reservado por outro cliente.')
      return
    }

    try {
      const deduction = deductCredit(user!.id)
      if (!deduction.success) {
        setError(deduction.error ?? 'Erro ao processar créditos')
        return
      }

      await createAppointment.mutateAsync({
        clientName: clientName.trim() || user?.name || 'Cliente',
        clientPhone: clientPhone.trim() || '(11) 99999-9999',
        serviceId,
        serviceName: selectedService.name,
        serviceDuration: selectedService.duration,
        servicePrice: selectedService.price,
        professionalId: slotProfessionalId,
        professionalName: slotProfessionalName,
        date: selectedDate,
        startTime: slotTime,
        endTime,
        status: 'confirmed',
      })

      refreshUser()
      setStep('success')
      onSuccess?.()
    } catch {
      setError('Erro ao realizar reserva. Tente novamente.')
      setStep('error')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg"
        >
          {step === 'success' ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <Sparkles className="h-7 w-7 text-success" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">Reserva Confirmada!</h2>
              <p className="text-sm text-muted-foreground mb-1">
                {slotTime} — {selectedService?.name}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                com {slotProfessionalName} | Créditos restantes: <strong>{credits - 1}</strong>
              </p>
              <button
                onClick={() => {
                  reset()
                  onClose()
                }}
                className="btn btn--primary btn--lg"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-lg font-bold text-foreground">Reservar Horário</h2>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{slotTime}</p>
                    <p className="text-xs text-muted-foreground">{slotProfessionalName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Seus créditos: <strong className="text-foreground">{credits}</strong>
                    {credits <= 0 && <span className="text-destructive ml-1">(insuficiente)</span>}
                  </span>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    Seu nome <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={user?.name ?? 'Seu nome'}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    Telefone <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    Serviço <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione um serviço...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration}min) — R$ {s.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <p className="text-xs text-muted-foreground">
                    Término previsto: {endTime} · Duração: {selectedService.duration}min · Valor: R${' '}
                    {selectedService.price.toFixed(2)}
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={createAppointment.isPending || credits <= 0}
                  className="btn btn--primary btn--lg btn--block w-full justify-center"
                >
                  {createAppointment.isPending
                    ? 'Reservando...'
                    : credits <= 0
                      ? 'Sem créditos'
                      : `Confirmar Reserva (1 crédito)`}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
