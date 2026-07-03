import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { useAuth } from '@/features/auth/use-auth'
import { useCreateAppointment } from '@/features/agenda/hooks/use-agenda-data'
import { hasConflict } from '@/lib/agenda-db'
import type { ServiceItem, TeamMember } from '@/features/onboarding/types'
import type { IARecommendation, AppointmentStatus } from '@/features/agenda/types'

interface NewAppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
}

function generateTimeSlots(
  date: string,
  services: ServiceItem[],
  team: TeamMember[],
  selectedServiceId: string,
  selectedProfessionalId: string,
): IARecommendation[] {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  const defaultHours = [
    { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
    { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
  ]

  const hours = defaultHours.find((h) => h.dayOfWeek === dayOfWeek)
  if (!hours || !hours.isOpen) return []

  const service = services.find((s) => s.id === selectedServiceId)
  if (!service) return []

  const duration = service.duration
  const [openH, openM] = hours.openTime.split(':').map(Number)
  const [closeH, closeM] = hours.closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const pros = selectedProfessionalId ? team.filter((t) => t.id === selectedProfessionalId) : team

  if (pros.length === 0) return []

  const slots: IARecommendation[] = []

  for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
    const startH = Math.floor(m / 60)
    const startM = m % 60
    const endM = m + duration
    const endH = Math.floor(endM / 60)
    const endMin = endM % 60

    const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
    const endTime = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

    for (const pro of pros) {
      if (hasConflict(pro.id, date, startTime, endTime)) continue

      const hour = startH
      const score = hour >= 9 && hour <= 11 ? 95 : hour >= 14 && hour <= 16 ? 85 : 70
      const reason =
        score >= 90
          ? 'Horário de pico — maior procura'
          : score >= 80
            ? 'Horário regular — boa disponibilidade'
            : 'Horário alternativo — menor movimento'

      slots.push({
        time: startTime,
        professionalId: pro.id,
        professionalName: pro.name,
        score,
        reason,
      })
    }
  }

  return slots.sort((a, b) => b.score - a.score).slice(0, 5)
}

export function NewAppointmentDialog({ isOpen, onClose, selectedDate }: NewAppointmentDialogProps) {
  const { user } = useAuth()
  const createAppointment = useCreateAppointment()

  const services = user?.onboardingData?.services ?? []
  const team = user?.onboardingData?.team ?? []

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [professionalId, setProfessionalId] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showIA, setShowIA] = useState(false)

  const selectedService = services.find((s) => s.id === serviceId)

  const iaSuggestions = showIA
    ? generateTimeSlots(selectedDate, services, team, serviceId, professionalId)
    : []

  const reset = () => {
    setClientName('')
    setClientPhone('')
    setServiceId('')
    setProfessionalId('')
    setSelectedTime('')
    setNotes('')
    setError(null)
    setShowIA(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!clientName.trim() || !clientPhone.trim() || !serviceId || !selectedTime) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    const service = services.find((s) => s.id === serviceId)
    const pro = team.find((t) => t.id === professionalId)
    if (!service) return

    const [h, m] = selectedTime.split(':').map(Number)
    const totalMinutes = h * 60 + m + service.duration
    const endH = Math.floor(totalMinutes / 60)
    const endM = totalMinutes % 60
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

    const conflictPro = professionalId || team[0]?.id
    if (conflictPro && hasConflict(conflictPro, selectedDate, selectedTime, endTime)) {
      setError('Este horário já está ocupado. Escolha outro horário.')
      return
    }

    try {
      await createAppointment.mutateAsync({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceId,
        serviceName: service.name,
        serviceDuration: service.duration,
        servicePrice: service.price,
        professionalId: pro?.id ?? '',
        professionalName: pro?.name ?? 'Sem profissional',
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        status: 'confirmed' as AppointmentStatus,
        notes: notes.trim() || undefined,
      })
      reset()
      onClose()
    } catch {
      setError('Erro ao criar agendamento')
    }
  }

  const handleSelectIASlot = (rec: IARecommendation) => {
    setSelectedTime(rec.time)
    if (rec.professionalId) setProfessionalId(rec.professionalId)
    setShowIA(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold text-foreground">Novo Agendamento</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group !mb-0">
                <label className="text-sm font-semibold mb-1 block">
                  Cliente <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="form-group !mb-0">
                <label className="text-sm font-semibold mb-1 block">
                  Telefone <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1 block">
                Serviço <span className="text-destructive">*</span>
              </label>
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value)
                  setSelectedTime('')
                  setShowIA(false)
                }}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — R$ {s.price.toFixed(2)} ({s.duration}min)
                  </option>
                ))}
              </select>
            </div>

            {team.length > 0 && (
              <div>
                <label className="text-sm font-semibold mb-1 block">Profissional</label>
                <select
                  value={professionalId}
                  onChange={(e) => {
                    setProfessionalId(e.target.value)
                    setSelectedTime('')
                    setShowIA(false)
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Qualquer profissional</option>
                  {team.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {serviceId && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold">
                    Horário <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIA(!showIA)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Sugerir horários
                  </button>
                </div>

                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />

                {selectedService && selectedTime && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Término previsto:{' '}
                    {(() => {
                      const [h, m] = selectedTime.split(':').map(Number)
                      const end = h * 60 + m + selectedService.duration
                      const eh = Math.floor(end / 60)
                      const em = end % 60
                      return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
                    })()}
                  </p>
                )}

                {showIA && serviceId && (
                  <div className="mt-2 space-y-1.5">
                    {iaSuggestions.length > 0 ? (
                      iaSuggestions.map((rec) => (
                        <button
                          key={`${rec.time}-${rec.professionalId}`}
                          type="button"
                          onClick={() => handleSelectIASlot(rec)}
                          className="w-full flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-left hover:bg-primary/10 transition-colors"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {rec.score}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground block">
                              {rec.time}
                              {rec.professionalName && ` — ${rec.professionalName}`}
                            </span>
                            <span className="text-xs text-muted-foreground">{rec.reason}</span>
                          </div>
                          <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground px-1">
                        Nenhum horário disponível encontrado para este serviço.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold mb-1 block">Observações</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Alguma observação sobre o agendamento..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={createAppointment.isPending}
              className="btn btn--primary btn--lg btn--block w-full justify-center"
            >
              {createAppointment.isPending ? 'Criando...' : 'Criar Agendamento'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
