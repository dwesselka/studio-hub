import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import {
  useRescheduleAppointment,
  useCancelAppointment,
} from '@/features/agenda/hooks/use-agenda-data'
import { hasConflict } from '@/lib/agenda-db'
import { addDays, getDateString, formatDateFull } from '@/features/agenda/types'
import type { Appointment } from '@/features/agenda/types'

const DEFAULT_HOURS = [
  { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
  { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
]

interface RescheduleDialogProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  businessHours?: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]
}

export function RescheduleDialog({
  appointment,
  isOpen,
  onClose,
  businessHours = DEFAULT_HOURS,
}: RescheduleDialogProps) {
  const reschedule = useRescheduleAppointment()
  const cancel = useCancelAppointment()

  const [selectedDate, setSelectedDate] = useState(getDateString())
  const [selectedTime, setSelectedTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'reschedule' | 'cancel'>('reschedule')

  const dayOfWeek = useMemo(() => {
    const d = new Date(selectedDate + 'T12:00:00')
    return d.getDay()
  }, [selectedDate])

  const hours = businessHours.find((h) => h.dayOfWeek === dayOfWeek)
  const isDayOpen = hours?.isOpen ?? false

  const timeSlots = useMemo(() => {
    if (!hours || !hours.isOpen) return []
    const [openH, openM] = hours.openTime.split(':').map(Number)
    const [closeH, closeM] = hours.closeTime.split(':').map(Number)
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM
    const duration = appointment?.serviceDuration ?? 60
    const slots: string[] = []

    for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
      const h = Math.floor(m / 60)
      const min = m % 60
      const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      slots.push(time)
    }
    return slots
  }, [hours, appointment?.serviceDuration])

  const handleDateChange = (offset: number) => {
    setSelectedDate((d) => addDays(d, offset))
    setSelectedTime('')
    setError(null)
  }

  const handleConfirmReschedule = async () => {
    if (!appointment) return
    setError(null)

    if (!selectedTime) {
      setError('Selecione um horário')
      return
    }

    if (!isDayOpen) {
      setError('O estabelecimento não abre neste dia')
      return
    }

    const [h, m] = selectedTime.split(':').map(Number)
    const totalMinutes = h * 60 + m + (appointment.serviceDuration || 60)
    const endH = Math.floor(totalMinutes / 60)
    const endM = totalMinutes % 60
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

    if (
      hasConflict(appointment.professionalId, selectedDate, selectedTime, endTime, appointment.id)
    ) {
      setError('Conflito de horário com outro agendamento')
      return
    }

    try {
      await reschedule.mutateAsync({
        id: appointment.id,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
      })
      onClose()
    } catch {
      setError('Erro ao reagendar. Tente novamente.')
    }
  }

  const handleCancelAppointment = async () => {
    if (!appointment) return
    setError(null)
    try {
      await cancel.mutateAsync(appointment.id)
      onClose()
    } catch {
      setError('Erro ao cancelar. Tente novamente.')
    }
  }

  if (!isOpen || !appointment) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold text-foreground">
              {mode === 'reschedule' ? 'Reagendar' : 'Cancelar Agendamento'}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-sm font-medium text-foreground">{appointment.clientName}</p>
              <p className="text-xs text-muted-foreground">
                {appointment.serviceName} · {appointment.startTime} — {appointment.endTime} ·{' '}
                {appointment.professionalName}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMode('reschedule')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  mode === 'reschedule'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Reagendar
              </button>
              <button
                onClick={() => setMode('cancel')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  mode === 'cancel'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Cancelar
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'reschedule' && (
              <>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Nova data</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDateChange(-1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                      aria-label="Dia anterior"
                    >
                      ←
                    </button>
                    <span className="flex-1 text-center text-sm font-medium text-foreground">
                      {formatDateFull(selectedDate)}
                    </span>
                    <button
                      onClick={() => handleDateChange(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                      aria-label="Próximo dia"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    Novo horário <span className="text-destructive">*</span>
                  </label>
                  {!isDayOpen ? (
                    <p className="text-sm text-destructive">Fechado neste dia</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
                      {timeSlots.map((time) => {
                        const [h, m] = time.split(':').map(Number)
                        const totalMinutes = h * 60 + m + (appointment.serviceDuration || 60)
                        const endH = Math.floor(totalMinutes / 60)
                        const endM = totalMinutes % 60
                        const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
                        const conflict = hasConflict(
                          appointment.professionalId,
                          selectedDate,
                          time,
                          endTime,
                          appointment.id,
                        )

                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={conflict}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                              selectedTime === time
                                ? 'bg-primary text-primary-foreground'
                                : conflict
                                  ? 'bg-muted text-muted-foreground/40 line-through cursor-not-allowed'
                                  : 'bg-muted text-foreground hover:bg-muted/80'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmReschedule}
                  disabled={reschedule.isPending || !selectedTime || !isDayOpen}
                  className="btn btn--primary btn--lg btn--block w-full justify-center"
                >
                  {reschedule.isPending ? 'Reagendando...' : 'Confirmar Reagendamento'}
                </button>
              </>
            )}

            {mode === 'cancel' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm">
                  <p className="font-medium text-destructive mb-1">Tem certeza?</p>
                  <p className="text-destructive/80">
                    O agendamento de <strong>{appointment.clientName}</strong> para{' '}
                    {appointment.startTime} será cancelado. Esta ação não pode ser desfeita.
                  </p>
                </div>
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancel.isPending}
                  className="btn btn--lg btn--block w-full justify-center"
                  style={{
                    background: 'var(--color-destructive)',
                    color: 'var(--color-destructive-foreground)',
                  }}
                >
                  {cancel.isPending ? 'Cancelando...' : 'Sim, Cancelar Agendamento'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
