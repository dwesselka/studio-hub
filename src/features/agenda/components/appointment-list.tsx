import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter, Clock, Sparkles } from 'lucide-react'
import { AppointmentCard } from './appointment-card'
import { BookSlotDialog } from './book-slot-dialog'
import { staggerContainer } from '@/lib/motion'
import type { Appointment, AppointmentStatus } from '@/features/agenda/types'

interface AppointmentListProps {
  appointments: Appointment[]
  isLoading: boolean
  statusFilter: AppointmentStatus | 'all'
  onStatusFilterChange: (status: AppointmentStatus | 'all') => void
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
  onMarkNoShow: (id: string) => void
  onReschedule: (appointment: Appointment) => void
  availableSlots: { time: string; professionalId: string; professionalName: string }[]
  selectedDate: string
  onBookingComplete?: () => void
}

const FILTERS: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'no-show', label: 'Faltas' },
]

export function AppointmentList({
  appointments,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onConfirm,
  onCancel,
  onMarkNoShow,
  onReschedule,
  availableSlots,
  selectedDate,
  onBookingComplete,
}: AppointmentListProps) {
  const [bookSlot, setBookSlot] = useState<{
    time: string
    professionalId: string
    professionalName: string
  } | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
        {availableSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horários Disponíveis
              </h4>
            </div>
            <div className="space-y-1.5">
              {availableSlots.map((slot) => (
                <button
                  key={`${slot.time}-${slot.professionalId}`}
                  onClick={() => setBookSlot(slot)}
                  className="w-full flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-left hover:bg-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block">{slot.time}</span>
                    <span className="text-xs text-muted-foreground">{slot.professionalName}</span>
                  </div>
                  <span className="text-xs font-medium text-primary">Reservar</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onStatusFilterChange(f.value)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">Nenhum agendamento</p>
            <p className="text-xs text-muted-foreground mt-1">
              {statusFilter !== 'all'
                ? 'Nenhum agendamento com este status.'
                : 'Nenhum agendamento para esta data.'}
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {appointments.map((app, i) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                index={i}
                onConfirm={onConfirm}
                onCancel={onCancel}
                onMarkNoShow={onMarkNoShow}
                onReschedule={onReschedule}
              />
            ))}
          </motion.div>
        )}
      </div>

      {bookSlot && (
        <BookSlotDialog
          isOpen={!!bookSlot}
          onClose={() => setBookSlot(null)}
          slotTime={bookSlot.time}
          slotProfessionalId={bookSlot.professionalId}
          slotProfessionalName={bookSlot.professionalName}
          selectedDate={selectedDate}
          onSuccess={onBookingComplete}
        />
      )}
    </>
  )
}
