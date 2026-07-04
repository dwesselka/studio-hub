import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import { CalendarHeader } from '@/features/agenda/components/calendar-header'
import { TimeLine } from '@/features/agenda/components/time-line'
import { AppointmentList } from '@/features/agenda/components/appointment-list'
import { NewAppointmentDialog } from '@/features/agenda/components/new-appointment-dialog'
import { RescheduleDialog } from '@/features/agenda/components/reschedule-dialog'
import {
  useAgendaData,
  useConfirmAppointment,
  useCancelAppointment,
  useMarkNoShow,
} from '@/features/agenda/hooks/use-agenda-data'
import { useAuth } from '@/features/auth/use-auth'
import type { CalendarView, AppointmentStatus, Appointment } from '@/features/agenda/types'
import { getDateString, addDays, getDayOfWeek } from '@/features/agenda/types'

function generateAvailableSlots(
  date: string,
  appointments: { startTime: string; endTime: string; professionalId: string; status: string }[],
  services: { id: string; duration: number }[],
  team: { id: string; name: string }[],
): { time: string; professionalId: string; professionalName: string }[] {
  const dayOfWeek = getDayOfWeek(date)
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
  if (!hours || !hours.isOpen || team.length === 0 || services.length === 0) return []

  const minDuration = Math.min(...services.map((s) => s.duration))
  const [openH, openM] = hours.openTime.split(':').map(Number)
  const [closeH, closeM] = hours.closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const slots: { time: string; professionalId: string; professionalName: string }[] = []

  for (const pro of team) {
    for (let m = openMinutes; m + minDuration <= closeMinutes; m += 30) {
      const startH = Math.floor(m / 60)
      const startM = m % 60
      const endM = m + minDuration
      const endH = Math.floor(endM / 60)
      const endMin = endM % 60
      const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`
      const endTime = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

      const conflict = appointments.some(
        (a) =>
          a.professionalId === pro.id &&
          a.status !== 'cancelled' &&
          startTime < a.endTime &&
          endTime > a.startTime,
      )
      if (!conflict) {
        slots.push({ time: startTime, professionalId: pro.id, professionalName: pro.name })
      }
    }
  }

  return slots.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 20)
}

export function AgendaPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const { user } = useAuth()

  const [currentDate, setCurrentDate] = useState(getDateString())
  const [view, setView] = useState<CalendarView>('day')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null)

  const filters = { date: currentDate, view, status: statusFilter }
  const { data: appointments = [], isLoading, isError, refetch } = useAgendaData(filters)
  const confirmMutation = useConfirmAppointment()
  const cancelMutation = useCancelAppointment()
  const noShowMutation = useMarkNoShow()

  const availableSlots = useMemo(() => {
    const s = user?.onboardingData?.services ?? []
    const t = user?.onboardingData?.team ?? []
    return generateAvailableSlots(currentDate, appointments, s, t)
  }, [currentDate, appointments, user?.onboardingData?.services, user?.onboardingData?.team])

  const handlePrev = useCallback(() => {
    setCurrentDate((d) => addDays(d, -1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentDate((d) => addDays(d, 1))
  }, [])

  const handleToday = useCallback(() => {
    setCurrentDate(getDateString())
  }, [])

  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView)
  }, [])

  const handleConfirm = useCallback(
    (id: string) => {
      confirmMutation.mutate(id)
    },
    [confirmMutation],
  )

  const handleCancel = useCallback(
    (id: string) => {
      cancelMutation.mutate(id)
    },
    [cancelMutation],
  )

  const handleMarkNoShow = useCallback(
    (id: string) => {
      noShowMutation.mutate(id)
    },
    [noShowMutation],
  )

  const handleReschedule = useCallback((appointment: Appointment) => {
    setRescheduleAppointment(appointment)
  }, [])

  const handleBookingComplete = useCallback(() => {
    refetch()
  }, [refetch])

  if (!online) {
    return <OfflineState />
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Agendamentos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os agendamentos do seu negócio
          </p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="btn btn--primary btn--lg gap-2">
          <Plus className="h-5 w-5" />
          Novo Agendamento
        </button>
      </div>

      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <TimeLine appointments={appointments} date={currentDate} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Agenda do Dia</h3>
            <AppointmentList
              appointments={appointments}
              isLoading={isLoading}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onMarkNoShow={handleMarkNoShow}
              onReschedule={handleReschedule}
              availableSlots={availableSlots}
              selectedDate={currentDate}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>
      </div>

      <NewAppointmentDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedDate={currentDate}
      />

      <RescheduleDialog
        appointment={rescheduleAppointment}
        isOpen={rescheduleAppointment !== null}
        onClose={() => setRescheduleAppointment(null)}
      />
    </motion.div>
  )
}
