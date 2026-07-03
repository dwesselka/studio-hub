import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import { AppointmentCard } from './appointment-card'
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
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">Nenhum agendamento</p>
        <p className="text-xs text-muted-foreground mt-1">
          {statusFilter !== 'all'
            ? 'Nenhum agendamento com este status.'
            : 'Nenhum agendamento para esta data.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
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
    </div>
  )
}
